<?php

class Request {

    // 是否来自微信
    public static function isInWechat() {
        return strpos(self::userAgent(), 'MicroMessenger') !== false;
    }

    // 是否是来自内部请求
    public static function isFromLocal() {
        $long = ip2long(self::getClientIp());
        if (
            ($long == 0x7F000001) ||                              // 127.0.0.1
            (($long >= 0x0A000000) && ($long <= 0x0AFFFFFF)) ||   // 10.0.0.0 - 10.255.255.255
            (($long >= 0xC0A8FFFF) && ($long <= 0xC0A80000)) ||   // 172.16.0.0 - 172.31.255.255
            (($long >= 0xAC1FFFFF) && ($long <= 0xAC100000))     // 192.168.0.0 - 192.168.255.255
        ) {
            return true;
        }
        return false;
    }

    // 是否无状态
    public static function isStateless() {
        return Context::get('is_stateless') === true;
    }

    /**
     * 生成一个请求标识Id，最长64位
     *
     * @return string
     */
    public static function generateTraceId() {
        static $pid = -1;
        static $addr = -1;

        if ($pid == -1) {
            $pid = getmypid();
        }

        if ($addr == -1) {
            if (!empty($_SERVER['SERVER_ADDR'])) {
                $addr = ip2long($_SERVER['SERVER_ADDR']);
            } else {
                $addr = php_uname('n');
            }
            $addr = substr(str_replace(array('-', '_', ',', '|', '/', '\\'), '', $addr), 0, 15);
        }
        $sep = '.';
        return $addr . $sep . $pid . $sep . $_SERVER['REQUEST_TIME'] . $sep . mt_rand(10000, 99999);
    }

    public static function httpMethod() {
        return $_SERVER['REQUEST_METHOD'] ?: 'GET';
    }

    public static function fetchRawBody($assue_json = true) {
        if (isset($GLOBALS['HTTP_RAW_POST_DATA'])) {
            $final = $GLOBALS['HTTP_RAW_POST_DATA'];
        } else {
            $final = file_get_contents('php://input');
        }
        // $final = deunicode($final);
        // Logger::write('requestPut_debug', 'DEBUG', $final);
        if (!empty($final) && $assue_json && ($decoded = @json_decode($final, true))) {
            $final = get_safe_input($decoded);
        }
        return $final;
    }

    public static function isAjax() {
        $final = false;
        if (is_callable('Context::get') && Context::get('is_ajax') === true) {
            $final = true;
        } elseif (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
            $x_req = $_SERVER['HTTP_X_REQUESTED_WITH'];
            if (_strtolower($x_req) == 'xmlhttprequest' || preg_match('/^ShockwaveFlash.*?$/i', $x_req)) {
                $final = true;
            }
        }
        return $final;
    }

    public static function getServerIp() {
        static $final;
        if (!is_null($final)) {
            return $final;
        }
        $final = !empty($_SERVER['SERVER_ADDR']) ? $_SERVER['SERVER_ADDR'] : '0.0.0.0';
        return $final;
    }

