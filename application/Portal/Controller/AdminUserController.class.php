<?php
// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Tuolaji <479923197@qq.com>
// +----------------------------------------------------------------------
namespace Portal\Controller;

use Common\Controller\AdminbaseController;

class AdminUserController extends AdminbaseController {
    
    protected $user_model;
    
    function _initialize() {
        parent::_initialize();
        $this->user_model = D("portal/user");
        $this->all_record = M('AllRecord');
    }
    // public function chaozuo(){
    //         M('bets')->where('1=1')->delete();
    //         M('userbet2')->where('1=1')->delete();
    //         $this->success('操作成功');
    // }
    public function allcjql(){
        $zmmmap2['BetDt']=array('lt',date('Y-m-d H:i:s',strtotime(date($this->bonus['overtime3'].' 02:00:00'))));
        $zmmmap3['BetDt']=array('lt',date('Y-m-d H:i:s',strtotime(date($this->bonus['overtime1'].' 02:00:00'))));
        M('bets')->where($zmmmap2)->delete();
        $list=M('user')->select();
        foreach($list as $one){
            M('userbet'.$one['id'])->where($zmmmap3)->delete();
            M()->execute('OPTIMIZE TABLE `jz_userbet'.$one['id'].'`');
        }
        $this->success('操作成功');
    }
    public function cxtj(){
        $id=$_GET['id'];
        // $zmmmap['uid']=$_GET['id'];
        // $zmmmap['time']=array('gt',strtotime(date('Y-m-d 02:00:00'))-7*3600);
        // M('datatime')->where($zmmmap)->delete();
        // $zmmmap2['user']=$_GET['id'];
        // $zmmmap2['time']=array('gt',strtotime(date('Y-m-d 02:00:00'))-7*3600);
        // M('lhxx')->where($zmmmap2)->delete();
        // M('fsxx')->where($zmmmap2)->delete();
        // $save['UpdateDt']=date('Y-m-d H:i:s',time());
        // $save['BetDt2']=date('Y-m-d H:i:s',time());

        // $zmmmap3['uid']=$_GET['id'];
        // $zmmmap3['BetDt']=array('gt',date('Y-m-d H:i:s',strtotime(date('Y-m-d 02:00:00'))-7*3600));
        // M('bets')->where($zmmmap3)->save($save);
        // 
        $zmmmap['BetDt']=array('lt',date('Y-m-d H:i:s',strtotime(date($this->bonus['overtime2'].' 02:00:00'))));
        $zmmmap['zt']=1;
        M('userbet'.$id)->where($zmmmap)->delete();
        M()->execute('OPTIMIZE TABLE `jz_userbet'.$id.'`');
        $this->success('操作成功');
    }
    public function jllist() {
            $where=' 1=1 ';
            if($_POST){
                $_GET=$_POST;
            }
            if($_GET[liqtype]){
                  $where=$where.'and liqtype ="'.$_GET[liqtype].'"';
            }
            if($_GET[user_login]){
                $user=M('user')->where(array('user_login'=>$_GET[user_login]))->find();
                  $where=$where.'and liqtype ="'.$user[id].'"';
            }
            if($_GET[start_time]){
                  $where=$where.'and actionTime >"'.strtotime($_GET[start_time]).'"';
            }
            if($_GET[end_time]){
                  $where=$where.'and actionTime <"'.strtotime($_GET[end_time]).'"';
            }
            $count = M('coin_log')->where($where)->count();
            $page = $this->page($count, $this->bonus['pagemin']);
            $record =M('coin_log')->where($where)->order(array("id" => "desc"))
                ->limit($page->firstRow, $page->listRows)->select();
            $this->assign('get', $_GET);
            $this->assign('record', $record);
            $this->assign("page", $page->show('Admin'));
            $this->display();
    }
    /**
     * 金币赠送
     */
    public function editMoney() {
        $where['type']='systerm';
        $count = $this->all_record->where($where)->count();
        $page = $this->page($count, $this->bonus['pagemin']);
        $record = $this->all_record
                ->where($where)
                ->order(array("id" => "desc"))
                ->limit($page->firstRow, $page->listRows)
                ->select();

        $this->assign('record', $record);
        $this->assign("page", $page->show('Admin'));
        $this->display();
    }
    public function editMoneyPost() {
        $wallet = I('post.wallet');
        $user_login = I('post.user_login');
        $number = I('post.number');
        $data = I('post.');
        $data['create_time'] = $this->time;
        $data['type'] = 'systerm';
        $data['wallet'] = $wallet;
        $data['notice'] = '系统操作';
        if ($user_login && $number > 0) {
                        $user = M(I('post.lx'))->where(array('user_login' => $user_login))->find();
            if (empty($user)) {
                $this->error('用户名不存在。。');
            }
            $type = I('post.type');
            if ($type == 1) {//赠送
                $data['number'] = "+{$number}";
                $this->all_record->add($data);
                moneybh($user[id],$number,'人工充值',array('liqtype'=>'11'),I('post.lx'));
            } elseif ($type == 2) {//扣除
                $data['number'] = "-{$number}";
                $this->all_record->add($data);
                moneybh($user[id],$data['number'],'人工扣除',array('liqtype'=>'11'),I('post.lx'));
            }
            if (1) {
                $this->success('操作成功');
            } else {
                $this->error('操作失败');
            }
        } else {
            $this->error('参数错误。。');
        }
    }
      public function index(){
        $where='1=1';
        if(IS_POST){
            $_GET=$_POST;
        }
        if(!empty($_GET['uid'])){
            $where=$where.' and id='.intval($_GET['uid']);
        }
        
        if(!empty($_GET['keyword'])){
            $keyword=$_GET['keyword'];
            $where=$where.' and (user_login like "%'.$keyword.'%"';
            $where=$where.' or user_nicename like "%'.$keyword.'%")';
        }
        if(!empty($_GET['term'])){
            $where=$where.' and user_status='.intval($_GET['term']-1);
        }
        if(!empty($_GET['start'])){
            $_SESSSION['start']=$_GET['start'];
        }
        if(!empty($_GET['end'])){
            $_SESSSION['end']=$_GET['end'];
        }
        $user_model=M("User");
        
        $count=$user_model->where($where)->count();
        
        $page = $this->page($count, $this->bonus['pagemin']);
        
        $list = $user_model
        ->where($where)
        ->order("create_time DESC")
        ->limit($page->firstRow . ',' . $page->listRows)
        ->select();
        $this->assign('get', $_GET);
        $this->assign('list', $list);
        $this->assign("page", $page->show('Admin'));
        
        $this->display("index");
    }


