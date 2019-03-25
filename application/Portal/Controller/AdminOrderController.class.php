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
    public function xgzd(){
        $uid=I('get.uid');
        $batch = I('get.batch');
        if($batch==1){
            $where['BetInfoID']=I('get.BetInfoID');
        }else{
            $where['id']=I('get.id');
        }
        $zdxx = M('userbet'.$uid)->where($where)->select();
        $map['uid']=$uid;
        $map['BetInfoID']=$zdxx[0]['betinfoid'];
        $bet=M('bets')->where($map)->find();


        if(!$bet['lotteryno']){
            $this->error('没有开奖不能修改');
        }
        $this->assign('zdxx', array_reverse($zdxx));
        $this->assign('uid', $uid);
        $this->display();
    }
    public function xgzd_post(){
        $data = I('post.');
        // deb($data);
        $all_data = $data['data'];
        // 通用逻辑修改注单
        $this->commonXgzdWithAllData($all_data, $data['uid']);
        $this->success('修改成功');
    }
    /**
     * 新的方式批量修改注单
     */
    public function xgzd2() {
        $uid=I('get.uid');
        $map['uid']=$uid;
        $map['BetInfoID']=I('get.BetInfoID');
        $bet=M('bets')->where($map)->find();
        // if(!$bet['lotteryno']){
        //     $this->error('没有开奖不能修改');
        // }
        // deb($bet);
        if (!$bet) {
            $this->error('待修改投注不存在');
        }
        $bz_info = parse_bz_string($bet['bz'], $bet['betwayid']);
        if ($bz_info['is_editable'] !== true) {
            $this->error('不支持此下注方式的批量修改');
        }
        $this->assign('bet', $bet);
        $this->assign('bz_info', $bz_info);
        $this->assign('uid', $uid);
        $this->display();
    }
    public function xgzd2_post() {
        $data = I('post.');
        // deb($data);
        $map_bet = [
            'id' => $data['bet_id'],
            'uid' => $data['uid'],
        ];
        $bet = M('bets')->where($map_bet)->find();
        // deb($bet);
        if (!$bet) {
            $this->error('待修改投注不存在');
        }
        $bz_info = parse_bz_string($bet['bz'], $bet['betwayid']);
        if ($bz_info['is_editable'] !== true) {
            $this->error('不支持此下注方式的批量修改');
        }
        $number_list = explode(',', $data['numbers']);
        // deb($number_list);
        if ($bet['count'] != count($number_list)) {
            $this->error('修改失败：生成注单的数量和原注单不一致');
        }
        // 更新所有子级数据
        $map_userbet = [
            'BetInfoID' => $bet['betinfoid'],
        ];
        $zdxx = M('userbet' . $data['uid'])->where($map_userbet)->field("id")->select();
        // deb($zdxx);
        foreach ($zdxx as $k => $v) {
            $userbet_update = [
                'BetNumber' => $number_list[$k],
            ];
            M('userbet' . $data['uid'])->where(['id' => $v['id']])->save($userbet_update);
        }
        // 更新主数据
        $bet_update = [
            'bz'   => compose_bz_string($bet, $data),
            'sftj' => 1,// 将缓存数据再写一遍，参考: web/application/Portal/Dev/bin/task/core/windup.php
        ];
        // deb($bet_update);
        M('bets')->where($map_bet)->save($bet_update);
        // 开奖后，要重新结算
        if ($bet['lotteryno']) {
            $all_data = [];
            $zdxx = M('userbet' . $data['uid'])->where($map_userbet)->field("id, betnumber, odds")->select();
            foreach ($zdxx as $zd) {
                $all_data[$zd['id']] = $zd;
            }
            // deb($all_data);
            // 走通用逻辑
            $this->commonXgzdWithAllData($all_data, $data['uid']);
        }
        $this->success('修改成功');
    }
    /**
     * 通用修改注单功能（用于开奖后）
     */
    private function commonXgzdWithAllData($all_data, $uid) {
        static $play_map = [];
        $update_bet = [];
        $bet_lhxx = [];
        $bet_win = 0;
        $bet_profit = 0;
        foreach ($all_data as $row) {
            $betnumber = $row['betnumber'];
            $odds = $row['odds'];
            $update_userbet = [];
            $update_userbet['BetNumber'] = $betnumber;
            $update_userbet['Odds'] = $odds;
            $cond_userbet = ['id' => $row['id']];
            $userbet = M('userbet' . $uid)->where($cond_userbet)->find();
            // 获取主投注
            if (empty($bet)) {
                $cond_bet = [];
                $cond_bet['uid'] = $uid;
                $cond_bet['BetInfoID'] = $userbet['betinfoid'];
                $bet = M('bets')->where($cond_bet)->find();
                // deb($bet);
            }
            // 是否中奖
            if (!isset($play_map[$userbet['playedid']])) {
                $play_map[$userbet['playedid']] = M('played')->find($userbet['playedid']);
            }
            $play = $play_map[$userbet['playedid']];
            $is_win = call_user_func_array([$this, $play['rulefun']], [$betnumber, $bet['lotteryno']]) ? true : false;
            // echo enjson(['is_win' => $is_win, 'rule' => $play["rulefun"], 'betnumber' => $betnumber, 'lotteryno' => $bet['lotteryno']]) . PHP_EOL . '<br>';
            $update_userbet['fsxx'] = \ReportCalculator::generateFsxxForBet($bet, $userbet['betamount']);
            $update_userbet['lhxx'] = \ReportCalculator::generateLhxxForBet($bet, $userbet['betamount'], $is_win, $odds);
            // 中奖相关字段处理
            if ($is_win) {
                $win_money = $userbet['betamount'] * $odds;
                $update_userbet['WinLoss'] = $win_money;
                $update_userbet['ProfitAndLoss'] = $win_money - $userbet['betamount'];
            }else{
                $update_userbet['WinLoss'] = 0;
                $update_userbet['ProfitAndLoss'] = 0 - $userbet['betamount'];
            }
            // 汇总所有lhxx、盈亏
            $lhxx = dejson($update_userbet['lhxx']);
            foreach ($lhxx as $agent_id => $lhdata) {
                if (!isset($bet_lhxx[$agent_id])) {
                    $bet_lhxx[$agent_id] = ['money' => 0, 'win' => 0];
                }
                $bet_lhxx[$agent_id]['money'] += $lhdata['money'];
                $bet_lhxx[$agent_id]['win'] += $lhdata['win'];
                $bet_lhxx[$agent_id]['money'] = fix_decimal($bet_lhxx[$agent_id]['money']);
                $bet_lhxx[$agent_id]['win'] = fix_decimal($bet_lhxx[$agent_id]['win']);
            }
            $bet_win += $update_userbet['WinLoss'];
            $bet_profit += $update_userbet['ProfitAndLoss'];
            // 更新子注单
            M('userbet' . $uid)->where($cond_userbet)->save($update_userbet);
        }
        // 更新总注单
        $update_bet['fsxx'] = \ReportCalculator::generateFsxxForBet($bet);
        $update_bet['lhxx'] = enjson($bet_lhxx);
        $update_bet['WinLoss'] = fix_decimal($bet_win);
        $update_bet['ProfitAndLoss'] = fix_decimal($bet_profit);
        M('bets')->where($cond_bet)->save($update_bet);
        // deb($update_bet);
        $profit_diff = $bet_profit - $bet['profitandloss'];
        // deb($profit_diff);
        // 用户额度问题
        if ($profit_diff > 0) {
            M('user')->where(['id' => $uid])->setInc('money', abs($profit_diff));
        } else {
            M('user')->where(['id' => $uid])->setDec('money', abs($profit_diff));
        }
        // exit;
    }
    /**
     * 通用修改注单功能（用于开奖后）
     */
    private function commonXgzdWithAllDataOld($all_data, $uid) {
        $myfile = fopen("newfile.txt", "a+") or die("Unable to open file!");
        foreach($all_data as $k=>$v){
            $betnumber=$v['betnumber'];
            $odds=$v['odds'];
            $save1=array();
            $save1['BetNumber']=$betnumber;
            $save1['Odds']=$odds;
            $save2=array();
            $where['id']=$v['id'];
            $zdxx = M('userbet'.$uid)->where($where)->find();
            $play=M('played')->find($zdxx['playedid']);
    
            $map['uid']=$uid;
            $map['BetInfoID']=$zdxx['betinfoid'];
            $bet=M('bets')->where($map)->find();
            
            //减去之前的占成和占成盈亏
            $zdxx_lhxx=json_decode($zdxx['lhxx'],true);
            $bet_lhxx=json_decode($bet['lhxx'],true);
            foreach($bet_lhxx as $k=>$v){
                $bet_lhxx[$k]['money']-=$zdxx_lhxx[$k]['money'];
                $bet_lhxx[$k]['win']-=$zdxx_lhxx[$k]['win'];
            }
            
            //会员列表
            $list=M("user")->select();
            $userlist2=array();
            foreach($list as $key=>$one){
                $userlist2[$one["id"]]=$one;
            }
            //代理列表
            $list=M("agent")->select();
            $agentlist=array();
            foreach($list as $key=>$one){
                $agentlist[$one["id"]]=$one;
            }
            $sjxx = \DataCollector::get(DEV_DATA_PATH . 'tmp/commission'.$zdxx["betinfoid"]."_".$uid);
            $commissionlist=json_decode($sjxx,true); //所有赚水记录
            $commission=$commissionlist['0']; //总代理设置代理的赚水
            $sjcommission=$commissionlist['-1']; //代理设置会员的赚水
            $pratio=$userlist2[$uid]['ratio']; //会员占成
            $commPeilv=0; //总赚水
            $ymoney=0; //总占成
            eval('$sfzj=$this->'.$play["rulefun"].'($betnumber,$bet["lotteryno"]);');
            for($i=$userlist2[$uid]['parent'];$i>0;$i){
                $agent=$agentlist[$i]; //当前代理信息
                $ssjcommission = $sjcommission; //存储上上级赚水信息
                $sjcommission=$commission; //上级赚水信息
                $commission=$commissionlist[$i];
                $commPeilv+=$ssjcommission[$play['bettypeid']]['sjCommission']; //计算总赚水
                $lhmoney=$pratio*$zdxx['betamount']/100; //计算占成金额
                $lhmoney = $lhmoney<0 ? 0 : $lhmoney; //计算占成
                if($lhmoney>$commission[$play['bettypeid']]['MaxLimitStore']){
                    $lhmoney=$commission[$play['bettypeid']]['MaxLimitStore'];
                }
                if($lhmoney+$ymoney>$zdxx['betamount']){ //计算占成
                    $lhmoney=$zdxx['betamount']-$ymoney;
                }
                $ymoney+=$lhmoney; //计算总占成
                $lhmoney2=$lhmoney; //计算占成盈亏
                if($sfzj){
                    $lhmoney2 = $lhmoney - ($lhmoney * $zdxx["odds"]) - ($lhmoney * $commPeilv);
                    fwrite($myfile, "{$lhmoney2} = {$lhmoney} - ({$lhmoney} * {$zdxx['odds']}) - ({$lhmoney} * {$commPeilv});\r\n");
                }else{
                    $lhmoney2 = $lhmoney - ($lhmoney * $commPeilv);
                }
                $lhxx[$i]['money']+=$lhmoney;
                $lhxx[$i]['win']+=$lhmoney2;
                $i=$agent["parent"];
                $pratio=$agent['pratio'];
                if($agent['agentlevel']==1){
                    $agent["parent"]=0;
                }
            }
            
            //加上新的占成和占成盈亏
            foreach($bet_lhxx as $kk=>$vv){
                $bet_lhxx[$kk]['money']+=$lhxx[$kk]['money'];
                $bet_lhxx[$kk]['win']+=$lhxx[$kk]['win'];
            }
            
            if($sfzj){
                $jjmoney=$zdxx["betamount"]*$odds;
                $res=M('user')->where(array('id'=>$uid))->setInc('money', $jjmoney);
                $save1["WinLoss"]=$jjmoney;
                $save1["ProfitAndLoss"]=$jjmoney-$zdxx["betamount"];
                $save2["WinLoss"]=$bet["winloss"]-$zdxx["winloss"]+$jjmoney;
                $save2["ProfitAndLoss"]=$bet["profitandloss"]-$zdxx["winloss"]+$jjmoney;
            }else{
                $save1["WinLoss"]=0;
                $save1["ProfitAndLoss"]=0-$zdxx["betamount"];
                $save2["WinLoss"]=$bet["winloss"]-$zdxx["winloss"];
                $save2["ProfitAndLoss"]=$bet["profitandloss"]-$zdxx["winloss"];
            }
            
            $save1['lhxx']=json_encode($lhxx);
            $save2['lhxx']=json_encode($bet_lhxx);

            M('userbet'.$uid)->where($where)->save($save1);
            M('bets')->where($map)->save($save2);
        }
    }
    public function index2(){
        $where=' BetInfoID='.$_GET['BetInfoID'].' ';
        if($_GET['sfzj']){
            $where.=" and winloss >0";
        }
        if($_GET['betnumber']){
             $where.=" and betnumber like '%{$_GET['betnumber']}%' ";
             $this->assign('get', array('betnumber'=>$_GET['betnumber']));
        }
        $map['uid']=$_GET['uid'];
        $map['BetInfoID']=$_GET['BetInfoID'];
        $bet=M('bets')->where($map)->find();
        $this->assign('bet', $bet);
        $count = M('userbet'.$_GET['uid'])->where($where)->count();
        $page = $this->page($count, $this->bonus['pagemin']);
        $posts = M('userbet'.$_GET['uid'])->where($where)->order(array("id" => "desc"))
            ->limit($page->firstRow, $page->listRows)
            ->select();
        $this->assign('uid', $map['uid']);
        $this->assign('BetInfoID', $map['BetInfoID']);
        $this->assign("page", $page->show('Admin'));
        $this->assign('posts', $posts);
        // 快选批量修改
        $bz_info = parse_bz_string($bet['bz'], $bet['betwayid']);
        $this->assign('bz_info', $bz_info);
        $this->display();
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
        $page = $this->page($count, 100);
        $posts = M('bets')->where($where)
            ->order(array("id" => "desc"))
            ->limit($page->firstRow, $page->listRows)
            ->select();
        // deb($posts);
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
    public function add_tuima(){
        $data=array();
        $money=0;
        $betmoney=array();
        $betcount=array();
        $betback=array();
        
        $where['typeid'] = $_GET['type'];
        $where['PeriodsNumber'] = $PeriodsNumber = $_GET['number'];
        $where['zt'] = 0;
        
        $BetList = M('bets')->where($where)->select();
        if($BetList)
        foreach($BetList as $k=>$v){
            $map['BetInfoID']=$v['betinfoid'];
            $map['PeriodsNumber'] = $v['periodsnumber'];
            $map['sftm']=0;
            $BetInfoList=M("userbet".$v['uid'])->where($map)->select();
            if($BetInfoList)
            foreach($BetInfoList as $k1=>$v1){
                if($v1['periodsnumber']==$PeriodsNumber){
                    $money=$money+$v1['betamount'];
                    $betmoney[$v1['betinfoid']]+=$v1['betamount'];
                    $betcount[$v1['betinfoid']]+=1;
                    $betback[$v1['betinfoid']]+=$v1['backcomm'];
                    $list1[$v['uid']][$v1['betinfoid']][]=$v1['betnumber'];
                }
            }
        }

        $data['time1']=microtime(TRUE)-$GLOBALS["_beginTime"];
        
        foreach($list1 as $uid=>$list2){
            foreach ($list2 as $key => $value) {
                $map2['BetInfoID']=$key;
                $save['sftm']='1';
                $save['ProfitAndLoss']=0;
                $save['UpdateDt']=date('Y-m-d H:i:s');
                $mapbet['BetInfoID']=$key;
                $mapbet['uid']=$uid;
                $betxx=M('bets')->where($mapbet)->find();
                $savexx['BetAmount']=$betxx['betamount']-$betmoney[$key];
                $savexx['count']=$betxx['count']-$betcount[$key];
                $savexx['BackComm']=$betxx['backcomm']-$betback[$key];
                $savexx['sftj']=1;
                $savexx['sftm']=1;
                foreach ($value as $key3 => $value3) {
                    $map2['BetNumber']=$value3;
                    M("userbet".$uid)->where($map2)->save($save);
                }
                M('bets')->where($mapbet)->save($savexx);
            }
            moneybh($uid,$betxx['betamount'],'退码',array('liqtype'=>'5'));
        }
        $this->success('退码成功！');
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






    function ssc1($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[0]==$number[0] && $betlist[1]==$number[1]){
                    $result=1;
                }
                return $result;
            }
            function ssc2($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[0]==$number[0] && $betlist[2]==$number[2]){
                    $result=1;
                }
                return $result;
            }
            function ssc3($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[0]==$number[0] && $betlist[3]==$number[3]){
                    $result=1;
                }
                return $result;
            }
            function ssc4($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[1]==$number[1] && $betlist[3]==$number[3]){
                    $result=1;
                }
                return $result;
            }
            function ssc5($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[2]==$number[2] && $betlist[1]==$number[1]){
                    $result=1;
                }
                return $result;
            }
            function ssc6($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[2]==$number[2] && $betlist[3]==$number[3]){
                    $result=1;
                }
                return $result;
            }
            function ssc7($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[3]==$number[3] && $betlist[4]==$number[4]){
                    $result=1;
                }
                return $result;
            }
            function ssc8($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[0]==$number[0] && $betlist[4]==$number[4]){
                    $result=1;
                }
                return $result;
            }
            function ssc9($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[0]==$number[0] && $betlist[1]==$number[1] && $betlist[2]==$number[2]){
                    $result=1;
                }
                return $result;
            }
            function ssc10($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[0]==$number[0] && $betlist[1]==$number[1] && $betlist[3]==$number[3]){
                    $result=1;
                }
                return $result;
            }
            function ssc11($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[0]==$number[0] && $betlist[2]==$number[2] && $betlist[3]==$number[3]){
                    $result=1;
                }
                return $result;
            }
            function ssc12($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[2]==$number[2] && $betlist[1]==$number[1] && $betlist[3]==$number[3]){
                    $result=1;
                }
                return $result;
            }
            function ssc13($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist[0]==$number[0] && $betlist[1]==$number[1] && $betlist[2]==$number[2] && $betlist[3]==$number[3]){
                    $result=1;
                }
                return $result;
            }
            function ssc14($bet,$data){
                $result=0;
                $number=explode(",", $data);
                unset($number[4]);
                $c=array_count_values($number);

                $betlist=str_split($bet);

                $c2=array_count_values($betlist);
                print_r($c);
                print_r($c2);
                $count=0;
                foreach($c2 as $key=>$value){
                    if(in_array($key,$number)){
                        if($value<=$c[$key]){
                            $count=$count+$value;
                        }
                    }
                }
                if($count==2){
                    $result=1;
                }
                return $result;
            }
            function ssc15($bet,$data){
                $result=0;
                $number=explode(",", $data);
                unset($number[4]);
                $c=array_count_values($number);

                $betlist=str_split($bet);

                $c2=array_count_values($betlist);

                $count=0;
                foreach($c2 as $key=>$value){
                    if(in_array($key,$number)){
                        if($value<=$c[$key]){
                            $count=$count+$value;
                        }
                    }
                }
                if($count==3){
                    $result=1;
                }
                return $result;
            }
            function ssc16($bet,$data){
                $result=0;
                $number=explode(",", $data);
                unset($number[4]);
                $c=array_count_values($number);

                $betlist=str_split($bet);

                $c2=array_count_values($betlist);

                $count=0;
                foreach($c2 as $key=>$value){
                    if(in_array($key,$number)){
                        if($value<=$c[$key]){
                            $count=$count+$value;
                        }
                    }
                }
                if($count==4){
                    $result=1;
                }
                return $result;
            }
            function ssc17($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist["0"]==$number["0"]){
                    $result=1;
                }
                return $result;
            }
            function ssc18($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist["1"]==$number["1"]){
                    $result=1;
                }
                return $result;
            }
            function ssc19($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist["2"]==$number["2"]){
                    $result=1;
                }
                return $result;
            }
            function ssc20($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist["3"]==$number["3"]){
                    $result=1;
                }
                return $result;
            }


            function ssc21($bet,$data){
                $result=0;
                $number=explode(",", $data);
                $betlist=str_split($bet);
                if($betlist["4"]==$number["4"]){
                    $result=1;
                }
                return $result;
            }

}
