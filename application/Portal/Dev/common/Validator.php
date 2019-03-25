<?php

/**
 * 参数校验类
 */
class Validator {
    const REGEXP_URL = '/^https?:\/\/([a-zA-Z0-9\-]+\.)+([a-zA-Z]{2,4})(\/?[a-zA-Z0-9`~!@#%&_=;\$\^\*\(\)\-\+\{\}\[\]\:\,\.\?\/\|]*)?$/';
    const REGEXP_URL_ALLOW_IP = '/^https?:\/\/((([a-zA-Z0-9\-]+\.)+([a-zA-Z]{2,4}))|((\d{1,3}\.){3}\d{1,3}(:\d{1,5})?))(\/?[a-zA-Z0-9`~!@#%&_=;\$\^\*\(\)\-\+\{\}\[\]\:\,\.\?\/\|]*)?$/';
    const REGEXP_EMAIL = '/^\w+([\-\+\.]\w+)*@\w+([\-\.]\w+)*\.\w+([\-\.]\w+)*$/i';
    const REGEXP_TELEPHONE = '/^\+?([0-9]{2,3})?\-?[0-9]{3,4}\-?[0-9]{6,8}(\-[0-9]{1,8})?$/';
    const REGEXP_PHONENUMBER = '/(^\+?([0-9]{2,3})?\-?[0-9]{3,4}\-?[0-9]{6,8}(\-[0-9]{1,8})?$)|(^1[34578][0-9]{9}$)/';
    const REGEXP_MOBILEPHONE = '/^1[34578][0-9]{9}$/';
    const REGEXP_DATE ='/^\d{4}\-\d{2}\-\d{2}$/';
    const REGEXP_IPV4 = '/^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/';
    const REGEXP_IDCARD = '/(^(\d{15}|\d{18}|\d{17}(x|X))$)/';
    const REGEXP_CORPORATE_REG_NO = '/^[a-z0-9-]{1,18}$/i';
    const REGEXP_MONETARY_AMOUNT = '/^\d+(\.\d{1,2})?$/';
    const REGEXP_PLAIN_TEXT = '/[<|>|\'|"|&|\r|\n]+/';
    const REGEXP_CAR_NUMBER = '/^[\x{4e00}-\x{9fa5}|a-zA-Z]{2}[\s]{0,1}[0-9a-zA-Z]{5,7}$/u';
    const REGEXP_UNLIMITED_STRING = '/.*/';
    const REGEXP_FLOAT = '/^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/';


    public static function check($pd, $name, $type, $message, $extension = []) {
        $field = (empty($extension['field_prefix']) ? '' : $extension['field_prefix']) . $name;
        $required_and_not_set = isset($extension['required']) && $extension['required'] && !isset($pd[$name]);
        $not_allow_empty_but_empty = (!isset($extension['allow_empty']) || !$extension['allow_empty']) && strlen($pd[$name]) == 0;
        if ($required_and_not_set || $not_allow_empty_but_empty) {
            $field_name = !empty($extension['field_name']) ? $extension['field_name'] : $field;
            Tools::throwException(l('请填写') . $field_name, Code::PARAM_INVALID, ['field' => $field]);
        }
        switch ($type) {
            case 'enum':
                if (isset($pd[$name]) && !in_array($pd[$name], $extension['enum'])) {
                    Tools::throwException($message, Code::PARAM_NOT_IN_ENUM_LIST, ['field' => $field]);
                }
                break;
            
            default:
                $function = 'Validator::' . Router::lineToHump($type);
                if (isset($pd[$name]) && is_callable($function)) {
                    $params = [$pd[$name]];
                    if (isset($extension[0]) && isset($extension[1])) {
                        $params = [$pd[$name], $extension[0], $extension[1]];
                    } elseif (isset($extension[0])) {
                        $params = [$pd[$name], $extension[0]];
                    }
                    if (isset($pd[$name]) && !call_user_func_array($function, $params)) {
                        Tools::throwException($message, Code::PARAM_INVALID, ['field' => $field]);
                    }
                }
                break;
        }
    }

