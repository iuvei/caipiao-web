<?php

function curl_get_contents($url) { 
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($ch); // 已经获取到内容，没有输出到页面上。
    curl_close($ch);
    return $response;
}

$json = curl_get_contents('http://38yf-jvjb-dl.12590006.com/openreward.json');
$rs = json_decode($json, 1);
$data = $rs['result']['data'][0];
if($data){
    echo '"data":[{"expect":"'.$data['gid'].'","opencode":"'.$data['award'].'","opentime":"'.$data['time'].'"';
}
