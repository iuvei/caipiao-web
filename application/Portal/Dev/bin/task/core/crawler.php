<?php
/**
 * 采集器，5s一次
 */
require_once __DIR__ . '/../../abstract.bin.php';

$logname = 'crawler';
// 开奖主程序
$kj_url = 'http://' . DEV_MAIN_HOST . '/index.php/Portal/Date/kj/id/';
// API类型，参见common定义
$api_type = defined('DEV_API_TYPE') ? DEV_API_TYPE : 1;

while (true) {
    // 间隔5s
    sleep(5);
    $time = time();
    if ($api_type == 1) {
        // 时时彩
        list($number, $award) = \AwardAPI::getSSCDataV2();
        if (empty($number) && empty($award)) {
            list($number, $award) = \AwardAPI::getSSCData();
        }
    } elseif ($api_type == 2) {
        // 圣地彩
        list($number, $award) = \AwardAPI::getSDCData();
    } else {
        send_telegram_message(join("\n", [
            '不支持的采集接口类型',
            '',
            '网站: ' . DEV_MAIN_HOST,
            '类型: ' . $api_type,
            '时间: ' . dt(),
        ]));
        sleep(10 * 3600);
    }
    // 写数据
    if (!empty($number) && !empty($award)) {
        if ((int)Devdb::val("SELECT id FROM jz_data WHERE `number`='{$number}' AND `data`='{$award}'") == 0) {
            $sql = "INSERT INTO `jz_data` 
                (`type`, `time`, `number`, `index`, `data`, `billCount`, `pjed`, `zjCount`, `userCount`, `betAmount`, `zjAmount`, `fanDianAmount`, `has_open_reward`)
                VALUES
                ('{$api_type}', '{$time}', '{$number}', '0', '{$award}', '0', '0', '0', '0', '0.0000', '0.0000', '0.0000', '0');";
            Devdb::query($sql);
            malog_and_flushout($logname, 'NEW_INSERT', dt() . "\t已写入新的一期。期数: " . $number . ', 开奖号码: ' . $award);
        } else {
            malog_and_flushout($logname, '', '已经写入过。期数: ' . $number . ', 开奖号码: ' . $award);
        }
    } else {
        malog_and_flushout($logname, 'DATA_FETCH_ERROR', dt() . "\t数据获取有误: " . $number);
        // 告警
        if (\AwardAPI::isMain() && !Tools::isInInterval('crawler_no_conent_notify_' . $api_type, 60)) {
            send_telegram_message(join("\n", [
                '采集数据出错: ' . $number,
                '',
                '网站: ' . DEV_MAIN_HOST,
                '类型: ' . $api_type,
                '时间: ' . dt(),
            ]));
        }
    }

    // 开奖流程
    if (is_system_openning_reward()) {
        // 继续开奖（24小时内）
        $time_24h_ago = time() - 86400;
        $ids = Devdb::jo("SELECT id FROM jz_data WHERE has_open_reward=0 AND `time`>{$time_24h_ago}") ?: '';
        if (!empty($ids)) {
            foreach (explode(',', $ids) as $data_id) {
                if (empty($data_id)) {
                    continue;
                }
                Devdb::query("UPDATE jz_data SET has_open_reward=1 WHERE id='{$data_id}'");
                $result = curl($kj_url . $data_id, null, ['timeout' => 300]);
                malog_and_flushout($logname, 'OPEN_REWARD', dt() . "\t已开奖: " . $result);
            }
        }
    } else {
        // 暂停开奖
        malog_and_flushout($logname, 'OPEN_REWARD_PAUSED', dt() . "\t 系统已暂停开奖");
    }
}
