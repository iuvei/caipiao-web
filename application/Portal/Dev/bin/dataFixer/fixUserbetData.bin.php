<?php
require_once __DIR__ . '/../abstract.bin.php';

// exit("done\n");

// $uids = Devdb::jo("SELECT DISTINCT(`uid`) FROM jz_bets") ?: '0';
$uids = '1208,1209,1210,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1224,1225,1226,1227,1228,1229,1230,1231,1232,1233,1234,1235,1236,1237,1238,1239,1240,1241,1242,1243,1244,1245,1246,1247,1248,1249,1250,1251,1252,1253,1254,1255,1256,1257,1258,1259,1260,1261,1262,1263,1264,1265,1266,1267,1268,1269,1270,1271';
// deb($uids);
foreach (explode(',', $uids) as $uid) {
    $has_field = !empty(Devdb::row("DESCRIBE `jz_userbet{$uid}` `uid`"));
    if (!$has_field) {
        Devdb::query("ALTER TABLE `jz_userbet{$uid}` ADD `uid` int(11) NOT NULL DEFAULT '0' AFTER `id`;");
    }
    Devdb::query("UPDATE `jz_userbet{$uid}` SET uid={$uid};");
}

// 完成
flush_out("\nfinished.");
flush_out("=========== 运行报告 ===========");
flush_out("执行时间：" . dt(COMMON_STARTTIME));
flush_out("数据查询：" . count(Devdb::$queries));
flush_out("执行耗时：" . system_run_time());
flush_out("\n");
