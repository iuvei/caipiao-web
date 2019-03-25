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

class AdminOrderController extends AdminbaseController {

    protected $user_model;
    protected $all_record;
    protected $order_menu;
    protected $plan;
    protected $location;
    protected $type;
    protected $lottery_type;
    protected $obtain_log;
    protected $jiangjin_log;
 
    function _initialize() {
        parent::_initialize();
        $this->user_model = D("Portal/User");
        $this->all_record = M('AllRecord');
        $this->order_menu =M('order_menu');
        $this->plan = M('Plan');
        $this->location =M('location');
        $this->type =M('type');
        $this->lottery_type =M('lottery_type');
        $this->obtain_log = M('obtain_log');
        $this->jiangjin_log = M('jiangjin_log');
    }
    public function msg($msg, $url = '') {
        header('Content-Type:text/html; charset=utf-8');
        if ($url) {
        die("<script>alert('" . $msg . "');location.href='{$url}';</script>");
        }
        else{
            die("<script>alert('" . $msg . "');window.history.go(-1);</script>");
        }
    }

    /*
     * 计划管理  
     */
    public function index(){
        if(IS_POST){
            $_GET=I('post.');
        }
        $where='1=1';
        if($_GET['type']){
            $where.=" and type ='".$_GET[type]."'";
        }
        if($_GET['term'] == 1) {
            $where.=" and zt=1 and WinLoss > 0 and sftm=0";
        }
        if($_GET['term'] == 2){
            $where.=" and zt=1 and WinLoss = 0 and sftm=0";
        }
        if($_GET['term'] == 3){
            $where.=" and zt=0 and sftm=0";
        }
        if($_GET['term'] == 4){
            $where.=" and sftm=1";
        }
        if ($_GET['uid']) {
                $where.=" and uid='".$_GET['uid']."'";
        }
        if ($_GET['user_login']) {
                $user=M('user')->where(array('user_login'=>$_GET['user_login']))->find();
                $uid2=$user[id];
                $where.=" and uid='".$uid2."'";
        }
        if ($_GET['actionno']) {
            $where.=" and PeriodsNumber='".$_GET['actionno']."'";
        }
        if ($_GET['start_time']) {
            $where.=" and BetDt >= '".strtotime($_GET['start_time'])."'";
        }
        if ($_GET['end_time']) {
            $where.=" and BetDt <= '".strtotime($_GET['end_time'])."'";
        }
        $count = M('bets')->where($where)->count();
        $page = $this->page($count, $this->bonus['pagemin']);
        $posts = M('bets')->where($where)
            ->order(array("id" => "desc"))
            ->limit($page->firstRow, $page->listRows)
            ->select();
        
        $this->assign('get',$_GET);
        $typelist=M('type')->order('sort asc')->select();
        $this->assign('typelist', $typelist);
        $this->assign("page", $page->show('Admin'));
        $this->assign('posts', $posts);
        $this->display();
    }
    public function pk10(){
        $count = $this->plan->where(array('type'=>'pk10'))->count();
        $page = $this->page($count,$this->bonus['pagemin']);
        $posts = $this->plan
                ->where(array('type_id'=>'2'))
                ->order(array("id" => "desc"))
                ->limit($page->firstRow, $page->listRows)
                ->select();
        $this->assign('sum', $sum);
        $this->assign('posts', $posts);
        $this->display();

    }

    public function userdelete() {
        $id = I('get.id');
        $bet = M('bets')->where(array('id' => $id))->find();
        if($bet['lotteryno']!='' || $bet['isdelete']==1){
            $this->error('开将成功的订单无法撤销');
        }
        moneybh($bet[uid],$vo[amount]*$one[beishu]*$one[actionnum],'投注撤销',array('liqtype'=>'17'));
        $res=M('bets')->where(array('id' => $id))->save(array('isDelete'=>'1'));
        if ($res) {
            $this->success('成功成功');
        } else {
            $this->error('撤销失败');
        }
    }

    public function delete() {
        $id = I('get.id');
        $bet = M('bets')->where(array('id' => $id))->find();
        if($bet['lotteryno']=='' && $bet['isdelete']==0){
            $this->error('等待中奖的订单无法删除');
        }
        $res = M('bets')->where(array('id' => $id))->delete();
        if ($res) {
            $this->success('删除成功');
        } else {
            $this->error('删除失败');
        }
    }
    

