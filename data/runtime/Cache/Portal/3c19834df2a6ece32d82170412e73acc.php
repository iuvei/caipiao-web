<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <script type="text/javascript">
        var
            getBaseUrl = new Function('return "/SSCCompany"'),
            baseUrl = getBaseUrl();
    </script>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>管理网</title>
    <link rel="stylesheet" href="/SSCCompany/Content/Default/Style/common.css?v=20160119-123" type="text/css" />
    <link rel="stylesheet" href="/SSCCompany/Content/Default/Style/Home/Header.css?v=2016011932" type="text/css" />
    <link rel="stylesheet" href="/SSCCompany/Content/Default/Style/Home/Role.css?v=32323232" type="text/css" />
    <link href="/SSCCompany/Content/Default/Style/compensate.css?v=2016011933" rel="stylesheet" />
    <link href="/SSCCompany/Content/Default/Style/all.css?v=20160119-133" rel="stylesheet" />
    <link href="/SSCCompany/Scripts/Lib/artDialog/ui-dialog.css?v=2016011933" rel="stylesheet" />
    <link href="/SSCCompany/Content/Default/Style/period.css?v=2016011933" rel="stylesheet" />
    <link href="/SSCCompany/Content/Default/Style/print.css" rel="stylesheet" />
    <link href="/SSCCompany/Content/Default/Style/jquery.qtip.min.css?v=2016011339" rel="stylesheet" />
    <link href="/SSCCompany/Content/Default/Style/jquery.qtip.min.css?v=2016011339" rel="stylesheet" />
    <script src="/SSCCompany/Scripts/Lib/jquery-1.11.1.min.js"></script>
    <script src="/SSCCompany/Scripts/Lib/artDialog/dialog-plus-min.js"></script>
    <script src="/SSCCompany/Scripts/Lib/knockout-3.3.0.debug.js"></script>
    <script src="/SSCCompany/Scripts/Lib/sea.js"></script>
    <script src="/SSCCompany/Scripts/Default/utils.js?_=20170712000000"></script>
    <script src="/SSCCompany/Scripts/Default/ui.common.js?_=20170712000000"></script>
    <!-- <script src="/Scripts/Lib/My97DatePicker/WdatePicker.js"></script> -->
    <script src="/SSCCompany/Scripts/Lib/jquery.qtip.min.js"></script>
    <script src="/SSCCompany/Scripts/Lib/json2.min.js"></script>
    <script src="/SSCCompany/Scripts/Lib/jquery.form.js"></script>
    </head>
    <body>
