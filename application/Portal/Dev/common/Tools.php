<?php

class Tools {
    public static $last_json_decoded = null;

    // 调试头大小，最大128KB
    private static $debug_head_size = 131072;


    public static function isInInterval($key, $interval = 60, $max_times = 1) {
        $count = (int)RedisCache::get($key);
        if ($count >= $max_times) {
            return true;
        }
        RedisCache::set($key, $count + 1, $interval);
        return false;
    }

    /**
     * 是否是json串
     */
    public static function isJson($string) {
        $final = false;
        if (is_string($string)) {
            self::$last_json_decoded = @json_decode($string, true);
            $final = (json_last_error() == JSON_ERROR_NONE);
        }
        return $final;
    }

    /**
     * 是否是序列化串/可以反序列化
     */
    public static function isSerialized( $data, $strict = true) {
        // if it isn't a string, it isn't serialized
        if ( ! is_string( $data ) )
            return false;
        $data = trim( $data );
         if ( 'N;' == $data )
            return true;
        $length = strlen( $data );
        if ( $length < 4 )
            return false;
        if ( ':' !== $data[1] )
            return false;
        if ( $strict ) {//output
            $lastc = $data[ $length - 1 ];
            if ( ';' !== $lastc && '}' !== $lastc )
                return false;
        } else {//input
            $semicolon = strpos( $data, ';' );
            $brace     = strpos( $data, '}' );
            // Either ; or } must exist.
            if ( false === $semicolon && false === $brace )
                return false;
            // But neither must be in the first X characters.
            if ( false !== $semicolon && $semicolon < 3 )
                return false;
            if ( false !== $brace && $brace < 4 )
                return false;
        }
        $token = $data[0];
        switch ( $token ) {
            case 's':
                if ( $strict ) {
                    if ( '"' !== $data[ $length - 2 ] )
                        return false;
                } elseif ( false === strpos( $data, '"' ) ) {
                    return false;
                }
            case 'a':
            case 'O':
                echo "a";
                return (bool) preg_match( "/^{$token}:[0-9]+:/s", $data );
            case 'b':
            case 'i':
            case 'd':
                $end = $strict ? '$' : '';
                return (bool) preg_match( "/^{$token}:[0-9.E-]+;$end/", $data );
        }
        return false;
    }

    /**
     * 返回diff结果
     * 
     * @param  string $left
     * @param  string $right
     * @param  string $type
     * @return string
     */
    public static function diffString($left, $right, $type = 'unified') {
        $lib_path = LIBRARY_PATH . 'vendor/php-diff/';
        require_once $lib_path . 'Diff.php';
        require_once $lib_path . 'Diff/Renderer/Text/Unified.php';

        $diff = new Diff(explode("\n", $left), explode("\n", $right));
        $renderer = new Diff_Renderer_Text_Unified;
        return $diff->render($renderer);
    }

    /**
     * 对Unicode字符进行解码
     * @param  [type] $string [description]
     * @return [type]         [description]
     */
    public static function decodeUnicode($string) {
        $unicode_decode = preg_replace_callback('/\\\\u([0-9a-f]{4})/i', function($match) {
            return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UCS-2BE');
        }, $string);
        return $unicode_decode;
    }

    /**
     * 返回当前月份(如：201511)的起始、结束时间
     */
    public static function getMonthBeginEndTime($month = null) {
        $month = $month ?: date('Ym');
        if (strlen($month) == 6) {
            $begin_time = strtotime($month . '01');
        } else {
            $begin_time = strtotime($month);
        }
        $final = array(
            'begin' => $begin_time,
            'end'   => strtotime('+1 month', $begin_time),
        );
        return $final;
    }

    /**
     * 返回周的开始时间
     *
     * @param int 时间戳
     * @param int 周开始日，0 表示周末，1-6 表示周一到周六
     */
    public static function getWeekBeginTime($time = null, $week_begin = 0){
        $time = $time ?: time();
        $week_begin = $week_begin <= 6 && $week_begin >= 0 ? $week_begin : 0;
        $begin_time = $time;
        while(date('w', $begin_time) != $week_begin){
            $begin_time = $begin_time - 86400;
        }
        return strtotime(date('Y-m-d', $begin_time));
    }

