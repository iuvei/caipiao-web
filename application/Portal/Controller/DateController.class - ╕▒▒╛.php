<?php
/*
 *      _______ _     _       _     _____ __  __ ______
 *     |__   __| |   (_)     | |   / ____|  \/  |  ____|
 *        | |  | |__  _ _ __ | | _| |    | \  / | |__
 *        | |  | "_ \| | "_ \| |/ / |    | |\/| |  __|
 *        | |  | | | | | | | |   <| |____| |  | | |
 *        |_|  |_| |_|_|_| |_|_|\_\\_____|_|  |_|_|
 */
/*
 *     _________  ___  ___  ___  ________   ___  __    ________  _____ ______   ________
 *    |\___   ___\\  \|\  \|\  \|\   ___  \|\  \|\  \ |\   ____\|\   _ \  _   \|\  _____\
 *    \|___ \  \_\ \  \\\  \ \  \ \  \\ \  \ \  \/  /|\ \  \___|\ \  \\\__\ \  \ \  \__/
 *         \ \  \ \ \   __  \ \  \ \  \\ \  \ \   ___  \ \  \    \ \  \\|__| \  \ \   __\
 *          \ \  \ \ \  \ \  \ \  \ \  \\ \  \ \  \\ \  \ \  \____\ \  \    \ \  \ \  \_|
 *           \ \__\ \ \__\ \__\ \__\ \__\\ \__\ \__\\ \__\ \_______\ \__\    \ \__\ \__\
 *            \|__|  \|__|\|__|\|__|\|__| \|__|\|__| \|__|\|_______|\|__|     \|__|\|__|
 */
// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>
// +----------------------------------------------------------------------

namespace Portal\Controller;

use Common\Controller\HomebaseController;

/**
 * 首页
 */
