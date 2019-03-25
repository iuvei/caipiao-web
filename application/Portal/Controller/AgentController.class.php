<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class AgentController extends HomebaseController {

  protected $user_model;

  public function __construct() {
    parent::__construct();
    $this->check_login2();
    if($this->agent['first']==0 && ACTION_NAME!='ChangePwd' && ACTION_NAME!='EditPassword2'){
      header("Location: /index.php/portal/agent/ChangePwd");
      exit();
    }
    $this->user_model = M('user');
    $this->agent_model = M('agent');
  }
  public function GetAgentCreditByID(){
    header('Content-type: application/json');
    $data=array();
    $agent = $this->agent;
    if($agent['issubaccount']){
      $agent = M('agent')->find($agent['parent']);
    }
    $data['AgentName'] = $agent['user_login'];
    $data['AgentLevel'] = M('agent_level')->where(['level' => $agent['agentlevel']])->find()['title'];
    $data['DefaultCredit'] = $agent['money'];
    $data['GetUsedCredit'] = 0;
    $list[]=$data;
    echo json_encode($list);
  }
  public function GrossPrint(){
    $this->display();
  }
  public function NewSubordinate(){
    $this->display();
  }
  public function CompanySetting(){
    $this->display();
  }
  public function DisclaimerStatement(){
    $this->display();
  }
  public function NewSubordinateAdd(){
    $this->display();
  }
  public function GetRatioByCompanyID(){
    header('Content-type: application/json');
    $parent=M('agent')->find($_GET['ID']);
    if($parent['agentlevel']<=1){
      $data['DefaultCredit'] = AGENT_BIG_AMOUNT;
      $data['Ratio']=100;
    }
    else{
      $data['DefaultCredit']=$parent['money'];
      $data['Ratio']=$parent['ratio'];
    }
    $data['LoginName']=$parent['user_login'];
    if($parent['agentlevel']<=1){
      $data['UsedCredit'] = AGENT_BIG_AMOUNT;
    }
    else{
      $data['UsedCredit']=$parent['money'];
    }
    $dataxx[]=$data;
    echo json_encode($dataxx);
  }
  public function GetLotteryResult(){
    header('Content-type: application/json');
    $start=$_GET['StartDate'];
    $end=$_GET['EndDate'];

    if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
      $where['time']=array('between',strtotime($start."06:00:00").','.(strtotime($end."06:00:00")+24*3600));
    }
    else{
      $where['time']=array('between',(strtotime($start."06:00:00")-24*3600).','.strtotime($end."06:00:00"));
    }
    $count=M('data')->where($where)->count();
    $list=M('data')->where($where)->limit((($_GET['pageIndex']-1)*50).',50')->order('time desc')->select();
    $PageCount=ceil($count/50);
    $list2=array();
    foreach ($list as $key => $value) {
      $list2[$key]['CreateDt']=date('Y-m-d H:i:s',$value['time']);
      $list2[$key]['DrawDt']=date('Y-m-d H:i:s',$value['time']);
      $list2[$key]['OpenDt']=date('Y-m-d H:i:s',$value['time']);
      $list2[$key]['ID']=$value['number'];
      $list2[$key]['PeriodsNumber']=$value['number'];
      $list2[$key]['ResultNumber']=$value['data'];
    }
    $data['list']=$list2;
    $data['PageCount']=$PageCount;
    echo json_encode($data);
  }
  public function SttingsQuota(){
    $this->display();
  }
  public function ModifyAgentBetTypeSetting(){
    header('Content-type: application/json');
    if($_POST['isMember']=='true'){
      $user=M('user');
    }
    else{
      $user=M('agent');
    }
    $map['user_login']=$_POST['UserName']; 
    $agent=$user->where($map)->find();
    $parent=M('agent')->find($agent['parent']);
    $pcommission=json_decode($parent['commission'],true);
    $list=json_decode($_POST['list'],true);
    $list2=json_decode($agent['commission'],true);
    foreach ($list as $key => $value) {
      if($value['BetTypeID']<0){
        $value['BetTypeID']=$value['BetTypeID']+25;
      }
      $list2[$value['BetTypeID']]['MinLimitBetAmount']=$value['MinLimitBetAmount'];
      $list2[$value['BetTypeID']]['MaxLimitSigleBet']=$value['MaxLimitSigleBet'];
      $list2[$value['BetTypeID']]['MaxLimitItemBet']=$value['MaxLimitItemBet'];
      $list2[$value['BetTypeID']]['Commission']=fix_decimal($value['Commission']+$pcommission[$value['BetTypeID']]['Commission'], 3);
      $list2[$value['BetTypeID']]['sjCommission']=fix_decimal($value['Commission'], 3);
      $list2[$value['BetTypeID']]['MaxLimitStore']=$value['MaxLimitStore'];
    }
    if($_POST['isMember']=='true'){
      $list3=json_decode($agent['sjcommission'],true);
      foreach ($list2 as $key => $value) {
        $play_commision = \ReportCalculator::getPlayCommisionMap($key);
        $list3[$key]['Commission']=$list2[$key]['Commission']+$list3[$key]['sjCommission'];
        if($list2[$key]['Commission']+$list3[$key]['sjCommission']>$play_commision){
          $list3[$key]['Commission']=$play_commision;
          $list3[$key]['sjCommission']=$play_commision-$list2[$key]['Commission'];
          if ($list3[$key]['sjCommission'] < 0) {
            // $this->ejson('修改失败，此次修改导致赚水小于0');
          }
        }
        $list3[$key]['MinLimitBetAmount']=$list2[$key]['MinLimitBetAmount'];
        $list3[$key]['MaxLimitSigleBet']=$list2[$key]['MaxLimitSigleBet'];
        $list3[$key]['MaxLimitItemBet']=$list2[$key]['MaxLimitItemBet'];
      }
      $save['sjcommission']=json_encode($list3);
    }
    else{
      $this->xgxj($agent['id'],$list2);
      $this->xguser($agent['id'],$list2);
    }
    $save['Commission']=json_encode($list2);
    $user->where($map)->save($save);
    $data['status']=true;
    $data['info']="修改成功";
    echo json_encode($data);
  }
  public function xgxj($id,$commission){
    $map['parent']=$id;
    $list=M('agent')->where($map)->select();
    foreach ($list as $key2 => $value2) {
      $list2=json_decode($value2['commission'],true);
      foreach ($commission as $key => $value) {
        $play_commision = \ReportCalculator::getPlayCommisionMap($key);
        if($value['MinLimitBetAmount']>$list2[$key]['MinLimitBetAmount']){
          $list2[$key]['MinLimitBetAmount']=$value['MinLimitBetAmount'];
        }
        if($value['MaxLimitSigleBet']<$list2[$key]['MaxLimitSigleBet']){
          $list2[$key]['MaxLimitSigleBet']=$value['MaxLimitSigleBet'];
        }
        if($value['MaxLimitItemBet']<$list2[$key]['MaxLimitItemBet']){
          $list2[$key]['MaxLimitItemBet']=$value['MaxLimitItemBet'];
        }
        $list2[$key]['Commission']=$value['Commission']+$list2[$key]['sjCommission'];
        if($list2[$key]['Commission']>$play_commision){
          $list2[$key]['Commission']=$play_commision;
          $list2[$key]['sjCommission']=$play_commision-$value['Commission'];
          if ($list2[$key]['sjCommission'] < 0) {
            $this->ejson('修改失败，此次修改导致下级赚水小于0');
          }
        }
      }
      $this->xgxj($value2['id'],$list2);
      $this->xguser($value2['id'],$list2);
      $map2['id']=$value2['id'];
      $save['Commission']=json_encode($list2);
      M('agent')->where($map2)->save($save);
    }
  }
  public function xguser($id,$commission){
    $map['parent']=$id;
    $list=M('user')->where($map)->select();
    foreach ($list as $key2 => $value2) {
      $list2=json_decode($value2['commission'],true);
      $list3=json_decode($value2['sjcommission'],true);
      foreach ($commission as $key => $value) {
        $play_commision = \ReportCalculator::getPlayCommisionMap($key);
        header('X-DEBUG-PLAYED-' . $key . ': ' . $play_commision);
        if($value['MinLimitBetAmount']>$list2[$key]['MinLimitBetAmount']){
          $list2[$key]['MinLimitBetAmount']=$value['MinLimitBetAmount'];
          $list3[$key]['MinLimitBetAmount']=$value['MinLimitBetAmount'];
        }
        if($value['MaxLimitSigleBet']<$list2[$key]['MaxLimitSigleBet']){
          $list2[$key]['MaxLimitSigleBet']=$value['MaxLimitSigleBet'];
          $list3[$key]['MaxLimitSigleBet']=$value['MaxLimitSigleBet'];
        }
        if($value['MaxLimitItemBet']<$list2[$key]['MaxLimitItemBet']){
          $list2[$key]['MaxLimitItemBet']=$value['MaxLimitItemBet'];
          $list3[$key]['MaxLimitItemBet']=$value['MaxLimitItemBet'];
        }

        $list2[$key]['Commission']=$value['Commission']+$list2[$key]['sjCommission'];
        if($list2[$key]['Commission']>$play_commision){
          $list2[$key]['Commission']=$play_commision;
          $list2[$key]['sjCommission']=$play_commision-$value['Commission'];
          if ($list2[$key]['sjCommission'] < 0) {
            $this->ejson('修改失败，此次修改导致会员赚水小于0, 玩法' . $play_commision . ', ' .  $value['Commission']);
          }
        }
        $list3[$key]['Commission']=$list2[$key]['Commission']+$list3[$key]['sjCommission'];
        if($list2[$key]['Commission']+$list3[$key]['sjCommission']>$play_commision){
          $list3[$key]['Commission']=$play_commision;
          $list3[$key]['sjCommission']=$play_commision-$list2[$key]['Commission'];
          if ($list3[$key]['sjCommission'] < 0) {
            $this->ejson('修改失败，此次修改导致list3赚水小于0');
          }
        }
      }
      $map2['id']=$value2['id'];
      $save['Commission']=json_encode($list2);
      $save['sjcommission']=json_encode($list3);
      M('user')->where($map2)->save($save);
    }
  }
  public function dologin(){
    if($this->agent['agentlevel']<=3){
      $id = I('get.id');
      session_start();
      $_SESSION['qzdlid']=$id;
      header("Location:/");
    }
  }
  public function ModifyLimitStore(){
    header('Content-type: application/json');
    $user=M('agent');
    $map['user_login']=$this->agent_login; 
    $agent=$user->where($map)->find();
    $parent=$user->find($agent['parent']);
    $pcommission=json_decode($parent['commission'],true);
    $list=json_decode($_POST['TestList'],true);
    if($agent['commission']){
      $list2=json_decode($agent['commission'],true);
    }
    else{
      $list2=array();
    }
    $logstr = '';
    foreach ($list as $key => $value) {
      $list2[$value['BetTypeID']]['MaxLimitStore']=$value['MaxLimitStore'];
      $logstr.='类别：'.$value['BetTypeName'].'，货量:'.$value['MaxLimitStore'].' <br>';
    }
    $this->addlog($this->agent_login,$this->agent_login,$logstr,1);
    $save['Commission']=json_encode($list2);
    $user->where($map)->save($save);
    $data['status']=true;
    $data['info']="修改成功";
    echo json_encode($data);
  }
  public function GetCommission(){
    header('Content-type: application/json');
    $user=M('agent');
    $agent=$user->find($this->aid);
    if($agent['issubaccount']){
      $agent = M('agent')->find($agent['parent']);
    }
    $commission=json_decode($agent['commission'],true);
    $parent=M('agent')->find($agent['parent']);
    $pcommission=json_decode($parent['commission'],true);
    $playlist=M('played')->order('sort desc')->select();
    $data=array();
    foreach ($playlist as $key => $value) {
      $play=array();
      $play['Multiple']=$value['groupid'];
      $play['SpaceBetween']='0.0010';
      $play['MinLimitOdds']='0.0';
      $play['Lottery']='1';
      $play['BetTypeID']=$value['bettypeid'];
      $play['BetTypeName']=$value['name'];
      $odds=explode('/', $value['bonusprop']);
      $odds2=explode('/', $value['cbonusprop']);
      $play['PCommission']=fix_decimal($pcommission[$value['bettypeid']]['Commission']+0, 4);
      for($i=1;$i<5;$i++){
        $play['BLimitOdds'.$i]=fix_decimal($odds[($i-1)]+0, 4);
        $play['HLimitOdds'.$i]=fix_decimal($odds2[($i-1)]+0, 4);
        $play['PLimitOdds'.$i]=fix_decimal($play['BLimitOdds'.$i]-$play['HLimitOdds'.$i]*$play['PCommission'], 4);
        $play['LimitOdds'.$i]=fix_decimal($play['BLimitOdds'.$i]-$play['HLimitOdds'.$i]*$commission[$value['bettypeid']]['Commission'], 4);
        $play['MinLimitOdds'.$i]=0;
      }
      $play['MaxCommission']=fix_decimal(($value['commission']-$play['PCommission']), 4);
      $play['Commission']=fix_decimal(($commission[$value['bettypeid']]['commission']-$play['PCommission']), 4);
      $play['EndCommission']=fix_decimal($value['commission'], 4);
      $play['BeginCommission']='0';
      $play['BackCommission']='0';
      $play['MaxLimitStore']=$commission[$value['bettypeid']]['MaxLimitStore']+0;

      if(!$commission[$value['bettypeid']]['MinLimitBetAmount']){
        $play['MinLimitBetAmount']=fix_decimal($value['minamount'], 4);
      }
      else{
        $play['MinLimitBetAmount']=fix_decimal($commission[$value['bettypeid']]['MinLimitBetAmount'], 4);
      }
      if(!$commission[$value['bettypeid']]['MaxLimitSigleBet']){
        $play['MaxLimitSigleBet']=fix_decimal($value['maxbet'], 4);
      }
      else{
        $play['MaxLimitSigleBet']=$commission[$value['bettypeid']]['MaxLimitSigleBet'];
      }
      if(!$commission[$value['bettypeid']]['MaxLimitItemBet']){
        $play['MaxLimitItemBet']=fix_decimal($value['maxcount'], 4);
      }
      else{
        $play['MaxLimitItemBet']=fix_decimal($commission[$value['bettypeid']]['MaxLimitItemBet'], 4);
      }


      if(!$pcommission[$value['bettypeid']]['PMinLimitBetAmount']){
        $play['PMinLimitBetAmount']=fix_decimal($value['minamount'], 4);
      }
      else{
        $play['PMinLimitBetAmount']=fix_decimal($pcommission[$value['bettypeid']]['PMinLimitBetAmount'], 4);
      }
      if(!$pcommission[$value['bettypeid']]['PMaxLimitSigleBet']){
        $play['PMaxLimitSigleBet']=fix_decimal($value['maxbet'], 4);
      }
      else{
        $play['PMaxLimitSigleBet']=$pcommission[$value['bettypeid']]['PMaxLimitSigleBet'];
      }
      if(!$pcommission[$value['bettypeid']]['PMaxLimitItemBet']){
        $play['PMaxLimitItemBet']=fix_decimal($value['maxcount'], 4);
      }
      else{
        $play['PMaxLimitItemBet']=fix_decimal($pcommission[$value['bettypeid']]['PMaxLimitItemBet'], 4);
      }
      $data[]=$play;
    }
    echo json_encode($data);
  }
  public function GetAgentCommission(){
    header('Content-type: application/json');
    if($_GET['isMember']=='true'){
      $user=M('user');
    }
    else{
      $user=M('agent');
    }
    $agent=$user->find($_GET['AgentID']);
    $commission=json_decode($agent['commission'],true);
    $parent=M('agent')->find($agent['parent']);
    $pcommission=json_decode($parent['commission'],true);
    $playlist=M('played')->order('sort asc')->select();
    $data=array();
    foreach ($playlist as $key => $value) {
      $play=array();
      $play['Multiple']=$value['groupid'];
      $play['SpaceBetween']='0.0010';
      $play['MinLimitOdds']='0.0';
      $play['Lottery']='1';
      $play['BetTypeID']=$value['bettypeid'];
      $play['BetTypeName']=$value['name'];
      $odds=explode('/', $value['bonusprop']);
      $odds2=explode('/', $value['cbonusprop']);
      $play['PCommission']=fix_decimal($pcommission[$value['bettypeid']]['Commission'], 3);
      for($i=1;$i<5;$i++){
        $play['BLimitOdds'.$i]=fix_decimal($odds[($i-1)]+0, 4);
        $play['HLimitOdds'.$i]=fix_decimal($odds2[($i-1)]+0, 4);
        $play['PLimitOdds'.$i]=fix_decimal($play['BLimitOdds'.$i]-$play['HLimitOdds'.$i]*$play['PCommission'], 4);
        $play['LimitOdds'.$i]=fix_decimal($play['BLimitOdds'.$i]-$play['HLimitOdds'.$i]*$commission[$value['bettypeid']]['Commission'], 4);
        $play['MinLimitOdds'.$i]=0;
      }
      $play['MaxCommission']=fix_decimal($value['commission']-$play['PCommission'], 3);
      $play['Commission']=fix_decimal($commission[$value['bettypeid']]['Commission']-$play['PCommission'], 3);
      $play['EndCommission']=fix_decimal($value['commission'], 3);
      $play['BeginCommission']='0';
      $play['BackCommission']='0';
      $play['MaxLimitStore']=$commission[$value['bettypeid']]['MaxLimitStore']+0;

      if(!$commission[$value['bettypeid']]['MinLimitBetAmount']){
        $play['MinLimitBetAmount']=fix_decimal($value['minamount'], 4);
      }
      else{
        $play['MinLimitBetAmount']=fix_decimal($commission[$value['bettypeid']]['MinLimitBetAmount'], 4);
      }
      if(!$commission[$value['bettypeid']]['MaxLimitSigleBet']){
        $play['MaxLimitSigleBet']=fix_decimal($value['maxbet'], 4);
      }
      else{
        $play['MaxLimitSigleBet']=$commission[$value['bettypeid']]['MaxLimitSigleBet'];
      }
      if(!$commission[$value['bettypeid']]['MaxLimitItemBet']){
        $play['MaxLimitItemBet']=fix_decimal($value['maxcount'], 4);
      }
      else{
        $play['MaxLimitItemBet']=fix_decimal($commission[$value['bettypeid']]['MaxLimitItemBet'], 4);
      }


      if(!$pcommission[$value['bettypeid']]['MinLimitBetAmount']){
        $play['PMinLimitBetAmount']=fix_decimal($value['minamount'], 4);
      }
      else{
        $play['PMinLimitBetAmount']=fix_decimal($pcommission[$value['bettypeid']]['MinLimitBetAmount'], 4);
      }
      if(!$pcommission[$value['bettypeid']]['MaxLimitSigleBet']){
        $play['PMaxLimitSigleBet']=fix_decimal($value['maxbet'], 4);
      }
      else{
        $play['PMaxLimitSigleBet']=$pcommission[$value['bettypeid']]['MaxLimitSigleBet'];
      }
      if(!$pcommission[$value['bettypeid']]['MaxLimitItemBet']){
        $play['PMaxLimitItemBet']=fix_decimal($value['maxcount'], 4);
      }
      else{
        $play['PMaxLimitItemBet']=fix_decimal($pcommission[$value['bettypeid']]['MaxLimitItemBet'], 4);
      }
      $data[]=$play;
    }
    echo json_encode($data);
  }
  public function ModifyMemberPasswordByUp(){
    header('Content-type: application/json');
    if($_POST['password']!=$_POST['password1']){
      $this->ejson('两次密码输入不一样');
    }
    $save['user_pass']=md5($_POST['password']);
    M('user')->where(array('user_login'=>$_POST['userName']))->save($save);

    $this->addlog($this->agent['user_login'],$_POST['userName'],'修改密码');
    $data['status']=true;
    $data['info']="修改成功";
    echo json_encode($data);  
  }
  public function  EditLoginPwd(){
    header('Content-type: application/json');
    $editxx=explode('|',$_POST['Edit']);
    $save['user_pass']=md5($editxx[1]);
    M('agent')->where(array('user_login'=>$editxx[0]))->save($save);
    $this->addlog($this->agent['user_login'],$editxx[0],'修改密码');
    $data['status']=true;
    $data['info']="修改成功";
    echo json_encode($data);  
  }
  public function GetUsableAgentLevel(){
    header('Content-type: application/json');
    $agent=M('agent')->where(array('id'=>$_GET['ID']))->find();
    $list=M('agent_level')->where(array('level'=>array('gt',$agent['agentlevel'])))->select();
    $data=array();
    foreach ($list as $key => $value) {
      $level=array();
      $level['LevelID']=$value['id'];
      $level['AgentLevel']=$value['level'];
      $level['LevelName']=$value['title'];
      $data[]=$level;
    }
    echo json_encode($data);
  }

  public function Editratio($id,$ratio){
    $where='parent='.$id.' and ratio+pratio>'.$ratio;
    $list=M('agent')->where($where)->select();
    foreach($list as $key=>$value){
      $save=array();
      if($value['ratio']>$ratio){
        $save['ratio']=$ratio;
        $this->Editratio($value['id'],$save['ratio']);
        $save['pratio']=0;
      }
      else{
        $save['pratio']=$ratio-$value['ratio'];
      }
      M('agent')->where(array('id'=>$value['id']))->save($save);
    }
  }
  public function EditNewSubordinate(){
    header('Content-type: application/json');

    $agent=M('agent')->where(array('user_login'=>$_POST['LoginName']))->find();
    $parent=M('agent')->find($agent['parent']);

    $save['user_login']=$_POST['LoginName'];
    $save['nickname']=$_POST['NickName'];
    $save['money']=$_POST['DefaultCredit'];

    $notice='';
    // print_r([$save, $agent]);
    if($save['money']!=$agent['money']){
      if($parent['companytype']=='1' || $parent['companytype']=='2'){
        if($save['money']<0){
          $this->ejson('金额不能小于0');
        }
        if($parent['money']<$save['money']-$agent['money']){
          $this->ejson('上级余额不足');
        }
        M('agent')->where(array('id'=>$parent['id']))->setDec('money',$save['money']-$agent['money']);
      }
      $notice.='信用额度：'.$agent['money'].'改成'.$save['money'];
    }

    $save['pratio']=(float)($_POST['CurrentLevelRatio']);
    $save['ratio']=(float)($_POST['DownLevelRatio']);
    if($save['ratio']!=$agent['ratio']){
      $this->Editratio($agent['id'],$save['ratio']);
      $notice.='占成：'.$agent['ratio'].'改成'.$save['ratio'];
    }
    $save['describe']=$_POST['Describe'];
    if ($_POST['Status'] != $agent['user_status']) {
      $save['user_status'] = $_POST['Status'];
      $notice .= '用户状态：' . $agent['user_status'] . '改成' . $_POST['Status'];
    }
    if($_POST['ContributeRatio']){
      $save['ContributeRatio']=$_POST['ContributeRatio'];
    }
    header('X-DEBUG-MODIFY: ' . enjson($save));
    $res = M('agent')->where(array('user_login'=>$_POST['LoginName']))->save($save);
    if ($res) {
      $this->addlog($this->agent['user_login'],$_POST['LoginName'],'当前用户上级用户为：'.$parent['user_login'].' '.$notice);
      $data['status']=true;
      $data['info']="修改成功";
      echo json_encode($data);
    }
    else{
      $this->ejson('修改失败');
    }
  }
  public function EditCompanySetting(){
    header('Content-type: application/json');
    $save['nickname']=$_POST['NickName'];

    //$save['money']=$_POST['DefaultCredit'];

    $save['ratio']=$_POST['Ratio'];

    $save['describe']=$_POST['Describe'];
    $save['user_status']=$_POST['CompanyStatus'];
    if($_POST['Welfare']){
      $save['Welfare']=$_POST['Welfare'];
    }
    $res=M('agent')->where(array('user_login'=>$_POST['LoginName']))->save($save);
    if($res){
      $this->addlog($this->agent['user_login'],$_POST['LoginName'],'修改信息');
      $data['status']=true;
      $data['info']="修改成功";
      echo json_encode($data);
    }
    else{
      $this->ejson('修改失败');
    }
  }
  public function ModifyMemberInfo(){
    header('Content-type: application/json');
    $agent=M('user')->where(array('user_login'=>$_POST['LoginName']))->find();
    if (empty($agent)) {
        $this->ejson('代理账号为空: ' . $_POST['LoginName']);
    }
    $parent=M('agent')->find($agent['parent']);
    $save['user_login']=$_POST['LoginName'];
    $save['user_nicename']=$_POST['NickName'];
    $save['money']=$_POST['DefaultCredit'];
    $notice='';
    if($save['money']!=$agent['money']){
      if($save['money']<0){
        $this->ejson('金额不能小于0');
      }
      if($parent['money']<$save['money']-$agent['money']){
        $this->ejson('上级余额不足: ' . enjson(['parent' => $parent['money'], 'save' => $save['money'], 'agent' => $agent['money']]));
      }
      else{
        M('agent')->where(array('id'=>$parent['id']))->setDec('money',$save['money']-$agent['money']);
      }
      $notice.='信用额度：'.$agent['money'].'改成'.$save['money'];
    }
    $save['ratio']=$_POST['CurrentLevelRatio'];
    if($save['ratio']!=$agent['ratio']){
      $notice.='占成：'.$agent['ratio'].'改成'.$save['ratio'];
    }
    $save['describe']=$_POST['Describe'];
    $save['user_status']=$_POST['Status'];
    $res=M('user')->where(array('user_login'=>$_POST['LoginName']))->save($save);
    if($res){
      $this->addlog($this->agent['user_login'],$_POST['LoginName'],'当前用户上级用户为：'.$parent['user_login'].' '.$notice);
      $data['newAgentID']=$res;
      $data['status']=true;
      $data['info']="修改成功";
      echo json_encode($data);
    }
    else{
      $this->ejson('修改失败');
    }
  }
  public function AddNewSubordinate(){
    header('Content-type: application/json');
    $map['user_login']=$_POST['LoginName'];
    if(M('agent')->where($map)->find()){
      $this->ejson('账户已经存在');
    }
    $map2['user_login']=$_POST['ParentName'];
    //$map2['id']=$_POST['ParentID'];
    $parent=M('agent')->where($map2)->find();
    if(!$parent){
      $this->ejson('上级不存在');
    }
    if($parent['issubaccount']){
      $parent = M('agent')->where($map2)->find($parent['parent']);
    }
    if(!$parent){
      $this->ejson('上级不存在');
    }
    $commission=json_decode($parent['commission'],true);
    foreach($commission as $key=>$value){
      $commission[$key]['MaxLimitStore']=0;
    }
    $add['Commission']=json_encode($commission);
    $add['user_login']=$_POST['LoginName'];
    $add['nickname']=$_POST['NickName'];
    $add['user_pass']=md5($_POST['password']);
    $add['money']=$_POST['DefaultCredit'];
    $add['pratio']=$_POST['CurrentLevelRatio'];
    $add['ratio']=$_POST['DownLevelRatio'];
    $add['describe']=$_POST['Describe'];
    $add['user_status']=$_POST['Status'];
    $add['AgentLevel']=$_POST['LevelID'];
    $add['ContributeRatio']=$_POST['ContributeRatio'];
    if($add['AgentLevel']=='2'){
      $add['CompanyType']='1';
    }
    if($add['AgentLevel']=='3'){
      $add['CompanyType']='2';
    }
    if($add['AgentLevel']>='4'){
      $add['CompanyType']='2';
      if($add['money']>$parent['money']){
        $this->ejson('上级余额不足: ' . enjson(['add' => $add['money'], 'parent' => $parent['money']]));
      }
      else{
        M('agent')->where(array('id'=>$parent['id']))->setDec('money',$add['money']);
      }
    }
    $add['parent_user']=$parent['user_login'];
    $add['parent']=$parent['id'];
    $add['SuperCompanyID']=$parent['supercompanyid'];
    $add['SubCompanyID']=$parent['subcompanyid'];
    $add['update_time']=$this->time;
    $add['create_time']=$this->time;
    $add['path']=$parent['path'];
    $res=M('agent')->add($add);
    if($res){
      $this->addlog($this->agent['user_login'],$add['user_login'],'添加加' . \AgentLevel::getMap(2) . '，初始信用'.$add['money'].',占成'.$add['ratio']);
      $data['newAgentID']=$res;
      $save['path']=$parent['path'].'-'.$res.'-';
      M('agent')->where(array('id'=>$res))->save($save);
      $data['status']=true;
      $data['info']="添加下级成功";
      echo json_encode($data);
    }
    else{
      $this->ejson('添加失败');
    }
  }
  public function AddCompanySetting(){
    header('Content-type: application/json');
    $map['user_login']=$_POST['LoginName'];
    if(M('agent')->where($map)->find()){
      $this->ejson('账户已经存在');
    }
    $map2['id']=$this->aid;
    $parent=M('agent')->where($map2)->find();
    if(!$parent){
      $this->ejson('上级不存在');
    }
    $add['user_login']=$_POST['LoginName'];
    $add['nickname']=$_POST['NickName'];
    $add['user_pass']=md5($_POST['LoginPwd']);
    $add['user_pass2']=md5($_POST['AdvancePwd']);

    $add['money']=0;
    $add['pratio']=100;
    $add['ratio']=$_POST['Ratio'];

    $add['describe']=$_POST['Describe'];
    $add['user_status']=$_POST['CompanyStatus'];
    $add['AgentLevel']=2;
    $add['ContributeRatio']=0;
    if($add['AgentLevel']=='2'){
      $add['CompanyType']='1';
    }
    if($add['AgentLevel']=='3'){
      $add['CompanyType']='2';
    }
    if($add['AgentLevel']=='4'){
      $add['CompanyType']='2';
    }
    $add['parent_user']=$parent['user_login'];
    $add['parent']=$parent['id'];
    $add['SuperCompanyID']=$parent['supercompanyid'];
    $add['SubCompanyID']=$parent['subcompanyid'];

    $add['update_time']=$this->time;
    $add['create_time']=$this->time;
    $add['path']=$parent['path'];
    $res=M('agent')->add($add);
    if($res){
      $this->addlog($this->agent['user_login'],$add['user_login'],'添加加' . \AgentLevel::getMap(2) . '，占成'.$add['ratio']);
      $data['ID']=$res;
      $save['SuperCompanyID']=$res;
      $save['SubCompanyID']=$res;
      $save['path']=$parent['path'].'-'.$res.'-';
      M('agent')->where(array('id'=>$res))->save($save);
      $add2['uid']=$res;
      $add2['LoginName']=$add['user_login'];
      M('companysetting')->add($add2);
      $data['status']=true;
      $data['info']="添加下级成功";
      echo json_encode($data);
    }
    else{
      $this->ejson('添加失败');
    }
  }
  public function DeleteChildCompany(){
    header('Content-type: application/json');
    $map['user_login']=$_POST['LoginName'];
    M('agent')->where($map)->delete();
    $data['status']=true;
    $data['info']="删除成功";
    echo json_encode($data);
  }
  public function GetBasicInformationList(){
    header('Content-type: application/json');
    $data=array();
    $ChildCount=M('agent')->where(array('parent'=>$this->agent['id']))->count();
    $agent = $this->agent;
    if($agent['issubaccount']){
      $agent = M('agent')->find($agent['parent']);
    }
    $data['ChildCount']=$ChildCount+0;
    $data['CompanyID']=$agent['id'];
    $data['CompanyStatus']='0';
    $data['CompanyType']=fix_decimal($agent['companytype'], 4);
    $data['DefaultCredit']=$agent['money'];
    $data['Expend']=0;

    $data['FrozenCredit']=0;
    $data['LoginName']=$this->agent['user_login'];
    $data['NickName']=$this->agent['nickname'];
    $data['Ratio']=$agent['ratio'];
    $data['Salary']=0;
    $data['Welfare']=0;
    $dataxx[]=$data;
    echo json_encode($dataxx);
  }
  public function GetAgentLevelByID(){
    header('Content-type: application/json');
    $list=M('agent_level')->order('level asc')->select();
    $dataxx=array();
    foreach ($list as $key => $value) {
      $data=array();
      $data['ID']=$value['id'];
      $data['CompanyID']='1';
      $data['AgentLevel']=(int)$value['level'];
      $data['LevelName']=$value['title'];
      $data['IsEnable']=true;
      $dataxx[]=$data;
    }
    echo json_encode($dataxx);

  }
  public function GetGrossList(){
    static $user_map;
    if (is_null($user_map)) {
      $user_map = [];

      // $onexx = M('bets')->find(49334);
      // $fsxx = dejson(\ReportCalculator::generateFsxxForBet($onexx));
      // deb($fsxx);

    }
    header('Content-type: application/json');
    $time = time();
    if(!$_GET['PageNum']){
      $_GET['PageNum']=1;
    }
    $_SESSION['agent_token'] = $time;
    $username = isset($_GET['UserName']) && $_GET['UserName'] != 'undefined' ? $_GET['UserName'] : '';
    $user_tag = \AgentReporter::getUserTagByAgid($username, $this->agent);
    $page_tag = \AgentReporter::getPageTag($_GET['PageNum']);
    $periods_tag = \AgentReporter::getPeriodsTag(isset($_GET['PeriodsNumber']) ? $_GET['PeriodsNumber'] : 0);
    \AgentReporter::report($this->agent['id'], '总货明细' . $user_tag . $periods_tag . $page_tag);

    M('agent')->where(array('id'=>$this->agent['id']))->save(array('token'=>$time));
    if($_GET['ZCompanyID']){
      $agentid=$_GET['ZCompanyID'];
    }
    else{
      // deb($this->agent);
      if($this->agent['issubaccount']){
        $agentid = $this->agent['parent'];
        $this->agent['id'] = $this->agent['parent'];
      }else{
        $agentid = $this->agent['id'];
      }
    }
    $agent=M('agent')->find($this->agent['id']);
    if (!isset($agentid)) {
      $agentid = $agent['id'];
    }
    // deb($agent);
    $wherexx='1=1';
    if($_GET['IsWin']=='true'){
      $map['WinLoss']=array('gt',0);
      $wherexx.=' and WinLoss>0 ';
    }
    if($_GET['IsShow']=='true'){
      $map['playedid']=array('in','14,15,16');
      $wherexx.=' and playedId in(14,15,16) ';
    }
    if(!empty($_GET['BetTypeID'])){
      $map2['betTypeId']=$_GET['BetTypeID'];
      $played_id_list = get_played_id_list_by_bet_type_id($_GET['BetTypeID']);
      header('X-DEBUG-PLAYED-TYPE: ' . enjson($played_id_list));
      if (!empty($played_id_list)) {
        $played_ids = join(',', $played_id_list) ?: '0';
        $map['playedid'] = array('in', $played_ids);
        $wherexx .= ' and playedId in(' . $played_ids . ') ';
      } else {
        $play=M('played')->where($map2)->find();
        $map['playedId']=$play['id'];
        $wherexx.=' and playedId ='.$play['id'].' ';
      }
    }

    if($_GET['BetNumber']!=''){
      $map['BetNumber']=$_GET['BetNumber'];
      $wherexx.=' and BetNumber ="'.$_GET['BetNumber'].'" ';
    }

    if($_GET['IsPeriodsOrDay']=='true'){
      if($_GET['BetDate']){
        if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
          $map['BetDt']=array(array('gt',$_GET['BetDate']." 06:00:00"),array('lt',date('Y-m-d',strtotime($_GET['BetDate'])+3600*24)." 06:00:00"));
          $wherexx.=' and BetDt >"'.$_GET['BetDate'].' 06:00:00" and BetDt <"'.date('Y-m-d',strtotime($_GET['BetDate'])+3600*24).' 06:00:00"  ';
        }
        else{
          $map['BetDt']=array(array('gt',date('Y-m-d',strtotime($_GET['BetDate'])-3600*24)." 06:00:00"),array('lt',$_GET['BetDate']." 06:00:00"));
          $wherexx.=' and BetDt >"'.date('Y-m-d',strtotime($_GET['BetDate'])-3600*24).' 06:00:00" and BetDt <"'.$_GET['BetDate'].' 06:00:00"  ';
        }
      }
      else{
        if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
          $map['BetDt']=array(array('gt',date('Y-m-d',time())." 06:00:00"),array('lt',date('Y-m-d',time()+3600*24)." 06:00:00"));
          $wherexx.=' and BetDt >"'.date('Y-m-d',time()).' 06:00:00" and BetDt <"'.date('Y-m-d',time()+3600*24).' 06:00:00"  ';
        }
        else{
          $map['BetDt']=array(array('gt',date('Y-m-d',time()-3600*24)." 06:00:00"),array('lt',date('Y-m-d',time())." 06:00:00"));
          $wherexx.=' and BetDt >"'.date('Y-m-d',time()-3600*24).' 06:00:00" and BetDt <"'.date('Y-m-d',time()).' 06:00:00"  ';
        }
      }
    }
    else{
      if($_GET['PeriodsNumber']>0){
        $map['PeriodsNumber']=$_GET['PeriodsNumber'];
        $wherexx.=' and PeriodsNumber ="'.$_GET['PeriodsNumber'].'" ';
      }
      else{
        $now=getnow('1');
        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $map['PeriodsNumber']=$PeriodsNumber;
        $wherexx.=' and PeriodsNumber ="'.$_GET['PeriodsNumber'].'" ';
      }
    }


    if($_GET['QueryStatus']==0){
      if($_GET['BeginNum']>0){
        $map['BetAmount'][]=array('egt',$_GET['BeginNum']);
        $wherexx.=' and BetAmount >="'.$_GET['BeginNum'].'" ';
      }
      if($_GET['EndNum']>0){
        $map['BetAmount'][]=array('elt',$_GET['EndNum']);
        $wherexx.=' and BetAmount <="'.$_GET['EndNum'].'" ';
      }
    }
    if($_GET['QueryStatus']==1){
      if($_GET['BeginNum']>0){
        $map['Odds'][]=array('egt',$_GET['BeginNum']);
        $wherexx.=' and Odds >="'.$_GET['BeginNum'].'" ';
      }
      if($_GET['EndNum']>0){
        $map['BetAmount'][]=array('elt',$_GET['EndNum']);
        $wherexx.=' and Odds <="'.$_GET['EndNum'].'" ';
      }
    }
    //if($this->agent['companytype']==0){
    if($_GET['BetInfoID'] && $_GET['uid']){
      $uid=$_GET['uid'];
      $map['BetInfoID']=$_GET['BetInfoID'];
      $count=M('userbet'.$uid)->where($map)->count();
      $PageCount=ceil($count/20);
      $list=M('userbet'.$uid)->where($map)->limit((20*$_GET['PageNum']-20).',20')->order('BetInfoID DESC, BetNumber ASC')->select();
      $list2=array();
      $chazt=0;
    }
    else{
      if($_GET['UserName'] && $_GET['UserName']!='undefined'){
        $map2['user_login']=$_GET['UserName'];
        $user=M('user')->where($map2)->find();
        $uid=$user['id'];
        $map['uid']=$uid;
      }
      // dv: search all
      if (isset($_GET['IsExpand']) && $_GET['IsExpand'] == 1) {
        $page = isset($_GET['PageNum']) && $_GET['PageNum'] >= 1 ? $_GET['PageNum'] : 1;
        $pagesize = 30;
        list($list, $count) = get_gross_list_and_count_by_cond_and_uid($map, $agentid, $page, $pagesize);
        $PageCount = ceil($count / $pagesize);
        $list2=array();
        $chazt=0;
      } else {
        $map['agentpath']=array('like','%-'.$agentid.'-%');
        //$map['count']=array('gt','0');
        $count=M('bets')->where($map)->count();
        $pagesize = 20;
        $PageCount=ceil($count/$pagesize);
        $list=M('bets')->where($map)->limit(($pagesize*$_GET['PageNum']-$pagesize).',' . $pagesize)->order('id desc')->select();
        $list2=array();
        $chazt=1;
      }
    }

    $path = get_array_unique_id_list(explode('-', $agent['path']));
    // $path = explode('-',$agent['path']);
    // deb($path);

    // deb($this->agent['id']);
    foreach($list as $value){
      // print_r($value);

      $data=array();
      $map=array();
      $map['BetInfoID']=$value['betinfoid'];
      if($value['uid']){
        $uid=$value['uid'];
      }
      if (isset($user_map[$uid])) {
        $user = $user_map[$uid];
      } else {
        $user=M('user')->find($uid);
        $user_map[$uid] = $user;
      }
      $map['uid']=$uid;
      $bet=M('bets')->where($map)->find();
      $play=M('played')->find($value['playedid']);
      $data['LoginName']=$user['user_login'];
      $data['NickName']=$user['user_nicename'];

      $data['BetIdentifier']=$value['periodsnumber'].$value['betinfoid'];
      $data['BackBetIP']=$bet['backbetip'];
      $fsxx=json_decode($value['fsxx'],true);
      $comm=$value['backcomm'];
      $SelfComm=0;
      foreach($fsxx as $key2=>$one2){
        if(!in_array($key2,$path)){
          $comm=$comm+$one2;
        }
        if($key2==$agentid){
          $SelfComm=$one2;
        }
      }
      //$value['selfBackComm']
      $data['SelfBackComm'] = fix_decimal($SelfComm+$comm, 4);
      $data['BackComm'] = fix_decimal($comm, 4);
      $data['Commission'] = fix_decimal($SelfComm, 4);


      $data['BetAmount']=fix_decimal($value['betamount'], 4);
      $data['BetDetailID']=$value['id'];
      $data['BetDt']=$value['betdt'];
      $data['BetIP']=$bet['betip'];
      $data['uid']=$bet['uid'];
      $data['count']=$bet['count'];
      if(!$data['BetIP']){
        $data['BetIP']='0.0.0.0';
      }
      $data['betinfoid']=$value['betinfoid'];
      if( $chazt==1){
        $data['BetNumber']='-1';
      }
      else{
        $data['BetNumber']=$value['betnumber'];
      }


      $data['BetTypeID']=$play['bettypeid'];
      $data['BetStatus']=$value['sftm'];
      // if(!$_GET['BetInfoID'] && M('userbet'.$bet['uid'])->where(array('sftm'=>'1'))->find()){
      //  $data['BetStatus']=1;
      // }
      $data['BetWayID']=$bet['betwayid'];
      if($this->agent['agentlevel']<4 && $value['bz']){
        //$data['BetWayID']=$bet['betwayid'].'('.$bet['bz'].')';
        $data['BetWayID']=$bet['betwayid'];
      }
      $data['LotteryID']=1;
      $data['Odds']=sprintf( "%.1f",$value['odds']);


      $data['PeriodsID']=$bet['periodsid'];
      $data['PeriodsNumber']=$value['periodsnumber'];
      $data['UpdateDt']=$bet['updatedt'];
      $data['WinLoss']=fix_decimal(sprintf( "%.1f",$value['winloss']), 4);
      $data['IsHotNum']=fix_decimal($bet['ishotnum'], 4);

      $list2[]=$data;
    }
    $dataxx['PageCount']=$PageCount;
    $dataxx['list']=$list2;
    echo json_encode($dataxx);
  }
  public function GetBetInfoRatioDetail(){
    header('Content-type: application/json');
    if($_GET['ZCompanyID']){
      $agentid=$_GET['ZCompanyID'];
    }
    else{
      // deb($this->agent);
      if($this->agent['issubaccount']){
        $agentid = $this->agent['parent'];
        $this->agent['id'] = $this->agent['parent'];
      }else{
        $agentid = $this->agent['id'];
      }
    }
    if (!isset($agentid)) {
      $agentid = $this->agent['id'];
    }
    $agent=M('agent')->find($this->agent['id']);
    $realagent = $agent;
    if ($agentid != $agent['id']) {
      $realagent = M('agent')->find($agentid);
    }
    // deb($realagent);

    if(!$_GET['PageNum']){
      $_GET['PageNum']=1;
    }
    if($_GET['IsWin']=='true'){
      $map['WinLoss']=array('gt',0);
    }
    if($_GET['IsShow']=='true'){
      $map['playedid']=array('in','14,15,16');
    }
    if(!empty($_GET['BetTypeID'])){
      $map2['betTypeId']=$_GET['BetTypeID'];
      $played_id_list = get_played_id_list_by_bet_type_id($_GET['BetTypeID']);
      header('X-DEBUG-PLAYED-TYPE: ' . enjson($played_id_list));
      if (!empty($played_id_list)) {
        $played_ids = join(',', $played_id_list) ?: '0';
        $map['playedid'] = array('in', $played_ids);
        $wherexx .= ' and playedId in(' . $played_ids . ') ';
      } else {
        $play=M('played')->where($map2)->find();
        $map['playedId']=$play['id'];
        $wherexx.=' and playedId ='.$play['id'].' ';
      }
    }

    if($_GET['BetNumber']>0){
      $map['BetNumber']=$_GET['BetNumber'];
    }

    if($_GET['BetDate'] && $_GET['IsPeriodsOrDay']='false'){

      if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
        $map['BetDt']=array(array('gt',$_GET['BetDate']." 06:00:00"),array('lt',date('Y-m-d',strtotime($_GET['BetDate'])+3600*24)." 06:00:00"));
      }
      else{
        $map['BetDt']=array(array('gt',date('Y-m-d',strtotime($_GET['BetDate'])-3600*24)." 06:00:00"),array('lt',$_GET['BetDate']." 06:00:00"));
      }
    }

    if($_GET['PeriodsNumber']>0 && $_GET['IsPeriodsOrDay']='true'){
      $map['PeriodsNumber']=$_GET['PeriodsNumber'];
    }

    // if($_GET['UserName']){
    //   $map2['user_login']=$_GET['UserName'];
    //   $user=M('user')->where($map2)->find();
    //   $map['uid']=$user['id'];
    // }
    // $count=M('bets')->where($map)->count();
    // $PageCount=ceil($count/20);
    // $list=M('bets')->where($map)->limit((20*$_GET['PageNum']-20).',20')->select();
    // $list2=array();
    // 
    if($_GET['BetInfoID'] && $_GET['uid']){
      $uid=$_GET['uid'];
      $map['BetInfoID']=$_GET['BetInfoID'];
      $count=M('userbet'.$uid)->where($map)->count();
      $PageCount=ceil($count/20);
      $list=M('userbet'.$uid)->where($map)->limit((20*$_GET['PageNum']-20).',20')->select();
      $list2=array();
      $chazt=0;
    }
    else{
      if($_GET['UserName'] && $_GET['UserName']!='undefined'){
        $map2['user_login']=$_GET['UserName'];
        $user=M('user')->where($map2)->find();
        $uid=$user['id'];
        $map['uid']=$uid;
      }
      // dv: search all
      if (isset($_GET['IsExpand']) && $_GET['IsExpand'] == 1) {
        $page = isset($_GET['PageNum']) && $_GET['PageNum'] >= 1 ? $_GET['PageNum'] : 1;
        $pagesize = 30;
        list($list, $count) = get_gross_list_and_count_by_cond_and_uid($map, $agentid, $page, $pagesize);
        $PageCount = ceil($count / $pagesize);
        $list2=array();
        $chazt=0;
      } else {
        $map['agentpath']=array('like','%-'.$agentid.'-%');
        $count=M('bets')->where($map)->count();
        $PageCount=ceil($count/20);
        $list=M('bets')->where($map)->limit((20*$_GET['PageNum']-20).',20')->select();
        $list2=array();
        $chazt=1;
      }
    }

    $path=explode('-',$realagent['path']);

    foreach($list as $key=>$value){
      $data=array();

      $play=M('played')->find($value['playedid']);
      $map=array();
      $map['BetInfoID']=$value['betinfoid'];
      if($value['uid']){
        $uid=$value['uid'];
      }
      $map['uid']=$uid;
      $user=M('user')->find($uid);
      $bet=M('bets')->where($map)->find();
      $data['LoginName']=$user['user_login'];
      $data['NickName']=$user['user_nicename'];

      $data['BetIdentifier']=$value['periodsnumber'].$value['betinfoid'];
      $data['BackBetIP']=$value['backbetip'];

      // 取子一级的占比
      $real_occupy_rate = \ReportCalculator::getAgentRealOccupyRate($realagent, $user);
      $data['Ratio'] = $real_occupy_rate;
      $data['BetAmount']=fix_decimal($value['betamount'], 4);
      $data['PercentageAmt']=fix_decimal($data['Ratio'] * $data['BetAmount']);
      $data['user_agentpath'] = $user['agentpath'];
      $data['BetDetailID']=$value['id'];
      $data['BetDt']=$value['betdt'];
      $data['BetIP']=$bet['betip'];
      if(!$data['BetIP']){
        $data['BetIP']='0.0.0.0';
      }
      $data['betinfoid']=$value['betinfoid'];
      if( $chazt==1){
        $data['BetNumber']='-1';
      }
      else{
        $data['BetNumber']=$value['betnumber'];
      }


      $data['uid']=$bet['uid'];
      $data['count']=$bet['count'];
      $data['BetTypeID']=$play['bettypeid'];

      $data['BetStatus']=$value['sftm'];

      $data['BetWayID']=$bet['betwayid'];
      if($this->agent['agentlevel']<4 && $value['bz']){
        $data['BetWayID']=$bet['betwayid'].'('.$bet['bz'].')';
      }
      $data['LotteryID']=1;
      $data['Odds']=fix_decimal($value['odds'], 4);


      $data['PeriodsID']=$value['periodsid'];
      $data['PeriodsNumber']=$value['periodsnumber'];
      $data['UpdateDt']=$value['updatedt'];
      $data['WinLoss']=fix_decimal($value['winloss'], 4);
      $data['ProfitAndLoss'] = $bet['zt'] == 0 ? (0-$data['BetAmount']) : fix_decimal($value['profitandloss'], 4);
      $data['IsHotNum']=fix_decimal($value['ishotnum'], 4);

      // 回水
      $fsxx=json_decode($bet['fsxx'],true);
      $comm=$bet['backcomm'];
      $SelfComm=0;
      foreach($fsxx as $key2=>$one2){
        if(!in_array($key2,$path)){
          $comm=$comm+$one2;
        }
        if($key2==$pagent['id']){
          $SelfComm=$one2;
        }
      }
      // $fsxx=json_decode($value['fsxx'],true);
      // $lhxx=json_decode($bet['lhxx'],true);
      // $lh=0;
      // $Selflh=0;
      // foreach($lhxx as $key2=>$one2){
      //   if(!in_array($key2,$path)){
      //     $lh=$lh + $one2;
      //   }
      //   if($key2==$pagent['id']){
      //     $Selflh=$one2;
      //   }
      // }
      // $fsxx=json_decode($value['fsxx'],true);
      // $ok=0;
      // $comm=0;
      // $SelfComm=0;
      // foreach($fsxx as $one){
      //     if($ok==0){
      //       $comm=$comm+$one['money'];
      //     }
      //     if($one['id']==$this->agent['id'] && $one['sfagent']){
      //           $SelfComm=$one['money'];
      //           $ok=1;
      //     }
      // }
      // $lhxx=json_decode($value['lhxx'],true);
      // $ok=0;
      // $lh=0;
      // $Selflh=0;
      // foreach($lhxx as $one){
      //     if($ok==0){
      //       $lh=$lh+$one['money'];
      //     }
      //     if($one['id']==$this->agent['id'] && $one['sfagent']){
      //           $Selflh=$one['money'];
      //           $ok=1;
      //     }
      // }
      // print_r($user);exit;
      $data['SelfBackCommRate'] = \ReportCalculator::getAgentRealCommisionRate($realagent, $user, $bet);
      $data['SelfBackComm'] = fix_decimal($data['PercentageAmt'] * $data['SelfBackCommRate'], 6);

      $list2[]=$data;
    }
    $dataxx['PageCount']=$PageCount;
    $dataxx['list']=$list2;
    echo json_encode($dataxx);
  }

  public function ReportForRecentlyGameType(){
    header('Content-type: application/json');
    $where = ' PeriodsNumber=' . $_GET['PeriodsNumber'];
    // print_r($this->agent);
    // $_GET['CompanyID'] = isset($_GET['CompanyID']) ? $_GET['CompanyID'] : $this->agent['id'];
    if ($this->agent['issubaccount']) {
      $_GET['CompanyID'] = $this->agent['parent'];
    } else {
      $_GET['CompanyID'] = $this->agent['id'];
    }
    $pagent = M('agent')->find($_GET['CompanyID']);

    if($_GET['IsDirectMember']!='true' && $_GET['IsMember']!='true' && $pagent['agentlevel']<5){
      // 管理级查看
      $zvalue = $pagent;
      $where2 = $where . " AND sftm=0";
      $where2 .= " AND agentpath LIKE '%-{$zvalue['id']}-%'";
      // print_r($userlist);
      $data      = array();
      $BetCount  = array();
      $BetAmount = array();
      $BackComm  = array();
      $WinAmt    = array();
      $WinLoss   = array();
      $betnumber = array();
      
      // $where2 = $where . " AND agentpath LIKE '%-{$zvalue['id']}-%' AND sftm=0";
      header('X-DEBUG-WHERE-BETS-' . $zvalue['id'] . ': ' . $where2);
      $betlist = M('bets')->where($where2)->select();
      // print_r($betlist);
      if ($betlist) {
        foreach ($betlist as $key2 => $value2) {
          $BetAmount[$value2['playedid']] += $value2['betamount'];
          $WinAmt[$value2['playedid']] += $value2['winloss'];
          $WinLoss[$value2['playedid']] += $value2['profitandloss'];
          // 回水
          $fsxx = json_decode($value2['fsxx'], true);
          $comm = $value2['backcomm'];
          $SelfComm = 0;
          foreach ($fsxx as $fsxx_key2 => $fsxx_one) {
            if (!in_array($fsxx_key2, $path)) {
              $comm = $comm + $fsxx_one;
            }
            if ($fsxx_key2 == $pagent['id']) {
              $SelfComm = $fsxx_one;
            }
          }
          $BackComm[$value2['playedid']] += $comm + $SelfComm;
          if (1) {//!in_array($value2['betinfoid'],$betnumber[$value2['playedid']][$time])
            $betnumber[$value2['playedid']][]=$value2['betinfoid'];
            $BetCount[$value2['playedid']] += $value2['count'];
          }
        }
        // print_r($BetCount);

        foreach ($BetAmount as $key => $value) {
          $data2=array();
          $play=M('played')->find($key);
          $data2['BetTypeID']=(int)$play['bettypeid'];
          $data2['BetCount']=fix_decimal($BetCount[$key], 4);
          $data2['BetAmount']=fix_decimal($BetAmount[$key], 4);
          $data2['BackComm']=fix_decimal($BackComm[$key], 4);
          $data2['WinAmt']=fix_decimal($WinAmt[$key], 4);
          $data2['WinLoss']=fix_decimal($WinLoss[$key], 4);

          $data2['IsMember']=0;
          $data2['TotalStatus']=1;
          $data2['GuessLoss']=0.0;

          $LsSetting[]=$data2;
        }

        $data['IsMember']=0;
        $data['LevelStatus']=$zvalue['agent_level'];
        if($_GET['IsSelf']=='false' && $zvalue['id']==$_GET['CompanyID']){
          $data['ID']=0;
          $data['CompanyType']='';
          $data['LoginName']='';
          $data['NickName']='';

        }
        else{
          $data['ID']=$zvalue['id'];
          $data['CompanyType']=$zvalue['companytype'];
          $data['LoginName']=$zvalue['user_login'];
          $data['NickName']=$zvalue['nickname'];
        }

        $data['LsSetting']=$LsSetting;
        $dataxx[]=$data;
      }
    }
    else{
      $map['parent']=$_GET['CompanyID'];
      $list=M('user')->where($map)->select();
      foreach($list as $zkey => $zvalue){
        $data=array();
        $BetCount=array();
        $BetAmount=array();
        $BackComm=array();
        $WinAmt=array();
        $WinLoss=array();
        $betnumber=array();
        $where2=$where." and sftm=0 and uid =".$zvalue['id'];
        $betlist=M('bets')->where($where2)->select();
        if($betlist){
          foreach($betlist as $key2=>$value2){
            $fsxx=json_decode($value2['fsxx'],true);
            $ok=0;
            $comm=0;
            $SelfComm=0;
            foreach($fsxx as $one){
              if($one['id']==$_GET['CompanyID'] && $one['sfagent']){
                $SelfComm=$one['money'];
                $ok=1;
              }
              if($ok==0){
                $comm=$comm+$one['money'];
              }
            }

            $BetAmount[$value2['playedid']]+=$value2['betamount'];
            $WinAmt[$value2['playedid']]+=$value2['winloss'];
            $WinLoss[$value2['playedid']]+=$value2['profitandloss'];
            $BackComm[$value2['playedid']]+=$comm+$SelfComm;
            if(1){//!in_array($value2['betinfoid'],$betnumber[$value2['playedid']][$time])
              $betnumber[$value2['playedid']][]=$value2['betinfoid'];
              $BetCount[$value2['playedid']] += $value2['count'];
            }
          }

          foreach ($BetAmount as $key => $value) {
            $data2=array();
            $play=M('played')->find($key);
            $data2['BetTypeID']=(int)$play['bettypeid'];
            $data2['BetCount']=fix_decimal($BetCount[$key], 4);
            $data2['BetAmount']=fix_decimal($BetAmount[$key], 4);
            $data2['BackComm']=fix_decimal($BackComm[$key], 4);
            $data2['WinAmt']=fix_decimal($WinAmt[$key], 4);
            $data2['WinLoss']=fix_decimal($WinLoss[$key], 4);

            $data2['IsMember']=1;
            $data2['TotalStatus']=1;
            $data2['GuessLoss']=0.0;

            $LsSetting[]=$data2;
          }
          $data['IsMember']=1;
          $data['LevelStatus']='-2';
          $data['ID']=$zvalue['id'];
          $data['CompanyType']='-1';
          $data['LoginName']=$zvalue['user_login'];
          $data['NickName']=$zvalue['user_nicename'];


          $data['LsSetting']=$LsSetting;
          $dataxx[]=$data;
        }

      }
    }
    // deb($dataxx);
    $result = isset($dataxx[0]['LsSetting']) ? $dataxx[0]['LsSetting'] : [];
    echo json_encode($result);
  }
  public function ReportContribute(){
    header('Content-type: application/json');
    if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
      $start=$_GET['StartDate'].' 06:00:00';
      $end=date('Y-m-d',strtotime($_GET['EndDate'])+3600*24).' 06:00:00';
    }
    else{
      $start=date('Y-m-d',strtotime($_GET['StartDate'])-3600*24).' 06:00:00';
      $end=$_GET['EndDate'].' 06:00:00';
    }

    $where=" BetDt> '".$start."' and BetDt< '".$end."'";
    $mapxx['path']=array('like','%-'.$_GET['CompanyID'].'-%');
    $agentlist=M('agent')->field('id')->where($mapxx)->select();

    $agent=M('agent')->find($_GET['CompanyID']);
    $listxx=array();
    foreach($agentlist as $value){
      $listxx[]=$value['id'];
    }

    $map['parent']=array('in',implode(',',$listxx));
    $list=M('user')->where($map)->select();
    foreach($list as $value){
      $listxx2[]=$value['id'];
    }

    $where2=$where." and uid  in ('".implode("','",$listxx2)."')";

    $Amount=M('bets')->where($where2)->sum('betamount');
    $userlist=M('user')->where(array('parent'=>$_GET['CompanyID']))->select();
    foreach ($userlist as $key => $value) {
      $data2=array();
      $where2=$where." and uid =".$value['id'];
      $amount=M('bets')->where($where2)->sum('betamount');
      if($amount){
        $data2['ID']=(int)$value['id'];
        $data2['PeriodsTime']="";
        $data2['AgentLevel']=-2;
        $data2['PercentageAmt']=fix_decimal(0.0000, 4);
        $data2['PercentageTotal']=fix_decimal(0.0000, 4);
        $data2['WinLossTotal']=fix_decimal(0.0000, 4);
        $data2['WinLoss']=fix_decimal(0.0000, 4);
        $data2['PercentRatioWL']=fix_decimal(0.0000, 4);
        $data2['Percents']=fix_decimal(0.0000, 4);
        $data2['Contribute']=fix_decimal(100*$amount/$Amount, 4);
        $data2['LoginName']=$value['user_login'];
        $data2['NickName']=$value['user_nicename'];
        $data2['LevelStatus']=-2;
        $data2['CompanyType']=-1;
        $dataxx[]=$data2;
      }              
    }
    $agentlist=M('agent')->where(array('parent'=>$_GET['CompanyID']))->select();
    foreach ($agentlist as $key => $value) {
      $data2=array();
      $mapxx['path']=array('like','%-'.$value['id'].'-%');
      $agentlist=M('agent')->field('id')->where($mapxx)->select();
      $listxx=array();
      foreach($agentlist as $value2){
        $listxx[]=$value2['id'];
      }
      $listxx2=array();
      $map['parent']=array('in',implode(',',$listxx));
      $list=M('user')->where($map)->select();
      foreach($list as $value2){
        $listxx2[]=$value2['id'];
      }

      $where2=$where." and uid  in ('".implode("','",$listxx2)."')";
      $amount=M('bets')->where($where2)->sum('betamount');
      if($amount){
        $data2['ID']=(int)$value['id'];
        $data2['PeriodsTime']="";
        $data2['AgentLevel']=$value['agentlevel'];
        $data2['PercentageAmt']=fix_decimal(0.0000, 4);
        $data2['PercentageTotal']=fix_decimal(0.0000, 4);
        $data2['WinLossTotal']=fix_decimal(0.0000, 4);
        $data2['WinLoss']=fix_decimal(0.0000, 4);
        $data2['PercentRatioWL']=fix_decimal(0.0000, 4);
        $data2['Percents']=fix_decimal(0.0000, 4);
        $data2['Contribute']=fix_decimal(100*$amount/$Amount, 4);
        $data2['LoginName']=$value['user_login'];
        $data2['NickName']=$value['nickname'];
        $data2['LevelStatus']=$value['agentlevel'];
        $data2['CompanyType']=$value['companytype'];
        $dataxx[]=$data2;
      }              
    }
    echo json_encode($dataxx);
  }
  public function GetReportWeekContribute2(){
    header('Content-type: application/json');

    if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
      $start=$_GET['DateFrom'].' 06:00:00';
      $end=date('Y-m-d',strtotime($_GET['DateTo'])+3600*24).' 06:00:00';
    }
    else{
      $start=date('Y-m-d',strtotime($_GET['DateFrom'])-3600*24).' 06:00:00';
      $end=$_GET['DateTo'].' 06:00:00';
    }
    $where=" BetDt> '".$start."' and BetDt< '".$end."'";
    $mapxx['path']=array('like','%-'.$_GET['CompanyID'].'-%');
    $agentlist=M('agent')->field('id')->where($mapxx)->select();

    $agent=M('agent')->find($_GET['CompanyID']);
    $listxx=array();
    foreach($agentlist as $value){
      $listxx[]=$value['id'];
    }

    $map['parent']=array('in',implode(',',$listxx));
    $list=M('user')->where($map)->select();
    $listxx2=array();
    foreach($list as $value){
      $listxx2[]=$value['id'];
    }

    $where2=$where." and uid  in ('".implode("','",$listxx2)."')";

    $Amount=M('bets')->where($where2)->sum('betamount');

    $userlist=M('user')->where(array('parent'=>$_GET['CompanyID']))->select();
    foreach ($userlist as $key => $value) {
      $data2=array();
      $where2=$where." and uid =".$value['id'];
      $amount=M('bets')->where($where2)->sum('betamount');
      if($amount){
        $data2['ID']=(int)$value['id'];
        $data2['PeriodsTime']="";
        $data2['AgentLevel']=-2;
        $data2['PercentageAmt']=fix_decimal(0.0000, 4);
        $data2['PercentageTotal']=fix_decimal(0.0000, 4);
        $data2['WinLossTotal']=fix_decimal(0.0000, 4);
        $data2['WinLoss']=fix_decimal(0.0000, 4);
        $data2['PercentRatioWL']=fix_decimal(0.0000, 4);
        $data2['Percents']=fix_decimal(0.0000, 4);
        $data2['Contribute']=fix_decimal(100*$amount/$Amount, 4);
        $data2['LoginName']=$value['user_login'];
        $data2['NickName']=$value['user_nicename'];
        $data2['LevelStatus']=-2;
        $data2['CompanyType']=-1;
        $dataxx[]=$data2;
      }              
    }
    $agentlist=M('agent')->where(array('parent'=>$_GET['CompanyID']))->select();
    foreach ($agentlist as $key => $value) {
      $data2=array();


      $mapxx['path']=array('like','%-'.$value['id'].'-%');
      $agentlist=M('agent')->field('id')->where($mapxx)->select();
      $listxx=array();
      foreach($agentlist as $value2){
        $listxx[]=$value2['id'];
      }
      $listxx2=array();
      $map['parent']=array('in',implode(',',$listxx));
      $list=M('user')->where($map)->select();
      foreach($list as $value2){
        $listxx2[]=$value2['id'];
      }

      $where2=$where." and uid  in ('".implode("','",$listxx2)."')";
      $amount=M('bets')->where($where2)->sum('betamount');
      if($amount){
        $data2['ID']=(int)$value['id'];
        $data2['PeriodsTime']="";
        $data2['AgentLevel']=$value['agentlevel'];
        $data2['PercentageAmt']=fix_decimal(0.0000, 4);
        $data2['PercentageTotal']=fix_decimal(0.0000, 4);
        $data2['WinLossTotal']=fix_decimal(0.0000, 4);
        $data2['WinLoss']=fix_decimal(0.0000, 4);
        $data2['PercentRatioWL']=fix_decimal(0.0000, 4);
        $data2['Percents']=fix_decimal(0.0000, 4);
        $data2['Contribute']=fix_decimal(100*$amount/$Amount, 4);
        $data2['LoginName']=$value['user_login'];
        $data2['NickName']=$value['nickname'];
        $data2['LevelStatus']=$value['agentlevel'];
        $data2['CompanyType']=$value['companytype'];
        $dataxx[]=$data2;
      }              
    }
    echo json_encode($dataxx);

  }
  public function ReportForGameTypeMonth(){
    header('Content-type: application/json');
    // 子账号
    if ($this->agent['issubaccount']) {
      $_GET['CompanyID'] = $this->agent['parent'];
    } else {
      $_GET['CompanyID'] = $this->agent['id'];
    }
    $pagent = M('agent')->find($_GET['CompanyID']);
    
    if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
      $start=$_GET['Date'].' 06:00:00';
      $end=date('Y-m-d',strtotime($_GET['DateTo'])+3600*24).' 06:00:00';
    }
    else{
      $start=date('Y-m-d',strtotime($_GET['Date'])-3600*24).' 06:00:00';
      $end=$_GET['DateTo'].' 06:00:00';
    }
    $where=" BetDt> '".$start."' and BetDt< '".$end."'";

    $zvalue = $pagent;
    $where2 = $where . " AND sftm=0";
    $where2 .= " AND agentpath LIKE '%-{$zvalue['id']}-%'";  
    header('X-DEBUG-WHERE-BETS-' . $zvalue['id'] . ': ' . $where2);
    $betlist=M('bets')->where($where2)->select();
    $dataxx=array();
    $BetCount=array();
    $BetAmount=array();
    $BackComm=array();
    $WinAmt=array();
    $WinLoss=array();
    $betnumber=array();
    foreach($betlist as $key2=>$value2){
      // 如果是凌晨投的，算在前一天里
      $bettime = strtotime($value2['betdt']);
      if ((int)date('H', $bettime) < 6) {
        $bettime = $bettime - 86400;
      }
      $time=date('Y-m-d', $bettime);
      // 统计之
      $BetAmount[$value2['playedid']][$time]+=$value2['betamount'];
      $WinAmt[$value2['playedid']][$time]+=$value2['winloss'];
      $WinLoss[$value2['playedid']][$time]+=$value2['profitandloss'];
      // 回水
      $fsxx = json_decode($value2['fsxx'], true);
      $comm = $value2['backcomm'];
      $SelfComm = 0;
      foreach ($fsxx as $fsxx_key2 => $fsxx_one) {
        if (!in_array($fsxx_key2, $path)) {
          $comm = $comm + $fsxx_one;
        }
        if ($fsxx_key2 == $pagent['id']) {
          $SelfComm = $fsxx_one;
        }
      }
      $BackComm[$value2['playedid']][$time] += $comm + $SelfComm;
      if(1){//!in_array($value2['betinfoid'],$betnumber[$value2['playedid']][$time])
        $betnumber[$value2['playedid']][$time][]=$value2['betinfoid'];
        $BetCount[$value2['playedid']][$time] += $value2['count'];
      }
    }

    foreach ($BetAmount as $key2 => $value2) {
      foreach ($value2 as $key => $value) {
        $data2=array();
        $play=M('played')->find($key2);
        $data2['BetTypeID']=(int)$play['bettypeid'];
        $data2['PeriodsTime']=$key;
        $data2['BetCount']=fix_decimal($BetCount[$key2][$key], 4);
        $data2['BetAmount']=fix_decimal($BetAmount[$key2][$key], 4);
        $data2['BackComm']=fix_decimal($BackComm[$key2][$key], 4);
        $data2['WinAmt']=fix_decimal($WinAmt[$key2][$key], 4);
        $data2['WinLoss']=fix_decimal($WinLoss[$key2][$key], 4);
        $data2['TotalStatus']=1;
        $dataxx[]=$data2;
      }
    }
    echo json_encode($dataxx);
  }


  public function ReportForGameType(){
    header('Content-type: application/json');
    if ($this->agent['issubaccount']) {
      $_GET['CompanyID'] = $this->agent['parent'];
    } else {
      $_GET['CompanyID'] = $this->agent['id'];
    }
    $pagent = M('agent')->find($_GET['CompanyID']);

    if($_GET['isMonthClick']=='true'){
      if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
        $where=" BetDt> '".$_GET['ClassTime']." 06:00:00' and BetDt< '".date('Y-m-d',strtotime($_GET['ClassTime'])+3600*24)." 06:00:00' ";
      } else {
        $where=" BetDt> '".date('Y-m-d',strtotime($_GET['ClassTime'])-3600*24)." 06:00:00' and BetDt< '".$_GET['ClassTime']." 06:00:00' ";
      }
    } else {
      if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
        $where=" BetDt> '".date('Y-m-d',time())." 06:00:00' and BetDt< '".date('Y-m-d',time()+3600*24)." 06:00:00' ";
      } else {
        $where=" BetDt> '".date('Y-m-d',time()-3600*24)." 06:00:00' and BetDt< '".date('Y-m-d',time())." 06:00:00' ";
      }
    }

    if($_GET['IsDirectMember']!='true' && $_GET['IsMember']!='true' && $pagent['agentlevel']<5){
      // 管理级查看
      $zvalue = $pagent;
      $where2 = $where . " AND sftm=0";
      $where2 .= " AND agentpath LIKE '%-{$zvalue['id']}-%'";
      // print_r($userlist);
      $data      = array();
      $BetCount  = array();
      $BetAmount = array();
      $BackComm  = array();
      $WinAmt    = array();
      $WinLoss   = array();
      $betnumber = array();
      
      // $where2 = $where . " AND agentpath LIKE '%-{$zvalue['id']}-%' AND sftm=0";
      header('X-DEBUG-WHERE-BETS-' . $zvalue['id'] . ': ' . $where2);
      $betlist = M('bets')->where($where2)->select();
      // print_r($betlist);
      if ($betlist) {
        foreach ($betlist as $key2 => $value2) {
          $BetAmount[$value2['playedid']] += $value2['betamount'];
          $WinAmt[$value2['playedid']] += $value2['winloss'];
          $WinLoss[$value2['playedid']] += $value2['profitandloss'];
          // 回水
          $fsxx = json_decode($value2['fsxx'], true);
          $comm = $value2['backcomm'];
          $SelfComm = 0;
          foreach ($fsxx as $fsxx_key2 => $fsxx_one) {
            if (!in_array($fsxx_key2, $path)) {
              $comm = $comm + $fsxx_one;
            }
            if ($fsxx_key2 == $pagent['id']) {
              $SelfComm = $fsxx_one;
            }
          }
          $BackComm[$value2['playedid']] += $comm + $SelfComm;
          if (1) {//!in_array($value2['betinfoid'],$betnumber[$value2['playedid']][$time])
            $betnumber[$value2['playedid']][]=$value2['betinfoid'];
            $BetCount[$value2['playedid']] += $value2['count'];
          }
        }
        // print_r($BetCount);

        foreach ($BetAmount as $key => $value) {
          $data2=array();
          $play=M('played')->find($key);
          $data2['BetTypeID']=(int)$play['bettypeid'];
          $data2['BetCount']=fix_decimal($BetCount[$key], 4);
          $data2['BetAmount']=fix_decimal($BetAmount[$key], 4);
          $data2['BackComm']=fix_decimal($BackComm[$key], 4);
          $data2['WinAmt']=fix_decimal($WinAmt[$key], 4);
          $data2['WinLoss']=fix_decimal($WinLoss[$key], 4);

          $data2['IsMember']=0;
          $data2['TotalStatus']=1;
          $data2['GuessLoss']=0.0;

          $LsSetting[]=$data2;
        }

        $data['IsMember']=0;
        $data['LevelStatus']=$zvalue['agent_level'];
        if($_GET['IsSelf']=='false' && $zvalue['id']==$_GET['CompanyID']){
          $data['ID']=0;
          $data['CompanyType']='';
          $data['LoginName']='';
          $data['NickName']='';

        }
        else{
          $data['ID']=$zvalue['id'];
          $data['CompanyType']=$zvalue['companytype'];
          $data['LoginName']=$zvalue['user_login'];
          $data['NickName']=$zvalue['nickname'];
        }

        $data['LsSetting']=$LsSetting;
        $dataxx[]=$data;
      }
    }
    else{
      $map['parent']=$_GET['CompanyID'];
      $list=M('user')->where($map)->select();
      foreach($list as $zkey => $zvalue){
        $data=array();
        $BetCount=array();
        $BetAmount=array();
        $BackComm=array();
        $WinAmt=array();
        $WinLoss=array();
        $betnumber=array();
        $where2=$where." and sftm=0 and uid =".$zvalue['id'];
        $betlist=M('bets')->where($where2)->select();
        if($betlist){
          foreach($betlist as $key2=>$value2){
            $fsxx=json_decode($value2['fsxx'],true);
            $ok=0;
            $comm=0;
            $SelfComm=0;
            foreach($fsxx as $one){
              if($one['id']==$_GET['CompanyID'] && $one['sfagent']){
                $SelfComm=$one['money'];
                $ok=1;
              }
              if($ok==0){
                $comm=$comm+$one['money'];
              }
            }

            $BetAmount[$value2['playedid']]+=$value2['betamount'];
            $WinAmt[$value2['playedid']]+=$value2['winloss'];
            $WinLoss[$value2['playedid']]+=$value2['profitandloss'];
            $BackComm[$value2['playedid']]+=$comm+$SelfComm;
            if(1){//!in_array($value2['betinfoid'],$betnumber[$value2['playedid']][$time])
              $betnumber[$value2['playedid']][]=$value2['betinfoid'];
              $BetCount[$value2['playedid']] += $value2['count'];
            }
          }

          foreach ($BetAmount as $key => $value) {
            $data2=array();
            $play=M('played')->find($key);
            $data2['BetTypeID']=(int)$play['bettypeid'];
            $data2['BetCount']=fix_decimal($BetCount[$key], 4);
            $data2['BetAmount']=fix_decimal($BetAmount[$key], 4);
            $data2['BackComm']=fix_decimal($BackComm[$key], 4);
            $data2['WinAmt']=fix_decimal($WinAmt[$key], 4);
            $data2['WinLoss']=fix_decimal($WinLoss[$key], 4);

            $data2['IsMember']=1;
            $data2['TotalStatus']=1;
            $data2['GuessLoss']=0.0;

            $LsSetting[]=$data2;
          }
          $data['IsMember']=1;
          $data['LevelStatus']='-2';
          $data['ID']=$zvalue['id'];
          $data['CompanyType']='-1';
          $data['LoginName']=$zvalue['user_login'];
          $data['NickName']=$zvalue['user_nicename'];


          $data['LsSetting']=$LsSetting;
          $dataxx[]=$data;
        }

      }
    }
    // deb($dataxx);
    // $result = isset($dataxx[0]['LsSetting']) ? $dataxx[0]['LsSetting'] : [];
    echo json_encode($dataxx);
  }

  public function ReportForGameTypeOld(){
    header('Content-type: application/json');
    if($this->agent['issubaccount']){
      $_GET['CompanyID'] = $this->agent['parent'];
    }else{
      $_GET['CompanyID'] = $this->agent['id'];
    }
    $pagent=M('agent')->find($_GET['CompanyID']);

    if($_GET['isMonthClick']=='true'){
      if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
        $where=" BetDt> '".$_GET['ClassTime']." 06:00:00' and BetDt< '".date('Y-m-d',strtotime($_GET['ClassTime'])+3600*24)." 06:00:00' ";
      } else {
        $where=" BetDt> '".date('Y-m-d',strtotime($_GET['ClassTime'])-3600*24)." 06:00:00' and BetDt< '".$_GET['ClassTime']." 06:00:00' ";
      }
    } else {
      if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
        $where=" BetDt> '".date('Y-m-d',time())." 06:00:00' and BetDt< '".date('Y-m-d',time()+3600*24)." 06:00:00' ";
      } else {
        $where=" BetDt> '".date('Y-m-d',time()-3600*24)." 06:00:00' and BetDt< '".date('Y-m-d',time())." 06:00:00' ";
      }
    }
    if($_GET['IsDirectMember']=='false' && $_GET['IsMember']=='false' && $pagent['agentlevel']<5){
      if($_GET['IsSelf']=='true'){
        $pagent=M('agent')->find($_GET['CompanyID']);
        $plist[]=$pagent;
      }
      else{
        $zmap['parent']=$_GET['CompanyID'];
        $plist=M('agent')->where($zmap)->select();
        $plist[]=$pagent;
      }
      // deb($plist);

      $dataxx=array();
      foreach($plist as $zkey => $zvalue){
        $data=array();
        $BetCount=array();
        $BetAmount=array();
        $BackComm=array();
        $WinAmt=array();
        $WinLoss=array();
        $betnumber=array();

        $where2 = $where . " AND sftm=0";
        $where2 .= " AND agentpath LIKE '%-{$zvalue['id']}-%'";
        header('X-DEBUG-WHERE-BETS-' . $zvalue['id'] . ': ' . $where2);
        $betlist=M('bets')->where($where2)->group('uid')->select();
        foreach($betlist as $key2=>$value2){
          $BetAmount[$value2['playedid']] += $value2['betamount'];
          $WinAmt[$value2['playedid']] += $value2['winloss'];
          $WinLoss[$value2['playedid']] += $value2['profitandloss'];
          // 回水
          $fsxx = json_decode($value2['fsxx'], true);
          $comm = $value2['backcomm'];
          $SelfComm = 0;
          foreach ($fsxx as $fsxx_key2 => $fsxx_one) {
            if (!in_array($fsxx_key2, $path)) {
              $comm = $comm + $fsxx_one;
            }
            if ($fsxx_key2 == $pagent['id']) {
              $SelfComm = $fsxx_one;
            }
          }
          $BackComm[$value2['playedid']]+=$comm+$SelfComm;
          if(1){//!in_array($value2['betinfoid'],$betnumber[$value2['playedid']][$time])
            $betnumber[$value2['playedid']][]=$value2['betinfoid'];
            $BetCount[$value2['playedid']] += $value2['count'];
          }

          foreach ($BetAmount as $key => $value) {
            $data2=array();
            $play=M('played')->find($key);
            $data2['BetTypeID']=(int)$play['bettypeid'];
            $data2['BetCount']=fix_decimal($BetCount[$key], 4);
            $data2['BetAmount']=fix_decimal($BetAmount[$key], 4);
            $data2['BackComm']=fix_decimal($BackComm[$key], 4);
            $data2['WinAmt']=fix_decimal($WinAmt[$key], 4);
            $data2['WinLoss']=fix_decimal($WinLoss[$key], 4);

            $data2['IsMember']=0;
            $data2['TotalStatus']=1;
            $data2['GuessLoss']=0.0;

            $LsSetting[]=$data2;
          }
          $data['IsMember']=0;
          $data['LevelStatus']=$zvalue['agent_level'];
          if($_GET['IsSelf']=='false' && $zvalue['id']==$_GET['CompanyID']){
            $data['ID']=0;
            $data['CompanyType']='';
            $data['LoginName']='';
            $data['NickName']='';

          }
          else{
            $data['ID']=$zvalue['id'];
            $data['CompanyType']=$zvalue['companytype'];
            $data['LoginName']=$zvalue['user_login'];
            $data['NickName']=$zvalue['nickname'];
          }

          $data['LsSetting']=$LsSetting;
          $dataxx[]=$data;
        }
      }
    }
    else{
      $map['parent']=$_GET['CompanyID'];
      $list=M('user')->where($map)->select();
      foreach($list as $zkey => $zvalue){
        $data=array();
        $BetCount=array();
        $BetAmount=array();
        $BackComm=array();
        $WinAmt=array();
        $WinLoss=array();
        $betnumber=array();
        $where2=$where."and uid =".$zvalue['id'];
        $betlist=M('bets')->where($where2)->group('uid')->select();
        if($betlist){


          foreach($betlist as $key2=>$value2){



            $fsxx=json_decode($value2['fsxx'],true);
            $ok=0;
            $comm=0;
            $SelfComm=0;
            foreach($fsxx as $one){
              if($one['id']==$_GET['CompanyID'] && $one['sfagent']){
                $SelfComm=$one['money'];
                $ok=1;
              }
              if($ok==0){
                $comm=$comm+$one['money'];
              }
            }
            $listxx=M('userbet'.$value2['uid'])->where($where.' and sftm=0')->group('playedId')->select();
            foreach($listxx as $keyxx=>$onexx){
              $BetAmount[$onexx['playedid']]+=M('userbet'.$value2['uid'])->where($where.' and playedId='.$onexx['playedid'].' and sftm=0')->sum('BetAmount');
              $WinAmt[$onexx['playedid']]+=M('userbet'.$value2['uid'])->where($where.' and  playedId='.$onexx['playedid'].' and sftm=0')->sum('winloss');
              $WinLoss[$onexx['playedid']]+=M('userbet'.$value2['uid'])->where($where.' and playedId='.$onexx['playedid'].' and sftm=0')->sum('profitandloss');
            }
            $BackComm[$value2['playedid']]+=$comm+$SelfComm;
            if(1){//!in_array($value2['betinfoid'],$betnumber[$value2['playedid']][$time])
              $betnumber[$value2['playedid']][]=$value2['betinfoid'];
              $BetCount[$value2['playedid']] += $value2['count'];
            }
          }

          foreach ($BetAmount as $key => $value) {
            $data2=array();
            $play=M('played')->find($key);
            $data2['BetTypeID']=(int)$play['bettypeid'];
            $data2['BetCount']=fix_decimal($BetCount[$key], 4);
            $data2['BetAmount']=fix_decimal($BetAmount[$key], 4);
            $data2['BackComm']=fix_decimal($BackComm[$key], 4);
            $data2['WinAmt']=fix_decimal($WinAmt[$key], 4);
            $data2['WinLoss']=fix_decimal($WinLoss[$key], 4);

            $data2['IsMember']=1;
            $data2['TotalStatus']=1;
            $data2['GuessLoss']=0.0;

            $LsSetting[]=$data2;
          }
          $data['IsMember']=1;
          $data['LevelStatus']='-2';
          $data['ID']=$zvalue['id'];
          $data['CompanyType']='-1';
          $data['LoginName']=$zvalue['user_login'];
          $data['NickName']=$zvalue['user_nicename'];


          $data['LsSetting']=$LsSetting;
          $dataxx[]=$data;
        }

      }
    }
    echo json_encode($dataxx);
  }

  public function GetBetDateList(){
    header('Content-type: application/json');
    $week=array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
    $list=array();
    for($i=7;$i>-1;$i--){
      $data=array();
      $data['Time']=date('Y-m-d',time()-$i*3600*24);
      $data['Datetimes']=date('Ymd',time()-$i*3600*24);
      $data['DateHeader']=date('m/d(l)',time()-$i*3600*24);
      $list['list'][]=$data;
    }
    echo json_encode($list);
  }
  public function GetPeriodsByDay(){

    header('Content-type: application/json');
    $type=M('type')->find('1');
    //$_GET['isGross']=='true' || 
    if(strtotime($_GET['GetDateTime'].' 06:00:00')<time()){
      $now=getnow('1');
      $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];
      for($i=(int)$now['hm'];$i>9;$i--){
        $m=$i;
        if($m<100){
          $m='0'.$m;
        }
        if($m<10){
          $m='0'.$m;
        }
        $list[]=array(
            'ID'=>date('ymd',time()+$now['day']*3600*24).$m,
            'PeriodsNumber'=>date('ymd',time()+$now['day']*3600*24).$m,
            'PeriodsStatus'=>5,
            );
      }
    }
    else{
      $now=getnow('1');
      for($i=59+(int)$now['hm'];$i>9;$i--){
        if($i>59){
          $m=$i-59;
        }
        else{
          $m=$i;
          $now['day']='-1';
        }
        if($m<100){
          $m='0'.$m;
        }
        if($m<10){
          $m='0'.$m;
        }
        $list[]=array(
            'ID'=>date('ymd',strtotime($_GET['GetDateTime'].' 00:00:00')+$now['day']*3600*24).$m,
            'PeriodsNumber'=>date('ymd',strtotime($_GET['GetDateTime'].' 00:00:00')+$now['day']*3600*24).$m,
            'PeriodsStatus'=>5,
            );
      }

    }

    $data['info']="获取成功";
    $data['status']=true;
    $data['list']=$list;
    echo json_encode($data);
  }

  public function ReportForDailyPeriods(){
    header('Content-type: application/json');
    @set_time_limit(0);
    @ini_set('memory_limit', '512M');
    \AgentReporter::report($this->agent['id'], '日报表(期数)' . (isset($_GET['PeriodsNumber']) ? (' - ' . $_GET['PeriodsNumber']) : ''));
    if($this->agent['issubaccount']){
      if($_GET['CompanyID'] == $this->agent['id']){
        $_GET['CompanyID'] = $this->agent['parent'];
      }
    }
    $now=getnow('1');
    // $mapxx['path']=array('like','%-'.$_GET['CompanyID'].'-%');
    // $agentlist=M('agent')->field('id')->where($mapxx)->select();
    // $agent=M('agent')->find($_GET['CompanyID']);
    // $listxx=array();
    // foreach($agentlist as $value){
    //   $listxx[]=$value['id'];
    // }
    // $map['parent']=array('in',implode(',',$listxx));
    $agent=M('agent')->find($_GET['CompanyID']);

    // $path=explode('-',$agent['path']);
    $path = get_array_unique_id_list(explode('-', $agent['path']));

    $dataxx=array();

    // deb($now);
    // 生成一系列要看的期数
    $see_yesterday = false;
    if ((int)date('H') >= 0 && (int)date('H') <= 6) {
      $begin_day = date('Y-m-d', time() - 86400);
      $see_yesterday = true;
    } else {
      $begin_day = date('Y-m-d', time());
    }
    $begin_time = strtotime($begin_day . ' 06:00:00');
    $periods_number_list = [];
    $daytime_periods_number_list = [];
    for ($i = 59; $i >= 10; $i--) {
      $data = array();
      if($i<100){
        $i='0'.$i;
      }
      if($i<10){
        $i='0'.$i;
      }
      $daytime_periods_number_list[] = date('ymd',$begin_time).$i;
    }
    if ($see_yesterday) {
      for($i=(int)$now['hm'];$i>0;$i--){
        $data=array();
        if($i<100){
          $i='0'.$i;
        }
        if($i<10){
          $i='0'.$i;
        }
        $periods_number_list[] = date('ymd',time()+$now['day']*3600*24).$i;
      }
      $time_index = strtotime($begin_day . ' 23:59:59');
      $periods_number_list = array_merge($daytime_periods_number_list, $periods_number_list);
      rsort($periods_number_list);
    } else {
      $periods_number_list = $daytime_periods_number_list;
    }
    // deb($periods_number_list);
    // header("X-DEBUG-PEROIDS-DATA: " . json_encode(compact('periods_number_list', 'begin_day', 'see_yesterday')));
    // deb($map_play_type);
    // 以生成的期数，查询数据库
    foreach ($periods_number_list as $PeriodsNumber) {
      // 这个where后面也在用
      $where = ['PeriodsNumber' => $PeriodsNumber,];
      $data=array();
      // 会员投注统计（投注总金额、输赢总计、投注总数量、回水总额）
      $mapxx=$where;
      $mapxx['agentpath']=array('like','%-'.$_GET['CompanyID'].'-%');
      $mem=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where($mapxx)->select();
      header("X-DEBUG-MEM-SUMMARY-{$PeriodsNumber}: " . json_encode($mem));

      // deb($mem);
      // 取所有符合条件的投注数据，返水信息、拦货信息、zt
      $current_agent_id = $agent['id'];
      $list=M('bets')->where($mapxx)->select();
      $fsmoney = $fsmoney_wl = 0;
      $lhmoney = $lhmoney_wl = 0;
      $lhmoney2 = 0;
      $selffsmoney = $selffsmoney_wl = 0;
      $selflhmoney = $selflhmoney_wl = 0;
      $selflhmoney2 = $selflhmoney2_wl = 0;
      $占成金额_up=0;
      $占成金额_down=0;
      foreach($list as $keyxx=>$onexx){
        // print_r($onexx);
        // 算一份出来
        $no_result = false;
        if (empty($onexx['fsxx']) && empty($onexx['lhxx'])) {
          $no_result = true;
          $onexx['fsxx'] = \ReportCalculator::generateFsxxForBet($onexx);
          $onexx['lhxx'] = \ReportCalculator::generateLhxxForBet($onexx);
          // print_r(dejson($onexx['lhxx']));
        }
        // 开奖使用原算法
        $fsxx=json_decode($onexx['fsxx'],true);
        $lhxx=json_decode($onexx['lhxx'],true);
        foreach($fsxx as $key1=>$one1){
          if(!in_array($key1,$path)){
            $fsmoney += $one1;
            if (!$no_result) {
              $fsmoney_wl += $one1;
            }
          }
          if($key1 == $current_agent_id){
            $selffsmoney += $one1;
            if (!$no_result) {
              $selffsmoney_wl += $one1;
            }
          }
        }
        // print_r($lhxx);
        $flag = true;
        foreach($lhxx as $key2=>$one2){
          if(!in_array($key2,$path)){
            $lhmoney += $one2['win'];
            $lhmoney2 += $one2['money'];
            if (!$no_result) {
              $lhmoney_wl += $one2['win'];
            }
          }
          if($key2 == $current_agent_id){
            $selflhmoney += $one2['win'];
            $selflhmoney2 += $one2['money'];
            if (!$no_result) {
              $selflhmoney_wl += $one2['win'];
              $selflhmoney2_wl += $one2['money'];
            }
          }
          if ($flag == true) {
            $占成金额_up += $one2['money'];
            if ($key2 == $_GET['CompanyID']) {
              $flag = false;
              continue;
            }
            $占成金额_down += $one2['money'];
          }
        }
      }

      if($mem['0']['memberbetcount']){
        $mapxx['parent']=$_GET['CompanyID'];
        $mem2=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm, zt")->where($mapxx)->select();

        $data['PeriodsNumber']=$PeriodsNumber;
        $data['MemBetAmt']=fix_decimal($mem['0']['membetamt'], 4);
        if($onexx['zt']==1){
          $data['MemWL']=fix_decimal(($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']), 4);
        }else{
          $data['MemWL']=0; 
        }

        $data['MemberBetCount']=fix_decimal($mem['0']['memberbetcount'], 4);

        $data['DirectMemBetAmt']=fix_decimal($mem2['0']['membetamt'], 4);
        $data['DirectMemWL']=fix_decimal($mem2['0']['membetamt'], 4);
        $data['DirectMemBetCount']=fix_decimal($mem2['0']['memberbetcount'], 4);

        $mapxx=$where;
        $mapxx['path2']=array('like','%-'.$_GET['CompanyID'].'-%');
        $mapxx['agent']=array('neq',$_GET['CompanyID']);


        $mapxx=$where;
        $mapxx['agent']=$_GET['CompanyID'];

        $data['占成金额_up'] = fix_decimal($占成金额_up, 4);
        $data['占成金额_down'] = fix_decimal($占成金额_down, 4);
        
        $data['DownLineBetAmt'] = fix_decimal($data['MemBetAmt'] - $占成金额_down, 4);
        if($onexx['zt']==1){
          $data['DownLineWL'] = fix_decimal(($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']+$fsmoney_wl+$lhmoney_wl)+0, 4);
        }else{
          $data['DownLineWL']=0; 
        }
        $data['SelfBetAmt'] = fix_decimal($selflhmoney2, 4);
        $data['SelfComm'] = fix_decimal($selffsmoney, 4);
        $data['SelfWL'] = fix_decimal((0+$selflhmoney_wl), 4);
        $data['SelfWLTotal'] = fix_decimal((0+$selflhmoney_wl+$selffsmoney_wl), 4);

        $data['UperBetAmt'] = fix_decimal(($data['MemBetAmt'] - $占成金额_up), 4);
        if($onexx['zt']==1){
          //echo "(0-({$mem['0']['memwl']}+{$mem['0']['backcomm']}-{$mem['0']['membetamt']}+{$fsmoney}+{$lhmoney})-{$data['SelfWLTotal']})";exit;
          $data['UperWL'] = fix_decimal((0-($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']+$fsmoney_wl+$lhmoney_wl)-$data['SelfWLTotal']), 4);
        }else{
          $data['UperWL']=0; 
        }

        $dataxx[]=$data;
      }
    }
    echo json_encode($dataxx);
  }
  function ReportForMonth(){
    header('Content-type: application/json');
    @set_time_limit(0);
    @ini_set('memory_limit', '512M');
    \AgentReporter::report($this->agent['id'], '月(结)报表');
    if($this->agent['issubaccount']){
      if($_GET['CompanyID'] == $this->agent['id']){
        $_GET['CompanyID'] = $this->agent['parent'];
      }
    }
    $now=getnow('1');
    $dataxx=array();

    $start=strtotime(date('Y-m-d',strtotime($_GET['Date'])).' 06:00:00');
    $end=strtotime(date('Y-m-d',strtotime($_GET['DateTo'])+24*3600).' 06:00:00');
    $agent=M('agent')->find($_GET['CompanyID']);

    // $path=explode('-',$agent['path']);
    $path = get_array_unique_id_list(explode('-', $agent['path']));
    for($i=$start;$i<$end;$i){
      if ($i > time() + 86400 * 2) {
        $i=$i+24*3600;
        continue;
      }
      $data=array();
      if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
        $where['BetDt']=array(array('egt',date('Y-m-d 06:00:00',$i)),array('lt',date('Y-m-d 06:00:00',$i+24*3600)));
      }
      else{
        $where['BetDt']=array(array('egt',date('Y-m-d 06:00:00',$i-24*3600)),array('lt',date('Y-m-d 06:00:00',$i)));
      }
      $mapxx=$where;
      if($_GET['isMember']=='true'){
        $mapxx['uid'] = $_GET['CompanyID'];
      }
      else{
        $mapxx['agentpath'] = array('like','%-'.$_GET['CompanyID'].'-%');
      }
      $mem=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where($mapxx)->select();
      $mem_zt0=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where($mapxx + ['zt' => 0])->select();
      // echo "--------------------------------------\n";print_r($mapxx);print_r($mem);print_r($mem2);
      // echo date('Y-m-d', $i) . ': ' . enjson(['mem' => $mem, 'mem_zt0' => $mem_zt0], 'pretty') . PHP_EOL . '-------------------------------' . PHP_EOL;

      $current_agent_id = $agent['id'];
      header('X-DEBUG-MAPXX-' . $i . ': ' . enjson($mapxx));
      $list=M('bets')->where($mapxx)->select();
      $fsmoney = $fsmoney_wl = 0;
      $lhmoney = $lhmoney_wl = 0;
      $lhmoney2 = 0;
      $selffsmoney = $selffsmoney_wl = 0;
      $selflhmoney = $selflhmoney_wl = 0;
      $selflhmoney2 = $selflhmoney2_wl = 0;
      $占成金额_up=0;
      $占成金额_down=0;
      foreach($list as $keyxx=>$onexx){
        // print_r($onexx);
        // 算一份出来
        $no_result = false;
        if (empty($onexx['fsxx']) && empty($onexx['lhxx'])) {
          $no_result = true;
          $onexx['fsxx'] = \ReportCalculator::generateFsxxForBet($onexx);
          $onexx['lhxx'] = \ReportCalculator::generateLhxxForBet($onexx);
        }
        // 开奖使用原算法
        $fsxx=json_decode($onexx['fsxx'],true);
        $lhxx=json_decode($onexx['lhxx'],true);
        foreach($fsxx as $key1=>$one1){
          if(!in_array($key1,$path)){
            $fsmoney += $one1;
            if (!$no_result) {
              $fsmoney_wl += $one1;
            }
          }
          if($key1 == $current_agent_id){
            $selffsmoney += $one1;
            if (!$no_result) {
              $selffsmoney_wl += $one1;
            }
          }
        }
        // print_r($lhxx);
        $flag = true;
        foreach($lhxx as $key2=>$one2){
          if(!in_array($key2,$path)){
            $lhmoney += $one2['win'];
            $lhmoney2 += $one2['money'];
            if (!$no_result) {
              $lhmoney_wl += $one2['win'];
            }
          }
          if($key2==$current_agent_id){
            $selflhmoney += $one2['win'];
            $selflhmoney2 += $one2['money'];
            if (!$no_result) {
              $selflhmoney_wl += $one2['win'];
              $selflhmoney2_wl += $one2['money'];
            }
          }
          if ($flag == true) {
            $占成金额_up += $one2['money'];
            if ($key2 == $_GET['CompanyID']) {
              $flag = false;
              continue;
            }
            $占成金额_down += $one2['money'];
          }
        }
      }
      if($mem['0']['memberbetcount']){
        $memWL = $mem['0']['memwl'] + $mem['0']['backcomm'] - $mem['0']['membetamt'] + $mem_zt0[0]['membetamt'];
        if($_GET['isMember']=='true'){
          $data['DirectMemBetAmt']=fix_decimal($mem['0']['membetamt'], 4);
          $data['DirectMemWL']=fix_decimal($memWL, 4);
          $data['DirectMemBetCount']=fix_decimal($mem['0']['memberbetcount'], 4);
        }
        else{
          $mapxx['parent']=$_GET['CompanyID'];
          $mem2=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where($mapxx)->select();
          $data['DirectMemBetAmt']=fix_decimal($mem2['0']['membetamt'], 4);
          $data['DirectMemWL']=fix_decimal($mem2['0']['memwl']+$mem2['0']['backcomm']-$mem2['0']['membetamt'], 4);
          $data['DirectMemBetCount']=fix_decimal($mem2['0']['memberbetcount'], 4);
        }
        $data['PeriodsTime']=date('Y-m-d',$i);
        $data['MemBetAmt']=fix_decimal($mem['0']['membetamt'], 4);
        $data['MemWL']=fix_decimal($memWL, 4);
        $data['MemberBetCount']=fix_decimal($mem['0']['memberbetcount'], 4);

        $mapxx=$where;
        $mapxx['path2']=array('like','%-'.$_GET['CompanyID'].'-%');
        $mapxx['agent']=array('neq',$_GET['CompanyID']);

        $data['占成金额_up'] = fix_decimal($占成金额_up, 4);
        $data['占成金额_down'] = fix_decimal($占成金额_down, 4);
        $data['DownLineBetAmt'] = fix_decimal($data['MemBetAmt'] - $占成金额_down, 4);
        $data['DownLineWL'] = fix_decimal(($data['MemWL']+$fsmoney_wl+$lhmoney_wl)+0, 4);

        $data['SelfBetAmt'] = fix_decimal($selflhmoney2, 4);
        $data['SelfComm'] = fix_decimal($selffsmoney, 4);
        $data['SelfWL'] = fix_decimal((0+$selflhmoney_wl), 4);
        $data['SelfWLTotal'] = fix_decimal((0+$selflhmoney_wl+$selffsmoney_wl), 4);

        $data['UperBetAmt'] = fix_decimal(($data['MemBetAmt'] - $占成金额_up), 4);
        $data['UperWL'] = fix_decimal((0-($data['MemWL']+$fsmoney_wl+$lhmoney_wl)-$data['SelfWLTotal']), 4);
        $dataxx[]=fix_decimal($data, 4);
      }
      $i=$i+24*3600;
    }
    echo json_encode($dataxx);
  }
  public function GetReportList(){
    header('Content-type: application/json');
    // $start=$_GET['Date'].' 06:00:00';
    // $end=$_GET['DateTo'].' 06:00:00';
    // $where['BetDt']=array('between',$start.','.$end);
    $user_tag = \AgentReporter::getAgentTagByAgid($_GET['CompanyID'], $this->agent);
    $periods_tag = \AgentReporter::getPeriodsTag($_GET['PeriodsNumber']);
    \AgentReporter::report($this->agent['id'], '日报表(期数)' . $periods_tag . $user_tag);

    $where['PeriodsNumber']=$_GET['PeriodsNumber'];
    // 子账号支持日报表（期数）
    if($this->agent['issubaccount']){
      if($_GET['CompanyID'] == $this->agent['id']){
        $_GET['CompanyID'] = $this->agent['parent'];
      }
    }
    $pagent=M('agent')->find($_GET['CompanyID']);
    $path=explode('-',$pagent['path']);
    if($pagent['agentlevel']<5 && $_GET['IsDirectMember']=='false'){
      $map['parent']=$_GET['CompanyID'];
      $map['id']=array('neq',$_GET['CompanyID']);
      $list0 = [$pagent];
      $list0 = array_merge($list0, M('agent')->where($map)->select());

      $dataxx=array();
      $map=array();
      foreach ($list0 as $zkey => $zvalue) {
        $mapxx=$where;  
        if($zvalue['id']!=$pagent['id']){
          $mapxx['agentpath']=array('like','%-'.$zvalue['id'].'-%');
        }else{
          $mapxx['parent']=$zvalue['id'];
        }
        $mem=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm,zt")->where($mapxx)->select();
        //membetamt 下注总额
        //memwl 盈利总额
        //memberbetcount 下注数量
        //BackComm 回水总额

        header('X-DEBUG-MAPXX-' . $zvalue['id'] . ':' . enjson($mapxx));
        $list=M('bets')->where($mapxx)->select(); //查询反水信息和拦货信息
        $fsmoney=0;
        $lhmoney=0;
        $lhmoney2=0;
        $selffsmoney=0;
        $selflhmoney=0;
        $selflhmoney2=0;
        $no_result = false;
        foreach($list as $keyxx=>$onexx){
          // 算一份出来
          if (empty($onexx['fsxx']) || empty($onexx['lhxx'])) {
            $no_result = true;
            $onexx['fsxx'] = \ReportCalculator::generateFsxxForBet($onexx);
            $onexx['lhxx'] = \ReportCalculator::generateLhxxForBet($onexx);
          }
          // 开奖使用原算法
          $fsxx=json_decode($onexx['fsxx'],true);
          $lhxx=json_decode($onexx['lhxx'],true);
          //计算反水总额和上级反水
          foreach($fsxx as $key2=>$one2){
            if(!in_array($key2,$path)){
              $fsmoney=$fsmoney+$one2;
            }
            if($key2==$pagent['id']){
              $selffsmoney=$selffsmoney+$one2;
            }
          }
          //计算拦货总额和上级拦货
          foreach($lhxx as $key2=>$one2){
            if(!in_array($key2,$path)){
              $lhmoney=$lhmoney+$one2['win'];
              $lhmoney2=$lhmoney2+$one2['money'];
            }
            if($key2==$pagent['id']){
              $selflhmoney=$selflhmoney+$one2['win'];
              $selflhmoney2=$selflhmoney2+$one2['money'];
            }
          }

        }

        if($zvalue['id']!=$pagent['id']){
          $data['AgentLevel']=$zvalue['agentlevel'];
          $data['CompanyID']=$zvalue['id'];
          $data['CompanyType']=$zvalue['agentlevel'];
          $data['LevelStatus']=$zvalue['agentlevel'];
          $data['LoginName']=$zvalue['user_login'];
          $data['NickName']=$zvalue['nickname'];
          $data['DownLineBetAmt']=fix_decimal(($mem['0']['membetamt']), 4);
          $data['DownLineWL']= $mem[0]['zt']==0 ? 0 : fix_decimal(($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']+$fsmoney+$lhmoney), 4);
        }else{
          $data['AgentLevel']=-2;
          $data['CompanyID']=0;
          $data['CompanyType']=null;
          $data['LevelStatus']=null;
          $data['LoginName']=null;
          $data['NickName']=null;
          $data['DownLineBetAmt']=0;
          $data['DownLineWL']=0;
        }
        $data['MemBetAmt']=fix_decimal($mem['0']['membetamt'], 4);

        $data['MemberBetCount']=fix_decimal($mem['0']['memberbetcount'], 4);

        $comm2=M('fsxx')->field("sum(money) as money")->where($mapxx2)->select();
        $radio2=M('lhxx')->field("sum(money) as money,sum(win) as win")->where($mapxx2)->select();

        $data['SelfBetAmt']=fix_decimal($selflhmoney2, 4);
        $data['SelfComm']=fix_decimal($selffsmoney, 4);
        $data['SelfWL']=$mem[0]['zt']==0 ? 0 : fix_decimal((0+$selflhmoney), 4);
        $data['SelfWLTotal']=$mem[0]['zt']==0 ? 0 : fix_decimal((0+$selflhmoney+$selffsmoney), 4);

        $data['UperBetAmt']=fix_decimal(($data['MemBetAmt']), 4);

        //0-(盈利总额+反水总额-下注总额+反水总额-拦货总额)-(上级拦货+上级反水)
        //echo "(0-({$mem['0']['memwl']}+{$mem['0']['backcomm']}-{$mem['0']['membetamt']}+{$fsmoney}-{$lhmoney})-{$data['SelfWLTotal']})";exit;
        $data['UperWL']=$mem[0]['zt']==0 ? 0 : fix_decimal((0-($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']+$fsmoney+$lhmoney)-$data['SelfWLTotal']), 4);
        $data['MemWL']=$mem[0]['zt']==0 ? 0 : fix_decimal(($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']), 4);
        if($data['MemberBetCount']>0){
          $dataxx[]=$data;
        }
      }
    }else{
      $map['parent']=$_GET['CompanyID'];
      $list0=M('user')->where($map)->select();
      $dataxx=array();

      foreach ($list0 as $key => $value) {
        $mapxx=$where;
        $mapxx['uid']=$value['id'];
        $mem=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where($mapxx)->select();
        $mapxx['zt'] = 0;
        $mem2=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where($mapxx)->select();

        $list=M('bets')->field("fsxx,lhxx")->where($mapxx)->select();
        $fsmoney=0;
        $lhmoney=0;
        $lhmoney2=0;
        $selffsmoney=0;
        $selflhmoney=0;
        $selflhmoney2=0;
        foreach($list as $keyxx=>$onexx){
          $fsxx=json_decode($onexx['fsxx'],true);
          $lhxx=json_decode($onexx['lhxx'],true);
          foreach($fsxx as $key2=>$one2){
            if(!in_array($key2,$path)){
              $fsmoney=$fsmoney+$one2;
            }
            if($key2==$pagent['id']){
              $selffsmoney=$selffsmoney+$one2;
            }
          }
          foreach($lhxx as $key2=>$one2){
            if(!in_array($key2,$path)){
              $lhmoney=$lhmoney+$one2['win'];
              $lhmoney2=$lhmoney2+$one2['money'];
            }
            if($key2==$pagent['id']){
              $selflhmoney=$selflhmoney+$one2['win'];
              $selflhmoney2=$selflhmoney2+$one2['money'];
            }
          }
        }
        $data['AgentLevel']=-2;
        $data['CompanyID']=$value['id'];
        $data['CompanyType']='-1';
        $data['LevelStatus']='-1';

        $data['LoginName']=$value['user_login'];
        $data['NickName']=$value['user_nicename'];

        $data['DownLineWL']=0;
        $data['DownLineBetAmt']=0;

        $data['MemBetAmt']=fix_decimal($mem['0']['membetamt'], 4);

        $data['MemberBetCount']=fix_decimal($mem['0']['memberbetcount'], 4);

        $data['SelfBetAmt']=fix_decimal($selflhmoney2, 4);
        $data['SelfComm']=fix_decimal($selffsmoney, 4);
        $data['SelfWL']=fix_decimal((0+$selflhmoney), 4);
        $data['SelfWLTotal']=fix_decimal((0+$selflhmoney+$selffsmoney), 4);

        $data['UperBetAmt']=fix_decimal(($data['MemBetAmt']), 4);

        $mem['0']['backcomm'] = $mem['0']['backcomm']-$mem2['0']['backcomm'];
        $mem['0']['membetamt'] = $mem['0']['membetamt']-$mem2['0']['membetamt'];
        $data['UperWL']=fix_decimal((0-($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt'])-$data['SelfWLTotal']), 4);
        $data['MemWL']=fix_decimal(($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']), 4);
        if($data['MemberBetCount']>0){
          $dataxx[]=$data;
        }
      }
    }
    echo json_encode($dataxx);
  }
  public function GetAllOnlineUser(){
    header('Content-type: application/json');
    $mapxx['path']=array('like','%-'.$this->agent['id'].'-%');
    $agentlist=M('agent')->field('id')->where($mapxx)->select();
    $listxx=array();
    foreach($agentlist as $value){
      $listxx[]=$value['id'];
    }
    $map2['parent']=array('in',implode(',',$listxx));
    $map2['token']=array('gt',time()-600);
    $list=M('user')->where($map2)->select();
    //print_r($map2);exit;
    //print_r($list);exit;
    $mapxx['token']=array('gt',time()-20);
    $list2=M('agent')->where($mapxx)->select();
    $dataxx=array();
    foreach ($list as $key => $value) {
      $data=array();
      $data['LoginName']=$value['user_login'];
      $data['AccountType']=2;
      $dataxx['CmdObject'][]=$data;
    }
    foreach ($list2 as $key => $value) {
      $data=array();
      $data['LoginName']=$value['user_login'];
      $data['AccountType']=1;
      $dataxx['CmdObject'][]=$data;
    }
    echo json_encode($dataxx);
  }
  public function ReportForWeekAll(){
    header('Content-type: application/json');
    $user_tag = \AgentReporter::getAgentTagByAgid($_GET['CompanyID'], $this->agent);
    \AgentReporter::report($this->agent['id'], '周报表' . $user_tag);
    if($this->agent['issubaccount']){
      if($_GET['CompanyID'] == $this->agent['id']){
        $_GET['CompanyID'] = $this->agent['parent'];
      }
    }
    $start = $_GET['DateFrom'] . ' 06:00:00';
    $end = date('Y-m-d',strtotime($_GET['DateTo']) + 3600 * 24) . ' 06:00:00';

    $pagent = M('agent')->find($_GET['CompanyID']);
    $path = explode('-', $pagent['path']);
    //$where['BetDt']=array(array('gt',$start),array('lt',$end));
    $where['BetDt'] = array(array('egt', $start), array('lt', $end));

    if($pagent['agentlevel']<5 && $_GET['IsDirectMember']=='false'){
      // 非代理级别，处理方式
      $map['parent']=$_GET['CompanyID'];
      $map['id']=array('neq',$_GET['CompanyID']);
      $list0=M('agent')->where($map)->select();
      $list0[]=$pagent;

      $dataxx=array();
      $map=array();
      foreach ($list0 as $zkey => $zvalue) {  

        $mapxx=$where;  
        if($zvalue['id']!=$pagent['id']){
          $mapxx['agentpath']=array('like','%-'.$zvalue['id'].'-%');
          // $mapxx3=$where;
          // $mapxx3['path2']=array('like','%-'.$zvalue['id'].'-%'); 
          // $comm=M('fsxx')->field("sum(money) as money")->where($mapxx3)->select();
          // $radio=M('lhxx')->field("sum(money) as money,sum(win) as win")->where($mapxx3)->select();

          // $mapxx2=$where;
          // $mapxx2['agent']=$pagent['id']; 
          // $mapxx2['path']=array('like','%-'.$zvalue['id'].'-%');
        }
        else{
          $mapxx['parent']=$zvalue['id'];
          // $mapxx2=$where;
          // $mapxx2['agent']=$pagent['id'];
          // $mapxx2['parent']=$pagent['id'];
        }
        $mem=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where($mapxx)->where($mapxx)->select();
        $mem2=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where(array_merge($mapxx,array('zt'=>0)))->select();
        $_mem['0']['backcomm'] = $mem['0']['backcomm'] - $mem2['0']['backcomm'];
        $_mem['0']['membetamt'] = $mem['0']['membetamt'] - $mem2['0']['membetamt'];

        $current_agent_id = $pagent['id'];
        header('X-DEBUG-MAPXX-' . $zvalue['id'] . ': ' . enjson($mapxx));
        $list=M('bets')->where($mapxx)->select();
        $fsmoney = $fsmoney_wl = 0;
        $lhmoney = $lhmoney_wl = 0;
        $lhmoney2 = 0;
        $selffsmoney = $selffsmoney_wl = 0;
        $selflhmoney = $selflhmoney_wl = 0;
        $selflhmoney2 = $selflhmoney2_wl = 0;
        $占成金额_up=0;
        $占成金额_down=0;
        foreach($list as $keyxx=>$onexx){
          // print_r($onexx);
          // 算一份出来
          $no_result = false;
          if (empty($onexx['fsxx']) && empty($onexx['lhxx'])) {
            $no_result = true;
            $onexx['fsxx'] = \ReportCalculator::generateFsxxForBet($onexx);
            $onexx['lhxx'] = \ReportCalculator::generateLhxxForBet($onexx);
          }
          // 开奖使用原算法
          $fsxx=json_decode($onexx['fsxx'],true);
          $lhxx=json_decode($onexx['lhxx'],true);
          foreach($fsxx as $key1=>$one1){
            if(!in_array($key1,$path)){
              $fsmoney += $one1;
              if (!$no_result) {
                $fsmoney_wl += $one1;
              }
            }
            if($key1 == $current_agent_id){
              $selffsmoney += $one1;
              if (!$no_result) {
                $selffsmoney_wl += $one1;
              }
            }
          }
          // print_r($lhxx);
          $flag = true;
          foreach($lhxx as $key2=>$one2){
            if(!in_array($key2,$path)){
              $lhmoney += $one2['win'];
              $lhmoney2 += $one2['money'];
              if (!$no_result) {
                $lhmoney_wl += $one2['win'];
              }
            }
            if($key2 == $current_agent_id){
              $selflhmoney += $one2['win'];
              $selflhmoney2 += $one2['money'];
              if (!$no_result) {
                $selflhmoney_wl += $one2['win'];
                $selflhmoney2_wl += $one2['money'];
              }
            }
            if ($flag == true) {
              $占成金额_up += $one2['money'];
              if ($key2 == $current_agent_id){
                $flag = false;
                continue;
              }
              $占成金额_down += $one2['money'];
            }
          }
        }

        $memWL = $mem['0']['memwl'] + $mem['0']['backcomm'] - $mem['0']['membetamt'] + $mem2[0]['membetamt'];
        $data['MemBetAmt']=fix_decimal($mem['0']['membetamt'], 4);

        $data['SelfBetAmt']=fix_decimal($selflhmoney2, 4);
        $data['SelfComm']=fix_decimal($selffsmoney, 4);
        $data['SelfWL'] = fix_decimal((0+$selflhmoney_wl), 4);
        $data['SelfWLTotal'] = fix_decimal((0+$selflhmoney_wl+$selffsmoney_wl), 4);
        
        $data['占成金额_up'] = fix_decimal($占成金额_up, 4);
        $data['占成金额_down'] = fix_decimal($占成金额_down, 4);
        $data['DownLineBetAmt'] = fix_decimal($data['MemBetAmt'] - $占成金额_down, 4);
        $data['DownLineWL'] = fix_decimal($memWL+$fsmoney_wl+$lhmoney_wl, 4);

        $data['UperBetAmt'] = fix_decimal(($data['MemBetAmt'] - $占成金额_up), 4);
        $data['UperWL'] = fix_decimal((0-($memWL+$fsmoney_wl+$lhmoney_wl)-$data['SelfWLTotal']), 4);

        if($zvalue['id']!=$pagent['id']){
          $data['AgentLevel']=$zvalue['agentlevel'];
          $data['CompanyID']=$zvalue['id'];
          $data['CompanyType']=$zvalue['agentlevel'];
          $data['LevelStatus']=$zvalue['agentlevel'];
          $data['LoginName']=$zvalue['user_login'];
          $data['NickName']=$zvalue['nickname'];
          // $data['DownLineBetAmt']=fix_decimal(($mem['0']['membetamt']), 4);
          // $data['DownLineWL']=fix_decimal(($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']+$fsmoney+$lhmoney), 4);
        }
        else{
          $data['AgentLevel']=-2;
          $data['CompanyID']=0;
          $data['CompanyType']=null;
          $data['LevelStatus']=null;
          $data['LoginName']=null;
          $data['NickName']=null;
          // $data['DownLineBetAmt']=0;
          // $data['DownLineWL']=0;
        }
        $data['MemWL']=fix_decimal($memWL, 4);
        $data['MemberBetCount']=fix_decimal($mem['0']['memberbetcount'], 4);
        // if($zvalue['id']!=$pagent['id']){
        //   $data['UperBetAmt']=fix_decimal(($data['MemBetAmt']), 4);
        //   $data['UperWL']=fix_decimal((0-($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']+$fsmoney+$lhmoney)-$data['SelfWLTotal']), 4);
        // }
        // else{
        //   $data['UperBetAmt']=fix_decimal(($data['MemBetAmt']), 4);
        //   $data['UperWL']=fix_decimal((0-($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']+$fsmoney+$lhmoney)-$data['SelfWLTotal']), 4);
        // }
        if($data['MemberBetCount']>0){
          $dataxx[]=$data;
        }
      }
    }
    else{
      $map['parent']=$_GET['CompanyID'];
      $list0=M('user')->where($map)->select();
      $dataxx=array();


      foreach ($list0 as $key => $value) {
        $mapxx=$where;
        $mapxx['uid']=$value['id'];
        $mem=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where($mapxx)->where($mapxx)->select();
        $mem2=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where(array_merge($mapxx,array('zt'=>0)))->select();
        $mem['0']['backcomm'] = $mem['0']['backcomm']-$mem2['0']['backcomm'];
        $mem['0']['membetamt'] = $mem['0']['membetamt']-$mem2['0']['membetamt'];

        $current_agent_id = $pagent['id'];
        $list=M('bets')->where($mapxx)->select();
        $fsmoney = $fsmoney_wl = 0;
        $lhmoney = $lhmoney_wl = 0;
        $lhmoney2 = 0;
        $selffsmoney = $selffsmoney_wl = 0;
        $selflhmoney = $selflhmoney_wl = 0;
        $selflhmoney2 = $selflhmoney2_wl = 0;
        $占成金额_up=0;
        $占成金额_down=0;
        foreach($list as $keyxx=>$onexx){
          // print_r($onexx);
          // 算一份出来
          $no_result = false;
          if (empty($onexx['fsxx']) && empty($onexx['lhxx'])) {
            $no_result = true;
            $onexx['fsxx'] = \ReportCalculator::generateFsxxForBet($onexx);
            $onexx['lhxx'] = \ReportCalculator::generateLhxxForBet($onexx);
          }
          // 开奖使用原算法
          $fsxx=json_decode($onexx['fsxx'],true);
          $lhxx=json_decode($onexx['lhxx'],true);
          foreach($fsxx as $key1=>$one1){
            if(!in_array($key1,$path)){
              $fsmoney += $one1;
              if (!$no_result) {
                $fsmoney_wl += $one1;
              }
            }
            if($key1 == $current_agent_id){
              $selffsmoney += $one1;
              if (!$no_result) {
                $selffsmoney_wl += $one1;
              }
            }
          }
          // print_r($lhxx);
          $flag = true;
          foreach($lhxx as $key2=>$one2){
            if(!in_array($key2,$path)){
              $lhmoney += $one2['win'];
              $lhmoney2 += $one2['money'];
              if (!$no_result) {
                $lhmoney_wl += $one2['win'];
              }
            }
            if($key2 == $current_agent_id){
              $selflhmoney += $one2['win'];
              $selflhmoney2 += $one2['money'];
              if (!$no_result) {
                $selflhmoney_wl += $one2['win'];
                $selflhmoney2_wl += $one2['money'];
              }
            }
            if ($flag == true) {
              $占成金额_up += $one2['money'];
              if ($key2 == $_GET['CompanyID']) {
                $flag = false;
                continue;
              }
              $占成金额_down += $one2['money'];
            }
          }
        }

        $data['AgentLevel']=-2;
        $data['CompanyID']=$value['id'];
        $data['CompanyType']='-1';
        $data['LevelStatus']='-1';

        $data['LoginName']=$value['user_login'];
        $data['NickName']=$value['user_nicename'];

        $data['MemBetAmt']=fix_decimal($mem['0']['membetamt'], 4);
        $data['MemWL']=fix_decimal(($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']), 4);
        $data['MemberBetCount']=fix_decimal($mem['0']['memberbetcount'], 4);

        $data['占成金额_up'] = fix_decimal($占成金额_up, 4);
        $data['占成金额_down'] = fix_decimal($占成金额_down, 4);
        $data['DownLineBetAmt'] = fix_decimal($data['MemBetAmt'] - $占成金额_down, 4);
        $data['DownLineWL'] = fix_decimal(($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']+$fsmoney_wl+$lhmoney_wl)+0, 4);

        $data['SelfBetAmt'] = fix_decimal($selflhmoney2, 4);
        $data['SelfComm'] = fix_decimal($selffsmoney, 4);
        $data['SelfWL'] = fix_decimal((0+$selflhmoney_wl), 4);
        $data['SelfWLTotal'] = fix_decimal((0+$selflhmoney_wl+$selffsmoney_wl), 4);

        $data['UperBetAmt'] = fix_decimal(($data['MemBetAmt'] - $占成金额_up), 4);
        $data['UperWL'] = fix_decimal((0-($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']+$fsmoney_wl+$lhmoney_wl)-$data['SelfWLTotal']), 4);

        if($data['MemberBetCount']>0){
          $dataxx[]=$data;
        }
      }
    }
    $dataxx = format_report_data_result($dataxx);
    echo json_encode($dataxx);
  }

    public function ReportForDailyAll(){
        header('Content-type: application/json');
        @set_time_limit(0);
        @ini_set('memory_limit', '512M');

        $user_tag = \AgentReporter::getAgentTagByAgid($_GET['CompanyID'], $this->agent);
        \AgentReporter::report($this->agent['id'], '日(结)报表' . $user_tag);
        // header('X-DEBUG-CK: ' . enjson([ck(), session()]));
        if($this->agent['issubaccount']){
          if($_GET['CompanyID'] == $this->agent['id']){
            $_GET['CompanyID'] = $this->agent['parent'];
          }
        }
        if (!isset($_GET['Date']) || $_GET['Date'] == date('Y-m-d')) {
          if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
            $start=date('Y-m-d') . ' 06:00:00';
            $end=date('Y-m-d',time() + 86400) . ' 06:00:00';
          }
          else{
            $start=date('Y-m-d',time() - 86400) . ' 06:00:00';
            $end=date('Y-m-d') . ' 06:00:00';
          }

        }
        else{
            $start = $_GET['Date'] . ' 06:00:00';
            $end = date('Y-m-d', strtotime($_GET['Date']) + 86400).' 06:00:00';
        }

        $pagent = M('agent')->find($_GET['CompanyID']);
        $path = explode('-',$pagent['path']);
        $where['BetDt'] = array(array('egt', $start), array('lt', $end));
        // header('X-DEBUG-WHERE: ' . enjson($where));
      if($pagent['agentlevel']<5 && $_GET['IsDirectMember']=='false'){
        // 代理以上级别
        $map['parent'] = $_GET['CompanyID'];
        $map['id'] = array('neq', $_GET['CompanyID']);
        $list0 = M('agent')->where($map)->select();
        $list0[] = $pagent;
        $dataxx = array();
        $map = array();
        foreach ($list0 as $zkey => $zvalue) {  
          $mapxx = $where;  
          if ($zvalue['id'] != $pagent['id']) {
            $mapxx['agentpath'] = array('like','%-' . $zvalue['id'] . '-%');
          }
          else{
            $mapxx['parent'] = $zvalue['id'];
          }
          $mem = M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where($mapxx)->select();
          $mem2 = M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where(array_merge($mapxx,array('zt'=>0)))->select();
          
          // 取所有符合条件的投注数据，返水信息、拦货信息、zt
          $current_agent_id = $pagent['id'];
          header('X-DEBUG-MAPXX-' . $zvalue['id'] . ': ' . enjson($mapxx));
          $list = M('bets')->where($mapxx)->select();
          $fsmoney = $fsmoney_wl = 0;
          $lhmoney = $lhmoney_wl = 0;
          $lhmoney2 = 0;
          $selffsmoney = $selffsmoney_wl = 0;
          $selflhmoney = $selflhmoney_wl = 0;
          $selflhmoney2 = $selflhmoney2_wl = 0;
          $占成金额_up = 0;
          $占成金额_down = 0;
          foreach ($list as $keyxx => $onexx) {
            // print_r($onexx);
            // 算一份出来
            $no_result = false;
            if (empty($onexx['fsxx']) && empty($onexx['lhxx'])) {
              $no_result = true;
              $onexx['fsxx'] = \ReportCalculator::generateFsxxForBet($onexx);
              $onexx['lhxx'] = \ReportCalculator::generateLhxxForBet($onexx);
            }
            // print_r($onexx);
            // 开奖使用原算法
            $fsxx = json_decode($onexx['fsxx'], true);
            $lhxx = json_decode($onexx['lhxx'], true);
            foreach ($fsxx as $key1 => $one1) {
              if (!in_array($key1,$path)) {
                $fsmoney += $one1;
                if (!$no_result) {
                  $fsmoney_wl += $one1;
                }
              }
              if ($key1 == $current_agent_id) {
                $selffsmoney += $one1;
                if (!$no_result) {
                  $selffsmoney_wl += $one1;
                }
              }
            }
            // print_r($lhxx);
            $flag = true;
            foreach($lhxx as $key2=>$one2){
              if(!in_array($key2,$path)){
                $lhmoney += $one2['win'];
                $lhmoney2 += $one2['money'];
                if (!$no_result) {
                  $lhmoney_wl += $one2['win'];
                }
              }
              if($key2 == $current_agent_id){
                $selflhmoney += $one2['win'];
                $selflhmoney2 += $one2['money'];
                if (!$no_result) {
                  $selflhmoney_wl += $one2['win'];
                  $selflhmoney2_wl += $one2['money'];
                }
              }
              if ($flag == true) {
                $占成金额_up += $one2['money'];
                if ($key2 == $current_agent_id) {
                  $flag = false;
                  continue;
                }
                $占成金额_down += $one2['money'];
              }
            }
          }

          $data['MemBetAmt']=fix_decimal($mem['0']['membetamt'], 4);
          $data['MemWL'] = fix_decimal($mem['0']['memwl'] + $mem['0']['backcomm'] - $mem['0']['membetamt'] + $mem2[0]['membetamt'], 4);
          $data['占成金额_up'] = fix_decimal($占成金额_up, 4);
          $data['占成金额_down'] = fix_decimal($占成金额_down, 4);
          $data['fsmoney_wl'] = fix_decimal($fsmoney_wl, 4);
          $data['lhmoney_wl'] = fix_decimal($lhmoney_wl, 4);

          if($zvalue['id']!=$pagent['id']){
            $data['AgentLevel']=$zvalue['agentlevel'];
            $data['CompanyID']=$zvalue['id'];
            $data['CompanyType']=$zvalue['agentlevel'];
            $data['LevelStatus']=$zvalue['agentlevel'];
            $data['LoginName']=$zvalue['user_login'];
            $data['NickName']=$zvalue['nickname'];
            $_mem['0']['backcomm'] = $mem['0']['backcomm']-$mem2['0']['backcomm'];
            $_mem['0']['membetamt'] = $mem['0']['membetamt']-$mem2['0']['membetamt'];
            $data['DownLineBetAmt'] = fix_decimal($data['MemBetAmt'] - $占成金额_down, 4);
            $data['DownLineWL'] = fix_decimal($data['MemWL'] + $fsmoney_wl + $lhmoney_wl, 4);
          }
          else{
            $data['AgentLevel']=-2;
            $data['CompanyID']=0;
            $data['CompanyType']=null;
            $data['LevelStatus']=null;
            $data['LoginName']=null;
            $data['NickName']=null;
            $data['DownLineBetAmt']=0;
            $data['DownLineWL']=0;
          }
          $data['MemberBetCount']=fix_decimal($mem['0']['memberbetcount'], 4);
          $data['SelfBetAmt'] = fix_decimal($selflhmoney2, 4);
          $data['SelfComm'] = fix_decimal($selffsmoney, 4);
          $data['SelfWL'] = fix_decimal((0+$selflhmoney_wl), 4);
          $data['SelfWLTotal'] = fix_decimal((0+$selflhmoney_wl+$selffsmoney_wl), 4);

          $data['UperBetAmt'] = fix_decimal(($data['MemBetAmt'] - $占成金额_up), 4);
          $data['UperWL'] = fix_decimal((0-($data['MemWL']+$fsmoney_wl+$lhmoney_wl)-$data['SelfWLTotal']), 4);

          if($data['MemberBetCount']>0){
            $dataxx[]=$data;
          }
        }
      }
      else{
        $map['parent']=$_GET['CompanyID'];

        $list=M('user')->where($map)->select();
        $dataxx=array();

        foreach ($list as $key => $value) {
              $mapxx=$where;
              $mapxx['uid']=$value['id'];
              $mem=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where($mapxx)->select();
              $mem2=M('bets')->field("sum(BetAmount) as membetamt,sum(WinLoss) as memwl,sum(count) as memberbetcount,sum(BackComm) as backcomm")->where(array_merge($mapxx,array('zt'=>0)))->select();

              // 取所有符合条件的投注数据，返水信息、拦货信息、zt
              $current_agent_id = $pagent['id'];
              $list=M('bets')->where($mapxx)->select();
              $fsmoney = $fsmoney_wl = 0;
              $lhmoney = $lhmoney_wl = 0;
              $lhmoney2 = 0;
              $selffsmoney = $selffsmoney_wl = 0;
              $selflhmoney = $selflhmoney_wl = 0;
              $selflhmoney2 = $selflhmoney2_wl = 0;
              $占成金额_up=0;
              $占成金额_down=0;
              foreach($list as $keyxx=>$onexx){
                // print_r($onexx);
                // 算一份出来
                $no_result = false;
                if (empty($onexx['fsxx']) && empty($onexx['lhxx'])) {
                  $no_result = true;
                  $onexx['fsxx'] = \ReportCalculator::generateFsxxForBet($onexx);
                  $onexx['lhxx'] = \ReportCalculator::generateLhxxForBet($onexx);
                }
                // print_r($onexx);
                // 开奖使用原算法
                $fsxx=json_decode($onexx['fsxx'], true);
                $lhxx=json_decode($onexx['lhxx'], true);
                foreach($fsxx as $key1=>$one1){
                  if(!in_array($key1,$path)){
                    $fsmoney += $one1;
                    if (!$no_result) {
                      $fsmoney_wl += $one1;
                    }
                  }
                  if($key1 == $current_agent_id){
                    $selffsmoney += $one1;
                    if (!$no_result) {
                      $selffsmoney_wl += $one1;
                    }
                  }
                }
                // print_r($lhxx);
                $flag = true;
                foreach($lhxx as $key2=>$one2){
                  if(!in_array($key2,$path)){
                    $lhmoney += $one2['win'];
                    $lhmoney2 += $one2['money'];
                    if (!$no_result) {
                      $lhmoney_wl += $one2['win'];
                    }
                  }
                  if($key2 == $current_agent_id){
                    $selflhmoney += $one2['win'];
                    $selflhmoney2 += $one2['money'];
                    if (!$no_result) {
                      $selflhmoney_wl += $one2['win'];
                      $selflhmoney2_wl += $one2['money'];
                    }
                  }
                  if ($flag == true) {
                    $占成金额_up += $one2['money'];
                    if ($key2 == $current_agent_id) {
                      $flag = false;
                      continue;
                    }
                    $占成金额_down += $one2['money'];
                  }
                }
              }

              $data['MemBetAmt']=fix_decimal($mem['0']['membetamt'], 4);
              $data['占成金额_up'] = fix_decimal($占成金额_up, 4);
              $data['占成金额_down'] = fix_decimal($占成金额_down, 4);
              $data['fsmoney_wl'] = fix_decimal($fsmoney_wl, 4);
              $data['lhmoney_wl'] = fix_decimal($lhmoney_wl, 4);

              $data['AgentLevel']=-2;
              $data['CompanyID']=$value['id'];
              $data['CompanyType']='-1';
              $data['LevelStatus']='-1';

              $data['LoginName']=$value['user_login'];
              $data['NickName']=$value['user_nicename'];

              $data['DownLineWL']=0;
              $data['DownLineBetAmt']=0;

              $data['MemBetAmt']=fix_decimal($mem['0']['membetamt'], 4);
              
              $data['MemberBetCount']=fix_decimal($mem['0']['memberbetcount'], 4);

              $data['SelfBetAmt']=fix_decimal($selflhmoney2, 4);
              $data['SelfComm']=fix_decimal($selffsmoney, 4);
              $data['SelfWL']=fix_decimal((0+$selflhmoney_wl), 4);
              $data['SelfWLTotal']=fix_decimal((0+$selflhmoney_wl+$selffsmoney_wl), 4);
              $data['UperBetAmt'] = fix_decimal(($data['MemBetAmt'] - $占成金额_up), 4);
        
        $mem['0']['backcomm'] = $mem['0']['backcomm']-$mem2['0']['backcomm'];
        $mem['0']['membetamt'] = $mem['0']['membetamt']-$mem2['0']['membetamt'];
              $data['UperWL']=fix_decimal((0-($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt'])-$data['SelfWLTotal']), 4);
        $data['MemWL']=fix_decimal(($mem['0']['memwl']+$mem['0']['backcomm']-$mem['0']['membetamt']), 4);
              if($data['MemberBetCount']>0){
                $dataxx[]=$data;
              }
          }
        }
        $dataxx = format_report_data_result($dataxx);
        echo json_encode($dataxx);
    }

  public function GetLimitStoreLog(){
    header('Content-type: application/json');
    $map['Store'] = 1;
    if($_GET['isNewSubordinateClick']=='false' && $_GET['isMember']!='true'){
      if($this->agent['issubaccount']){
        $map['LoginName']=$this->agent['parent_user'];
      }else{
        $map['LoginName']=$this->agent['user_login'];  
      }
      $list=M('logs')->where($map)->select();
    }
    if($_GET['isNewSubordinateClick']=='true' && $_GET['isMember']!='true'){
      $agent=M('agent')->find($_GET['CompanyID']);
      $map['LoginName']=$agent['user_login'];
      $list=M('logs')->where($map)->select();
    }
    if($_GET['isMember']=='true'){
      $map['UpdateLoginName']=$_GET['LogName'];
      $map['LoginName']=$agent['user_login'];
      $list=M('logs')->where($map)->select();
    } 
    $dataxx=array();
    $list = array_reverse($list);
    foreach($list as $value){
      $data=array();
      $data['CreateDt']=$value['createdt'];
      $data['Describe']=$value['describe'];
      $data['LoginName']=$value['loginname'];
      $data['OperateIP']=$value['operateip'];
      $data['UpdateLoginName']=$value['updateloginname'];
      $dataxx[]=$data;
    }
    $dataxx = array_reverse($dataxx);
    echo json_encode($dataxx);
  }
  public function GetBasicDataLog(){
    header('Content-type: application/json');

    if($_GET['isNewSubordinateClick']=='false' && $_GET['isMember']!='true'){
      if($this->agent['issubaccount']){
        $map['LoginName']=$this->agent['parent_user'];
      }else{
        $map['LoginName']=$this->agent['user_login'];  
      }
      $list=M('logs')->where($map)->select();
    }
    if($_GET['isNewSubordinateClick']=='true' && $_GET['isMember']!='true'){
      $agent=M('agent')->find($_GET['CompanyID']);
      $map['LoginName']=$agent['user_login'];
      $list=M('logs')->where($map)->select();
    }
    if($_GET['isMember']=='true'){
      $map['UpdateLoginName']=$_GET['LogName'];
      $map['LoginName']=$agent['user_login'];
      $list=M('logs')->where($map)->select();
    } 
    $dataxx=array();

    foreach($list as $value){
      $data=array();
      $data['CreateDt']=$value['createdt'];
      $data['Describe']=$value['describe'];
      $data['LoginName']=$value['loginname'];
      $data['OperateIP']=$value['operateip'];
      $data['UpdateLoginName']=$value['updateloginname'];
      $dataxx[]=$data;
    }
    $dataxx = array_reverse($dataxx);
    echo json_encode($dataxx);
  }
  public function EditPassword(){
    header('Content-type: application/json');
    if($_POST['isAdvancedPassword']=='true'){
      $fs='user_pass2';
    }
    else{
      $fs='user_pass';
    }
    if($this->agent[$fs]!=md5($_POST['oldpassword'])){
      $this->ejson('原密码错误');
    }
    if($_POST['password']!=$_POST['password1']){
      $this->ejson('两次密码不同');
    }
    $save[$fs]=md5($_POST['password']);
    $this->addlog($this->agent['user_login'],$this->agent['user_login'],'修改密码');
    M('agent')->where(array('id'=>$this->agent['id']))->save($save);
    $data['status']=true;
    $data['info']="修改成功";
    echo json_encode($data);
  }


  public function EditPassword2(){

    header('Content-type: application/json');
    if($_POST['isAdvancedPassword']=='true'){
      $fs='user_pass2';
    }
    else{
      $fs='user_pass';
    }
    if($this->agent[$fs]!=md5($_POST['oldpassword'])){
      $this->ejson('原密码错误');
    }
    if($_POST['password']!=$_POST['password1']){
      $this->ejson('两次密码不同');
    }
    $save[$fs]=md5($_POST['password']);
    $this->addlog($this->agent['user_login'],$this->agent['user_login'],'修改密码');
    $save['first']='1';
    M('agent')->where(array('id'=>$this->agent['id']))->save($save);
    $data['status']=true;
    $data['info']="修改成功";
    echo json_encode($data);
  }
  public function EditBasicInformation(){
    header('Content-type: application/json');
    $save['nickname']=$_POST['NickName'];
    $map['user_login']=$_POST['LoginName'];
    M('agent')->where($map)->save();
    $this->addlog($this->agent['user_login'],$this->agent['user_login'],'修改基础资料');
    $data['status']=true;
    $data['info']="修改成功";
    echo json_encode($data);
  }

  public function GetMothRortDay(){
    header('Content-type: application/json');

    if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
      $start=strtotime($_GET['beginDate'].' 06:00:00');
      $end=strtotime($_GET['endDate'].' 06:00:00')+3600*24;
    }
    else{
      $start=strtotime($_GET['beginDate'].' 06:00:00')-3600*24;
      $end=strtotime($_GET['endDate'].' 06:00:00');
    }
    for($i=$start;$i<$end;$i){
      $datelst[]=array('PeriodsNumber'=>date('Ymd',$i));
      $i=$i+24*3600;
    }

    $data['datelst']=$datelst;
    echo json_encode($data);
  }
  public function InsertMember(){
    header('Content-type: application/json');
    $map['user_login']=$_POST['LoginName'];
    if(M('user')->where($map)->find()){
      $this->ejson('账户已经存在');
    }
    $map2['user_login']=$_POST['ParentName'];
    $parent=M('agent')->where($map2)->find();
    if(!$parent){
      $this->ejson('上级不存在');
    }
    if($parent['issubaccount']){
      $parent = M('agent')->where($map2)->find($parent['parent']);
    }
    if(!$parent){
      $this->ejson('上级不存在');
    }
    $commission=json_decode($parent['commission'],true);
    foreach($commission as $key=>$value){
      $commission[$key]['MaxLimitStore']=0;
      $commission[$key]['sjCommission']=0;
    }
    if($_POST['DefaultCredit']>$parent['money'] && $parent['agentlevel']>1){
      $this->ejson('上级余额不足');
    }
    $add['Commission']=json_encode($commission);
    $add['sjcommission']=json_encode($commission);
    $add['user_login']=$_POST['LoginName'];
    $add['user_nicename']=$_POST['NickName'];
    $add['user_pass']=md5($_POST['password']);
    $add['money']=$_POST['DefaultCredit'];
    $add['ratio']=$_POST['CurrentLevelRatio'];
    $add['describe']=$_POST['Describe'];
    $add['user_status']=$_POST['Status'];
    $add['parent_user']=$parent['user_login'];
    $add['parent']=$parent['id'];
    $add['company']=$parent['subcompanyid'];
    $add['agentpath']=$parent['path'];
    $add['update_time']=$this->time;
    $add['create_time']=$this->time;
    $res=M('user')->add($add);
    if($res){
      if($parent['agentlevel']>1){
        M('agent')->where(array('id'=>$parent['id']))->setDec('money',$add['money']);
      }
      $this->addlog($this->agent['user_login'],$add['user_login'],'创建帐号操作。初始信用额度：'.$add['money'].' ,占成：'.$add['ratio']);
      $data['newAgentID']=$res;
      $data['status']=true;
      $data['info']="添加用户成功";
      usertablejl($res);
      echo json_encode($data);
    }
    else{
      $this->ejson('添加失败');
    }
  }
  public function CheckRepeatAccount(){
    header('Content-type: application/json');
    if($_POST['isMember']=='true'){
      $user=M('user');
    }
    else{
      $user=M('agent');
    }
    $map['user_login']=$_POST['loginName'];
    if($user->where($map)->find()){
      $data['status']=false;
      $data['info']="账户已经存在";
    }
    else{
      $data['status']=true;
      $data['info']="账户可以使用";
    }
    echo json_encode($data);
  }
  public function RecoverCredit(){
    header('Content-type: application/json');
    $map['user_login']=$_POST['viewName'];//当前用户名
    $user=M('agent')->where($map)->find();
    $map2['user_login']=$_POST['userName'];//被操者用户名
    $user2=M('agent')->where($map2)->find();
    $mapxx['path']=array('like','%-'.$user['id'].'-%');
    $agentlist=M('agent')->field('id')->where($mapxx)->select();
    foreach($agentlist as $value){
      $listxx[]=$value['id'];
    }
    if(!in_array($user2['id'],$listxx)){
      $this->ejson('你没有操作权限');
    }
    $mapxx2['path']=array('like','%-'.$user2['id'].'-%');
    $agentlist2=M('agent')->field('id')->where($mapxx2)->select();
    $listxx2=array();
    foreach($agentlist2 as $value){
      $listxx2[]=$value['id'];
    }
    $map3['parent']=array('in',implode(',',$listxx2));
    $money=$list=M('agent')->where($map3)->sum('money');
    $money2=$list2=M('user')->where($map3)->sum('money');
    if($money+$money2==0){
      $this->ejson('下级已经归零');
    }
    $save['money']=0;
    M('agent')->where($map3)->save($save);
    M('user')->where($map3)->save($save);
    $data['status']=true;
    $data['info']="清零成功";
    echo json_encode($data);
  }
  public function IsSuper(){
    $this->ejson('test');
  }
  public function Basic(){
    $this->display();
  }
  public function BatchOdds(){
    $this->display();
  }
  public function EditBasic(){

    $save['SecondStopEarly']=$_GET['SecondStopEarly'];
    $save['CreditLimit']=$_GET['CreditLimit'];

    $save['CancelBet']=$_GET['CancelBet'];
    $save['IsOddsUse']=$_GET['IsOddsUse']=='true'?1:0;

    $save['IsDownlineEditForbid']=$_GET['IsDownlineEditForbid']=='true'?1:0;

    $save['IsInheritPeriods']=$_GET['IsInheritPeriods']=='true'?1:0;

    $save['IsDownlineCommEdit']=$_GET['IsDownlineCommEdit']=='true'?1:0;
    $save['IsSuperFirstLimit']=$_GET['IsSuperFirstLimit']=='true'?1:0;
    $save['CustomeContent']=$_GET['CustomeContent'];
    $save['IsCompanyCheckCode']=$_GET['IsCompanyCheckCode']=='true'?1:0;
    $save['IsMemCheckCode']=$_GET['IsMemCheckCode']=='true'?1:0;
    $save['IsShowLottory']=$_GET['IsShowLottory']=='true'?1:0;
    $save['IsSingleBack']=$_GET['IsSingleBack']=='true'?1:0;
    $save['IsCheckUper']=$_GET['IsCheckUper']=='true'?1:0;


    $save['IsDirectCompany']=$_GET['IsDirectCompany']=='true'?1:0;
    $save['IsInheritTrading']=$_GET['IsInheritTrading']=='true'?1:0;

    $save['IsInheritComm']=$_GET['IsInheritComm']=='true'?1:0;
    $save['PlayType']=1;

    $save['ReportShowCount']=$_GET['ReportShowCount'];
    $save['PeriodDays']=$_GET['PeriodDays'];
    $save['IsDLUpdateRatio']=$_GET['IsDLUpdateRatio']=='true'?1:0;

    $save['RBeginDtInt']=$_GET['RBeginDtInt'];

    $save['REndDtInt']=$_GET['REndDtInt'];
    $save['IsDLUpdateLimitStore']=$_GET['IsDLUpdateLimitStore']=='true'?1:0;
    $save['LSBeginDtInt']=$_GET['LSBeginDtInt'];
    $save['LSEndDtInt']=$_GET['LSEndDtInt'];
    $map['uid']=$_GET['ID'];
    $res=M('companysetting')->where($map)->save($save);
    if($res){
      $data['ID']=$res;
      $data['status']=true;
      $data['info']="修改成功";
      echo json_encode($data);
    }
    else{
      $this->ejson('您没有做任何修改');
    }
  }
  public function GetCompanySettingByID(){
    header('Content-type: application/json');
    $map['uid']=$_GET['ID'];
    $user=M('companysetting')->where($map)->find();
    $data=array();

    $data['LoginName']=$user['loginname'];
    $data['SecondStopEarly']=$user['secondstopearly'];//二字定提前封盘
    $data['IsOddsUse']=(boolean)$user['isoddsuse'];//是否实际赔率
    $data['CancelBet']=$user['cancelbet'];//分钟内可以退码
    $data['IsDownlineEditForbid']=(boolean)$user['isdownlineeditforbid'];
    $data['IsInheritPeriods']=(boolean)$user['isinheritperiods'];
    $data['IsDownlineCommEdit']=(boolean)$user['isdownlinecommedit'];
    $data['IsSuperFirstLimit']=(boolean)$user['issuperfirstlimit'];
    $data['CreditLimit']=$user['creditlimit'];
    $data['CustomeContent']=$user['customecontent'];
    $data['IsShowLottory']=(boolean)$user['isshowlottory'];
    $data['IsSingleBack']=(boolean)$user['issingleback'];
    $data['IsCheckUper']=(boolean)$user['ischeckuper'];
    $data['PlayType']=1;
    $data['IsDirectCompany']=(boolean)$user['isdirectcompany'];

    $data['IsInheritTrading']=(boolean)$user['isinherittrading'];

    $data['IsInheritComm']=(boolean)$user['isinheritcomm'];
    $data['IsControlReport']=(boolean)$user['iscontrolreport'];
    $data['ReportShowCount']=$user['reportshowcount'];
    $data['PeriodDays']=$user['perioddays'];

    $data['CompanyCheckCode']=(boolean)$user['companycheckcode'];
    $data['MemCheckCode']=(boolean)$user['memcheckcode'];
    $data['IsDLUpdateRatio']=(boolean)$user['isdlupdateratio'];
    $data['IsDLUpdateLimitStore']=(boolean)$user['isdlupdatelimitstore'];


    $data['RBeginDtInt']=$user['rbegindtint'];
    $data['REndDtInt']=$user['renddtint'];
    $data['LSBeginDtInt']=$user['lsbegindtint'];
    $data['LSEndDtInt']=$user['lsenddtint'];

    $dataxx[]=$data;
    echo json_encode($dataxx);
  }
  public function GetCompanySetingList(){
    header('Content-type: application/json');
    if($this->agent['issubaccount']){
      $map['parent']=$this->agent['parent'];
    }else{
      $map['parent']=$this->agent['id'];
    }

    if($_GET['loginName']){
      $map['user_login']=$_GET['loginName'];
    }
    if($_GET['nickName']){
      $map['user_nicename']=$_GET['nickName'];
    }
    if($_GET['Status']+1){
      $map['user_status']=$_GET['Status']+1;
    }
    $map['AgentLevel']='2';
    $userlist=M('agent')->where($map)->select();
    $levellist=M('agent_level')->select();
    $level=array();
    foreach ($levellist as $key => $value) {
      $level[$value['level']]=$value['title'];
    }
    $data=array();
    $data=array();
    foreach ($userlist as $key => $value) {
      $user=array();
      $parent=M('agent')->find($value['parent']);
      $user["ID"]=$value['id'];
      $user["SuperCompanyID"]=$value['supercompanyid'];
      $SuperCompany=M('agent')->find($value['supercompanyid']);
      $user["SuperLoginName"]=$SuperCompany['user_login'];
      $user["LoginName"]=$value['user_login'];
      $user["NickName"]=$value['nickname'];

      $user["LevelName"]=$level[$value['agentlevel']];
      $user["CompanyTypeName"]=$level[$value['agentlevel']];
      $user["DefaultCredit"]=fix_decimal($value['money'], 4);
      $user["UsedCredit"]=$value['yymoney'];
      $user["DefaultCash"]=0;
      $user["UsedCash"]=0;

      $user['Welfare']=$value['contributeratio'];

      $user["CompanyStatus"]=$value['user_status'];

      $user["ParentID"]=$value['parent'];
      $user["ParentName"]=$value['parent_user'];

      $user["ParentCredit"]=fix_decimal($parent['money'], 4);
      $user["ParentUsedCredit"]=fix_decimal($parent['yymoney'], 4);
      $user["ParentAgentLevel"]=fix_decimal($parent['agentlevel'], 4);
      $user["ParentLevelName"]=$level[$parent['agentlevel']];

      $user["LastLoginIP"]=$value['last_login_ip'];
      $user["LastLoginDt"]=$value['last_login_time'];
      $user["CreateDt"]=$value['create_time'];
      $user["UpdateDt"]=$value['update_time'];
      $user["Describe"]=$value['describe'];;

      $user["Ratio"]=fix_decimal($value['ratio'], 4);

      $user["SubCompanyID"]=$value['subcompanyID'];

      $user["ParentCompanyType"]=$parent['companytype'];


      $map3['parent']=$value['id'];
      $count=$list=M('user')->where($map3)->count();

      $user['MemCount']=$count+0;
      if($value['agentlevel']==5){
        $user['IsEndLevel']=true;
        $user['DownlineCount']='0';
      }
      else{
        $user['IsEndLevel']=false;
        $count=M('agent')->where($map3)->count();
        $user['DownlineCount']=$count;
      }
      $data[]=$user;
    }
    echo json_encode($data);
  }
  public function GetLowManageList(){
    header('Content-type: application/json');
    $agentid = $_GET['AgentID'];
    $agent = M('agent')->find($agentid);
    // deb($agent);
    if ($agent['issubaccount']) {
      $agentid = $agent['parent'];
    }
    //$map['parent']=$agentid;
    // $mapxx['path']=array('like','%-'.$agentid.'-%');
    // $agentlist=M('agent')->field('id')->where($mapxx)->select();
    // foreach($agentlist as $value){
    // $listxx[]=$value['id'];
    // }

    // 点名字要看这个名字的下级的数据
    //$map['parent']=$agentid;
    // if($this->agent['issubaccount']){
    //   $agentid = $this->agent['parent'];
    // }else{
    //   $agentid = $this->agent['id'];
    // }

    // $map['path']=array('like','%-'.$agentid.'-%');
    // 只显示直属下级的数据
    $map['parent'] = $agentid;
    $map['id']=array('neq',$agentid);
    if($_GET['loginName']){
      $map['user_login']=$_GET['loginName'];
    }
    if($_GET['nickName']){
      $map['user_nicename']=$_GET['nickName'];
    }
    if($_GET['Status']+1){
      $map['user_status']=$_GET['Status']+1;
    }
    //$map['AgentLevel']=array('gt','2');
    $map['IsSubAccount'] = 0;
    $userlist=M('agent')->where($map)->select();
    $levellist=M('agent_level')->select();
    $level=array();
    foreach ($levellist as $key => $value) {
      $level[$value['level']]=$value['title'];
    }
    $data=array();
    foreach ($userlist as $key => $value) {
      $user=array();
      $parent=M('agent')->find($value['parent']);
      $user["AgentID"]=$value['id'];
      $user["SuperCompanyID"]=$value['supercompanyid'];
      $SuperCompany=M('agent')->find($value['supercompanyid']);
      $user["SuperLoginName"]=$SuperCompany['user_login'];
      $user["LoginName"]=$value['user_login'];
      $user["NickName"]=$value['nickname'];

      $user["LevelName"]=$level[$value['agentlevel']];

      $user["DefaultCredit"]=fix_decimal(sprintf("%.1f",$value['money']), 4);
      $user["UsedCredit"]=$value['yymoney'];
      $user["DefaultCash"]=0;
      $user["UsedCash"]=0;

      $user['ContributeRatio']=$value['contributeratio'];

      $user["CompanyStatus"]=$value['user_status'];

      $user["ParentID"]=$value['parent'];
      $user["ParentName"]=$value['parent_user'];
      if($parent['agentlevel']<=1){
        $user["ParentCredit"]=fix_decimal(sprintf("%.1f", AGENT_BIG_AMOUNT), 4);
      }
      else{
        $user["ParentCredit"]=fix_decimal(sprintf("%.1f",$parent['money']), 4);
      }
      $user["ParentUsedCredit"]=fix_decimal($parent['yymoney'], 4);
      $user["ParentAgentLevel"]=fix_decimal($parent['agentlevel'], 4);
      $user["ParentLevelName"]=$level[$parent['agentlevel']];

      $user["LastLoginIP"]=$value['last_login_ip'];
      $user["LastLoginDt"]=$value['last_login_time'];
      $user["CreateDt"]=$value['create_time'];
      $user["UpdateDt"]=$value['update_time'];
      $user["Describe"]=$value['describe'];;

      $user["AgentRatio"]=fix_decimal($value['ratio'], 4);
      $user["ParentRatio"]=fix_decimal($value['pratio'], 4);
      $user["BaseRatio"]=fix_decimal($parent['ratio'], 4);

      $user["SubCompanyID"]=$value['subcompanyID'];

      $user["ParentCompanyType"]=$parent['companytype'];

      $map3 = [];
      $map3['parent']=$value['id'];
      $count=$list=M('user')->where($map3)->count();

      $user['MemCount']=$count+0;
      if($value['agentlevel']==5){
        $user['IsEndLevel']=true;
        $user['DownlineCount']='0';
      }
      else{
        $user['IsEndLevel']=false;
        $count=M('agent')->where($map3)->count();
        $user['DownlineCount']=$count+0;
      }
      $data[]=$user;
    }
    echo json_encode($data);
  }
  public function GetCompanyFixSettingByID(){
    header('Content-type: application/json');
    if($_GET['isMember']=='true'){
      $user=M('user');
    }
    else{
      $user=M('agent');
    }
    $agent=$user->find($_GET['AgentID']);
    $commission=json_decode($agent['commission'],true);
    $parent=M('agent')->find($agent['parent']);
    $pcommission=json_decode($parent['commission'],true);
    $playlist=M('played')->order('id desc')->select();
    $data=array();
    foreach ($playlist as $key => $value) {
      $play=array();
      $play['Multiple']=$value['groupid'];
      $play['SpaceBetween']='0.0010';
      $play['MinLimitOdds']='0.0';
      $play['Lottery']='1';
      $play['BetTypeID']=$value['bettypeid'];
      $play['BetTypeName']=$value['name'];
      $odds=explode('/', $value['bonusprop']);
      $odds2=explode('/', $value['cbonusprop']);
      $play['PCommission']=fix_decimal($pcommission[$value['bettypeid']]['commission']+0, 4);
      for($i=1;$i<5;$i++){
        $play['BLimitOdds'.$i]=fix_decimal($odds[($i-1)]+0, 4);
        $play['HLimitOdds'.$i]=fix_decimal($odds2[($i-1)]+0, 4);
        $play['PLimitOdds'.$i]=fix_decimal($play['BLimitOdds'.$i]-$play['HLimitOdds'.$i]*$play['PCommission'], 4);
        $play['LimitOdds'.$i]=fix_decimal($play['BLimitOdds'.$i]-$play['HLimitOdds'.$i]*$commission[$value['bettypeid']]['commission'], 4);
        $play['MinLimitOdds'.$i]=0;
      }
      $play['MaxCommission']=fix_decimal(($value['commission']-$play['PCommission']), 4);
      $play['Commission']=fix_decimal(($commission[$value['bettypeid']]['commission']-$play['PCommission']), 4);
      $play['EndCommission']=fix_decimal($value['commission'], 4);
      $play['BeginCommission']='0';
      $play['BackCommission']='0';
      $play['MaxLimitStore']=$commission[$value['bettypeid']]['MaxLimitStore']+0;

      if(!$commission[$value['bettypeid']]['MinLimitBetAmount']){
        $play['MinLimitBetAmount']=fix_decimal($value['minamount'], 4);
      }
      else{
        $play['MinLimitBetAmount']=fix_decimal($commission[$value['bettypeid']]['MinLimitBetAmount'], 4);
      }
      if(!$commission[$value['bettypeid']]['MaxLimitSigleBet']){
        $play['MaxLimitSigleBet']=fix_decimal($value['maxbet'], 4);
      }
      else{
        $play['MaxLimitSigleBet']=$commission[$value['bettypeid']]['MaxLimitSigleBet'];
      }
      if(!$commission[$value['bettypeid']]['MaxLimitItemBet']){
        $play['MaxLimitItemBet']=fix_decimal($value['maxcount'], 4);
      }
      else{
        $play['MaxLimitItemBet']=fix_decimal($commission[$value['bettypeid']]['MaxLimitItemBet'], 4);
      }


      if(!$pcommission[$value['bettypeid']]['PMinLimitBetAmount']){
        $play['PMinLimitBetAmount']=fix_decimal($value['minamount'], 4);
      }
      else{
        $play['PMinLimitBetAmount']=fix_decimal($pcommission[$value['bettypeid']]['PMinLimitBetAmount'], 4);
      }
      if(!$pcommission[$value['bettypeid']]['PMaxLimitSigleBet']){
        $play['PMaxLimitSigleBet']=fix_decimal($value['maxbet'], 4);
      }
      else{
        $play['PMaxLimitSigleBet']=$pcommission[$value['bettypeid']]['PMaxLimitSigleBet'];
      }
      if(!$pcommission[$value['bettypeid']]['PMaxLimitItemBet']){
        $play['PMaxLimitItemBet']=fix_decimal($value['maxcount'], 4);
      }
      else{
        $play['PMaxLimitItemBet']=fix_decimal($pcommission[$value['bettypeid']]['PMaxLimitItemBet'], 4);
      }
      $data[]=$play;
    }
    echo json_encode($data);
  }
  public function GetDownLineIDByParent(){
    header('Content-type: application/json');
    $map['parent']=$_GET['companyId'];
    $list=M('agent')->where($map)->select();
    $dataxx=array();
    foreach ($list as $key => $value) {
      $data=array();
      $data['CompanyType']=$value['companytype'];
      $data['ID']=$value['id'];
      $data['LevelStatus']=$value['agentlevel'];
      $data['LoginName']=$value['user_login'];
      $data['NickName']=$value['nickname'];
      $data['SubSidaryID']=$value['id'];
      $dataxx[]=$data;
    }
    echo json_encode($dataxx);
  }
  public function GetMemberByParentID(){
    header('Content-type: application/json');
    $agentid = $_GET['AgentID'];
    $agent = M('agent')->find($agentid);
    // deb($agent);
    if ($agent['issubaccount']) {
      $agentid = $agent['parent'];
    }
    // deb($agentid);
    //$map['parent']=$agentid;

    // $mapxx['path']=array('like','%-'.$agentid.'-%');
    // $agentlist=M('agent')->field('id')->where($mapxx)->select();
    // $listxx=array();
    // foreach($agentlist as $value){
    // $listxx[]=$value['id'];
    // }
    //$map['parent']=$agentid;//array('in',implode(',',$listxx));
    // $map['agentpath']=array('like','%-'.$agentid.'-%');
    // 只取子级
    $map['parent'] = $agentid;
    if($_GET['loginName']){
      $map['user_login']=$_GET['loginName'];
    }
    if($_GET['nickName']){
      $map['user_nicename']=$_GET['nickName'];
    }
    if($_GET['Status']+1){
      $map['user_status']=$_GET['Status']+1;
    }
    $userlist=M('user')->where($map)->select();

    $levellist=M('agent_level')->select();
    $level=array();
    foreach ($levellist as $key => $value) {
      $level[$value['level']]=$value['title'];
    }
    $data=array();
    foreach ($userlist as $key => $value) {
      $user=array();
      $parent=M('agent')->find($value['parent']);
      $user["MemberID"]=$value['id'];
      $user["SuperCompanyID"]=$value['supercompanyid'];

      $SuperCompany=M('agent')->find($parent['supercompanyid']);

      $user["SuperLoginName"]=$SuperCompany['user_login'];

      $user["LoginName"]=$value['user_login'];

      $user["NickName"]=$value['user_nicename'];

      $user["DefaultCredit"]=fix_decimal(sprintf("%.1f",$value['money']), 4);

      $user["UsedCredit"]=fix_decimal($value['yymoney'], 4);

      $user["DefaultCash"]=0;
      $user["UsedCash"]=0;
      $user["MemberStatus"]=$value['user_status'];

      $user["ParentID"]=$value['parent'];
      $user["ParentName"]=$parent['user_login'];

      $user["ParentDefaultCredit"]=sprintf("%.1f",$parent['money']);
      $user["ParentUsedCredit"]=$parent['yymoney'];

      $user["ParentAgentLevel"]=$parent['agentlevel'];
      $user["ParentLevelName"]=$level[$parent['agentlevel']];

      $user["LastLoginIP"]=$value['last_login_ip'];
      $user["LastLoginDt"]=$value['last_login_time'];

      $user["CreateDt"]=$value['create_time'];
      $user["UpdateDt"]=$value['update_time'];

      $user["Describe"]=$value['describe'];;
      $user["Ratio"]=fix_decimal($value['ratio'], 4);

      $user["SubCompanyID"]=$value['subcompanyID'];
      $user["ParentCompanyType"]=$parent['companytype'];
      if($this->agent['agentlevel']<=3){
        $user["sflogin"]=1;
      }
      else{
        $user["sflogin"]=0;
      }
      $data[]=$user;
    }
    echo json_encode($data);
  }
  public function CompanySettingAdd(){
    $this->display();
  }
  public function TempLate(){
    $this->display();
  }
  public function DayReportType(){
    $this->display();
  }
  public function MonthReportType(){
    $this->display();
  }
  public function Contribution(){
    $this->display();
  }
  public function ReportWeekContribute(){
    $this->display();
  }
  public function MemberAdd(){
    $this->display();
  }
  public function info(){
    $this->display();
  }
  public function ChangePwd(){
    $this->display();
  }
  //列表页面
  public function SubAccount(){
    $this->display();
  }
  //添加页面
  public function SubAccountAdd(){
    $this->display();
  }
  //添加方法
  public function AddSubAccount(){

    if($_POST['password']!=$_POST['password1']){
      $this->ejson('两次密码不一致');        
    }

    $data['IsSubAccount'] = 1;
    $data['parent'] = $this->agent['id'];
    $data['parent_user'] = $this->agent['user_login'];
    $data['CompanyType'] = $this->agent['companytype'];
    $data['create_time'] = date('Y-m-d H:i:s');
    $data['update_time'] = date('Y-m-d H:i:s');
    $data['user_status'] = 1;
    $data['companytype'] = $this->agent['companytype'];
    $data['AgentLevel'] = $this->agent['agentlevel'];

    $data['user_login'] = $_POST['LoginName']; //帐号
    $data['nickname'] = $_POST['NickName']; //昵称
    $data['user_pass'] = md5($_POST['password']); //密码
    $data['describe'] = $_POST['Describe']; //备注
    $data['CompanyStatus'] = $_POST['Status']; //状态
    $data['IsChildShowReport'] = $_POST['IsChildShowReport']=='true' ? 1 : 0; //是否查看下级报表
    $data['menu'] = $_POST['menu'];

    if(M('agent')->where(array('user_login'=>$_POST['LoginName']))->count()){
      $this->ejson('用户名已存在');
    }
    /*
       if(M('agent')->where(array('nickname'=>$_POST['NickName']))->count()){
       $this->ejson('昵称已存在');
       }
     */

    $res=M('agent')->add($data);
    if($res){
      header('Content-type: application/json');
      $this->addlog($this->agent['user_login'],$data['user_login'],'添加子帐号');
      $save['SubCompanyID'] = $res;
      $save['SuperCompanyID'] = $res;
      $save['path']=$this->agent['path'].'-'.$res.'-';
      M('agent')->where(array('id'=>$res))->save($save);
      $msg['status']=true;
      $msg['info']="添加子帐号成功";
      echo json_encode($msg);
    }else{
      $this->ejson('添加失败');
    }

  }

  //下级列表
  public function GetSubAccountList(){
    $list = array();

    $map['parent_user'] = $this->agent['user_login'];
    $map['IsSubAccount'] = 1;
    $list = M('agent')->where($map)->select();
    if($list)
      foreach($list as $k=>$vo){
        $list[$k]['CompanyID'] = $vo['subcompanyid'];
        $list[$k]['CompanyStatus'] = $vo['companystatus'];
        $list[$k]['CompanyType'] = $vo['companytype'];
        $list[$k]['CreateDt'] = $vo['create_time'];
        $list[$k]['Describe'] = $vo['describe'];
        $list[$k]['IsChildShowReport'] = $vo['ischildshowreport'] ? true : false; //是否查看下级报表
        $list[$k]['IsSubAccount'] = $vo['issubaccount'];
        $list[$k]['LastLoginIP'] = $vo['last_login_ip'];
        $list[$k]['LoginName'] = $vo['user_login'];
        $list[$k]['LoginPwd'] = $vo['user_pass'];
        $list[$k]['MenuId'] = $vo['menu'];
        $list[$k]['NickName'] = $vo['nickname'];
        $list[$k]['ParentID'] = $vo['parent'];
        $list[$k]['ParentName'] = $vo['parent_user'];
        $list[$k]['UpdateDt'] = $vo['update_time'];
      }
    echo json_encode($list);
  }
  //权限列表
  public function GetJurisdictionList(){
    header('Content-type: application/json');
    echo '[{"DropListMenus":[],"MenuInfo":{"ID":4125,"MenuName":"首页","MenuKey":"/TempLate/Homes","ParentMenuID":0,"IsEnabled":true,"Describe":"/Home/Role","IcoName":"","OrderIndex":0,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":null,"IsChildMenu":false},{"DropListMenus":[],"MenuInfo":{"ID":5130,"MenuName":"日报表（期数）","MenuKey":"/Report/DayReportPeriods","ParentMenuID":3,"IsEnabled":true,"Describe":"日报表按照期数显示","IcoName":"","OrderIndex":0,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"报表","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":5131,"MenuName":"期数分类账","MenuKey":"/Classify/ReportClassify","ParentMenuID":2,"IsEnabled":true,"Describe":"按照期数查询分类账的实占合计","IcoName":"","OrderIndex":0,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"分类帐","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":18,"MenuName":"日分类帐","MenuKey":"/Classify/index","ParentMenuID":2,"IsEnabled":true,"Describe":"日分类帐","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"分类帐","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":26,"MenuName":"日(结)报表","MenuKey":"/Report/Index","ParentMenuID":3,"IsEnabled":true,"Describe":"日报表","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"报表","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":32,"MenuName":"基本资料","MenuKey":"/BasicInformation/Index","ParentMenuID":8,"IsEnabled":true,"Describe":"基本资料","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"设置","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":96,"MenuName":"新增下级","MenuKey":"/NewSubordinate/Add","ParentMenuID":97,"IsEnabled":true,"Describe":"","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"下级管理","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":106,"MenuName":"基础日志","MenuKey":"/Logs/Index","ParentMenuID":7,"IsEnabled":true,"Describe":"基础日志","IcoName":"fa-dashboard","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"日志","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":125,"MenuName":"总货明细","MenuKey":"/Gross/Index","ParentMenuID":1,"IsEnabled":true,"Describe":"总货明细","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"总货明细","IsChildMenu":true},{"DropListMenus":[{"ID":125,"MenuName":"总货明细","MenuKey":"/Gross/Index","ParentMenuID":1,"IsEnabled":true,"Describe":"总货明细","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":126,"MenuName":"中奖明细","MenuKey":"/Gross/IsWin","ParentMenuID":1,"IsEnabled":true,"Describe":"中奖明细","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":2125,"MenuName":"拦货明细","MenuKey":"/Gross/RatioDetail","ParentMenuID":1,"IsEnabled":true,"Describe":"拦货明细","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}],"MenuInfo":{"ID":1,"MenuName":"总货明细","MenuKey":"/Gross/Index","ParentMenuID":0,"IsEnabled":true,"Describe":"总货明细","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":true,"ParentName":null,"IsChildMenu":false},{"DropListMenus":[],"MenuInfo":{"ID":27,"MenuName":"月(结)报表","MenuKey":"/Report/MonthReport","ParentMenuID":3,"IsEnabled":true,"Describe":"月报表","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"报表","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":29,"MenuName":"账户列表","MenuKey":"/NewSubordinate/Index","ParentMenuID":97,"IsEnabled":true,"Describe":"账户列表","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"下级管理","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":107,"MenuName":"拦货金额日志","MenuKey":"/Logs/LimitStoreLog","ParentMenuID":7,"IsEnabled":true,"Describe":"拦货金额日志","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"日志","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":126,"MenuName":"中奖明细","MenuKey":"/Gross/IsWin","ParentMenuID":1,"IsEnabled":true,"Describe":"中奖明细","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"总货明细","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":1125,"MenuName":"月分类帐","MenuKey":"/Classify/MonthReportType","ParentMenuID":2,"IsEnabled":true,"Describe":"月分类帐","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"分类帐","IsChildMenu":true},{"DropListMenus":[{"ID":18,"MenuName":"日分类帐","MenuKey":"/Classify/index","ParentMenuID":2,"IsEnabled":true,"Describe":"日分类帐","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":19,"MenuName":"贡献度","MenuKey":"/Classify/Contribution","ParentMenuID":2,"IsEnabled":true,"Describe":"贡献度","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":1125,"MenuName":"月分类帐","MenuKey":"/Classify/MonthReportType","ParentMenuID":2,"IsEnabled":true,"Describe":"月分类帐","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":5131,"MenuName":"期数分类账","MenuKey":"/Classify/ReportClassify","ParentMenuID":2,"IsEnabled":true,"Describe":"按照期数查询分类账的实占合计","IcoName":"","OrderIndex":0,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":5133,"MenuName":"周贡献度","MenuKey":"/Classify/ReportWeekContribute","ParentMenuID":2,"IsEnabled":true,"Describe":"按照每周显示贡献度信息","IcoName":"","OrderIndex":5,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}],"MenuInfo":{"ID":2,"MenuName":"分类帐","MenuKey":"/Classify/ReportClassify","ParentMenuID":0,"IsEnabled":true,"Describe":"分类帐","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":true,"ParentName":null,"IsChildMenu":false},{"DropListMenus":[],"MenuInfo":{"ID":86,"MenuName":"子账号","MenuKey":"/SubAccount/Index","ParentMenuID":8,"IsEnabled":true,"Describe":"子账号列表","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"设置","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":111,"MenuName":"会员列表","MenuKey":"/Member/Index","ParentMenuID":97,"IsEnabled":true,"Describe":"","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"下级管理","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":2125,"MenuName":"拦货明细","MenuKey":"/Gross/RatioDetail","ParentMenuID":1,"IsEnabled":true,"Describe":"拦货明细","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"总货明细","IsChildMenu":true},{"DropListMenus":[{"ID":26,"MenuName":"日(结)报表","MenuKey":"/Report/Index","ParentMenuID":3,"IsEnabled":true,"Describe":"日报表","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":27,"MenuName":"月(结)报表","MenuKey":"/Report/MonthReport","ParentMenuID":3,"IsEnabled":true,"Describe":"月报表","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":5129,"MenuName":"周报表","MenuKey":"/Report/WeeklyReport","ParentMenuID":3,"IsEnabled":true,"Describe":"周报表","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":5130,"MenuName":"日报表（期数）","MenuKey":"/Report/DayReportPeriods","ParentMenuID":3,"IsEnabled":true,"Describe":"日报表按照期数显示","IcoName":"","OrderIndex":0,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}],"MenuInfo":{"ID":3,"MenuName":"报表","MenuKey":"/Report/Index","ParentMenuID":0,"IsEnabled":true,"Describe":"报表","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":true,"ParentName":null,"IsChildMenu":false},{"DropListMenus":[],"MenuInfo":{"ID":19,"MenuName":"贡献度","MenuKey":"/Classify/Contribution","ParentMenuID":2,"IsEnabled":true,"Describe":"贡献度","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"分类帐","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":124,"MenuName":"新增会员","MenuKey":"/Member/Add","ParentMenuID":97,"IsEnabled":true,"Describe":"新增会员","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"下级管理","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":3125,"MenuName":"打包拦货白单数据","MenuKey":"/Gross/BaleWhiteSingle","ParentMenuID":1,"IsEnabled":true,"Describe":"打包拦货白单数据","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"总货明细","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":5129,"MenuName":"周报表","MenuKey":"/Report/WeeklyReport","ParentMenuID":3,"IsEnabled":true,"Describe":"周报表","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"报表","IsChildMenu":true},{"DropListMenus":[{"ID":29,"MenuName":"账户列表","MenuKey":"/NewSubordinate/Index","ParentMenuID":97,"IsEnabled":true,"Describe":"账户列表","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":96,"MenuName":"新增下级","MenuKey":"/NewSubordinate/Add","ParentMenuID":97,"IsEnabled":true,"Describe":"","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":111,"MenuName":"会员列表","MenuKey":"/Member/Index","ParentMenuID":97,"IsEnabled":true,"Describe":"","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":124,"MenuName":"新增会员","MenuKey":"/Member/Add","ParentMenuID":97,"IsEnabled":true,"Describe":"新增会员","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}],"MenuInfo":{"ID":97,"MenuName":"下级管理","MenuKey":"/NewSubordinate/Index","ParentMenuID":0,"IsEnabled":true,"Describe":"代理","IcoName":"","OrderIndex":5,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":true,"ParentName":null,"IsChildMenu":false},{"DropListMenus":[],"MenuInfo":{"ID":92,"MenuName":"拦货金额","MenuKey":"/BasicInformation/Commission","ParentMenuID":8,"IsEnabled":true,"Describe":"拦货金额","IcoName":"","OrderIndex":5,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"设置","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":5133,"MenuName":"周贡献度","MenuKey":"/Classify/ReportWeekContribute","ParentMenuID":2,"IsEnabled":true,"Describe":"按照每周显示贡献度信息","IcoName":"","OrderIndex":5,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"分类帐","IsChildMenu":true},{"DropListMenus":[],"MenuInfo":{"ID":4,"MenuName":"开奖结果","MenuKey":"/DrawNumber/Index","ParentMenuID":0,"IsEnabled":true,"Describe":"开奖号码","IcoName":"","OrderIndex":6,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":null,"IsChildMenu":false},{"DropListMenus":[],"MenuInfo":{"ID":33,"MenuName":"修改密码","MenuKey":"/ChangePassword/Index","ParentMenuID":8,"IsEnabled":true,"Describe":"修改密码","IcoName":"","OrderIndex":6,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":false,"ParentName":"设置","IsChildMenu":true},{"DropListMenus":[{"ID":106,"MenuName":"基础日志","MenuKey":"/Logs/Index","ParentMenuID":7,"IsEnabled":true,"Describe":"基础日志","IcoName":"fa-dashboard","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":107,"MenuName":"拦货金额日志","MenuKey":"/Logs/LimitStoreLog","ParentMenuID":7,"IsEnabled":true,"Describe":"拦货金额日志","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}],"MenuInfo":{"ID":7,"MenuName":"日志","MenuKey":"/Logs/Index","ParentMenuID":0,"IsEnabled":true,"Describe":"日志","IcoName":"","OrderIndex":8,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":true,"ParentName":null,"IsChildMenu":false},{"DropListMenus":[{"ID":32,"MenuName":"基本资料","MenuKey":"/BasicInformation/Index","ParentMenuID":8,"IsEnabled":true,"Describe":"基本资料","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":33,"MenuName":"修改密码","MenuKey":"/ChangePassword/Index","ParentMenuID":8,"IsEnabled":true,"Describe":"修改密码","IcoName":"","OrderIndex":6,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":86,"MenuName":"子账号","MenuKey":"/SubAccount/Index","ParentMenuID":8,"IsEnabled":true,"Describe":"子账号列表","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":92,"MenuName":"拦货金额","MenuKey":"/BasicInformation/Commission","ParentMenuID":8,"IsEnabled":true,"Describe":"拦货金额","IcoName":"","OrderIndex":5,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}],"MenuInfo":{"ID":8,"MenuName":"设置","MenuKey":"/BasicInformation/Index","ParentMenuID":0,"IsEnabled":true,"Describe":"设置","IcoName":"","OrderIndex":10,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},"IsDropMenu":true,"ParentName":null,"IsChildMenu":false}]'; 
  }
  public function GetCompanyBySuperID(){
    echo '[]';  
  }
  //修改密码
  public function EditSubAccountPassword(){
    header('Content-type: application/json');
    if($_POST['password']!=$_POST['password1']){
      $this->ejson('两次密码输入不一样');
    }
    $save['user_pass']=md5($_POST['password']);
    M('agent')->where(array('user_login'=>$_POST['LoginName']))->save($save);
    $this->addlog($this->agent['user_login'],$_POST['LoginName'],'修改密码');
    $data['status']=true;
    $data['info']="修改成功";
    echo json_encode($data); 
  }
  //修改帐号
  public function EditSubAccount(){

    $data['id'] = $_POST['id'];
    $data['update_time'] = date('Y-m-d H:i:s');
    $data['nickname'] = $_POST['NickName']; //昵称
    $data['describe'] = $_POST['Describe']; //备注
    $data['CompanyStatus'] = $_POST['Status']; //状态
    $data['IsChildShowReport'] = $_POST['IsChildShowReport']=='true' ? 1 : 0; //是否查看下级报表
    $data['menu'] = $_POST['menu'];

    $res=M('agent')->where(array('id'=>$_POST['id']))->save($data);
    if($res){
      header('Content-type: application/json');
      $this->addlog($this->agent['user_login'],$_POST['LoginName'],'修改子帐号');
      $msg['status']=true;
      $msg['info']="修改子帐号成功";
      echo json_encode($msg);
    }else{
      $this->ejson('修改失败');
    }
  }
  //删除子帐号
  public function subChangePwd(){

  }
  public function ChangePassword(){
    $this->display();
  }
  public function MonthReport(){
    $this->display();
  }
  public function LimitStoreLog(){
    $this->display();
  }
  public function DayReportPeriods(){
    $this->display();
  }
  public function OnlineNumber(){
    $this->display();
  }
  public function WeeklyReport(){
    $this->display();
  }

  public function Report(){
    $this->display();
  }

  public function Logs(){
    $this->display();
  }
  public function ReportClassify(){
    $this->display();
  }
  public function RatioDetail(){
    $this->display();
  }
  public function  BaleWhiteSingle(){
    $this->display();
  }
  public function DrawNumber(){
    $this->display();
  }
  public function Gross(){
    $this->display();
  }
  public function IsWin(){
    $this->display();
  }
  public function Member(){
    $this->display();
  }

  public function BasicInformation(){
    $this->display();
  }

  public function main(){
    $this->display();
  }

  public function online(){

    header('Content-type: application/json');
    session_start();
    $agent = M('agent')->find($this->agent['id']);

    // 禁用则直接踢出
    $is_forbidden = false;
    if ($agent['user_status'] != 1) {
        $is_forbidden = true;
    } else {
      // 逐级检查上级
      $path = get_array_unique_id_list(explode('-', $agent['path']));
      foreach ($path as $tmp_parent_aid) {
          $tmp_parent = M("agent")->find($tmp_parent_aid);
          if ($tmp_parent['user_status'] != 1) {
            $is_forbidden = true;
            break;
          }
      }
    }
    $is_forbidden && $_SESSION['last_login_time'] = time();

    if ($_SESSION['last_login_time'] != $agent['last_login_time']) {
      $data['status'] = false;
      $data['isCheckOnline'] = true;
      $data['info'] = $is_forbidden ? '您已经被踢出，账号或上级账号被锁住' : '您已经被踢出，请重新登录！';
      session_write_close();
    } else {
      $data['data'] = time();
      $data['IsChildShowReport'] = $agent['issubaccount'] == 0 || $agent['ischildshowreport'] ? 'true' : 'false';
    }
    echo json_encode($data);exit;
    /*
       $data =array();
       $data['token'] = time();
       $_SESSION['agent_token'] = $data['token'];
       $res = M('agent')->where(array('id'=>$this->agent['id']))->save($data);
       if ($res) {
       $r = $data['token'];
       echo json_encode(array('data'=>$r));
       }
     */
    //echo json_encode(array('data'=>time()));
  }
  public function DownlineAgent(){
    $this->display();
  }
  public function GetLastPeriods(){
    header('Content-type: application/json');
    session_start();
    //if($_SESSION['agent_token']!=$this->agent['token']) {
    if($_SESSION['last_login_time']!=$this->agent['last_login_time']){
      $data['status']=false;
      $data['isCheckOnline']=true;
      $data['info']='您已经被踢出，请重新登录！';
      session_write_close();
    }
    else{
      $_SESSION['agent_token']=time();
      session_write_close();
      $ssave['token']= $_SESSION['agent_token'];
      M('agent')->where(array('id'=>$this->agent['id']))->save($ssave);
      $data['CompanyID']=1;
      $type=M('type')->where(array('id'=>'1'))->find();
      $lottery_interval = get_lottery_interval($type);
      $now=getnow('1',$type['data_ftime']);
      $data['DrawDt']=date('Y/m/d '.$now['now'],time()+$now['day']*3600*24);
      $data['CloseDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt'])-$type['data_ftime']);
      $data['OpenDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt']) - $lottery_interval);
      $data['PeriodsNumber']=date('ymd',time()+$now['day']*3600*24).$now['hm'];
      $data['ID']=$data['PeriodsNumber'];
      $data['status']=true;
      $data['info']='获取成功';
      $dataxx=M('data')->order('time desc')->find();
      $data['dw']['c_t']=$dataxx['number'];
      $data['dw']['c_d']=date('Y/m/d H:i:s',$dataxx['time']);
      $data['dw']['c_r']=$dataxx['data'];
      $data['nowDateTime']=date('Y/m/d H:i:s',time());

      if(time()>strtotime($data['OpenDt'])){
        $data['PeriodsStatus']=(int)$type['enable']; 
      }
      else{
        $data['PeriodsStatus']=0;
      }
    }
    echo json_encode($data);//echo '{"CompanyID":"16969","ID":"285927","CloseDt":"2017/7/23 9:59:00","DrawDt":"2017/7/23 10:00:00","OpenDt":"2017/7/23 9:50:00","PeriodsStatus":0,"status":true,"PeriodsNumber":"20170723024","info":"获取成功","nowDateTime":"2017-7-23 9:14:40","dw":{"c_t":"20170723023","c_d":"2017-07-23 03:00:07","c_r":"6,8,3,9,3"}}';
  }
  public function GetBaleWhiteSingle(){
    $type=M('type')->where(array('id'=>'1'))->find();
    $lottery_interval = get_lottery_interval($type);
    $now=getnow('1',$type['data_ftime']);
    $data['DrawDt']=date('Y/m/d '.$now['now'],time()+$now['day']*3600*24);
    $data['CloseDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt'])-$type['data_ftime']);
    $data['OpenDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt']) - $lottery_interval);
    $data['PeriodsNumber']=date('ymd',time()+$now['day']*3600*24).$now['hm'];
    $data['ID']=$data['PeriodsNumber'];
    $data['status']=true;
    $data['info']='获取成功';
    $dataxx=M('data')->order('time desc')->find();
    $data['dw']['c_t']=$dataxx['number'];
    $data['dw']['c_d']=date('Y/m/d H:i:s',$dataxx['time']);
    $data['dw']['c_r']=$dataxx['data'];
    $data['nowDateTime']=date('Y/m/d H:i:s',time());

    if(time()>strtotime($data['OpenDt'])){
      $data['PeriodsStatus']=(int)$type['enable']; 
    }
    else{
      $data['PeriodsStatus']=0;
    }

    echo '{
      "Name": "report_'.$data['PeriodsNumber'].'_class.zip",
        "Time": "2018-12-18 13:10:56",
        "Size": 0.021484375,
        "Url": "/WhiteSinglePackage/kk2567-Package/report_20181218044_class.zip"
    }';
  }
  public function  GetUserLoginNoticeByType(){
    header('Content-type: application/json');
    $map['term_id']='8';
    $term=M('term_relationships')->where($map)->order('object_id desc')->find();
    $map2['id']=$term['object_id'];
    $post=M('posts')->where($map2)->find();
    if($post){
      echo '[
        "636370464405830098",
        [
        {
          "ID": 53,
          "Title": "敬请注意",
          "ShowType": 1,
          "TargetObject": 2,
          "AdminId": 16969,
          "AdminLoginName": "ff77",
          "AdminNickName": "公司",
          "Detail": ' . enjson($post['post_content']) . ',
          "BeginDt": "2017-07-30 18:31:00",
          "EndDt": "2022-08-05 19:01:00",
          "CreateDt": "0001-01-01 00:00:00",
          "UpdateDt": "2017-07-30 18:44:37",
          "IsSpecified": false,
          "CompanyType": 1
        }
        ]
      ]';
    }
    else{
      echo '[
        "636370464405830098",]';
    }
  }
  }