<div>
      <div class="container no-print">
    <div class="header">
          <?php $realagent = $agent; if($agent['issubaccount']){ $realagent = M('agent')->find($agent['parent']); } $map['level']=$realagent['agentlevel']; $level=M('agent_level')->where($map)->find(); $company=M('agent')->find($realagent['subcompanyid']); ?>
          <div class="header_in clear">
        <div class="user_name"> <span><?php echo ($level[title]); ?> : [<?php echo ($_SESSION['agent_login']); ?>] </span>
              <div class="logo">
            <h1 style="color:red"><?php echo ($company['nickname']); ?></h1>
          </div>
            </div>
        <div class="top_notice"></div>
        <div class="stoptime"></div>
        <div class="menu">
            <?php  if($agent['issubaccount']){ $menus = explode(',', $agent['menu']); $_menus1 = json_decode('[{"ID":125,"MenuName":"总货明细","MenuKey":"/index.php/portal/agent/Gross","ParentMenuID":1,"IsEnabled":true,"Describe":"总货明细","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":126,"MenuName":"中奖明细","MenuKey":"/index.php/portal/agent/IsWin","ParentMenuID":1,"IsEnabled":true,"Describe":"中奖明细","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":2125,"MenuName":"拦货明细","MenuKey":"/index.php/portal/agent/RatioDetail","ParentMenuID":1,"IsEnabled":true,"Describe":"拦货明细","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":3125,"MenuName":"打包拦货白单数据","MenuKey":"/index.php/portal/agent/BaleWhiteSingle","ParentMenuID":1,"IsEnabled":true,"Describe":"打包拦货白单数据","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}]',true); $menus1 = array(); foreach($_menus1 as $k=>$v){ if(in_array($v['ID'], $menus)){ $menus1[] = $v; } } $_menus2 = json_decode('[{"ID":5131,"MenuName":"期数分类账","MenuKey":"/index.php/portal/agent/ReportClassify","ParentMenuID":2,"IsEnabled":true,"Describe":"按照期数查询分类账的实占合计","IcoName":"","OrderIndex":0,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":18,"MenuName":"日分类帐","MenuKey":"/index.php/portal/agent/DayReportType","ParentMenuID":2,"IsEnabled":true,"Describe":"日分类帐","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":1125,"MenuName":"月分类帐","MenuKey":"/index.php/portal/agent/MonthReportType","ParentMenuID":2,"IsEnabled":true,"Describe":"月分类帐","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":19,"MenuName":"贡献度","MenuKey":"/index.php/portal/agent/Contribution","ParentMenuID":2,"IsEnabled":true,"Describe":"贡献度","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":5133,"MenuName":"周贡献度","MenuKey":"/index.php/portal/agent/ReportWeekContribute","ParentMenuID":2,"IsEnabled":true,"Describe":"按照每周显示贡献度信息","IcoName":"","OrderIndex":5,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}]',true); $menus2 = array(); foreach($_menus2 as $k=>$v){ if(in_array($v['ID'], $menus)){ $menus2[] = $v; } } $_menus3 = json_decode('[{"ID":5130,"MenuName":"日报表（期数）","MenuKey":"/index.php/portal/agent/DayReportPeriods","ParentMenuID":3,"IsEnabled":true,"Describe":"日报表按照期数显示","IcoName":"","OrderIndex":0,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":26,"MenuName":"日(结)报表","MenuKey":"/index.php/portal/agent/Report","ParentMenuID":3,"IsEnabled":true,"Describe":"日报表","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":27,"MenuName":"月(结)报表","MenuKey":"/index.php/portal/agent/MonthReport","ParentMenuID":3,"IsEnabled":true,"Describe":"月报表","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":5129,"MenuName":"周报表","MenuKey":"/index.php/portal/agent/WeeklyReport","ParentMenuID":3,"IsEnabled":true,"Describe":"周报表","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}]',true); $menus3 = array(); foreach($_menus3 as $k=>$v){ if(in_array($v['ID'], $menus)){ $menus3[] = $v; } } if($agent['companytype']==2 && $agent['agentlevel']==5){ $_menus97 = json_decode('[{"ID":96,"MenuName":"新增下级","MenuKey":"/index.php/portal/agent/MemberAdd","ParentMenuID":97,"IsEnabled":true,"Describe":"","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":111,"MenuName":"会员列表","MenuKey":"/index.php/portal/agent/Member","ParentMenuID":97,"IsEnabled":true,"Describe":"","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}]',true); } if($agent['companytype']==1 || ($agent['companytype']==2 && $agent['agentlevel']<5)){ $_menus97 = json_decode('[{"ID":96,"MenuName":"新增下级","MenuKey":"/index.php/portal/agent/NewSubordinateAdd","ParentMenuID":97,"IsEnabled":true,"Describe":"","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":29,"MenuName":"账户列表","MenuKey":"/index.php/portal/agent/NewSubordinate","ParentMenuID":97,"IsEnabled":true,"Describe":"账户列表","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":111,"MenuName":"会员列表","MenuKey":"/index.php/portal/agent/Member","ParentMenuID":97,"IsEnabled":true,"Describe":"","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":124,"MenuName":"新增会员","MenuKey":"/index.php/portal/agent/MemberAdd","ParentMenuID":97,"IsEnabled":true,"Describe":"新增会员","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}]',true); } if($agent['companytype']==0){ $_menus97 = json_decode('[{"ID":96,"MenuName":"新增下级","MenuKey":"/index.php/portal/agent/CompanySettingAdd","ParentMenuID":97,"IsEnabled":true,"Describe":"","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":111,"MenuName":"会员列表","MenuKey":"/index.php/portal/agent/Member","ParentMenuID":97,"IsEnabled":true,"Describe":"","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}]',true); } $menus97 = array(); foreach($_menus97 as $k=>$v){ if(in_array($v['ID'], $menus)){ $menus97[] = $v; } } $_menus4 = json_decode('[{"ID":125,"MenuName":"总货明细","MenuKey":"/index.php/portal/agent/Gross","ParentMenuID":1,"IsEnabled":true,"Describe":"总货明细","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":126,"MenuName":"中奖明细","MenuKey":"/index.php/portal/agent/IsWin","ParentMenuID":1,"IsEnabled":true,"Describe":"中奖明细","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":2125,"MenuName":"拦货明细","MenuKey":"/index.php/portal/agent/RatioDetail","ParentMenuID":1,"IsEnabled":true,"Describe":"拦货明细","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}]',true); $menus4 = array(); foreach($_menus4 as $k=>$v){ if(in_array($v['ID'], $menus)){ $menus4[] = $v; } } $_menus7 = json_decode('[{"ID":106,"MenuName":"基础日志","MenuKey":"/index.php/portal/agent/Logs","ParentMenuID":7,"IsEnabled":true,"Describe":"基础日志","IcoName":"fa-dashboard","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":107,"MenuName":"拦货金额日志","MenuKey":"/index.php/portal/agent/LimitStoreLog","ParentMenuID":7,"IsEnabled":true,"Describe":"拦货金额日志","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}]',true); $menus7 = array(); foreach($_menus7 as $k=>$v){ if(in_array($v['ID'], $menus)){ $menus7[] = $v; } } $_menus8 = json_decode('[{"ID":32,"MenuName":"基本资料","MenuKey":"/index.php/portal/agent/info","ParentMenuID":8,"IsEnabled":true,"Describe":"基本资料","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":86,"MenuName":"子账号","MenuKey":"/index.php/portal/agent/SubAccount","ParentMenuID":8,"IsEnabled":true,"Describe":"子账号列表","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":92,"MenuName":"拦货金额","MenuKey":"/index.php/portal/agent/BasicInformation","ParentMenuID":8,"IsEnabled":true,"Describe":"拦货金额","IcoName":"","OrderIndex":5,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":33,"MenuName":"修改密码","MenuKey":"/index.php/portal/agent/ChangePassword","ParentMenuID":8,"IsEnabled":true,"Describe":"修改密码","IcoName":"","OrderIndex":6,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}]',true); $menus8 = array(); foreach($_menus8 as $k=>$v){ if(in_array($v['ID'], $menus)){ $menus8[] = $v; } } ?>
            <ul id="menus">
            <?php if(in_array(4125, $menus)){ ?>
            <li id="4125"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/TempLate','template/homes')" data-child="[]">首页</a></li>
            <?php } ?>
            <?php if(in_array(1, $menus)){ ?>
            <li id="1"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/Gross','Gross/Index')" data-child="<?php echo htmlspecialchars(json_encode($menus1)) ?>">总货明细</a></li>
            <?php } ?>
            <?php if(in_array(2, $menus)){ ?>
            <li id="2"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/ReportClassify','classify/reportclassify')" data-child="<?php echo htmlspecialchars(json_encode($menus2)) ?>">分类帐</a></li>
            <?php } ?>
            <?php if(in_array(3, $menus)){ ?>
            <li id="3"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/Report','Report/Index')" data-child="<?php echo htmlspecialchars(json_encode($menus3)) ?>">报表</a></li>
            <?php } ?>
            <?php if(in_array(97, $menus)){ ?>
            <?php if($agent['companytype']==2 && $agent['agentlevel']==5){ ?>
            <li id="97"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/Member','Member/Index')" data-child="<?php echo htmlspecialchars(json_encode($menus97)) ?>">下级管理</a></li>
            <?php } if($agent['companytype']==1 || ($agent['companytype']==2 && $agent['agentlevel']<5)){ ?>
            <li id="97"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/NewSubordinate','NewSubordinate/Index')" data-child="<?php echo htmlspecialchars(json_encode($menus97)) ?>">下级管理</a></li>
            <?php } if($agent['companytype']==0){ ?>
            <li id="97"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/CompanySetting','CompanySetting/Index')" data-child="<?php echo htmlspecialchars(json_encode($menus97)) ?>">下级管理</a></li>
            <?php } ?>
            <?php } ?>
            <?php if(in_array(4, $menus)){ ?>
            <li id="4"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/DrawNumber','drawnumber/index')" data-child="<?php echo htmlspecialchars(json_encode($menus4)) ?>">开奖结果</a></li>
            <?php } ?>
            <?php if(in_array(7, $menus)){ ?>
            <li id="7"><a href="#" data-bind="click:$root.tabmenu.bind($data,'<?php echo $menus7[0]['MenuKey'] ?>','logs/index')" data-child="<?php echo htmlspecialchars(json_encode($menus7)) ?>">日志</a></li>
            <?php } ?>
            <?php if(in_array(8, $menus)){ ?>
            <li id="8"> <a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/BasicInformation','BasicInformation/Commission')" data-child="<?php echo htmlspecialchars(json_encode($menus8)) ?>">设置</a> </li>
            <?php } ?>
            <!--
[{&quot;ID&quot;:32,&quot;MenuName&quot;:&quot;基本资料&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/info&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;基本资料&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:1,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:86,&quot;MenuName&quot;:&quot;子账号&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/SubAccount&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;子账号列表&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:3,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:92,&quot;MenuName&quot;:&quot;拦货金额&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/BasicInformation&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;拦货金额&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:5,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:33,&quot;MenuName&quot;:&quot;修改密码&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/ChangePassword&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;修改密码&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:6,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false}]
-->
            <li><a href="#" data-bind="click:signOut">退出</a></li>
            </a>
          </ul>
            <?php
 }else{ ?>
            <ul id="menus">
            <li id="4125"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/TempLate','template/homes')" data-child="[]">首页</a></li>
            <li id="1"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/Gross','Gross/Index')" data-child='[{"ID":125,"MenuName":"总货明细","MenuKey":"/index.php/portal/agent/Gross","ParentMenuID":1,"IsEnabled":true,"Describe":"总货明细","IcoName":"","OrderIndex":1,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":126,"MenuName":"中奖明细","MenuKey":"/index.php/portal/agent/IsWin","ParentMenuID":1,"IsEnabled":true,"Describe":"中奖明细","IcoName":"","OrderIndex":2,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":2125,"MenuName":"拦货明细","MenuKey":"/index.php/portal/agent/RatioDetail","ParentMenuID":1,"IsEnabled":true,"Describe":"拦货明细","IcoName":"","OrderIndex":3,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false},{"ID":3125,"MenuName":"打包拦货白单数据","MenuKey":"/index.php/portal/agent/BaleWhiteSingle","ParentMenuID":1,"IsEnabled":true,"Describe":"打包拦货白单数据","IcoName":"","OrderIndex":4,"IsSuperCompanyMenu":false,"IsCompanyMenu":false,"IsAgentMenu":false}]'>总货明细</a></li>
            <li id="2"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/ReportClassify','classify/reportclassify')" data-child="[{&quot;ID&quot;:5131,&quot;MenuName&quot;:&quot;期数分类账&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/ReportClassify&quot;,&quot;ParentMenuID&quot;:2,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;按照期数查询分类账的实占合计&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:0,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:18,&quot;MenuName&quot;:&quot;日分类帐&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/DayReportType&quot;,&quot;ParentMenuID&quot;:2,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;日分类帐&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:1,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:1125,&quot;MenuName&quot;:&quot;月分类帐&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/MonthReportType&quot;,&quot;ParentMenuID&quot;:2,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;月分类帐&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:2,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:19,&quot;MenuName&quot;:&quot;贡献度&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/Contribution&quot;,&quot;ParentMenuID&quot;:2,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;贡献度&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:4,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:5133,&quot;MenuName&quot;:&quot;周贡献度&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/ReportWeekContribute&quot;,&quot;ParentMenuID&quot;:2,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;按照每周显示贡献度信息&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:5,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false}]">分类帐</a></li>
            <li id="3"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/Report','Report/Index')" data-child="[{&quot;ID&quot;:5130,&quot;MenuName&quot;:&quot;日报表（期数）&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/DayReportPeriods&quot;,&quot;ParentMenuID&quot;:3,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;日报表按照期数显示&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:0,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:26,&quot;MenuName&quot;:&quot;日(结)报表&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/Report&quot;,&quot;ParentMenuID&quot;:3,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;日报表&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:1,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:27,&quot;MenuName&quot;:&quot;月(结)报表&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/MonthReport&quot;,&quot;ParentMenuID&quot;:3,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;月报表&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:2,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:5129,&quot;MenuName&quot;:&quot;周报表&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/WeeklyReport&quot;,&quot;ParentMenuID&quot;:3,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;周报表&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:4,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false}]">报表</a></li>
            <?php if($agent['companytype']==2 && $agent['agentlevel']==5){ ?>
            <li id="97"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/Member','Member/Index')" data-child="[{&quot;ID&quot;:96,&quot;MenuName&quot;:&quot;新增下级&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/MemberAdd&quot;,&quot;ParentMenuID&quot;:97,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:1,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:111,&quot;MenuName&quot;:&quot;会员列表&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/Member&quot;,&quot;ParentMenuID&quot;:97,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:3,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false}]">下级管理</a></li>
            <?php } if($agent['companytype']==1 || ($agent['companytype']==2 && $agent['agentlevel']<5)){ ?>
            <li id="97"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/NewSubordinate','NewSubordinate/Index')" data-child="[{&quot;ID&quot;:96,&quot;MenuName&quot;:&quot;新增下级&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/NewSubordinateAdd&quot;,&quot;ParentMenuID&quot;:97,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:1,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:29,&quot;MenuName&quot;:&quot;账户列表&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/NewSubordinate&quot;,&quot;ParentMenuID&quot;:97,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;账户列表&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:2,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:111,&quot;MenuName&quot;:&quot;会员列表&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/Member&quot;,&quot;ParentMenuID&quot;:97,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:3,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:124,&quot;MenuName&quot;:&quot;新增会员&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/MemberAdd&quot;,&quot;ParentMenuID&quot;:97,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;新增会员&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:4,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false}]">下级管理</a></li>
            <?php } if($agent['companytype']==0){ ?>
            <li id="97"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/CompanySetting','CompanySetting/Index')" data-child="[{&quot;ID&quot;:96,&quot;MenuName&quot;:&quot;新增下级&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/CompanySettingAdd&quot;,&quot;ParentMenuID&quot;:97,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:1,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:111,&quot;MenuName&quot;:&quot;会员列表&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/Member&quot;,&quot;ParentMenuID&quot;:97,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:3,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false}]">下级管理</a></li>
            <?php } ?>
            <li id="4"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/DrawNumber','drawnumber/index')" data-child="[]">开奖结果</a></li>
            <li id="7"><a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/Logs','logs/index')" data-child="[{&quot;ID&quot;:106,&quot;MenuName&quot;:&quot;基础日志&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/Logs&quot;,&quot;ParentMenuID&quot;:7,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;基础日志&quot;,&quot;IcoName&quot;:&quot;fa-dashboard&quot;,&quot;OrderIndex&quot;:1,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:107,&quot;MenuName&quot;:&quot;拦货金额日志&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/LimitStoreLog&quot;,&quot;ParentMenuID&quot;:7,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;拦货金额日志&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:2,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false}]">日志</a></li>
            <li id="8"> <a href="#" data-bind="click:$root.tabmenu.bind($data,'/index.php/portal/agent/BasicInformation','BasicInformation/Commission')" data-child="[{&quot;ID&quot;:32,&quot;MenuName&quot;:&quot;基本资料&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/info&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;基本资料&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:1,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:86,&quot;MenuName&quot;:&quot;子账号&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/SubAccount&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;子账号列表&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:3,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:92,&quot;MenuName&quot;:&quot;拦货金额&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/BasicInformation&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;拦货金额&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:5,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:33,&quot;MenuName&quot;:&quot;修改密码&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/ChangePassword&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;修改密码&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:6,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false}]">设置</a> </li>
            <!--
[{&quot;ID&quot;:32,&quot;MenuName&quot;:&quot;基本资料&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/info&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;基本资料&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:1,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:86,&quot;MenuName&quot;:&quot;子账号&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/SubAccount&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;子账号列表&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:3,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:92,&quot;MenuName&quot;:&quot;拦货金额&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/BasicInformation&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;拦货金额&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:5,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false},{&quot;ID&quot;:33,&quot;MenuName&quot;:&quot;修改密码&quot;,&quot;MenuKey&quot;:&quot;/index.php/portal/agent/ChangePassword&quot;,&quot;ParentMenuID&quot;:8,&quot;IsEnabled&quot;:true,&quot;Describe&quot;:&quot;修改密码&quot;,&quot;IcoName&quot;:&quot;&quot;,&quot;OrderIndex&quot;:6,&quot;IsSuperCompanyMenu&quot;:false,&quot;IsCompanyMenu&quot;:false,&quot;IsAgentMenu&quot;:false}]
-->
            <li><a href="#" data-bind="click:signOut">退出</a></li>
            </a>
          </ul>
            <?php } ?>
            </div>
      </div>
        </div>
    <div class="guide" id="childMenu0" style="display:block;">
          <div class="position"> &nbsp;&nbsp;位置&nbsp;»&nbsp;<a data-bind="text:menuName" class="active">规则说明</a> </div>
          <div class="marquee_wrap">
        <marquee scrolldelay="150">
            <label id="Detail"></label>
            </marquee>
      </div>
          <div class="guide_right" data-bind="foreach:childList"> <span data-bind="if:$index()>0">|</span> <a href="#" data-bind="text:MenuName,attr:{href:MenuKey},click:$root.openChild"></a> </div>
        </div>
  </div>
    </div>
