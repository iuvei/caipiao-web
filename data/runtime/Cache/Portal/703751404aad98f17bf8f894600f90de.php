<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script type="text/javascript">
        var
            getBaseUrl = new Function('return "/SSCMember"'),
            baseUrl = getBaseUrl();
    </script>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>会员网</title>

    <link rel="stylesheet" type="text/css" href="/SSCMember/Content/Themes/Default/Home/Index.css?2017092610" name="oid" />
    <link rel="stylesheet" type="text/css" href="/SSCMember/Content/Themes/Default/Home/Common.css?2017092610" name="oid" />
    <link href="/SSCMember/Scripts/Lib/artDialog/ui-dialog.css" rel="stylesheet" name="oid" />
    <link href="/SSCMember/Content/lottery.css" rel="stylesheet" name="oid" />
    <link href="/SSCMember/Content/Themes/Default/Main/jquery.qtip.min.css" rel="stylesheet" name="oid" />
    <link href="/SSCMember/Content/Themes/Default/Home/right-tip.css?20170508000000000" rel="stylesheet" name="oid" />
    <link href="/SSCMember/Content/Themes/Default/Home/print.css?_=20170508000000000" rel="stylesheet" media="print" />
    <style>
        .bg-two{
            background: #4cb034
        }
    </style>


    <!-- css3-mediaqueries.js for IE less than 9 -->
    <!--[if lt IE 9]>
    <script
       src="//css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js">
    </script>
    <![endif]-->
    <script src="/SSCMember/Scripts/Lib/jquery-1.11.1.min.js"></script>
    <script src="/SSCMember/Scripts/jquery.xdomainrequest.min.js"></script>
    <script src="/SSCMember/Scripts/Lib/artDialog/dialog-plus-min.js"></script>
    
    <script src="/SSCMember/Scripts/Lib/knockout-3.3.0.js"></script>
    <script src="/SSCMember/Scripts/Lib/sea.js"></script>
    <script src="/SSCMember/Scripts/Default/utils.js?_=20170713000"></script>
    <script src="/SSCMember/Scripts/Default/ui.common.js?20170718100"></script>
    <script src="/SSCMember/Scripts/Default/extend.js?20170713000"></script>
    <script src="/SSCMember/Scripts/Lib/printThis.js?20170713000"></script>
    <!-- <script src="/Scripts/Lib/My97DatePicker/WdatePicker.js"></script> -->
    <script src="/SSCMember/Scripts/Lib/jquery.qtip.min.js"></script>
    <script src="/SSCMember/Scripts/Lib/json2.min.js"></script>
    <script src="/SSCMember/Scripts/Default/checkMobile.js"></script>
    <script type="text/javascript">
        //打印id为参数值内的元素
        function printByIframe(id) {
            //var SubNickName = document.getElementById('SubNickName').innerText+"小票";
            $("#" + id).printThis({
                importCSS: false,
                //header: "<h1>" + SubNickName + "</h1>",
                loadCSS: "/SSCMember/Content/Themes/Default/Home/print.css"
            });
            //var ele = $("#" + id);

            //ele = $(ele.html());
            //ele.find(".no-print").remove();
            //var fp = $(document.getElementById("printIframe"));
            //fp.css("display", "block");
            //var fw = document.getElementById("printIframe").contentWindow;
            //$(fw.document.body).html(ele);

            //var height = 23 * (ele.find("tr").length + 2) + 4;
            //$(fw.document.body).css("width", "100%");

            //ele.css("width", "99%");
            //fp.css({ width: "100%", height: height + "px" });
            //var styleArr = [];
            //if (navigator.userAgent.indexOf('MSIE') == -1) {
            //    Array.prototype.push.apply(styleArr, $(document.head).find('[name="oid"]'));
            //} else {
            //    $.each($('[name="oid"]'), function (i, v) {
            //        styleArr.push(v);
            //    });
            //}
            //if (navigator.userAgent.indexOf('MSIE 8.0') > -1) {
            //    $('head').find('[name="oid"]').remove();
            //} else {
            //    $(document.head).find('[name="oid"]').remove();
            //}
            //fw.print();

            //fp.css("display", "none");
            //$.each(styleArr, function (i, v) {
            //    $('head').append(v);
            //});
        }
        function privew() {
            $.ajax({
                url: "/index.php/Portal/FastBeat/ModifyBetClearPrint",
                type: "post",
                cache: false,
                dataType: "json",
                success: function (json) {
                    if (json.status) {
                        if (json.IsPrint == true) {
                            if (confirm("你已经打印过该票，还要打印吗？")) {
                                printByIframe("IsShowLottoryTrue");

                            }
                        } else {
                            printByIframe("IsShowLottoryTrue");
                            /*
                            var container = $('#Container'), styleArr = [];
                            container.addClass('no-print');

                            var overFlow = $('.overFlow'), flag = false;
                            overFlow.removeClass('overFlow');
                            $('#IFRAME').is(':visible') && ($('#IFRAME').css('display', 'none'), flag = true);

                            var bdhtml = window.document.body.innerHTML;//获取当前页的html代码
                            var sprnstr = "<!--startprint1-->";//设置打印开始区域
                            var eprnstr = "<!--endprint1-->";//设置打印结束区域
                            var prnhtml = bdhtml.substring(bdhtml.indexOf(sprnstr) + 18); //从开始代码向后取html
                            var prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));//从结束代码向前取html
                            window.document.body.innerHTML = prnhtml;

                            styleArr = [];
                            if (navigator.userAgent.indexOf('MSIE') == -1) {
                                Array.prototype.push.apply(styleArr, $(document.head).find('[name="oid"]'));
                            } else {
                                $.each($('[name="oid"]'), function (i, v) {
                                    styleArr.push(v);
                                });
                            }
                            if (navigator.userAgent.indexOf('MSIE 8.0') > -1) {
                                $('head').find('[name="oid"]').remove();
                            } else {
                                $(document.head).find('[name="oid"]').remove();
                            }
                            window.print();
                            $.each(styleArr, function (i, v) {
                                $('head').append(v);
                            });
                            //$(document.head).append();
                            window.document.body.innerHTML = bdhtml;
                            location.reload();
                            if (flag) {
                                flag = false; $('#IFRAME').css('display', '')
                            }
                            container.removeClass('no-print');
                            overFlow.addClass('overFlow');
                            */
                        }


                    } else {
                        Utils.tip(json.info, json.status, json.status ? function () {

                        } : null);
                        return;
                    }

                }
            });

        }
        /*
            <?php print_r($_SESSION); ?>
        */
        //计数器
        setInterval(function(){
           if ( getCookie('time')==''||parseInt(getCookie('time')) + 10 < parseInt(Math.round(new Date().getTime()/1000).toString())) {

                $.ajax({
                    url: "/index.php/Home/online",
                    type: "post",
                    cache: false,
                    dataType: "json",
                    data:{id:<?php echo $_SESSION['uid'];?>},
                    success: function (json) {
                        if(json['data']){
                                setCookie('time',json['data']);
                        }
                    }

                })
            } 
         }, 10000);
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
    </script>
