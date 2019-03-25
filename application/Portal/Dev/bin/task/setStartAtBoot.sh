# 设置开机自启动
# sh /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/setStartAtBoot.sh

# see: https://yq.aliyun.com/articles/559035

mkdir -p /etc/init.d
echo '' >> /etc/init.d/initService.sh

cat > /etc/init.d/initService.sh <<EOF
#!/bin/sh
#add for chkconfig
#chkconfig: 2345 70 30 
#description: the description of the shell

/bin/sh /data/release/web/product/cqssc_v1/web/application/Portal/Dev/bin/task/mainTask.sh
/bin/sh /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/mainTask.sh
nohup sh /data/release/web/product/cqssc_v1/web/application/Portal/Dev/bin/task/monitor/mainTaskMonitor.sh &
nohup sh /data/release/web/product/cqssc_v1_sdc/web/application/Portal/Dev/bin/task/monitor/mainTaskMonitor.sh &

EOF

echo '' >> /etc/init.d/initService.sh
chmod +x /etc/init.d/initService.sh

chkconfig --add /etc/init.d/initService.sh