<div id="Container" data-bind="component:{name:container,params:params}"></div>
<script type="text/html" id="ROLE-TPL">
    <table width="100%" border="0" cellpadding="2" cellspacing="6">
        <tr>
            <td style="padding-top:0;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tableborder">
                    <tr class="header"><td colspan="2">规则说明</td></tr>
                    <tr>
                        <td>
                            <table width="80%" align="center" border="0" cellspacing="0" class="table ">
                                <tr>
                                    <td bgcolor="#def3de" style="border:none;padding-left:10px;">
                                        <br><br><h3 align=center><span class="style2">境外圣地彩票游戏规则</span></h3>
                                        <p>
                                            <b>第一章　总　则</b><br><br>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>第一条</b>　根据美国圣地彩公平、公正开奖号码，制定本游戏规则。<br><br>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>第二条</b>　本站彩票实行自愿购买，量力而行；凡下注者即被视为同意并遵守本规则。          <b></b><br>
                                            <b>
                                                <br>
                                                第二章　游戏方法
                                            </b><br><br>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>第三条</b>
                                            <span> &nbsp;&nbsp;"五位数"的每注彩票由00000-99999中的任意5位自然数排列而成。</span>
                                            <span class="style2"><strong>本站取前面4位做为游戏规则！</strong></span><br>
                                            <span class="text-03"></span><br>
                                            <br>
                                            <b>  <span class="style2">假设下列为开奖结果：</span></b>
                                        </p>
                                        <br />
                                        <table class=b_tab cellspacing=1 cellpadding=0 width="50%" border=0>
                                            <tbody>
                                                 
                                                        <tr class=b_tline_bk>
                                                            <td width="12%">仟</td>
                                                            <td width="12%">佰</td>
                                                            <td width="15%">拾</td>
                                                            <td width="16%">个</td>
                                                            <td width="14%">球5</td>
                                                         
                                                           
                                                        </tr>
                                                        <tr class=b_cen>
                                                            <td><b><font color=#cc0000>1</font></b></td>
                                                            <td><b><font color=#cc0000>2</font></b></td>
                                                            <td><b><font color=#cc0000>3</font></b></td>
                                                            <td><b><font color=#cc0000>4</font></b></td>
                                                            <td><b><font color=#cc0000>5</font></b></td>
                                                          
                                                        </tr>
                                                
                                            </tbody>
                                           
                                        </table><br />
                                        <p class="style3">依照开奖结果，中奖范例如下：</p><br />
                                        <p class="style3">四字定中奖：</p><br />
                                        <p class="style1">1234</p><br />
                                        <p><span class="style3">二字定中奖：</span></p><br />
                                        <p><span class="style1">12xx； 1x3x； 1xx4； x23x； x2x4； xx34 </span></p><br />
                                        <p><span class="style3">三字定中奖：</span></p><br />
                                        <p><span class="style1">123x； 12x4； 1x34； x234 </span></p><br />
                                        <p><span class="style3"><strong>二字现中奖：</strong></span></p><br />
                                        <p><span class="style2"><strong>12；13；14；23；24；34</strong></span></p><br />
                                        <p><span class="style3"><strong>三字现中奖：</strong></span></p><br />
                                        <p><span class="style2"><strong>123；124；134；234</strong></span></p><br />
                                        <p><span class="style3"><strong>四字现中奖：</strong></span></p><br />
                                        <p><span class="style2"><strong>1234 现；</strong></span></p><br />

                                        <b>第三章　开奖及公告</b><br>
                                        <br>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>第四条</b>
                                        每10分钟一期，全天90期，通过境外开奖平台发布更新。
    }
}
                                        <br>
                                        <br>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>第五条</b>　每期开奖后，以境外彩票平台公布的开奖号码为准。<br>
                                        <br>

                                        <b>第四章　附　则</b><br>
                                        <br>
                                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>第六条</b>　本游戏规则最终解释权归本公司。</p><br />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</script> 

