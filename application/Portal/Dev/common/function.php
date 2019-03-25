<?php

// 彩种开奖时间间隔
function get_lottery_interval($lottery) {
    list($now, $next) = explode(',', $lottery['data']);
    return strtotime('2000-01-01 ' . $next) - strtotime('2000-01-01 ' . $now);
}

function get_played_id_list_by_bet_type_id($bet_type_id) {
    $map = [
        '-101'  => [17, 18, 19, 20, 21],
        '-102'  => [1, 2, 3, 4, 5, 6],
        '-1021' => [7, 8],
        '-103'  => [9, 10, 11, 12],
    ];
    return isset($map[$bet_type_id]) ? $map[$bet_type_id] : [$bet_type_id];
}

// 系统是否开奖中
function is_system_openning_reward() {
    $is_kj_cache_key = 'global_kj_is_enabled';
    $is_kj = RedisCache::get($is_kj_cache_key);
    return $is_kj != 'N';
}

// 设置系统开奖状态
function set_system_openning_reward($status = 'Y') {
    $is_kj_cache_key = 'global_kj_is_enabled';
    $status = $status == 'Y' ? 'Y' : 'N';
    return RedisCache::set($is_kj_cache_key, $status, 86400 * 365 * 10);
}

// 记录日志并输出
function malog_and_flushout($logname, $flag, $content = '') {
    if (!is_scalar($content)) {
        $content = enjson($content, 'pretty');
    }
    flush_out($flag . "\t" . $content);
    Logger::write($logname, $flag, $content);
}

// 生成N字定投注字样
function compose_bz_string($bet, $data) {
    $final = '';
    list($type,) = explode(':', $bet['bz']);
    $info = '取';
    if ($data['betnumber1'] != 'X') {
        $info .= '仟=' . $data['betnumber1'];
    }
    if ($data['betnumber2'] != 'X') {
        $info .= '佰=' . $data['betnumber2'];
    }
    if ($data['betnumber3'] != 'X') {
        $info .= '拾=' . $data['betnumber3'];
    }
    if ($data['betnumber4'] != 'X') {
        $info .= '个=' . $data['betnumber4'];
    }
    $final = $type . ':' . $info;
    return $final;
}

// 解析N字定投注内容
function parse_bz_string($bz_string, $bet_way) {
    $final = [
        'is_editable' => false,
        'betnumber1'  => '',
        'betnumber2'  => '',
        'betnumber3'  => '',
        'betnumber4'  => '',
    ];
    // 只有快选可以
    if ($bet_way != '快选') {
        return $final;
    }
    list($type, $info) = explode(':', $bz_string);
    // 排除类型
    if (!in_array($type, ['二定位', '二字定', '三定位', '三字定', '四定位', '四字定'])) {
        return $final;
    }
    // 排除详情
    if (
        strpos($info, '除') !== false || 
        strpos($info, '重') !== false || 
        strpos($info, '奖') !== false || 
        strpos($info, '和') !== false || 
        strpos($info, ':') !== false
    ) {
        return $final;
    }
    // 开始解析数值
    $info = str_replace('千=', '仟=', $info);
    $info = str_replace('百=', '佰=', $info);
    $info = str_replace('四=', '个=', $info);
    // deb($info);
    if (preg_match('/^取(仟\=([0-9]+))?(佰\=([0-9]+))?(拾\=([0-9]+))?(个\=([0-9]+))?$/', $info, $matched)) {
        // deb($matched);
        $final['is_editable'] = true;
        $final['betnumber1'] = $matched[2] ?: 'X';
        $final['betnumber2'] = $matched[4] ?: 'X';
        $final['betnumber3'] = $matched[6] ?: 'X';
        $final['betnumber4'] = $matched[8] ?: 'X';
    }
    // deb($final);
    return $final;
}

// 格式化报表数据输出
function format_report_data_result($list) {
    $final = [];
    $top_one = [];
    foreach ($list as $index => $row) {
        if ($row['AgentLevel'] == -2 && $row['CompanyID'] == 0) {
            $top_one = $row;
        } else {
            $key = $row['LoginName'] ?: 'virtual_' . $index;
            $final[$key] = fix_decimal($row, 5);
        }
    }
    if (!empty($top_one)) {
        array_unshift($final, $top_one);
    }
    $final = array_values($final);
    return $final;
}

