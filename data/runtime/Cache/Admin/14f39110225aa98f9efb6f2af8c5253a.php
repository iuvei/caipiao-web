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
<style>
.home_info li em {
    float: left;
    width: 120px;
    font-style: normal;
}
li {
    list-style: none;
}
</style>
</head>
<body>
    <div class="wrap">
        <h4 class="well">盈亏统计</h4>
        <div class="home_info stats_overview">
            <div class="overview_today">
            <p class="overview_day">今日统计</p>
            <p class="overview_count" style="color:#76a4fa"><?php echo ($tzje); ?></p>
            <p class="overview_type">投注金额</p>
            <p class="overview_count" style="color:#81c65b"><?php echo ($zjje); ?></p>
            <p class="overview_type">中奖金额</p>
            </div>
            <div class="overview_today">
            <p class="overview_day" style="font-size: 10px;color: #999;">盈利：</p>
            <p class="overview_count" style="color:#76a4fa"><?php echo ($hdze); ?></p>
            <p class="overview_type">活动礼金</p>
            <p class="overview_count" style="color:#81c65b"><?php echo ($fdze); ?></p>
            <p class="overview_type">返点金额</p>
            </div>
            <div class="overview_today">
            <p class="overview_day" style="font-size: 22px;font-weight: bold;color: #f00;"><?php echo ($zyl); ?></p>
            <p class="overview_count" style="color:#76a4fa"><?php echo ($czze); ?></p>
            <p class="overview_type">充值金额</p>
            <p class="overview_count" style="color:#81c65b"><?php echo ($txze); ?></p>
            <p class="overview_type">提现金额</p>
            </div>

            <div class="overview_today">
            <p class="overview_day">昨日统计</p>
            <p class="overview_count" style="color:#76a4fa"><?php echo ($zrtzje); ?></p>
            <p class="overview_type">投注金额</p>
            <p class="overview_count" style="color:#81c65b"><?php echo ($zrzjje); ?></p>
            <p class="overview_type">中奖金额</p>
            </div>
            <div class="overview_today">
            <p class="overview_day" style="font-size: 10px;color: #999;">盈利：</p>
            <p class="overview_count" style="color:#76a4fa"><?php echo ($zrhdze); ?></p>
            <p class="overview_type">活动礼金</p>
            <p class="overview_count" style="color:#81c65b"><?php echo ($zrfdze); ?></p>
            <p class="overview_type">返点金额</p>
            </div>
            <div class="overview_today">
            <p class="overview_day" style="font-size: 22px;font-weight: bold;color: #f00;"><?php echo ($zrzyl); ?></p>
            <p class="overview_count" style="color:#76a4fa"><?php echo ($zrczze); ?></p>
            <p class="overview_type">充值金额</p>
            <p class="overview_count" style="color:#81c65b"><?php echo ($zrtxze); ?></p>
            <p class="overview_type">提现金额</p>
            </div>
            <div class="clear"></div>
        </div>
        <div class="clear"></div>
    </div>
    <div class="wrap">
        <h4 class="well">用户统计</h4>
        <div class="home_info">
            <table class="tablesorter" cellspacing="0"> 
    <thead> 
        <tr> 
            <th>用户总数</th> 
            <th>今日注册人数</th> 
            <th>代理人数</th> 
            <th>会员人数</th> 
            <th>余额总数</th>
        </tr> 
    </thead> 
    <tbody> 
        <tr> 
            <td><?php echo ($zrs); ?></td> 
            <td><?php echo ($jrzrs); ?></td> 
            <td><?php echo ($dlrs); ?></td> 
            <td><?php echo ($wjrs); ?></td> 
            <td><?php echo ($money); ?></td> 
        </tr> 
    </tbody> 
    </table>
        </div>
    </div>
    <div class="wrap">
        <h4 class="well">彩种投注金额统计</h4>
        <div class="home_info">
            <?php $a=0; $type['1']='快3'; $type['2']='时时彩'; $type['3']='11选5'; ?>
            <div class="module_content">
            <?php if(is_array($typelist)): foreach($typelist as $key=>$one): ?><div class="cztz"><span class="title"><?php echo ($one[title]); ?></span><span class="spn2">￥<?php echo ($typebet[$one[id]]+$a); ?></span></div><?php endforeach; endif; ?>
            </div>
        </div>
        <div class="clear"></div>
    </div>
    <div class="wrap">
        <h4 class="well">玩法统计</h4>
        <div class="home_info">
            <div class="module_content">
            <?php if(is_array($wflist)): foreach($wflist as $key=>$one): ?><div class="cztz2"><span class="title"><?php echo (group($one[groupid])); ?>-<?php echo ($one[name]); ?>(<?php echo ($type[$one[type]]); ?>)</span><span class="spn2">￥<?php echo ($wfbet[$one[id]]+$a); ?></span></div><?php endforeach; endif; ?>
        </div>
        </div>
        <div class="clear"></div>
    </div>


    </div>
    <script src="/public/js/common.js"></script>
