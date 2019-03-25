<?php
class Devdb {
    /**#@+
     * @access private
     */
    protected static $config;
    public static $connection;
    public static $queries = array();
    public static $prefix;
    /**#@-*/



    public static function init($config = array()) {
        if (empty($config)) {
            return;
        }
        foreach ($config as $k => $v) {
            if (empty($v)) {
                ob_clean();
                $msg = 'config value should not be empty: ' . $k;
                exit('<h1>' . $msg . '</h1>');
            }
        }

        if (strstr($config['server'], ':') !== false) {
            list($config['server'], $config['port']) = explode(':', $config['server']);
        } else {
            $config['port'] = 3306;
        }

        // prefix 在后续有用到的
        self::$config = $config;
        self::$prefix = $config['table_prefix'];
    }

    /**
     * Make a connection to the MySQL server
     *
     * @param array $config Database configuration
     */
    public static function connect($config) {
        //
        // Connect to server
        //
        self::$connection = mysqli_connect($config['server'], $config['username'], $config['passwd'], $config['dbname'], $config['port']);
        if (!self::$connection) {
            ob_clean();
            $msg = 'db connect failed';
            exit('<h1>' . $msg . '</h1>');
        }
        // 这应该是首选的用于改变字符编码的方法，不建议使用mysqli_query()执行SQL请求的SET NAMES ...（如 SET NAMES utf8）。
        // self::query("SET NAME utf8");
        mysqli_set_charset(self::$connection, 'utf8mb4');
    }

    // 选择使用的数据库，通用性更大
    public static function selectDb($db) {
        if (empty(self::$connection)) {
            self::connect(self::$config);
        }
        return mysqli_select_db(self::$connection, $db) or trigger_error('SQL: ' . mysqli_error(self::$connection), E_USER_ERROR);
    }
    /**
     * Execute database queries
     *
     * @param string $query SQL query
     * @param bool $return_error Return error instead of giving general error
     * @returns mixed SQL result resource or SQL error (only when $return_error is TRUE)
     */
    public static function query($query, $return_error = false, $log = false) {
        if (empty(self::$connection)) {
            self::connect(self::$config);
        }
        if ($log) {
            self::$queries[] = preg_replace('#\s+#', ' ', $query);
        }
        $result = mysqli_query(self::$connection, $query) or $error = mysqli_error(self::$connection);
        if (isset($error)) {
            if ( $return_error ) {
                return $error;
            } else {
                trigger_error('SQL: ' . $query . PHP_EOL . '<br>' . PHP_EOL . $error . PHP_EOL . '<pre>' . debug_string_backtrace(true) . '</pre>', E_USER_ERROR);
            }
        }
        return $result;
    }
    /**
     * Fetch query results
     *
     * @param resource $result SQL query resource
     * @returns array Array containing one result
     */
    public static function r(&$result, $type = MYSQLI_ASSOC) {
        return mysqli_fetch_array($result, $type);
    }
    //取一行值
    public static function row($sql) {
        $res = self::query($sql);
        return self::r($res);
    }
    //取单个值1
    public static function val($sql, $data_field = 0) {
        if (stripos($sql, ' limit ') === false) {
            $sql .= ' LIMIT 1';
        }
        $res = self::query($sql);
        if (mysqli_num_rows($res) > 0) {
            $row = self::r($res, MYSQLI_BOTH);// MYSQLI_NUM
            return $row[$data_field];
        }
        return null;
    }
    //查询并组合起来，返回一个字符串
    public static function jo($sql, $in = ',') {
        $res = self::query($sql);
        $str_item = [];
        while ($r = self::r($res)) {
            $str_item[] = reset($r);
        }
        return join($in, $str_item);
    }

    //查询所有结果
    public static function selectAll($sql) {
        $res = self::query($sql);
        $final = array();
        while($r = self::r($res)) {
            $final[] = $r;
        }
        return $final;
    }

    /**
     * 返回UDI影响的行数
     */
    function get_affected_rows(&$result) {
        return mysqli_affected_rows($result);
    }

    /**
     * Count row number
     *
     * @param resource $result SQL query resource
     * @returns int Number of result rows
     */
    public static function rn($result) {
        if (stristr($result, 'select ') !== false) {
            return mysqli_num_rows(self::query($result));
        }
        return mysqli_num_rows($result);
    }
    /**
     * Last inserted ID
     *
     * @returns int Last inserted auto increment ID
     */
    public static function getInsertId() {
        return mysqli_insert_id(self::$connection);
    }
    /**
     * Get used queries array
     *
     * @returns array Array containing executed queries
     */
    public static function get_used_queries() {
        return self::$queries;
    }
    /**
     * Get server version info
     *
     * @returns array Array containing database driver info and server version
     */
    public static function get_server_info() {
        return array(
            'MySQLi',
            mysqli_get_server_info(self::$connection)
        );
    }
    /**
     * Disconnect the database connection
     */
    public static function disconnect() {
        mysqli_close(self::$connection);
    }

    /**
     * 返回配置信息
     * @return mixed
     */
    public static function getConfig($field = null) {
        $final = self::$config;
        if ($field && isset(self::$config[$field])) {
            $final = self::$config[$field];
        }
        return $final;
    }
}
