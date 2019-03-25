<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class ReportController extends HomebaseController {

    protected $user_model;
    
    public function __construct() {
        parent::__construct();
         $this->check_login();
        $this->user_model = M('user');//打款凭证
    }
    public function DayReport(){
        $this->display();
    }
    public function WeekReport(){
        $this->display();
    }
    public function MonthReport(){
        $this->display();
    }
    public function GetReportMember(){
       header('Content-type: application/json');
       if($_GET['ReportStatus']==0){
        if($_GET['LastMonth']=='false'){
             if(strtotime(date('Y-m-d 02:00:00',time()))<time()){
              $start=date('Y-m-d 02:00:00',time());
              $end=date('Y-m-d 02:00:00',time()+24*3600);
            }
            else{
              $start=date('Y-m-d 02:00:00',time()-24*3600);
              $end=date('Y-m-d 02:00:00',time());
            }
        }
        else{
           if(strtotime(date('Y-m-d 02:00:00',time()))<time()){
              $start=date('Y-m-d 02:00:00',time()-24*3600);
              $end=date('Y-m-d 02:00:00',time());
            }
            else{
              $start=date('Y-m-d 02:00:00',time()-48*3600);
              $end=date('Y-m-d 02:00:00',time()-24*3600);
            }
        }
       }

       if($_GET['ReportStatus']==1){
          $week=array('6','0','1','2','3','4','5');
          if($_GET['LastMonth']=='false'){

          if(strtotime(date('Y-m-d 02:00:00',time()))<time()){
          $start=date('Y-m-d 02:00:00',time()-$week[date('w')]*24*3600);
          $end=date('Y-m-d 02:00:00',time()-$week[date('w')]*24*3600+7*24*3600);
          }
          else{
            $start=date('Y-m-d 02:00:00',time()-$week[date('w')]*24*3600-24*3600);
            $end=date('Y-m-d 02:00:00',time()-$week[date('w')]*24*3600+6*24*3600);
          }
        }
        else{
          if(strtotime(date('Y-m-d 02:00:00',time()))<time()){
            $start=date('Y-m-d 02:00:00',time()-date('w')*24*3600-6*24*3600);
            $end=date('Y-m-d 02:00:00',time()-date('w')*24*3600+24*3600);
          }
          else{
            $start=date('Y-m-d 02:00:00',time()-date('w')*24*3600-7*24*3600);
            $end=date('Y-m-d 02:00:00',time()-date('w')*24*3600);
          }
        }
       }
       if($_GET['ReportStatus']==2){
          if($_GET['LastMonth']=='false'){
          $start=date('Y-m-1 02:00:00',time());
          $end=date('Y-m-1 02:00:00',strtotime('+1 Month'));
        }
        else{
          $end=date('Y-m-1 02:00:00',time());
          $start=date('Y-m-1 02:00:00',strtotime('-1 Month'));
        }
       }
       $where['uid']=$this->user[id];
       $where['sftm']=0;
       $where['BetDt']=array('between',$start.','.$end);
       $where['zt']=0;
       $list=M('bets')->field('sum(betamount) as BetAmount,sum(count) as BetCount,sum(profitandLoss) as SumProfitAndLoss,sum(winloss) as SumWinLoss,sum(backcomm) as SumBackComm')->where($where)->select();
       $where['zt']=1;
       $list1=M('bets')->field('sum(betamount) as BetAmount,sum(count) as BetCount,sum(profitandLoss) as SumProfitAndLoss,sum(winloss) as SumWinLoss,sum(backcomm) as SumBackComm')->where($where)->select();
       $data=array();
       $data['ReportStatus']=$_GET['ReportStatus'];
       $data['RBeginDt']=$start;
       $data['REndDt']=$end;
       $data['list']['0']['MemberID']=$this->user['id'];
        $data['list']['0']['MemberBetCount']=(float)($list['0']['betcount']+$list1['0']['betcount']);
        $data['list']['0']['MemBetAmt']=(float)($list['0']['betamount']+$list1['0']['betamount']);
        $data['list']['0']['MemWL']=(float)($list1['0']['sumprofitandloss']+$list1['0']['sumbackcomm']);
        echo json_encode($data);
    }
}
