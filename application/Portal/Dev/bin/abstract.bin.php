<?php
$dir                           = str_replace('\\', '/', dirname(dirname(__DIR__)));
$dir_public                    = $dir;
$environment                   = get_cfg_var('conf_environment') ?: (getenv('conf_environment') ?: 'formal');
$_SERVER['SCRIPT_FILENAME']    = $dir . '/lib';
$_SERVER['REQUEST_URI']        = isset($argv[0]) ? '/' . basename($argv[0]) : '';
$_SERVER['HTTP_HOST']          = 'cqssc.d.local';
$_SERVER['SERVER_PORT']        = '80';
$_SERVER['REMOTE_ADDR']        = '127.0.0.1';
$_SERVER['SERVER_ADDR']        = '127.0.0.1';
$_SERVER['DOCUMENT_ROOT']      = $dir_public;
$_SERVER['REQUEST_TIME_FLOAT'] = isset($_SERVER['REQUEST_TIME_FLOAT']) ? $_SERVER['REQUEST_TIME_FLOAT'] : microtime(true);

require_once $dir . '/Dev/common/common.php';

unset($dir_public, $dir, $environment);

// echo DEV_ROOT_PATH . PHP_EOL;
// echo $_SERVER['DOCUMENT_ROOT'] . PHP_EOL;
// echo ROOT_URL . PHP_EOL;
// echo ROOT_URL_PATH . PHP_EOL;
// exit;
