<?php

Class Crypt {
    public static $id_length = 9;// php精度原因，暂最大只能是9 @todo: 调大


    public static function safeCrc32($string) {
        return sprintf("%u", crc32($string));
    }

    public static function concealSomeChars($string, $prelenth = 4, $postlenth = 4, $conceal_char = '*') {
        $strlen = mb_strlen($string);
        if ($strlen <= $prelenth + $postlenth) {
            return $string;
        }
        $replacement = str_repeat($conceal_char, $strlen - $prelenth - $postlenth);
        $replace_length = strlen($replacement);
        return substr_replace($string, $replacement, $prelenth, $replace_length);
    }

    /**
     * 生成随机字符串
     */
    public static function generateRandomString($lenth = 6) { 
        $chars = array(
            "a", "b", "c", "d", "e", "f",
            "g", "h", "j", "k", 
            "m", "n", "p", "q", "r",
            "s", "t", "u", "v", "w", "x",
            "y", "z", "0", "1", "2", "3",
            "4", "5", "6", "7", "8", "9" 
        );
        // i, l, o容易混淆，这里摘掉
        $chars_length = count($chars);
        shuffle($chars);
        $output = "";
        for ($i = 0; $i < $lenth; $i++) {
            $output .= $chars[mt_rand(0, $chars_length - 1)];
        }
        return $output;
    }

    /**
     * 生成加盐后的密码
     */
    public static function addPasswordSalt($passwd) {
        return md5(md5(CRYPT_SALT . $passwd) . str_repeat(md5(CRYPT_SALT), 10));
    }
    
    /**
     * 10进制数转换成64进制数
     *
     * @param int $dec 十进制的整数
     * @param int $padlen 返回的结果补满多少位，当$padlen = 0时1=> B，当$padlen = 3时1=>AAB
     * @return string 64进制字符串
     */
    public static function base64From10($dec, $padlen = 0) {
        $map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        $bin = decbin((int)$dec);
        $len = strlen($bin);
        $str = str_pad($bin, $len + ((6 - ($len % 6)) % 6), '0', STR_PAD_LEFT);
        $num = strlen($str) / 6;
        $out = '';
        for ($i = 0; $i < $num; $i++) {
            $key = bindec(substr($str, $i * 6, 6));
            $out .= $map{$key};
        }
        if ($padlen > 0 && $num < $padlen) {
            $out = str_pad($out, $padlen, 'A', STR_PAD_LEFT);
        }
        return $out;
    }

    /**
     * 64进制数转换成10进制数
     *
     * @param string $b64 64进制字符串
     * @return int 10进制整数
     */
    public static function base64To10($b64) {
        $map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        $len = strlen($b64);
        $int = 0;
        for ($i = 0; $i < $len; $i++) {
            $key = strpos($map, substr($b64, $i, 1));
            $int += $key * pow(64, $len - $i -1);
        }
        return $int;
    }


    public static function hashidEncode($id, $length = 8) {
        return self::getHashidInstance()->encode($id, $length);
    }

    public static function hashidDecode($hash) {
        return self::getHashidInstance()->decode($hash);
    }

    private static function getHashidInstance() {
        static $hashids;
        if (!is_null($hashids)) {
            return $hashids;
        }
        Loader::file(DEV_LIBRARY_PATH . 'vendor/Hashids/HashGenerator.php');
        Loader::file(DEV_LIBRARY_PATH . 'vendor/Hashids/Hashids.php');
        $hashids = new Hashids\Hashids(CRYPT_SALT);
        return $hashids;
    }

    public static function xorId($id) {
        $id = (int)$id;
        strlen($id) > self::$id_length && Tools::throwException('Crypt error: Id is too long', Code::DATA_EXCEPTION);
        $matrix = self::generateMatrix();
        // deb($matrix);
        $id_fullfill = str_pad($id, self::$id_length, '0', STR_PAD_LEFT);
        $id_split = substr($id_fullfill, -2);
        $hash_index = base_convert(substr(md5($id_split), 0, 1), 16, 10);
        // echo 'hash_index: ' . $hash_index . PHP_EOL;
        $matrix_in_use = $matrix[$hash_index];
        // echo 'matrix_use: ' . $matrix_in_use . PHP_EOL;
        $id_xor = (int)substr($id_fullfill, 0, -2) ^ $matrix_in_use;
        $final = $id_xor . $id_split;
        // echo 'final_resu: ' . $final . PHP_EOL;
        return (int)$final;
    }

    public static function decodeId($id_hash_encrypt_encode) {
        $id_hash_encrypt = urlsafe_b64decode($id_hash_encrypt_encode);
        $id_hash = self::_D($id_hash_encrypt, false, null, true);
        $id = is_numeric($id_hash) ? self::xorId($id_hash) : 0;
        return $id;
    }

    public static function encodeId($id) {
        $id_hash = self::xorId($id);
        // $id_hash = substr(md5($id), strlen($id)-self::$id_length).','.$id;
        $id_hash_encrypt = self::_E($id_hash, false, null, true);
        $id_hash_encrypt_encode = urlsafe_b64encode($id_hash_encrypt);
        return $id_hash_encrypt_encode;
    }

    public static function getRandKey($length = 6) {
        return substr(md5(uniqid(microtime())), 0, $length);
    }

    public static function getRandNumber($length = 6) {
        $begin = '1';
        $end = '9';
        while( strlen($begin) < $length ){
            $begin = $begin . '0';
            $end = $end . '9';
        }
        return rand($begin, $end);
    }

    public static function decryptObject($post_data) {
        foreach ($post_data as $key => $value) {
            $post_data[$key] = base64_decode(self::_D($value, true));
        }
        return $post_data;
    }

    public static function _E($s, $js = false, $salt = null, $return_bin = false) {
        $s = (string)$s;
        if (strlen($s) == 0) {
            return null;
        }
        $len = strlen($s);
        if ($len > _S('crypt_maxlen')) {
            return '加解密时字符串太长';
        }
        $salt === null && $salt = CRYPT_SALT;
        $js && $salt = self::jsSalt($salt);
        $mix = self::getMixFromSalt($salt, $len);
        $res = '';
        for ($i = 0; $i < $len; $i++) {
            $ascc = ord($s[$i]);
            $ascc = $ascc ^ 7;
            $ascc+= ord($mix[$i]);
            if (!$js) {
                $ascc = $ascc >= 128 ? ($ascc - 128) : $ascc;
            }
            $res .= chr($ascc);
        }
        if ($return_bin === false) {
            $res = base64_encode($res);
        }
        return $res;
    }

    public static function _D($s, $js = false, $salt = null, $send_bin = false) {
        $s = (string)$s;
        if (strlen($s) == 0) {
            return null;
        }
        if ($send_bin === false) {
            $s = base64_decode($s);
        }
        $len = strlen($s);
        if ($len > _S('crypt_maxlen')) {
            return '加解密时字符串太长';
        }
        $salt === null && $salt = CRYPT_SALT;
        $js && $salt = self::jsSalt($salt);
        $mix = self::getMixFromSalt($salt, $len);
        $res = '';
        for ($i = 0; $i < $len; $i++) {
            $ascc = ord($s[$i]) - ord($mix[$i]);
            if (!$js) {
                $ascc = $ascc < 0 ? ($ascc + 128) : $ascc;
            }
            $ascc = $ascc ^ 7;
            $res .= chr($ascc);
        }
        return $res;
    }

    public static function getMixFromSalt($salt, $len) {
        $mix = '';
        while (strlen($mix) < $len) {
            $mix .= md5($salt);
        }
        return base64_encode($mix);
    }

    public static function jsSalt($salt = null) {
        if ($salt === null) {
            $salt = CRYPT_SALT;
        }
        return strrev('cc' . $salt . 'D#');
    }

    public static function generateMatrix($length = null) {
        if ($length === null) {
            $length = self::$id_length;
        }

        $matrix = array();
        for ($i = 0; $i < 16; $i++) {
            $base = ($i + 1) % 10 ?: 8;
            $matrix[] = $base . substr(base_convert(md5($i . CRYPT_SALT), 16, 10), 0, $length - 3);
        }
        return $matrix;
    }
}
