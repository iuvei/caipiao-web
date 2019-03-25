<?php

class File {

    public static function getFileRecursively($dir, $allowed_ext = array()) {
        $final = array();
        if (is_dir($dir)) {
            $dh = opendir($dir);
            while ($file = readdir($dh)) {
                if($file == '.' || $file == '..') {
                    continue;
                }

                $fullpath = $dir . '/' . $file;
                if (is_dir($fullpath)) {
                    $final = array_merge($final, self::getFileRecursively($fullpath, $allowed_ext));
                } else {
                    if (!empty($allowed_ext) && !in_array(pathinfo($fullpath, PATHINFO_EXTENSION), $allowed_ext)) {
                        continue;
                    }
                    $final[] = $fullpath;
                }
            }
        }

        return $final;
    }

    public static function copyDirRecursively($source, $dest) {
        $final = 0;
        self::createDir($dest);
        if (is_dir($source)) {
            $dir_handle = opendir($source);
            while ($file = readdir($dir_handle)) {
                if($file == '.' || $file == '..') {
                    continue;
                }

                // 排除 .开头的
                if (strncmp($file, '.', 1) === 0) {
                    continue;
                }
                
                if (is_dir($source . '/' . $file)) {
                    if (!is_dir($dest . '/' . $file)) {
                        self::createDir($dest . '/' . $file);
                    }
                    $final += self::copyDirRecursively($source . '/' . $file, $dest . '/' . $file);
                } else {
                    copy($source . '/' . $file, $dest . '/' . $file);
                    $final++;
                }
            }
            closedir($dir_handle);
        } else {
            copy($source, $dest);
            $final++;
        }

        return $final;
    }

    public static function trimRootPath($path) {
        $path = str_replace(DEV_ROOT_PATH, '', $path);
        // 含有软链接的path需要用真实方式去除
        $path = str_replace(realpath(DEV_ROOT_PATH) . '/', '', $path);
        return $path;
    }

    public static function sendDownload($filepath, $filename = null, $force_download = true) {
        if (headers_sent()) {
            throw new \Exception("Cannot send file to the browser, since the headers were already sent.");
        }
        $filename = $filename ? trim($filename) : basename($filepath);
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Cache-Control: private", false);
        header("Content-Type: application/force-download");
        if ($force_download) {
            header("Content-Disposition: attachment; filename=\"{$filename}\";" );
        } else {
            header("Content-Disposition: filename=\"{$filename}\";" );
        }
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: " . filesize($filepath));
        @ob_clean();
        readfile($filepath);
    }

    public static function writeSafety($path, $content) {
        if (!is_dir(dirname($path))) {
            self::createDir(dirname($path));
        }
        return file_put_contents($path, $content);
    }

    public static function createDir($dir) {
        if (!is_dir($dir)) {
            self::createDir(dirname($dir));
            $default = umask(0000);
            mkdir($dir, 0777);
            umask($default);
        }
        return $dir;
    }

    public static function deleteDir($dir) {
        // 先删除目录下的文件：
        $dh = opendir($dir);
        while ($file = readdir($dh)) {
            if($file != "." && $file != "..") {
                $fullpath = $dir . "/" . $file;
                if(!is_dir($fullpath)) {
                    unlink($fullpath);
                } else {
                    self::deleteDir($fullpath);
                }
            }
        }

        closedir($dh);
        // 删除当前文件夹：
        if(rmdir($dir)) {
            return true;
        } else {
            return false;
        }
    }

    public static function getList($dir, $orderby = '') {
        $final = array();
        if (is_dir($dir)) {
            $dh = opendir($dir);
            while ($file = readdir($dh)) {
                if($file != "." && $file != "..") {
                    $fullpath = $dir . "/" . $file;
                    $final[] = $fullpath;
                }
            }
            // @todo: 支持文件名、修改时间等的orderby
        }

        return $final;
    }

    /**
     * Returns the formatted size
     *
     * @param  integer $size
     * @param  integer $precision
     * @return string
     */
    public static function toByteString($size, $precision = 2) {
        $sizes = array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
        for ($i = 0; $size > 1024 && $i < 9; $i++) {
            $size /= 1024;
        }
        return number_format($size, $precision, '.', '') . $sizes[$i];
    }

    /**
     * Returns the unformatted size
     *
     * @param  string $size
     * @return integer
     */
    public static function fromByteString($size) {
        if (is_numeric($size)) {
            return (int)$size;
        }

        $type  = trim(substr($size, -2));
        $value = substr($size, 0, -2);
        switch (strtoupper($type)) {
            case 'YB':
                $value *= (1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024);
                break;
            case 'ZB':
                $value *= (1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024);
                break;
            case 'EB':
                $value *= (1024 * 1024 * 1024 * 1024 * 1024 * 1024);
                break;
            case 'PB':
                $value *= (1024 * 1024 * 1024 * 1024 * 1024);
                break;
            case 'TB':
                $value *= (1024 * 1024 * 1024 * 1024);
                break;
            case 'GB':
                $value *= (1024 * 1024 * 1024);
                break;
            case 'MB':
                $value *= (1024 * 1024);
                break;
            case 'KB':
                $value *= 1024;
                break;
            default:
                break;
        }

        return $value;
    }
}