function get_gross_list_and_count_by_cond_and_uid($cond, $uid, $page, $pagesize) {
    // include DEV_BIN_PATH . 'dataFixer/fixUserbetData.bin.php';exit;
    // print_r([$cond, $uid, $page, $pagesize]);exit;
    header("X-DEBUG-LIST-PARAMS: " . enjson(compact('cond', 'uid', 'page', 'pagesize')));
    $list = [];
    $count = 0;
    $table_prefix = 'jz_userbet';
    // $list = Devdb::selectAll("show tables LIKE '{$table_prefix}%';");
    // print_r($list);exit;
    if (!empty($cond['uid'])) {
        $uids = $cond['uid'];
    } else {
        $uids = get_user_all_son_uids($uid) ?: '0';
    }
    // 附加条件，使用Driver里的功能（需要把方法开放成public）
    $where = 'WHERE 1';
    $where_userbet = 'WHERE 1';
    $cond_userbet = $cond;
    if (!empty($cond)) {
        unset($cond['BetNumber']);
        $parser = new \Think\Db\Driver\Mysql();
        $where = $parser->parseWhere($cond);
        // 细节投注不需要uid
        unset($cond_userbet['uid']);
        $where_userbet = $parser->parseWhere($cond_userbet);
    }
    $count_sql = "SELECT DISTINCT(`uid`) FROM jz_bets {$where} AND uid IN ($uids)";
    header("X-DEBUG-COUNT-SQL: " . $count_sql);
    $uids2 = Devdb::jo($count_sql) ?: '0';
    $uid_list = explode(',', $uids2);
    $uid_list = get_array_unique_id_list($uid_list);
    if (empty($uid_list)) {
        return [$list, $count];
    }
    // 有数据则处理
    $offset = ($page - 1) * $pagesize;
    $limit = $pagesize;
    $uid_first = array_shift($uid_list);
    $base_sql = "SELECT * FROM {$table_prefix}{$uid_first} {$where_userbet}";
    foreach ($uid_list as $uid) {
        $base_sql .= " UNION ALL SELECT * FROM {$table_prefix}{$uid} {$where_userbet}";
    }
    // echo $base_sql;exit;
    // 查询
    // $base_sql .= $where_userbet;
    $count = Devdb::val("SELECT count(*) FROM ({$base_sql}) a");
    // $count_cache_key = 'cache_get_gross_count_data_' . md5($base_sql);
    // $count = FileCache::get($count_cache_key);
    // if (is_null($count)) {
    //     $count = Devdb::val("SELECT count(*) FROM ({$base_sql}) a") * 2 + 100000;
    //     FileCache::set($count_cache_key, $count, 86400);
    // }
    header("X-DEBUG-COUNT: " . $count);
    if ($count > 0) {
        $sql = "{$base_sql} ORDER BY BetInfoID DESC, BetNumber ASC LIMIT {$offset}, {$limit}";
        // echo $sql;exit;
        header("X-DEBUG-UNION-SQL: " . $sql);
        $list = Devdb::selectAll($sql);
        // 找uid并附加
        $bet_info_id_list = [];
        $bet_info_uid_list = [];
        foreach ($list as $row) {
            $bet_info_id_list[] = $row['BetInfoID'];
            $bet_info_uid_list[] = $row['uid'];
        }
        $bet_info_ids = join(',', get_array_unique_id_list($bet_info_id_list)) ?: '0';
        $bet_info_uids = join(',', get_array_unique_id_list($bet_info_uid_list)) ?: '0';
        // deb($bet_info_uids);
        $bet_info_list = Devdb::selectAll("SELECT * FROM jz_bets WHERE BetInfoID IN ({$bet_info_ids}) AND uid IN ($bet_info_uids)");
        // deb($bet_info_list);
        $map_bet_info = [];
        foreach ($bet_info_list as $row) {
            $map_bet_info[$row['uid'] . '_' . $row['BetInfoID']] = $row;
        }
        // 修正数据
        foreach ($list as &$row) {
            $bet = $map_bet_info[$row['uid'] . '_' . $row['BetInfoID']];
            $bet = array_keys_to_lowercase($bet);
            $row = array_keys_to_lowercase($row);
            $row['uid'] = $bet['uid'];
            if (empty($row['fsxx']) && empty($row['lhxx'])) {
                $row['fsxx'] = \ReportCalculator::generateFsxxForBet($bet, $row['betamount']);
                $row['lhxx'] = \ReportCalculator::generatelhxxForBet($bet, $row['betamount']);
            }
        }
    }
    // print_r($list);exit;
    return [$list, $count];
}

function array_keys_to_lowercase($row) {
    foreach ($row as $key => $value) {
        $new_key = strtolower($key);
        $row[$new_key] = $value;
        if ($new_key != $key) {
            unset($row[$key]);
        }
    }
    return $row;
}

function get_user_all_son_uids($uid, $include_self = false) {
    $final = $include_self === true ? $uid : '';
    $all = Devdb::jo("SELECT id FROM jz_user WHERE agentpath LIKE '%-{$uid}-%'") ?: '0';
    $final .= ',' . $all;
    $uid_list = explode(',', $final);
    $uid_list = get_array_unique_id_list($uid_list);
    $final = join(',', $uid_list);
    return $final;
}