    /*
     * 添加时时彩计划
     */
    public function addPlan(){
        $src=$this->location->where(array('lottery_type_id' =>1))->order('id asc')->select();
        $this->assign('src',$src);

        $this->display();
    }
    public function ajaxtype(){
        $name=I('post.name');
        $type=$this->type->where(array('location_name'=>$name))->field('name')->select();
        exit(json_encode($type));
    }
    
    
    public function addPlanPost(){
        $post=I('post');
        $post['type']=I('get.type');
        if(empty($post[plan_name])){
            $this->msg('请填写一个计划名',U('addPlan'));
        }
        if(empty($post[munber])){
           $post['munber']=mt_rand(00000,99999);
        }
        $name=$this->plan->where(array('plan_name'=>$post['plan_name']))->find();
        if(!empty($name)){
            $this->msg('已存在此计划',U('addPlan'));
        }
        $trr=$this->plan->add($post);
        if($trr){
            $this->msg('添加成功',U('addPlan'));
        }else{
            $this->msg('添加失败',U('addPlan'));
        }

        $this->display('addplan');
    }

   /*
     * 添加pk10计划
     */
    public function addPk10(){
        $src=$this->location->where(array('lottery_type_id' =>2))->order('id asc')->select();
        $this->assign('src',$src);
        $this->display();
    }
    
    
    public function addPk10Post(){
        $post=I('post');
        $post['type']=I('get.type');
        if(empty($post[plan_name])){
            $this->msg('请填写一个计划名',U('addPlan'));
        }
        if(empty($post[munber])){
           $post['munber']=mt_rand(00000,99999);
        }
        $name=$this->plan->where(array('plan_name'=>$post['plan_name']))->find();
        if(!empty($name)){
            $this->msg('已存在此计划',U('addPlan'));
        }
        $trr=$this->plan->add($post);
        if($trr){
            $this->msg('添加成功',U('addPlan'));
        }else{
            $this->msg('添加失败',U('addPlan'));
        }

        $this->display('addplan');
    }


    /*
     * 添加选项管理
     */

    public function menuOrder(){

        $result = $this->order_menu->order(array("listorder" => "ASC",'id' => 'ASC'))->select();

        // session('admin_menu_index','Menu/index');

        $tree = new \Tree();
        $tree->icon = array('&nbsp;&nbsp;&nbsp;│ ', '&nbsp;&nbsp;&nbsp;├─ ', '&nbsp;&nbsp;&nbsp;└─ ');
        $tree->nbsp = '&nbsp;&nbsp;&nbsp;';
        
        $newmenus=array();
        foreach ($result as $m){
            $newmenus[$m['id']]=$m;
        }
        $type[1]='<span style="color:red"><b>彩种</b></span>'; //类型
        $type[2]='<span style="color:green"><b>定位</b></span>';
        $type[3]='<span style="color:blue"><b>玩法</b></span>';

        $method[0]='空'; //兑奖函数
        $method[1]='';

        $appear[0]='空'; //对号函数
        $appear[1]='';

        foreach ($result as $n=> $r) {
            
            $result[$n]['parentid_node'] = ($r['parentid']) ? ' class="child-of-node-' . $r['parentid'] . '"' : '';
            
            $result[$n]['str_manage'] = '<a href="' . U("AdminOrder/addmenu", array("parentid" => $r['id'])) . '">添加子选项</a> | <a target="_blank" href="' . U("AdminOrder/editmenu", array("parentid" => $r['parentid'], "id" => $r['id'])) . '">编辑</a> | <a class="js-ajax-delete" href="' . U("AdminOrder/delmenu", array("id" => $r['id'], "menuid" => I("get.menuid")) ). '">删除</a> ';
            $result[$n]['type'] = $type[$r['type']];
            $result[$n]['appear'] = $appear[$r['appear']];
            $result[$n]['method'] = $method[$r['method']];
            
        }
        
        $tree->init($result);
        $str = "<tr id='node-\$id' \$parentid_node>
                    <td style='padding-left:20px;'><input name='listorders[\$id]' type='text' size='3' value='\$listorder' class='input input-order'></td>
                    <td>\$id</td>
                    <td>\$spacer\$name</td>
                    <td>\$type</td>
                    <td>\$appear</td>
                    <td>\$method</td>
                    <td>\$str_manage</td>
                </tr>";
        $categorys = $tree->get_tree(0, $str);
        $this->assign("categorys", $categorys);



        $this->assign('result',$result);
        $this->display();
    }
    public function listorders() {
        $status = parent::_listorders($this->order_menu);
        if ($status) {
            $this->success("排序更新成功！");
        } else {
            $this->error("排序更新失败！");
        }
    }

    /*
     * 添加选项
     */

