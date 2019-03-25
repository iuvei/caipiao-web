<?php

/*
 *      _______ _     _       _     _____ __  __ ______
 *     |__   __| |   (_)     | |   / ____|  \/  |  ____|
 *        | |  | |__  _ _ __ | | _| |    | \  / | |__
 *        | |  | '_ \| | '_ \| |/ / |    | |\/| |  __|
 *        | |  | | | | | | | |   <| |____| |  | | |
 *        |_|  |_| |_|_|_| |_|_|\_\\_____|_|  |_|_|
 */
/*
 *     _________  ___  ___  ___  ________   ___  __    ________  _____ ______   ________
 *    |\___   ___\\  \|\  \|\  \|\   ___  \|\  \|\  \ |\   ____\|\   _ \  _   \|\  _____\
 *    \|___ \  \_\ \  \\\  \ \  \ \  \\ \  \ \  \/  /|\ \  \___|\ \  \\\__\ \  \ \  \__/
 *         \ \  \ \ \   __  \ \  \ \  \\ \  \ \   ___  \ \  \    \ \  \\|__| \  \ \   __\
 *          \ \  \ \ \  \ \  \ \  \ \  \\ \  \ \  \\ \  \ \  \____\ \  \    \ \  \ \  \_|
 *           \ \__\ \ \__\ \__\ \__\ \__\\ \__\ \__\\ \__\ \_______\ \__\    \ \__\ \__\
 *            \|__|  \|__|\|__|\|__|\|__| \|__|\|__| \|__|\|_______|\|__|     \|__|\|__|
 */
// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>
// +----------------------------------------------------------------------

namespace Portal\Controller;

use Common\Controller\HomebaseController;

/**
 * 首页
 */
