<?php

// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Tuolaji <479923197@qq.com>
// +----------------------------------------------------------------------

namespace Portal\Controller;

use Common\Controller\AdminbaseController;

class AdminMemberController extends AdminbaseController {

    protected $user_model;

 
    function _initialize() {
        parent::_initialize();
        $this->user_model = D("Portal/User");
 
    }


    /*
     * 计划管理  
     */
    public function index(){
        $this->display();
    }

    public function record(){
        $this->display();
    }

}