    public function addmenu(){

        
        
        $tree = new \Tree();
        $parentid = I("get.parentid",0,'intval');
        $result = $this->order_menu->order(array('listorder' => 'asc'))->select();
        foreach ($result as $r) {
            $r['selected'] = $r['id'] == $parentid ? 'selected' : '';
            $array[] = $r;
        }
        $str = "<option value='\$id' \$selected>\$spacer \$name</option>";
        $tree->init($array);
        $select_categorys = $tree->get_tree(0, $str);
        $this->assign("select_categorys", $select_categorys);

        if(IS_POST){
            $res=$this->order_menu->add($_POST);
            if($res){
                $this->success('添加成功',U('AdminOrder/addmenu'));
            }
        }
        $this->display();
    }
     /*
     * 修改选项
     */
    public function editmenu(){
        $tree = new \Tree();
        $parentid = I("get.parentid",0,'intval');
        $id = I("get.id",0,'intval');
        $result = $this->order_menu->order(array('listorder' => 'asc'))->select();
        foreach ($result as $r) {
            $r['selected'] = $r['id'] == $parentid ? 'selected' : '';
            $array[] = $r;
        }
        $str = "<option value='\$id' \$selected>\$spacer \$name</option>";
        $tree->init($array);
        $select_categorys = $tree->get_tree(0, $str);
        $this->assign("select_categorys", $select_categorys);
        $rs = $this->order_menu->where(array("id" => $id))->find();
        $this->assign("data", $rs);
        $this->display();
    }

    public function editmenu_post(){
        $id=I('post.id');
        $rs = $this->order_menu->where(array("id" => $id))->find();
        $parentid=$rs['parentid'];
        $post=$_POST;
         if (IS_POST) {
            $count = $this->order_menu->where(array("parentid" => $id))->count();
            if ($count > 0) {
                if(!empty($post['parentid'])){
                    if ($post['parentid']!==$rs['parentid'] || $post['type']!==$rs['type']) {
                    $this->error("该菜单下还有子菜单，无法更改！" );
                    }elseif ($parentid==$rs['parentid']) {
                        True ;
                    }
                }
            }
            if ($this->order_menu->create()!==false) {
                if ($this->order_menu->save() !== false) {
                    $this->success("更新成功！");
                } else {
                    $this->error("更新失败！");
                }
            } else {
                $this->error($this->order_menu->getError());
            }
        }
    }

    public function delmenu(){
        $id = I("get.id",0,'intval');
        $count = $this->order_menu->where(array("parentid" => $id))->count();
        if ($count > 0) {
            $this->error("该菜单下还有子菜单，无法删除！");
        }
        if ($this->order_menu->delete($id)!==false) {
            $this->success("删除菜单成功！");
        } else {
            $this->error("删除失败！");
        }
    }

    public function ajaxmenu(){
        $post=$_POST;
        $type=$this->order_menu->where(array('id'=>$post['parentid']))->find();
        $parent=json_encode($type['type']);
        exit($parent);
    }

