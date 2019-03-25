# sh /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/mainTask.sh

# 数据汇总
ps aux | grep 'cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/collect.php' | grep -v grep | awk '{print $2}' | xargs kill
nohup php /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/collect.php &
# 采集器
ps aux | grep 'cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/crawler.php' | grep -v grep | awk '{print $2}' | xargs kill
nohup php /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/crawler.php &
# 结算器
ps aux | grep 'cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/windup.php' | grep -v grep | awk '{print $2}' | xargs kill
nohup php /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/windup.php &

