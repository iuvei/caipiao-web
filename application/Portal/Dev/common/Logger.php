<?php
class Logger {
    
    // 核心错误，需要重视log中的核心错误数量
    const TYPE_LOGIC_EXCEPTION = 'LOGIC_EXCEPTION';
    const TYPE_ERROR_NETWORK   = 'ERROR_NETWORK';
    const TYPE_ERROR_DATABASE  = 'ERROR_DATABASE';
    const TYPE_ERROR_CONFIG    = 'ERROR_CONFIG';
    // library公共件的错误
    const TYPE_ERROR_LIBRARY   = 'ERROR_LIBRARY';
    
    // 信息
    // 工具类产生的
    const TYPE_INFO_LIBRARY    = 'INFO_LIBRARY';
    // 隐私信息
    const TYPE_INFO_PRIVATE    = 'INFO_PRIVATE';

    public static $core_prefix = array('ERROR_', 'CORE_');
    public static $info_prefix = array('INFO_');
    public static $save_path = '';
    private static $log_write_buffer = [];


    public static function init() {
        static $inited;
        if ($inited) {
            return;
        }
        $inited = true;

        // 在处理日志的时候，还原时区
        DEFINED_TIMEZONE != date_default_timezone_get() && date_default_timezone_set(DEFINED_TIMEZONE);
        // 定义目录位置
        self::$save_path = DEV_DATA_PATH . 'log/';
        // @todo: 把一定时间前的日志打包转移，目前仅删除
        self::deleteByDate(date('Ymd', time() - 3 * 30 * 86400));
        // 注册日志统一收集
        register_shutdown_function(array('Logger', 'flushToDisk'));
    }

    public static function logicException($flag, $content = '') {
        self::write(self::TYPE_LOGIC_EXCEPTION, $flag, $content);
    }

    public static function networkError($flag, $content = '') {
        self::write(self::TYPE_ERROR_NETWORK, $flag, $content);
    }

    public static function privateInfo($flag, $content = '') {
        self::write(self::TYPE_INFO_PRIVATE, $flag, $content);
    }

    public static function libraryInfo($flag, $content = '') {
        self::write(self::TYPE_INFO_LIBRARY, $flag, $content);
    }

    public static function deleteByDate($date) {
        $save_path = self::$save_path;
        if (is_dir($save_path . $date)) {
            File::deleteDir($save_path . $date);
            self::libraryInfo(__METHOD__, '已删除日志目录：' . File::trimRootPath($save_path . $date));
        }
    }

    public static function write($log_file_name, $flag, $content = '') {
        // echo $content;// debug
        if (!is_scalar($content)) {
            $content = print_r($content, true);
        }
        $save_path = self::$save_path;
        $date_today = date('Ymd', time());
        if ($log_file_name == '_') {
            $log_file_name = 'nil_nil';
        }
        $flag = str_replace(array(' ', '"', '\'', '\\'), '_', $flag);
        $file = $save_path . $date_today . '/' . $log_file_name . '.log';
        // echo $file . "\n";
        $final_content  = "\n";
        $client_ip = Request::getClientIp();
        $server_ip = Request::getServerIp();
        $final_content .= date('Y-m-d H:i:s') . "\t" . $flag . "\t" . $client_ip . "\t" . $server_ip . "\t" . system_run_time() . "\t" . $content;
        isset(self::$log_write_buffer[$file]) || self::$log_write_buffer[$file] = '';
        self::$log_write_buffer[$file] .= $final_content;
        // 如果是CLI模式，则直接写日志
        PHP_SAPI == 'cli' && self::flushToDisk();
    }



