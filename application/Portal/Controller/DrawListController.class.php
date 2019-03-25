<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class DrawListController extends HomebaseController {

    protected $user_model;
    
    public function __construct() {
        parent::__construct();
         $this->check_login();
        $this->user_model = M('user');//打款凭证
    }
    public function Index(){
        $this->display();
    }
    public function GetLotteryResult(){
        header('Content-type: application/json');
        $start=$_GET['StartDate'];
        $end=$_GET['EndDate'];
        $where['time']=array('between',strtotime($start."00:00:00").','.strtotime($end."23:59:59"));
        $count=M('data')->where($where)->count();
        $list=M('data')->where($where)->limit((($_GET['pageIndex']-1)*50).',50')->order('time desc')->select();
        $PageCount=ceil($count/50);
        $list2=array();
        foreach ($list as $key => $value) {
            $list2[$key][CreateDt]=date('Y-m-d H:i:s',$value['time']);
            $list2[$key][DrawDt]=date('Y-m-d H:i:s',$value['time']);
            $list2[$key][OpenDt]=date('Y-m-d H:i:s',$value['time']);
            $list2[$key][ID]=$value['number'];
            $list2[$key][PeriodsNumber]=$value['number'];
            $list2[$key][ResultNumber]=$value['data'];
        }
        $data['list']=$list2;
        $data['PageCount']=$PageCount;
        echo json_encode($data);
    }
}
