<?php
// +----------------------------------------------------------------------
// | ThinkCMF [ WE CAN DO IT MORE SIMPLE ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013-2014 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: Dean <zxxjjforever@163.com>
namespace Portal\Controller;

use Common\Controller\HomebaseController;

class AboutController extends HomebaseController {

    protected $term_relationships_model;
    protected $posts;

    public function __construct() {
        parent::__construct();
        $this->posts = M('posts');
        $this->term_relationships_model = D("Portal/TermRelationships");


    }
    public function index(){

        $tag='cid:5;order:listorder asc';
        $post=sp_sql_posts($tag); 
        $this->assign('list',$post);
        $id=I('get.id');
        $post=$post[$id];

        $this->assign('post',$post);
        $this->display();
    }
   

}