<!--二字定模板--> 
<script type="text/template" id="Index">
    <table cellpadding="0" width="100%" cellspacing="0" border="0">
        <tr class="reportTop">
            <!--ko foreach:list-->
            <td colspan="2" data-bind="attr:{colspan:fullMode()?10:2}">
                <!--ko if:!$parent.isFullScreen()||fullMode()-->
                <!--ko if:!$parent.isFullScreen()--><input type="radio" name="colSelect" data-bind="click:$parent.changeMode" /><!--/ko-->
                <!--ko if:$parent.isFullScreen()--><a href="#"><font color="#0000FF"><b data-bind="click:$parent.returnMaster">[实盘]</b></font></a><!--/ko-->
                <a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoABatch">[分批赔率]</b></font></a>
                <a class="meuntop" href="#" data-bind="click:$parent.masterGoNegative"><span data-bind="text:$parent.betTypeIDType(BetTypeID())"></span><br>负值排行(<span data-bind="text:BetAmountTotal"></span>)</a>
                <br>正值个数(<span data-bind="text:Positive"></span>)
                <!--ko if:$parent.isFullScreen()--><a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoChangeOdds,text:caption"></b></font></a><!--/ko-->
                <!--ko if:!$parent.isFullScreen()--><a href="#"><font color="#0000FF"><b data-bind="click:$parent.fullScreen,text:caption"></b></font></a><!--/ko-->
                <!-- /ko -->
                <!--ko if:$parent.isFullScreen()-->
                <a class="meuntop" href="#">
                    <span data-bind="text:$parent.betTypeIDType(BetTypeID()),click:$parent.fullScreen"></span>
                </a>
                <!--/ko-->
            </td>
            <!-- /ko -->
        </tr>
        <tr class="reportTop" data-bind="if:showMealList">
            <td colspan="20">
                二定位<font style="color:red"><b>[赔率变动]</b></font>&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="#"><font style="color:blue"><b data-bind="click:returnMaster">[返回实盘]</b></font></a>
                套餐:
                <select id="ratioLen" style="cursor:pointer" data-bind="options:masterMealList,optionsText:'SetMealName',optionsValue:'SetMealID',event:{change:getMasterByPackage.bind($data,1,true)}"></select>
            </td>
        </tr>
        <tr class="reportTable">
            <!--ko foreach:detailList-->
            <td valign="top" colspan="2" style="padding:0;border:none;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                        <!--ko foreach:$data-->
                        <tr data-bind="click:$parents[1].selected,css: selectStyle">
                            <td width="50%" valign="top" style="padding-left: 10px; border-left: 1px solid #B7B7B7;" id="c_24XX">
                                <font color="#0000FF">
                                    <!--<b>[<span data-bind="text:$parents[1].isFullScreen()?$data.index:$data.index,attr:{'oid':$data.index}"></span>]</b>-->
                                    <b>[<span data-bind="text:$data.index+1"></span>]</b>
                                </font><br />
                                <span data-bind="text:BetNumber"></span><br>
                                <input class="button" style="margin:0;padding: 0 2px;" type="button" value="转" data-bind="click:$parents[1].masterGoTrun">
                                <!--ko if:$parents[1].isFullScreen--><input type="radio" data-bind="value:$data.index+'',checked:checked,click:$parents[1].fullScreenMultiSelect" /><!--/ko-->
                            </td>
                            <td width="50%" id="r_24XX">
                                <font color="#3300FF" data-bind="text:Odds"> </font>
                                <br>
                                <span data-bind="text:BetAmount"></span>
                                <br>
                                <font class="red" data-bind="text:GuessLoss"> </font>
                                <br>
                            </td>
                        </tr>
                        <!--/ko-->
                    </tbody>
                </table>
            </td>
            <!--/ko-->
        </tr>
    </table>
