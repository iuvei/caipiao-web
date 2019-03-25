<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class FastBeatController extends HomebaseController {

    protected $user_model;
    
    public function __construct() {
        parent::__construct();
         $this->check_login();
        $this->user_model = M('user');//打款凭证
    }
    public function Index(){
        $this->display();
    }
    public function ModifyBetClearPrint(){
        header('Content-type: application/json');
        echo '{"status":true,"IsPrint":false,"info":"操作成功!"}';
    }
    public function GetTopEightPeriodsNumber(){
        $list=M('data')->order('id desc')->limit(8)->select();
        $datalist=array();
        foreach($list as $key=>$one){
            $data['c_t']=$one['number'];
            $data['c_d']=date('Y-m-d H:i:s',$one['time']);
            $data['c_r']=$one['data'];
            $datalist[]=$data;
        }
        echo json_encode($datalist);
    }
    public function GetStopBetNumber(){
            header('Content-type: application/json');
            @set_time_limit(0);
            @ini_set('memory_limit', '512M');

            $PeriodsNumber=$_GET['PeriodsNumber'];
            $map['PeriodsNumber']=$_GET['PeriodsNumber'];
            $map['uid']=$this->uid;
            $list=M('bet2')->where($map)->select();
            $data=array();
            foreach ($list as $key => $value) {
                $bet=array();
                $bet['ID']=$value['id'];
                $bet['MemberID']=$value['uid'];
                $bet['PeriodsNumber']=$value['periodsnumber'];
                $bet['BetTypeID']=$value['bettypeid'];
                $bet['BetNumber']=$value['betnumber'];
                $bet['BetAmount']=fix_decimal($value['betamount'], 4);
                $bet['IsDelete']=(boolean)$value['isdelete'];
                $bet['CreateDt']=$value['createdt'];
                $bet['UpdateDt']=$value['updatedt'];
                $data[]=$bet;
            }
        echo json_encode($data);
    }
    public function DeleteStopBetNumber(){
        $ids=json_decode($_PSOT['lsIds'],true);
        $map['ID']=array('in',implode(',', $ids));
        $save['IsDelete']=1;
        $save['UpdateDt']=$this->time;
        M('bet2')->where($map)->save($save);
        $data['info']='操作成功!';
        $data['status']=true;
        echo json_encode($data);
    }
        public function GetBetInfoTopTen(){
            header('Content-type: application/json');

        $now=getnow('1');
        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $map['zt']=0;
        $map['PeriodsNumber']=$PeriodsNumber;
        $betlist=M('userbet'.$this->user['id'])->where($map)->limit(10)->order('id desc')->select();
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
            $list[$key]['BetAmount']=$value['betamount'];
            $list[$key]['BetTypeID']=$value['playedid'];
            $list[$key]['Odds']=$value['odds'];
            $list[$key]['WinLoss']=$value['winloss'];
            $list[$key]['ProfitAndLoss']=$value['profitandloss'];
            $list[$key]['BackComm']=$value['backcomm'];
            $list[$key]['BetStatus']=(int)$value['sftm'];
            $list[$key]['UpdateDt']=$value['updatedt'];
            $list[$key]['BetWayID']=$value['betwayid'];
            $list[$key]['BackBetIP']=$value['backbetip'];
            $list[$key]['IsHotNum']=(boolean)$value['ishotnum'];
        }
        $data=$list;
        echo json_encode($data);
        }
        public function GetBetInfoForLeft(){
        header('Content-type: application/json');
        $now=getnow('1');
        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $pagNum=$_GET['pagNum'];
        $size=100;
        $map['zt']=0;
        $map['sftm']=0;
        $map['PeriodsNumber']=$PeriodsNumber;
        $map['leftzt']=0;

        $count=M('userbet'.$this->user['id'])->where($map)->count();
        $map2['PeriodsNumber']=$PeriodsNumber;
        $map2['uid']=$this->user['id'];
        $count2=M('bets')->where($map)->sum('count');
        if($count2>$count){
            $count=$count2;
        }
        $betlist=M('userbet'.$this->user['id'])->where($map)->limit(($pagNum-1)*$size.','.$size)->order('id desc')->select();
        $list=array();
        foreach ($betlist as $key => $value) {
            $list[$key]['LotteryID']=$value['typeid'];
            $list[$key]['BetDetailID']=$value['id'];
            $list[$key]['BetInfoID']=$value['betinfoid'];
            $list[$key]['PeriodsID']=$value['periodsid'];
            $list[$key]['PeriodsNumber']=$value['periodsnumber'];
            $list[$key]['BetDt']=$value['betdt'];
            $list[$key]['BetNumber']=$value['betnumber'];
            $list[$key]['BetAmount']=round($value['betamount'],1);
            $list[$key]['BetTypeID']=$value['playedid'];
            $list[$key]['Odds']=sprintf("%.2f", $value['odds']);
        }
        $PageCount['0']['Column1']=ceil($count/$size);
        $Numbering['0']['BetDt']=$value['betdt'];
        $Numbering['0']['Number']=$list[$key]['PeriodsNumber'].$value['betinfoid'];
        $data['PageCount']=$PageCount;
        $data['Numbering']=$Numbering;
        $data['list']=$list;
    echo json_encode($data);
    }
    public function MemberBet(){
        header('Content-type: application/json');
        $type=M('type')->where(array('id'=>'1'))->find();
        $lottery_interval = get_lottery_interval($type);
        $now=getnow('1',$type['data_ftime']+3);
        $data['DrawDt']=date('Y/m/d '.$now['now'],time()+$now['day'] * 3600 * 24);
        $data['OpenDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt']) - $lottery_interval);

        if(time()<=strtotime($data['OpenDt'])){
        $this->ejson("下注失败"); 
        }

        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];

        $commission=json_decode($this->user['commission'],true);
        $sjcommission=json_decode($this->user['sjcommission'],true);

        $BetNumber=json_decode($_POST['BetNumber'],true);
        if($this->user['money']<$_POST['BetAmt']){
            $this->ejson("信用额度不足");
        }
        $money=0;
        $data=array();
        if($this->user['periodsnumber']==$PeriodsNumber){
                $xxx=\DataCollector::get(DEV_DATA_PATH . 'tmp/storexx_'.md5($this->user['id']).'text');
                $storexx=json_decode($xxx,true);
        }
        else{
                $storexx=array();
        }
        for($i=2;$i<25;$i++){
            if(count($BetNumber['B'.$i])){
                foreach ($BetNumber['B'.$i] as $key => $value) {
                    $bet=array();
                    $map['betTypeId']=$i;
                    $played=M('played')->where($map)->find();

                   // $store=storexx($this->uid,$value,$PeriodsNumber);
                    //$store2=storexx2($this->uid,$played['id'],$PeriodsNumber);

                    $money=$money+$_POST['BetAmt'];
                    $typemoney[$value]=$typemoney[$value]+$_POST['BetAmt'];
                    
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
            
            //$store=$maxcount-$store+0;
            //$store2=$maxcount-$store2+0;//能够下注


            if($minamount>$_POST['BetAmt']){
                $this->ejson("下注单额超过下限".$minamount."元");
            }

                if($maxbet<$typemoney[$value] || $maxcount<$value['Money']+$storexx[$result['number']]+0){
                    $money=$money-$_POST['BetAmt'];
                    $typemoney[$played['id']]=$typemoney[$played['id']]-$_POST['BetAmt'];
                    $add=array();
                    $add['uid']=$this->user['id'];
                    $add['PeriodsNumber']=$PeriodsNumber;
                    $add['BetTypeID']=$i;
                    $add['BetNumber']=$value;
                    $add['BetAmount']=$_POST['BetAmt'];
                    $add['IsDelete']=0;
                    $add['CreateDt']=$this->time;
                    $add['UpdateDt']=$this->time;
                    M('bet2')->add($add);
                    $isStopNum=55;
                }
                else{
                    $storexx[$value]=$_POST['BetAmt']+$storexx[$value];

                    $bet['BetAmount']=$_POST['BetAmt'];
                    $bet['Odds']=getodds($played, $this->user, $value, true, $_POST["BetAmt"]);
                    $bet['playedId']=$played['id'];
                    $bet['BetTypeID']=$i;
                    $bet['ProfitAndLoss']=0-$_POST['BetAmt'];
                    $bet['BetNumber']=$value;
                    $data[]=$bet;
                }
            }
        }
    }
        $count=0;
        if($this->user['money']<$money){
            $this->ejson("信用额度不足");
        }
        $BetInfo=array();
        $BetInfoID=time();
        foreach ($data as $key => $value) {
            $add=array();
            $add['uid']=$this->user['id'];
            $add['BetAmount']=$value['BetAmount'];
            $add['Odds']=$value['Odds'];
            $add['BetNumber']=$value['BetNumber'];
            $add['BetDt']=$this->time;
            $add['PeriodsNumber']=$PeriodsNumber;
            $add['BetInfoID']=$BetInfoID;
            $add['PeriodsID']=$PeriodsNumber;
            $add['typeid']=1;
            $add['playedId']=$value['playedId'];
            $add['BetIP']=get_client_ip(0, true);
            $add['BackBetIP']=get_client_ip(0, true, $this->user);
            $add['ProfitAndLoss']=0;
            $add['UpdateDt']=$this->time;
            $add['BackComm']=($sjcommission[$value['BetTypeID']]['Commission']-$commission[$value['BetTypeID']]['Commission'])*$value['BetAmount'];
            $add['BetWayID']='快打';
            $add['count']=1;
            $BetInfo[]=$PeriodsNumber.$add['BetInfoID'];
            $BetInfo[]=$add['BetInfoID'];
            $BetInfo[]=$value['BetNumber'];
            $BetInfo[]=$value['BetAmount'];
            $BetInfo[]=$value['playedId'];
            $BetInfo[]=$value['Odds'];
            $BetInfo[]=$add['BetDt'];
            $BetInfo[]=false;
            $add['agentpath']=$this->user['agentpath'];
            $add['parent']=$this->user['parent'];
            $res=M('userbet'.$this->user['id'])->add($add);
            $count=$count+1;
                //$this->betfslh($res);
        }
        if($count>1){
            $add['bz']='全转'.$add['BetNumber'];
        }
        $add['BetAmount']=$add['BetAmount']*$count;
        $add['BackComm']=$count*$add['BackComm'];
        $add['count']=$count;
         if($add["count"]>0){
            M("bets")->add($add);
        }
        $data=array();

        moneybh($this->user[id],0-$money,'下注',array('liqtype'=>'4'));

        $agentts=array();
        $agentts['0']=$commission;
        $agentts['-1']=$sjcommission;
        for($i=$this->user["parent"];$i>0;$i){
            $agent=M('agent')->find($i);
            $agentts[$i]=json_decode($agent["commission"],true);
            $i=$agent["parent"];
        }
        \DataCollector::set(DEV_DATA_PATH . 'tmp/commission'.$add["BetInfoID"]."_".$this->user["id"],json_encode($agentts));

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
        $datauser['BetInfo']=$BetInfo;
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
    public function BackBetOperator(){
        header('Content-type: application/json');

        $type=M('type')->where(array('id'=>'1'))->find();
        $lottery_interval = get_lottery_interval($type);
        $now=getnow('1',$type['data_ftime']);
        $PeriodsNumber=date("ymd",time()+$now["day"]*3600*24).$now["hm"];
        $data['DrawDt']=date('Y/m/d '.$now['now'],time()+$now['day']*3600*24);
        $data['OpenDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt']) - $lottery_interval);

        if(time()<=strtotime($data['OpenDt'])){
            $this->ejson("封盘后不能退码"); 
        }

        $data=array();
        $money=0;
        $betmoney=array();
        $betcount=array();
        $betback=array();
        $LsBetIds=json_decode($_POST['LsBetIds'],ture);
        foreach ($LsBetIds as $key => $value) {
            // if(!$list[$value['BetInfoID']]){
            //     $map['BetInfoID']=$value['BetInfoID'];
            //    // $map['BetInfoID']=$value['BetNumber'];
            //     $BetInfolist=M("userbet".$this->user['id'])->field('sftm,betnumber,periodsnumber,backcomm,betamount')->where($map)->select();
            //     foreach ($BetInfolist as $key2 => $value2) {
            //         if($value2['sftm']==0){
            //          $list[$value['BetInfoID']][$value2['betnumber']]=$value2;
            //        }
            //     }
            //     $BetInfolist=array();
            // }
            // if($list[$value['BetInfoID']][$value['BetNumber']]['periodsnumber']!=$PeriodsNumber){
                
            // }
            // else{
            //     $money=$money+$list[$value['BetInfoID']][$value['BetNumber']]['betamount'];
            //     $betmoney[$value['BetInfoID']]+=$list[$value['BetInfoID']][$value['BetNumber']]['betamount'];
            //     $betcount[$value['BetInfoID']]+=1;
            //     $betback[$value['BetInfoID']]+=$list[$value['BetInfoID']][$value['BetNumber']]['backcomm'];
            //     $list2[$value['BetInfoID']][]=$value['BetNumber'];
            // }
                $map['BetInfoID']=$value['BetInfoID'];
                $map['BetNumber']=$value['BetNumber'];
                $map['sftm']=0;
                $BetInfo=M("userbet".$this->user['id'])->where($map)->find();
                if($BetInfo['periodsnumber']==$PeriodsNumber){
                    $money=$money+$BetInfo['betamount'];
                    $betmoney[$value['BetInfoID']]+=$BetInfo['betamount'];
                    $betcount[$value['BetInfoID']]+=1;
                    $betback[$value['BetInfoID']]+=$BetInfo['backcomm'];
                    $list2[$value['BetInfoID']][]=$value['BetNumber'];
                }
        }
         $data['time1']=microtime(TRUE)-$GLOBALS["_beginTime"];
        foreach ($list2 as $key => $value) {
               $map2['BetInfoID']=$key;
            //$map2['BetNumber']=array('in',implode(",", $list2[$key]));
                $save['uid'] = $this->user['id'];
                $save['sftm']='1';
                $save['ProfitAndLoss']=0;
                $save['UpdateDt']=date('Y-m-d H:i:s');
                $mapbet['BetInfoID']=$key;
                $mapbet['uid']=$this->user['id'];
                $betxx=M('bets')->where($mapbet)->find();
                $savexx['BetAmount']=$betxx['betamount']-$betmoney[$key];
                $savexx['count']=$betxx['count']-$betcount[$key];
                $savexx['BackComm']=$betxx['backcomm']-$betback[$key];
                $savexx['sftj']=1;
                $savexx['sftm']=1;
                foreach ($value as $key3 => $value3) {
                    $map2['BetNumber']=$value3;
                    M("userbet".$this->user['id'])->where($map2)->save($save);
                }
                M('bets')->where($mapbet)->save($savexx);
        }
         $data['time2']=microtime(TRUE)-$GLOBALS["_beginTime"];
        if($money==0){
                $this->ejson("已经过来退码的时间或该注已退码");
            }
        else{
            moneybh($this->user[id],$money,'退码',array('liqtype'=>'5'));
            $data['info']='操作成功';
            $data['status']=true;
            $data['time']=microtime(TRUE)-$GLOBALS["_beginTime"];
            echo json_encode($data);
        }
    }
    public function GetPeriodsNumberByStop(){
        header('Content-type: application/json');

        $now=getnow('1');
        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $data=array(); 
        $data['PeriodsID']=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $data['PeriodsNumber']=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $list[]=$data;
        $now['hm']=$now['hm']-1;
        if($now['hm']<0){
            $day=$day-1;
            $now['hm']=120;
        }
        if($now['hm']<100){
            $now['hm']='0'.$now['hm'];
        }
        if($now['hm']<10){
            $now['hm']='0'.$now['hm'];
        }
        $data['PeriodsID']=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $data['PeriodsNumber']=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $list[]=$data;

        $now['hm']=$now['hm']-1;
        if($now['hm']<0){
            $day=$day-1;
            $now['hm']=120;
        }
        if($now['hm']<100){
            $now['hm']='0'.$now['hm'];
        }
        if($now['hm']<10){
            $now['hm']='0'.$now['hm'];
        }
        $data['PeriodsID']=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $data['PeriodsNumber']=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $list[]=$data;
        echo json_encode($list);
    }
}


