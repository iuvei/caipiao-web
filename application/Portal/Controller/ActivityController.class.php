<?php
// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>
namespace Portal\Controller;

use Common\Controller\HomebaseController;

class ActivityController extends HomebaseController {

    protected $user_model;

    public function __construct() {
        parent::__construct();
//        $this->uid = session('uid');

    }
    public function index(){
        if($this->user){
            $tzje=M('coin_log')->where('uid='.$this->user[id].' and liqtype=4 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
            $tzje2=M('coin_log')->where('uid='.$this->user[id].' and liqtype=8 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
            $tzje3=M('coin_log')->where('uid='.$this->user[id].' and liqtype=17 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
            $this->assign('tzje',$tzje2+$tzje3-$tzje+0.00);
        }
        $this->display();
    }
    public function mrjl(){
        if($this->user[lqtime]>strtotime(date('Y-m-d 00:00:00',time()))){
            $this->msg('奖励你已经领取过了');
        }
        $tzje=M('coin_log')->where('uid='.$this->user[id].' and liqtype=4 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $tzje2=M('coin_log')->where('uid='.$this->user[id].' and liqtype=8 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $tzje3=M('coin_log')->where('uid='.$this->user[id].' and liqtype=17 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
        $tzjez=$tzje2+$tzje3-$tzje+0.00;


        $jjlist=explode(',',$bonus['jj_min']);
                $jllist=explode(',',$bonus['jj_jl']);
                $sjbl=0;
                foreach($jllist as $key=>$one){
                    $jlxx=explode('-',$one);
                    $jlbl=explode('#',$jlxx[1]);
                    $jllist[$key]=array();
                    $jllist[$key][xx]=$one;
                    $jllist[$key][jlxx]=$jlxx[0];
                    $jllist[$key][jlbl]=$jlbl;
                    if($jlxx[0]==$this->user[level]){
                        foreach($jlxx as $key=>$two){
                                if($tzjez>=$two){
                                    $sjbl=$jlbl[$key];
                                }
                        }
                    }
                }
                $sjjl=$tzjez*$sjbl/100;
                if($sjjl>0){
                moneybh($this->user[id],$sjjl,'活动礼金',array('liqtype'=>'7'));
                M('user')->where('id='.$this->user[id])->save(array('lqtime'=>time()));
                $this->msg('奖励领取成功','/index.php/Portal/Activity/index');
                }
                else{
                    $this->msg('奖励你已经领取过了');
                }
    }
    public function lqlevel(){
         $level=M('user_level')->select();
        if($this->user[level]==$this->user[lqlevel]){
            $this->msg('奖励你已经领取过了');
        }
        $jl=$level[($this->user[level]-1)][many_reward]-$level[($this->user[lqlevel]-1)][many_reward];
        moneybh($this->user[id],$jl,'活动礼金',array('liqtype'=>'7'));
        M('user')->where('id='.$this->user[id])->save(array('lqlevel'=>$this->user['level']));
        $this->msg('奖励领取成功','/index.php/Portal/Activity/index');
    }
    public function promotionRewards(){
        $user_id=session('uid');
        if($user_id){
            $tzje=M('coin_log')->where('uid='.$user_id.' and liqtype=4 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
            $tzje2=M('coin_log')->where('uid='.$user_id.' and liqtype=8 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
            $tzje3=M('coin_log')->where('uid='.$user_id.' and liqtype=17 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
            $this->assign('tzje',$tzje2+$tzje3-$tzje+0.00);
            $user=M('user')->where(array('id'=>$user_id))->find();
            $this->assign('users',$user);
        }
        $this->assign('isuser',$user_id);
    	$this->display();
    }
    public function dayPrice(){
        $user_id=session('uid');
        if($user_id){
            $tzje=M('coin_log')->where('uid='.$user_id.' and liqtype=4 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
            $tzje2=M('coin_log')->where('uid='.$user_id.' and liqtype=8 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
            $tzje3=M('coin_log')->where('uid='.$user_id.' and liqtype=17 and actionTime>='.strtotime(date('Y-m-d 00:00:00',time())))->sum('coin');
            $this->assign('tzje',$tzje2+$tzje3-$tzje+0.00);
            $user=M('user')->where(array('id'=>$user_id))->find();
            $this->assign('users',$user);
        }
        $this->assign('isuser',$user_id);
    	$this->display();
    }
    public function holidayGift(){
    	$this->display();
    }


}