</head>
<body style="border:0px red dashed;">
    <iframe id="printIframe" src="/index.php/Home/sprint" style="display:none;"></iframe>
    <div class="bg-one no-print" id="print_box">
        <table class="bg-two" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td width="262" height="90px"><label id="SubNickName" style="width: 247px; height: 90px; float: left; display:block;font-weight: bold; font-size: 70px; line-height: 90px;background:#fff; -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align:center;"></label>  </td>
                <td class="head_in">
                    <div class="nav">
                        <ul id="menus">
                            <li id="betList"><a href="/BetList/Index" class="icon icon_betList" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/BetList/Index','BetList/Index')">下注明细</a></li>
                            <li id="BetHistory"><a href="/BetHistory/Index" class="icon icon_BetHistory" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/BetHistory/Index','BetHistory/Index')">历史账单</a></li>

                            <li id="Report"><a href="/Report/DayReport" class="icon icon_Report1" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/Report/DayReport','Report/DayReport')">日报表</a></li>
                            <li id="Report"><a href="/Report/WeekReport" class="icon icon_Report2" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/Report/WeekReport','Report/WeekReport')">周报表</a></li>
                            <li id="Report"><a href="/Report/MonthReport" class="icon icon_Report3" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/Report/MonthReport','Report/MonthReport')">月报表</a></li>

                            <li id="Profile"><a href="/Profile/Index" class="icon icon_Profile" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/Profile/Index','Profile/Index')">会员资料</a></li>

                            <li id="DrawList"><a href="/DrawList/Index" class="icon icon_DrawList" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/DrawList/Index','DrawList/index')">开奖号码</a></li>
                            <li id="Rule"><a href="/Home/Rule" class="icon icon_Rule" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/Home/Rule',null)">规则说明</a></li>
                            
                            <li id="ChangePwd"><a href="/Home/ChangePwd" class="icon icon_ChangePwd" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/Home/ChangePwd','Home/ChangePwd')">修改密码</a></li>
                            <li><a href="/index.php/portal/index/login" class="icon icon_signOut" data-bind="click:signOut">退出</a></li>
                        </ul>
                    </div>
                    <div class="marquee">
                                    <div class="mar">
                                        
                                        <marquee behavior="scroll" scrollamount="3"><a href="javascript:void(0)"><label id="Detail"></label></a></marquee>

                                    </div>
                                    <div class="stoptime"></div>  
                                    
                                </div>
                    <div class="menu">
                                    <ul id="TabMenuBox">
                                        <li class="active"><a href="/BetPanel/FixOne/Index" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/FixOne/Index','FixOne/Index',0)">一字定</a></li>
                                        
                                        <li><a href="/BetPanel/FixTwo/Index" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/FixTwo/Index','FixTwo/Index',1)">二字定</a></li>
                                        <li><a href="/BetPanel/FastBeat/Index" data-hide="IFRAME" data-exclude="true" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/FastBeat/Index','BetPanel/FastBeat/Index',2)">快打</a></li>
                                        <li><a href="/BetPanel/FastChoose/Index" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/FastChoose/Index','FastChoose/Index',3)">快选</a></li>
                                        <li><a href="/BetPanel/FastTranslate/Index" data-hide="IFRAME" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/FastTranslate/Index','FastTranslate/Index',4)">快译</a></li>
                                        <li><a href="/BetPanel/Mo/Index" data-hide="IFRAME" data-exclude="true" data-bind="click:$root.tabmenu.bind($data,'/index.php/Portal/Mo/Index','Mo/Index',5)">赔率变动表</a></li>
                                        <li><a href="/BetPanel/InportTxt/Index" data-show="IFRAME" data-bind="click:$root.clear.bind($data)">txt导入</a></li>
                                        
                                        <li style="color:#f5f22b;margin-left:40px;" class="icon menu_tit">提示：若公司有手机版本域名，则系统将在用户使用手机登录时自动跳转</li>
                                    </ul>
                                </div>
                </td>
                <td style="width:300px;position:absolute;right:0;color: #fff">
                    <div style="background: #74bf6a;height: 29px;text-align: center;line-height: 29px;font-size: 18px">最新开奖号码</div>
                    <div style="background: #91cc88;height: 29px">
                        <div style="float: left;width: 149px;text-align: center;line-height: 29px;font-size: 16px;border-right:1px solid #aadba4">期号</div>
                        <div style="float: left;width: 149px;text-align: center;line-height: 29px;font-size: 16px;border-left:1px solid #aadba4">号码</div>    
                    </div>
                    <div style="background: #acd7a1;height: 32px">
                        <div style="float: left;width: 149px;text-align: center;line-height: 32px;font-size: 16px;border-right:1px solid #baeab5;color: black"><span id="bonus_time"></span></div>
                        <div style="float: left;width: 149px;text-align: center;line-height: 32px;font-size: 16px;border-left:1px solid #baeab5;color: #e52018;font-weight: bold"><span id="bonus_number"></span></div>
                    </div>
                </td>
                <td width="1"></td>
            </tr>
        </table>
    </div>
    <div class="main no-print oh" id="main_box" style="position: relative;">
        <div id="sideScrollContainer" style="vertical-align:top;width:250px;float:left;position: absolute;top:0;bottom:0;left:0;overflow-y: scroll;">
            <div class="side">
                <table class="tablecommon no-print" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr class="title" style="padding-top:5px">
                        <td colspan="3" align="center">会员信息</td>
                    </tr>
                    <tr>
                        <td class="box">账号：</td>
                        <td><span id="LoginName"></span></td>
                    </tr>
                    <tr>
                        <td class="box">信用：</td>
                        <td><span id="DefaultCredit"></span></td>
                    </tr>
                    
                    <tr>
                        <td class="box">期号：</td>
                        <td><span id="Member-Issue"></span></td>
                    </tr>
                    <tr>
                        <td class="box">结果：</td>
                        <td><span id="lastPeriodsNumber"></span></td>
                        <td><input type="button" class="btn1 red-btn" id="dvMemberRefreshButton" data-bind="click:memberRefresh" value="刷新" /></td>
                    </tr>
                </table>
                <table class="no-print" style="width:100%">
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="align-c">
                            <input id="set" type="button" class="btn1" value="设置图示" data-bind="click:$root.tabmenu.bind($data,'/index.php/Home/Setting',null)" />
                        </td>
                    </tr>
                </table><br />
                <table class="no-print" width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td style="text-align:right;font-size:15px;">单位：元</td></tr></tbody></table>

                <table class="tablecommon no-print" id="IsShowLottoryFalse" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr class="title">
                        <td align="center">正在使用</td>
                    </tr>
                    <tr>
                        <td align="center">
                            <img src="/SSCMember/Content/Themes/base/images/ssclogo.png" />

                        </td>
                    </tr>



                </table>
                <!--startprint1-->
                <div id="IsShowLottoryTrue" class="IsShowLottoryTrue">
                    <table class="tablecommon printIndex" id="Order" cellspacing="0" cellpadding="0" border="0">
                        <tr class="title">
                            <td colspan="3" align="center">
                                <label>圣地彩</label>
                            </td>
                        </tr>
                        <tr>
                            <td class="print3" style="text-align:left">
                                <div>时间：<span id="BetDt"></span></div>
                                <div>会员：<span id="MemberLoginName"></span></div>
                                <div>编号：<span id="Number"></span></div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="padding:0;">
                                <div class="user">
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" class="printTab">
                                        <tr class="user-b top-border print2">
                                            <td class="no" width="30%">号码</td>
                                            <td width="40%">赔率</td>
                                            <td width="30%" class="hasBd">金额</td>
                                        </tr>
                                        <tr id="PeriodsNumberHtml" style="display:none" class="print2"></tr>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="print5" colspan="3">笔数&nbsp;<span id="CountHome">0</span>&nbsp;总金额&nbsp;<span id="SumHome">0</span></td>
                        </tr>
                        <tr id="isVisibleLeft" class="no-print">
                            <td colspan="3" style="display:none" id="FenYeStyle">
                                <input type="button" value="上一页" class="no-print" data-bind="click:clickPreviousPageLeft" id="PreviousPageLeftID" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="button" value="下一页" class="no-print" data-bind="click:clickNextPageLeft" id="NextPageLeftID" />
                                <span class="no-print">共 <label id="ColumnLeft"></label>   页</span>
                            </td>

                        </tr>
                        <tr class="user-b no-print">
                            <td colspan="3" style="border: none;">
                                <div class="f-button">
                                    <input type="button" value="清&nbsp;空" class="no-print btn1" onclick="WipeData();" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input type="button" value="打&nbsp;印" class="no-print btn1  red-btn" id="printLeft" onclick="privew()" />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" id="PeriodsNumberPrompt"></td>
                        </tr>
                    </table>
                    

                </div>
                <!--endprint1-->
                <!--<div class="f-button">
                    <input type="button" value="清&nbsp;空" class="no-print" data-bind="click: WipeData" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div> -->
            </div>
        </div>
        <div class="no-print minW1024 container">
            <div id="IFRAME" style="display: none;">
                <iframe src="/index.php/Home/InportTxt" frameborder="0"></iframe>
            </div>
            <div id="Container" class="" data-bind="component:{name:container,params:params}"></div>
            <script type="text/html" id="RULE">

