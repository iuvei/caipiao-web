<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>

namespace Portal\Controller;

class UserController {

    protected $user_model;


    public function __construct() {
        parent::__construct();
        $this->check_login();
//        $this->uid = session('uid');
//        $this->user_login = session('user_login');
//        $this->user_model = D("Portal/User");
//        $this->user = $this->user_model->find($this->uid);
//        $this->assign('user', $this->user);

    }

    public function index(){
        $this->display();
    }

}
