-- 清空已有投注、会员等数据

-- 清空投注数据
DELETE FROM `jz_bets` WHERE 1=1;
DELETE FROM `jz_bet2` WHERE 1=1;
-- 清空代理和会员
DELETE FROM `jz_agent` WHERE SuperCompanyID<>1;
DELETE FROM `jz_user` WHERE 1=1;
-- 清空其他
DELETE FROM `jz_coin_log` WHERE 1=1;
DELETE FROM `jz_data` WHERE 1=1;
DELETE FROM `jz_logs` WHERE 1=1;
DELETE FROM `jz_posts` WHERE 1=1;

-- 删除所有投注表，手动执行
SELECT CONCAT('DROP TABLE ', TABLE_NAME, ';')
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME LIKE 'jz_userbet%' AND TABLE_NAME<>'jz_userbet'
