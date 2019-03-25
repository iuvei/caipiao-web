<?php
/**
 * 数据汇总
 */
require_once __DIR__ . '/../../abstract.bin.php';


$logname = 'collect';

while (true) {
    $time = microtime(true);
    malog_and_flushout($logname, 'SFTJ_0_BEGIN');
    $list = Devdb::selectAll("SELECT * FROM jz_bets WHERE sftj=0");
    foreach ($list as $bet) {
        $key = DEV_DATA_PATH . 'tmp/' . $bet['BetInfoID'] . '_' . $bet['uid'];
        $content = \DataCollector::get($key);
        if (!empty($content)) {
            $userbet_list = dejson($content);
            foreach ($userbet_list as $userbet) {
                unset($userbet['BetTypeID']);
                $userbet['uid'] = $bet['uid'];
                $sql = "";
                $insert_keys = "";
                $insert_values = "";
                foreach ($userbet as $field => $v) {
                    $insert_keys .= "`, `" . $field;
                    $insert_values .= "', '" . (isset($userbet[$field]) ? $userbet[$field] : '');
                }
                $insert_keys = substr($insert_keys, 4);
                $insert_values = substr($insert_values, 4);
                $primary_key = 'id';
                $primary_data = 'NULL';
                $sql = "INSERT INTO `" . 'jz_userbet' . $bet['uid'] . "` (`{$primary_key}`, `" . $insert_keys . "`) VALUES ({$primary_data}, '" . $insert_values . "')";
                Devdb::query($sql);
            }
            malog_and_flushout($logname, 'SFTJ_0_INNER', 'bet_id: ' . $bet['id'] . ', uid: ' . $bet['uid'] . ', 处理数据量: ' . count($userbet_list));
            unlink($file);
        }
        Devdb::query("UPDATE jz_bets SET sftj=1 WHERE id={$bet['id']}");
    }
    malog_and_flushout($logname, 'SFTJ_0_DONE', system_run_time($time) . 's');

    sleep(1);
}