    //中将信息
    public function obtainlog(){
        if(IS_POST){
            $_GET=$_POST;
        }
            $where="1=1";

        if ($_GET['username'] != "") {
            $where.=" and username='".$_GET[username]."'";
        }
        if ($_GET['type']) {
            $where.=" and type='".$_GET[type]."'";
        }
       
        $count = M('obtain_log')->where($where)->count();
        $page = $this->page($count, $this->bonus['pagemin']);
        $posts = M('obtain_log')
                ->where($where)
                ->order(array("id" => "desc"))
                ->limit($page->firstRow, $page->listRows)
                ->select();
        $typelist=M('type')->select();
        $this->assign('typelist',$typelist);
        $this->assign('get',$_GET);
        $this->assign('page', $page->show('Admin'));
        $this->assign('posts', $posts);

        $this->display();
    }
    public function add_obtain(){
        
        if(IS_POST){
            $post=I('post.post');
            $src = M('obtain_log')->add($post);
            if($src){
                $this->msg('添加成功','/index.php/AdminOrder/obtainlog');
            }else{
                $this->msg('添加失败');
            }
        }
        $typelist=M('type')->select();
        $this->assign('typelist',$typelist);
        $this->display();
    }
    public function edit_obtion(){
        $id=I('get.id');

         if (IS_POST) {

            $post=I('post.post');
            if (M('obtain_log')->where(array('id'=>$post[id]))->save($post) !== false) {
                $this->msg("更新成功！",U('Portal/AdminOrder/obtainlog'));
            } else {
                $this->msg("更新失败！");
            }
        }
        $typelist=M('type')->select();
        $this->assign('typelist',$typelist);
        $rs = M('obtain_log')->where(array("id" => $id))->find();
        $this->assign('post',$rs);
        $this->display();
    }
    public function del_obtion(){
        $id=I('id');
        $src=M('obtain_log')->where(array('id'=>$id))->delete();
        if($src){
            $this->success('删除成功！');
        }else{
            $this->error('删除失败');
        }
    }
    public function paihanglog(){
        if(IS_POST){
            $_GET=$_POST;
        }
            $where="1=1";
        if ($_GET['username'] != "") {
            $where.=" and username='".$_GET[username]."'";
        }
        $count = M('jiangjin_log')->where($where)->count();
        $page = $this->page($count,$this->bonus['pagemin']);
        $posts = M('jiangjin_log')
                ->where($where)
                ->order(array("id" => "desc"))
                ->limit($page->firstRow, $page->listRows)
                ->select();
        $this->assign('get',$_GET);
        $this->assign('page',$page->show('Admin'));
        $this->assign('posts',$posts);
        $typelist=M('type')->select();
        $this->assign('typelist',$typelist);
        $this->display();

    }
    public function add_paihang(){
        
         if(IS_POST){
            $post=I('post.post');
            $src = M('jiangjin_log')->add($post);
            if($src){
                $this->msg('添加成功','/index.php/AdminOrder/paihanglog');
            }else{
                $this->msg('添加失败');
            }
        }
        $typelist=M('type')->select();
        $this->assign('typelist',$typelist);
        
        $this->display();
    }
    public function edit_paihang(){
        if(IS_POST){
            $post=I('post.post');
            if (M('jiangjin_log')->where(array('id'=>$post[id]))->save($post) !== false) {
                $this->msg("更新成功！",U('Portal/AdminOrder/paihanglog'));
            } else {
                $this->msg("更新失败！");
            }
        }
        $id=I('get.id');
        $paihang=M('jiangjin_log')->where(array('id'=>$id))->find();
        $this->assign('post',$paihang);
        $this->display();
    }
    public function add_kaijiang(){
        if(IS_POST){
            $post=I('post.post');
            $data['type']=$post['type'];
            $data['number']=$post['qs'];
            if(M('data')->where($data)->find()){
                $this->msg('该期数据已经存在');
            }
            $data['data']=$post['data'];
            $data['time']=strtotime($post['time']);
            $id=M('data')->add($data);
            if($id){
            $this->msg('添加成功','/index.php/Portal/Date/kj/id/'.$id);
            }
        }
        $typelist=M('type')->order('sort asc')->select();
        $this->assign('typelist', $typelist);
        $this->display();
    }
    public function kaijiang(){
        if(IS_POST){
            $_GET=I('post.');
        }
        $where="1=1";   
        if($_GET['type']){
            $where.=" and type ='".$_GET['type']."'";
        }
        if ($_GET['number']) {
            $where.=" and number='".$_GET[number]."'";
        }
        if ($_GET['start_time']) {
            $where.=" and time >= '".$_GET['start_time']."'";
        }
        if ($_GET['end_time']) {
            $where.=" and time <= '".$_GET['end_time']."'";
        }

        $count = M('data')->where($where)->count();
        $page = $this->page($count, $this->bonus['pagemin']);
        $posts = M('data')->where($where)
            ->order(array("id" => "desc"))
            ->limit($page->firstRow, $page->listRows)
            ->select();

        $typelist=M('type')->order('sort asc')->select();
        $this->assign('typelist', $typelist);
        $this->assign('get',$_GET);
        $this->assign("page", $page->show('Admin'));
        $this->assign('posts', $posts);
        $this->display();

    }
    public function kaijiang2(){
        if(IS_POST){
            $_GET=$_POST;
        } 
        if(!$_GET['start_time']){
            $this->error('请选择日期','/index.php/Portal/AdminOrder/kaijiang');
        }
        if($_GET['type']){
            $map['id']=$_GET['type'];
        }
        $day=(strtotime($_GET['start_time'].'00:00:00')-strtotime(date('Y-m-d 00:00:00',time())))/24/3600;
        $typelist=M('type')->where($map)->order('sort asc')->select();
        $yl=array();
        foreach ($typelist as $key => $value) {
            $sj=explode(',', $value['data']);
            for($i=1;$i<=$value[num];$i++){
                eval('$number='.$value[ongetnoed].'($i,$day,$value[oncs]);');
                $map=array();
                $map['number']=$number;
                $map['type']=$value['id'];
                if(!M('data')->where($map)->find()){
                    $data=array();
                    $data['type']=$value['id'];
                    $data['number']=$number;
                    $data['kjtime']=$_GET['start_time'].' '.$sj[$i-1];
                    $yl[$value['id']][]=$data;
                }
            }
        }
        $this->assign('get', $_GET);
        $this->assign('yl', $yl);
        $this->display();
    }
    public function delkaijiang(){
        $id=I('id');
        $src=M('data')->where(array('id'=>$id))->delete();
        if($src){
            $this->success('删除成功！');
        }else{
            $this->error('删除失败');
        }
    }


}
