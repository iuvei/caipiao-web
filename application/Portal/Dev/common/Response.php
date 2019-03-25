<?php
class Response {


    /**
     * 为耗时任务做准备
     */
    public static function prepareForTimeConsumingTask() {
        if (Context::get('is_cgi_request_finished') === true) {
            return;
        }
        function_exists('fastcgi_finish_request') && fastcgi_finish_request();
        Context::set('is_cgi_request_finished', true);
        session_write_close();
    }
    
    public static function formatFrontendImage($image_url, $width = null, $height = null) {
        return Mdl_System_File::fixStaticSrc(Mdl_System_Media::generatePictureThumb($image_url, $width, $height));
    }

    public static function handleException($e) {
        if (!($e instanceof Exception)) {
            Response::outputReturnData(Response::formReturnData(Code::ERROR, 'System Error', array('detail' => 'Cannot handle current exception!')));
        }
        $message = $e->getMessage();
        $code = $e->getCode();
        // var_dump($code);
        if (Request::isAjax()) {
            $data = Context::get('response_exception_data') ?: [];
            if (ck('debug_exception_trace') == 1) {
                $exception_trace = $e->getTrace();
                foreach ($exception_trace as &$trace) {
                    $trace['file'] = File::trimRootPath($trace['file']);
                }
                $data['exception_trace'] = $exception_trace;
                Tools::appendDebugHeader('exception_trace:', 'exception');
                Tools::appendDebugHeader($exception_trace);
            }
            Response::outputReturnData(Response::formReturnData($code, $message, $data));
            exit();
        } else {
            Response::exitWith403($message, '-expose_msg');
        }
    }

    public static function outputOkData($data = [], $type = 'json') {
        $final = self::formReturnData(Code::OK, '', $data);
        self::outputReturnData($final, $type);
    }

    /**
     * 渲染模块输出的结果
     */
    public static function outputReturnData($final = [], $type = 'json') {
        if (DEBUG_LEVEL > 0 || Mdl_Panel_Admin::isRoot()) {
            $final['debug_sql'] = DB::$queries;
        }

        if (isset($final['data']) && empty($final['data']) && is_array($final['data'])) {
            $final['data'] = new stdClass();
        }

        if ($type == 'json') {
            Response::headerJson();
            if (isset($_GET['unicode']) && $_GET['unicode'] == 'Y') {
                echo enjson($final, 'deafult');
            } else {
                echo enjson($final);
            }
        } elseif ($type == 'xml') {
            Response::headerXML();
            echo enxml($final);
        }
    }

    public static function logicReturn($res, $success, $failed = []) {
        $final = [];
        if ($res) {
            $code = isset($success[0]) ? $success[0] : Code::OK;
            $message = isset($success[1]) ? $success[1] : '操作成功';
            $data = isset($success[2]) ? $success[2] : [];
        } else {
            $code = isset($failed[0]) ? $failed[0] : Code::OK;
            $message = isset($failed[1]) ? $failed[1] : '操作失败';
            $data = isset($failed[2]) ? $failed[2] : [];
        }
        $final = Response::formReturnData($code, $message, $data);
        return $final;
    }

    public static function formReturnData($code = 0, $message = '', $data = []) {
        $final = array(
            'code'    => $code,
            'message' => $message,
            'data'    => $data,
        );
        return $final;
    }

    public static function exitWith403($msg = null, $cmd = null) {
        $message = '无权访问此页面';
        if ($cmd == '-add_url_suffix') {
            $msg .= ', url: ' . (Router::url('-relative') ?: '/');
        }
        Logger::write(__CLASS__ . '_header', 'URL_EXIT_403', app() .'_' . mod() . '_' . act() . ', ' . $msg);
        if ((DEBUG_LEVEL > 0 || $cmd == '-expose_msg') && strlen($msg)) {
            $message = $msg;
        }

        Context::set('global_error_msg', $message);
        Response::header403();
        Response::exitCodeHelper('403');
    }

