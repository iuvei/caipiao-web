<?php

namespace Common\Controller;

use Common\Controller\AppframeController;

class HomebaseController extends AppframeController {

    protected $uid;
    protected $user_login;
    protected $user;
    protected $time;
    protected $all_record;
    protected $extract;
    protected $bonus;
    public function __construct() {
        $this->set_action_success_error_tpl();
        parent::__construct();
        $this->time = $this->getTime();
        $this->all_record = M("AllRecord");
        session_start();
        $this->extract=  sp_get_option("extract");
        $this->bonus=  sp_get_option("bonus");
        $this->assign("bonus", $this->bonus);
        $this->assign("extract", $this->extract);
        $this->user_model = D("Portal/User");
        if(session("?uid")){
            $this->uid = session("uid");
            $this->user_login = session("user_login");
            $this->user = $this->user_model->find($this->uid);
            $this->assign("user", $this->user);
        }
        if(session("?aid")){
            $this->aid = session("aid");
            $this->agent_login = session("agent_login");
            $agent = M("agent")->find($this->aid);
            if ($agent['IsSubAccount']) {
                $agent['user_login'] = $agent['parent_user'];
                $agent['id'] = $agent['parent'];
            }
            $this->agent = $agent;
            $this->assign("agent", $this->agent);
        }
        session_write_close();
    }
    public function getTime() {
        return date ("Y-m-d H:i:s",  time());
    }
    public function ejson($msg) {
            header("Content-type: application/json");  
            $data["status"]=false;
            $data["info"]=$msg;
            echo json_encode($data);
            exit();
    }
    public function sjson($msg,$url="") {
            header("Content-type: application/json"); 
            $data["info"]=$msg; 
            $data["url"]=$url;
            $data["status"]=true;
            echo json_encode($data);
            exit();
    }
    function _initialize() {
        parent::_initialize();
        defined("TMPL_PATH") or define("TMPL_PATH", C("SP_TMPL_PATH"));
        $site_options = get_site_options();
        $this->assign($site_options);
        if (sp_is_user_login()) {
            $this->assign("user", sp_get_current_user());
        }
    }

    //拦货 返水数据写入
    function betfslh($id){
        $bet=M("bets")->find($id);
        $played=M("played")->find($bet["playedid"]);
        $save["fsxx"]=$this->betfs($bet["uid"],$played["bettypeid"],$bet["betamount"]);
        $save["lhxx"]=$this->betlh($bet["uid"],$played,$bet["betamount"],$bet["periodsnumber"]);
        M("bets")->where(array("id"=>$id))->save($save);
    }
    function havelh($id,$periodsnumber,$playedid){
            $mapxx["path"]=array("like","%-".$id."-%");
            $agentlist=M("agent")->field("id")->where($mapxx)->select();
            foreach($agentlist as $value){
                $listxx[]=$value["id"];
            }

            $map2["parent"]=array("in",implode(",",$listxx));
            $list=M("user")->where($map2)->select();
            foreach($list as $value){
                $listxx2[]=$value["id"];
            }
            $map["PeriodsNumber"]=$bet["periodsnumber"];
            $map["playedId"]=$playedid;
            $map["uid"]=array("in",implode(",",$listxx2));
            $betlist=M("bets")->where($map)->select();
            $zlhmoney=0;
            foreach ($betlist as $key => $value) {
                $lhxx=json_decode($value["lhxx"],true);
                foreach ($lhxx as $key2 => $value2) {
                    if($value2["id"]==$id){
                        $zlhmoney=$zlhmoney+$value2["money"];
                    }
                }
            }
            return $zlhmoney;
    }
    function betlh($uid,$played,$money,$periodsnumber){
        $user=M("user")->find($uid);
        $parent=M("agent")->find($user["parent"]);
        $commission=json_decode($parent["commission"],true);
        $dataxx=array();
        $user["pratio"]=$user["ratio"];
        for($i=$parent["id"];$i>0;$i){
            $data["id"]=$i;
            $zlhmoney=$this->havelh($data["id"],$periodsnumber,$played["playedid"]);
            $data["money"]=$user["pratio"]*$money/100;
            if($data["money"]+$zlhmoney>$commission[$played["bettypeid"]]["MaxLimitStore"]+0){
                $data["money"]=$commission[$played["bettypeid"]]["MaxLimitStore"]-$zlhmoney;
            }
            $dataxx[]=$data;
            $user=M("agent")->find($i);
            if($user["companytype"]=="2"){
                $i=$user["parent"];
                $parent=M("agent")->find($user["parent"]);
                $commission=json_decode($parent["commission"],true);
            }
            else{
                $i=0;
            }
        }
        return json_encode($dataxx);
    }
    function betfs($uid,$BetType,$money){
        $user=M("user")->find($uid);
        $dataxx=array();
        $commission=json_decode($user["commission"],true);
        $sjcommission=json_decode($user["sjcommission"],true);
        $sfagent=0;
        for($i=$user["parent"];$i>0;$i){
            $data["id"]=$user["id"];
            $data["sfagent"]=$sfagent;
            $data["money"]=$money*($sjcommission[$BetType]["Commission"]-$commission[$BetType]["Commission"]);
            $dataxx[]=$data;
            $sfagent=1;
            $user=M("agent")->find($i);
            if($user["companytype"]=="2"){
                $i=$user["parent"];
                $parent=M("agent")->find($user["parent"]);
                $sjcommission=$commission;
                $commission=json_decode($user["commission"],true);
            }
            else{
                $i=0;
            }
        }
        return json_encode($dataxx);
    }
    /**
     * 检查用户登录
     */
    protected function check_login() {
        $session_user = session("user_login");        
        if (empty($session_user)) {
            $this->msg("您还没有登录！", leuu("portal/index/login"));
        }
    }

