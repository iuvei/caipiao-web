<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

use Common\Controller\HomebaseController;

class HomeController extends HomebaseController {

    protected $user_model;
    
    public function __construct() {
        parent::__construct();
         $this->check_login();
         if($this->user['first']==0 && ACTION_NAME!='ChangePwdOne' && ACTION_NAME!='EditPassword2'){
          header("Location: /index.php/portal/home/ChangePwdOne");
          exit();
         }
//        $this->uid = session('uid');
//        $this->user_login = session('user_login');
//        $this->user_model = D("Portal/User");
//        $this->user = $this->user_model->find($this->uid);
//        $this->assign('user', $this->user);

        $this->user_model = M('user');//打款凭证
    }
    public function ChangePwdOne(){
      $this->display();
    }
    public function DisclaimerStatement(){
      $this->display();
    }
    public function DisclaimerStatement2(){
      $this->display();
    }
    public function index() {
        $this->display();
    }
    public function Main(){
        $this->display();
    }
  public function online() {
      session_start();
      $data = array();
      $data['token'] = time();
      $_SESSION['token'] = $data['token'];
      $res = M('user')->where(array('id' => $_SESSION['uid']))->save($data);
      if ($res) {
        $r = $data['token'];
        echo json_encode(array('data' => $r));
      }
    }
    public function sprint(){
        $this->display();
    }
    public function Setting(){
        $this->display();
    }
        public function EditPassword2(){
      header('Content-type: application/json');
      if($_POST['isAdvancedPassword']=='true'){
        $fs='user_pass2';
      }
      else{
        $fs='user_pass';
      }
      if($this->user[$fs]!=md5($_POST['oldpassword'])){
        $this->ejson('原密码错误');
      }
      if($_POST['password']!=$_POST['password1']){
        $this->ejson('两次密码不同');
      }
      $save[$fs]=md5($_POST['password']);
      $save['first']='1';
      M('user')->where(array('id'=>$this->user['id']))->save($save);
      $data['status']=true;
      $data['info']="修改成功";
      echo json_encode($data);
    }
    public function InportTxt(){
      error_reporting(E_ALL);
      $fs=0;
      $money=0;
      if($_FILES){
      if($_FILES["file"]["type"]!='text/plain'){
            $this->msg('请上传txt文件格式');
        }

      $msg=file_get_contents($_FILES["file"]["tmp_name"]);
      // if(!(preg_match('%^(?:[\x09\x0A\x0D\x20-\x7E]| [\xC2-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF]|\xF0[\x90-\xBF][\x80-\xBF]{2}| [\xF1-\xF3][\x80-\xBF]{3}|\xF4[\x80-\x8F][\x80-\xBF]{2})*$%xs', $msg))){
      //   $msg=mb_convert_encoding($msg, "GB2312","UTF-8");
      // }
      $msg=preg_replace("/[^0-9|a-z|A=Z|,|=]{1}/",',',$msg);
          // $result=preg_match_all("/[^0-9|a-z|A=Z|,]{1}/",$msg,$list);
          // print_r($list);
      // echo $msg;
      $msg=str_replace("，",",",$msg);
      $msg=str_replace(" ",",",$msg);
      $msg=str_replace("x","X",$msg);
      $msg=str_replace("A","a",$msg);
      $list=explode(',', $msg);
      $fs=1;
      if(strstr($list[0], '=')){
        $fs=2;
      }
        $bet=array();
        $key=0;
        $betlist=array();
        $betxx=array();
        if($fs==1){
          foreach ($list as $key => $value) {
              if(preg_match("/^\d{1}XXX$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'20');
                    }
              }

              if(preg_match("/^X\d{1}XX$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'21');
                    }
              }

              if(preg_match("/^XX\d{1}X$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'22');
                    }
              }

              if(preg_match("/^XXX\d{1}$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'23');
                    }
              }

              if(preg_match("/^XXXX\d{1$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'24');
                    }
              }
              if(preg_match("/^\d{2}XX$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'2');
                    }
              }
              if(preg_match("/^X\d{2}X$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'6');
                    }
              }
              if(preg_match("/^XX\d{2}$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'7');
                    }
              }
              if(preg_match("/^\d{1}X\d{1}X$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'3');
                    }
              }
              if(preg_match("/^X\d{1}X\d{1}$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'5');
                    }
              }
              if(preg_match("/^\d{1}XX\d{1}$/",$value)){
                    if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'4');
                    }
              }
              if(preg_match("/^XXX\d{2}$/",$value)){
                  if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'17');
                    }
              }
              if(preg_match("/^\d{1}XXX\d{1}$/",$value)){
                  if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'18');
                    }
              }
              if(preg_match("/^\d{3}X$/",$value)){
                  if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'9');
                    }
              }
              if(preg_match("/^X\d{3}$/",$value)){
                  if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'12');
                    }
              }
              if(preg_match("/^\d{1}X\d{2}$/",$value)){
                  if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'11');
                    }
              }
              if(preg_match("/^\d{2}X\d{1}$/",$value)){
                  if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'10');
                    }
              }
              if(preg_match("/^\d{2}$/",$value)){
                  if(!in_array($value.'<span style="color:red">现</span>', $bet)){
                    $bet[]=$value.'<span style="color:red">现</span>';
                    $bet2[]=array('num'=>$value,'betTypeId'=>'14');
                  }
              }
              if(preg_match("/^\d{3}$/",$value)){
                if(!in_array($value.'<span style="color:red">现</span>', $bet)){
                  $bet[]=$value.'<span style="color:red">现</span>';
                  $bet2[]=array('num'=>$value,'betTypeId'=>'15');
                }
              }
              if(preg_match("/^\d{4}$/",$value)){
                  if(!in_array($value, $bet)){
                    $bet[]=$value;
                    $bet2[]=array('num'=>$value,'betTypeId'=>'13');
                    }
              }
              if(preg_match("/^a\d{4}$/",$value)){
                  $numlist=str_split($value);
                  $value=$numlist[1].$numlist[2].$numlist[3].$numlist[4];
                  if(!in_array($value.'<span style="color:red">现</span>', $bet)){
                    $bet[]=$value.'<span style="color:red">现</span>';
                    $bet2[]=array('num'=>$value,'betTypeId'=>'16');
                  }
              }
          }
        }
        if($fs==2){
            foreach ($list as $key => $one){
              $xx=explode('=', $one);
              $value=$xx[0];
              if(preg_match("/^\d*$/",$xx[1])){
                if(preg_match("/^\d{2}XX$/",$value)||preg_match("/^\d{1}XXd{1}$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'2');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^\d{1}XX\d{1}$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'4');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }


                if(preg_match("/^\d{1}XXX$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'20');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }

                if(preg_match("/^\Xd{1}XX$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'21');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }

                if(preg_match("/^\XXd{1}X$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'22');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }


                if(preg_match("/^\XXXd{1}$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'23');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }


                if(preg_match("/^\XXXXd{1}$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'24');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^X\d{2}X$/",$value)){
                    if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'6');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^XX\d{2}$/",$value)){
                    if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'7');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^\d{1}X\d{1}X$/",$value)){
                    if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'3');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^X\d{1}X\d{1}$/",$value)){
                    if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'5');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^XXX\d{2}$/",$value)){
                    if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'17');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^\d{1}XXX\d{1}$/",$value)){
                    if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'18');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^\d{3}X$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'9');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^X\d{3}$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'12');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^\d{1}X\d{2}$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'11');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^\d{2}X\d{1}$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'10');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^\d{2}$/",$value)){
                    if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value.'<span style="color:red">现</span>','money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'14');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^\d{3}$/",$value)){
                      if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value.'<span style="color:red">现</span>','money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'15');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^\d{4}$/",$value)){
                   if(!in_array($value, $betlist)){
                        $bet[]=array('xx'=>$value,'money'=>$xx[1]);
                        $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'13');
                        $betlist[$key]=$value;
                        $betxx[$value]=$key;
                        $key=$key+1;
                      }
                      else{
                        $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                        $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                      }
                      $money=$money+$xx[1];
                }
                if(preg_match("/^a\d{4}$/",$value)){
                  $numlist=str_split($value);
                  $value=$numlist[1].$numlist[2].$numlist[3].$numlist[4];
                  if(!in_array($value, $betlist)){
                      $bet[]=array('xx'=>$value.'<span style="color:red">现</span>','money'=>$xx[1]);
                      $bet2[]=array('num'=>$value,'money'=>$xx[1],'betTypeId'=>'16');
                      $betlist[$key]=$value;
                      $betxx[$value]=$key;
                      $key=$key+1;
                    }
                    else{
                      $bet[$betxx[$value]]['money']=$bet[$betxx[$value]]['money']+$xx[1];
                      $bet2[$betxx[$value]]['money']=$bet2[$betxx[$value]]['money']+$xx[1];
                    }
                    $money=$money+$xx[1];
                }
            }
          }
        }
      }
      $result['fs']=$fs;
      $result['betlist']=$bet2;
      $result['hjmoney']=$money;
      \DataCollector::set(DEV_DATA_PATH . 'tmp/txt'.$this->user["id"],json_encode($result));
      $this->assign('fs',$fs);
      $this->assign('bet',$bet);
      $this->display();
    }
    public function BetSubmit(){
        header('Content-type: application/json');
        //$this->ejson("该投注通道暂时关闭,有问题请联系管理员");
        $type=M('type')->where(array('id'=>'1'))->find();
        $lottery_interval = get_lottery_interval($type);
        $now=getnow('1',$type['data_ftime'] + 3);
        $data['DrawDt']=date('Y/m/d '.$now['now'],time()+$now['day'] * 3600 * 24);
        $data['OpenDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt']) - $lottery_interval);
        if(time()<=strtotime($data['OpenDt'])){
            $this->ejson("下注失败"); 
        }
        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];

        $commission=json_decode($this->user['commission'],true);
        $sjcommission=json_decode($this->user['sjcommission'],true);
        $sj=\DataCollector::get(DEV_DATA_PATH . 'tmp/txt'.$this->user["id"]);
        $result=json_decode($sj,true);
        if($result['fs']==0 || empty($result['fs'])){
            $this->ejson("请先上传文件");
        }
        if($result['fs']==1){
            $money=count($result['betlist'])*$_POST['Money'];
        }
        if($result['fs']==2){
          $money=$result['hjmoney'];
        }
        if($this->user['money']<$money){
            $this->ejson("信用额度不足");
        }
        $data=array();
        $money=0;
        $sbetlist=$result['betlist'];


            $BetInfoID=time();
            $bet=array();
            $bet['uid']=$this->user['id'];
            $bet['BetAmount']=0;
            $bet['Odds']='';
            $bet['BetNumber']='';
            $bet['BetDt']=$this->time;
            $bet['PeriodsNumber']=$PeriodsNumber;
            $bet['BetInfoID']=$BetInfoID;
            $bet['PeriodsID']=$PeriodsNumber;
            $bet['typeid']=1;
            $bet['playedId']=0;
            $bet['BetIP']=get_client_ip(0, true, $this->user);
            $bet['BackBetIP']=get_client_ip(0, true, $this->user);
            $bet['ProfitAndLoss']=0;
            $bet['UpdateDt']=$this->time;
            $bet['BackComm']=0;
            $bet['BetWayID']='txt导入';
            $bet["count"]=0;
            $count=0;


            $curernt_bet_list = $sbetlist;
            $count_low_odds = ceil(count($curernt_bet_list) * 0.1);
            $low_odds_index_list = array_rand($curernt_bet_list, $count_low_odds);
            $low_odds_index_list = is_array($low_odds_index_list) ? $low_odds_index_list : [$low_odds_index_list];
            foreach ($sbetlist as $key => $value) {
                    $map['betTypeId']=$value['betTypeId'];
                    $played=M('played')->where($map)->find();


                    if($this->user["periodsnumber"]==$PeriodsNumber){
                              $xxx=\DataCollector::get(DEV_DATA_PATH . 'tmp/storexx_'.md5($this->user["id"])."text");
                              $storexx=json_decode($xxx,true);
                      }
                      else{
                              $storexx=array();
                      }
                    //$store=storexx($this->uid,$value['num'],$PeriodsNumber);
                    //$store2=storexx2($this->uid,$played['id'],$PeriodsNumber);

                    if(!$value['money']){
                      $value['money']=$_POST['Money'];
                    }

                    $money=$money+$value['money'];

             $typemoney[$value['num']]=$typemoney[$value['num']]+$value['money'];
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
              $store=$maxcount-$store+0;
            //$store2=$maxcount-$store2+0;//能够下注
            if($minamount>$value['money']){
                $this->ejson("下注单额超过下限".$minamount."元");
            }

                if($maxbet<$typemoney[$value['num']] || $maxcount<$value['money']+$storexx[$value]+0 ){
                    $money=$money-$value['money'];
                    $typemoney[$played['id']]=$typemoney[$played['id']]-$value['money'];
                    $add=array();
                    $add['uid']=$this->user['id'];
                    $add['PeriodsNumber']=$PeriodsNumber;
                    $add['BetTypeID']=$value['betTypeId'];
                    $add['BetNumber']=$value['num'];
                    $add['BetAmount']=$value['money'];
                    $add['IsDelete']=0;
                    $add['CreateDt']=$this->time;
                    $add['UpdateDt']=$this->time;
                    $data2[]=$add;
                    $isStopNum=55;
                    if(count($data2)==500){
                        M("bet2")->addAll($data2);
                        $data2=array();
                    }
                }
                else{
                    $storexx[$value]=$storexx[$value]+$value['money']+0;
                    $add=array();
                    $add['BetTypeID']=$played['bettypeid'];
                    $add['BetAmount']=$value['money'];
                    $bet['BetAmount']+=$value['money'];
                    $is_low_odds = in_array($key, $low_odds_index_list);
                    $add['Odds']=getodds($played,$this->user,$value['num'], $is_low_odds, $value["money"]);
                    $add['playedId']=$played['id'];
                    $add['ProfitAndLoss']=0;
                    $add['BetDt']=$this->time;
                    $add['PeriodsNumber']=$PeriodsNumber;
                    $add['BetInfoID']=$BetInfoID;
                    $add['BetNumber']=$value['num'];
                    $add['BackComm']=($sjcommission[$played['bettypeid']]['Commission']-$commission[$played['bettypeid']]['Commission'])*$value['money'];
                    $bet['BackComm']+=$add['BackComm'];
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
        //   foreach ($data as $key => $value) {
        //     $add=array();
        //     $add['uid']=$this->user['id'];
        //     $add['BetAmount']=$value['BetAmount'];
        //     $add['Odds']=$value['Odds'];
        //     $add['BetNumber']=$value['BetNumber'];
        //     $add['BetDt']=$this->time;
        //     $add['PeriodsNumber']=$PeriodsNumber;
        //     $add['BetInfoID']=time();
        //     $add['PeriodsID']=$PeriodsNumber;
        //     $add['typeid']=1;
        //     $add['playedId']=$value['playedId'];
        //     $add['BetIP']=get_client_ip(0, true, $this->user);
        //     $add['BackBetIP']=get_client_ip(0, true, $this->user);
        //     $add['ProfitAndLoss']=0-$value['BetAmount'];
        //     $add['UpdateDt']=$this->time;
        //     $add['BackComm']=($sjcommission[$value['BetTypeID']]['Commission']-$commission[$value['BetTypeID']]['Commission'])*$value['BetAmount'];
        //     $add['BetWayID']='txt导入';
        //     $res=M('bets')->add($add);
        //     //$this->betfslh($res);
        // }
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


        \DataCollector::set(DEV_DATA_PATH . 'tmp/storexx_'.md5($this->user["id"])."text",json_encode($storexx));
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
    public function Rule(){
      $this->display();
    }
    public function ChangePwd(){
      $this->display();
    }
    public function ModifyBetLeftClear(){
        header('Content-type: application/json');
        $now=getnow('1');
        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $map['PeriodsNumber']=$PeriodsNumber;
        $save['leftzt']=1;
        $save['uid'] = $this->user['id'];
        M('userbet'.$this->user['id'])->where($map)->save($save);
        $data['info']='操作成功';
        $data['status']=true;
        echo json_encode($data);
    }
    public function GetMemberCredit(){
        header('Content-type: application/json');

        $now=getnow('1');
        $PeriodsNumber=date('ymd',time()+$now['day']*3600*24).$now['hm'];
        $map['zt']=0;
        $map['uid']=$this->user['id'];
        $map['PeriodsNumber']=$PeriodsNumber;
        $betlist=M('bets')->where($map)->select();
        $list=array();
        foreach ($betlist as $key => $value) {
            $list[$key]['LotteryID']=$value['typeid'];
            $list[$key]['BetDetailID']=$value['id'];
            $list[$key]['BetInfoID']=$value['betinfoid'];
            $list[$key]['PeriodsID']=$value['periodsid'];
            $list[$key]['PeriodsNumber']=$value['periodsnumber'];
            $list[$key]['BetDt']=$value['betdt'];
            $list[$key]['BetNumber']=$value['betnumber'];
            $list[$key]['BetAmount']=$value['betamount'];
            $list[$key]['BetTypeID']=$value['playedid'];
            $list[$key]['Odds']=$value['odds'];
        }
        $data['UserName']=$this->user[user_login];
        $data['Credit']=sprintf("%.1f",$this->user[money]);
        $data['UsedCredit']=$this->user[yymoney];
        $data['CancelBet']=2;
        $data['SecondStopEarly']='0';
        $data['BetInfo']=$list;
        $data['C']=false;
        echo json_encode($data);
    }
    public function ChangePassword(){
      header('Content-type: application/json');
       if($this->user['user_pass']!=md5($_POST['oldpassword'])){
          $this->ejson('原密码错误');
       }
       if($_POST['password']!=$_POST['password1']){
          $this->ejson('两次密码输入不相同');
       }
       $save['user_pass']=md5($_POST['password']);
       M('user')->where(array('id'=>$this->user['id']))->save($save);
       $data['status']=true;
       $data['info']='密码修改成功,请重新登录！';
       echo json_encode($data);
    }
    public function GetLastPeriods(){
        header('Content-type: application/json');
        session_start();

        // 禁用则直接踢出
        $is_forbidden = false;
        if ($this->user['user_status'] != 1) {
            $is_forbidden = true;
        } else {
          // 逐级检查上级
          $path = get_array_unique_id_list(explode('-', $this->user['agentpath']));
          foreach ($path as $tmp_parent_aid) {
              $tmp_parent = M("agent")->find($tmp_parent_aid);
              if ($tmp_parent['user_status'] != 1) {
                $is_forbidden = true;
                break;
              }
          }
        }
        $is_forbidden && $_SESSION['token'] = time();

         if($_SESSION['token'] != $this->user['token']) {
          $data['status'] = false;
          $data['isCheckOnline'] = true;
          $data['info'] = $is_forbidden ? '您已经被踢出，账号或上级账号被锁住' : '您已经被踢出，请重新登录！';
          session_write_close();
         }
         else{  
        $_SESSION['token']=time();
         $ssave['token']= $_SESSION['token'];
         session_write_close();
         M('user')->where(array('id'=>$this->user['id']))->save($ssave);
        $data['CompanyID']=1;
          $type=M('type')->where(array('id'=>'1'))->find();
          $lottery_interval = get_lottery_interval($type);
          $now=getnow('1',$type['data_ftime']);
          $data['DrawDt']=date('Y/m/d '.$now['now'],time()+$now['day'] * 86400);
          $data['CloseDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt'])-$type['data_ftime']);
          $data['OpenDt']=date('Y/m/d H:i:s',strtotime($data['DrawDt']) - $lottery_interval);
          $data['PeriodsNumber']=date('ymd',time()+$now['day'] * 86400).$now['hm'];

          $data['ID']=$data['PeriodsNumber'];
          $data['status']=true;
          $data['info']='获取成功';
          $dataxx=M('data')->order('time desc')->find();
          $data['dw']['c_t']=$dataxx['number'];
          $data['dw']['c_d']=date('Y/m/d H:i:s',$dataxx['time']);
          $data['dw']['c_r']=$dataxx['data'];
          $data['nowDateTime']=date('Y/m/d H:i:s',time());
          if(time()>strtotime($data['OpenDt'])){
            $data['PeriodsStatus']=(int)$type['enable']; 
          }
          else{
            $data['PeriodsStatus']=0;
          }
          //$data['PeriodsStatus']=0;
        }
        echo json_encode($data);//echo '{"CompanyID":"16969","ID":"285927","CloseDt":"2017/7/23 9:59:00","DrawDt":"2017/7/23 10:00:00","OpenDt":"2017/7/23 9:50:00","PeriodsStatus":0,"status":true,"PeriodsNumber":"20170723024","info":"获取成功","nowDateTime":"2017-7-23 9:14:40","dw":{"c_t":"20170723023","c_d":"2017-07-23 03:00:07","c_r":"6,8,3,9,3"}}';
    }
    public function GetUserLoginNoticeByType(){
      header('Content-type: application/json');
      $map['term_id']='9';
      $term=M('term_relationships')->where($map)->order('object_id desc')->find();
      $map2['id']=$term['object_id'];
      $post=M('posts')->where($map2)->find();
      if($post){
      echo '[
  "636370464405830098",
  [
    {
      "ID": 53,
      "Title": "敬请注意",
      "ShowType": 1,
      "TargetObject": 2,
      "AdminId": 16969,
      "AdminLoginName": "ff77",
      "AdminNickName": "公司",
      "Detail": ' . enjson($post['post_content']) . ',
      "BeginDt": "2017-07-30 18:31:00",
      "EndDt": "2022-08-05 19:01:00",
      "CreateDt": "0001-01-01 00:00:00",
      "UpdateDt": "2017-07-30 18:44:37",
      "IsSpecified": false,
      "CompanyType": 1
    }
  ]
]';
}
  else{
    echo '[
  "636370464405830098"]';
  }
    }

}
