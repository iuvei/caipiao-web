#!/bin/bash
# nohup sh /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/monitor/mainTaskMonitor.sh &

check_process()
{
    # Check whether the parameter is present
    if [ "$1" = "" ];then
        return 1
    fi

    # $PROCESS_NUM is the number of $1
    PROCESS_NUM=`ps -ef | grep "$1" | grep -v "grep" | wc -l`
    if [ $PROCESS_NUM != 0 ];then
        return 1
    else
        return 0
    fi
}

notify_error_by_curl()
{
    curl 'https://tgbot.lbyczf.com/sendMessage/9qvmsm03jsyl1pa8' -d "text=$1" &
}

while [ 1 ] ; do
    # 数据汇总
    check_process "cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/collect.php"
    if [ $? == 0 ];then
        nohup php /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/collect.php &
        notify_error_by_curl "[WARN]圣地彩 (7738) 服务重启-数据汇总"
    fi

    # 采集器
    check_process "cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/crawler.php"
    if [ $? == 0 ];then
        nohup php /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/crawler.php &
        notify_error_by_curl "[WARN]圣地彩 (7738) 服务重启-采集器"
    fi
    
    # 结算器
    check_process "cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/windup.php"
    if [ $? == 0 ];then
        nohup php /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/core/windup.php &
        notify_error_by_curl "[WARN]圣地彩 (7738) 服务重启-结算器"
    fi

    sleep 5
done