    public function index2(){
        $where='1=1';
        if(IS_POST){
            $_GET=$_POST;
        }
        if(!empty($_GET['uid'])){
            $where=$where.' and id='.intval($_GET['uid']);
        }
        
        if(!empty($_GET['keyword'])){
            $keyword=$_GET['keyword'];
            $where=$where.' and (user_login like "%'.$keyword.'%"';
            $where=$where.' or nickname like "%'.$keyword.'%")';
            // $where=$where.' or user_email like "%'.$keyword.'%")';
        }
        if(!empty($_GET['term'])){
            $where=$where.' and user_status='.intval($_GET['term']-1);
        }
        if(!empty($_GET['start'])){
            $_SESSSION['start']=$_GET['start'];
        }
        if(!empty($_GET['end'])){
            $_SESSSION['end']=$_GET['end'];
        }
        $user_model=M("agent");
        
        $count=$user_model->where($where)->count();
        $page = $this->page($count, $this->bonus['pagemin']);
        
        $list = $user_model
        ->where($where)
        ->order("create_time DESC")
        ->limit($page->firstRow . ',' . $page->listRows)
        ->select();
        $this->assign('get', $_GET);
        $this->assign('list', $list);
        $this->assign("page", $page->show('Admin'));
        
        $this->display("index2");
    }
    
