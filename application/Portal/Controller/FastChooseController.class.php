<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class FastChooseController extends HomebaseController {

    protected $user_model;
    
    public function __construct() {
        parent::__construct();
         $this->check_login();
        $this->user_model = M("user");//打款凭证
    }
    public function index() {
        $this->display();
    }
    public function SetFastBeatItem(){
        header("Content-type: application/json");
        $zmmtime=time();
        ob_start();
        @set_time_limit(0);
        @ini_set("memory_limit", "512M");
        $type=M('type')->where(array('id'=>'1'))->find();
        $lottery_interval = get_lottery_interval($type);
        $now=getnow('1',$type['data_ftime']+3);
        $data['DrawDt']=date('Y/m/d '.$now['now'],time()+$now['day']*3600*24);
        $data['OpenDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt']) - $lottery_interval);

        if(time()<=strtotime($data['OpenDt'])){
            $this->ejson("下注失败"); 
        }

          
        $PeriodsNumber=date("ymd",time()+$now["day"]*3600*24).$now["hm"];

        $commission=json_decode($this->user["commission"],true);
        $sjcommission=json_decode($this->user["sjcommission"],true);

        $BetNumber=json_decode($_POST["Data"],true);
        if($this->user["money"]<$_POST["AmountCount"]){
            $this->ejson("信用额度不足");
        }
        $money=0;
        $data=array();

        $bet=array();
        $betxx=array();
        $betList=array();


        $bet2=array();
        $bet2xx=array();
        $bet2List=array();

        $BetInfoID=time();

        if($this->user["periodsnumber"]==$PeriodsNumber){
                $xxx=\DataCollector::get(DEV_DATA_PATH . 'tmp/storexx_'.md5($this->user["id"])."text");
                $storexx=json_decode($xxx,true);
        }
        else{
                $storexx=array();
        }
        $playlist=array();
        $count=0;
        $bet["BackComm"]=0;
        $bet["count"]=0;
        for($i=2;$i<19;$i++){
            $curernt_bet_list = $BetNumber["B".$i];
            $count_current_bets = count($curernt_bet_list);
            if($count_current_bets){
                $map["betTypeId"]=$i;
                $played=M("played")->where($map)->find();

                if($commission[$played["bettypeid"]]["MaxLimitItemBet"]){
                    $maxcount=$commission[$played["bettypeid"]]["MaxLimitItemBet"];
                }
                else{
                    $maxcount=$played["maxcount"];
                }

                if($commission[$played["bettypeid"]]["MaxLimitSigleBet"]){
                    $maxbet=$commission[$played["bettypeid"]]["MaxLimitSigleBet"];
                }
                else{
                    $maxbet=$played["maxbet"];
                }

                if($commission[$played["bettypeid"]]["MinLimitBetAmount"]){
                    $minamount=$commission[$played["bettypeid"]]["MinLimitBetAmount"];
                }
                else{
                    $minamount=$played["minamount"];
                }

                if($minamount>$_POST["Amount"]){
                    $this->ejson("下注单额超过下限".$minamount."元");
                }

                $bet2["uid"]=$bet["uid"]=$this->user["id"];
                $bet2["BetTypeID"]=$i;
                $bet2["BetAmount"]=$_POST["Amount"];
                $bet["BetAmount"]=0;
                $bet2["IsDelete"]=0;
                $bet["BetDt"]=$this->time;
                $bet["PeriodsNumber"]=$PeriodsNumber;
                $bet["BetInfoID"]=$BetInfoID;
                $bet["PeriodsID"]=$PeriodsNumber;
                $bet["typeid"]=1;
                $bet["playedId"]=$played["id"];
                $bet["BetIP"]=get_client_ip(0, true, $this->user);
                $bet["BackBetIP"]=get_client_ip(0, true, $this->user);
                $bet["ProfitAndLoss"]=0;
                $bet2["UpdateDt"]=$bet2["CreateDt"]=$bet["UpdateDt"]=$this->time;
                $bet["BetWayID"]="快选";
                $bet["bz"]=$_POST["Bzxx"];
                $BackComm=($sjcommission[$i]["Commission"]-$commission[$i]["Commission"])*$_POST["Amount"];
                $name=md5(rand(0,99999999).time());
                // 自动降水数量
                $count_low_odds = ceil($count_current_bets * 0.1);
                $low_odds_index_list = array_rand($curernt_bet_list, $count_low_odds);
                $low_odds_index_list = is_array($low_odds_index_list) ? $low_odds_index_list : [$low_odds_index_list];
                foreach ($curernt_bet_list as $bet_index => $value) {
                    $typemoney[$value]=$typemoney[$value]+$_POST["Amount"];
                    if($maxbet<$typemoney[$value] || $maxcount<$_POST["Amount"]+$storexx[$value]+0){
                        $typemoney[$played["id"]]=$typemoney[$played["id"]]-$_POST["Amount"];
                        $bet2["BetNumber"]=$value;
                        $bet2List[]=$bet2;
                        $isStopNum=55;
                        if(count($bet2List)==20){
                            M("bet2")->addAll($bet2List);
                            $bet2List=array();
                        }
                    }
                    else{
                        $bet["BackComm"]=$bet["BackComm"]+$BackComm;
                        $money=$money+$_POST["Amount"];
                        $storexx[$value]=$storexx[$value]+$_POST["Amount"]+0;
                        $add=array();
                        $is_low_odds = in_array($bet_index, $low_odds_index_list);
                        $add["Odds"]=getodds($played, $this->user, $value, $is_low_odds, $_POST["Amount"]);
                        $add["BetNumber"]=$value;
                        $add["playedId"]=$bet["playedId"];
                        $add["BetInfoID"]=$bet["BetInfoID"];
                        $add["BetAmount"]=$_POST["Amount"];
                        $add["BackComm"]=$BackComm;
                        $add["ProfitAndLoss"]=$bet["ProfitAndLoss"];
                        $add["PeriodsNumber"]=$PeriodsNumber;
                        $add["BetDt"]=$bet["BetDt"];
                        $betList[]=$add;
                        if(count($betList)==500){
                             //add($this->user["id"],$betList);
                             $count=$count+1;
                             if($count==1){
                                $bet["count"]=$bet["count"]+500;
                                add($this->user["id"],$betList);
                                $betList=array();
                             }
                             // else{
                             //    file_put_contents("tmp/".$bet["BetInfoID"].$this->user["id"],json_encode($betList));
                             // }
                        }
                    }
                }
            }
        }
        if($this->user["money"]<$money){
            M("userbet".$this->user["id"])->where(array("BetInfoID"=>$bet["BetInfoID"]))->delete();
            M("bet2")->where(array("CreateDt"=>$this->time))->delete();
            $this->ejson("信用额度不足");
        }
         $bet["BetAmount"]=$money;
        if($betList){
            $bet["count"]=$bet["count"]+count($betList);
            if($count>=1){
             \DataCollector::set(DEV_DATA_PATH . 'tmp/'.$bet["BetInfoID"]."_".$this->user["id"],json_encode($betList));
            }
            else{
                add($this->user["id"],$betList);
            }
            //$bet["count"]=$bet["count"]+count($betList);
             //add($this->user["id"],$betList);
        }
         if($bet2List){
             M("bet2")->addAll($bet2List);
        }
        $bet["agentpath"]=$this->user["agentpath"];
        $bet["parent"]=$this->user["parent"];
        if($bet["count"]>0){
            $bet["Odds"] = isset($add["Odds"]) ? $add["Odds"] : 0;
            $bet["BetNumber"] = isset($add["BetNumber"]) ? $add["BetNumber"] : 0;
            M("bets")->add($bet);
        }
        $BetInfo=array();
        $data=array();
        moneybh($this->user[id],0-$money,"下注",array("liqtype"=>"4"));



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
        $save["PeriodsNumber"]=$PeriodsNumber;
        \DataCollector::set(DEV_DATA_PATH . 'tmp/storexx_'.md5($this->user["id"])."text",json_encode($storexx));
        M("user")->where(array("id"=>$this->user["id"]))->save($save);
        $datauser["UserName"]=$this->user_login;
        $datauser["Credit"]=sprintf("%.1f",$this->user[money]-$money);
        $datauser["UsedCredit"]=0;
        $datauser["CancelBet"]=0;
        $datauser["SecondStopEarly"]=0;
        $datauser["C"]=false;
        $datauser["BetInfo"]=$BetInfo;
        $datauser["yxtime"]=time()-$zmmtime;
        if($isStopNum>10){
            $data["status"]=false;
        }
        else{
            $data["status"]=true;
        }
        if($isStopNum>10){
            $data["info"]="有停压号，请留意停压区!";
        }
        else{
            $data["info"]="操作成功!";
        }
        $data["isStopNum"]=$isStopNum;
        $data["CmdObject"]=$datauser;
        $data["xytime"]=microtime(TRUE)-$GLOBALS["_beginTime"];
        echo json_encode($data);
    }
}