<style>


</style>


<div class="table-out" id="ROLE-TPL">
    <table class="tablecommon" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr class="title">
            <td>&#12288;</td>
        </tr>
        <tr>
            <td style="font-size: 14px; padding-left: 100px;">
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
                    <label> "五位数"的每注彩票由00000-99999中的任意5位自然数排列而成。</label>
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
</div>


            </script>
        </div>
        <div style="clear:both;"></div>
    </div>
    <script type="text/html" id="Tip-Dialog">
        <table class="tablecommon" cellspacing="0" cellpadding="0" border="0" width="99%" style="margin-left:13px; margin-top:3px; ">
            <tbody>
                <tr class="title">
                    <td>提示</td>
                </tr>
                <tr class="one">
                    <td class="tablecommon_td">
                        <div id="content" style="font-size:36px;text-align:center;height:200px;line-height:200px;">
                            当前没有开盘
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </script>


    <script type="text/html" id="oneFix">
        <div class="t20 tblock">
            <div class="title">口XXX</div>
            <table  data-bind="foreach:t20" cellpadding="0" width="100%" cellspacing="0" border="0">
                <tr class='onefix-item'  data-bind="click:$parent.checked, attr: {'data-title': title}">
                    <td data-bind="text: title"></td>
                    <td data-bind="text: Odds, css:IsMaster==true?'red right':'blueRight right'"></td>
                </tr>
            </table>
            <div class="operator" data-bind="click: multiple" data-type="t20">
                <div class="single" data-role="1">单</div>
                <div class="double" data-role="2">双</div>
                <div class="big" data-role="3">大</div>
                <div class="little" data-role="4">小</div>
            </div>
        </div>
        <div class="t21 tblock">
            <div class="title">X口XX</div>
            <table  data-bind="foreach:t21" cellpadding="0" width="100%" cellspacing="0" border="0">
                <tr data-bind="click:$parent.checked, attr: {'data-title': title}" class='onefix-item'>
                    <td data-bind="text: title"></td>
                    <td data-bind="text: Odds, css:IsMaster==true?'red right':'blueRight right'"></td>
                </tr>
            </table>
            <div class="operator" data-bind="click: multiple" data-type="t21">
                <div class="single" data-role="1">单</div>
                <div class="double" data-role="2">双</div>
                <div class="big" data-role="3">大</div>
                <div class="little" data-role="4">小</div>

            </div>
        </div>
        <div class="t22 tblock">
            <div class="title">XX口X</div>
            <table  data-bind="foreach:t22" cellpadding="0" width="100%" cellspacing="0" border="0">
                <tr  data-bind="click:$parent.checked, attr: {'data-title': title}" class='onefix-item'>
                    <td data-bind="text: title"></td>
                    <td data-bind="text: Odds, css:IsMaster==true?'red right':'blueRight right'"></td>
                </tr>
            </table>
            <div class="operator" data-bind="click: multiple" data-type="t22">
                <div class="single" data-role="1">单</div>
                <div class="double" data-role="2">双</div>
                <div class="big" data-role="3">大</div>
                <div class="little" data-role="4">小</div>

            </div>
        </div>
        <div class="t23 tblock">
            <div class="title">XXX口</div>
            <table  data-bind="foreach:t23" cellpadding="0" width="100%" cellspacing="0" border="0">
                <tr  data-bind="click:$parent.checked, attr: {'data-title': title}" class='onefix-item'>
                    <td data-bind="text: title"></td>
                    <td data-bind="text: Odds, css:IsMaster==true?'red right':'blueRight right'"></td>
                </tr>
            </table>
            <div class="operator" data-bind="click: multiple" data-type="t23">
                <div class="single" data-role="1">单</div>
                <div class="double" data-role="2">双</div>
                <div class="big" data-role="3">大</div>
                <div class="little" data-role="4">小</div>

            </div>
        </div>
        <div class="t24 tblock">
            <div class="title">XXXX口</div>
            <table  data-bind="foreach:t24" cellpadding="0" width="100%" cellspacing="0" border="0">
                <tr  data-bind="click:$parent.checked, attr: {'data-title': title}" class='onefix-item'>
                    <td data-bind="text: title"></td>
                    <td data-bind="text: Odds, css:IsMaster==true?'red right':'blueRight right'"></td>
                </tr>
            </table>
            <div class="operator" data-bind="click: multiple" data-type="t24">
                <div class="single" data-role="1">单</div>
                <div class="double" data-role="2">双</div>
                <div class="big" data-role="3">大</div>
                <div class="little" data-role="4">小</div>

            </div>
        </div>
    </script>