    // 后台本站用户禁用
    public function ban(){
        $id= I('get.id',0,'intval');
        if ($id) {
            $result = M("User")->where(array("id"=>$id,"user_type"=>2))->setField('user_status',0);
            if ($result) {
                $this->success("会员拉黑成功！", U("indexadmin/index"));
            } else {
                $this->error('会员拉黑失败,会员不存在,或者是管理员！');
            }
        } else {
            $this->error('数据传入失败！');
        }
    }
    
    // 后台本站用户启用
    public function cancelban(){
        $id= I('get.id',0,'intval');
        if ($id) {
            $result = M("User")->where(array("id"=>$id,"user_type"=>2))->setField('user_status',1);
            if ($result) {
                $this->success("会员启用成功！", U("indexadmin/index"));
            } else {
                $this->error('会员启用失败！');
            }
        } else {
            $this->error('数据传入失败！');
        }
    }
    // 后台本站用户编辑
    public function edit() {
        $id = intval(I("get.id"));
        $user = $this->user_model->find($id);
        $parent = M('agent')->find($user['parent']);
        $user['parent_user'] = $parent['user_login'];
        $this->assign('post', $user);
        $this->display();
    }


    public function edit2() {
        $id = intval(I("get.id"));
        $user = M('agent')->find($id);
        $parent = M('agent')->find($user['parent']);
        $user['parent_user'] = $parent['user_login'];
        $this->assign('post', $user);
        $this->display();
    }

    public function edit_post() {
        if (IS_POST) {
            $data = I('post.');
            $password = I('post.user_pass');
            $two_password = I('post.user_two_pass');
            $user_status = I('post.status');
            $user = $this->user_model->where(array('id' => I('post.id')))->find();
            if (!empty($password)) {
                $data['user_pass'] = md5($data['user_pass']);
            }else{
                $data['user_pass'] = $user['user_pass'];
            }
            $res = $this->user_model->where(array('id' => I('post.id')))->save($data);
            if ($res) {
                $this->msg('保存成功');
            } else {
                $this->msg('没有修改');
            }
        }
    }

    public function edit_post2() {
        if (IS_POST) {
            $data = I('post.');
            $password = I('post.user_pass');
            $two_password = I('post.user_pass2');
            $user_status = I('post.status');
            $user = M('agent')->where(array('id' => I('post.id')))->find();
            if (!empty($password)) {
                $data['user_pass'] = md5($data['user_pass']);
            }else{
                $data['user_pass'] = $user['user_pass'];
            }

            if (!empty($two_password)) {
                $data['user_pass2'] = md5($data['user_pass2']);
            }else{
                $data['user_pass2'] = $user['user_pass2'];
            }
            
            $res = M('agent')->where(array('id' => I('post.id')))->save($data);
            if ($res) {
                $this->msg('保存成功');
            } else {
                $this->msg('没有修改');
            }
        }
    }