    public static function getClientIp() {
        static $final;
        if (!is_null($final)) {
            return $final;
        }
        $ips = array();
        if (isset($_SERVER['HTTP_QVIA'])) {
            // 获取网通代理或教育网代理带过来的客户端IP
            $qvia2ip = function($qvia) {
                if (strlen($qvia) != 40) {
                    return false;
                }
                $ips = array(hexdec(substr($qvia, 0, 2)), hexdec(substr($qvia, 2, 2)), hexdec(substr($qvia, 4, 2)), hexdec(substr($qvia, 6, 2)));
                $ipbin = pack('CCCC', $ips[0], $ips[1], $ips[2], $ips[3]);
                $m = md5('QV^10#Prefix' . $ipbin . 'QV10$Suffix%');
                if ($m == substr($qvia, 8)) {
                    return implode('.', $ips);
                } else {
                    return false;
                }
            };
            $ip = $qvia2ip($_SERVER['HTTP_QVIA']);
            if ($ip) {
                $ips[] = $ip;
            }
        }
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ips[] = $_SERVER['HTTP_CLIENT_IP'];
        }
        /*
        * x-forwarded-for不安全，不使用        
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $tmp = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            if ($tmp) {
                foreach ($tmp as $ip) {
                    $ip = trim($ip);
                    if ($ip) {
                        $ips[] = $ip;
                    }
                }
            }
        }
        */
        if (!empty($_SERVER['HTTP_PROXY_USER'])) {
            $ips[] = $_SERVER['HTTP_PROXY_USER'];
        }
        $real_ip = getenv('HTTP_X_REAL_IP');
        if (!empty($real_ip)) {
            $ips[] = $real_ip;
        }
        if (!empty($_SERVER['REMOTE_ADDR'])) {
            $ips[] = $_SERVER['REMOTE_ADDR'];
        }
        // 选第一个最合法的，或最后一个正常的IP
        foreach ($ips as $ip) {
            $long = ip2long($ip);
            $long && $final = $ip;
            // 排除不正确的或私有IP
            if (!(($long == 0) ||                                       // 不正确的IP或0.0.0.0
                  ($long == -1) ||                                      // PHP4下当IP不正确时会返回-1
                  ($long == 0xFFFFFFFF) ||                              // 255.255.255.255
                  ($long == 0x7F000001) ||                                // 127.0.0.1
                  (($long >= 0x0A000000) && ($long <= 0x0AFFFFFF)) ||   // 10.0.0.0 - 10.255.255.255
                  (($long >= 0xC0A8FFFF) && ($long <= 0xC0A80000)) ||   // 172.16.0.0 - 172.31.255.255
                  (($long >= 0xAC1FFFFF) && ($long <= 0xAC100000)))) {  // 192.168.0.0 - 192.168.255.255
                $final = long2ip($long);
                break;
            }
        }
        empty($final) && $final = '0.0.0.0';
        return $final;
    }

    public static function getDistrictFromIp($ip = null) {
        $ip = $ip ?: self::getClientIp();
        $dat_path = DEV_DATA_PATH . 'lib/qqwry.dat';
        if (!$fd = @fopen($dat_path, 'rb')) {
            return 'ip data not found';
        }
        $ip = explode('.', $ip);
        $ipNum = $ip[0] * 16777216 + $ip[1] * 65536 + $ip[2] * 256 + $ip[3];
        $DataBegin = fread($fd, 4);
        $DataEnd = fread($fd, 4);
        $ipbegin = implode('', unpack('L', $DataBegin));
        if($ipbegin < 0) $ipbegin += pow(2, 32);
        $ipend = implode('', unpack('L', $DataEnd));
        if($ipend < 0) $ipend += pow(2, 32);
        $ipAllNum = ($ipend - $ipbegin) / 7 + 1;
        $BeginNum = 0;
        $EndNum = $ipAllNum;
        $ip1num = $ip2num = 0;
        $ipAddr1 = $ipAddr2 = '';
        while($ip1num > $ipNum || $ip2num < $ipNum) {
            $Middle= intval(($EndNum + $BeginNum) / 2);
            fseek($fd, $ipbegin + 7 * $Middle);
            $ipData1 = fread($fd, 4);
            if(strlen($ipData1) < 4) {
                fclose($fd);
                return 'error';
            }
            $ip1num = implode('', unpack('L', $ipData1));
            if($ip1num < 0) $ip1num += pow(2, 32);
            if($ip1num > $ipNum) {
                $EndNum = $Middle;
                continue;
            }
            $DataSeek = fread($fd, 3);
            if(strlen($DataSeek) < 3) {
                fclose($fd);
                return 'error';
            }
            $DataSeek = implode('', unpack('L', $DataSeek.chr(0)));
            fseek($fd, $DataSeek);
            $ipData2 = fread($fd, 4);
            if(strlen($ipData2) < 4) {
                fclose($fd);
                return 'error';
            }
            $ip2num = implode('', unpack('L', $ipData2));
            if($ip2num < 0) $ip2num += pow(2, 32);
            if($ip2num < $ipNum) {
                if($Middle == $BeginNum) {
                    fclose($fd);
                    return 'error';
                }
                $BeginNum = $Middle;
            }
        }
        $ipFlag = fread($fd, 1);
        if($ipFlag == chr(1)) {
            $ipSeek = fread($fd, 3);
            if(strlen($ipSeek) < 3) {
                fclose($fd);
                return 'error';
            }
            $ipSeek = implode('', unpack('L', $ipSeek.chr(0)));
            fseek($fd, $ipSeek);
            $ipFlag = fread($fd, 1);
        }
        if($ipFlag == chr(2)) {
            $AddrSeek = fread($fd, 3);
            if(strlen($AddrSeek) < 3) {
                fclose($fd);
                return 'error';
            }
            $ipFlag = fread($fd, 1);
            if($ipFlag == chr(2)) {
                $AddrSeek2 = fread($fd, 3);
                if(strlen($AddrSeek2) < 3) {
                    fclose($fd);
                    return 'error';
                }
                $AddrSeek2 = implode('', unpack('L', $AddrSeek2.chr(0)));
                fseek($fd, $AddrSeek2);
            } else {
                fseek($fd, -1, SEEK_CUR);
            }
            while(($char = fread($fd, 1)) != chr(0))
            $ipAddr2 .= $char;
            $AddrSeek = implode('', unpack('L', $AddrSeek.chr(0)));
            fseek($fd, $AddrSeek);
            while(($char = fread($fd, 1)) != chr(0))
            $ipAddr1 .= $char;
        } else {
            fseek($fd, -1, SEEK_CUR);
            while(($char = fread($fd, 1)) != chr(0))
            $ipAddr1 .= $char;
            $ipFlag = fread($fd, 1);
            if($ipFlag == chr(2)) {
                $AddrSeek2 = fread($fd, 3);
                if(strlen($AddrSeek2) < 3) {
                    fclose($fd);
                    return 'error';
                }
                $AddrSeek2 = implode('', unpack('L', $AddrSeek2.chr(0)));
                fseek($fd, $AddrSeek2);
            } else {
                fseek($fd, -1, SEEK_CUR);
            }
            while(($char = fread($fd, 1)) != chr(0)){
                $ipAddr2 .= $char;
            }
        }
        fclose($fd);
        if(preg_match('/http/i', $ipAddr2)) {
            $ipAddr2 = '';
        }
        $ipaddr = "$ipAddr1 $ipAddr2";
        $ipaddr = preg_replace('/CZ88.Net/is', '', $ipaddr);
        $ipaddr = preg_replace('/^s*/is', '', $ipaddr);
        $ipaddr = preg_replace('/s*$/is', '', $ipaddr);
        if(preg_match('/http/i', $ipaddr) || $ipaddr == '') {
            $ipaddr = 'error';
        }
        $ipaddr = iconv('gbk', 'utf-8//IGNORE', $ipaddr);
        if( $ipaddr == '  ' ) return 'error';
        $ipaddr = str_replace(' 对方和您在同一内部网', '内部网', $ipaddr);
        return $ipaddr;
    }

    public static function userAgent() {
        return isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
    }

    public static function parseUserAgent($line = false, $user_agent = null) {
        if (!function_exists('vendor_parse_user_agent')) {
            Loader::file(DEV_VENDOR_PATH . 'PhpUserAgent/UserAgentParser.php');
        }
        $user_agent = $user_agent ?: self::userAgent();
        if (preg_match('/^[a-zA-Z0-9\-\_]{1,50}\/(.*?) \((\d+\.\d+); (.*?); Scale\/(\d+\.\d+)\)$/', $user_agent, $matched)) {
            $res = [
                'platform' => $matched[3],// 平台：Android、iOS等
                'browser'  => $matched[1],// 设备：iPhone7,1等
                'version'  => $matched[2],// app版本
            ];
        } else {
            $res = vendor_parse_user_agent($user_agent);
        }
        if (stripos($user_agent, 'MicroMessenger/') !== false) {
            $res['browser'] .= '(微信)';
        }
        if ($line) {
            return join(' ', $res);
        }
        return $res;
    }

    public static function referer($cmd = null) {
        $s = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
        if ($cmd == '-s') {
            $s = str_replace(ROOT_URL, ROOT_URL_PATH, $s);
            if (empty($s)) {
                $s = '/';
            }
        }
        return $s;
    }

    public static function isMobile($user_agent = null) {
        $mobile = false;
        $ua = _strtolower($user_agent ?: self::userAgent());
        $regex = "/.*(mobile|nokia|iphone|ipod|andriod|bada|motorola|^mot\-|softbank|foma|docomo|kddi|ip\.browser|up\.link|";
        $regex .= "htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|ppc|";
        $regex .= "blackberry|alcate|amoi|ktouch|nexian|samsung|^sam\-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|";
        $regex .= "symbian|smartphone|midp|wap|phone|windows\sphone|iemobile|^spice|^bird|^zte\-|longcos|pantech|gionee|^sie\-|portalmmm|";
        $regex .= "MicroMessenger|MQQBrowser|";
        $regex .= "jig browser|hiptop|uc|^benq|haier|^lct|opera\s*mobi|opera\s*mini|2.0 MMP|240x320|400X240|Cellphone|WinWAP).*/i";
        if (preg_match($regex, $ua)) {
            $mobile = true;
        }
        return $mobile;
    }

    public static function getCurlCommand() {
        try {
            if (php_sapi_name() == 'error cli') {
                throw new Exception("cli");
            }

            $curl_command = 'curl ';
            $post_data = $get_data = '';

            if($_GET) {
                $gets = http_build_query($_GET);
                $get_data .= strpos($curl_command, '?') ? '&' . $gets : '?' . $gets;
            }

            if ($_SERVER['REQUEST_METHOD'] == 'POST') {
                $posts = http_build_query($_POST);
                $post_data = ' -d "' . $posts . '"';
            }

            // $path = isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : $_SERVER['PHP_SELF'];
            $path = Router::url('-s');
            $curl_command .= '"' . PROTOCAL . "://{$_SERVER['HTTP_HOST']}" . $path . $get_data . '"';
            if ($post_data) {
                $curl_command .= $post_data;
            }

            $headers = array();
            if (function_exists('getallheaders')) {
                $headers = getallheaders();
            } else {
                foreach ($_SERVER as $name => $value) {
                    if (substr($name, 0, 5) == 'HTTP_') {
                        $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
                    }
                }
            }
            foreach ($headers as $key => $value) {
                if($key == 'Accept-Encoding') {
                    $value = str_replace('gzip, ', '', $value);
                }
                $curl_command .= ' -H "' . $key . ':' . $value . '"';
            }

            return $curl_command;
        } catch (Exception $e) {
            return $e->getMessage();
        }

    }
}

// end of script
