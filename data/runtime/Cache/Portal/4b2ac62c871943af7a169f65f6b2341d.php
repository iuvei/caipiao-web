<?php if (!defined('THINK_PATH')) exit();?><!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
	<!-- Set render engine for 360 browser -->
	<meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- HTML5 shim for IE8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <![endif]-->

	<link href="/public/simpleboot/themes/<?php echo C('SP_ADMIN_STYLE');?>/theme.min.css" rel="stylesheet">
    <link href="/public/simpleboot/css/simplebootadmin.css" rel="stylesheet">
    <link href="/public/js/artDialog/skins/default.css" rel="stylesheet" />
    <link href="/public/simpleboot/font-awesome/4.4.0/css/font-awesome.min.css"  rel="stylesheet" type="text/css">
    <style>
		form .input-order{margin-bottom: 0px;padding:3px;width:40px;}
		.table-actions{margin-top: 5px; margin-bottom: 5px;padding:0px;}
		.table-list{margin-bottom: 0px;}
	</style>
	<!--[if IE 7]>
	<link rel="stylesheet" href="/public/simpleboot/font-awesome/4.4.0/css/font-awesome-ie7.min.css">
	<![endif]-->
	<script type="text/javascript">
	//全局变量
	var GV = {
	    ROOT: "/",
	    WEB_ROOT: "/",
	    JS_ROOT: "public/js/",
	    APP:'<?php echo (MODULE_NAME); ?>'/*当前应用名*/
	};
	</script>
    <script src="/public/js/jquery.js"></script>
    <script src="/public/js/wind.js"></script>
    <script src="/public/simpleboot/bootstrap/js/bootstrap.min.js"></script>
    <script>
    	$(function(){
    		$("[data-toggle='tooltip']").tooltip();
    	});
    </script>
<?php if(APP_DEBUG): ?><style>
		#think_page_trace_open{
			z-index:9999;
		}
	</style><?php endif; ?>
</head>
<body>
    <div class="wrap">
        <ul class="nav nav-tabs">
            <li class="active"><a href="<?php echo U('Portal/AdminSystem/lottery_typeset');?>">所有彩种</a></li>
            <li ><a href="<?php echo U('Portal/AdminSystem/add_lottery_typeset');?>" >添加彩种</a></li>
        </ul>

        <form method="post" class="js-ajax-form"  action="<?php echo U('PortalAdminSystem/edit_lottery_typeset');?>"> 
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th align="center">ID</th>
                        <th>彩种名称</th>
                        <th style="vertical-align:middle; text-align:center;">彩种简称</th>
                        <th>彩种类别</th>
                        <th style="vertical-align:middle; text-align:center;">停止投注时间</th>
                        <th style="vertical-align:middle; text-align:center;">状态</th>
                        <th style="vertical-align:middle; text-align:center;">排序</th>
                        <th style="vertical-align:middle; text-align:center;">彩种期数</th>
                        <th style="width:200px;" align="center">操作</th>
                    </tr>
                </thead>
                <?php $state[0]='关'; $state[1]='开'; $lx[1]='快3'; $lx[2]='时时彩'; $lx[3]='11选5'; ?>
                <tbody>
                    <?php if(is_array($list)): foreach($list as $key=>$vo): ?><tr>
                        <td align="center"><?php echo ($vo["id"]); ?></td>
                        <td style="vertical-align:middle; text-align:center;"><?php echo ($vo["title"]); ?></td>
                        <td style="vertical-align:middle; text-align:center;"><?php echo ($vo["name"]); ?></td>
                        <td style="vertical-align:middle; text-align:center;"><?php echo ($lx[$vo[type]]); ?></td>
                        <td style="vertical-align:middle; text-align:center;"><?php echo ($vo["data_ftime"]); ?></td>
                        <td style="vertical-align:middle; text-align:center;"><?php echo ($state[$vo[enable]]); ?></td>
                        <td style="vertical-align:middle; text-align:center;"><?php echo ($vo["sort"]); ?></td>
                        <td style="vertical-align:middle; text-align:center;"><?php echo ($vo["num"]); ?></td>
                        <td align="center">
                            <a href='<?php echo U("AdminSystem/edit_lottery_typeset",array("id"=>$vo["id"]));?>'>基础设置</a> |
                            <a href='<?php echo U("AdminSystem/played_set",array("id"=>$vo["id"]));?>'>玩法配置</a> |
                            <a href='<?php echo U("AdminSystem/data_set",array("id"=>$vo["id"]));?>'>时间配置</a> |
                            <a href='<?php echo U("AdminSystem/cjlist",array("id"=>$vo["id"]));?>'>采集配置</a> |
                            <a class="js-ajax-delete" href='<?php echo U("AdminSystem/del_lottery_typeset",array("id"=>$vo["id"]));?>'>删除</a> 
                        </td>
                    </tr><?php endforeach; endif; ?>
                </tbody>
            </table>
            <div class="pagination"><?php echo ($page); ?></div>
        </form>
    </div>
    <script src="/public/js/common.js"></script>
</body>
</html>