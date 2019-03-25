<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class UserController extends HomebaseController {

    protected $user_model;
    protected $user_bank;
    protected $bank;
    protected $session_id;
    protected $pay_mode;
    protected $pay_money;

    public function __construct() {
        parent::__construct();
        $this->check_login();
       $this->user_model = M('user');
       $this->user_bank = M('user_bank');
       $this->bank = M('bank');
       $this->session_id = session_id();
       $this->pay_mode = M('pay_mode');
       $this->pay_money = M('pay_money');


    }
    public function index(){
        if(sp_is_user_login()){ //已经登录时直接跳到首页
            redirect(__ROOT__."/");
        }else{
            $this->display(":login/index");
        }
    }
    public function xgbz(){
        $id=I('post.id');
        $where['id']=$id;
        $save['bz']=I('post.bz');
        M('regcode')->where($where)->save($save);
        $this->success();
    }
    public function regcode(){
        $where['uid']=$this->user['id'];
        $count =M('regcode')->where($where)->count();
        $page = $this->page($count,10);
        $list=M('regcode')->where($where)->limit($page->firstRow, $page->listRows)->select();
        $this->assign('list',$list);
        $this->assign("page", $page->show());
        $this->display();
    }
    function regdel(){
        $id=I('get.id');
        $where['id']=$id;
        M('regcode')->where($where)->delete();
        $this->msg('删除成功','/index.php/Portal/User/regcode');
    }
    public function regcodepost(){
        $data=I('post.');
        if($this->user['k3']<$data['k3']){
            $this->msg('设置比例应该小于你自己的比例',$url);
        }
        if($this->user['ssc']<$data['ssc']){
            $this->msg('设置比例应该小于你自己的比例',$url);
        }
        if($this->user['xw']<$data['xw']){
            $this->msg('设置比例应该小于你自己的比例',$url);
        }
        $save['k3']=$data['k3'];
        $save['ssc']=$data['ssc'];
        $save['xw']=$data['xw'];
        $save['type']=$data['type'];
        $save['uid']=$this->user['id'];
        $save['time']=$this->time;
        $save['code']=$this->getRandomString('8');
        M('regcode')->add($save);
        $this->msg('添加邀请码成功','/index.php/Portal/User/regcode');
    }
    public function user(){
        $id = $_SESSION['uid'];
        $user = $this->user_model->where(array('id'=>$id))->find();
        if(!$user['avatar']){
           $user['avatar']='/Uploads/mo.png';
        }
        $level = M('user_level')->select();
        $this->assign('level',$level); 

        $where['level']=$user['level']+1;
        $user_level = M('user_level')->where($where)->find();
        $this->assign('user_level',$user_level);

        $this->assign('user',$user);

        $this->display('index');
    }
    public function personalInfo(){
        $id = $_SESSION['uid'];
        $user = $this->user_model->where(array('id'=>$id))->find();
        if(!$user['avatar']){
           $user['avatar']='/Uploads/mo.png';
        }
        $level = M('user_level')->select();
        $this->assign('level',$level);

        $where['level']=$user['level']+1;
        $user_level = M('user_level')->where($where)->find();
        $this->assign('user_level',$user_level);
        $this->assign('user',$user);

        $this->display();
    }
    public function agentCenter(){
        $this->display();
    }
    public function edit_post(){
        $post = I('post.post');
        // $user=$this->user_model->where(array('user_nicename'=>$post['user_nicename']))->find();
        // if($user){
        //     $this->msg('已存在此昵称','User/user');
        // }
        $res = $this->user_model->where(array('user_login' => $this->user_login))->save($post);
        if($res){
            $this->msg('修改成功',$url);
        }else{
            $this->msg('修改失败',$url);
        }
    }
    public function setMobile(){  //绑定手机
        if(IS_POST){
            $mobile = I('post.mobile');
            $code = I('post.code');
            //检查是否手机找回
                if($this->user_model->where(array('mobile'=>$mobile))->find() !== NULL){
                    $this->msg('此手机号已绑定','javascript:history.back(-1);');
                }
                if($_SESSION[code]!=$code){
                    $this->msg('验证码错误','javascript:history.back(-1);');
                }else{
                    $data['mobile']=$mobile;
                    
                    if($this->user_model->where(array('user_login'=>$this->user_login))->save($data) !==flase){
                        $this->msg('绑定手机成功','javascript:history.back(-1);');
                    }
                }
        }
        
            $this->display();

    }
    public function send_sms_code(){
        $mobile = I('mobile');
        $type=I('type',0);
        $code =  rand(1000,9999);
        $_SESSION[code]=$code;
        $send = sp_send_email($mobile,'绑定邮箱','你的验证码是'.$code);
        if($send['error'] == 1)
            exit(json_encode(array('status'=>-1,'msg'=>$send['message'])));
        exit(json_encode(array('status'=>1,'msg'=>'验证码已发送，请注意查收')));
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
    

    public function setMail(){  //绑定邮箱
        if(IS_POST){
            $mobile = I('post.mobile');
            $code = I('post.code');
            //检查是否手机找回
                if($this->user_model->where(array('user_email'=>$mobile))->find() !== NULL){
                    $this->msg('此邮箱已绑定','javascript:history.back(-1);');
                }
                if($_SESSION[code]!=$code){
                    $this->msg('验证码错误','javascript:history.back(-1);');
                }else{
                    $data['user_email']=$mobile;
                    
                    if($this->user_model->where(array('user_login'=>$this->user_login))->save($data) !==flase){
                        $this->msg('绑定邮箱成功','javascript:history.back(-1);');
                    }
                }
        }
        $this->display();
    }
    public function kuicsemail(){
        send_email('137467088@qq.com','验证码', '123456');exit;
    }
    public function manageBankcard(){  //银行卡列表
        $id = $_SESSION['uid'];
        $bank_list = $this->bank->select();
        $sun = $this->user_bank->where(array('uid'=>$id))->count();
        $user = $this->user_model->where(array('id'=>$id))->find();

        $list = $this->user_bank->where(array('uid'=>$id))->select();
        foreach ($list as $key => $value) {
            $bank_list = $this->bank->where(array('id'=>$value['bank_id']))->find();
            //$list[$key]['card'] = substr($value['card'] ,-4);
            $list[$key]['bank_name'] = $value['bank_name'];
            $list[$key]['logo'] = $bank_list['logo'];
            $list[$key]['mobile'] = $user['mobile'];
        }
        $this->assign('sun',$sun);
        $this->assign('list',$list);
        $this->display();
    }

    public function setBankcard(){ //绑定银行卡
        if(IS_POST){
            $id = $_SESSION['uid'];
            $user = $this->user_model->where(array('id'=>$id))->find();
            $post = I('post.post');
            $post['uid'] = $id;
            $bank=M('bank')->where(array('id'=>$post['bank_id']))->find();

            $post['bank_name']=$bank['name'];
            $post['city']=$post['sheng'].$post['shi'];
            $maney_pass=md5(I('post.maney_pass'));
            if($maney_pass!=$user['maney_pass']){
                $this->msg('安全密码不正确','javascript:history.back(-1);');
            }
            $card_two=I('post.card_two');
            if($post['card']!=$card_two){
                $this->msg('两次银行卡号不同','javascript:history.back(-1);');
            }
            $sun = $this->user_bank->where(array('uid'=>$id))->count();
            if($sun>=5){
                $this->msg('银行卡最多绑定5个',$url);
            }
            $res = $this->user_bank->add($post);
            if($res){
                $this->msg('绑定成功','User/manageBankcard');
            }else{
                $this->msg('绑定失败','javascript:history.back(-1);');
            }
        }
        $banks=M('bank')->where(array('isType'=>'0'))->select();
        $this->assign('bank',$banks);
        $this->display();
    }
    public function delBankcard(){

    }
    public function editBankcard(){

    }
    public function verifyPwd(){  //修改密码
        $this->display();
    }
    public function verifyPwd_post(){
        if(IS_POST){
            $post=I('post.');
            $user=$this->user_model->where(array('user_login'=>$this->user_login))->find();
            if($user){
                $old=md5(trim($post['old_password']));
                if($user['user_pass']!=$old){
                    $this->msg('原密码错误','javascript:history.back(-1);');
                }
                if($post['new_password']!=$post['two_new_password']){
                    $this->msg('请确认新密码','javascript:history.back(-1);');
                }
                $data['user_pass']=md5(trim($post['new_password']));
                $edit=$this->user_model->where(array('user_login'=>$this->user_login))->save($data);
                if($edit){
                    $this->msg('修改成功',$url);
                }
            }else{
                $this->msg('系统错误',U('portal/index/login'));
            }
            

         

        }
    }
    public function securityPwd(){  //修改支付密码
        if(IS_POST){
            $id = $_SESSION['uid'];
            $user = $this->user_model->where(array('id'=>$id))->find();
            $post=I('post.post');
            $old = I('post.user_pass');
            $new = I('post.maney_pass_two');
            if($old==$new){
                $this->msg('登录密码与安全码相同,请更换','javascript:history.back(-1);');
            }
            $user_pass=md5($old);
            if($user_pass!=$user['user_pass']){
                $this->msg('登录密码不正确','javascript:history.back(-1);');
            }
            $maney_pass_two=I('post.maney_pass_two');
            if($post['maney_pass']!=$new){
                $this->msg('两次安全密码不同','javascript:history.back(-1);');
            }
            $post['maney_pass']=md5($new);
            $res = $this->user_model->where(array('id'=>$id))->save($post);
            if($res){
                $this->msg('设置成功','User');
            }else{
                $this->msg('设置失败','javascript:history.back(-1);');
            }
        }
        $this->display(); 
    }
    public function setQuestion(){  //密保问题
        if(IS_POST){
            $id = $_SESSION['uid'];
            $post=I('post.');
            $save=$this->user_model->where(array('id'=>$id))->save($post);
            if($save){
                $this->msg('设置成功','User');
            }else{
                $this->msg('设置失败','javascript:history.back(-1);');
            }

        }
        $this->display();
    }
    public function securityCenter(){ //安全中心
        $id = $_SESSION['uid'];
        $user = $this->user_model->where(array('id'=>$id))->find();
        $i=1;
        if(!empty($user['maney_pass'])){
            $i+=1;
            $stu['maney_pass']=1;
        }
        if(!empty($user['wt1'])){
            $i+=1;
            $stu['wt1']=1;
        }
        if(!empty($user['mobile'])){
            $i+=1;
            $stu['mobile']=1;
        }
        if(!empty($user['user_email'])){
            $i+=1;
            $stu['user_email']=1;
        }
        // if(!empty($user[''])){
        //     $i+=1;
        //     $stu['']=1;
        // }
        $this->assign('i',$i);
        $this->assign('stu',$stu);
        $Ip = new \Org\Net\IpLocation('UTFWry.dat'); // 实例化类 参数表示IP地址库文件
        $area = $Ip->getlocation($user['last_login_ip']); // 获取某个IP地址所在的位置
        $this->assign('area',$area);
        $this->assign('user',$user);

        $this->display();
    }

    public function orderDetail(){
        $id=I('get.id',0);
        $where['a.tzid']=$id;
        $betxx=M('bets')->field('b.*,a.type,min(a.actionNo) as qshm,sum(a.bonus) as bonus')->alias('a')->join('jz_order b on b.id=a.tzid')->where($where)->order('b.id desc')->group('a.tzid')->select();
        $wflist=M('bets')->field('a.*')->alias('a')->join('jz_order b on b.id=a.tzid')->where($where)->order('b.id desc')->group('a.actionData')->select();
        $list =M('bets')->alias('a')->join('jz_order b on b.id=a.tzid')->where($where)->group('a.actionNo')->select();
        $count=count($list);
        $page = $this->page($count,10);
        $list=M('bets')->field('a.*,sum(a.amount*a.beishu*a.actionnum) as zamount,sum(a.bonus) as zbonus')->alias('a')->join('jz_order b on b.id=a.tzid')->where($where)->limit($page->firstRow, $page->listRows)->order('b.id desc')->group('a.actionNo')->select();
        $this->assign('list',$list);
         $this->assign('wflist',$wflist);
        $this->assign('betxx',$betxx['0']);
        $this->assign("page", $page->show());
        $this->display();
    }
    public function betDetail(){
            $id=I('get.id',0);
            $actionNo=I('get.actionNo',0);
            $where['tzid']=$id;
            if($actionNo){
            $where['actionNo']=$actionNo;
            }
            $betxx=M('bets')->field('*,sum(amount*beishu*actionnum) as zamount,sum(bonus) as zbonus')->where($where)->group('tzid')->select();
            $this->assign("betxx", $betxx[0]);
            $betlist=M('bets')->where($where)->select();
            $this->assign("betlist", $betlist);
            $this->assign("where", $where);
            $this->display();
    }
    public function betRecord(){
        $where='b.type=0 and a.uid="'.$this->user[id].'" ';
        $zt=I('get.zt',0);
        if($zt==1){
           $where=$where." and a.bonus>0 ";
        }
        if($zt==2){
           $where=$where." and a.lotteryNo!='' and a.bonus=0 ";
        }
        if($zt==3){
           $where=$where." and a.lotteryNo='' and a.isDelete=0 ";
        }
        if(I('get.cpKind')){
            $where=$where." and a.type='".I('get.cpKind')."' ";
        }
        if(I('get.starttime')){
            $where=$where." and a.actionTime>='".strtotime(I('get.starttime').' 00:00:00')."' ";
        }
         if(I('get.endtime')){
            $where=$where." and a.actionTime<='".strtotime(I('get.endtime').' 23:59:59')."' ";
        }
        $list =M('bets')->alias('a')->join('jz_order b on b.id=a.tzid')->where($where)->group('a.tzid')->select();
        $count=count($list);
        $page = $this->page($count,7);
        $list=M('bets')->field('a.*,sum(a.amount*a.beiShu*a.actionNum) as gamount,sum(a.bonus) as gbonus')->alias('a')->join('jz_order b on b.id=a.tzid')->where($where)->order('b.id desc')->group('a.tzid')->limit($page->firstRow, $page->listRows)->select();
        $typelist=M('type')->order('sort asc')->select();

        $tzje=M('bets')->where(' uid='.$this->user[id].' and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('actionNum*amount*beiShu');
        $zjje=M('bets')->where(' uid='.$this->user[id].' and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('bonus');
        $zyl=M('bets')->where(' uid='.$this->user[id].' and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('profit');
        $this->assign('get',$_GET);
         $this->assign('tzje',$tzje+0.00);
          $this->assign('zjje',$zjje+0.00);
           $this->assign('zyl',$zyl+0.00);
        $this->assign('list',$list);
        $this->assign('typelist',$typelist);
        $this->assign("page", $page->show());
        $this->display();
    }
    public function seekOrder(){
         $where='b.type=1 and a.uid="'.$this->user[id].'" ';
        $zt=I('get.zt',0);
        if($zt==1){
           $where=$where." and a.bonus>0 ";
        }
        if($zt==2){
           $where=$where." and a.lotteryNo!='' and a.bonus=0 ";
        }
        if($zt==3){
           $where=$where." and a.lotteryNo='' and a.isDelete=0 ";
        }
        if(I('get.cpKind')){
            $where=$where." and a.type='".I('get.cpKind')."' ";
        }
        if(I('get.starttime')){
            $where=$where." and a.actionTime>='".strtotime(I('get.starttime').' 00:00:00')."' ";
        }
         if(I('get.endtime')){
            $where=$where." and a.actionTime<='".strtotime(I('get.endtime').' 23:59:59')."' ";
        }
        $list =M('bets')->alias('a')->join('jz_order b on b.id=a.tzid')->where($where)->group('a.tzid')->select();
        $count=count($list);
        $page = $this->page($count,10);
        $list=M('bets')->field('b.*,a.type,min(a.actionNo) as qshm,sum(a.bonus) as bonus')->alias('a')->join('jz_order b on b.id=a.tzid')->where($where)->limit($page->firstRow, $page->listRows)->order('b.id desc')->group('a.tzid')->select();
        $typelist=M('type')->order('sort asc')->select();

        $this->assign('get',$_GET);
        $this->assign('list',$list);
        $this->assign('typelist',$typelist);
        $this->assign("page", $page->show());
        $this->display();
    }
    public function billRecord(){
        $where=' uid="'.$this->user[id].'" ';
        $zt=I('get.zt',0);
        if($zt==1){
           $where=$where." and coin>0 ";
        }
        if($zt==2){
           $where=$where." and coin<0 ";
        }
        if(I('get.cpKind')){
            $where=$where." and liqtype='".I('get.cpKind')."' ";
        }
        if(I('get.starttime')){
            $where=$where." and actionTime>='".strtotime(I('get.starttime').' 00:00:00')."' ";
        }
         if(I('get.endtime')){
            $where=$where." and actionTime<='".strtotime(I('get.endtime').' 23:59:59')."' ";
        }
        $count =M('coin_log')->where($where)->count();
        $page = $this->page($count,8);
        $list=M('coin_log')->where($where)->limit($page->firstRow, $page->listRows)->order('id desc')->select();
        $this->assign('get',$_GET);
        $this->assign('list',$list);
        $this->assign("page", $page->show());
        $this->display();
    }
    public function PLstatement(){
        $tzje=M('coin_log')->where('uid='.$this->user[id].' and liqtype=4 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $tzje2=M('coin_log')->where('uid='.$this->user[id].' and liqtype=8 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $tzje3=M('coin_log')->where('uid='.$this->user[id].' and liqtype=17 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $zjje=M('coin_log')->where('uid='.$this->user[id].' and liqtype=2 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $czze=M('coin_log')->where('uid='.$this->user[id].' and liqtype=1 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $txze=M('coin_log')->where('uid='.$this->user[id].' and liqtype=3 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $txze2=M('coin_log')->where('uid='.$this->user[id].' and liqtype=6 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $hdze=M('coin_log')->where('uid='.$this->user[id].' and liqtype=7 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $fdze=M('coin_log')->where('uid='.$this->user[id].' and liqtype=5 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');

        $this->assign('fdze',$fdze+0.00);
        $this->assign('czze',$czze+0.00);
        $this->assign('txze',$txze2-$txze+0.00);
        $this->assign('hdze',$hdze+0.00);

        $this->assign('tzje',$tzje2+$tzje3-$tzje+0.00);

        $this->assign('zjje',$zjje+0.00);


        $this->assign('zyl',$zjje-($tzje2+$tzje3-$tzje)+$fdze+$hdze+0.00);
        $this->display();
    }
    public function agentIntro(){
        $tag='cid:4;order:listorder asc';
        $post=sp_sql_posts($tag); 
        $this->assign('post',$post[0]);
        $this->display();
    }
    public function agentReport(){
        if($_GET[account]){
            $user=M('user')->where(array('user_login'=>$_GET[account]))->find();
            if(!$user){
                $this->error('该账户不存在');
            }
            $ulist=tdlist($user['id']);;
        }
        else{
        $ulist=tdlist($this->user[id]);
        }
        $tzje=M('coin_log')->where('uid in ('.implode(',', $ulist).') and liqtype=4 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
        $tzrs=M('coin_log')->where('uid in ('.implode(',', $ulist).') and liqtype=4 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->count('id');
        $tzje2=M('coin_log')->where('uid in ('.implode(',', $ulist).') and liqtype=8 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
        $tzje3=M('coin_log')->where('uid in ('.implode(',', $ulist).') and liqtype=17 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
        $zjje=M('coin_log')->where('uid in ('.implode(',', $ulist).') and liqtype=2 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
        $czze=M('coin_log')->where('uid in ('.implode(',', $ulist).')and liqtype=1 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
        $txze=M('coin_log')->where('uid in ('.implode(',', $ulist).') and liqtype=3 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
        $txze2=M('coin_log')->where('uid in ('.implode(',', $ulist).') and liqtype=6 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
        $hdze=M('coin_log')->where('uid in ('.implode(',', $ulist).') and liqtype=7 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
        $fdze=M('coin_log')->where('uid in ('.implode(',', $ulist).') and liqtype=5 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
        $tdye=M('user')->where('id in ('.implode(',', $ulist).')')->sum('money');
        $regrs=M('user')->where('id in ('.implode(',', $ulist).') and create_time<="'.date($_GET[endTime].' 23:59:59',time()).'" and create_time>="'.date($_GET[startTime].' 00:00:00',time()).'"')->count('id');

        $this->assign('regrs',$regrs+0);
        $this->assign('tzrs',$tzrs+0);
        $this->assign('fdze',$fdze+0.00);
        $this->assign('czze',$czze+0.00);
        $this->assign('txze',$txze2-$txze+0.00);
        $this->assign('hdze',$hdze+0.00);

        $this->assign('tzje',$tzje2+$tzje3-$tzje+0.00);

        $this->assign('zjje',$zjje+0.00);
        $this->assign('xjrs',count($ulist)-1);
        $this->assign('tdye',$tdye+0.00);


        $this->assign('zyl',$zjje-($tzje2+$tzje3-$tzje)+$fdze+$hdze+0.00);    
        $this->assign("get", $_GET);
        $this->display();
    }
    public function lowerReport(){
        $ulist=tdlist2($this->user[id]);
        if(!$_GET[endTime]){
            $_GET[endTime]=date('Y-m-d',time());
        }
        if(!$_GET[startTime]){
            $_GET[startTime]=date('Y-m-d',time());
        }
        if(!empty($ulist)){
            $where['id']=array('in',$ulist);
            $count =M('user')->where($where)->count();

            $page = $this->page($count,10);
            $list=M('user')->where($where)->limit($page->firstRow, $page->listRows)->order('id desc')->select();
            foreach ($list as $key => $value) {
                $tzje=M('coin_log')->where('uid='.$value[id].' and liqtype=4 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
                $tzje2=M('coin_log')->where('uid='.$value[id].' and liqtype=8 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
                $tzje3=M('coin_log')->where('uid='.$value[id].' and liqtype=17 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
                $zjje=M('coin_log')->where('uid='.$value[id].' and liqtype=2 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
                $czze=M('coin_log')->where('uid='.$value[id].' and liqtype=1 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
                $txze=M('coin_log')->where('uid='.$value[id].' and liqtype=3 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
                $txze2=M('coin_log')->where('uid='.$value[id].' and liqtype=6 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
                $hdze=M('coin_log')->where('uid='.$value[id].' and liqtype=7 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
                $fdze=M('coin_log')->where('uid='.$value[id].' and liqtype=5 and actionTime<='.strtotime(date($_GET[endTime].' 23:59:59',time())).' and actionTime>='.strtotime(date($_GET[startTime].' 00:00:00',time())))->sum('coin');
                $list[$key][tzje]=$tzje2+$tzje3-$tzje+0;
                $list[$key][fdze]=$fdze+0;
                $list[$key][czze]=$czze+0;
                $list[$key][txze]=$txze2-$txze+0;
                $list[$key][hdze]=$hdze+0;
                $list[$key][zjje]=$zjje+0;
                $list[$key][zyl]=$zjje-($tzje2+$tzje3-$tzje)+$fdze+$hdze+0;
            }
            $type['0']='代理';
            $type['1']='玩家';
            $this->assign("type", $type);
            $this->assign("get", $_GET);
            $this->assign("list", $list);
            $this->assign("page", $page->show());
        }
        $this->display();
    }
    public function manageInvite(){
        $this->display();
    }
    public function agentMember(){
        $where['parent_user']=$this->user['id'];
        if(I('get.user_login')){
            $where['user_login']=I('get.user_login');
        }
        if(I('get.type')){
            $where['user_type']=I('get.type')-1;
        }
        $count =M('user')->where($where)->count();
        $page = $this->page($count,10);
        $list=M('user')->where($where)->limit($page->firstRow, $page->listRows)->select();
        $this->assign('get',$_GET);
        $this->assign('list',$list);
        $this->assign("page", $page->show());
        $this->display();
    }
    public function agentBetRecord(){
        $userlist=M('user')->field('id')->where(' parent_user="'.$this->user[id].'" ')->select();
        foreach ($userlist as $key => $value) {
            $ulist[]=$value['id'];
        }
        // $where='b.type=0 and a.uid in ("'.implode(',',$ulist).'") ';
        $where='b.type=0 and a.uid in ('.implode(',',$ulist).') ';
        $zt=I('get.zt',0);
        if($zt==1){
           $where=$where." and a.bonus>0 ";
        }
        if($zt==2){
           $where=$where." and a.lotteryNo!='' and a.bonus=0 ";
        }
        if($zt==3){
           $where=$where." and a.lotteryNo='' and a.isDelete=0 ";
        }
        if(I('get.user_login')){
            $uuser=M('user')->where(array('user_login'=>I('get.user_login')))->find();
            $where=$where." and a.uid='".$uuser['id']."' ";
        }
        if(I('get.cpKind')){
            $where=$where." and a.type='".I('get.cpKind')."' ";
        }
        if(I('get.starttime')){
            $where=$where." and a.actionTime>='".strtotime(I('get.starttime').' 00:00:00')."' ";
        }
         if(I('get.endtime')){
            $where=$where." and a.actionTime<='".strtotime(I('get.endtime').' 23:59:59')."' ";
        }
        $list =M('bets')->alias('a')->join('jz_order b on b.id=a.tzid')->where($where)->group('a.tzid')->select();
        $count=count($list);
        $page = $this->page($count,7);
        $list=M('bets')->field('a.*,sum(a.amount*a.beishu*a.actionnum) as amount,sum(a.bonus) as bonus')->alias('a')->join('jz_order b on b.id=a.tzid')->where($where)->limit($page->firstRow, $page->listRows)->order('b.id desc')->group('a.tzid')->select();
        $typelist=M('type')->order('sort asc')->select();
        $this->assign('get',$_GET);
        $this->assign('list',$list);
        $this->assign('typelist',$typelist);
        $this->assign("page", $page->show());
        $this->display();
    }
    public function agentBillRecord(){
        $userlist=M('user')->field('id')->where(' parent_user="'.$this->user[id].'" ')->select();
        foreach ($userlist as $key => $value) {
            $ulist[]=$value['id'];
        }

        // $where=' uid in ("'.implode(',',$ulist).'") ';
        $where=' uid in ('.implode(',',$ulist).') ';
        $zt=I('get.zt',0);
        if($zt==1){
           $where=$where." and coin>0 ";
        }
        if($zt==2){
           $where=$where." and coin<0 ";
        }
        if(I('get.user_login')){
            $uuser=M('user')->where(array('user_login'=>I('get.user_login')))->find();
            $where=$where." and uid='".$uuser['id']."' ";
        }
        if(I('get.cpKind')){
            $where=$where." and liqtype='".I('get.cpKind')."' ";
        }
        if(I('get.starttime')){
            $where=$where." and actionTime>='".strtotime(I('get.starttime').' 00:00:00')."' ";
        }
         if(I('get.endtime')){
            $where=$where." and actionTime<='".strtotime(I('get.endtime').' 23:59:59')."' ";
        }

        $count =M('coin_log')->where($where)->count();

        $page = $this->page($count,8);
        $list=M('coin_log')->where($where)->limit($page->firstRow, $page->listRows)->order('id desc')->select();

        $this->assign('get',$_GET);
        $this->assign('list',$list);
        $this->assign("page", $page->show());
        $this->display();
    }
     public function money(){
        echo $this->user[money];
     }
    public function ebankPay(){
        if(IS_POST){
            $post=I('post.');
            $post['add_time']=date('Y-m-d H:i:s',time());
            $post['user_login']=$this->user['user_login'];
            // print_r($post);
            // exit;
            $r=$this->pay_money->add($post);
            if($r){
                $this->msg('提交付款成功，等待审核中',U('Portal/User/ebankPay'));
            }else{
                $this->msg('提交失败','javascript:history.back(-1);');
            }
        }
        $add_time=date('Y-m-d',time());
        $addtime=strtotime($add_time);
        $where="user_login='".$this->user_login."' and status = '0'";
        $tixing=M('pay_money')->where($where)->order('id desc')->find();
        if($tixing['tixing']=='0'){
            $istixing='1';
        }else{
            $istixing='0';
        }
        $this->assign('istixing',$istixing);

        $list=$this->pay_mode->where(array('type'=>'0','state'=>'0'))->select();
        $this->assign('list',$list);
        $pay['user_play_wait_time']=$this->bonus['user_play_wait_time'];
        $pay['user_play_wait_qq']=$this->bonus['user_play_wait_qq'];
        $pay['bank_pay_min']=$this->bonus['bank_pay_min'];
        $pay['bank_pay_max']=$this->bonus['bank_pay_max'];
        $this->assign('pay',$pay);
        $this->display();
    }
    public function recharge(){
        $this->display();
    }
    public function bankWay(){

        if(IS_POST){
            $post=I('post.');
            $post['add_time']=date('Y-m-d H:i:s',time());
            $post['user_login']=$this->user['user_login'];
            // print_r($post);
            // exit;
            $r=$this->pay_money->add($post);
            if($r){
                $this->msg('提交付款成功，等待审核中',$url);
            }else{
                $this->msg('提交失败',$url);
            }
        }
        $list=$this->pay_mode->where(array('type'=>'0'))->select();
        $this->assign('list',$list);
        $this->display();
    }
    public function alipay(){
        $list=$this->pay_mode->where(array('type'=>'1'))->select();
        if(IS_POST){
            $post=I('post.');
            $post['add_time']=date('Y-m-d H:i:s',time());
            $post['user_login']=$this->user_login;
            $r=$this->pay_money->add($post);
            if($r){
                $this->msg('提交付款成功，等待审核中',$url);
            }else{
                $this->msg('提交失败');
            }
        }
        $this->assign('list',$list[0]);
        $pay['user_play_wait_time']=$this->bonus['user_play_wait_time'];
        $pay['user_play_wait_qq']=$this->bonus['user_play_wait_qq'];
        $this->assign('pay',$pay);
        $this->display();
    }
    public function wechatPay(){
        $list=$this->pay_mode->where(array('type'=>'2'))->select();
        if(IS_POST){
            $post=I('post.');
            $post['add_time']=date('Y-m-d H:i:s',time());
            $post['user_login']=$this->user_login;
            $r=$this->pay_money->add($post);
            if($r){
                $this->msg('提交付款成功，等待审核中',$url);
            }else{
                $this->msg('提交失败');
            }
        }
        $this->assign('list',$list[0]);
        $pay['user_play_wait_time']=$this->bonus['user_play_wait_time'];
        $pay['user_play_wait_qq']=$this->bonus['user_play_wait_qq'];
        $this->assign('pay',$pay);
        $this->display();
    }
    public function coll_money(){
        $tx_cishu=$this->bonus['tx_cishu'];
        $datatime=strtotime(date('Y-m-d'));
        $datazz='user_login = "'.$this->user_login.'" and add_time >="'.$datatime.'"';
        $sun=M('pay_coll_money')->where($datazz)->count();
        $cishu=$tx_cishu-$sun;

        if(IS_POST){
            $post=I('post.');
            $data['user_login']=$this->user_login;
            $data['maney_pass']=md5($post['maney_pass']);
            if(!$post['user_bank_id']){
                $this->msg('请选择要提现的账户',$url);
            }
            $sum=$this->bonus['min_coll_money'];
            $tishi=$this->bonus['min_coll_money_prompt'];
            if($sum>$post['number']){
                $this->msg("$tishi",$url);
            }
            if($cishu<='0'){
                $this->msg('今天的提现次数已用完，请明天再试',$url);
            }
            if($this->user_model->where($data)->find() !== NULL){
                $user_bank=$this->user_bank->where(array('id'=>$post['user_bank_id']))->find();

                $user=$this->user_model->where(array('user_login'=>$this->user_login))->find();
                if($user['money']<=$post['number']){
                    $this->msg('帐户余额少于提现金额',$url);
                }
                
                $data2['user_login']=$this->user_login;
                $data2['user_bank_id']=$post['user_bank_id'];
                $data2['number']=$post['number'];
                $data2['bank']=$user_bank['bank_name'];
                $data2['city']=$user_bank['city'];
                $data2['bank_card']=$user_bank['card'];
                $data2['add_time']=time();

                $r=M('pay_coll_money')->add($data2);
                moneybh($this->user[id],-$post['number'],'提现扣款',array('liqtype'=>'3'));
                if($r){
                    $this->msg('提交提现成功，等待审核',U('Portal/User/coll_money'));
                }else{
                    $this->msg('提交失败');
                }

            }else{
                $this->msg('支付密码错误');
            }
        }
        $ketixian=$this->ketixian();
        $this->assign('ketixian',$ketixian);

        $add_time=date('Y-m-d',time());
        $addtime=strtotime($add_time);
        $where="user_login='".$this->user_login."' and status = '0'";
        $tixing=M('pay_coll_money')->where($where)->order('id desc')->find();
        if($tixing['tixing']=='0'){
            $istixing='1';
        }else{
            $istixing='0';
        }
        $this->assign('istixing',$istixing);
        $this->assign('tx_cishu',$cishu);
        $users=M('user')->where(array('id'=>$this->user[id]))->find();
        $this->assign('user',$users);
        $condition['a.user_login']=$this->user_login;
        $list = $this->user_model
                    ->alias('a')
                    ->field('a.*,c.*,b.*')
                    ->join('jz_user_bank b ON a.id=b.uid')
                    ->join('jz_bank c ON b.bank_id=c.id')
                    ->where(array('a.user_login' => $this->user_login))
                    ->select();
        $this->assign('list',$list);
        $min_coll_money=$this->bonus['min_coll_money'];
        $this->assign('min_coll_money',$min_coll_money);
        if(!$users['maney_pass']){
            $this->msg('您还未绑定安全密码',U('Portal/user/securityPwd'));
        }
        if(empty($list)){
            $this->msg('您还未绑定银行卡',U('Portal/user/manageBankcard'));
        }
        $this->display();
    }
    public function ketixian(){
        $uid=$this->user['id'];

        $czze=M('coin_log')->where('uid='.$uid.' and liqtype=1 ')->sum('coin');//充值入款

        $zjje=M('coin_log')->where('uid='.$uid.' and liqtype=2')->sum('coin');//奖金派送

        $txze=M('coin_log')->where('uid='.$uid.' and liqtype=3 ')->sum('coin');//提现扣款

        $tzje=M('coin_log')->where('uid='.$uid.' and liqtype=4 ')->sum('coin');//投注扣款

        $fdze=M('coin_log')->where('uid='.$uid.' and liqtype=5 ')->sum('coin');//投注返点

        $txze2=M('coin_log')->where('uid='.$uid.' and liqtype=6')->sum('coin');//奖金派送

        $hdze=M('coin_log')->where('uid='.$uid.' and liqtype=7 ')->sum('coin');//活动礼金

        $tzje2=M('coin_log')->where('uid='.$uid.' and liqtype=8  ')->sum('coin');//最好停止

        $tzje3=M('coin_log')->where('uid='.$uid.' and liqtype=17 ')->sum('coin');//投注撤单

        $li=M('coin_log')->where('uid='.$uid.' and liqtype=3')->order('id desc')->find();

        $dds=$tzje2+$tzje3+$fdze+$zjje+$hdze-$tzje;
        $user_money=M('user')->where(array('id'=>$uid))->find();
        $as=$dds-$li['coin']+0;
        if($user_money['money']<$dds){
            $as=$user_money['money']-200;
        }
        if($as<=0){
            $as=0;
        }
        return $as;
    }
    public function tixing(){
        $type=I('get.type');
        if($type=="tixian"){
            $tixing=M('pay_coll_money')->where(array('user_login'=>$this->user_login,'status'=>'0'))->order('id desc')->find();
            if($tixing['tixing']<1){
                $guanli_mobile=$this->bonus['tixing_pay_mobile'];
                $dd=sendmsg($guanli_mobile,'用户'.$this->user_login.'提现('.$tixing[number].'元),订单已生成，请及时处理');
                if($dd['status']=='0'){
                    $ti=M('pay_coll_money')->where(array('id'=>$tixing['id']))->setInc('tixing',1);
                    echo "已通知管理员";
                }
            }else{
                $qq=$this->bonus['user_play_wait_qq'];
                echo "已提醒过管理员，请等待，或者添加管理员QQ:".$qq;
            }
        }
        if($type=="congzi"){
             $tixing=M('pay_money')->where(array('user_login'=>$this->user_login,'status'=>'0'))->order('id desc')->find();
            if($tixing['tixing']<1){
                $guanli_mobile=$this->bonus['tixing_pay_mobile'];
                $dd=sendmsg($guanli_mobile,'用户'.$this->user_login.'充值('.$tixing[number].'元),订单已生成，请及时处理');
                if($dd['status']=='0'){
                    $ti=M('pay_money')->where(array('id'=>$tixing['id']))->setInc('tixing',1);
                    echo "已通知管理员";
                }
            }else{
                $qq=$this->bonus['user_play_wait_qq'];
                echo "已提醒过管理员，请等待，或者添加管理员QQ:".$qq;
            }
        }
    }

    public function letter(){
        $this->display();
    }
   public function Notice(){

        $tag='cid:1;order:listorder asc';
        $content=sp_sql_posts_paged($tag,9); 
        $posts=$content['posts'];
        $this->assign('posts',$posts);
        $this->display();
    }
    public function Notice_content(){
        $id=I('get.id');
        $tag='cid:1;order:listorder asc';
        $content=sp_sql_posts_paged($tag); 
        $posts=$content['posts'];
        $this->assign('posts',$posts[$id]);
        $this->display();
    }


    public function portrait() {
        if(IS_POST){
            $post=I('post.post');
        if(!$post[avatar]){
            $this->msg('请选择头像',$url);
        }
            $src = $this->user_model->where(array('user_login'=>$this->user_login))->save($post);
            if($src){
                // echo'<script>window.parent.layer.alert("修改成功");window.parent.imggb("'.$post[avatar].'");parent.$.fancybox.close();</script>';
                echo'<script>window.parent.imggb("'.$post[avatar].'");parent.$.fancybox.close();</script>';
            }else{
                $this->msg('头像更新失败',$url);
            }
        }
       $this->display();
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