    /**
     * 检查代理登录
     */
    protected function check_login2() {
        $session = session();
        if (empty($session['aid']) || empty($session['agent_login']) || empty($this->agent)) {
            $this->msg("您还没有登录！", leuu("portal/index/agent"));
        }
        // 检查当前cookie
        if ($session['aid'] != ck('AccountID') || $session['agent_login'] != ck('AccountLoginName')) {
            $this->msg("登录态过期，请重新登录", leuu("portal/index/agent"));
        }
        if (isset($_GET['CompanyID']) && empty($_GET['CompanyID'])) {
            $this->msg("参数CompanyID有误，请重新登录", leuu("portal/index/agent"));
        }
        if (isset($_GET['AgentID']) && empty($_GET['AgentID'])) {
            $this->msg("参数AgentID有误，请重新登录", leuu("portal/index/agent"));
        }
    }

    public function msg($msg, $url = '') {
        @header("Content-Type:text/html; charset=utf-8");
        if (is_mobile_request()) {
            if ($url) {
                echo '<html style="width:100%;"><head><meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0"> 
                    </head><boby style="width:100%;"><script src="/public/layer/mobile/layer.js"></script>
                    <script>layer.url("' . $msg . '", "' . $url . '");</script></boby></html>';
                exit;
            } else {
                echo '<html style="width:100%;"><head><meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0"> 
                    </head><boby style="width:100%;"><script src="/public/layer/mobile/layer.js"></script>
                    <script>layer.url("' . $msg . '");</script></boby></html>';
                exit;
            }
        } else {
            if ($url) {
                echo '<script src="/SSCCompany/Scripts/Lib/jquery-1.11.1.min.js"></script>
                    <script src="/public/layer/layer.js"></script>
                    <script>layer.url("' . $msg . '", "' . $url . '");</script>';
                exit;
            } else {
                echo '<script src="/SSCCompany/Scripts/Lib/jquery-1.11.1.min.js"></script>
                    <script src="/public/layer/layer.js"></script>
                    <script>layer.url("' . $msg . '");</script>';
                exit;
            }
        }
        exit;
    }
    public function addlog($user_login,$username,$notice,$store=0){
        $data["LoginName"]=$user_login;
        $data["UpdateLoginName"]=$username;
        $data["OperateIP"]=get_client_ip(0, true);
        $data["Describe"]=$notice;
        $data["CreateDt"]=$this->time;
        $data['Store'] = $store;
        M("logs")->add($data);
    }
    public function addRecord($uname, $wallet, $num, $notice) {
        $data["user_login"] = $uname;
        $data["wallet"] = $wallet;
        $data["number"] = $num;
        $data["notice"] = $notice;
        $data["create_time"] = $this->time;
        $this->all_record->add($data);
    }