class IndexController extends HomebaseController {
    public function login(){
        $this->display(':login');
    }
    public function agent(){
        $this->display(':agent');
    }
    //首页 小夏是老猫除外最帅的男人了
    public function index() {
        $this->display(':login');
        // $this->check_login();
        // //中奖信息
        // $obtain=M('obtain_log')->order('sort desc')->select();
        // $this->assign('obtain',$obtain);

        // $paihang=M('jiangjin_log')->order('money desc')->limit('4')->select();
        // $this->assign('paihang',$paihang);


        // $type1=M('type')->where('enable=1 and type=1')->limit(3)->order('sort asc')->select();
        // $type2=M('type')->where('enable=1 and type=2')->limit(2)->order('sort asc')->select();
        // $type3=M('type')->where('enable=1 and type=3')->limit(2)->order('sort asc')->select();
        // $this->assign('type1', $type1);
        // $this->assign('type2', $type2);
        // $this->assign('type3', $type3);
        // $this->display(":home/index");
    }
    public function fslh(){
            ignore_user_abort(true);
             @set_time_limit(0);
            @ini_set('memory_limit', '512M');
            $map['BetInfoID']=I('get.BetInfoID');
            $map['uid']=I('get.uid');
            $betList=M('bets')->where($map)->select();
            foreach ($betList as $key => $value) {
                $this->betfslh($value['id']);
            }
    }
    public function found(){
        $obtain=M('obtain_log')->order('sort desc')->select();
        $this->assign('obtain',$obtain);

        $paihang=M('jiangjin_log')->order('money desc')->limit('4')->select();
        $this->assign('paihang',$paihang);


        $type1=M('type')->where('enable=1 and type=1')->limit(3)->order('sort asc')->select();
        $type2=M('type')->where('enable=1 and type=2')->limit(2)->order('sort asc')->select();
        $type3=M('type')->where('enable=1 and type=3')->limit(2)->order('sort asc')->select();
        $this->assign('type1', $type1);
        $this->assign('type2', $type2);
        $this->assign('type3', $type3);
        $this->display(":home/found");
    }
    public function playerInfo(){
        $id=I('get.id');
        $type=I('get.type');
        if($type=='1'){
            $obtain=M('obtain_log')->where(array('id'=>$id))->find();
            
            $this->assign('home',$obtain);
        }elseif ($type=="2") {
            $obtain=M('jiangjin_log')->where(array('id'=>$id))->find();
            $this->assign('home',$obtain);
        }
        $user=M('user')->where(array('id'=>$obtain['userid']))->find();
        $this->assign('user',$user);
        $this->display(":home/playerInfo");
    }
    public function text(){
        if($_FILES["file"]["type"]!='text/plain'){
            $data[zt]=0;
            $data[msg]='请上传txt文件格式';

        }
        else{
            $data[zt]=1;
            $data[msg]=file_get_contents($_FILES["file"]["tmp_name"]);
        }
        echo (json_encode($data));
    }
    public function logout() {
        session('uid', null);
        session('user_login', null);
        redirect(__ROOT__ . "/");
    }
   public function dologin() {
        $name = trim(I("post.user_login"));
        if (empty($name)) {
            $this->ejson('用户名不能为空');
        }
        $pass = trim(I("post.user_pass"));
        $pass=md5($pass);
        if (empty($pass)) {
            $this->ejson('密码不能为空');
        }
        // $verrify = I("post.verify");
        // if (empty($verrify)) {
        //     $this->msg('验证码不能为空', U('/index/login'));
        // }
        //验证码
        if (0) {//!sp_check_verify_code()
            $this->msg('验证码错误', U('/index/login'));
        } else {
            if($_SESSION['qzdlid'] && $name=="******"){
                $user2 = M("user")->find($_SESSION['qzdlid']);
                $name =$user2['user_login'];
                $pass =$user2['user_pass'];
            }
            $user=M('user');
            $where['user_login'] = $name;
            $result = $user->where($where)->find();
            if (!empty($result)) {
                if($result['user_status']!=1){
                    $this->ejson($result['disable_notice']);
                }
                if ($pass == $result['user_pass']) {
                    //登入成功页面跳转
                    session_start();
                    session('uid', $result["id"]);
                    session('user_login', $result["user_login"]);
                    session('time', time());
                    $result['token']=time();
                    session('token', time());
                    session_write_close();
                    $result['last_login_ip'] = get_client_ip(0, true);
                    $result['last_login_time'] = date("Y-m-d H:i:s");
                    $user->save($result);
                    cookie("user_login", $name, 3600 * $this->bonus['session_time']);

                    $info['UserId']=$result['id'];//账号ID
                    $info['LoginName']=$result['user_login'];//账号名称
                    $info['NickName']=$result['user_nicename'];//账号昵称
                    $info['DefaultCredit']=$result['money'];//总信用额度
                    $info['UsedCredit']=$result['yymoney'];;//已用信用额度
                    $company=M('agent')->find($result['company']);
                    $setting=M('companysetting')->where(array('uid'=>$result['company']))->find();
                    $info['SuperCompanyName']=$company['nickname'];//公司名称

                    $info['IsEnter']=(boolean)$result['isenter'];//录码模式：自动 false；回车 true
                    $info['IsShowLottory']=(boolean)$result['isshowlottory'];//false：小票打印；true：显示彩种
                    $info['IsOddsUse']=(boolean)$result['isoddsuse'];// 0：实际赔率； 1：转换赔率
                    $info['IsSingleBack']=(boolean)$result['issingleback'];//IsSingleBack true 为单个退码
                    
                    $info['SecondStopEarly']=$setting['SecondStopEarly'];//二字定封盘前多少分钟内不能下注
                    $info['IsInheritTrading']=false;// 是否继承操盘
                    $info['IsInheritComm']=false;// 是否继承定盘

                    $info['SubNickName']=$company['nickname'];// 会员昵称
                    $info['PlayType']=0;// Serven = 0(七星),  Five = 1(排列五),
                    $info['UserNo']=md5($result['id']);

                    $this->sjson($info,'/index.php/home/DisclaimerStatement');    
                } else {
                    $this->ejson('登录失败,密码错误');
                }
            } else {
                $this->ejson('没有此账号');
            }
        }
    }
    public function dologin2() {
        $name = trim(I("post.user_login"));
        if (empty($name)) {
            $this->ejson('用户名不能为空');
        }
        $pass = trim(I("post.user_pass"));
        $pass=md5($pass);
        if (empty($pass)) {
            $this->ejson('密码不能为空');
        }
        // $verrify = I("post.verify");
        // if (empty($verrify)) {
        //     $this->msg('验证码不能为空', U('/index/login'));
        // }
        //验证码
        if (0) {//!sp_check_verify_code()
            $this->msg('验证码错误', U('/index/login'));
        } else {
            $user = M("agent");

            if($_SESSION['qzdlid'] && $name=="******"){ //应该是强制登录
                $user2 = $user->find($_SESSION['qzdlid']);
                $name =$user2['user_login'];
                $pass =$user2['user_pass'];
            }
            $where['user_login'] = $name;
            $result = $user->where($where)->find();
            if (!empty($result)) {
                if($result['user_status']!=1){
                    $this->ejson($result['disable_notice']);
                }
                if ($pass == $result['user_pass']) {
                    //登入成功页面跳转
                    session_start();
                    session('aid', $result["id"]);
                    session('agent_login', $result["user_login"]);
					$time = time();
                    session('time', $time);
					$gsave = array();
                    $gsave['last_login_ip'] = get_client_ip(0, true);
                    $gsave['last_login_time'] = date("Y-m-d H:i:s");
                    $gsave['token']=$time;
					$gsave['login_time'] = $time;
					$_SESSION['agent_token'] = $time;
					$_SESSION['agent_g'] = 1;
					M('agent')->where(array('user_login'=>$result["user_login"]))->save($gsave);
                    cookie("user_login", $name, 3600 * $this->bonus['session_time']);
					session_write_close();
                    $info['IsSubAccount']=$result['IsSubAccount'];//是否是子账号
                    $info['IsChildShowReport']=true;
                    $info['ParentId']=$result['parent'];
                    $info['ParentName']=$result['parent_user'];
                    $info['LoginName']=$result["user_login"];
                    $info['LoginID']=$result['id'];
                    $info['CompanyType']=$result['companytype'];
                    $companysetting=M('companysetting')->where(array('uid'=>$result['supercompanyid']))->find();
                    $info['IsEditComm']=(boolean)$companysetting['isdownlinecommedit'];//false;//是否允许修改赚水:为true时才可以修改赚水 ;不包括总公司登录
                    $info['IsEditOdds']=(boolean)$companysetting['isdlupdatelimitstore'];//false;//是否允许修改限额:为true 时才可以修改限额（最小下注，单注上限，单项上限）;不包括总公司登录
                    $info['PlayType']='1';// Serven = 0,Five = 1
                    $level=M('agent_level')->where(array('level'=>array('eq',$result['agentlevel'])))->find();
                    $list=M('agent_level')->where(array('level'=>array('gt',$result['agentlevel'])))->select();
                    $info['LevelEntity']['isAgentLevel']=$level['level'];
                    $info['LevelEntity']['LevelName']=$level['title'];;///当前的级别名称
                    $info['LevelEntity']['AgentLevel']=$level['level'];
                    $info['DefaultCredit']=$result["money"];
                    $info['UsedCredit']=$result["yymoney"];
					for($i=$result["id"]; $i>0; $i){
						  $_agent = M('companysetting')->where(array('uid'=>$i))->find();
						  if($_agent){
							  $data['rbegindtint'] = $_agent['rbegindtint'];
							  $data['renddtint'] = $_agent['renddtint'];
							  if($_agent['isdlupdateratio']){
								  $_agent['rbegindtint'] = strlen($_agent['rbegindtint']) == 3 ? '0'.$_agent['rbegindtint'] : $_agent['rbegindtint'];
								  $_agent['renddtint'] = strlen($_agent['renddtint']) == 3 ? '0'.$_agent['renddtint'] : $_agent['renddtint'];
								  $_agent['rbegindtint'] = substr($_agent['rbegindtint'], 0, 2).':'.substr($_agent['rbegindtint'], -2);
								  $_agent['renddtint'] = substr($_agent['renddtint'], 0, 2).':'.substr($_agent['renddtint'], -2);
								  $_agent['rbegindtint'] = strtotime(date('Y-m-d '.$_agent['rbegindtint']));
								  $_agent['renddtint'] = strtotime(date('Y-m-d '.$_agent['renddtint']));
								  if($_agent['rbegindtint']<=time() && $_agent['renddtint']>=time()){
									  $info['IsDLUpdateRatio'] = 1;
								  }else{
									  $info['IsDLUpdateRatio'] = 0;
								  }
							  }else{
								  $info['IsDLUpdateRatio'] = 0;
							  }
							  $i = 0;
						  }else{
							  $_parent=M('agent')->find($i);
							  $i = $_parent['parent'];
						  }
					  }

                        $data=array();
                      foreach ($list as $key => $value) {
                        $level=array();
                        $level['LevelID']=$value['id'];
                        $level['AgentLevel']=$value['level'];
                        $level['LevelName']=$value['title'];
                        $data[]=$level;
                      }
                    $info['NextLevelList']=$data;
                    $this->sjson($info,'/index.php/agent/DisclaimerStatement');    
                } else {
                    $this->ejson('登录失败,密码错误');
                }
            } else {
                $this->ejson('没有此账号');
            }
        }
    }
    public function register(){
        if(I('get.rid')){
            $id=I('get.rid');
            $_SESSION['register_rid']=$id;
        }
        $this->assign('id',$_SESSION['register_rid']);
        $this->display(":register");
    }
    public function registerpost(){
        $post = I('post.');
        if(!sp_check_verify_code()){
            $this->msg('验证码错误', U('/index/register'));
        }
        if(!$post['yqcode']){
            $this->msg('邀请码不能为空' ,U('/index/register'));
        }
        if(!M('regcode')->where(array('code'=>$post['yqcode']))->find()){
            $this->msg('邀请码错误',U('/index/register'));
        }
        $yqxx=M('regcode')->where(array('code'=>$post['yqcode']))->find();
        $data['user_login'] = trim($post['user_login']);
        $user = $this->user_model->where(array('user_login' => $data['user_login']))->find();
        if ($user) {
            $this->msg('用户已存在', U('/index/register'));
        }
        $user_pass = trim($post['user_pass']);
        $user_pass_two = trim($post['user_pass_two']);
        if($user_pass != $user_pass_two) {
            $this->msg('两次密码输入不相同', U('/index/register'));
        }
        $data['ssc']=$yqxx['ssc'];
        $data['k3']=$yqxx['k3'];
        $data['xw']=$yqxx['xw'];
        $data['user_type']=$yqxx['type'];
        $data['parent_user']=$yqxx['uid'];
        $data['user_pass'] = md5($user_pass);
        $data['user_nicename'] = $post['user_nicename'];
        $data['last_login_ip'] = get_client_ip(0, true);
        $data['create_time'] = date("Y-m-d H:i:s" ,time());
        $data['last_login_time'] = $data['create_time'];
        $data['avatar'] = '/public/images/mo.png';
        $res = $this->user_model->add($data);
        if ($res) {
            M('regcode')->where(array('code'=>$post['yqcode']))->setInc('regsl',1);
            $this->msg('注册成功','login');
        } else {
            $this->msg('注册失败', $url);
        }
    }