<style>
/* Stats Module */
.clear{
    clear: both;
}
.spn2 {
    color: #f00;
    font-weight: bold;
}
.wrap {
    padding: 20px 20px 0px;
}
.stats_graph{width:400px;float:left;}
.stats_overview{background:#F6F6F6;border:1px solid #ccc;float:right;width:100%;}
.overview_today,.overview_previous{width:16.66%;float:left;}
.stats_overview p{margin:0;padding:0;text-align:center;text-transform:uppercase;text-shadow:0 1px 0 #fff;}
.stats_overview p.overview_day{font-size:12px;font-weight:bold;margin:6px 0;}
.stats_overview p.overview_count{font-size:22px;font-weight:bold;color:#333;}
.stats_overview p.overview_type{font-size:10px;color:#999;margin-bottom:8px;}
/* Content Manager */
.tablesorter{width:100%;margin:-5px 0 0 0;}
.tablesorter td{margin:0;padding:0;border-bottom:1px dotted #ccc;}
.tablesorter .tdEnd{border-bottom:none;}
/*.tablesorter thead tr{height:34px;background:url(images/table_sorter_header.png) repeat-x;text-align:center;text-indent:10px;cursor:pointer;}*/
.tablesorter tbody tr:hover{cursor:default;background:#f0f0f0;}
.tablesorter td{padding:8px 12px;text-align:center;}
.tablesorter.left td{text-align:left;}
.tablesorter input[type=image]{margin-right:10px;}
/* Messages */
.message{border-bottom:1px dotted #ccc;}

.submit_link{float:right;margin-right:3%;padding:5px 0;}
.submit_link select{width:150px;border:1px solid #bbb;height:20px;color:#666;}

 .module_content{text-transform:none;text-shadow:0 1px 0 #fff;margin:8px 0;}
 .module_content h1{color:#333;font-size:22px;}
 .module_content h2{color:#444;font-size:18px;}
 .module_content h3{color:#666;text-transform:uppercase;font-size:13px;}
 .module_content h4{color:#666;font-size:13px;}
 .module_content li{line-height:150%;}

 .module_content .cztz{width:23%; height:32px; float:left; padding-left:15px;}
 .module_content .cztz2{width:46%; height:32px; float:left; padding-left:15px;}
 .module_content .cztz2 .title{width:300px; height:32px; float:left; overflow:inherit}
 .module_content .cztz .title{width:86px; height:32px; float:left; overflow:inherit}
 .wz{padding:0 0;}
 .aq-txt{ float:right;}
 .table2 td{border-bottom:none;}
 .box1{float:left; width:50%; height:300px; overflow:hidden}
 .tablesorter thead td{ font-weight:bold;text-align:center;}
 .textWid1{width:75px;}
</style>
</body>
</html>