function fix_decimal($numbers, $precision = 10) {
    $is_array = true;
    if (!is_array($numbers)) {
        $numbers = [$numbers];
        $is_array = false;
    }
    foreach ($numbers as &$number) {
        $number = is_numeric($number) ? (float)format_float($number, $precision) : $number;
    }
    return $is_array ? $numbers : reset($numbers);
}

function get_array_unique_id_list($list) {
    $list = array_unique($list);
    $list = array_map('intval', $list);
    $list = array_filter($list);
    $list = array_values($list);
    sort($list);
    return $list;
}

function flush_out($msg) {
    echo $msg . PHP_EOL;
    @ob_flush();
    flush();
}

function send_telegram_message($message, $receiver = '') {
    $receiver = '9qvmsm03jsyl1pa8';// 固定
    $receiver_dev = '9qvmsp1mjs1ekhrr';
    $url   = 'https://tgbot.lbyczf.com/sendMessage/' . $receiver;
    $data  = array(
        'text' => $message,
    );
    $response = curl($url, $data);
    return $response;
}

function is_mobile($user_agent = null) {
    return Request::isMobile();
}

function get_user_agent() {
    return isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
}

function format_sql_string($val, $trim = false) {
    if ($trim === true) {
        $val = trim($val);
    }
    $val = str_replace(array('\\', "\0", "\n", "\r", "'", '"', "\x00", "\x1a"), array('\\\\', '\\0', '\\n', '\\r', "\\'", '\\"', '\\Z', '\\Z'), $val);
    return $val;
}

function ok($data = [], $msg = '') {
    $final = Response::formReturnData(Code::OK, $msg, $data);
    Response::outputReturnData($final);
}

function bye($msg, $code = Code::ERROR, $data = []) {
    Tools::throwException($msg, $code, $data);
}

function br2nl($string, $limit_nl = false) {
    $string = str_replace(['<br>', '<br />', '<br/>'], "\n", (string)$string);
    $string = str_replace("\r", "\n", $string);
    while ($limit_nl && strpos($string, "\n\n") !== false) {
        $string = str_replace("\n\n", "\n", $string);
    }
    return $string;
}

function nl2p($string) {
    $final = '';
    $string = str_replace("\r", "\n", (string)$string);
    $string = str_replace("\n\n", "\n", $string);
    $arr = explode("\n", $string);
    foreach ($arr as $value) {
        $value = trim($value);
        if (empty($value)) {
            continue;
        }
        $final .= '<p>' . $value . '</p>';
    }
    return $final;
}

// 给ids 排序
function sort_ids($ids, $order = 'ASC') {
    $ids = trim($ids, ',');
    $id_list = explode(',', $ids);
    if ($order == 'ASC') {
        sort($id_list);
    } elseif ($order == 'DESC') {
        rsort($id_list);
    }
    return join(',', $id_list);
}

// 删除数组中指定值
function array_unset_value(&$array, $value) {
    foreach ($array as $key => $val) {
        if ($val==$value) {
            unset($array[$key]);
        }
    }
    return $array;
}

// it inserts a <br> tag before each newline, but it still preserves the newlines themselves
// see: http://php.net/manual/zh/function.nl2br.php#49516
function _nl2br($string, $limit_br = false) {
    $string = str_replace(array("\r\n", "\r", "\n", "\\r\\n", "\\n", "\\r"), "<br>", $string);
    while ($limit_br && strpos($string, '<br><br>') !== false) {
        $string = str_replace('<br><br>', '<br>', $string);
    }
    return $string;
}

function stripslashes_recusive($arr) {
    foreach ($arr as $k => $v) {
        if (is_array($v)) {
            $arr[$k] = stripslashes_recusive($v);
        } else {
            $arr[$k] = stripslashes($v);
        }
    }
    return $arr;
}

function parse_to_tag($map, $wrap_left = '<span>', $wrap_right = '</span>') {
    $final = '';
    foreach ($map as $key => $value) {
        $tmp_html = $wrap_left . $value . $wrap_right;
        strpos($tmp_html, '{key_b64}') !== false && $tmp_html = str_replace('{key_b64}', urlsafe_b64encode($key), $tmp_html);
        strpos($tmp_html, '{key}') !== false && $tmp_html = str_replace('{key}', $key, $tmp_html);
        strpos($tmp_html, '{value}') !== false && $tmp_html = str_replace('{value}', $value, $tmp_html);
        $final .= $tmp_html;
    }
    return $final;
}

function urlsafe_b64encode($string) {
    $data = base64_encode($string);
    $data = str_replace(array('+', '/', '='), array('-', '_', ''), $data);
    return $data;
}

function urlsafe_b64decode($string) {
    $data = str_replace(array('-', '_'), array('+', '/'), $string);
    $mod4 = strlen($data) % 4;
    if ($mod4) {
        $data .= substr('====', $mod4);
    }
    return base64_decode($data);
}