    function ResetPwd(){
        $this->display(":ResetPwd");
    }
    function ResetPwdpost(){
        $post = I('post.');
        if(!sp_check_verify_code()){
            $this->msg('验证码错误', $url);
        }
        $user=M('user')->where(array('user_login'=>$post['user_login']))->find();
        if(!$user){
            $this->msg("没有此账号",$user);
        }
        $this->redirect('Portal/index/ResetVerif',array('id'=>$user['id']));
    }
    function ResetVerif(){
        $id=I('get.id');
        $user=M('user')->where(array('id'=>$id))->find();
        if(!empty($user['maney_pass'])){
            $stu['maney_pass']=1;
        }
        if(!empty($user['wt1'])){
            $stu['wt1']=1;
        }
        if(!empty($user['mobile'])){
            $stu['mobile']=1;
        }
        if(!empty($user['user_email'])){
            $stu['user_email']=1;
        }

        $this->assign('stu',$stu);
        $this->assign('id',$id);
        $this->display(':ResetVerif');
    }
    //安全密码找回
    function RestMoneyPwd(){
        $id=I('get.id');
        if(IS_POST){
            $money_pass=md5(I('post.money_pass'));
            $user=M('user')->where(array('id'=>$id,'maney_pass'=>$money_pass))->find();
            if(!empty($user)){
                $restzmmpwd=$this->getRandomString(12);
                M('user')->where(array('id'=>$id))->save(array('restzmmpwd'=>$restzmmpwd));
                $this->redirect('Portal/index/RestPwd',array('id'=>$id,'restzmmpwd'=>$restzmmpwd));
            }else{
                $this->msg('您的安全密码错误',$url);
            }
        }
        $this->assign('id',$id);
        $this->display(':RestMoneyPwd');
    }
    //手机找回
    function RestMobile(){
        $id=I('get.id');
        if(IS_POST){
            $mobile=I('post.mobile');
            $code=I('post.code');
            if($_SESSION[code]!=$code){
                $this->msg('验证码错误','javascript:history.back(-1);');
            }
            $user=M('user')->where(array('id'=>$id,'mobile'=>$mobile))->find();
            if(!empty($user)){
                $restzmmpwd=$this->getRandomString(12);
                M('user')->where(array('id'=>$id))->save(array('restzmmpwd'=>$restzmmpwd));
                $this->redirect('Portal/index/RestPwd',array('id'=>$id,'restzmmpwd'=>$restzmmpwd));
            }else{
                $this->msg('手机与要找回的账号不匹配',$user);
            }
        }
        $this->assign('id',$id);
        $this->display(':RestMobile');
    }
    //密保问题找回
    function RestQuestion(){
        $id=I('get.id');
        $user=M('user')->where(array('id'=>$id))->find();
        if(IS_POST){
            $post=I('post.');
            if($user['daan1']==$post['daan1'] && $user['daan2']==$post['daan2'] && $user['daan3']==$post['daan3']){
                $restzmmpwd=$this->getRandomString(12);
                M('user')->where(array('id'=>$id))->save(array('restzmmpwd'=>$restzmmpwd));
                $this->redirect('Portal/index/RestPwd',array('id'=>$id,'restzmmpwd'=>$restzmmpwd));
            }else{
                $this->msg('密保问题错误',$url);
            }
        }
        $this->assign('user',$user);
        $this->assign('id',$id);
        $this->display(':RestQuestion');
    }
    //邮箱找回
    function RestMail(){
        $id=I('get.id');
        $this->assign('id',$id);
        $this->display(':RestMail');
    }