    /**
     * 经过严格模式转换的json，可直接使用此方法转回数组
     * @param string $str
     * @return array
     */
    public static function decodeJson($str) {
        return json_decode($str, true);
    }

    /**
     * 严格模式的json_encode
     * @param mixed $a
     * @return string
     */
    public static function encodeJson($a = false) {
        if (is_null($a)) {
            return 'null';
        }
        if (is_array($a) && empty($a)) {
            return '{}';
        }
        if ($a === false) {
            return 'false';
        }
        if ($a === true) {
            return 'true';
        }
        if (is_scalar($a)) {
            if (is_float($a)) {
                return floatval(str_replace(',', '.', strval($a)));
            }
            if (is_string($a)) {
                static $json_replaces = array(
                    array("\\", "/", "\n", "\t", "\r", "\b", "\f", '"'), 
                    array('\\\\', '\\/', '\\n', '\\t', '\\r', '\\b', '\\f', '\"'),
                );
                return '"' . str_replace($json_replaces[0], $json_replaces[1], $a) . '"';
            } else {
                return $a;
            }
        }
        $is_list = true;
        for ($i = 0, reset($a); $i < count($a); $i++, next($a)) {
            if (key($a) !== $i) {
                $is_list = false;
                break;
            }
        }
        $result = array();
        if ($is_list) {
            foreach ($a as $v) {
                $result[] = self::encodeJson($v);
            }
            return '[' . join(',', $result) . ']';
        } else {
            foreach ($a as $k => $v) {
                $key = is_string($k) ? self::encodeJson($k) : "\"{$k}\"";
                $result[] = $key . ':' . self::encodeJson($v);
            }
            return '{' . join(',', $result) . '}';
        }
    }

    /**
     * 返回字符串的html占位宽度
     */
    public static function getStringPlacementLength($str) {
        return (strlen($str) + mb_strlen($str, 'UTF8')) / 2;
    }

    /**
     * 使用工具抛出异常，统一入口
     */
    public static function throwException($msg = null, $code = Code::SYSTEM_EXCEPTION, $data = []) {
        $msg = $msg ?: l('错误：系统执行异常，请重试');
        $data && Context::set('response_exception_data', $data);
        throw new Exception($msg, $code);
    }

    /**
     * 返回当前上下文定义的变量
     */
    public static function globalvars() {
        $result = [];
        $skip = ['GLOBALS','_ENV','HTTP_ENV_VARS',
                    '_POST','HTTP_POST_VARS','_GET',
                    'HTTP_GET_VARS', '_COOKIE',
                    'HTTP_COOKIE_VARS','_SERVER',
                    'HTTP_SERVER_VARS',
                    '_FILES','HTTP_POST_FILES',
                    '_REQUEST','HTTP_SESSION_VARS',
                    '_SESSION'];
        foreach ($GLOBALS as $k => $v) {
            if (!in_array($k, $skip)) {
                $result[$k] = $v;
            }
        }
        return $result;
    }

    /**
     * 更换数组键名，而不改变顺序
     * 
     * @param  array  $array    要处理的数组
     * @param  string $key_old  旧的键名
     * @param  string $key_new  新的键名
     * @return array
     */
    public static function replaceArrayKeyName($array, $key_old, $key_new) {
        $keys = array_keys($array);
        $index = array_search($key_old, $keys, true);

        if ($index !== false) {
            $keys[$index] = $key_new;
            $array = array_combine($keys, $array);
        }

        return $array;
    }

    /**
     * 返回静态资源服务器URL
     */
    public static function getStaticServer($fname = null) {
        // 不需要强行返回主域下的数据，方便分站
        // return substr(ROOT_URL, 0, -1);
        return '';
    }
}
