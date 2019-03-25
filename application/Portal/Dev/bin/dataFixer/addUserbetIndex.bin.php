<?php
require_once __DIR__ . '/../abstract.bin.php';

// exit("done\n");

$uids = Devdb::jo("SELECT DISTINCT(`id`) FROM jz_user") ?: '0';
// $uids = 1338;
deb($uids);
foreach (explode(',', $uids) as $uid) {
    Devdb::query("ALTER TABLE `jz_userbet{$uid}` CHANGE `PeriodsNumber` `PeriodsNumber` varchar(32) COLLATE 'utf8_general_ci' NOT NULL DEFAULT '' AFTER `ProfitAndLoss`", true);
    Devdb::query("ALTER TABLE `jz_userbet{$uid}` ADD INDEX `PeriodsNumber` (`PeriodsNumber`)", true);
}

// 完成
flush_out("\nfinished.");
flush_out("=========== 运行报告 ===========");
flush_out("执行时间：" . dt(COMMON_STARTTIME));
flush_out("数据查询：" . count(Devdb::$queries));
flush_out("执行耗时：" . system_run_time());
flush_out("\n");
