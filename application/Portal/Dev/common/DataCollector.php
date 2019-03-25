<?php
/**
 * 数据汇总
 */

Class DataCollector {

    /**
     * 获取数据
     */
    public static function get($key) {
        $key = self::retreiveKey($key);
        $result = RedisCache::get($key);
        if (empty($result)) {
            $result = FileCache::get($key);
        }
        return $result;
    }

    /**
     * 设置数据，保留4小时
     */
    public static function set($key, $content, $expire = 3600 * 4) {
        $key = self::retreiveKey($key);
        try {
            $result = RedisCache::set($key, $content, $expire);
        } catch (Exception $e) {
            $result = FileCache::set($key, $content, $expire);
        }
        return $result;
    }

    private static function retreiveKey($key) {
        return str_replace(DEV_DATA_PATH . 'tmp/', 'data_collector:', $key);
    }
}