    /**
     * 检查用户状态
     */
    protected function check_user() {
        $user_status = M("Users")->where(array("id" => sp_get_current_userid()))->getField("user_status");
        if ($user_status == 2) {
            $this->error("您还没有激活账号，请激活后再使用！", U("user/login/active"));
        }

        if ($user_status == 0) {
            $this->error("此账号已经被禁止使用，请联系管理员！", __ROOT__ . "/");
        }
    }

    /**
     * 发送注册激活邮件
     */
    protected function _send_to_active() {
        $option = M("Options")->where(array("option_name" => "member_email_active"))->find();
        if (!$option) {
            $this->error("网站未配置账号激活信息，请联系网站管理员");
        }
        $options = json_decode($option["option_value"], true);
        //邮件标题
        $title = $options["title"];
        $uid = session("user.id");
        $username = session("user.user_login");

        $activekey = md5($uid . time() . uniqid());
        $users_model = M("Users");

        $result = $users_model->where(array("id" => $uid))->save(array("user_activation_key" => $activekey));
        if (!$result) {
            $this->error("激活码生成失败！");
        }
        //生成激活链接
        $url = U("user/register/active", array("hash" => $activekey), "", true);
        //邮件内容
        $template = $options["template"];
        $content = str_replace(array("http://#link#", "#username#"), array($url, $username), $template);

        $send_result = sp_send_email(session("user.user_email"), $title, $content);

        if ($send_result["error"]) {
            $this->error("激活邮件发送失败，请尝试登录后，手动发送激活邮件！");
        }
    }

    /**
     * 加载模板和页面输出 可以返回输出内容
     * @access public
     * @param string $templateFile 模板文件名
     * @param string $charset 模板输出字符集
     * @param string $contentType 输出类型
     * @param string $content 模板输出内容
     * @return mixed
     */
    public function display($templateFile = "", $charset = "", $contentType = "", $content = "", $prefix = "") {
        parent::display($this->parseTemplate($templateFile), $charset, $contentType, $content, $prefix);
    }

    /**
     * 获取输出页面内容
     * 调用内置的模板引擎fetch方法，
     * @access protected
     * @param string $templateFile 指定要调用的模板文件
     * 默认为空 由系统自动定位模板文件
     * @param string $content 模板输出内容
     * @param string $prefix 模板缓存前缀*
     * @return string
     */
    public function fetch($templateFile = "", $content = "", $prefix = "") {
        $templateFile = empty($content) ? $this->parseTemplate($templateFile) : "";
        return parent::fetch($templateFile, $content, $prefix);
    }

