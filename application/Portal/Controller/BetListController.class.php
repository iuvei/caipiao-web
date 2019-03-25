<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class BetListController extends HomebaseController {

    protected $user_model;
    
    public function __construct() {
        parent::__construct();
         $this->check_login();
        $this->user_model = M('user');//打款凭证
    }
    public function Index(){
        $this->display();
    }
    public function  GetBetInfoByMemID(){
      header('Content-type: application/json');
      $now=getnow('1');
        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];
      $where=array();
        if(!$_GET['PeriodsNumber']){
         $where['PeriodsNumber']=$PeriodsNumber;
        }
        else{
            $where['PeriodsNumber']=$_GET['PeriodsNumber'];
        }
                   if($_GET['IsWin']=='true'){
              $where['WinLoss']=array('gt',0);
           }
           if($_GET['IsShow']=='true'){
              $where['playedId']=array('in','14,15,16');
           }
           if($_GET['BetNumber']){
                $where['BetNumber']=$_GET['BetNumber'];
           }
           if($_GET['BetTypeID']){
                $mapss['betTypeId']=$_GET['BetTypeID'];
                $play=M('played')->where($mapss)->find();
                $where['playedId']=$play['id'];
           }
           if($_GET['QueryStatus']==0){
              if($_GET['BeginNum']>0){
                $start=$_GET['BeginNum'];
              }
              else{
                $start=0;
              }
              if($_GET['EndNum']>0){
                $end=$_GET['EndNum'];
              }
              else{
                  $end='99999999999';
              }
              $where['BetAmount']=array('between',$start.','.$end);
           }
           if($_GET['QueryStatus']==1){
              if($_GET['BeginNum']>0){
                $start=$_GET['BeginNum'];
              }
              else{
                $start=0;
              }
              if($_GET['EndNum']>0){
                $end=$_GET['EndNum'];
              }
              else{
                  $end=99999999999;
              }
              $where['Odds']=array('between',$start.','.$end);
           }
           if($_GET['QueryStatus']==2){
              $where['sftm']=1;
           }
           if(!$_GET['PageNum']){
              $_GET['PageNum']=1;
           }
      $count=M('userbet'.$this->user['id'])->where($where)->count();
      $PageCount=ceil($count/20);
      $betlist=M('userbet'.$this->user['id'])->where($where)->limit((20*($_GET['PageNum']-1)).',20')->select();
      $data['PageCount']=$PageCount;
      $list=array();
      foreach ($betlist as $key => $value) {
        $list[$key]['BetIP']=$value['betip'];
        $list[$key]['LsBetIds']=$value['periodsnumber'].$value['id'];
        $list[$key]['LotteryID']=$value['typeid'];
        $list[$key]['MemberID']=$value['uid'];
        $list[$key]['BetDetailID']=$value['id'];
        $list[$key]['BetInfoID']=$value['betinfoid'];
        $list[$key]['PeriodsNumber']=$value['periodsnumber'];
        $list[$key]['BetDt']=$value['betdt'];
        $list[$key]['BetNumber']=$value['betnumber'];
        $list[$key]['BetAmount']=fix_decimal($value['betamount'], 4);
        $list[$key]['BetTypeID']=(int)$value['playedid'];
        $list[$key]['Odds']=$value['odds'];
        $list[$key]['WinLoss']=fix_decimal($value['winloss'], 4);
        $list[$key]['ProfitAndLoss']=fix_decimal($value['profitandloss'], 4);
        $list[$key]['BackComm']=fix_decimal($value['backcomm'], 4);
        if($value['zt']==0){
        $list[$key]['BetStatus']=(int)$value['sftm'];
        }
        else{
          $list[$key]['BetStatus']=2;
        }
        $list[$key]['UpdateDt']=$value['updatedt'];
        $list[$key]['BetWayID']=$value['betwayid'];
        $list[$key]['BackBetIP']=$value['backbetip'];
        $list[$key]['IsHotNum']=(boolean)$value['ishotnum'];
      }
      $data['list']=$list;
      echo json_encode($data);
    }
}
