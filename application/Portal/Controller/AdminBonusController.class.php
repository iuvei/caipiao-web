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

class AdminBonusController extends AdminbaseController {

    protected $options_model;

    function _initialize() {
        parent::_initialize();
        $this->options_model = D("Common/Options");
    }
    /*
     * 奖金设置
     */
    public function bonusSet() {
        $option = $this->options_model->where("option_name='bonus'")->find();
        $this->assign(json_decode($option['option_value'], true));
        $this->assign("option_id", $option['option_id']);
        $this->assign("global_kj_is_enabled", is_system_openning_reward() ? 'Y' : 'N');
        $res=sp_get_option('bonus');
        $this->display();
    }
    public function bonusPost() {
        $bonus = I('post.options/a');
        $res = sp_set_option('bonus', $bonus);
        set_system_openning_reward($bonus['global_kj_is_enabled']);
        if ($res !== false) {
            $this->success("保存成功！");
        } else {
            $this->error("保存失败！");
        }
       
    }

    /**
     * 当前开奖状态
     */
    public function ajaxGetKjStatus() {
        header("Content-type: application/json");
        exit(json_encode(['status' => is_system_openning_reward() ? 'Y' : 'N']));
    }

    public function ajaxToggleKjStatus() {
        header("Content-type: application/json");
        $new_status = is_system_openning_reward() ? 'N' : 'Y';
        set_system_openning_reward($new_status);
        exit(json_encode(['status' => is_system_openning_reward() ? 'Y' : 'N']));
    }

    /*
     * 提款设置
     */
    public function extractSet() {
        $option = $this->options_model->where("option_name='extract'")->find();
        $this->assign(json_decode($option['option_value'], true));
        $this->assign("option_id", $option['option_id']);
        $this->display();
    }
    public function extractPost() {
        $extract = I('post.options/a');
        $res = sp_set_option('extract', $extract);
        if ($res !== false) {
            $this->success("保存成功！");
        } else {
            $this->error("保存失败！");
        }
    }


}