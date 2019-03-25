<?php

class RedisCache extends FileCache {


    /**
     * 通过前缀获取指定缓存
     */
    public static function getByPrefix($prefix) {
        $client = self::initClient();
        $prefix = self::formatKey($prefix);
        $list = $client->keys($prefix . '*');
        $redis_prefix = $client->getOption(Redis::OPT_PREFIX);
        $final = [];
        foreach ($list as $key) {
            $key = substr($key, strlen($redis_prefix));
            $final[$key] = self::get($key);
        }
        return $final;
    }

    /**
     * 通过前缀删除指定目录的缓存
     * 
     * @param  string $prefix 前缀，如 map_Mdl_Panel_Admin_
     * @return array 成功、失败详情
     */
    public static function deleteByPrefix($prefix) {
        $client = self::initClient();
        $prefix = self::formatKey($prefix);
        $list = $client->keys($prefix . '*');
        $redis_prefix = $client->getOption(Redis::OPT_PREFIX);
        foreach ($list as &$key) {
            $key = substr($key, strlen($redis_prefix));
        }
        $result = $client->delete($list);
        $final = array(
            'succeed_list' => $list,
            'failed_list'  => [],
            'result'       => $result,
        );
        Logger::libraryInfo(__METHOD__, 'prefix: ' . $prefix . ', detail: ' . PHP_EOL . enjson($final));
        return $final;
    }

    /**
     * 设置缓存
     * 
     * @param string $key    键
     * @param string $value  值
     * @param int    $expire 过期时间，默认3600s
     */
    public static function set($key, $value, $expire = 3600) {
        $final = 0;
        $key = self::formatKey($key);
        if (!empty($key)) {
            if (is_array($value) || is_object($value)) {
                $value['_cache_is_struct'] = true;
                $value = enjson($value);
            }
            $data = (string)$value;
            $client = self::initClient();
            $final = $client->set($key, $data);
            $client->expire($key, $expire);
        }
        return $final;
    }

    public static function get($key) {
        $final = null;
        $key = self::formatKey($key);
        if (!empty($key)) {
            $client = self::initClient();
            $content = $client->get($key);
            if (is_string($content) && strlen($content) > 0) {
                $final = $content;
                if (strpos($final, '"_cache_is_struct"') !== false) {
                    $final = dejson($final);
                    unset($final['_cache_is_struct']);
                }
            }
        }
        return $final;
    }

    private static function formatKey($key) {
        return str_replace('::', ':', $key);
    }

    private static function initClient($prefix = '') {
        static $client;
        if (is_null($client)) {
            $client = new Redis();
            $config = [
                'server'                => '127.0.0.1',
                'port'                  => 6379,
                'timeout'               => 1,
                'persistent_id'         => null,
                'reconnection_delay_ms' => 300,
            ];
            $client->connect($config['server'], $config['port'], $config['timeout'], $config['persistent_id'], $config['reconnection_delay_ms']);// 1 sec timeout, 300ms delay between reconnection attempts.
            $client->setOption(Redis::OPT_PREFIX, $prefix ?: PROJECT_NAME . ':');
        }
        return $client;
    }
}