function z_js($s, $cmd = '') {
    $final = '';
    if($cmd == 'base64'){ $s = base64_encode($s); }
    $len = strlen($s);
    for($i = 0; $i < $len; $i++){
        $ascc = ord($s[$i]);
        if ($ascc > 128) {
            return '只能传入ASCII可打印字符';
        }
        $bin = decbin($ascc);
        while(strlen($bin) < 8) {
            $bin = '0' . $bin;
        }
        $final .= $bin;
    }
    $final = str_replace('0', json_decode('"\u200d"'), $final);
    $final = str_replace('1', json_decode('"\u200c"'), $final);
    // $final = json_decode($final);
    // $final = 'Function("'.$final.'".replace(/.{8}/g,function(u){return string.fromCharCode(parseInt(u.replace(/\u200c/g,1).replace(/\u200d/g,0),2))}))();';
    return $final;
}

function debug_string_backtrace($ignore_args = false) {
    ob_start();
    if ($ignore_args) {
        debug_print_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
    } else {
        debug_print_backtrace();
    }
    $trace = ob_get_contents();
    ob_end_clean();
    // change to relative path
    $trace = str_replace('\\', '/', $trace);
    $trace = File::trimRootPath($trace);
    // Remove first item from backtrace as it's this function which is redundant.
    $trace = preg_replace('/^#0\s+' . __FUNCTION__ . "[^\n]*\n/", '', $trace, 1);
    // Renumber backtrace items.
    $trace = preg_replace_callback('/^#(\d+)/m', function($m){return '#' . ($m[1] - 1);}, $trace);

    return $trace;
}

function php_is_new_version() {
    return (float)PHP_VERSION >= 5.3;
}

function get_query_string() {
    $final = '';
    if (substr_count(url(), '?')) {
        $final = end(explode('?', url(), 2));
    }
    return $final;
}


function parse_tag($tags) {
    return str_replace(',', ', ', $tags);
}

function get_cdn_url($avatar) {
    $final = Mdl_System_File::trimStaticSrc($avatar);
    if (_S('static_cdn_enable') == '1') {
        $final = CDN_STATIC_URL . substr($final, strlen(ROOT_URL_PATH . 'uploads/'));
    }
    return $final;
}

function app($url = null) {
    return Router::app($url);
}
function mod($url = null) {
    return Router::mod($url);
}
function act($url = null) {
    return Router::act($url);
}
function addition($url = null) {
    return Router::addition($url);
}

// 读写cookie
function ck($key = null, $value = false, $expired_time = null) {
    if ($key === null && $value === false) {
        return $_COOKIE;
    }
    $time = time();
    $prefix = _S('cookie_prefix');
    if (strstr($key, $prefix) === false) {
        $key = $prefix . $key;
    }

    if ($value !== false) {
        // 赋值
        $expired_time = $expired_time !== null ? $expired_time : ($time + 90 * 86400);
        setcookie($key, $value, $expired_time, _S('cookie_path'));

        if ($value === null) {
            unset($_COOKIE[$key]);
        } else {
            $_COOKIE[$key] = $value;
        }
        $ret = 1;
    } else {
        // 取值
        $ret = isset($_COOKIE[$key]) ? $_COOKIE[$key] : null;
    }
    return $ret;
}

//正确切汉字字符串函数
//$string为输入汉字，$length为数量 仅适用UTF-8
function sub_str($string, $length = 10, $append = '…', $triple = 1) {
    if (function_exists('mb_substr')) {
        $sub = mb_substr($string, 0, $length, 'utf-8');
        $needappend = $sub != $string ? $append : '';
        return $sub . $needappend;
    }
    $final = '';
    if ($triple) {
        $length *= 3;
    }
    if (strlen($string) <= $length) {
        return $string;
    } else {
        $i = 0;
        while ($i < $length) {
            $string_tmp = substr($string, $i, 1);
            if (ord($string_tmp) >= 224) {
                $string_tmp = substr($string, $i, 3);
                $i = $i + 3;
            } elseif (ord($string_tmp) >= 192) {
                $string_tmp = substr($string, $i, 2);
                $i = $i + 2;
            } else {
                $i = $i + 1;
            }
            $final .= $string_tmp;
        }
        if ($append != '') {
            $final .= $append;
        }
        return $final;
    }
}

