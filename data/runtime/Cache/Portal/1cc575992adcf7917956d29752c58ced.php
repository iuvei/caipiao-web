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
            <li class="active"><a href="javascript:;">投注列表</a></li>
        </ul>
        <form class="well form-search" method="post" action="<?php echo U('Portal/AdminOrder/index');?>">
            用户id:
            <input type="text" name="uid" style="width: 200px;" value="<?php echo ($get["uid"]); ?>" placeholder="请输入用户id">
            用户名:
            <input type="text" name="user_login" style="width: 200px;" value="<?php echo ($get["user_login"]); ?>" placeholder="请输入用户名">
            彩种:
            <select name="type" style="width: 120px;">
                <option value="">全部</option>
                <?php if(is_array($typelist)): foreach($typelist as $key=>$one): ?><option value="<?php echo ($one["id"]); ?>" <?php if($get['type'] == $one['id']): ?>selected<?php endif; ?>><?php echo ($one["title"]); ?></option><?php endforeach; endif; ?>          
            </select>&nbsp; &nbsp;
            奖金状态:
            <select name="term" style="width: 120px;">
                <option value="">全部</option>
                <option value="1" <?php if($get['term'] == 1): ?>selected<?php endif; ?>>已中奖</option>
                <option value="2" <?php if($get['term'] == 2): ?>selected<?php endif; ?>>未中奖</option> 
                <option value="3" <?php if($get['term'] == 3): ?>selected<?php endif; ?>>等待</option> 
                <option value="4" <?php if($get['term'] == 4): ?>selected<?php endif; ?>>退码</option>       
            </select>&nbsp; &nbsp;
            期数:
            <input type="text" name="actionno" style="width: 200px;" value="<?php echo ($get["actionno"]); ?>" placeholder="请输入期号">
            时间：
            <input type="text" name="start_time" class="js-datetime" value="<?php echo ((isset($get["start_time"]) && ($get["start_time"] !== ""))?($get["start_time"]):''); ?>" style="width: 120px;" autocomplete="off">-
            <input type="text" class="js-datetime" name="end_time" value="<?php echo ((isset($get["end_time"]) && ($get["end_time"] !== ""))?($get["end_time"]):''); ?>" style="width: 120px;" autocomplete="off"> &nbsp; &nbsp;

            <input type="submit" class="btn btn-primary" value="搜索" />
        </form>
        <form class="js-ajax-form" action="" method="post">

            <table class="table table-hover table-bordered table-list">
                <thead>
                <tr>    
                <th width="50">ID</th>
                <th>用户id</th>
                <th>用户名</th>
                <!-- <th>彩种</th> -->
                <th>期数</th>
                <!-- <th>玩法</th> -->
                <th>下注</th>
                <th>下注信息</th>
                <th>投注金额</th>
                <th>注量</th>
                <th>投注号码</th>
                <th>投注时间</th>
                <th>开奖号码</th>
                <th>奖金状态</th>
                <!--<th>操作项</th>-->
                </tr>
                </thead>

                <?php if(is_array($posts)): foreach($posts as $key=>$vo): ?><tr>
                    <?php $zt='等待中奖'; if($vo['sftm']==1){ $zt='已经退码'; } if($vo['zt']==1){ if($vo['winloss']>0){ $zt='奖金<span style="color:#e4393c">'.$vo['winloss'].'</span>'; } else{ $zt='未中奖'; } } else{ $vo['lotteryno']='--'; } ?>
                    <td><b><?php echo ($vo["id"]); ?></b></td>
                    <td><?php echo ($vo["uid"]); ?></td>
                    <td><?php echo (user_login($vo["uid"])); ?></td>
                    <!-- <td><?php echo (type($vo["type"])); ?></td> -->
                    <td><?php echo ($vo[periodsnumber]); ?></td>
                    <!-- <td><?php echo (played($vo["playedid"])); ?></td> -->
                    <td><?php echo ($vo[betwayid]); ?></td>
                    <td><?php echo ($vo[bz]); ?></td>
                    <td><?php echo ($vo[betamount]); ?></td>
                    <td><?php echo ($vo[count]); ?></td>
                    <td><a href="javascript:parent.openapp('<?php echo U('Portal/AdminOrder/index2',array('BetInfoID'=>$vo[betinfoid],'uid'=>$vo[uid]));?>','xiangqing','投注详情',true);">查看全部</a>|<a  href="javascript:parent.openapp('<?php echo U('Portal/AdminOrder/index2',array('BetInfoID'=>$vo[betinfoid],'uid'=>$vo[uid],'sfzj'=>'1'));?>','zjxiangqing','中奖详情',true);">中奖号码</a></td>
                    <td><?php echo ($vo["betdt"]); ?></td>
                    <td><?php echo ($vo[lotteryno]); ?></td>
                    <td><?php echo ($zt); ?></td>
                    <!--<td>
                        <a href="<?php echo U('AdminOrder/userdelete',array('id'=>$vo['id']));?>" class="js-ajax-delete">撤销订单</a>
                        <a href="<?php echo U('AdminOrder/delete',array('id'=>$vo['id']));?>" class="js-ajax-delete">删除投注</a>
                    </td>-->
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