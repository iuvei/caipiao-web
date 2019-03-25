<?php
/**
 * 开奖API
 */

Class AwardAPI {
    const MAIN_SSC = '38yf-jvjb-dl.12590006.com';
    const MAIN_SDC = '38yf-jvjb-dl.1733269.com';

    // 是否是主服务
    public static function isMain() {
        return in_array(DEV_MAIN_HOST, [
            self::MAIN_SSC,
            self::MAIN_SDC,
        ]);
    }

    // 时时彩
    public static function getSSCDataV2() {
        $number = '';
        $award = '';
        $token = 'FAFBB8E07C95B786';
        $main_host = self::MAIN_SSC;
        if (DEV_MAIN_HOST == $main_host) {
            $remote_kj_data_url = 'http://api.b1api.com/api';
            $remote_kj_data_url_fallback = 'http://api.b1cp.com/api';
        } else {
            $remote_kj_data_url = 'http://' . $main_host . '/openreward_ssc_v2.json';
        }
        // 取数据
        $extends = [
            'write_log' => 0,
            'timeout'   => 5,
        ];
        $url = $remote_kj_data_url . '?p=json&t=cqssc&limit=1&token=' . $token;
        $response = curl($url, null, $extends);
        if (empty($response) && !empty($remote_kj_data_url_fallback)) {
            $url = $remote_kj_data_url_fallback . '?p=json&t=cqssc&limit=1&token=' . $token;
            $response = curl($url, null, $extends);
        }
        file_put_contents(DEV_WEB_PATH . 'openreward_ssc_v2.json', $response);
        $data = json_decode($response, true);
        if (!empty($data['data'][0])) {
            $recent_one = $data['data'][0];
            $number = substr($recent_one['expect'], 2);// 期数
            $award = $recent_one['opencode'];// 开奖号码
        } else {
            $number = substr($response, 0, 3000);
        }
        return [$number, $award];
    }

    // 时时彩
    public static function getSSCData() {
        $number = '';
        $award = '';
        $token = 'eeda88a9ccd49adaa1deddf6447ef14f';
        $gamekey = 'ssc';
        $main_host = self::MAIN_SSC;
        if (DEV_MAIN_HOST == $main_host) {
            $remote_kj_data_url = 'http://api.jiekouapi.com/hall/nodeService/api_request';
            $remote_kj_data_url_fallback = 'http://api.caipiaoapi.com/hall/nodeService/api_request';
        } else {
            $remote_kj_data_url = 'http://' . $main_host . '/openreward.json';
        }
        $time = time();
        $md5 = md5(md5($time . '-' . $token));
        $site = 'api.jiekouapi.com';
        // 取数据
        $extends = [
            'write_log' => 0,
            'timeout'   => 5,
        ];
        $url = $remote_kj_data_url . '?uid=517&api=apiGameList&md5=' . $md5 . '&time=' . $time . '&gamekey=' . $gamekey . '&site=' . $site;
        $response = curl($url, null, $extends);
        if (empty($response) && !empty($remote_kj_data_url_fallback)) {
            $url = $remote_kj_data_url_fallback . '?uid=517&api=apiGameList&md5=' . $md5 . '&time=' . $time . '&gamekey=' . $gamekey . '&site=' . $site;
            $response = curl($url, null, $extends);
        }
        file_put_contents(DEV_WEB_PATH . 'openreward.json', $response);
        $data = json_decode($response, true);
        if (!empty($data['result']['data'][0])) {
            $recent_one = $data['result']['data'][0];
            $number = substr($recent_one['gid'], 2);// 期数
            $award = $recent_one['award'];// 开奖号码
        } else {
            $number = substr($response, 0, 3000);
        }
        return [$number, $award];
    }

    // 圣地彩
    public static function getSDCData() {
        $number = '';
        $award = '';
        $token = 'FAFBB8E07C95B786';
        $main_host = self::MAIN_SDC;
        if (DEV_MAIN_HOST == $main_host) {
            $remote_kj_data_url = 'http://api.b1api.com/api';
            $remote_kj_data_url_fallback = 'http://api.b1cp.com/api';
        } else {
            $remote_kj_data_url = 'http://' . $main_host . '/openreward_sdc.json';
        }
        // 取数据
        $extends = [
            'write_log' => 0,
            'timeout'   => 5,
        ];
        $url = $remote_kj_data_url . '?p=json&t=sdc&limit=1&token=' . $token;
        $response = curl($url, null, $extends);
        if (empty($response) && !empty($remote_kj_data_url_fallback)) {
            $url = $remote_kj_data_url_fallback . '?p=json&t=sdc&limit=1&token=' . $token;
            $response = curl($url, null, $extends);
        }
        file_put_contents(DEV_WEB_PATH . 'openreward_sdc.json', $response);
        $data = json_decode($response, true);
        if (!empty($data['data'][0])) {
            $recent_one = $data['data'][0];
            $number = substr($recent_one['expect'], 2);// 期数
            $award = $recent_one['opencode'];// 开奖号码
        } else {
            $number = substr($response, 0, 3000);
        }
        return [$number, $award];
    }
}