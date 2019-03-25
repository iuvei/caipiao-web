<?php
class Router {
    private static $app_default = '';
    private static $mod_default = '';
    private static $act_default = '';

    private static $current_url;
    private static $current_url_rewrite = '';

    public static function init() {
        self::$app_default = _S('app_default');
        self::$mod_default = _S('mod_default');
        self::$act_default = _S('act_default');
        self::$current_url = PROTOCAL . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

        // inner rewrite
        $rewrite_list = Mdl_System_Router::getRules();
        if (is_array($rewrite_list) && !empty($rewrite_list)) {
            $simple_url = self::url('-router');
            $query_string = !empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : '';
            foreach ($rewrite_list as $k => $v) {
                // echo $v['pattern'].' '.$simple_url.PHP_EOL;
                if (preg_match($v['pattern'], $simple_url) && $v['enable'] === true) {
                    if (is_string($v['to'])) {
                        $replaced_path = preg_replace($v['pattern'], $v['to'], $simple_url);
                    } else {
                        $replaced_path = preg_replace_callback($v['pattern'], $v['to'], $simple_url);
                    }
                    self::$current_url_rewrite = ROOT_URL . $replaced_path . $query_string;
                    break;
                }
            }
        }
    }

    /**
     * 处理url中的参数替换
     */
    public static function replaceUrlParams($url, $params) {
        foreach ($params as $key => $value) {
            if (strpos($url, $key) !== false) {
                $url = preg_replace('/' . $key . '\=[^&]+/', $key . '=' . $value, $url);
            } else {
                $connector = strpos($url, '?') === false ? '?' : '&';
                $url = $url . $connector . $key . '=' . $value;
            }
        }
        return $url;
    }

    /**
     * 启用https后，强制把http转到https
     */
    public static function checkHttpsRedirect() {
        if (PROTOCAL != 'https' && _S('use_https')) {
            $white_list = Mdl_System_Router::getHttpWhiteList();
            if (Validator::isMatchAppModAct($white_list)) {
                return;
            }

            Response::header301();
            $url = 'https' . substr(Router::url(), strlen(PROTOCAL));
            trd($url);
        }
    }

    public static function setCurrentUrl($url) {
        if (Validator::isInnerUrl($url)) {
            self::$current_url_rewrite = $url;
        }
    }

    public static function app($url = null) {
        return self::parseUrlComponent($url, 0, self::$app_default);
    }

    public static function mod($url = null) {
        return self::parseUrlComponent($url, 1, self::$mod_default);
    }

    public static function act($url = null) {
        return self::parseUrlComponent($url, 2, self::$act_default);
    }

    public static function addition($url = null) {
        return self::parseUrlComponent($url, 3);
    }

    public static function url($cmd = null, $url = null) {
        $s = $url ?: self::$current_url;
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

    public static function getControllerClassName($app, $mod) {
        return self::composeClassName($app, $mod, 'Ctl_');
    }

    public static function getBusinessClassName($app, $mod, $act = '') {
        $act && $mod .= '_' . self::lineToHump($act);
        return self::composeClassName($app, $mod, 'Biz_');
    }

    public static function getModelClassName($app, $mod) {
        return self::composeClassName($app, $mod, 'Mdl_');
    }

    public static function getActionMethodName($act) {
        $act = self::lineToHump($act);
        return $act . 'Action';
    }

    public static function getConfigClassName($app = null) {
        $app = $app !== null ? $app : _S('app_default');
        return 'Cfg_' . ucfirst($app);
    }

    public static function getHelperClassName($app = null) {
        $app = $app !== null ? $app : _S('app_default');
        return 'Hlp_' . ucfirst($app);
    }

    public static function lineToHump($string, $lcfirst = true, $include_dash = true) {
        $tmp = '';
        $string = $include_dash ? strtr($string, '-', '_') : $string;
        if (strstr($string, '_') !== false) {
            foreach (explode('_', $string) as $value) {
                $tmp .= ucfirst($value);
            }
            $string = $tmp;
        }
        
        $string = $lcfirst ? lcfirst($string) : ucfirst($string);
        return $string;
    }

    public static function humpToLine($string, $lcfirst = true, $line = '-') {
        return preg_replace_callback('/([A-Z])/', function($matches) use ($line) {
            return $line . strtolower($matches[1]);
        }, ($lcfirst ? lcfirst($string) : $string));
    }


    public static function composeUrl($app, $mod = null, $act = null, $addition = null, $ext = null) {
        $final = '';
        $app = strtr($app, '_', '-');
        $mod = strtr($mod, '_', '-');
        $act = strtr($act, '_', '-');
        $final = $app . 
            ($mod ? '/' . $mod : '') . 
            ($act ? '/' . $act : '') . 
            ($addition ? (substr_compare($addition, '?', 0, 1) === 0 ? '' : '/') . $addition : '') . 
            ($ext ? $ext : '');
        $final = ROOT_URL_PATH . $final;
        return $final;
    }


    public static function basepath() {
        return APP_PATH . app();
    }

    public static function baseurl() {
        return ROOT_URL_PATH . 'app/' . app();
    }


    /**
     * 取出类名
     * @param  [string] $app    [description]
     * @param  [string] $mod    [description]
     * @param  [string] $prefix [description]
     * @return [string]         [description]
     */
    private static function composeClassName($app, $mod, $prefix) {
        $app = strtr($app, '-', '_');
        $mod = strtr($mod, '-', '_');
        $mod_exploded = explode('_', $mod);
        foreach ($mod_exploded as $k => $v) {
            $mod_exploded[$k] = ucfirst($v);
        }
        $class_name = $prefix . ucfirst($app) . '_' . join('_', $mod_exploded);
        return $class_name;
    }


    private static function parseUrlComponent($url, $offset, $default_value = '') {
        $final = '';
        $url === null && $url = self::$current_url_rewrite ? str_replace(ROOT_URL, '', self::$current_url_rewrite) : self::url('-router');
        $final = self::getUrlComponent($url, $offset, $offset != 3 ? 'replace-2_' : '');
        empty($final) && $final = $default_value;
        // 在有rewrite_url的时候，内部 url 会被带上?及后面的参数
        $exploded = explode('?', $final);
        $offset == 3 && $final = reset($exploded);
        return $final;
    }

    private static function getUrlComponent($url, $offset, $cmd = null) {
        $url = str_replace(ROOT_URL, '', $url);
        $url_exploded = explode('/', $url, 4);
        $final = isset($url_exploded[$offset]) ? $url_exploded[$offset] : null;
        if ($final && $cmd == 'replace-2_') {
            if (substr_count($final, '_') > 0) {
                Response::header301();
                Response::tipThenRedirect(strtr(self::url('-no_query') . self::url('-query_string'), '_', '-'));
            } else {
                $final = strtr($final, '-', '_');
            }
        }
        return $final;
    }

}

// end of script
