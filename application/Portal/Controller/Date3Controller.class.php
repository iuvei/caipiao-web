<?php
/*
 *      _______ _     _       _     _____ __  __ ______
 *     |__   __| |   (_)     | |   / ____|  \/  |  ____|
 *        | |  | |__  _ _ __ | | _| |    | \  / | |__
 *        | |  | '_ \| | '_ \| |/ / |    | |\/| |  __|
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
				// if(!function_exists('fastcgi_finish_request')) {
				// 		ob_start();
				// 		echo '奖金放发完毕';
				// 		header("Connection: close\r\n"); 
				// 		header('Content-Encoding: none\r\n');

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
        		@ini_set('memory_limit', '512M');
				$id=I('get.id');
				$data=M('data')->find($id);

				$save2=array();
				$save2['pjed']=$data['pjed'];
				$save2['zjCount']=$data['zjcount'];
				$save2['userCount']=$data['usercount'];
				$save2['betAmount']=$data['betamount'];
				$save2['zjAmount']=$data['zjamount'];
				$save2['fanDianAmount']=$data['fandianamount'];
				$save2['billCount']=$data['billcount'];
				$save2['userCount']=$data['usercount'];

				$mapss['PeriodsNumber']=$data['number'];
				$xx2=M('betxx')->where($mapss)->select();
				$xx=array();
				foreach($xx2 as $key => $value){
					$xx[$value['uid']][$value['betinfoid']][$value['betamount']][$value['playedid']]=$value;
				}

				$map['typeid']=$data['type'];
				$map['PeriodsNumber']=$data['number'];
				$map['sftm']=0;
				$map['zt']=0;
				$count=M('bets')->where($map)->count();

			$plays=M('played')->select();
			$playlist=array();
			foreach ($plays as $key => $value) {
				$playlist[$value['id']]=$value;
			}
			for ($mm=0; $mm <ceil($count/10000) ; $mm++) {
				$bets=M('bets')->where($map)->order('id desc')->limit('0,10000')->select();
				//$save2[billCount]=count($bets);
				$userlist=array();				
				foreach ($bets as $key => $value) {
						$play=$playlist[$value['playedid']];
						eval('$sfzj=$this->'.$play['rulefun'].'($value[betnumber],$data[data]);');
						$save['zt']=1;
						$save['lotteryno']=$data['data'];
						$jjmoney=0;
						if($sfzj){
							$jjmoney=$value['betamount']*$value['odds'];
							$save['WinLoss']=$jjmoney;
							$save['ProfitAndLoss']=$jjmoney-$value['betamount'];
							$this->ffmoney($value['uid'],$jjmoney,'发放奖金',0);
						}
						else{
							$save['WinLoss']=0;
							$save['ProfitAndLoss']=0-$value['betamount'];
						}
						$save['UpdateDt']=date('Y-m-d H:i:s',time());
						$map3['id']=$value['id'];
						M('bets')->where($map3)->save($save);

						$save2['betAmount']=$save2['betAmount']+$value['betamount'];
						$save2['zjCount']=$save2['zjCount']+$sfzj;
						$save2['zjAmount']=$save2['zjAmount']+$save['WinLoss'];
						$save2['pjed']=$save2['pjed']+$save['WinLoss'];
						$save2['fanDianAmount']=$save2['fanDianAmount']+$this->fsff($xx[$value['uid']][$value['betinfoid']][$value['betamount']][$value['playedid']]['fsxx']);
						$userlist[$value['uid']]=1;
						$betlist[$value['BetInfoID']]=1;
						$this->lhff($xx[$value['uid']][$value['betinfoid']][$value['betamount']][$value['playedid']]['lhxx'],$save['ProfitAndLoss'],$value['betamount']);
				}
				$save2['billCount']=$save2['billcount']+count($bets);
				$save2['userCount']=$save2['usercount']+count($userlist);
			}
				M('data')->where('id='.$id)->save($save2);
			}
			//拦货
			function lhff($json,$win,$money){
					$data=json_decode($json,true);
					foreach($data as $key => $value){
						$this->ffmoney($value['id'],$value['money']/$money*$win,'拦货','1');
					}
			}
			function fsff($json){
					$data=json_decode($json,true);
					$zmoney=0;
					foreach($data as $key => $value){
						$this->ffmoney($value['id'],$value['money'],'返水',$value['sfagent']);
						$zmoney=$value['money']+$zmoney;
					}
					return $zmoney;
			}
			function ffmoney($id,$money,$yuan,$sfagent){
				if($sfagent){
						$M=M('agent');
				}
				else{
						$M=M('user');
				}
				$map['id']=$id;
				//$user=$M->where($map)->setInc('money',$money);
			}
			function ssc1($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[0]==$number[0] && $betlist[1]==$number[1]){
					$result=1;
				}
				return $result;
			}
			function ssc2($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[0]==$number[0] && $betlist[2]==$number[2]){
					$result=1;
				}
				return $result;
			}
			function ssc3($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[0]==$number[0] && $betlist[3]==$number[3]){
					$result=1;
				}
				return $result;
			}
			function ssc4($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[1]==$number[1] && $betlist[3]==$number[3]){
					$result=1;
				}
				return $result;
			}
			function ssc5($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[2]==$number[2] && $betlist[1]==$number[1]){
					$result=1;
				}
				return $result;
			}
			function ssc6($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[2]==$number[2] && $betlist[3]==$number[3]){
					$result=1;
				}
				return $result;
			}
			function ssc7($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[3]==$number[3] && $betlist[4]==$number[4]){
					$result=1;
				}
				return $result;
			}
			function ssc8($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[0]==$number[0] && $betlist[4]==$number[4]){
					$result=1;
				}
				return $result;
			}
			function ssc9($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[0]==$number[0] && $betlist[1]==$number[1] && $betlist[2]==$number[2]){
					$result=1;
				}
				return $result;
			}
			function ssc10($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[0]==$number[0] && $betlist[1]==$number[1] && $betlist[3]==$number[3]){
					$result=1;
				}
				return $result;
			}
			function ssc11($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[0]==$number[0] && $betlist[2]==$number[2] && $betlist[3]==$number[3]){
					$result=1;
				}
				return $result;
			}
			function ssc12($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[2]==$number[2] && $betlist[1]==$number[1] && $betlist[3]==$number[3]){
					$result=1;
				}
				return $result;
			}
			function ssc13($bet,$data){
				$result=0;
				$number=explode(',', $data);
				$betlist=str_split($bet);
				if($betlist[0]==$number[0] && $betlist[1]==$number[1] && $betlist[2]==$number[2] && $betlist[3]==$number[3]){
					$result=1;
				}
				return $result;
			}
			function ssc14($bet,$data){
				$result=0;
				$number=explode(',', $data);
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
				$number=explode(',', $data);
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
				$number=explode(',', $data);
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



}