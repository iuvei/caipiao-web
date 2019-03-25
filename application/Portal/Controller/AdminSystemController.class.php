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

class AdminSystemController extends AdminbaseController {

    protected $user_model;
    protected $lottery_typeset;
    protected $bank;
    protected $pay_money;
    protected $pay_mode;
    protected $pay_coll_money;
  
    function _initialize() {
        parent::_initialize();
        $this->user_model = D("Portal/User");
        $this->type = M('type');
        $this->played = M('played');
        $this->group = M('played_group');
        $this->bank = M('bank');
        $this->pay_money = M('pay_money');
        $this->pay_mode = M('pay_mode');
        $this->pay_coll_money = M('pay_coll_money');
    }


    /*
     * 彩种列表 
     */
    public function lottery_typeset(){
        $count = $this->type->count();
        $page = $this->page($count, $this->bonus['pagemin']);
        $list = $this->type->limit($page->firstRow, $page->listRows)->select();
        $this->assign('list',$list);
        $this->assign("page", $page->show('Admin'));
        $this->display();
    }
    /*
     * 玩法列表 
     */
    public function played_list(){
        $count = $this->played->count();
        $page = $this->page($count, $this->bonus['pagemin']);
        $list = $this->played->limit($page->firstRow, $page->listRows)->select();
        $this->assign('list',$list);
        $this->assign("page", $page->show('Admin'));
        $this->display();
    }
    /*
     * 玩法组别列表 
     */
    public function group_list(){
        if(IS_POST){
            $_GET=I('post.');
        }
        $where="1=1";

        if($_GET['type']){
            $where.=" and type ='".$_GET['type']."'";
        }
        if($_GET['enable']){
            $where.=" and enable = '".($_GET['enable']-1)."'";
        }
        if($_GET['groupname']){
            $where.=" and groupname = '".$_GET['groupname']."'";
        }
        $count = M('played_group')->where($where)->count();
        $page = $this->page($count, $this->bonus['pagemin']);
        $list = M('played_group')->where($where)
            ->order(array("id" => "desc"))
            ->limit($page->firstRow, $page->listRows)
            ->select();
        $this->assign('get',$_GET);
        $typelist=M('type')->order('sort asc')->select();
        $this->assign('typelist', $typelist);
        $this->assign('list',$list);
        $this->assign("page", $page->show('Admin'));
        $this->display();
    }
    /*
     * 添加组别
     */
    public function qq_group(){
        $map['type']=I('post.type');
        $map['top']=0;
        $group=$this->group->where($map)->select();
        $html='<option value="0">顶级所属</option>';
        if($map['type']!=1){
        foreach ($group as $key => $value) {
            $html=$html.'<option value="'.$value[id].'">'.$value[groupname].'</option>';
        }
         }
        echo $html;
    }
    public function qq_played(){
        $map['type']=I('post.type');
        // if($map['type']==1){
        //     $map['top']=0;
        // }
        // else{
        //     $map['top']=array('neq','0');
        // }
        $group=$this->group->where($map)->select();
        $html='';
        foreach ($group as $key => $value) {
            if($map['type']!=1){
            $map2['id']=$value['top'];
            $top=$this->group->where($map2)->find();
            $value[groupname]=$top[groupname].'-'.$value[groupname];
            }
            $html=$html.'<option value="'.$value[id].'">'.$value[groupname].'</option>';
        }
        echo $html;
    }
    public function add_group(){
        $this->display();
    }
    public function add_grouppost(){
        $post=I('post.');
        if(!$post[type]){
             $this->msg('请选择彩种类别',$url);
        }
        if(!$post[groupName]){
            $this->msg('组别名称不能为空',$url);
        }
        $data=$post;
        $res = $this->group->add($data);
        if ($res) {
            $this->msg('添加成功',$url);
        } else {
            $this->msg('添加失败', $url);
        }
    }

    public function edit_group(){
        $id = intval(I("get.id"));
        $group = $this->group->find($id);
        $this->assign('post', $group);

        $map['type']=$group['type'];
        $map['top']=0;
        $list=$this->group->where($map)->select();
        $html='<option value="0">顶级所属</option>';
        if($map['type']!=1){
        foreach ($list as $key => $value) {
            $html=$html.'<option value="'.$value[id].'">'.$value[groupname].'</option>';
        }
        }
        $this->assign('html', $html);
        $this->display();
    }
    public function edit_grouppost(){
        if (IS_POST) {
            $post = I('post.');
            $data=$post;           
            $res = $this->group->where(array('id' => I('post.id')))->save($data);
            if ($res) {
                $this->msg('修改成功');
            } else {
                $this->msg('没有修改');
            }
        }
    }
    public function del_group(){
        $id = I('get.id');
        if ($this->group->delete($id) !== false) {
            $this->success("删除成功！");
        } else {
            $this->error("删除失败！");
        }
    }


