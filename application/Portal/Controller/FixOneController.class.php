<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class FixOneController extends HomebaseController {

    protected $user_model;
    
    public function __construct() {
        parent::__construct();
         $this->check_login();
        $this->user_model = M('user');//打款凭证
    }
    public function index() {
        $this->display();
    }
    public function GetFixOneOddsInfo(){
            header('Content-type: application/json');
        $now=getnow('1');
        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];

        $commission=json_decode($this->user['commission'],true);
        $sjcommission=json_decode($this->user['sjcommission'],true);
        $json=array();
        for($i=20;$i<=24;$i++){
        $map['betTypeId']=$i;
        $played=M('played')->where($map)->find();
        $data['BetType']=(int)$played['bettypeid'];

        if($commission[$played['bettypeid']]['MaxLimitItemBet']){
            $maxcount=$commission[$played['bettypeid']]['MaxLimitItemBet'];
        }
        else{
            $maxcount=$played['maxcount'];
        }

        if($commission[$played['bettypeid']]['MaxLimitSigleBet']){
            $maxbet=$commission[$played['bettypeid']]['MaxLimitSigleBet'];
        }
        else{
            $maxbet=$played['maxbet'];
        }

        if($commission[$played['bettypeid']]['MinLimitBetAmount']){
            $minamount=$commission[$played['bettypeid']]['MinLimitBetAmount'];
        }
        else{
            $minamount=$played['minamount'];
        }


        $data['MaxLimitItemBet']=fix_decimal($maxcount, 4);
        $data['MaxLimitSigleBet']=fix_decimal($maxbet, 4);
        $data['MinLimitBetAmount']=fix_decimal($minamount, 4);


        $bonusprop=getodds($played,$this->user,$_GET['number']);
        $data['Odds']=round($bonusprop,2);

        $store=storexx($this->uid,$_GET['number'],$PeriodsNumber);
        //$store2=storexx2($this->uid,$played['id'],$PeriodsNumber);

        if($maxcount-$store>$maxbet){
                $data['Store']=$maxbet;
        }
        else{
            $data['Store']=$maxcount-$store+0;//能够下注
        }
        $data['APartialOdds']=fix_decimal(round($bonusprop,2), 4);
        $data['BOdds']=fix_decimal(round($bonusprop,2), 4);

        $data['BetItem']="";
        $data['Commission']=$sjcommission[$played['bettypeid']]['Commission']-$commission[$played['bettypeid']]['Commission'];
        $data['IsMaster']=true;
        $data['IsSuper']=true;
        $json[]=$data;
    }
        echo json_encode($json);
    }




    public function SetMemberBet(){
        header('Content-type: application/json');
        $type=M('type')->where(array('id'=>'1'))->find();
        $lottery_interval = get_lottery_interval($type);
        $now=getnow('1',$type['data_ftime'] + 3);
        $data['DrawDt']=date('Y/m/d '.$now['now'],time()+$now['day'] * 3600 * 24);
        $data['OpenDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt']) - $lottery_interval);
        if(time()<=strtotime($data['OpenDt'])){
            $this->ejson("下注失败"); 
        }
        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $listbet=json_decode($_POST[listbet],ture);
        $money=0;
        $timeid=time();
        $typemoney=array();

        $commission=json_decode($this->user['commission'],true);
        $sjcommission=json_decode($this->user['sjcommission'],true);
        $isStopNum=1;

         if($this->user['periodsnumber']==$PeriodsNumber){
                $xxx=\DataCollector::get(DEV_DATA_PATH . 'tmp/storexx_'.md5($this->user['id']).'text');
                $storexx=json_decode($xxx,true);
        }
        else{
                $storexx=array();
        }

        $curernt_bet_list = $listbet;
        $count_low_odds = ceil(count($curernt_bet_list) * 0.1);
        $low_odds_index_list = array_rand($curernt_bet_list, $count_low_odds);
        $low_odds_index_list = is_array($low_odds_index_list) ? $low_odds_index_list : [$low_odds_index_list];
        foreach ($listbet as $key => $value) {
           $map['betTypeId']=$value['BetType'];
           $played=M('played')->where($map)->find();
           $money=$money+$value['BetAmt'];
           $typemoney[$value['BetNumber']]=$typemoney[$value['BetNumber']]+$value['BetAmt'];

            if($commission[$played['bettypeid']]['MaxLimitItemBet']){
                $maxcount=$commission[$played['bettypeid']]['MaxLimitItemBet'];
            }
            else{
                $maxcount=$played['maxcount'];
            }

            if($commission[$played['bettypeid']]['MaxLimitSigleBet']){
                $maxbet=$commission[$played['bettypeid']]['MaxLimitSigleBet'];
            }
            else{
                $maxbet=$played['maxbet'];
            }

            if($commission[$played['bettypeid']]['MinLimitBetAmount']){
                $minamount=$commission[$played['bettypeid']]['MinLimitBetAmount'];
            }
            else{
                $minamount=$played['minamount'];
            }


            if($minamount>$value['BetAmt']){
                $this->ejson("下注单额超过下限".$minamount."元");
            }
            if($maxbet<$typemoney[$value['BetNumber']] || $maxcount<$value['Money']+$storexx[$result['number']]+0){
                unset($listbet[$key]);
                $money=$money-$value['BetAmt'];
                $typemoney[$played['id']]=$typemoney[$played['id']]-$value['BetAmt'];
                $add=array();
                $add['uid']=$this->user['id'];
                $add['PeriodsNumber']=$PeriodsNumber;
                $add['BetTypeID']=$value['BetType'];
                $add['BetNumber']=$value['BetNumber'];
                $add['BetAmount']=$value['BetAmt'];
                $add['IsDelete']=0;
                $add['CreateDt']=$this->time;
                $add['UpdateDt']=$this->time;
                M('bet2')->add($add);
                $isStopNum=55;
            }
            else{
                $storexx[$value]=$_POST['BetAmt']+$storexx[$value];
                $listbet[$key]['playedId']=$played['id'];
                $is_low_odds = in_array($key, $low_odds_index_list);
                $listbet[$key]['Odds']=getodds($played, $this->user, $value['BetNumber'], $is_low_odds, $value["BetAmt"]);
            }

        }
        if($money>$this->user['money']){
            $this->ejson("信用额度不足");
        }
        $BetInfoID=time();

        $bet=array();
        $bet['uid']=$this->user['id'];
        $bet['BetAmount']=0;
        $bet['BetDt']=$this->time;
        $bet['PeriodsNumber']=$PeriodsNumber;
        $bet['BetInfoID']=$BetInfoID;  
        $bet['PeriodsID']=$PeriodsNumber;
        $bet['typeid']=1;

        $bet['BetIP']=get_client_ip(0, true, $this->user);
        $bet['BackBetIP']=get_client_ip(0, true, $this->user);

        $bet['BackComm']=0;
        $bet['UpdateDt']=$this->time;
        $bet['BetWayID']='一字定';
        foreach ($listbet as $key => $value) {
            $add=array();
            $add['uid']=$this->user['id'];
            $add['Odds']=$value['Odds'];
            $add['BetNumber']=$value['BetNumber'];
            $add['playedId']=$value['playedId'];
            $add['BetInfoID']=$BetInfoID;
            $add['BetAmount']=$value['BetAmt'];
            $add['BackComm']=($sjcommission[$value['BetType']]['Commission']-$commission[$value['BetType']]['Commission'])*$value['BetAmt'];
            $add['ProfitAndLoss']=0;
            $add['PeriodsNumber']=$PeriodsNumber;
            $add['BetDt']=$bet['BetDt'];
            $bet['BetAmount']=$add['BetAmount']+$bet['BetAmount'];
            $bet['BackComm']=$bet['BackComm']+$add['BackComm'];
            $bet['uid'] = $this->user['id'];
            $res=M('userbet'.$this->user['id'])->add($add);
            //$this->betfslh($res);
        }
        $bet['playedId']=$value['playedId'];
        $bet['agentpath']=$this->user['agentpath'];
        $bet['parent']=$this->user['parent'];
        $bet['count']=count($listbet);
        if($bet["count"]>0){
            M("bets")->add($bet);
        }
        moneybh($this->user[id],0-$money,'下注',array('liqtype'=>'4'));



        $agentts=array();
        $agentts['0']=$commission;
        $agentts['-1']=$sjcommission;
        for($i=$this->user["parent"];$i>0;$i){
            $agent=M('agent')->find($i);
            $agentts[$i]=json_decode($agent["commission"],true);
            $i=$agent["parent"];
        }
        \DataCollector::set(DEV_DATA_PATH . 'tmp/commission'.$bet["BetInfoID"]."_".$this->user["id"],json_encode($agentts));

        
         $save=array();
        $save['PeriodsNumber']=$PeriodsNumber;
        \DataCollector::set(DEV_DATA_PATH . 'tmp/storexx_'.md5($this->user['id']).'text',json_encode($storexx));
        M('user')->where(array('id'=>$this->user['id']))->save($save);
        $datauser['UserName']=$this->user_login;
        $datauser['Credit']=sprintf("%.1f",$this->user[money]-$money);
        $datauser['UsedCredit']=0;
        $datauser['CancelBet']=0;
        $datauser['SecondStopEarly']=0;
        $datauser['C']=false;
        $datauser['BetInfo']=null;
        if($isStopNum>10){
            $data['status']=false;
        }
        else{
            $data['status']=true;
        }
        if($isStopNum>10){
            $data['info']="有停压号，请留意停压区!";
        }
        else{
            $data['info']="操作成功!";
        }
        $data['isStopNum']=$isStopNum;
        $data['CmdObject']=$datauser;
        echo json_encode($data);
    }
}