    public static function generateMonitDataByDate($date) {
        $dir = self::$save_path . $date;
        $log_file_list = array();
        $final = array();
        // 过滤掉的文件名
        $filter = array('.', '..');
        if (!is_dir($dir)) {
            return $final;
        }

        // 得到并精选log文件列表
        $files = scandir($dir);
        // deb($files);
        if (!is_array($files)) {
            return;
        }
        foreach ($files as $v) {
            if ( !in_array(_strtolower($v), $filter, TRUE) ) {
                $absolute_path = $dir . '/' . $v;
                if (is_file($absolute_path) && _strtolower(substr($v, -4)) == '.log') {
                    $log_file_list[] = $absolute_path;
                }
            }
        }

        // 对每个log文件解析
        $final['date'] = $date;
        $final['count_type'] = 0;
        $final['count_line'] = 0;
        $final['count_core_line'] = 0;
        $final['count_info_line'] = 0;
        $final['count_byte'] = 0;
        $final['extension'] = array();
        foreach ($log_file_list as $v) {
            $final['count_type']++;
            $content = file_get_contents($v);
            $current_filesize = filesize($v);
            $final['count_byte'] += $current_filesize;
            $log_extension_data = array(
                'file_path' => $v,
                'file_name' => basename($v),
                'file_size' => $current_filesize,
                'file_line' => 0,
                'file_spec' => array(),
            );
            if (preg_match_all(self::getLogPattern(), $content, $matches)) {
                $match_count_line = count(array_shift($matches));// 这里出栈了
                $final['count_line'] += $match_count_line;
                $log_extension_data['file_line'] = $match_count_line;
                // 内核日志要统计
                $is_core_line = false;
                foreach (self::$core_prefix as $prefix) {
                    $is_core_line = substr_compare($prefix, basename($v), 0, strlen($prefix)) === 0;
                    if ($is_core_line) {
                        break;
                    }
                }
                if (self::isPrefixInArray(basename($v), self::$core_prefix)) {
                    $final['count_core_line'] += $match_count_line;
                } elseif (self::isPrefixInArray(basename($v), self::$info_prefix)) {
                    $final['count_info_line'] += $match_count_line;
                }
                if ($match_count_line > 0) {
                    $file_spec_data = array(
                        'datetime_begin_end' => array(),
                        'flag_count' => array(),
                        'client_ip_count' => array(),
                        'server_ip_count' => array(),
                        'runtime_count' => array(),
                    );
                    // 日期
                    $datetime_data = array_shift($matches);
                    $file_spec_data['datetime_begin_end'] = array(array_shift($datetime_data), array_pop($datetime_data));
                    // flag
                    $spec_type_arr = array('flag_count', 'client_ip_count', 'server_ip_count', 'runtime_count');
                    foreach ($spec_type_arr as $vv) {
                        $specify_data = array_shift($matches);
                        if ($vv == 'client_ip_count') {
                            // 客户端ip聚类到前两段
                            foreach ($specify_data as $kkk => $vvv) {
                                list($ip_clust1, $ip_clust2, $ip_clust3) = explode('.', $vvv, 3);
                                $specify_data[$kkk] = $ip_clust1 . '.' . $ip_clust2 . '.~';
                            }
                        } elseif ($vv == 'runtime_count') {
                            // 运行时间聚类到一定数量以内
                            $time_total = count($specify_data);
                            $tima_max = max($specify_data);
                            $time_piece = 20;
                            if ($time_total > $time_piece && $tima_max > $time_piece * 5) {
                                $time_block = ceil($tima_max / $time_piece);
                                $time_piece_map = [];
                                for ($i = 0; $i < $time_piece; $i++) {
                                    $time_piece_map[] = ($i * $time_block) . " ~ " . (($i + 1) * $time_block);
                                }
                                foreach ($specify_data as $kkk => $vvv) {
                                    $time_piece_index = floor($vvv / $time_block);
                                    $specify_data[$kkk] = $time_piece_map[$time_piece_index];
                                }
                            } else {
                                // 直接聚合了
                                foreach ($specify_data as $kkk => $vvv) {
                                    $specify_data[$kkk] = format_float($vvv);
                                }
                            }
                        }
                        $file_spec_data[$vv] = self::getLogSpecifyCount($specify_data);
                    }

                    $log_extension_data['file_spec'] = $file_spec_data;
                }
            }
            $final['extension'][] = $log_extension_data;
        }

        return $final;
    }

    private static function isPrefixInArray($needle, $haystack = array()) {
        foreach ($haystack as $prefix) {
            if (substr_compare($prefix, $needle, 0, strlen($prefix)) === 0) {
                return true;
            }
        }
        return false;
    }

    private static function getLogPattern() {
        $datetime = '\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}';
        $flag     = '[^\t]+';
        $ip       = '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';
        $runtime  = '\d+\.\d+';
        $content  = '.*?';
        $final = '/^(' . $datetime . ')\t(' . $flag . ')\t(' . $ip . ')\t(' . $ip . ')\t(' . $runtime . ')\t(' . $content . ')$/ms';
        return $final;
    }

    private static function getLogSpecifyCount($data_array) {
        $final = array();
        foreach ($data_array as $v) {
            $key = $v;
            if (!isset($final[$key])) {
                $final[$key] = 0;
            }
            $final[$key]++;
        }
        arsort($final);
        return $final;
    }

    /**
     * 统一将日志写入磁盘
     */
    public static function flushToDisk() {
        // 可能是在缓冲区内才注册这个方法，则将内容输出（也可能没有，加上@）
        @ob_end_flush();
        // print_r(self::$log_write_buffer);exit;
        foreach (self::$log_write_buffer as $file => $content) {
            // 默认创建的文件，使用777，以便于命令行和web都能写同一log
            is_dir(dirname($file)) || File::createDir(dirname($file));
            is_file($file) || (touch($file) && chmod($file, 0777));
            file_put_contents($file, $content, FILE_APPEND | LOCK_EX);
        }
        self::$log_write_buffer = [];
    }
}