function _strtolower($str) {
    return strtr($str, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz');
}

function _strtoupper($str) {
    return strtr($str, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
}

function get_safe_ids($ids, $type = 'int', $seperator = ',') {
    $final = '';
    if (!empty($ids)) {
        if (strstr($ids, $seperator) !== false && $type == 'int') {
            foreach (explode($seperator, $ids) as $value) {
                if ($value !== '') {
                    $final .= $seperator . $value;
                }
            }
            $final = substr($final, 1);
        } else {
            $final = trim($ids, $seperator);
        }
    }
    return $final;
}

// 业务如无必要，则禁止输入字符：<、>、'、"、&
// 如业务上确实有很充分的理由输入以上字符，则使用“运行时和存储时不过滤不转义，最终输出时进行转义”的原则
function check_safe_input($str, $mask = array()) {
    $map = array('<', '>', '\'', '"', '&');
    $mask = !empty($mask) ? $mask : (array)Context::get('safe_input_mask');
    foreach ($mask as $value) {
        if (in_array($value, $map)) {
            array_unset_value($map, $value);
        }
    }
    foreach ($map as $value) {
        if (strpos($str, $value) !== false) {
            Tools::throwException('参数错误，含有不允许的字符串：' . $value, Code::STRING_CONTAIN_INVALID_CHAR);
        }
    }
    return $str;
}

function get_safe_input($arr, $cmd = '') {
    $final = array();
    $arr = is_array($arr) ? $arr : $_POST;
    foreach ($arr as $k => $v) {
        $k = format_sql_string($k);

        if (is_array($v)) {
            $v = get_safe_input($v);
        } else {
            if ($cmd == 'htmlspecialchars') {
                $v = htmlspecialchars($v);
            }
            $v = format_sql_string($v);
        }
        $final[$k] = $v;
    }
    return $final;
}

function format_float($number, $precision = 2) {
    return number_format((float)$number, $precision, '.', '');
}

function json_get_safe_string($arr) {
    $final = array();
    foreach ((array)$arr as $k => $v) {
        $k = format_json_string($k);

        if (is_array($v)) {
            $v = json_get_safe_string($v);
        } else {
            $v = format_json_string($v);
        }
        $final[$k] = $v;
    }
    return $final;
}
function json_strip_safe_string($arr) {
    $final = array();
    foreach ($arr as $k => $v) {
        $k = unformat_json_string($k);

        if (is_array($v)) {
            $v = json_strip_safe_string($v);
        } else {
            $v = unformat_json_string($v);
        }
        $final[$k] = $v;
    }
    return $final;
}
function format_json_string($val, $cmd = null) {
    $val = trim($val);
    $val = str_replace('\\', '\\\\', $val);
    $val = str_replace('"', '\"', $val);
    $val = str_replace("\n", '\\n', $val);
    $val = str_replace("\r", '\\r', $val);
    $val = str_replace("\t", '\\t', $val);
    if ($cmd == '-html') {
        $val = str_replace(array("\t", "\n", "\r") , array("", "", ""), $val);
    }
    return $val;
}
function unformat_json_string($val) {
    $val = trim($val);
    $val = str_replace('\\\\', '\\', $val);
    $val = str_replace('\"', '"', $val);
    return $val;
}


function time_interval($iv, $precision = 2) {
    if ($iv > 86400 * 365) {
        $res = round($iv / (86400 * 365), $precision) . '年';
    } elseif ($iv > 86400) {
        $res = round($iv / 86400, $precision) . '天';
    } elseif ($iv > 3600) {
        $res = round($iv / 3600, $precision) . '小时';
    } elseif ($iv >= 0) {
        $res = round($iv / 60, $precision) . '分钟';
    } else {
        // 已过
        $res = '-' . time_interval(0 - $iv, $precision);
    }
    return $res;
}

function set_system_message($msg) {
    if ($msg == '') {
        return false;
    }
    $_SESSION['__message'] = $msg;
}

function get_system_message() {
    if (isset($_SESSION['__message'])) {
        $msg = $_SESSION['__message'];
        unset($_SESSION['__message']);
    } else {
        $msg = null;
    }
    return $msg;
}

function trd($msg, $url = null) {
    Response::tipThenRedirect($msg, $url);
}

function _S($meta, $value = false, $force_read = false) {
    return '';
    global $cfg_;
    $final = null;
    if ($meta == '') {
        return '需要指定meta名';
    }
    
    $db_name = Devdb::$prefix . 'config';
    if ($value === false) {
        // 取值
        // echo $meta . ' => ' . (int)array_key_exists($meta, $cfg_) . PHP_EOL;
        if (array_key_exists($meta, $cfg_) && $force_read === false) {
            $final = $cfg_[$meta];
        } else {
            $final = $cfg_[$meta] = Mdl_Panel_System_Configuration::get($meta);
            if ($final === null) {
                _S($meta, '[null]');
            }
        }
    } elseif ($value === null) {
        // 强制删除
        $final = Devdb::query("DELETE FROM {$db_name} WHERE `meta`='{$meta}'");
        unset($cfg_[$meta]);
    } else {
        // 设值
        // 要使用NULL来判断，可能缓存被清空时value是""
        if (Devdb::val("SELECT count(*) FROM {$db_name} WHERE `meta`='{$meta}'")) {
            $final = Devdb::query("UPDATE {$db_name} SET value='{$value}' WHERE `meta`='{$meta}'");
        } else {
            $final = Devdb::query("INSERT INTO {$db_name} (`meta`, `value`, `description`, `autoload`) VALUES ('{$meta}', '{$value}', '', '0')");
        }
        $cfg_[$meta] = $value;
    }
    return $final;
}

function curl($url, $post_data = null, $config = array()) {
    function_exists('curl_init') || exit('未开启curl扩展');

    $url_origin = $url;
    $post_data_origin = $post_data;
    $config_origin = $config;
    $ch = curl_init();
    $is_post = $post_data !== null;
    $config_default = array(
        'cookie'             => '',
        'header_ext'         => array(),
        'connect_ip'         => '',
        'timeout'            => 7,
        'write_log'          => 5,// 5KB以下，写日志并记录细节
        'empty_retry_times'  => 0,// 结果为空时重试次数
        'proxy'              => '',
        'follow_location'    => true,// 跟踪跳转
        'collect_cookie'     => '',// 收集cookie到指定cache
        'request_method'     => $is_post ? 'POST' : 'GET',// 请求方式
        'user_agent'         => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        'compress_algorithm' => 'gzip',// 压缩算法，可填gzip
        'request_id'         => Request::generateTraceId(),
    );
    // parse config
    $config     = array_merge($config_default, (array)$config);
    $cookie     = $config['cookie'];
    $header_ext = (array)$config['header_ext'];
    $connect_ip = $config['connect_ip'];
    $timeout    = (int)$config['timeout'];
    $write_log  = (int)$config['write_log'];

    $url_parsed = parse_url($url);
    if ('' != $connect_ip) {
        $query    = isset($url_parsed['query']) ? "?" . $url_parsed['query'] : '';
        $uri      = $url_parsed['path'] . $query;
        $port_str = isset($url_parsed['port']) ? ':' . $url_parsed['port'] : '';
        $url      = "{$url_parsed['scheme']}://{$connect_ip}{$port_str}{$uri}";
    }

    $header = array();
    $header[] = 'User-agent: ' . $config['user_agent'];
    $header[] = 'Cache-Control: max-age=0';
    $header[] = 'Connection: keep-alive';
    !empty($cookie) && $header[] = 'Cookie: ' . $cookie;
    $header[] = 'Host: ' . $url_parsed['host'];
    if ($is_post) {
        // $header[] = 'Content-type: application/x-www-form-urlencoded';
        // 强制让客户端不要发送Expect，不要http 1.1/ 100
        $header[] = 'Expect: ';
    }
    // header
    if (!empty($header_ext)) {
        foreach ($header_ext as $v) {
            $header[] = $v;
        }
    }
    $options = array(
      CURLOPT_HTTPHEADER     => $header,
      CURLOPT_URL            => $url,
      CURLOPT_AUTOREFERER    => true,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => false,
      CURLOPT_HEADER         => 0,
      CURLOPT_CONNECTTIMEOUT => $timeout,
      CURLOPT_TIMEOUT        => $timeout,
    );

    if ($config['follow_location']) {
        $options[CURLOPT_FOLLOWLOCATION] = true;
    }
    // HTTPS
    if ($url_parsed['scheme'] == 'https') {
        $options[CURLOPT_SSL_VERIFYPEER] = false;
        $options[CURLOPT_SSL_VERIFYHOST] = false;
    }
    // 压缩算法
    if ($config['compress_algorithm'] != '') {
        $options[CURLOPT_ENCODING] = $config['compress_algorithm'];
    }

    // POST
    if ($is_post) {
        $options[CURLOPT_POST] = true;
        $options[CURLOPT_CUSTOMREQUEST] = 'POST';
        if (is_array($post_data)) {
            $is_upload = false;
            foreach ($post_data as $post_key => $post_value) {
                if (is_string($post_value) && strncmp($post_value, '@', 1) === 0) {
                    $is_upload = true;
                    break;
                }
            }

            if ($is_upload) {
                // https://segmentfault.com/a/1190000000725185
                // 考虑 PHP 5.0~5.6 各版本兼容性的 cURL 文件上传
                if (class_exists('\CURLFile', true)) {
                    $options[CURLOPT_SAFE_UPLOAD] = true;
                    $file_path = substr($post_value, 1);
                    $post_data[$post_key] = new \CURLFile($file_path, '', basename($file_path));
                } else {
                    if (defined('CURLOPT_SAFE_UPLOAD')) {
                        $options[CURLOPT_SAFE_UPLOAD] = false;
                    }
                }
                $options[CURLOPT_POSTFIELDS] = $post_data;
            } else {
                $options[CURLOPT_POSTFIELDS] = http_build_query($post_data);
            }
        } else {
            $options[CURLOPT_POSTFIELDS] = $post_data;
        }
    }
    // 代理
    if (!empty($config['proxy'])) {
        // list($proxy_url, $proxy_port) = explode(':', $config['proxy']);
        $options[CURLOPT_PROXY] = $config['proxy'];
        //curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxyauth);
    }
    // 需要收集cookie
    if ($config['collect_cookie'] != '') {
        $options[CURLOPT_HEADER] = 1;
    }
    // print_r($options);exit;
    curl_setopt_array($ch, $options);

    $has_session = !empty($_SESSION);
    $has_session && session_write_close();

    $result = curl_exec($ch);
    if ($config['collect_cookie'] != '' && strlen($result) > 0) {
        list($header, $result) = explode("\r\n\r\n", $result, 2);
        if (preg_match_all('/Set-Cookie: (.*?);.*?/', $header, $m)) {
            $old_cookie = FileCache::get($config['collect_cookie']);
            $old_cookie_pair = array();
            if ($old_cookie) {
                $cookie_arr = explode(';', $old_cookie);
                foreach ($cookie_arr as $cookie_item) {
                    list($cookie_key, $cookie_value) = explode('=', trim($cookie_item), 2);
                    $old_cookie_pair[$cookie_key] = $cookie_value;
                }
            }
            $new_cookie_pair = array();
            foreach ($m[1] as $cookie_item) {
                list($cookie_key, $cookie_value) = explode('=', trim($cookie_item), 2);
                $new_cookie_pair[$cookie_key] = $cookie_value;
            }
            $final_cookie_pair = array_merge($old_cookie_pair, $new_cookie_pair);
            $final_cookie_tmp = array();
            foreach ($final_cookie_pair as $key => $value) {
                $final_cookie_tmp[] = $key . '=' . $value;
            }
            $final_cookie = join('; ', $final_cookie_tmp);
            FileCache::set($config['collect_cookie'], $final_cookie, 86400);
        }
    }

    // 记日志
    if ($write_log) {
        $size = format_float(strlen($result) / 1024, 3);
        $enjson_option = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
        $ext_data = array();
        $ext_data['config'] = json_encode($config, $enjson_option);
        $ext_data['header'] = json_encode($header, $enjson_option);
        $ext_data['curl_info'] = json_encode(curl_getinfo($ch), $enjson_option);
        $customered_info = array('result_size' => $size . 'KB');
        if ($size <= $write_log && $size > 0) {
            $customered_info['result_data'] = trim($result);
        }
        $ext_data['customered_info'] = $customered_info;
        if (curl_errno($ch)) {
            $ext_data['curl_error'] = curl_error($ch);
        }
        Logger::write('SYSTEM_NETWORK_CURL', $config['request_method'], array($post_data, $ext_data));
    }

    if (curl_errno($ch) && strlen($result) == 0 && $config['empty_retry_times'] > 0) {
        Logger::write('SYSTEM_NETWORK_CURL', 'WARN_RETRY_' . $config['empty_retry_times'], 'request_id: ' . $config['request_id']);
        $config_new = $config_origin;
        $config_new['empty_retry_times']--;
        $config_new['request_id'] = $config['request_id'];
        $result = curl($url_origin, $post_data_origin, $config_new);
    }

    if ($result === false) {
        $final = false;
    } else {
        $final = trim($result);
    }

    curl_close($ch);
    $has_session && session_start();
    return $final;
}

function format($o) {
    if (is_array($o)) {
        foreach ($o as $k => $v) {
            $o[$k] = format($v);
        }
        return $o;
    }
    else{
        return format_sql_string(trim(htmlspecialchars($o)));
    }
}

// 与js相关的unicode函数
function enunicode($name) {
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        $GLOBALS['PROCESSOR_ARCHITECTURE'] = 'x86';
    }
    $name = iconv('UTF-8', 'UCS-2', $name);
    $len  = strlen($name);
    $str  = '';
    for ($i = 0; $i < $len - 1; $i = $i + 2){
        // 64位 | Linux系统需要将$c和$c2调换位置 @ 2014-02-11 16:52:21
        $c  = $name[$i];
        $c2 = $name[$i + 1];
        if ($GLOBALS['PROCESSOR_ARCHITECTURE'] != 'x86') {
            $tmp = $c;
            $c = $c2;
            $c2 = $tmp;
        }
        if (ord($c) > 0){   //两个字节的文字
            $str .= '\u' . base_convert(ord($c), 10, 16) . str_pad(base_convert(ord($c2), 10, 16), 2, 0, STR_PAD_LEFT);
        } else {
            $str .= '\u' . str_pad(base_convert(ord($c2), 10, 16), 4, 0, STR_PAD_LEFT);
        }
    }
    return $str;
}
function deunicode($name) {
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        $GLOBALS['PROCESSOR_ARCHITECTURE'] = 'x86';
    }
    // 转换编码，将Unicode编码转换成可以浏览的utf-8编码
    // 改进使之适用于-和空格 @ 2014-03-17 02:39:23
    // ([\w-\s]+)|
    $pattern = '/(\\\u([\w]{4}))/i';
    preg_match_all($pattern, $name, $matches);
    if (!empty($matches)){
        // deb($matches);
        $name = '';
        for ($j = 0; $j < count($matches[0]); $j++){
            $str = $matches[0][$j];
            if (strpos($str, '\\u') === 0){
                // 64位 | Linux系统需要将$c和$c2调换位置 @ 2014-02-11 16:52:21
                $c = base_convert(substr($str, 2, 2), 16, 10);
                $c2 = base_convert(substr($str, 4), 16, 10);
                if ($GLOBALS['PROCESSOR_ARCHITECTURE'] != 'x86') {
                    $tmp = $c;
                    $c = $c2;
                    $c2 = $tmp;
                }
                $c = chr($c) . chr($c2);
                $c = iconv('UCS-2', 'UTF-8', $c);
                $name .= $c;
            }
            else{
                $name .= $str;
            }
        }
    }
    return $name;
}