    public static function isUtf8($string) {
        return mb_detect_encoding($string, 'UTF-8') === 'UTF-8' || preg_match('%^(?:
        [\x09\x0A\x0D\x20-\x7E] # ASCII
        | [\xC2-\xDF][\x80-\xBF] # non-overlong 2-byte
        | \xE0[\xA0-\xBF][\x80-\xBF] # excluding overlongs
        | [\xE1-\xEC\xEE\xEF][\x80-\xBF]{2} # straight 3-byte
        | \xED[\x80-\x9F][\x80-\xBF] # excluding surrogates
        | \xF0[\x90-\xBF][\x80-\xBF]{2} # planes 1-3
        | [\xF1-\xF3][\x80-\xBF]{3} # planes 4-15
        | \xF4[\x80-\x8F][\x80-\xBF]{2} # plane 16
        )*$%xs', $string);
    }

    public static function isMatchAppModAct($match_list) {
        $final = false;
        $app = app();
        $mod = mod();
        $act = act();
        foreach ($match_list as $path) {
            $path = strtr($path, '-', '_');
            $part = explode('/', $path);
            if (isset($part[2])) {
                $final = ($part[2] == $act && $part[1] == $mod && $part[0] == $app);
            } elseif (isset($part[1])) {
                $final = ($part[1] == $mod && $part[0] == $app);
            } elseif (isset($part[0])) {
                $final = ($part[0] == $app);
            }
            if ($final === true) {
                break;
            }
        }
        return $final;
    }

    public static function isMatchModAct($match_list) {
        $final = false;
        $mod = mod();
        $act = act();
        foreach ($match_list as $path) {
            $path = strtr($path, '-', '_');
            $part = explode('/', $path);
            if (isset($part[1])) {
                $final = ($part[1] == $act && $part[0] == $mod);
            } elseif (isset($part[0])) {
                $final = ($part[0] == $mod);
            }
            if ($final === true) {
                break;
            }
        }
        return $final;
    }

    public static function string($string, $min = 0, $max = 200) {
        return is_string($string) && strlen($string) >= $min && strlen($string) <= $max;
    }

    public static function textCount($string, $min = 0, $max = 100) {
        return is_string($string) && mb_strlen($string, 'utf-8') >= $min && mb_strlen($string, 'utf-8') <= $max;
    }

    public static function numbericString($string, $min = 0, $max = 100) {
        return is_numeric($string) && strlen($string) >= $min && strlen($string) <= $max;
    }

    public static function plainText($string) {
        return is_string($string) && preg_match(self::REGEXP_PLAIN_TEXT, $string) !== 1;
    }

    public static function number($number, $min = 0, $max = ID_MAX) {
        return is_numeric($number) && $number >= $min && $number <= $max;
    }

    public static function jsonArray($param) {
        return strncmp($param, '[', 1) === 0 && Tools::isJson($param);
    }

    public static function jsonStruct($param) {
        return strncmp($param, '{', 1) === 0 && Tools::isJson($param);
    }

    public static function arrayCount($array, $min = 0, $max = ID_MAX) {
        if (!is_array($array)) {
            return false;
        }
        $number = count($array);
        return $number >= $min && $number <= $max;
    }

    public static function mobile($mobile) {
        return preg_match(self::REGEXP_MOBILEPHONE, $mobile) === 1;
    }

    public static function phoneLoose($phone) {
        return self::string($phone, 7, 14) && preg_match(self::REGEXP_PHONENUMBER, $phone) === 1;
    }

