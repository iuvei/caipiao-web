<?php
// 环境配置相关
define('CONF_ENVIRONMENT', get_cfg_var('conf_environment') ?: (getenv('conf_environment') ?: 'formal'));
if (CONF_ENVIRONMENT == 'develop') {
    error_reporting(E_ALL);
} else {
    error_reporting(E_ALL & ~E_STRICT & ~E_WARNING & ~E_NOTICE);
}

version_compare(PHP_VERSION, '5.4', '<') && exit('require php version 5.4+');
define('DEFINED_TIMEZONE', 'Asia/Shanghai');
DEFINED_TIMEZONE != date_default_timezone_get() && date_default_timezone_set(DEFINED_TIMEZONE);
// 防止json_encode/decode 浮点数溢出，参见： https://segmentfault.com/a/1190000008737065
ini_set('serialize_precision', 14);

// 必须引入头文件访问控制
define('DCSYS', true);
// 入口时间、解析开始时间
define('COMMON_TIMESTAMP', $_SERVER['REQUEST_TIME']);
define('COMMON_STARTTIME', $_SERVER['REQUEST_TIME_FLOAT']);
// 系统是否正在开发, 上线后置为false
define('SYSTEM_IS_DEVELOPING', true);
define('PROJECT_NAME', 'cqssc_v1_sdc');

// 目录相关
define('DEV_ROOT_PATH', str_replace('\\', '/', realpath(dirname(dirname(__DIR__)))) . '/');
define('DEV_WEB_PATH', dirname(DEV_ROOT_PATH, 2) . '/');
define('DEV_DATA_PATH', DEV_ROOT_PATH . 'Dev/data/');
define('DEV_LIBRARY_PATH', DEV_ROOT_PATH . 'Dev/common/');
define('DEV_VENDOR_PATH', DEV_ROOT_PATH . 'Dev/vendor/');
define('DEV_BIN_PATH', DEV_ROOT_PATH . 'Dev/bin/');
// 域名相关
define('PROTOCAL', isset($_SERVER['HTTPS']) || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443) ? 'https' : 'http');
define('ROOT_URL', PROTOCAL . '://' . $_SERVER['HTTP_HOST'] . str_replace(str_replace('\\', '/', realpath($_SERVER['DOCUMENT_ROOT'])), '', DEV_ROOT_PATH));
define('ROOT_URL_PATH', str_replace(PROTOCAL . '://' . $_SERVER['HTTP_HOST'], '', ROOT_URL) . (defined('IS_IN_ROOT') ? 'public/' : ''));
// 安全相关
define('CRYPT_SALT', '#' . substr(md5(PROJECT_NAME), -7) . '@');// 加密添加的混合串元,勿改动！
define('ID_MAX',     2147483647);
define('INT32_MAX',  2147483647);
define('UINT32_MAX', 4294967294);

require_once DEV_LIBRARY_PATH . 'Loader.php';
require_once DEV_LIBRARY_PATH . 'autoload.php';
require_once DEV_LIBRARY_PATH . 'function.php';

$db_config = [
    'type'         => 'mysql',// 类型暂只支持MySQL
    'table_prefix' => 'jz_',// 表前缀
    'server'       => '127.0.0.1',
    'username'     => 'root',
    'passwd'       => '!2i#sn7j7',
    'dbname'       => 'qxc_sdc',
];
Devdb::init($db_config);

// 差异化配置
define('IS_MASTER',     'Y');
define('DEV_MAIN_HOST', '38yf-jvjb-dl.1733269.com');
define('DEV_API_TYPE',  '2');// 1-重庆时时彩, 2-圣地彩