</script> 
<!--三字定模板--> 
<script type="text/html" id="sandingwei">
    <table cellpadding="0" width="100%" cellspacing="0" border="0">
        <tr class="reportTop">
            <!--ko foreach:list-->
            <td data-bind="attr:{colspan:fullMode()?7:1}">
                <!--ko if:!$parent.isFullScreen()||fullMode()-->
                <!--ko if:!$parent.isFullScreen()--><input type="radio" name="colSelect" data-bind="click:$parent.changeMode" /><!--/ko-->
                <!--ko if:$parent.isFullScreen()--><a href="#"><font color="#0000FF"><b data-bind="click:$parent.returnMaster">[实盘]</b></font></a><!--/ko-->
                <a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoABatch">[分批赔率]</b></font></a>
                <span data-bind="text:$parent.betTypeIDType(BetTypeID())"></span><br>负值排行(<span data-bind="text:BetAmountTotal"></span>)
                <br>正值个数(<span data-bind="text:Positive"></span>)
                <!--ko if:$parent.isFullScreen()--><a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoChangeOdds,text:caption"></b></font></a><!--/ko-->
                <!--ko if:!$parent.isFullScreen()--><a href="#"><font color="#0000FF"><b data-bind="click:$parent.fullScreen,text:caption"></b></font></a><!--/ko-->
                <!-- /ko -->
                <!--ko if:$parent.isFullScreen()-->
                <a class="meuntop" href="#">
                    <span data-bind="text:$parent.betTypeIDType(BetTypeID()),click:$parent.fullScreen"></span>
                </a>
                <!--/ko-->
            </td>
            <!-- /ko -->
        </tr>
        <tr class="reportTop" data-bind="if:showMealList">
            <td colspan="10">
                三定位<font style="color:red"><b>[赔率变动]</b></font>&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="#"><font style="color:blue"><b data-bind="click:returnMaster">[返回实盘]</b></font></a>
                套餐:
                <select id="ratioLen" style="cursor:pointer" data-bind="options:masterMealList,optionsText:'SetMealName',optionsValue:'SetMealID',event:{change:getMasterByPackage.bind($data,1,true)}"></select>
            </td>
        </tr>
        <tr class="reportTable">
            <!--ko foreach:detailList-->
            <td valign="top" style="padding:0;border:none;" width="10%">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                        <!--ko foreach:$data-->
                        <tr data-bind="click:$parents[1].selected,css:selectStyle">
                            <td width="50%" valign="top" style="padding-left: 10px; border-left: 1px solid #B7B7B7;" id="c_24XX">
                                <font color="#0000FF">
                                    <b>[<span data-bind="text:($parents[1].isFullScreen()?$data.index:$index())+1"></span>]</b>
                                </font><br />
                                <span data-bind="text:BetNumber"></span><br>
                                <input class="button" style="margin:0;padding: 0 2px;" type="button" value="转" data-bind="click:$parents[1].masterGoTrun">
                                <!--ko if:$parents[1].isFullScreen--><input type="radio" data-bind="value:$data.index+'',checked:checked,click:$parents[1].fullScreenMultiSelect" /><!--/ko-->
                            </td>
                            <td width="50%" id="r_24XX">
                                <font color="#3300FF" data-bind="text:Odds"> </font>
                                <br>
                                <span data-bind="text:BetAmount"></span>
                                <br>
                                <font class="red" data-bind="text:GuessLoss"> </font>
                                <br>
                                <input type="hidden" id="n_24XX" name="nhot[]" value="24XX">
                            </td>
                        </tr>
                        <!--/ko-->
                    </tbody>
                </table>
            </td>
            <!--/ko-->
        </tr>
    </table>