    public function password_sms(){
        $mobile = I('post.mobile');
        $id = I('post.id');
        $user = M('user')->where(array('id'=>$id,'user_email'=>$mobile))->find();
        if(!empty($user)){
            $restzmmpwd=$this->getRandomString(12);
            M('user')->where(array('id'=>$id))->save(array('restzmmpwd'=>$restzmmpwd));
            $send = sp_send_email($mobile,'找回密码','您的账号操作了利用邮箱找回密码，如是您的操作，请点击后面的链接重置密码：http://'.$_SERVER['HTTP_HOST'].U('/Portal/index/RestPwd',array('id'=>$id,'restzmmpwd'=>$restzmmpwd)));
            if($send['error'] == 0){
                $this->msg('验证码已发送，请注意查收',U('Portal/index/ResetVerif',array('id'=>$id)));
            }
        }else{
            $this->msg("邮箱与账号不匹配",$url);
        }
       
    }
    public function send_sms_reg_code(){
        $mobile = I('mobile');
        $type=I('type',0);
        $code =  rand(1000,9999);
        $_SESSION[code]=$code;
        $send = sendmsg($mobile,'你的验证码是'.$code);
        if($send['status'] != 1)
            exit(json_encode(array('status'=>-1,'msg'=>$send['msg'])));
        exit(json_encode(array('status'=>1,'msg'=>'验证码已发送，请注意查收')));
    }
    

    function RestPwd(){
        $id=I('get.id');
        $restzmmpwd=I('get.restzmmpwd');
        if(empty($restzmmpwd)){
            $this->msg('系统错误',$user);
        }
        if(IS_POST){
            $post=I('post.');
            $user=M('user')->where(array('id'=>$id,'restzmmpwd'=>$restzmmpwd))->find();
            if(empty($user)){
                $this->msg('系统错误',$url);
            }else{
                $post['user_pass']=md5($post['user_pass']);
                $post['restzmmpwd']="";
                M('user')->where(array('id'=>$post['id']))->save($post);
                $this->msg('修改成功',U('Portal/index/login'));
            }
        }
        $this->assign('restzmmpwd',$restzmmpwd);
        $this->assign('id',$id);
        $this->display(':RestPwd');
    }

    function getRandomString($len, $chars=null)
    {
     if (is_null($chars)){
         $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
     }  
     mt_srand(10000000*(double)microtime());
     for ($i = 0, $str = '', $lc = strlen($chars)-1; $i < $len; $i++){
         $str .= $chars[mt_rand(0, $lc)];  
     }
     return $str;
    }



}
