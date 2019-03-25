<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class FastTranslateController extends HomebaseController {

    protected $user_model;
    
    public function __construct() {
        parent::__construct();
         $this->check_login();
        $this->user_model = M("user");//打款凭证
    }
    public function index() {
        $this->display();
    }
    public function  KYRule() {
        $this->display();
    }
    public function BetFastTranslateSubmit() {
        header("Content-type: application/json");
        $type=M('type')->where(array('id'=>'1'))->find();
        $lottery_interval = get_lottery_interval($type);
        $now=getnow('1',$type['data_ftime']+3);
        $data['DrawDt']=date('Y/m/d '.$now['now'],time()+$now['day'] * 3600 * 24);
        $data['OpenDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt']) - $lottery_interval);

        if(time()<=strtotime($data['OpenDt'])){
        $this->ejson("下注失败"); 
        }
        $PeriodsNumber=date("ymd",time()+$now["day"]*3600*24).$now["hm"];

        $commission=json_decode($this->user["commission"],true);
        $sjcommission=json_decode($this->user["sjcommission"],true);

        $BetModelList=json_decode($_POST["BetModelList"],true);
        $money=0;
        $data=array();
        $data2=array();


        if($this->user["periodsnumber"]==$PeriodsNumber){
                $xxx=\DataCollector::get(DEV_DATA_PATH . 'tmp/storexx_'.md5($this->user["id"])."text");
                $storexx=json_decode($xxx,true);
        }
        else{
                $storexx=array();
        }
        $playlist=array();
        $BetInfoID=time();
        $bet=array();
        $isStopNum=0;
        $bet["uid"]=$this->user["id"];
        $bet["BetAmount"]=0;
        $bet["BetDt"]=$this->time;
        $bet["PeriodsNumber"]=$PeriodsNumber;
        $bet["BetInfoID"]=$BetInfoID;
        $bet["PeriodsID"]=$PeriodsNumber;
        $bet["typeid"]=1;
        $bet["playedId"]=0;
        $bet["BetIP"]=get_client_ip(0, true, $this->user);
        $bet["BackBetIP"]=get_client_ip(0, true, $this->user);
        $bet["ProfitAndLoss"]=0;
        $bet["UpdateDt"]=$this->time;
        $bet["BetWayID"]="快译";
        $bet["BackComm"]=0;
        $bet["bz"]=$_POST["logContent"];
        $count=0;
        // 自动降水数量
        $curernt_bet_list = $BetModelList;
        $count_low_odds = ceil(count($curernt_bet_list) * 0.1);
        $low_odds_index_list = array_rand($curernt_bet_list, $count_low_odds);
        $low_odds_index_list = is_array($low_odds_index_list) ? $low_odds_index_list : [$low_odds_index_list];
        foreach ($BetModelList as $bet_index => $value) {
            $value["BetNumber"]=str_replace("x","X",$value["BetNumber"]);
            $result=bettype($value["BetNumber"]);
            if($playlist[$result["betTypeId"]]){
                $played=$playlist[$result["betTypeId"]];
            }   
            else{
                $map["betTypeId"]=$result["betTypeId"];
                $played=M("played")->where($map)->find();
                $playlist[$result["betTypeId"]]=$played;
            }

            //$store=storexx($this->uid,$result["number"],$PeriodsNumber);
            //$store2=storexx2($this->uid,$played["id"],$PeriodsNumber);

            $money=$money+$value["Money"];

             $typemoney[$result["number"]]=$typemoney[$result["number"]]+$value["Money"];
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
            //$store=$maxcount-$store+0;
            //$store2=$maxcount-$store2+0;//能够下注

           
            if($minamount>$value["Money"]){
                $this->ejson("下注单额超过下限".$minamount."元");
            }

                if($maxbet<$typemoney[$result["number"]] || $maxcount<$value["Money"]+$storexx[$result["number"]]+0){
                    $money=$money-$value["Money"];
                    $typemoney[$played["id"]]=$typemoney[$played["id"]]-$value["Money"];
                    $add=array();
                    $add["uid"]=$this->user["id"];
                    $add["PeriodsNumber"]=$PeriodsNumber;
                    $add["BetTypeID"]=$result["betTypeId"];
                    $add["BetNumber"]=$result["number"];
                    $add["BetAmount"]=$value["Money"];
                    $add["IsDelete"]=0;
                    $add["CreateDt"]=$this->time;
                    $add["UpdateDt"]=$this->time;
                    $data2[]=$add;
                    $isStopNum=55;
                    if(count($data2)==500){
                        M("bet2")->addAll($data2);
                        $data2=array();
                    }
                }
                else{
                    $storexx[$result["number"]]=$value["Money"]+$storexx[$result["number"]];
                    $add=array();
                    $bet["BetAmount"]=$bet["BetAmount"]+$value["Money"];
                    $add["BetTypeID"]=$result["betTypeId"];
                    $add["BetAmount"]=$value["Money"];
                    $is_low_odds = in_array($bet_index, $low_odds_index_list);
                    $add["Odds"]=getodds($played, $this->user, $result["number"], $is_low_odds, $value["Money"]);
                    $add["playedId"]=$played["id"];
                    $add["ProfitAndLoss"]=0;
                    $add["BetNumber"]=$result["number"];
                    $add["PeriodsNumber"]=$PeriodsNumber;
                    $add["BetDt"]=$bet["BetDt"];
                    $add["BetInfoID"]=$BetInfoID;
                    $add["BackComm"]=($sjcommission[$result["betTypeId"]]["Commission"]-$commission[$result["betTypeId"]]["Commission"])*$add["BetAmount"];
                    $bet["BackComm"]=$bet["BackComm"]+$add["BackComm"];

                    $data[]=$add;
                    if(count($data)==500){
                         $count=$count+1;
                         if($count==1){
                            add($this->user["id"],$data);
                             $bet["count"]=$bet["count"]+"500";
                             $data=array();
                         }
                    }
                }
        }
        if($this->user["money"]<$money){
            M("userbet".$this->user["id"])->where(array("BetInfoID"=>$bet["BetInfoID"]))->delete();
            M("bet2")->where(array("CreateDt"=>$this->time))->delete();
            $this->ejson("信用额度不足");
        }

        
        if($data){
            $bet["count"]=$bet["count"]+count($data);
            if($count>=1){
             \DataCollector::set(DEV_DATA_PATH . 'tmp/'.$bet["BetInfoID"]."_".$this->user["id"],json_encode($data));
            }
            else{
                add($this->user["id"],$data);
            }
             //add($this->user["id"],$data);
        }
        if($data2){
             M("bet2")->addAll($data2);
        }
        $bet["agentpath"]=$this->user["agentpath"];
        $bet["parent"]=$this->user["parent"];
        if($bet["count"]>0){
            M("bets")->add($bet);
        }
       

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
        $datauser["timexx"]=microtime(TRUE)-$GLOBALS["_beginTime"];
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
        echo json_encode($data);
    }
}
