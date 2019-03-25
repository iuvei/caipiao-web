<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class ProfileController extends HomebaseController {

    protected $user_model;
    
    public function __construct() {
        parent::__construct();
         $this->check_login();
        $this->user_model = M('user');//打款凭证
    }
    public function Index(){
        $this->display();
    }
    public function ModifyMemberMode(){
        header('Content-type: application/json');
        $save=array();
        if($_POST['IsEnter']=='true'){
            $save['isenter']=1;
        }
        else{
            $save['isenter']=0;
        }
        if($_POST['IsShowLottory']=='true'){
            $save['isshowlottory']=1;
        }
        else{
            $save['isshowlottory']=0;
        }
        if($_POST['IsOddsUse']=='true'){
            $save['isoddsuse']=1;
        }
        else{
            $save['isoddsuse']=0;
        }
        M('user')->where(array('user_login'=>$this->user_login))->save($save);
        $data['status']=true;
      $data['info']="修改成功";
      echo json_encode($data);
    }
    public function ModifyMemberBetTypeSetting(){
        header('Content-type: application/json');
        $user=M('user');
        $map['user_login']=$this->user_login; 
        $agent=$user->where($map)->find();
        $pcommission=json_decode($agent['commission'],true);
        $list=json_decode($_POST['list'],true);
        if($agent['sjcommission']){
        $list2=json_decode($agent['sjcommission'],true);
        }
        else{
          $list2=array();
        }
        foreach ($list as $key => $value) {
          $list2[$value['BetTypeID']]['Commission']=$value['Commission']+$pcommission[$value['BetTypeID']]['Commission'];
          $list2[$value['BetTypeID']]['sjCommission']=$value['Commission'];
        }
        $save['sjcommission']=json_encode($list2);
        $user->where($map)->save($save);
        $data['status']=true;
      $data['info']="修改成功";
      echo json_encode($data);
    }
    public function GetMemberCommission(){
        header('Content-type: application/json');
        $user=M('user');
        $agent=$user->find($this->uid);
        $commission=json_decode($agent['sjcommission'],true);
        $pcommission=json_decode($agent['commission'],true);
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
                $play['LimitOdds'.$i]=fix_decimal($play['BLimitOdds'.$i]-$play['HLimitOdds'.$i]*$commission[$value['bettypeid']]['commission'], 4);
                $play['MinLimitOdds'.$i]=0;
              }
              $play['MaxCommission']=fix_decimal(($value['commission']-$play['PCommission']), 4);

              $play['Commission']=fix_decimal(($commission[$value['bettypeid']]['Commission']-$play['PCommission']), 4);

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
                  $play['PMaxLimitSigleBet']=fix_decimal($pcommission[$value['bettypeid']]['MaxLimitSigleBet'], 4);
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
}