</script> 
<!--四字定模板--> 
<script type="text/html" id="sidingwei">
    <table cellpadding="0" width="100%" cellspacing="0" border="0">
        <tr class="reportTop">
            <!--ko foreach:list-->

            <td colspan="20">
                <a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoABatch">[分批赔率]</b></font></a>
                <span data-bind="text:$parent.betTypeIDType(BetTypeID)"></span>
                负值排行(<span data-bind="text:BetAmountTotal"></span>)<br>正值个数(<span data-bind="text:Positive"></span>)
                <a href="#"><font color="#0000FF"><b data-template="sidingwei" data-bind="click:$parent.masterGoChangeOdds">[赔率变动]</b></font></a>
            </td>
            <!-- /ko -->
        </tr>
        <tr class="reportTop" data-bind="if:showMealList">
            <td colspan="20">
                四定位<font style="color:red"><b>[赔率变动]</b></font>&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="#"><font style="color:blue"><b data-bind="click:returnMaster">[返回实盘]</b></font></a>
                套餐:
                <select id="ratioLen" style="cursor:pointer" data-bind="options:masterMealList,optionsText:'SetMealName',optionsValue:'SetMealID',event:{change:getMasterByPackage.bind($data,1,true)}"></select>
            </td>
        </tr>
        <tr class="reportTable">
            <td style="padding:0;border:none;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tbody data-bind="foreach:detailList">
                        <tr>
                            <!--ko foreach:$data-->
                            <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
                                <font color="#0000FF"><b><span data-bind="text:$data.index!==undefined?'['+($data.index+1)+']':'--'"></span></b></font>
                                <br>
                                <span data-bind="text:BetNumber"></span>
                            </td>
                            <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
                                <font color="#3300FF" data-bind="text:Odds"> </font>
                                <br>
                                <span data-bind="text:BetAmount"></span>
                                <br>
                                <font class="red" data-bind="text:GuessLoss"> </font>
                                <br>
                                <input type="hidden" id="n_7972" name="nhot[]" value="7972">
                            </td>
                            <!--/ko-->
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</script> 
<!--二字现模板--> 
<script id="erzixian" type="text/html">
    <table cellpadding="0" width="100%" cellspacing="0" border="0">
        <tr class="reportTop">
            <!--ko foreach:list-->
            <td colspan="20">
                <a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoABatch">[分批赔率]</b></font></a>
                <span data-bind="text:$parent.betTypeIDType(BetTypeID)"></span>负值排行(<span data-bind="text:BetAmountTotal"></span>)<br>正值个数(<span data-bind="text:Positive"></span>)
                <a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoChangeOdds">[赔率变动]</b></font></a>
            </td>
            <!-- /ko -->
        </tr>
        <tr class="reportTop" data-bind="if:showMealList">
            <td colspan="20">
                二字现<font style="color:red"><b>[赔率变动]</b></font>&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="#"><font style="color:blue"><b data-bind="click:returnMaster">[返回实盘]</b></font></a>
                套餐:
                <select id="ratioLen" style="cursor:pointer" data-bind="options:masterMealList,optionsText:'SetMealName',optionsValue:'SetMealID',event:{change:getMasterByPackage.bind($data,1,true)}"></select>
            </td>
        </tr>
        <tr class="reportTable">
            <td style="padding:0;border:none;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tbody data-bind="foreach:detailList">
                        <tr>
                            <!--ko foreach:$data-->
                            <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
                                <font color="#0000FF"><b><span data-bind="text:$data.index!==undefined?'['+($data.index+1)+']':'--'"></span></b></font>
                                <br>
                                <span data-bind="text:BetNumber"></span>
                            </td>
                            <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
                                <font color="#3300FF" data-bind="text:Odds"> </font>
                                <br>
                                <span data-bind="text:BetAmount"></span>
                                <br>
                                <font class="red" data-bind="text:GuessLoss"> </font>
                                <br>
                                <input type="hidden" id="n_7972" name="nhot[]" value="7972">
                            </td>
                            <!--/ko-->
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</script> 
<!--三字现模板--> 
<script id="sanzixian" type="text/html">
    <table cellpadding="0" width="100%" cellspacing="0" border="0">
        <tr class="reportTop">
            <!--ko foreach:list-->
            <td colspan="20">
                <a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoABatch">[分批赔率]</b></font></a>
                <span data-bind="text:$parent.betTypeIDType(BetTypeID)"></span>负值排行(<span data-bind="text:BetAmountTotal"></span>)<br>正值个数(<span data-bind="text:Positive"></span>)
                <a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoChangeOdds">[赔率变动]</b></font></a>
            </td>
            <!-- /ko -->
        </tr>
        <tr class="reportTop" data-bind="if:showMealList">
            <td colspan="20">
                三字现<font style="color:red"><b>[赔率变动]</b></font>&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="#"><font style="color:blue"><b data-bind="click:returnMaster">[返回实盘]</b></font></a>
                套餐:
                <select id="ratioLen" style="cursor:pointer" data-bind="options:masterMealList,optionsText:'SetMealName',optionsValue:'SetMealID',event:{change:getMasterByPackage.bind($data,1,true)}"></select>
            </td>
        </tr>
        <tr class="reportTable">
            <td style="padding:0;border:none;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tbody data-bind="foreach:detailList">
                        <tr>
                            <!--ko foreach:$data-->
                            <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
                                <font color="#0000FF"><b><span data-bind="text:$data.index!==undefined?'['+($data.index+1)+']':'--'"></span></b></font>
                                <br>
                                <span data-bind="text:BetNumber"></span>
                            </td>
                            <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
                                <font color="#3300FF" data-bind="text:Odds"> </font>
                                <br>
                                <span data-bind="text:BetAmount"></span>
                                <br>
                                <font class="red" data-bind="text:GuessLoss"> </font>
                                <br>
                                <input type="hidden" id="n_7972" name="nhot[]" value="7972">
                            </td>
                            <!--/ko-->
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</script> 
<!--四字现模板--> 
<script id="sizixian" type="text/html">
    <table cellpadding="0" width="100%" cellspacing="0" border="0">
        <tr class="reportTop">
            <!--ko foreach:list-->
            <td colspan="20">
                <a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoABatch">[分批赔率]</b></font></a>
                <span data-bind="text:$parent.betTypeIDType(BetTypeID)"></span>负值排行(<span data-bind="text:BetAmountTotal"></span>)<br>正值个数(<span data-bind="text:Positive"></span>)
                <a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoChangeOdds">[赔率变动]</b></font></a>
            </td>
            <!-- /ko -->
        </tr>
        <tr class="reportTop" data-bind="if:showMealList">
            <td colspan="20">
                四字现<font style="color:red"><b>[赔率变动]</b></font>&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="#"><font style="color:blue"><b data-bind="click:returnMaster">[返回实盘]</b></font></a>
                套餐:
                <select id="ratioLen" style="cursor:pointer" data-bind="options:masterMealList,optionsText:'SetMealName',optionsValue:'SetMealID',event:{change:getMasterByPackage.bind($data,1,true)}"></select>
            </td>
        </tr>
        <tr class="reportTable">
            <td style="padding:0;border:none;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tbody data-bind="foreach:detailList">
                        <tr>
                            <!--ko foreach:$data-->
                            <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
                                <font color="#0000FF"><b><span data-bind="text:$data.index!==undefined?'['+($data.index+1)+']':'--'"></span></b></font>
                                <br>
                                <span data-bind="text:BetNumber"></span>
                            </td>
                            <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
                                <font color="#3300FF" data-bind="text:Odds"> </font>
                                <br>
                                <span data-bind="text:BetAmount"></span>
                                <br>
                                <font class="red" data-bind="text:GuessLoss"> </font>
                                <br>
                                <input type="hidden" id="n_7972" name="nhot[]" value="7972">
                            </td>
                            <!--/ko-->
                        </tr>

                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</script> 