    public static function exitWith404($msg = null, $cmd = null) {
        $message = '页面未找到';
        if ($cmd == '-add_url_suffix') {
            $msg .= ', url: ' . (Router::url('-relative') ?: '/');
        }
        Logger::write(__CLASS__ . '_header', 'URL_EXIT_404', app() .'_' . mod() . '_' . act() . ', ' . $msg);
        if (DEBUG_LEVEL > 0 && strlen($msg)) {
            $message = $msg;
        }
        Context::set('global_error_msg', $message);
        Response::header404();
        Response::exitCodeHelper('404');
    }

    private static function exitCodeHelper($code = null) {
        $msg = Context::get('global_error_msg');
        $code = in_array($code, array('403', '404')) ? $code : '404';
        if (Request::isAjax()) {
            $code_system = $code == '403' ? Code::FORBIDDEN : Code::NOT_FOUND;
            $return_data = Response::formReturnData($code_system, '请求失败：' . $msg);
            Response::outputReturnData($return_data);
            exit();
        } else {
            if (Loader::view('page/' . $code, 'common') !== null) {
                exit();
            } else {
                exit($msg);
            }
        }
    }

    public static function exitWith405($msg = null) {
        Logger::write(__CLASS__ . '_header', 'URL_EXIT_405', app() . '_' . mod() . '_' . act() . ', ' . $msg);
        Response::header405();
        if (DEBUG_LEVEL > 0) {
            echo $msg;
        }
        exit();
    }

    public static function tipThenRedirect($msg, $url = null) {
        if($msg != '' && $url != ''){
            get_system_message();
            set_system_message($msg);
        }
        if ($msg != '' && $url === null) {
            $url = $msg;
        }
        $url = $url ? $url : ROOT_URL;
        self::redirect($url);
        exit();
    }

    public static function redirect($url, $is_301 = false) {
        $is_301 && self::header301();
        self::safetyHeader('Location:' . $url);
    }

    public static function obEndCallback($result) {
        if (!Request::isAjax()) {
            $result = Optimiser::deferInnerJs($result);
        }
        return $result;
    }

    public static function headerDownload($filename) {
        self::safetyHeader("Pragma: public");
        self::safetyHeader("Expires: 0");
        self::safetyHeader("Cache-Control:must-revalidate, post-check=0, pre-check=0");
        // @TODO: 优化，不一定是下载表格
        self::safetyHeader("Content-Type:application/vnd.ms-execl");
        self::safetyHeader('Content-Disposition:attachment;filename="' . $filename . '"');
        self::safetyHeader("Content-Transfer-Encoding:binary");
    }

    public static function headerCharset($charset = 'utf-8') {
        self::safetyHeader('Content-type:charset=' . $charset);
    }
    public static function headerHTML() {
        self::safetyHeader('Content-type:text/html');
    }
    public static function headerXML() {
        self::safetyHeader('Content-type:text/xml');
    }
    public static function headerPlain() {
        self::safetyHeader('Content-type:text/plain');
    }
    public static function headerJson() {
        self::safetyHeader('Content-type:application/json;charset=UTF-8');
    }
    public static function headerFlash() {
        self::safetyHeader('Content-type:application/x-shockwave-flash');
    }
    public static function headerJavascript() {
        self::safetyHeader('Content-type:text/javascript');
    }
    public static function header200() {
        self::safetyHeader('HTTP/1.1 200 OK');
    }
    public static function header301() {
        self::safetyHeader('HTTP/1.1 301 Moved Permanently');
    }
    public static function header400() {
        self::safetyHeader('HTTP/1.1 400 Bad Request');
    }
    public static function header403() {
        self::safetyHeader('HTTP/1.1 403 Forbidden');
    }
    public static function header404() {
        self::safetyHeader('HTTP/1.1 404 Not Found');
    }
    public static function header405() {
        self::safetyHeader('HTTP/1.1 405 Method Not Allowed');
    }
    private static function safetyHeader($content) {
        if (Context::get('is_cgi_request_finished') === true) {
            return;
        }
        @header($content);
    }
}

// end of script