    /**
     * 自动定位模板文件
     * @access protected
     * @param string $template 模板文件规则
     * @return string
     */
    public function parseTemplate($template = "") {

        $tmpl_path = C("SP_TMPL_PATH");
        define("SP_TMPL_PATH", $tmpl_path);
        if ($this->theme) { // 指定模板主题
            $theme = $this->theme;
        } else {
            // 获取当前主题名称
            $theme = C("SP_DEFAULT_THEME");
            if (C("TMPL_DETECT_THEME")) {// 自动侦测模板主题
                $t = C("VAR_TEMPLATE");
                if (isset($_GET[$t])) {
                    $theme = $_GET[$t];
                } elseif (cookie("think_template")) {
                    $theme = cookie("think_template");
                }
                if (!file_exists($tmpl_path . "/" . $theme)) {
                    $theme = C("SP_DEFAULT_THEME");
                }
                cookie("think_template", $theme, 864000);
            }
        }

        $theme_suffix = "";

        if (C("MOBILE_TPL_ENABLED") && sp_is_mobile()) {//开启手机模板支持
            if (C("LANG_SWITCH_ON", null, false)) {
                if (file_exists($tmpl_path . "/" . $theme . "_mobile_" . LANG_SET)) {//优先级最高
                    $theme_suffix = "_mobile_" . LANG_SET;
                } elseif (file_exists($tmpl_path . "/" . $theme . "_mobile")) {
                    $theme_suffix = "_mobile";
                } elseif (file_exists($tmpl_path . "/" . $theme . "_" . LANG_SET)) {
                    $theme_suffix = "_" . LANG_SET;
                }
            } else {
                if (file_exists($tmpl_path . "/" . $theme . "_mobile")) {
                    $theme_suffix = "_mobile";
                }
            }
        } else {
            $lang_suffix = "_" . LANG_SET;
            if (C("LANG_SWITCH_ON", null, false) && file_exists($tmpl_path . "/" . $theme . $lang_suffix)) {
                $theme_suffix = $lang_suffix;
            }
        }

        $theme = $theme . $theme_suffix;

        C("SP_DEFAULT_THEME", $theme);

        $current_tmpl_path = $tmpl_path . $theme . "/";
        // 获取当前主题的模版路径
        define("THEME_PATH", $current_tmpl_path);

        $cdn_settings = sp_get_option("cdn_settings");
        if (!empty($cdn_settings["cdn_static_root"])) {
            $cdn_static_root = rtrim($cdn_settings["cdn_static_root"], "/");
            C("TMPL_PARSE_STRING.__TMPL__", $cdn_static_root . "/" . $current_tmpl_path);
            C("TMPL_PARSE_STRING.__PUBLIC__", $cdn_static_root . "/public");
            C("TMPL_PARSE_STRING.__WEB_ROOT__", $cdn_static_root);
        } else {
            C("TMPL_PARSE_STRING.__TMPL__", __ROOT__ . "/" . $current_tmpl_path);
        }


        C("SP_VIEW_PATH", $tmpl_path);
        C("DEFAULT_THEME", $theme);

        define("SP_CURRENT_THEME", $theme);

        if (is_file($template)) {
            return $template;
        }
        $depr = C("TMPL_FILE_DEPR");
        $template = str_replace(":", $depr, $template);

        // 获取当前模块
        $module = MODULE_NAME;
        if (strpos($template, "@")) { // 跨模块调用模版文件
            list($module, $template) = explode("@", $template);
        }

        $module = $module . "/";

        // 分析模板文件规则
        if ("" == $template) {
            // 如果模板文件名为空 按照默认规则定位
            $template = CONTROLLER_NAME . $depr . ACTION_NAME;
        } elseif (false === strpos($template, "/")) {
            $template = CONTROLLER_NAME . $depr . $template;
        }

        $file = sp_add_template_file_suffix($current_tmpl_path . $module . $template);
        $file = str_replace("//", "/", $file);
        if (!file_exists_case($file))
            E(L("_TEMPLATE_NOT_EXIST_") . ":" . $file);
        return $file;
    }

    /**
     * 设置错误，成功跳转界面
     */
    private function set_action_success_error_tpl() {
        $theme = C("SP_DEFAULT_THEME");
        if (C("TMPL_DETECT_THEME")) {// 自动侦测模板主题
            if (cookie("think_template")) {
                $theme = cookie("think_template");
            }
        }
        //by ayumi手机提示模板
        $tpl_path = "";
        if (C("MOBILE_TPL_ENABLED") && sp_is_mobile() && file_exists(C("SP_TMPL_PATH") . "/" . $theme . "_mobile")) {//开启手机模板支持
            $theme = $theme . "_mobile";
            $tpl_path = C("SP_TMPL_PATH") . $theme . "/";
        } else {
            $tpl_path = C("SP_TMPL_PATH") . $theme . "/";
        }

        //by ayumi手机提示模板
        $defaultjump = THINK_PATH . "Tpl/dispatch_jump.tpl";
        $action_success = sp_add_template_file_suffix($tpl_path . C("SP_TMPL_ACTION_SUCCESS"));
        $action_error = sp_add_template_file_suffix($tpl_path . C("SP_TMPL_ACTION_ERROR"));
        if (file_exists_case($action_success)) {
            C("TMPL_ACTION_SUCCESS", $action_success);
        } else {
            C("TMPL_ACTION_SUCCESS", $defaultjump);
        }

        if (file_exists_case($action_error)) {
            C("TMPL_ACTION_ERROR", $action_error);
        } else {
            C("TMPL_ACTION_ERROR", $defaultjump);
        }
    }

}
