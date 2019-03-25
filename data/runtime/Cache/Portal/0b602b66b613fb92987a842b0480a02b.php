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
	<script>
	var xzqs=0;					
	</script>
	<div class="wrap js-check-wrap">
		<ul class="nav nav-tabs">
            <li><a href="<?php echo U('Portal/AdminSystem/lottery_typeset');?>">所有彩种</a></li>
            <li class="active"><a href="#" >时间配置</a></li>
        </ul>
        <div class="well form-search" method="post" action="/index.php/Portal/AdminUser/soUser">
            开始时间:
            <input type="text" name="start" style="width: 200px;" value="" placeholder="请输开始时间,格式aa:bb:cc" id='start' onchange='checktime("start")'>
            结束时间:
            <input type="text" name="end" style="width: 200px;" value="" placeholder="请输入结束时间,格式aa:bb:cc" id='end' onchange='checktime("end")'>
            期数:
            <input type="number" name="qs" style="width: 200px;" value="" placeholder="请输入期数" id='qs'>
            间隔时间:
            <input type="number" name="jgtime" style="width: 200px;" value="" placeholder="请输入间隔时间(s)" id='jgtime'>
            <input type="button" class="btn btn-primary" value="添加" onclick="add()">
            <input type="button" class="btn btn-primary" value="一键配置" onclick="alladd()">
        </div>
		<form class="form-horizontal js-ajax-form" action="<?php echo U('AdminSystem/data_setpost');?>" method="post">
			<fieldset>
				<ul id="datapz">
				<?php if(is_array($data)): foreach($data as $key=>$one): ?><li class="radio inline">
							<?php echo ($key+1); ?>期:<input type="text" name="data[]" value="<?php echo ($one); ?>">
						</li>
						<script>
						xzqs=<?php echo ($key+1); ?>;
						</script><?php endforeach; endif; ?>
				</ul>
			</fieldset>
			<div class="form-actions">
				<input type="hidden" name="id" value="<?php echo ($post["id"]); ?>"/>
				<button type="submit" class="btn btn-primary"><?php echo L('SAVE');?></button>
				<a class="btn" href="javascript:history.back(-1);"><?php echo L('BACK');?></a>
			</div>
		</form>
	</div>
	<style>
	#datapz input{
		width: 60px;
	}
	#datapz li{
		width: 120px;
	}
	</style>
	<script>
		function checktime(id){
				var a = /^(\d{2}):(\d{2}):(\d{2})$/;
				if (!a.test($('#'+id).val())) { 
				alert("格式不正确!"); 
				$('#'+id).val('');
				} 
		} 
		function add(){
			var start=$('#start').val();
			var end=$('#end').val();
			var qs=$('#qs').val();
			var jgtime=$('#jgtime').val();
			if(!start){
				alert("请输入开始时间!");
				return; 		
			}
			if(!end){
				alert("请输入结束时间!");
				return; 		
			}
			if(!qs){
				alert("请输入期数!");
				return; 		
			}
			if(!jgtime){
				alert("请输入间隔时间!");
				return; 		
			}
				start=zhtime(start);
				end=zhtime(end);
			if(end<start){
				alert("开始时间必须小于结束时间!");
				return;
			}
			for(i=1;(start<=end && i<=qs);i++){
				xzqs=xzqs-(-1);
				var html='<li class="radio inline">'+xzqs+'期:<input type="text" name="data[]" value="'+hdtime(start)+'"></li>';
				$('#datapz').append(html);
				start=start-(-jgtime);
			}
		}
		function alladd(){
			var start=$('#start').val();
			var end=$('#end').val();
			var qs=$('#qs').val();
			var jgtime=$('#jgtime').val();
			if(!start){
				alert("请输入开始时间!");
				return; 		
			}
			if(!end){
				alert("请输入结束时间!");
				return; 		
			}
			if(!qs){
				alert("请输入期数!");
				return; 		
			}
			if(!jgtime){
				alert("请输入间隔时间!");
				return; 		
			}
				start=zhtime(start);
				end=zhtime(end);
			if(end<start){
				alert("开始时间必须小于结束时间!");
				return;
			}
			xzqs=0;
			$('#datapz').html('');
			for(i=1;(start<=end && i<=qs);i++){
				xzqs=xzqs-(-1);
				var html='<li class="radio inline">'+xzqs+'期:<input type="text" name="data[]" value="'+hdtime(start)+'"></li>';
				$('#datapz').append(html);
				start=start-(-jgtime);
			}
		}
		function zhtime(id){
				var strs= new Array(); //定义一数组 
				strs=id.split(":"); //字符分割 
				id=parseInt(strs[0])*3600-(-parseInt(strs[1])*60)-(-parseInt(strs[2]));
				return id;
		}
		function hdtime(id){
				var h=parseInt(id/3600);
				var m=parseInt((id-h*3600)/60);
				var s=id-h*3600-60*m;
				var x='';
				if(h<10){
					x=x+'0'+h;
				}
				else{
					x=x+h;
				}
				if(m<10){
					x=x+':0'+m;
				}
				else{
					x=x+':'+m;
				}
				if(s<10){
					x=x+':0'+s;
				}
				else{
					x=x+':'+s;
				}
				return x
		}
	</script>
	<script src="/public/js/common.js"></script>

</body>
</html>