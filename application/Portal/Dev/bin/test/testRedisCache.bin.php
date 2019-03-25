<?php

require __DIR__ . '/../abstract.bin.php';

// 普通测试
flush_out("普通测试开始");
$cache_key = 'just_a_test';
RedisCache::set($cache_key, dt(), 1);
$result = RedisCache::get($cache_key);
flush_out("结果: " . $result);

flush_out("sleep 1s..");
sleep(1);
$result = RedisCache::get($cache_key);
flush_out("结果: ");
var_dump($result);
flush_out("普通测试结束.\n");

// 数组测试
flush_out("数组测试开始");
$cache_key = 'just_a_test_array';
RedisCache::set($cache_key, [dt(), '数组啊']);
$result = RedisCache::get($cache_key);
flush_out("结果: ");
var_dump($result);
flush_out("数组测试结束.\n");

// 删除前缀测试
flush_out("删除前缀测试");
$cache_key = 'just_a_test2';
RedisCache::set($cache_key, dt());
$prefix = 'just_a_';
$result = RedisCache::deleteByPrefix($prefix);
flush_out("结果: ");
var_dump($result);
flush_out("删除前缀测试结束.\n");


flush_out("测试一个写入，然后在cli运行: redis-cli get \"cqssc_v1:just_a_test3\"");
$cache_key = 'just_a_test3';
RedisCache::set($cache_key, dt(), 3600);