<!--四五二字定模版--> 
<script type="text/html" id="siwuerding">
    <table cellpadding="0" width="100%" cellspacing="0" border="0">
        <tr class="reportTop">
            <!--ko foreach:list-->

            <td colspan="20">
                <a href="#"><font color="#0000FF"><b data-bind="click:$parent.masterGoABatch">[分批赔率]</b></font></a>
                <span data-bind="text:$parent.betTypeIDType(BetTypeID)"></span>
                负值排行(<span data-bind="text:BetAmountTotal"></span>)<br>正值个数(<span data-bind="text:Positive"></span>)
                <a href="#"><font color="#0000FF"><b data-template="sidingwei" data-bind="click:$parent.masterGoChangeOdds">[赔率变动]</b></font></a>
            </td>
            <!-- /ko -->
        </tr>
        <tr class="reportTop" data-bind="if:showMealList">
            <td colspan="20">
                四定位<font style="color:red"><b>[赔率变动]</b></font>&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="#"><font style="color:blue"><b data-bind="click:returnMaster">[返回实盘]</b></font></a>
                套餐:
                <select id="ratioLen" style="cursor:pointer" data-bind="options:masterMealList,optionsText:'SetMealName',optionsValue:'SetMealID',event:{change:getMasterByPackage.bind($data,1,true)}"></select>
            </td>
        </tr>
        <tr class="reportTable">
            <td style="padding:0;border:none;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tbody data-bind="foreach:detailList">
                        <tr>
                            <!--ko foreach:$data-->
                            <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
                                <font color="#0000FF"><b><span data-bind="text:$data.index!==undefined?'['+($data.index+1)+']':'--'"></span></b></font>
                                <br>
                                <span data-bind="text:BetNumber"></span>
                            </td>
                            <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
                                <font color="#3300FF" data-bind="text:Odds"> </font>
                                <br>
                                <span data-bind="text:BetAmount"></span>
                                <br>
                                <font class="red" data-bind="text:GuessLoss"> </font>
                                <br>
                                <input type="hidden" id="n_7972" name="nhot[]" value="7972">
                            </td>
                            <!--/ko-->
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</script> 

<!--转模板--> 
<script id="trun" type="text/html">
    <table cellpadding="0" width="100%" cellspacing="0" border="0">
        <tr class="altbg1">
            <td colspan="8" width="40%"><span>累积最大数量: <b data-bind="text:count"></b></span></td>
            <td colspan="11" width="60%" data-bind="text:trunData()[0].name"></td>
            <td>
                <input type="button" value="刷新" data-bind="click:getRefreshTrun" class="button topBtn" />
            </td>
        </tr>
        <!--ko foreach:trunData()[0].data-->
        <tr data-bind="foreach:$data">
            <td width="5%" data-bind="text:BetNumber"></td>
            <td width="5%">
                <label class="blue" data-bind="text:Odds"></label><br>
                <label data-bind="text:BetAmount"></label><br>
                <label class="red" data-bind="text:GuessLoss"></label><br>
            </td>
        </tr>
        <!--/ko-->
        <!--ko if:betTypeID()===1-->
        <tr class="altbg1">
            <td colspan="8"></td>
            <td colspan="12">
                <b data-bind="text:trunData()[1].name"></b>&#12288;
                <label><input type="checkbox" name="1" data-bind="event:{change:trunSelectMulti.bind($data,1,event)}" />全选</label>&#12288;
                各降&#12288;
                <input type="text" name="" style="width:60px;font-size:14px;" />
                <input type="button" value="提交" data-bind="click:trunSubmit.bind($data,1,event)" class="button topBtn" />
            </td>
        </tr>
        <!--ko foreach:trunData()[1].data-->
        <tr data-bind="foreach:$data,click:$parent.trunSelect">
            <td width="5%" data-bind="text:BetNumber,css:$data.selectStyle"></td>
            <td width="5%" data-bind="css:$data.selectStyle">
                <label class="blue" data-bind="text:Odds"></label><br>
                <label data-bind="text:BetAmount"></label><br>
                <label class="red" data-bind="text:GuessLoss"></label><br>
            </td>
        </tr>
        <!--/ko-->
        <tr class="altbg1">
            <td colspan="8"></td>
            <td colspan="12">
                <b data-bind="text:trunData()[2].name"></b>&#12288;
                <label><input type="checkbox" name="1" data-bind="event:{change:trunSelectMulti.bind($data,2,event)}" />全选</label>&#12288;
                各降&#12288;
                <input type="text" name="" style="width:60px;font-size:14px;" />
                <input type="button" value="提交" data-bind="click:trunSubmit.bind($data,2,event)" class="button topBtn" />
            </td>
        </tr>
        <!--ko foreach:trunData()[2].data-->
        <tr data-bind="foreach:$data,click:$parent.trunSelect">
            <td width="5%" data-bind="text:BetNumber,css:$data.selectStyle"></td>
            <td width="5%" data-bind="css:$data.selectStyle">
                <label class="blue" data-bind="text:Odds"></label><br>
                <label data-bind="text:BetAmount"></label><br>
                <label  class="red" data-bind="text:GuessLoss"></label><br>
            </td>
        </tr>
        <!--/ko-->
        <!--/ko-->
        <tr class="altbg1">
            <td colspan="8"></td>
            <td colspan="12">
                <b data-bind="text:trunData()[3].name"></b>&#12288;
                <label><input type="checkbox" name="" data-bind="event:{change:trunSelectMulti.bind($data,3,event)}" />全选</label>&#12288;
                各降&#12288;
                <input type="text" name="" style="width:60px;font-size:14px;" />
                <input type="button" value="提交" data-bind="click:trunSubmit.bind($data,3,event)" class="button topBtn" />
            </td>
        </tr>
        <!--ko foreach:trunData()[3].data-->
        <tr data-bind="click:$parent.trunSelect,foreach:$data">
            <td width="5%" data-bind="text:BetNumber,css:$data.selectStyle"></td>
            <td width="5%" data-bind="css:$data.selectStyle">
                <label class="blue" data-bind="text:Odds"></label><br>
                <label data-bind="text:BetAmount"></label><br>
                <label class="red" data-bind="text:GuessLoss"></label><br>
            </td>
        </tr>
        <!--/ko-->
    </table>