// 返回当前访问的url
function url($cmd = null) {
    $s = PROTOCAL . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    if (!empty($cmd)) {
        $url_exploded = explode('?', $s, 2);
        if ($cmd == '-s') {
            // "/path/panel/system/iframe"
            $s = reset($url_exploded);
            $s = str_replace(ROOT_URL, ROOT_URL_PATH, $s);
        } elseif ($cmd == '-router') {
            // "panel/system/iframe"
            $s = reset($url_exploded);
            $s = str_replace(ROOT_URL, '', $s);
        } elseif ($cmd == '-relative') {
            // "/panel/system/iframe?name=PHPINFO&url=%2Fsystem%2Fdebug%2Fphpinfo"
            $s = str_replace(ROOT_URL, ROOT_URL_PATH, $s);
        } elseif ($cmd == '-no_query') {
            $s = reset($url_exploded);
        } elseif ($cmd == '-query_string') {
            $s = !empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : '';
        }
    }

    return $s;
}

// 返回当前访问的前一站
function referer($cmd = null) {
    return Request::referer($cmd);
}

// 循环创建文件夹
function create_folder($in_folder_path) {
    return File::createDir($in_folder_path);
}

// page time
function system_run_time($beg_time = '') {
    $beg_time = $beg_time ?: COMMON_STARTTIME;
    if (empty($beg_time)) {
        $ret = '起始时间未定义';
    } else {
        $ret = format_float(microtime(true) - $beg_time, 3);
    }
    return $ret;
}

