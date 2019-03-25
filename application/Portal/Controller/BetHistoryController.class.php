<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class BetHistoryController extends HomebaseController {

    protected $user_model;
    
    public function __construct() {
        parent::__construct();
         $this->check_login();
        $this->user_model = M('user');//打款凭证
    }
    public function Index(){
        $this->display();
    }
    public function GetHistoryBetInfo(){
      header('Content-type: application/json');
      if (!empty($_GET['BeginDt']) && !empty($_GET['EndDt'])) {
         $start=$_GET['BeginDt'];
         $end=$_GET['EndDt'];
      } else {
        if($_GET['isSeach']=='false'){
            if(strtotime(date('Y-m-d 06:00:00',time()))<time()){
              $start=date('Y-m-d 06:00:00',time());
              $end=date('Y-m-d 06:00:00',time()+24*3600);
            }
            else{
              $start=date('Y-m-d 06:00:00',time()-24*3600);
              $end=date('Y-m-d 06:00:00',time());
            }
        } 
      }
        $where['BetDt']=array(array('gt',$start),array('lt',$end));
        $where['uid']=$this->user['id'];
        //$where['count']=array('gt',0);
        header('X-DEBUG-COND: ' . enjson($where));
        $list=M('bets')->where($where)->group('PeriodsNumber')->order('PeriodsNumber desc')->select();
        $dataxx=array();
        foreach ($list as $key => $value) {
           $data=array();
           $bet=M('bets')->field('sum(betamount) as BetAmount,sum(count) as BetCount,sum(profitandLoss) as SumProfitAndLoss,sum(winloss) as SumWinLoss,sum(backcomm) as SumBackComm,max(zt) as zt')->where(array('PeriodsNumber'=>$value['periodsnumber'],'uid'=>$this->user['id']))->select();
           $data['OpenDt']=date('Y-m-d',strtotime($value['betdt']));
           $data['CompanyID']=1;
           $data['PeriodsNumber']=$value['periodsnumber'];
           $data['BetCount']=fix_decimal($bet['0']['betcount'], 4);
           $data['BetAmountSum']=fix_decimal($bet['0']['betamount'], 4);
           if($value['zt']==0){
           $data['SumProfitAndLoss']=0; //盈亏
            $data['SumWinLoss']=0; //中奖
           }
           else{
            $data['SumProfitAndLoss']=fix_decimal($bet['0']['sumprofitandloss']+$bet['0']['sumbackcomm'], 4);
            $data['SumWinLoss']=fix_decimal($bet['0']['sumwinloss'], 4);
          }
           $data['SumBackComm']=fix_decimal($bet['0']['sumbackcomm'], 4);
           $dataxx[]=$data;
        }
      echo json_encode($dataxx);
    }
}