    /*
     * 添加玩法
     */
    
    public function add_played(){
        $this->display();
    }
    public function add_playedpost(){
        $post=I('post.');
        $data=$post;
        $res = $this->played->add($data);
        if ($res) {
            $this->msg('添加成功',$url);
        } else {
            $this->msg('添加失败', $url);
        }
    }
    public function edit_played(){
        $id = intval(I("get.id"));
        $group = $this->played->find($id);
        $this->assign('post', $group);
         $map['type']=$group['type'];
        // if($map['type']==1){
        //     $map['top']=0;
        // }
        // else{
        //     $map['top']=array('neq','0');
        // }
        $list=$this->group->where($map)->select();
        $html='';
        foreach ($list as $key => $value) {
            if($map['type']!=1){
            $map2['id']=$value['top'];
            $top=$this->group->where($map2)->find();
            $value[groupname]=$top[groupname].'-'.$value[groupname];
            }
            if($group['groupid']==$value[id]){
            $html=$html.'<option value="'.$value[id].'" selected >'.$value[groupname].'</option>';
            }
            else{
                $html=$html.'<option value="'.$value[id].'">'.$value[groupname].'</option>';
            }
        }
        $this->assign('html', $html);
        $this->display();
    }
    public function edit_playedpost(){
        if (IS_POST) {
            $post = I('post.');
            $data=$post;           
            $res = $this->played->where(array('id' => I('post.id')))->save($data);
            if ($res) {
                $this->msg('修改成功');
            } else {
                $this->msg('没有修改');
            }
        }
    }
    public function del_played(){
        $id = I('get.id');
        if ($this->played->delete($id) !== false) {
            $this->success("删除成功！");
        } else {
            $this->error("删除失败！");
        }
    }
    public function data_set(){
        $id = intval(I("get.id"));
        $post = $this->type->find($id);
        $this->assign('post', $post);
        $data=explode(',',$post['data']);
        $this->assign('data', $data);
        $this->display();
    }
    public function data_setpost(){
        $post=I('post.');
        $data['data']=implode(',',$post[data]);
        $this->type->where('id='.$post['id'])->save($data);
        $this->msg('开奖配置成功', $url);
    }
    public function played_set(){
        $id = intval(I("get.id"));
        $post = $this->type->find($id);
        $xzwf=explode(',',$post['wf']);
        $map['type']=$post['type'];
        $map['enable']='1';
        $played = $this->played->where($map)->select();
        $list=array();
        foreach ($played as $key => $value) {
            if(in_array($value['id'],$xzwf)){
                $value['checked']='checked';
            }
            else{
                $value['checked']='';
            }
            $list[$value['groupid']][]=$value;
        }
        if($map['type']!=1){
            $map['top']=array('neq',0);
        }
        $group = $this->group->where($map)->select();
        $this->assign('group',$group);
        $this->assign('list',$list);
        $this->assign('post', $post);
        $this->display();
    }
    public function played_setpost(){
        $post=I('post.');
        $data['wf']=implode(',',$post[xzwf]);
        $this->type->where('id='.$post['id'])->save($data);
        $this->msg('玩法配置成功', $url);
    }
    public function cjlist(){
        $id = intval(I("get.id"));
        $post = $this->type->find($id);
        $map['typeid']=$id;
        $list=M('cjq')->where($map)->select();
        $this->assign('post',$post);
        $this->assign('list',$list);
        $this->display();
    }
    public function add_cj(){
        $id = intval(I("get.typeid"));
        $type = $this->type->find($id);
        $this->assign('type',$type);
        $this->display();
    }
    public function edit_cj(){
        $id = intval(I("get.id"));
        $post=M('cjq')->find($id);
        $type = $this->type->find($post[typeid]);
        $this->assign('type',$type);
        $this->assign('post',$post);
        $this->display();
    }
    public function add_cjpost(){
        $post=I('post.');
        $data=$post;
        $res = M('cjq')->add($data);
        if ($res) {
            $this->msg('添加成功',$url);
        } else {
            $this->msg('添加失败', $url);
        }
    }
    public function open_cj(){
        $id = I('get.id');
        $data['zt']='1';
        $data['token']=md5(time());
        M('cjq')->where(array('id' =>$id))->save($data);
        echo '<script>alert("运行成功");history.go(-1);</script>';
        //$this->cjq($id,$data['token']);
    }
     public function edit_cjpost(){
        if (IS_POST) {
            $post = I('post.');
            $data=$post;           
            $res = M('cjq')->where(array('id' => I('post.id')))->save($data);
            if ($res) {
                $this->msg('修改成功');
            } else {
                $this->msg('没有修改');
            }
        }
    }
    public function del_cj(){
        $id = I('get.id');
        if ( M('cjq')->delete($id) !== false) {
            $this->success("删除成功！");
        } else {
            $this->error("删除失败！");
        }
    }
    /*
     * 添加彩种
     */
    
