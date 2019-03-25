<?php
class Context {

    protected static $config = array();


    public static function set($key, $value) {
        if (strlen($key) == 0) {
            return false;
        }
        $key = _strtolower(get_called_class()) . '_' . $key;
        // 如果中间有>号，表示多重
        $count = 0;
        if (strpos($key, '>')) {
            $d = explode('>', $key);
            $count = count($d);
            if ($count > 5) { 
                $ret = $key . '最多5层（4个>），现在有' . $count . '层';
                return $ret;
            }
        }

        switch ($count) {
            case 0:
                self::$config[$key] = $value;
                break;
            case 5:
                @self::$config[$d[0]][$d[1]][$d[2]][$d[3]][$d[4]] = $value;
                break;
            case 4:
                @self::$config[$d[0]][$d[1]][$d[2]][$d[3]] = $value;
                break;
            case 3:
                @self::$config[$d[0]][$d[1]][$d[2]] = $value;
                break;
            case 2:
                @self::$config[$d[0]][$d[1]] = $value;
                break;
            default:
                break;
        }

        return true;
    }

    public static function get($key) {
        $key = _strtolower(get_called_class()) . '_' . $key;
        // 如果中间有>号，表示多重
        $count = 0;
        if (strpos($key, '>')) {
            $d = explode('>', $key);
            $count = count($d);
            if ($count > 5) { 
                $ret = $key . '最多5层（4个>），现在有' . $count . '层';
                return $ret;
            }
        }

        switch ($count) {
            case 0:
                $ssgt = isset(self::$config[$key]) ? self::$config[$key] : null;
                break;
            case 5:
                $ssgt = @self::$config[$d[0]][$d[1]][$d[2]][$d[3]][$d[4]];
                break;
            case 4:
                $ssgt = @self::$config[$d[0]][$d[1]][$d[2]][$d[3]];
                break;
            case 3:
                $ssgt = @self::$config[$d[0]][$d[1]][$d[2]];
                break;
            case 2:
                $ssgt = @self::$config[$d[0]][$d[1]];
                break;
            default:
                break;
        }
        $ret = $ssgt;

        return $ret;
    }


    protected static function inject($config) {
        foreach ($config as $k => $v) {
            self::set($k, $v);
        }
    }

    public static function export() {
        $final = array();
        $caller_prefix = _strtolower(get_called_class()) . '_';
        if ($caller_prefix == mb_strtolower(__CLASS__) . '_') {
            $final = self::$config;
        } else {
            foreach (self::$config as $k => $v) {
                if (substr_compare($k, $caller_prefix, 0, strlen($caller_prefix)) === 0) {
                    $final[str_replace($caller_prefix, '', $k)] = $v;
                }
            }
        }
        return $final;
    }
}