    public function add_user(){
        $this->display();
    }
    public function add_agent(){
        $this->display();
    }
    public function add_agent_post(){
        $post = I('post.');
        $data['user_login'] = trim($post['user_login']);
        if(!$data['user_login']){
            $this->msg('用户不能为空', $url);
        }
        $user = M('agent')->where(array('user_login' => $data['user_login']))->find();
        if ($user) {
            $this->msg('用户已存在', $url);
        }

        $user_pass = trim($post['user_pass']);
        $user_pass2 = trim($post['user_pass2']);
        $data=$post;
        if (!$data['user_status']) {
            $this->msg('请选择用户状态', $url);
        }
        $data['user_pass'] = md5($user_pass);
        $data['user_pass2'] = md5($user_pass2);
        $data['last_login_ip'] = get_client_ip(0, true);
        $data['create_time'] = date("Y-m-d H:i:s" ,$this->time);
        $data['last_login_time'] = $data['create_time'];
        $data['parent']=0;
        $data['parent_user']='';
        $data['CompanyType']=0;
        $data['SubCompanyID']=1;
        $data['SuperCompanyID']=1;
        $data['AgentLevel']=1;
        $res = M('agent')->add($data);
        if ($res) {
            $save[path]='-'.$res.'-';
            M('agent')->where(array('id'=>$res))->save($save);
            $this->msg('添加成功',$url);
        } else {
            $this->msg('添加失败', $url);
        }        
    }
    public function add_user_post(){
      
        $post = I('post.');
        
        $data['user_login'] = trim($post['user_login']);
        $user = $this->user_model->where(array('user_login' => $data['user_login']))->find();
        if ($user) {
            $this->msg('用户已存在', $url);
        }

        $user_pass = trim($post['user_pass']);
        $user_pass_two = trim($post['user_pass_two']);
        if($user_pass != $user_pass_two) {
            $this->msg('两次密码输入不相同', $url);
        }
        $data=$post;
        $data['user_pass'] = trim($post['user_pass']);
        $data['user_pass'] = md5($data['user_pass']);
        $data['last_login_ip'] = get_client_ip(0, true, $data);
        $data['create_time'] = date("Y-m-d H:i:s" ,$this->time);
        $data['last_login_time'] = $data['create_time'];
        $data['avatar']='/public/images/mo.png';
        $res = $this->user_model->add($data);
        if ($res) {
            $this->msg('添加成功',$url);
        } else {
            $this->msg('添加失败', $url);
        }

        
    }

    public function login(){
        $id = I('get.id');
        $_SESSION['qzdlid']=$id;
        header("Location:/");
    }

    public function login2(){
        $id = I('get.id');
        $_SESSION['qzdlid']=$id;
        header("Location:/index.php/portal/index/agent");
    }
    public function delete(){
        $id = I('get.id');
        if ($this->user_model->delete($id) !== false) {
            $this->success("删除成功！");
        } else {
            $this->error("删除失败！");
        }
    }
    public function delete2(){
        $id = I('get.id');
        if (M('agent')->delete($id) !== false) {
            $this->success("删除成功！");
        } else {
            $this->error("删除失败！");
        }
    }

    public function user_level(){
        $level= M('agent_level')->order('level','desc')->select();
        $this->assign('list',$level);
        $this->display();
    }
    public function add_user_level(){
        if(IS_POST){
            $post=I('post.');
            if(M('agent_level')->where(array('level'=>$post['level']))->find()){
                $this->msg('已存在此等级',$url);
            }
            $add=M('agent_level')->add($post);
            if($add){
                $this->msg('添加成功',$url);
            }else{
                $this->msg('添加失败',$url);
            }
        }
        $this->display();
    }
    public function level_edit(){
        $id=I('get.id');
        if(IS_POST){
            $post=I('post.');
            if(M('agent_level')->where(array('level'=>$post['level']))->find()){
                $this->msg('已存在此等级',$url);
            }
            $add=M('agent_level')->where(array('id'=>$id))->save($post);
            if($add){
                $this->msg('添加成功',$url);
            }else{
                $this->msg('添加失败',$url);
            }
        }
        $post=M('agent_level')->where(array('id'=>$id))->find();
        $this->assign('post',$post);
        $this->display();
    }
    public function level_delete(){
        $id=I('get.id');
        if(M('agent_level')->where(array('id'=>$id))->delete()){
            $this->success('删除成功',$url);
        }else{
            $this->error('删除失败',$url);
        }
    }
    public function user_bank(){
        $id=I('get.id');
        $user_bank=M('user_bank')->where(array('uid'=>$id))->select();
        $this->assign('user_bank',$user_bank);
        $this->display();
    }
    public function user_bank_del(){
        $id=I('get.id');
         if (M('user_bank')->delete($id) !== false) {
            $this->success("删除成功！");
        } else {
            $this->error("删除失败！");
        }
    }



}