function ua() {
    return Request::userAgent();
}

function ip() {
    return Request::getClientIp();
}

function dt($t = null) {
    // 转换成字符串形式的
    $t .= '';
    // 添加返回日期的
    if (strlen($t) == 19) {
        $t = strtotime($t);
        $s = date('Y/m/d H:i', $t);
    } elseif ($t != '') {
        $s = date('Y-m-d H:i:s', (int)$t);
    } else {
        $s = date('Y-m-d H:i:s');
    }

    return $s;
}
// 返回毫秒
function mt($precision = 2) {
    $mt = number_format(microtime(true), $precision, '.', '');
    return $mt;
}

function enxml($data, $dom = 0, $item = 0) {
    if (!$dom) {
        $dom = new DOMDocument("1.0");
    }
    if (!$item) {
        $item = $dom->createElement("root");
        $dom->appendChild($item);
    }
    foreach($data as $key => $val){
        $itemx = $dom->createElement(is_string($key)?$key:"item");
        $item->appendChild($itemx);
        if (!is_array($val)){
            $text = $dom->createTextNode($val);
            $itemx->appendChild($text);
        } else {
            enxml($val, $dom, $itemx);
        }
    }
    return $dom->saveXML();
}

// json encode
function enjson($data, $cmd = 'nomal') {
    $final = null;
    if ($cmd == 'pretty') {
        $final = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    } elseif ($cmd == 'nomal') {
        $final = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } elseif ($cmd == 'default') {
        $final = json_encode($data);
    }
    return $final;
}

// json decode
function dejson($str) {
    if (!Tools::isJson($str)) {
        $str = preg_replace("/\p{Cc}/u", '', trim($str));
    } else {
        return Tools::$last_json_decoded;
    }
    return @json_decode($str, true);
}
// debug need
function deb($o, $exit = true) {
    ob_start();
    if (is_array($o) || is_object($o)) {
        echo '<pre>';
        print_r($o);
        echo '</pre>';
    } else {
        echo $o;
    }

    $data = ob_get_clean();
    echo $data;
    if ($exit) {
        exit();
    }
}