</script> 
<script type="text/html" id="Virtual_Index">
    <tr class="reportTop" data-bind="foreach:list">
        <td colspan="5" width="25%"><span data-bind="text:$parent.mapping[BetTypeID]"></span>负值排行(<span data-bind="text:BetAmountTotal"></span>)<br> <input type="radio" name="colSelect" data-bind="click:$parent.changeMode"> 正值个数(<span data-bind="text:Positive"></span>)</td>
    </tr>
    <tr data-bind="foreach:detailList">
        <td width="25%" colspan="5" valign="top" style="padding:0;border:none;">
            <!--ko foreach:$data-->
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                    <tr data-bind="click:$parents[1].selected,css:selectStyle">
                        <td width="50%" class="zkright" valign="top" style="text-align: center; border-left: 1px solid #B7B7B7; " id="c_189X"><font color="#0000FF">[<b data-bind="text:$data.index()+1"></b>]</font>&nbsp;&nbsp;&nbsp;&nbsp;<span data-bind="text:BetNumber"></span>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td width="50%" class="txtCen">
                            <font color="#3300FF" data-bind="text:Odds"></font>
                            <br>
                            <font data-bind="text:BetAmount">-362076</font>
                            <br>
                            <font color="red" data-bind="text:GuessLoss"></font>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--/ko-->
        </td>
    </tr>
</script> 
<script type="text/html" id="Virtual_siziding">
    <tr class="reportTop" data-bind="foreach:list">
        <td colspan="20"><a href="#"><font color="#3300FF"><b>[A分批]</b></font></a> <span data-bind="text:$parent.mapping[BetTypeID]"></span>负值排行(<span data-bind="text:BetAmountTotal"></span>)<br>正值个数(<span data-bind="text:Positive"></span>)</td>
    </tr>
    <!--ko foreach:detailList-->
    <tr data-bind="foreach:$data">
        <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
            <font color="#0000FF">
                <b data-bind="text:$data.index()+1"></b>
            </font>
            <br>
            <span data-bind="text:BetNumber"></span>
        </td>
        <td width="5%" data-bind="click:$parents[1].selectedDisplay,css:selectStyle">
            <font color="#3300FF" data-bind="text:Odds"></font>
            <br>
            <font data-bind="text:BetAmount">-362076</font>
            <br>
            <font color="red" data-bind="text:GuessLoss"></font>
        </td>
    </tr>
    <!--/ko-->
</script> 
<!--子帐号 子公司权限模板--> 
<script type="text/html" id="CHILD-RELATION-TPL" title="设置权限">
        <form>
            <div class="form-group" style="margin-bottom:5px;" id="SetAssociatedSubsidiary">
                <div><input style="vertical-align:middle;" type="checkbox" data-bind="checked:checkedAll" id="CHECKEDALL" />&nbsp;<label for="CHECKEDALL">全选/反选</label></div>
                <div class="col-sm-5" data-bind="foreach:SetSubsidiarylist">
                    
                    <input style="vertical-align:middle;" type="checkbox" data-bind="value:ID,checked:$parent.childCompanyIds,attr:{id:LoginName}" name="SetSubsidiaryName" />
                    <label data-bind="text:LoginName,attr:{'for':LoginName}"></label>&nbsp;&nbsp;&nbsp;&nbsp;
                    

                </div>
            </div>
        </form>
    </script>
<div class="footer Noprint">
      <hr size="0" noshade="" color="BORDERCOLOR" width="80%" />
      <b></b> V2.0 &nbsp;© <b> </b><span class="smalltxt"></span> <span>欢迎使用圣地彩系统</span> </div>
<script>
                //计数器
        setInterval(function(){
            if ( getCookie('time')==''||parseInt(getCookie('time')) + 10 < parseInt(Math.round(new Date().getTime()/1000).toString())) {

                $.ajax({
                    url: "/index.php/portal/agent/online",
                    type: "post",
                    cache: false,
                    dataType: "json",
                    data:{id:<?php echo $_SESSION['aid'];?>},
                    success: function (json) {
                        if(json['data']){
                                setCookie('time',json['data']);
                                setCookie('IsChildShowReport',json['IsChildShowReport']);
                        }
                    }

                })
            } 
         }, 5000);
        function setCookie(c_name,value,expiredays)
        {
            var exdate=new Date()
            exdate.setDate(exdate.getDate()+expiredays)
            document.cookie=c_name+ "=" +escape(value)+
            ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
        }
        function getCookie(c_name)
        {
            if (document.cookie.length>0)
              {
              c_start=document.cookie.indexOf(c_name + "=")
              if (c_start!=-1)
                { 
                c_start=c_start + c_name.length+1 
                c_end=document.cookie.indexOf(";",c_start)
                if (c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
                } 
              }
            return ""
        }
        window.ACCOUNT = Utils.Cookie.get('AccountID');
        setInterval(function () {
            if (ACCOUNT !== Utils.Cookie.get('AccountID')) {
                location.href = '/index.php/portal/index/agent';
                //Utils.Cookie.remove('Ticks', '/').remove('isAgentLevel', '/').remove('RationLable', '/').remove('AgentLevel', '/').remove('PeriodsNumber').remove('PeriodsID');
                //location.href = '/Home/Index';
            }
        }, 1000);
    </script>
</body>
</html>