    public static function email($email) {
        $is_valid = true;
        $at_index = strrpos($email, "@");
        if (is_bool($at_index) && !$at_index) {
            $is_valid = false;
        } else {
            $domain = substr($email, $at_index + 1);
            $local = substr($email, 0, $at_index);
            $local_len = strlen($local);
            $domain_len = strlen($domain);
            if ($local_len < 1 || $local_len > 64) {
                // local part length exceeded
                $is_valid = false;
            } elseif ($domain_len < 1 || $domain_len > 255) {
                // domain part length exceeded
                $is_valid = false;
            } elseif ($local[0] == '.' || $local[$local_len - 1] == '.') {
                // local part starts or ends with '.'
                $is_valid = false;
            } elseif (preg_match('/\\.\\./', $local)) {
                // local part has two consecutive dots
                $is_valid = false;
            } elseif (!preg_match('/^[A-Za-z0-9\\-\\.]+$/', $domain)) {
                // character not valid in domain part
                $is_valid = false;
            } elseif (preg_match('/\\.\\./', $domain)) {
                // domain part has two consecutive dots
                $is_valid = false;
            } elseif(!preg_match('/^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$/', str_replace("\\\\","",$local))) {
                // character not valid in local part unless
                // local part is quoted
                if (!preg_match('/^"(\\\\"|[^"])+"$/', str_replace("\\\\", "", $local))) {
                    $is_valid = false;
                }
            }

            // 强制使用xxx@aa.bb这种形式的地址作为email
            if (!preg_match('/^[A-Za-z0-9-]{1,200}\.[A-Za-z0-9]{1,20}$/i', $domain)) {
                $is_valid = false;
            }
            // NOTICE: this need network time
            /*
            if ($is_valid && !(checkdnsrr($domain,"MX") || checkdnsrr($domain,"A"))) {
                // domain not found in DNS
                $is_valid = false;
            }
            */
        }
        return $is_valid;
    }

    public static function file($file, $prefix = null, $suffix = null) {
        $is_valid = true;
        if (substr_count($file, '..') > 0) {
            // 不能有..等路径
            $is_valid = false;
        } elseif ($prefix !== null && strncmp($file, $prefix, strlen($prefix)) !== 0) {
            // 校验前缀
            $is_valid = false;
        } elseif ($suffix !== null && substr($file, 0 - strlen($suffix)) !== $suffix) {
            // 校验后缀
            $is_valid = false;
        }
        return $is_valid;
    }

    public static function isInnerUrl($url) {
        $final = false;
        $url = (string)$url;
        if (strlen($url) == 0) {
            return $final;
        }
        if (strncmp($url, ROOT_URL, strlen(ROOT_URL)) === 0
         || strncmp($url, ROOT_URL_PATH, strlen(ROOT_URL_PATH)) === 0) {
            $final = true;
        }
        return $final;
    }

    /**
     * 是否是url
     * 
     * @param  string $url
     * @return bool
     */
    public static function url($url) {
        return filter_var($url, FILTER_VALIDATE_URL) !== false && preg_match(self::REGEXP_URL_ALLOW_IP, $url) === 1;
    }

    /**
     * 检查 ip
     * @param  string $ip
     * @return bool
     */
    public static function ip($ip) {
        $ip = trim($ip);
        $pt = '/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/';
        if (preg_match($pt, $ip) === 1) {
            return true;
        }
        return false;
    }

    /**
     * 车牌号
     * 
     * @param  string $car_number 车牌号
     * @return bool
     */
    public static function carNumber($car_number) {
        return preg_match(self::REGEXP_CAR_NUMBER, $car_number) === 1;
    }

    /**
     * 密码强度验证
     * 
     * @param  string  $passwd         密码
     * @param  integer $min_complexity 最低强度值
     * @return bool
     */
    public static function passwdScore($passwd, $min_complexity = 2) {
        $passwd_score = 0;
        preg_match("/[0-9]+/", $passwd) === 1 && $passwd_score++;
        preg_match("/[a-zA-Z]+/", $passwd) === 1 && $passwd_score++;
        preg_match("/[_|\-|+|=|*|!|@|#|$|%|^|&|(|)|.|,|\?|\[|\]|\/|<|>]+/", $passwd) === 1 && $passwd_score++;
        return $passwd_score >= $min_complexity;
    }

    /**
     * 身份证
     * 
     * @param  string $idcard
     * @return bool
     */
    public static function idcard($idcard) {
        return preg_match(self::REGEXP_IDCARD, $idcard) === 1;
    }

    /**
     * Luhn算法校验银行卡（信用卡/储蓄卡），参考：
     * http://www.cnblogs.com/adtuu/p/4688225.html
     * http://www.jb51.net/article/62681.htm
     *
     * @param  string $number
     * @return bool
     */
    public static function bankcard($number) {
        $str = '';
        foreach(array_reverse(str_split($number)) as $i => $c) {
            $str .= $i % 2 ? $c * 2 : $c;
        }
        return array_sum(str_split($str)) % 10 == 0;
    }
}

