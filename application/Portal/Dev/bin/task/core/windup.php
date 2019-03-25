<?php
/**
 * 结算器
 */
require_once __DIR__ . '/../../abstract.bin.php';

$logname = 'windup';
$tmp_path = DEV_DATA_PATH;

while (true) {
    // 处理sftj=1的，1->2（数据汇总后）
    $time = microtime(true);
    malog_and_flushout($logname, 'SFTJ_1_BEGIN');
    $list = Devdb::selectAll("SELECT * FROM jz_bets WHERE sftj=1");
    foreach ($list as $bet) {
        for ($i = 0; $i < $bet['count'] / 5000; $i++) {
            $userbet_list = Devdb::selectAll("SELECT * FROM jz_userbet{$bet['uid']} WHERE BetInfoID='{$bet['BetInfoID']}' AND sftm=0 LIMIT " . ($i * 5000) . ", 5000");
            \DataCollector::set(DEV_DATA_PATH . 'tmp/kj' . $bet['BetInfoID'] . '_' . $bet['uid'] . '_' . $i, json_encode($userbet_list));
        }
        Devdb::query("UPDATE jz_bets SET sftj=2 WHERE id={$bet['id']}");
    }
    malog_and_flushout($logname, 'SFTJ_1_DONE', system_run_time($time) . 's');

    // 处理sftj=3的，3->4（开奖后）
    $time = microtime(true);
    malog_and_flushout($logname, 'SFTJ_2_BEGIN');
    $list = Devdb::selectAll("SELECT * FROM jz_bets WHERE sftj=3");
    foreach ($list as $bet) {
        for($i = 0; $i < $bet['count'] / 5000; $i++) {
            $key = DEV_DATA_PATH . 'tmp/data' . $bet['BetInfoID'] . '_' . $bet['uid'] . '_' . $i;
            $content = \DataCollector::get($key);
            if (!empty($content)) {
                $update_list = dejson($content);
                foreach($update_list as $userbet) {
                    $userbet['uid'] = $bet['uid'];
                    $set_sql_items = [];
                    foreach ($userbet as $field => $new) {
                        $set_sql_items[] = "`{$field}`='{$new}'";
                    }
                    $set_sql = join(', ', $set_sql_items);
                    if ($set_sql) {
                        $final_sql = "UPDATE jz_userbet" . $bet['uid'] . " SET {$set_sql} WHERE id='{$userbet['id']}' LIMIT 1";
                        Devdb::query($final_sql);
                    }
                }
                unlink($file);
            }
        }
        Devdb::query("UPDATE jz_bets SET sftj=4 WHERE id={$bet['id']}");
    }
    malog_and_flushout($logname, 'SFTJ_2_DONE', system_run_time($time) . 's');

    // 间隔10s
    sleep(10);
} 

