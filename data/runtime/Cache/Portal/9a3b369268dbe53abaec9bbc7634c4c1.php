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
    <div class="wrap js-check-wrap">
        <ul class="nav nav-tabs">
            <li class="active"><a href="javascript:;">开奖列表</a></li>
            <li><a href="<?php echo U('Portal/AdminOrder/add_kaijiang');?>" >添加开奖</a></li>
        </ul>
        <form class="well form-search" method="post" action="<?php echo U('Portal/AdminOrder/kaijiang');?>">
            彩种:
            <select name="type" style="width: 120px;">
                <option value="0">全部</option>
                <?php if(is_array($typelist)): foreach($typelist as $key=>$one): ?><option value="<?php echo ($one["id"]); ?>" <?php if($get['type'] == $one['id']): ?>selected<?php endif; ?>><?php echo ($one["title"]); ?></option><?php endforeach; endif; ?>          
            </select>&nbsp; &nbsp;
            期号:
            <input type="text" name="number" style="width: 200px;" value="<?php echo ($get["number"]); ?>" placeholder="请输入期号"> 
            时间：
            <input type="text" name="start_time" class="js-datetime" value="<?php echo ((isset($get["start_time"]) && ($get["start_time"] !== ""))?($get["start_time"]):''); ?>" style="width: 120px;" autocomplete="off">-
            <input type="text" name="end_time" class="js-datetime"  value="<?php echo ((isset($get["end_time"]) && ($get["end_time"] !== ""))?($get["end_time"]):''); ?>" style="width: 120px;" autocomplete="off"> &nbsp; &nbsp;

            <input type="submit" class="btn btn-primary" value="搜索" />
        </form>
        <form class="well form-search" method="post" action="<?php echo U('Portal/AdminOrder/kaijiang2');?>">
            彩种:
            <select name="type" style="width: 120px;">
                <option value="0">全部</option>
                <?php if(is_array($typelist)): foreach($typelist as $key=>$one): ?><option value="<?php echo ($one["id"]); ?>"><?php echo ($one["title"]); ?></option><?php endforeach; endif; ?>          
            </select>&nbsp; &nbsp;
            时间：
            <input type="text" name="start_time" class="js-date" value="<?php echo ((isset($formget["start_time"]) && ($formget["start_time"] !== ""))?($formget["start_time"]):''); ?>" style="width: 120px;" autocomplete="off"> &nbsp; &nbsp;
            <input type="submit" class="btn btn-primary" value="遗漏查询"/>
        </form>
        <form class="js-ajax-form" action="" method="post">

            <table class="table table-hover table-bordered table-list">
                <thead>
                <tr>    
                <th width="50">ID</th>
                <th>彩种</th>
                <th>期号</th>
                <th>开奖号码</th>
                <th>订单数量</th>
                <th>中奖注数</th>
                <th>参与人数</th>
                <th>投注金额</th>
                <th>中奖金额</th>
                <th>返点金额</th>
                <th>开奖时间</th>
                <th>操作项</th>
                </tr>
                </thead>

                <?php if(is_array($posts)): foreach($posts as $key=>$vo): ?><tr>
                    <td><b><?php echo ($vo["id"]); ?></b></td>
                    <td><?php echo (type($vo["type"])); ?></td>
                    <td><?php echo ($vo["number"]); ?></td>
                    <td><?php echo ($vo["data"]); ?></td>
                    <td><?php echo ($vo["billcount"]); ?></td>
                    <td><?php echo ($vo["zjcount"]); ?></td>
                    <td><?php echo ($vo["usercount"]); ?></td>
                    <td><?php echo ($vo["betamount"]); ?></td>
                    <td><?php echo ($vo["zjamount"]); ?></td>
                    <td><?php echo ($vo["fandianamount"]); ?></td>
                    <td><?php echo (datatime($vo["time"])); ?></td>
                    
                    <td>
                        <a href="<?php echo U('Portal/AdminOrder/delkaijiang',array('id'=>$vo['id']));?>" class="js-ajax-delete">删除号码</a>|
                        <!--<a href="<?php echo U('Portal/Date2/kj',array('id'=>$vo['id']));?>" class="js-ajax">重新统计</a>|-->
                        <a href="<?php echo U('Portal/Date/kj',array('id'=>$vo['id']));?>" class="js-ajax">发放奖金</a>
                    </td>
                    </tr><?php endforeach; endif; ?>
               
            </table>
            <div class="pagination"><?php echo ($page); ?></div>
        </form>
    </div>
    <script src="/public/js/common.js"></script>
    <script>
        function refersh_window() {
            var refersh_time = getCookie('refersh_time');
            if (refersh_time == 1) {
                window.location = "<?php echo U('AdminPost/index',$formget);?>";
            }
        }
        setInterval(function() {
            refersh_window();
        }, 2000);
        $(function() {
            setCookie("refersh_time", 0);
            Wind.use('ajaxForm', 'artDialog', 'iframeTools', function() {
                //批量复制
                $('.js-articles-copy').click(function(e) {
                    var ids = [];
                    $("input[name='ids[]']").each(function() {
                        if ($(this).is(':checked')) {
                            ids.push($(this).val());
                        }
                    });

                    if (ids.length == 0) {
                        art.dialog.through({
                            id: 'error',
                            icon: 'error',
                            content: '您没有勾选信息，无法进行操作！',
                            cancelVal: '关闭',
                            cancel: true
                        });
                        return false;
                    }

                    ids = ids.join(',');
                    art.dialog.open("/index.php?g=portal&m=AdminPost&a=copy&ids=" + ids, {
                        title: "批量复制",
                        width: "300px"
                    });
                });
                //批量移动
                $('.js-articles-move').click(function(e) {
                    var ids = [];
                    $("input[name='ids[]']").each(function() {
                        if ($(this).is(':checked')) {
                            ids.push($(this).val());
                        }
                    });

                    if (ids.length == 0) {
                        art.dialog.through({
                            id: 'error',
                            icon: 'error',
                            content: '您没有勾选信息，无法进行操作！',
                            cancelVal: '关闭',
                            cancel: true
                        });
                        return false;
                    }

                    ids = ids.join(',');
                    art.dialog.open("/index.php?g=portal&m=AdminPost&a=move&old_term_id=<?php echo ((isset($term["term_id"]) && ($term["term_id"] !== ""))?($term["term_id"]):0); ?>&ids=" + ids, {
                        title: "批量移动",
                        width: "300px"
                    });
                });
            });
        });
    </script>
</body>
</html>