<?php
class Loader {


    public static function file($file, $once = true) {
        return $once ? self::requireFile($file) : self::includeFile($file);
    }

    public static function model($app, $mod = '') {
        $mod = str_replace('_', '/', $mod ? $mod : _S('mod_default'));
        // 支持模块聚合到一个目录下
        $file = APP_PATH . "{$app}/model/{$mod}.mdl.php";
        if (!is_file($file)) {
            $exploded = explode('/', $mod);
            $mod_lastname = end($exploded);
            $file = str_replace($mod . '.mdl.php', $mod . '/' . $mod_lastname . '.mdl.php', $file);
        }
        // echo '<pre>' . $file . '</pre>' . PHP_EOL;
        return self::requireFile($file);
    }

    public static function controller($app, $act = '') {
        $act = str_replace('_', '/', $act ? $act : _S('act_default'));
        $file = APP_PATH . "{$app}/controller/{$act}.ctl.php";
        if (!is_file($file)) {
            $file = str_replace($act . '.ctl.php', $act . '/' . $act . '.ctl.php', $file);
        }
        // echo '<pre>' . $file . '</pre>' . PHP_EOL;
        return self::requireFile($file);
    }

    public static function helper($app) {
        return self::requireFile(APP_PATH . "{$app}/helper.php");
    }

    public static function config($app) {
        // echo '<pre>' . APP_PATH . "{$app}/config.php" . '</pre>';
        return self::requireFile(APP_PATH . "{$app}/config.php");
    }

    public static function business($app, $act = '') {
        $act = str_replace('_', '/', $act ? $act : _S('act_default'));
        $file = APP_PATH . "{$app}/business/{$act}.biz.php";
        if (!is_file($file)) {
            $file = str_replace($act . '.biz.php', $act . '/' . $act . '.biz.php', $file);
        }
        return self::requireFile($file);
    }

    public static function view($view_name = '', $app = '', $once = false) {
        $view_name = $view_name ?: mod();
        $app = $app ?: app();
        $view_name = strtr($view_name, '_', '/');
        $file = $file_origin = APP_PATH . "{$app}/view/{$view_name}.php";
        if (!is_file($file)) {
            $file_name = strstr($view_name, '/') === false && act() == 'index' ? $view_name : act();
            $file = str_replace($view_name . '.php', $view_name . '/' . $file_name . '.php', $file);
        }

        if (DEBUG_LEVEL >= 1 && !is_file($file)) {
            $file_lists = $file_origin == $file ? File::trimRootPath($file) : File::trimRootPath($file_origin) . ', ' . File::trimRootPath($file);
            echo '<pre>View file not found: ' . $file_lists . '</pre>' . PHP_EOL;
        }
        // echo '<pre>' . $file . '</pre>';

        return $once ? self::requireFile($file) : self::includeFile($file);
    }

    public static function library($file) {
        // echo '<pre>' . DEV_LIBRARY_PATH . "{$file}.php" . '</pre>';
        return self::requireFile(DEV_LIBRARY_PATH . "{$file}.php");
    }

    public static function common($file) {
        return self::library($file);
    }

    public static function assets($file) {
        if (is_file($file)) {
            return file_get_contents($file);
        }
    }

    private static function requireFile($file) {
        if (is_file($file)) {
            return require_once $file;
        } else {
            return null;
        }
    }

    private static function includeFile($file) {
        if (is_file($file)) {
            return require $file;
        } else {
            return null;
        }
    }
}

// end of script