class DateController extends HomebaseController {
			function kj(){
				header("Content-type:text/html;charset=utf-8");
				// ob_start();
				// ignore_user_abort(true);
				// if(!function_exists("fastcgi_finish_request")) {
				// 		ob_start();
				// 		echo "奖金放发完毕";
				// 		header("Connection: close\r\n"); 
				// 		header("Content-Encoding: none\r\n");

				// 		// your code here


				// 		$size = ob_get_length();
				// 		header("Content-Length: ". $size . "\r\n"); 
				// 		// send info immediately and close connection
				// 		ob_end_flush();
				// 		flush();
		  //       } else {
		  //           fastcgi_finish_request();
		  //       }
				@set_time_limit(0);
         		@ini_set("memory_limit", "512M");
				$time=$_SERVER['REQUEST_TIME'];
        		$list=M("played")->select();
	            	$playlist=array();
		            foreach($list as $key=>$one){
		                $playlist[$one["id"]]=$one;
		            }
	            $list=M("user")->select();
	            	$userlist2=array();
		            foreach($list as $key=>$one){
		                $userlist2[$one["id"]]=$one;
		            }

	            $list=M("agent")->select();
	            	$agentlist=array();
		            foreach($list as $key=>$one){
		                $agentlist[$one["id"]]=$one;
		            }

				$id=I("get.id");
				$data=M("data")->find($id);
				$map["typeid"]=$data["type"];
				$map["PeriodsNumber"]=$data["number"];
				$map["zt"]=0;
				$bets=M("bets")->where($map)->select();
				echo $time-time().'<br>';
				$save2["pjed"]=$data["pjed"];
				$save2["zjCount"]=$data["zjcount"];
				$save2["userCount"]=$data["usercount"];
				$save2["betAmount"]=$data["betamount"];
				$save2["zjAmount"]=$data["zjamount"];
				$save2["fanDianAmount"]=$data["fandianamount"];
				$save2["billCount"]=$data["billCount"];
				//$mapss["PeriodsNumber"]=$data["number"];
				// $xx2=M("betxx")->where($mapss)->select();
				// $xx=array();
				// foreach($xx2 as $key => $value){
				// 	$xx[$value["uid"]][$value["betinfoid"]][$value["betamount"]][$value["playedid"]]=$value;
				// }
				$usermoney=array();
				$agentmoney=array();
				$zlhmoney=array();
				$count=0;				
				foreach ($bets as $key => $value) {
						$bet=array();
						$fsxx=array();
						$lhxx=array();
						$sjxx=file_get_contents("auto/php54n/tmp/commission".$value["betinfoid"]."_".$value["uid"]);
						unlink("auto/php54n/tmp/commission".$value["betinfoid"]."_".$value["uid"]);
						$commissionlist=json_decode($sjxx,true);
						$bet["WinLoss"]=0;
						$bet["ProfitAndLoss"]=0;
						$bet["BackComm"]=0;
						$bet["BetAmount"]=0;
						$bet["zt"]=1;
						$bet["sftj"]=3;
						$bet["lotteryno"]=$data["data"];
						// $mapbet=array();
						// $mapbet["BetInfoID"]=$value["betinfoid"];
						// $mapbet["sftm"]=0;

						for($j=0;$j<$value["count"]/5000;$j++){
						$sj=file_get_contents("auto/php54n/tmp/kj".$value["betinfoid"]."_".$value["uid"]."_".$j);

						unlink("auto/php54n/tmp/kj".$value["betinfoid"]."_".$value["uid"]."_".$j);
						$list=json_decode($sj,true);
						$sj=0;
						//$map2["zt"]=0;
						// $count=M("userbet".$value["uid"])->where($mapbet)->count();
						// $list=M("userbet".$value["uid"])->where($mapbet)->limit(($i*5000).",5000")->select();
						$savelist=array();
					    foreach ($list as $key2 => $value2) {
					    	$count++;
					    	$bet["BetAmount"]+=$value2["BetAmount"];
					    	$bet["BackComm"]+=$value2["BackComm"];
					    	$bet["UpdateDt"]=date("Y-m-d H:i:s",time());
					    	if(0){//$value2["zt"]==1
					    		$bet["WinLoss"]+=$value2["WinLoss"];
					    		$bet["ProfitAndLoss"]+=$value2["ProfitAndLoss"];
					    	}
					    	else{
							$play=$playlist[$value2["playedId"]];
							eval('$sfzj=$this->'.$play["rulefun"].'($value2["BetNumber"],$data["data"]);');
							$save["zt"]=1;
							$jjmoney=0;
							if($sfzj){
								$jjmoney=$value2["BetAmount"]*$value2["Odds"];
								$usermoney[$value["uid"]]+=$jjmoney;
								$save["WinLoss"]=$jjmoney;
								$bet["WinLoss"]+=$jjmoney;
								$bet["ProfitAndLoss"]+=$jjmoney-$value2["BetAmount"];
								$save["ProfitAndLoss"]=$jjmoney-$value2["BetAmount"];
								//$this->ffmoney($value["uid"],$jjmoney,"发放奖金",0);
							}
							else{
									$bet["ProfitAndLoss"]+=-$value2["BetAmount"];
									$save["WinLoss"]=0;
									$save["ProfitAndLoss"]=0-$value2["BetAmount"];
								}
								$map3["id"]=$value2["id"];
								//M("userbet".$value["uid"])->where($map3)->save($save);

								$save2["betAmount"]+=$value2["BetAmount"];
								$save2["zjCount"]+=$sfzj;
								$save2["billCount"]+=1;
								$save2["zjAmount"]+=$save["WinLoss"];
								$save2["pjed"]+=$save["WinLoss"];
								$userlist[$value["uid"]]=1;
								// $save2["fanDianAmount"]=$save2["fanDianAmount"]+$this->fsff($xx[$value["uid"]][$value["betinfoid"]][$value["betamount"]][$value["playedid"]]["fsxx"]);
								//$userlist[$value["uid"]]=1;
								//$betlist[$value["BetInfoID"]]=1;
								//$this->lhff($xx[$value["uid"]][$value["betinfoid"]][$value["betamount"]][$value["playedid"]]["lhxx"],$save["ProfitAndLoss"],$value["betamount"]);
							}
							$save['id']=$value2["id"];

							$usermoney[$value["uid"]]+=$value2["BackComm"];
							$commission=$commissionlist['0'];
        					$sjcommission=$commissionlist['-1'];
        					$pratio=$userlist2[$value["uid"]]['ratio'];

        					$mfsxx=array();
        					$mlhxx=array();
        					$ymoney=0;


							
							
							for($i=$userlist2[$value["uid"]]['parent'];$i>0;$i){
								$agent=$agentlist[$i];
								$sjcommission=$commission;
								$commission=$commissionlist[$i];
					            $fsmoney=$value2['BetAmount']*($sjcommission[$play['bettypeid']]['Commission']-$commission[$play['bettypeid']]['Commission']);
					            $lhmoney=$pratio*$value2['BetAmount']/100;
								
								if($lhmoney>$commission[$play['bettypeid']]['MaxLimitStore']){
					            	$lhmoney=$commission[$play['bettypeid']]['MaxLimitStore'];
					            }
								
								/*
					            if($zlhmoney[$i][$value2['playedId']]+$lhmoney>$commission[$play['bettypeid']]['MaxLimitStore']){
					            	$lhmoney=$commission[$play['bettypeid']]['MaxLimitStore']-$zlhmoney[$i][$value['playedId']];
					            }
								*/
								
					            if($lhmoney<=0){
					            	$lhmoney=0;
					            }
					            if($lhmoney+$ymoney>$value2['BetAmount']){
					            	$lhmoney=$value2['BetAmount']-$ymoney;
					            }
					            $lhmoney2=$lhmoney;
								
					            if($sfzj){
					            	$lhmoney2=-$lhmoney/$value2["BetAmount"]*($save["ProfitAndLoss"]+$value2["BackComm"]);
					            }
					            else{
					            	$lhmoney2=-$lhmoney/$value2["BetAmount"]*($save["ProfitAndLoss"]+$value2["BackComm"]);
					            }

								$myfile = fopen("newfile.txt", "a+") or die("Unable to open file!");
								fwrite($myfile, "{$lhmoney2} = {$lhmoney} / {$value2['BetAmount']} * ({$save['ProfitAndLoss']} + {$value2['BackComm']})\r\n");

					            $ymoney+=$lhmoney;
					            //$agentmoney[$i]+=$lhmoney;
					            $mlhxx[$i]['money']=$lhmoney;
					            $mlhxx[$i]['win']=$lhmoney2;

					             $lhxx[$i]['money']+=$lhmoney;
					             $lhxx[$i]['win']+=$lhmoney2;
					            $zlhmoney[$i][$value2['playedId']]+=$lhmoney;
					            if($fsmoney>0){
					            	$mfsxx[$i]=$fsmoney;
					            	$fsxx[$i]+=$fsmoney;
					            	//$agentmoney[$i]+=$fsmoney;
					            }
					            $i=$agent["parent"];
					            $pratio=$agent['pratio'];
					            if($agent['agentlevel']==1){
					            	$agent["parent"]=0;
					            }
					            if($ymoney==$value2['BetAmount']){
					            	$i=0;
					            }
                         	}

                         	$save['lhxx']=json_encode($mlhxx);
                         	$save['fsxx']=json_encode($mfsxx);
                         	$savelist[]=$save;
						}

						file_put_contents("auto/php54n/tmp/data".$value["betinfoid"]."_".$value["uid"]."_".$j,json_encode($savelist));
						$savelist=array();
					}
						$bet['fsxx']=json_encode($fsxx);
						$bet['lhxx']=json_encode($lhxx);
						$map3["id"]=$value["id"];
						M("bets")->where($map3)->save($bet);
						echo $value["betinfoid"]."中奖".$bet["WinLoss"]."<br>";
						$bet=array();
						$list=array();
				}
				//$save2["billCount"]=$data["billcount"]+count($bets);
				$save2["userCount"]=$data["usercount"]+count($userlist);
				//M("data")->where("id=".$id)->save($save2);
				foreach($usermoney as $key=>$one){
					$this->ffmoney($key,$one,'发放奖金','0');
				}
				foreach($agentmoney as $key=>$one){
					$this->ffmoney($key,$one,'发放反水及拦货','1');
				}
				echo "总计开奖".$count.",用时".($time-time())."秒,奖金放发完毕。";
			}
			//拦货
			function lhff($json,$win,$money){
					$data=json_decode($json,true);
					foreach($data as $key => $value){
						$this->ffmoney($value["id"],$value["money"]/$money*$win,"拦货","1");
					}
			}
			function fsff($json){
					$data=json_decode($json,true);
					$zmoney=0;
					foreach($data as $key => $value){
						$this->ffmoney($value["id"],$value["money"],"返水",$value["sfagent"]);
						$zmoney=$value["money"]+$zmoney;
					}
					return $zmoney;
			}
			function ffmoney($id,$money,$yuan,$sfagent){
				if($sfagent){
						$M=M("agent");
				}
				else{
						$M=M("user");
				}
				$map["id"]=$id;
				$user=$M->where($map)->setInc("money",$money);
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