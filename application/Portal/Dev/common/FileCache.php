<?php
class FileCache {
    private static $save_path = '';
    private static $separator = '';


    public static function init() {
        self::$save_path = DEV_DATA_PATH . 'cache/';
        self::$separator = '#' . md5('ca' . CRYPT_SALT . 'che') . '|';
    }

    public static function autoClearExpiredCache() {
        $minute = (int)date('i');
        // 每半小时执行一次
        $actived = $minute % 30 == 0;
        if (!$actived) {
            return;
        }
        $list = File::getList(substr(self::$save_path, 0, -1));
        $expired_list = [];
        foreach ($list as $file) {
            if (!preg_match('/\.cache$/', $file)) {
                continue;
            }
            list(, $expires_at) = explode(self::$separator, file_get_contents($file), 2);
            if (time() > $expires_at) {
                unlink($file);
                $expired_list[] = File::trimRootPath($file);
            }
        }
        $expired_count = count($expired_list);
        if ($expired_count) {
            Logger::libraryInfo(__METHOD__, ' deleted expired files: ' . PHP_EOL . enjson($expired_list));
        }
    }

    /**
     * 通过前缀删除指定目录的缓存
     * 
     * @param  string $prefix 前缀，如 map_Mdl_Panel_Admin_
     * @return array 成功、失败详情
     */
    public static function deleteByPrefix($prefix) {
        $final = array(
            'succeed_list' => array(),
            'failed_list' => array(),
        );
        $list = File::getList(substr(self::$save_path, 0, -1));
        foreach ($list as $file) {
            if (strpos($file, $prefix) !== false) {
                if (unlink($file)) {
                    $final['succeed_list'][] = File::trimRootPath($file);
                } else {
                    $final['failed_list'][] = File::trimRootPath($file);
                }
            }
        }
        Logger::libraryInfo(__METHOD__, 'prefix: ' . $prefix . ', detail: ' . PHP_EOL . enjson($final));
        return $final;
    }

    public static function get($key) {
        $final = null;
        if (!empty($key)) {
            $exploded = explode(self::$separator, self::read($key), 2);
            if (count($exploded) == 2) {
                list($final, $expires_at) = $exploded;
                if (time() > $expires_at) {
                    $final = null;
                }
            }
        }
        return $final;
    }

    /**
     * 设置缓存
     * 
     * @param string $key    键
     * @param string $value  值
     * @param int    $expire 过期时间，默认3600s
     */
    public static function set($key, $value, $expire = 3600) {
        $final = 0;
        if (!empty($key)) {
            $expires_at = time() + $expire;
            $data = $value . self::$separator . $expires_at;
            $final = self::write($key, $data);
        }
        return $final;
    }


    /**
     * 私有读数据接口
     * 
     * @param  string $key 键
     * @return string      读的数据
     */
    private static function read($key) {
        $key = self::retrieveKey($key);
        $file = self::$save_path . $key . '.cache';
        return is_file($file) ? file_get_contents($file) : null;
    }

    /**
     * 私有写数据接口
     * 
     * @param  string $key   键
     * @param  string $value 写的数据
     * @return int        写的数据长度
     */
    private static function write($key, $value) {
        $key = self::retrieveKey($key);
        $file = self::$save_path . $key . '.cache';
        return file_put_contents($file, $value);
    }

    private static function retrieveKey($key) {
        return strtr($key, '/\\:', '___');
    }
}
