# 设置开机自启动
# sh /data/release/web/product/cqssc_v1/web/application/Portal/Dev/bin/task/monitor/setStartAtBoot.sh

mkdir -p /etc/rc.d
echo '' >> /etc/rc.d/rc.local

cat > /etc/rc.d/rc.local <<EOF
nohup sh /data/release/web/product/cqssc_v1/web/application/Portal/Dev/bin/task/monitor/mainTaskMonitor.sh &
EOF

echo '' >> /etc/rc.d/rc.local
chmod +x /etc/rc.d/rc.local