    public function add_lottery_typeset(){
        $this->display();
    }
    public function add_lottery_typesetpost(){
        $post=I('post.');
        $data=$post;
        $name = $this->type->where(array('title' => $data['title']))->find();
        if ($name) {
            $this->msg('该彩种已存在', $url);
        }
        $res = $this->type->add($data);
        if ($res) {
            $this->msg('添加成功',$url);
        } else {
            $this->msg('添加失败', $url);
        }
    }

    public function edit_lottery_typeset(){
        $id = intval(I("get.id"));
        $user = $this->type->find($id);
        $this->assign('post', $user);
        $this->display();
    }
    public function edit_lottery_typesetpost(){
        if (IS_POST) {
            $post = I('post.');
            $data=$post;           
            $res = $this->type->where(array('id' => I('post.id')))->save($data);
            if ($res) {
                $this->msg('修改成功');
            } else {
                $this->msg('没有修改');
            }
        }
    }
    public function del_lottery_typeset(){
        $id = I('get.id');
        if ($this->type->delete($id) !== false) {
            $this->success("删除成功！");
        } else {
            $this->error("删除失败！");
        }
    }
    public function cjq($id,$token){
        ignore_user_abort(); //关掉浏览器，PHP脚本也可以继续执行.
        set_time_limit(0);
        echo str_pad('',4096);
        echo '<script>alert("运行成功");history.go(-1);</script>';
        $size=ob_get_length();
        header("Content-Length: $size");  //告诉浏览器数据长度,浏览器接收到此长度数据后就不再接收数据
        header("Connection: Close");  
        // 刷新buffer
        ob_flush();  
        flush();  
        $zt=1;
        $cj=M('cjq');
        $kjxx=M('data');
        session_write_close();
            do {
                $cjq=$cj->find($id);
                $cjq['gz']=htmlspecialchars_decode($cjq['gz']);
                $cjq['fg']=htmlspecialchars_decode($cjq['fg']);
                if($token==$cjq['token'] && $cjq['zt']==1){
                        $context = $this->geturl($cjq['url']);
                        $list=array();
                        preg_match_all($cjq['gz'],$context,$list);
                        $kjdata['qs']=$list[$cjq['qs']]['0'];
                        $list[$cjq['sj']]['0']= str_replace("\r\n","",$list[$cjq['sj']]['0']);
                        $sj=explode($cjq['fg'], $list[$cjq['sj']]['0']);
                        $kjdata['sj']=implode(',',$sj);
                        $data['bz']="期数：".$kjdata['qs']."开奖号码：".$kjdata['sj'];
                        $data['yxtime']=date('Y-m-d H:i:s',time());
                        $cj->where(array('id' =>$id))->save($data);
                        $data2['type']=$cjq['typeid'];
                        $data2['number']=$kjdata['qs'];
                        if(!M('data')->where($data2)->find()){
                            $data2['data']=$kjdata['sj'];
                            $data2[time]=time();
                            M('data')->add($data2);
                        }
                        sleep(10);
                }
                else{
                    $zt=0;
                }
            } while ($zt=0);
    }
    function geturl($url){
            $cip = '218.242.124.'.mt_rand(0,254);
            $xip = '218.242.124.'.mt_rand(0,254);
            $header = array( 
            'CLIENT-IP:'.$cip, 
            'X-FORWARDED-FOR:'.$xip, 
            );
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_REFERER, "http://www.baidu.com.cn/");
            curl_setopt ($ch, CURLOPT_HTTPHEADER, $header);
            curl_setopt($ch,CURLOPT_USERAGENT,"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)");
            $output = curl_exec($ch);
            curl_close($ch);
            return $output;
    }



        //银行管理
   public function bankset(){
        $list = $this->bank->select();
        $this->assign('list',$list);
        $this->display();
    }
    public function bankset_add(){
        if(IS_POST){
            $post=I('post.post');
            if($this->bank->where(array('name'=>$post['name']))->find() !== NULL){
                $this->msg('已存在此银行','bankset_add');
            }
            if( $this->bank->add($post) !== flase ){
                $this->msg('添加成功','bankset_add');
            }else{
                $this->msg('添加失败','bankset_add');
            }
        }
        $this->display();
    }
    public function bankset_del(){
        $id=I('get.id');
        if($this->bank->where(array('id'=>$id))->delete() !==false){
            $this->success('删除成功');
        }else{
            $this->error('删除失败');
        }
    }
    public function bankset_edit(){
        $id=I('get.id');
        $data = $this->bank->where(array('id'=>$id))->find();
        if(IS_POST){
            $id=I('post.id');
            $data = $this->bank->where(array('id'=>$id))->find();
            $post = I('post.post');
            if($data['name']!==$post['name']){
                if($this->bank->where(array('name'=>$post['name']))->find() !== NULL){
                    $this->msg('已存在此银行','javascript:history.back(-1);');
                }
            }
            $dd = $this->bank->where(array('id'=>$id))->save($post);

            if($this->bank->where(array('id'=>$id))->save($post) !==false){
                $this->msg('更新成功','bankset');
            }else{
                $this->msg('更新失败','bankset');
            }
        }
        $this->assign('post',$data);
        $this->display();
    }

    //收款帐户
    public function pay_mode(){
        $count = $this->pay_mode->count();
        $page = $this->page($count,$this->bonus['pagemin']);
        $list = $this->pay_mode->limit($page->firstRow, $page->listRows)->select();
        $this->assign('list',$list);
        $this->assign("page", $page->show('Admin'));
        $this->display();

    }
    public function pay_mode_add(){
        if(IS_POST){
            $post=I('post.post');
            if($this->pay_mode->where(array('account'=>$post['account']))->find() !== NULL){
                $this->msg('已添加过此账号','javascript:history.back(-1);');
            }else{
                $r=$this->pay_mode->add($post);
                if($r){
                    $this->msg('操作成功','pay_mode');
                }else{
                    $this->msg('操作成功','javascript:history.back(-1);');
                }
            } 
        }
        $this->display();
    }
    public function pay_mode_edit(){
        $id=I('get.id');
        $data = $this->pay_mode->where(array('id'=>$id))->find();
        if(IS_POST){
            $id=I('post.id');
            $data = $this->pay_mode->where(array('id'=>$id))->find();
            $post = I('post.post');
            if($data['account']!==$post['account']){
                if($this->pay_mode->where(array('account'=>$post['account']))->find() !== NULL){
                    $this->msg('已存在此银行','javascript:history.back(-1);');
                }
            }
            $dd = $this->pay_mode->where(array('id'=>$id))->save($post);

            if($this->pay_mode->where(array('id'=>$id))->save($post) !==false){
                $this->msg('操作成功','pay_mode');
            }else{
                $this->msg('操作成功','javascript:history.back(-1);');
            }
        }
        $this->assign('post',$data);
        $this->display();
    }
    public function pay_mode_del(){
        $id=I('get.id');
        if($this->pay_mode->where(array('id'=>$id))->delete() !==false){
            $this->success('删除成功');
        }else{
            $this->error('删除失败');
        }
    }

    //用户打款
    public function pay_money(){
        if(IS_POST){
            $_GET=$_POST;
        }
            $where="1=1";
            if ($_GET['term'] != "") {
                $where.=" and status='".$_GET[term]."'";
            }
            if ($_GET['user_login']) {
                $where.=" and user_login='".$_GET[user_login]."'";
            }
            if ($_GET['start_time']) {
                $where.=" and add_time >= '".strtotime($_GET[start_time])."'";
            }
            if ($_GET['end_time']) {
                $where.=" and add_time <= '".strtotime($_GET[add_time])."'";
            }
            $count = $this->pay_money->where($where)->count();
            $page = $this->page($count, $this->bonus['pagemin']);
            $list = $this->pay_money
                    ->where($where)
                    ->order(array("id" => "desc"))
                    ->limit($page->firstRow, $page->listRows)
                    ->select();
        $this->assign('get',$_GET);
        $this->assign('list',$list);
        $this->assign("page", $page->show('Admin'));
        $this->display();
    }
    public function pay_money_conf(){
        $id=I('get.id');
        $data['status']=1;
        $pay_money=$this->pay_money->where(array('id'=>$id))->find();
        $user=$this->user_model->where(array('user_login'=>$pay_money['user_login']))->find();
        moneybh($user[id],$pay_money['number'],pay_mode_name($pay_money['pay_mode_id']).'充值入款',array('liqtype'=>'1'));
        $pay_moneys=$this->pay_money->where(array('id'=>$id))->save($data);
        if($user && $pay_moneys){
            $coin['coin']=$pay_money['number']+$user['coin'];
             $level = M('user_level')->order('level asc')->select();
             $levels=0;
             foreach ($level as $key => $value) {
                if($coin['coin']>=$value['grow']){
                    $levels=$value['level'];
                }
             }
             if($levels>$user[level]){
                $coin['level']=$levels;
             }
            $usera=$this->user_model->where(array('user_login'=>$pay_money['user_login']))->setInc($coin);
            $this->success('操作成功');
        }else{
            $this->error('操作失败');
        }
    }
    public function pay_money_edit(){
        $id=I('get.id');
        if(IS_POST){
            $post = I('post.');
            $dd=M('pay_money')->where(array('id'=>$post['id']))->save($post);
            if(M('pay_money')->where(array('id'=>$id))->save($post) !==false){
                $this->msg('操作成功',U('Portal/AdminSystem/pay_money'));
            }else{
                $this->msg('操作成功','javascript:history.back(-1);');
            }
        }
        $pay_money= $this->pay_money->where(array('id'=>$id))->find();
        $this->assign('post',$pay_money);
        $this->display();
    }
    public function pay_money_del(){
        $id=I('get.id');
        if($this->pay_money->where(array('id'=>$id))->delete() !==false){
            $this->success('删除成功');
        }else{
            $this->error('删除失败');
        }
    }
    //用户收款
    public function pay_coll_money(){
        if(IS_POST){
            $_GET=I('post.');
        }
            $where="1=1";

            if ($_GET['term'] != "") {
                    $where.=" and status='".$_GET[term]."'";
            }
            if ($user_login) {
                $where.=" and user_login='".$_GET[user_login]."'";
            }
            if ($start_time) {
                $where.=" and add_time >= '".strtotime($_GET[start_time])."'";
            }
            if ($end_time) {
                $where.=" and add_time <= '".strtotime($_GET[end_time])."'";
            }
            $count = $this->pay_coll_money->where($where)->count();
            $page = $this->page($count, $this->bonus['pagemin']);
            $list = $this->pay_coll_money
                    ->where($where)
                    ->order(array("id" => "desc"))
                    ->limit($page->firstRow, $page->listRows)
                    ->select();

        $this->assign('get',$_GET);
        $this->assign('list',$list);
        $this->assign("page", $page->show('Admin'));
        $this->display();
    }
    public function pay_coll_money_conf(){
        $id=I('get.id');
        $data['status']=1;
        $pay_money=$this->pay_coll_money->where(array('id'=>$id))->save($data);
        if($pay_money){
            $this->success('操作成功');
        }else{
            $this->error('操作失败');
        }

    }
    public function pay_coll_money_bohui(){
        $id=I('get.id');
        $pay_money=$this->pay_coll_money->where(array('id'=>$id))->find();
        $user=$this->user_model->where(array('user_login'=>$pay_money['user_login']))->find();
        moneybh($user[id],$pay_money['number'],'提现退回',array('liqtype'=>'9'));
        if($user){
        $dd=M('pay_coll_money')->where(array('id'=>$id))->save(array('status'=>'2'));
            $this->success('操作成功');
        }else{
            $this->error('操作失败');
        }
    }
    public function pay_coll_money_chehui(){
        $id=I('get.id');
        $post['status']=0;
        $pay_money=$this->pay_coll_money->where(array('id'=>$id))->find();
        $user=$this->user_model->where(array('user_login'=>$pay_money['user_login']))->find();
        moneybh($user[id],-$pay_money['number'],'提现还原扣款',array('liqtype'=>'3'));

        $pay_money=$this->pay_coll_money->where(array('id'=>$id))->save($post);
        if($pay_money){
            $this->success('操作成功');
        }else{
             $this->error('操作失败');
        }
    }
    public function pay_coll_money_del(){
        $id=I('get.id');
        if($this->pay_coll_money->where(array('id'=>$id))->delete() !==false){
            $this->success('删除成功');
        }else{
            $this->error('删除失败');
        }
    }


}
