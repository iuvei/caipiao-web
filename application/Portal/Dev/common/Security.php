<?php

Class Security {

    public static function generateInnerRemoteCallToken($content, $time) {
        return substr(md5(CRYPT_SALT . md5($content) . $time), 0, 16);
    }

    public static function getPublicToken() {
        return substr(md5(CRYPT_SALT . 'public_token_salt'), 0, 8);
    }

    public static function SQLAudit() {
        if (Cfg_Common::get('audit_flag') && count(DB::$queries)) {
            $content_data = array();
            foreach (DB::$queries as $v) {
                if (stripos($v, 'UPDATE') === 0 || stripos($v, 'INSERT') === 0 || stripos($v, 'DELETE') === 0) {
                    $content_data[] = $v;
                }
            }

            if (count($content_data)) {
                $write_txt = array_merge(array('', 'ref: ' . referer('-s'), 'url: ' . Router::url('-relative')), $content_data, array(''));
                $write_txt = join("\n", $write_txt);
                $log_name_suffix = Cfg_Common::get('audit_log_name_suffix');
                $log_name = 'SYSTEM_SQL_AUDIT' . ($log_name_suffix ? '_' . $log_name_suffix : '');
                Logger::write($log_name, Cfg_Common::get('audit_flag'), $write_txt);
            }
        }
    }

}