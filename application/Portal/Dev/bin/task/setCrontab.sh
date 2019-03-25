#!/bin/sh

# 这些任务都是并发执行的
# sh /data/release/web/product/cqssc_v1/web/application/Portal/Dev/bin/task/setCrontab.sh

# 新建文件
echo '' > /tmp/master_init_crontab
# 写文件
cat > /tmp/master_init_crontab <<EOF
# 每小时重启一次任务-暂不用
# 0 */1 * * * sh /data/release/web/product/cqssc_v1/web/application/Portal/Dev/bin/task/mainTask.sh

# 每分钟设置一次目录权限
*/1 * * * * chown -R www:www /data

#emptyline
EOF
# 导入crontab
crontab /tmp/master_init_crontab
# ubuntu->cron, centos->crond
/usr/sbin/service crond restart


