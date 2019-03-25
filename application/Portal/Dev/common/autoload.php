<?php

// 自动加载
spl_autoload_register(function($class) {
    static $vendor_autoloader;
    $need_auto_init = true;
    // echo $class . PHP_EOL;

    $class_framework = preg_replace_callback('/_([A-Z]{1})/', function($m) {
        return '_' . lcfirst($m[1]);
    }, $class);
    $class_framework = substr($class_framework, 4);

    if (strncmp($class, 'Hlp_', 4) === 0) {
        // helper
        Loader::helper($class_framework);
    } elseif (strncmp($class, 'Cfg_', 4) === 0) {
        // config
        Loader::config($class_framework);
    } elseif (strncmp($class, 'Ctl_', 4) === 0) {
        // controller
        $explode_arr = explode('_', $class_framework, 2);
        Loader::controller($explode_arr[0], $explode_arr[1]);
    } elseif (strncmp($class, 'Biz_', 4) === 0) {
        // business
        $explode_arr = explode('_', $class_framework, 2);
        Loader::business($explode_arr[0], $explode_arr[1]);
    } elseif (strncmp($class, 'Mdl_', 4) === 0) {
        // model
        $explode_arr = explode('_', $class_framework, 2);
        Loader::model($explode_arr[0], $explode_arr[1]);
    } elseif (strstr($class, '\\') === false) {
        // common
        Loader::common($class);
    }

    // who needs init(), run it
    $method = 'init';
    if ($need_auto_init && is_callable($class . '::' . $method)) {
        call_user_func($class . '::' . $method);
    }
});