<script type="text/html" id="modelOne">
        <!-- 模式1 begin-->
        <table class="twowordtable twowordtable1" cellpadding="0" width="100%" cellspacing="0" border="0">
            <tbody>
                <tr class="tryy tryy1">
                    <td class="right">号码</td>
                    <td class="left"><span class="n-red">金额</span></td>
                    <td class="right">号码</td>
                    <td class="left"><span class="n-red">金额</span></td>
                    <td class="right">号码</td>
                    <td class="left"><span class="n-red">金额</span></td>
                    <td class="right">号码</td>
                    <td class="left"><span class="n-red">金额</span></td>
                    <td class="right">号码</td>
                    <td class="left"><span class="n-red">金额</span></td>
                    <td class="right">号码</td>
                    <td class="left"><span class="n-red">金额</span></td>
                    <td class="right">号码</td>
                    <td class="left"><span class="n-red">金额</span></td>
                    <td class="right">号码</td>
                    <td class="left"><span class="n-red">金额</span></td>
                    <td class="right">号码</td>
                    <td class="left"><span class="n-red">金额</span></td>
                    <td class="right">号码</td>
                    <td class="left"><span class="n-red">金额</span></td>
                </tr>
            </tbody>
        </table>
        <!--XX口口 begin-->
        <table class="twowordtable twowordtable1" data-bind="foreach:list" cellpadding="0" width="100%" cellspacing="0" border="0">
            <tbody>
                <tr class="input" data-bind="foreach:line">
                    <td width="5%" class="right"><p data-bind="text:Odds,css:IsMaster==true?'red right':'blueRight right'">80.2</p><span data-bind="text:BetTypeName"></span></td>
                    <td class="left table-int" width="5%"><input type="text" data-bind="textinput:Gold,event:{blur:$parents[1].getIsEnterFixTwo,keydown:$parents[1].next.bind($data,$data,event)}" /></td>
                </tr>
            </tbody>
        </table>
        <!--XX口口 end-->

        <table class="twowordtable" cellpadding="0" width="100%" cellspacing="0" border="0">
            <tr><td colspan="20" align="center"><input class="btn" type="button" value="确定" id="submit" data-bind="click:submodelone" /></td></tr>
        </table>

        <!--模式1 end-->
    </script>

    <script type="text/html" id="modeltwo">
        <!--模式2 begin-->
        <table class="twowordtable twowordtable1" cellpadding="0" width="100%" cellspacing="0" border="0">
            <tbody>
                <tr data-bind="click:SetCol">
                    <td width="5" class="bg-top ignore">&#12288;</td>
                    <td colspan="2" data-index="0" class="bg-top"><img src="/SSCMember/Images/Default/Main/bhrow.gif" /></td>
                    <td colspan="2" data-index="1" class="bg-top"><img src="/SSCMember/Images/Default/Main/bhrow.gif" /></td>
                    <td colspan="2" data-index="2" class="bg-top"><img src="/SSCMember/Images/Default/Main/bhrow.gif" /></td>
                    <td colspan="2" data-index="3" class="bg-top"><img src="/SSCMember/Images/Default/Main/bhrow.gif" /></td>
                    <td colspan="2" data-index="4" class="bg-top"><img src="/SSCMember/Images/Default/Main/bhrow.gif" /></td>
                    <td colspan="2" data-index="5" class="bg-top"><img src="/SSCMember/Images/Default/Main/bhrow.gif" /></td>
                    <td colspan="2" data-index="6" class="bg-top"><img src="/SSCMember/Images/Default/Main/bhrow.gif" /></td>
                    <td colspan="2" data-index="7" class="bg-top"><img src="/SSCMember/Images/Default/Main/bhrow.gif" /></td>
                    <td colspan="2" data-index="8" class="bg-top"><img src="/SSCMember/Images/Default/Main/bhrow.gif" /></td>
                    <td colspan="2" data-index="9" class="bg-top"><img src="/SSCMember/Images/Default/Main/bhrow.gif" /></td>
                </tr>
                <tr class="tryy">
                    <td width="5" style="background:#fff;" class="bg-left ignore">&#12288;</td>
                    <td colspan="2" class="right"><span class="left">号码</span><span class="n-red right">赔率</span></td>
                    <td colspan="2" class="right"><span class="left">号码</span><span class="n-red right">赔率</span></td>
                    <td colspan="2" class="right"><span class="left">号码</span><span class="n-red right">赔率</span></td>
                    <td colspan="2" class="right"><span class="left">号码</span><span class="n-red right">赔率</span></td>
                    <td colspan="2" class="right"><span class="left">号码</span><span class="n-red right">赔率</span></td>
                    <td colspan="2" class="right"><span class="left">号码</span><span class="n-red right">赔率</span></td>
                    <td colspan="2" class="right"><span class="left">号码</span><span class="n-red right">赔率</span></td>
                    <td colspan="2" class="right"><span class="left">号码</span><span class="n-red right">赔率</span></td>
                    <td colspan="2" class="right"><span class="left">号码</span><span class="n-red right">赔率</span></td>
                    <td colspan="2" class="right"><span class="left">号码</span><span class="n-red right">赔率</span></td>
                </tr>
            </tbody>
        </table>
        <!-- XX口口 begin-->
        <table class="twowordtable twowordtable1" data-bind="foreach:list" cellpadding="0" width="100%" cellspacing="0" border="0">
            <tr>
                <td width="5" class="bg-left" data-bind="click:$parent.SetRow,attr:{'data-index':$index}"><img src="/SSCMember/Images/Default/Main/bhcol.gif" /></td>
                <!--ko foreach:line-->
                <td colspan="2" class="right" data-bind="click:$parents[1].checked,attr:{name:BetTypeName},css:selectStyle" style="padding-left:2px;">
                    <span data-bind="text:BetTypeName" class="left">XX00  </span>

                    <span data-bind="text:Odds,css:IsMaster==true?'red right':'blueRight right'">80.2</span>
                </td>
                <!--td class="left"></!--td-->
                <!--/ko-->
            </tr>
        </table>
        <!-- XX口口 end-->
        <table class="twowordtable" cellpadding="0" width="100%" cellspacing="0" border="0">
            <tr>
                <td colspan="15">
                    <table class="footertable" cellpadding="0" width="100%" cellspacing="0" border="0">
                        <tr class="tryy">
                            <td rowspan="2" width="40"><b>定位置</b></td>
                            <td style="background:#fff;" class="num" id="TwoBet1" data-nums="0" data-bind="click:addEven">
                                
                                <label data-bind="text:NumA"></label>
                                &nbsp;<input type="button" value="0" /><input type="button" value="1" /><input type="button" value="2" />
                                <input type="button" value="3" /><input type="button" value="4" /><input type="button" value="5" />
                                <input type="button" value="6" /><input type="button" value="7" /><input type="button" value="8" />
                                <input type="button" value="9" /><input type="button" value="单" /><input type="button" value="双" />
                                <input type="button" value="大" /><input type="button" value="小" />
                            </td>
                            <td rowspan="2" width="30"><b>合分</b></td>
                            <td rowspan="2" id="HeFen" style="background:#fff;" class="num" data-bind="click:addHeFen">
                                <input type="button" value="0" /><input type="button" value="1" /><input type="button" value="2" />
                                <input type="button" value="3" /><input type="button" value="4" /><input type="button" value="单" /><br />
                                <input type="button" value="5" /><input type="button" value="6" /><input type="button" value="7" />
                                <input type="button" value="8" /><input type="button" value="9" /><input type="button" value="双" />
                            </td>
                            <td rowspan="2" width="30" style="background:#fff;">
                                <b><!--ko text:NumA--><!--/ko-->位</b>&nbsp;&nbsp;<input type="text" data-bind="textinput:NumAInput" />&nbsp;&nbsp;<br />
                                <b><!--ko text:NumB--><!--/ko-->位</b>&nbsp;&nbsp;<input type="text" data-bind="textinput:NumBInput" />&nbsp;&nbsp;
                            </td>
                        </tr>
                        <tr>
                            <td class="num" id="TwoBet2" data-nums="1" data-bind="click:addEven">
                                
                                <label data-bind="text:NumB"></label>
                                &nbsp;<input type="button" value="0" /><input type="button" value="1" /><input type="button" value="2" />
                                <input type="button" value="3" /><input type="button" value="4" /><input type="button" value="5" />
                                <input type="button" value="6" /><input type="button" value="7" /><input type="button" value="8" />
                                <input type="button" value="9" /><input type="button" value="单" /><input type="button" value="双" />
                                <input type="button" value="大" /><input type="button" value="小" />
                            </td>
                        </tr>
                    </table>
                </td>
                <td colspan="6">
                    金额&nbsp;
                    <input class="btn" id="Money" data-bind="textinput:Money,click:getMoney,event:{keyup:disableEnterFixTwo,blur:getIsEnterFixTwo}" type="text" />
                    <label><input type="checkbox" data-bind="checked:isEceptRepeat" />除重</label>
                    <input class="btn" type="button" data-bind="click:submodeltwo" value="确定" />
                    <input class="btn" type="button" data-bind="click:cancel" value="取消" />
                </td>
            </tr>
        </table>
        <!--模式2 end-->
    </script>
    <script>
        window.ACCOUNT = Utils.Cookie.get('UserId');
        setInterval(function () {
            if (ACCOUNT !== Utils.Cookie.get('UserId')) {
                alert("您已经被踢出，请重新登录！");
                window.location.href = "/index.php/portal/index/login";
            }
        }, 1000);
        function WipeData() {
            var order = $('#Order');
            $.ajax({
                url: "/index.php/Home/ModifyBetLeftClear",
                type: "post",
                success: function (json) {
                    if (json.status == true) {
                        $('#BetDt').html('');
                        $('#Number').html('');
                        framework._extend.getBetInfoForLeftInfo();
                    }
                }
            });
        };
        /**
        *创建音频播放器
        *随后可以使用 Utils.sound.paly() 播放
        */
        Utils.sound.create({ path: baseUrl + '/Content/sound/', filename: 'sound', times: 1 });

    </script>

</body>
</html>