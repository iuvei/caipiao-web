<?php if (!defined('THINK_PATH')) exit();?>

<html>
<head>
    <title>LIPS</title>
    <meta content="454247874248421werfwerae245121247512" />

    <link rel="stylesheet" href="/SSCCompany/Content/Default/Style/login/login.css?20170427000001" type="text/css" />
  
    <script type="text/javascript" src="/SSCCompany/Scripts/jquery-1.8.2.js"></script>
    <script src="/SSCCompany/Scripts/Default/utils.js"></script>

</head>
<body style="margin-left:0px;margin-top:0px;" data-page="agent">
    
    <div class="contianer login-contianer">
        <div class="login-area">
            <span class="logo"></span>
            <div class="login-form">
                <form method="post" name="loginfrm" action="/index.php/Portal/index/dologin2">
                    <ul>
                        <li><span>用户名</span><div class="box"><input type="text" id="admin_username" placeholder="请输入账号" value="<?php if($_SESSION['qzdlid']){ echo "******"; } ?>"/></div></li>
                        <li><span>密码</span><div class="box"><input type="password" id="admin_password" placeholder="请输入密码" value="<?php if($_SESSION['qzdlid']){ echo "******"; } ?>"/></div></li>

                        <li>
                            <span>验证码</span>
                            <div class="box" style="margin-top: 6px;position: relative;">
                                <input type="text" id="admin_code" placeholder="请输入验证码" value=""/>
                                <img class="verify_img" src="/index.php?g=api&m=checkcode&a=index&length=4&font_size=18&width=140&height=40&use_noise=0&use_curve=0" onclick="this.src='/index.php?g=api&m=checkcode&a=index&length=4&font_size=18&width=140&height=40&use_noise=0&use_curve=0&time='+Math.random();" style="cursor: pointer;" title="点击获取"/>   
                            </div>
                        </li>
                        


                        <li>
                            <input type="submit" name="login_admin" value="登录" class="regsiter-btn">
                        </li>
                        <li class="login-help" id="tip"> </li>
                    </ul>
                </form>
            </div>
        </div>
    </div>
    <div class="footer">
        <div class="bottom-info-main">
            <div class="main clear">
                <div class="bottom-info" style="display:none;">
                    <div class="new-box">
                        <h1><em>技术支持</em><span>Techsupport</span></h1>
                        <div class="new-con clear">
                            <div class="footer_logo"><a href="#"></a></div>
                            <div class="footer_title">
                                <p>业界达到国际领先水平，会为合作伙伴消除技术壁垒，永远走在迅速变化发展的创新最前沿!</p>
                                <div class="company_name clear">
                                    <span class="footer_line"></span>
                                    <div class="footer_company"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom-info" style="float:none;margin:0 auto;">
                    <div class="new-box">
                        <h1><em>推荐浏览器</em><span>Browser</span></h1>
                        <div class="new-con">
                            <div class="clear">
                                <ul class="browser-list commonlist notitle clear">
                                    <li>
                                        <a href="http://rj.baidu.com/soft/detail/14917.html" target="_blank"><i class="icon icon-browser icon-browserIE"></i><span>IE新版下载</span></a>
                                    </li>
                                    <li>
                                        <a href="http://rj.baidu.com/soft/detail/11843.html" target="_blank"><i class="icon icon-browser icon-browserFF"></i><span>Firefox浏览器</span></a>
                                    </li>
                                    <li>
                                        <a href="http://rj.baidu.com/soft/detail/14744.html?ald" target="_blank"><i class="icon icon-browser icon-browserGL"></i><span>Chrome浏览器</span></a>
                                    </li>
                                </ul>
                                <div class="browser-tip">
                                    <p>

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="broFt" style="display:none;">
        <hr size="0" noshade="" color="BORDERCOLOR" width="80%"><br />
        <span class="red">您的浏览器版本过低 推荐使用以下浏览器</span><br />
        <a href="http://rj.baidu.com/soft/detail/14744.html?ald" target="_blank">
            <img width="50" height="50" title="点击下载谷歌浏览器" src="/SSCCompany/Content/Default/Images/google.png" />
        </a>
        <a href="https://download.microsoft.com/download/5/E/A/5EA5BC30-C922-42B5-BF61-D087C7D93A4D/EIE11_ZH-CN_MCM_WIN7.EXE" target="_blank">
            <img width="85" height="85" title="IE8以上版本浏览器" src="/SSCCompany/Content/Default/Images/ie8.png" />
        </a>
        <a href="http://www.firefox.com.cn/" target="_blank">
            <img width="50" height="50" title="点击下载火狐浏览器" src="/SSCCompany/Content/Default/Images/firefox.png" />
        </a>
        <hr size="0" noshade="" color="BORDERCOLOR" width="80%">
    </div>
    <script>
        $(document).ready(function () {
            var tip = $("#tip");
            //function getValidateCode() {
            //    var img = $("#ValidateCode");
            //    img.attr("src", img.data("src") + "?t=" + (+new Date()));
            //}
            //$("#ValidateCode").click(getValidateCode);
            $("form").on("submit", function (event) {
                event.preventDefault();
                var UserName = $("#admin_username").val().replace(/(^\s*)|(\s*$)/g, "");
                var UserPwd = $.trim($("#admin_password").val().replace(/(^\s*)|(\s*$)/g, ""));//去掉左右两边的空格
               var UserCode = $.trim($("#admin_code").val().replace(/(^\s*)|(\s*$)/g, ""));//验证码
                if ($.trim(UserName) === '') {
                    tip.text("账号不能为空");
                    return false;
                } else if (UserPwd === '') {
                    tip.text("密码不能为空");
                    return false;
                } else if (UserCode === '') {
                   tip.text("验证码不能为空");
                   return false;
                }
                $.ajax({
                    url: "/index.php/Portal/index/dologin2",
                    data: { user_login: UserName, user_pass: UserPwd, verify: UserCode },
                    type: "post",
                    success: function (json) {
                        if (json.status == false) {
                            tip.text(json.info);
                            $("#admin_code").val('');
                            //getValidateCode();
                        } 
                        else {
                            var data = json.info;
                            Utils.Cookie.set('IsSubAccount', data.IsSubAccount, '', '/');//是否是子账号
                            Utils.Cookie.set('ParentId', data.ParentId, '', '/');
                            Utils.Cookie.set('ParentName', data.ParentName, '', '/');
                            Utils.Cookie.set('AccountLoginName', data.LoginName, '', '/');
                            Utils.Cookie.set('AccountID', data.LoginID, 0, '/');
                            Utils.Cookie.set('CompanyType', data.CompanyType, 0, '/');
                            Utils.Cookie.set('IsEditComm', data.IsEditComm, 0, '/');//是否允许修改赚水:为true时才可以修改赚水 ;不包括总公司登录
                            Utils.Cookie.set('IsEditOdds ', data.IsEditOdds, 0, '/');//是否允许修改限额:为true 时才可以修改限额（最小下注，单注上限，单项上限）;不包括总公司登录
                            Utils.Cookie.set('PlayType', data.PlayType, 0, '/');// Serven = 0,Five = 1
                            Utils.Cookie.set('IsChildShowReport', data.IsChildShowReport, 0, '/');//   子账号是否查看下级报表
                            Utils.Cookie.set('IsDLUpdateRatio', data.IsDLUpdateRatio, 0, '/');
                            // 保留当前级别
                            Utils.Cookie.set('DevRationLable', data.LevelEntity.LevelName, '', '/');///当前的级别名称
                            Utils.Cookie.set('DevAgentLevel', data.LevelEntity.AgentLevel, '', '/');///当前的级别
                            if (data.CompanyType - 0 != 0)//总公司登录不会返回
                            {
                                if (data.NextLevelList != null) {
                                    Utils.Cookie.set('NextLevelListCount', data.NextLevelList.length, '', '/');//获取下级的个数，0表示没有下级了，是最后一级

                                }
                                Utils.Cookie.set('SubCreditLimit', data.SubCreditLimit, '', '/');//子公司和代理登录，
                            } else {
                                Utils.Cookie.remove('SubCreditLimit', '/')
                            }
                            if (data.CompanyType == 2) { //如果是代理登录
                                Utils.Cookie.set('AccountLoginName', data.LoginName, '', '/');
                                Utils.Cookie.set('isAgentLevel', data.LevelEntity.AgentLevel, '', '/');
                                Utils.Cookie.set('RationLable', data.LevelEntity.LevelName, '', '/');///当前的级别名称
                                Utils.Cookie.set('AgentLevel', data.LevelEntity.AgentLevel, '', '/');///当前的级别
                                //Utils.Cookie.set('AgentLable', data.NextLevelList[parseInt(data.LevelEntity.AgentLevel)].LevelName, '', '/');
                                // Utils.Cookie.set('NextLevelListCount', data.NextLevelList.length, '', '/');//获取下级的个数，0表示没有下级了，是最后一级

                                if (data.NextLevelList != "") {
                                    Utils.Cookie.set('AgentLable', data.NextLevelList[parseInt(0)].LevelName, '', '/');
                                    Utils.Cookie.set('NextLevelListCount', data.NextLevelList.Count, '', '/');//下级管理，代理级别中，用来判断会员等级类别，如果是0(最后一层等级)，隐藏代理，只显示会员
                                }
                                Utils.Cookie.set('GetDefaultCredit', parseFloat(data.DefaultCredit), 'undefined', '/');
                                Utils.Cookie.set('GetUsedCredit', parseFloat(data.UsedCredit), 'undefined', '/');
                            } 
                            if(data.CompanyType == 1){  //如果是子公司登录
                                Utils.Cookie.set('AccountLoginName', data.LoginName, '', '/');
                                Utils.Cookie.set('RationLable', data.NextLevelList[0].LevelName, '', '/');///当前的级别名称
                                Utils.Cookie.set('AgentLable', data.NextLevelList[1].LevelName, '', '/');///下级的级别名称
                                //Utils.Cookie.set('IsInheritComm', data.IsInheritComm, '', '/');//继承定盘状态
                                //Utils.Cookie.set('IsInheritTrading', data.IsInheritTrading, '', '/');// 是否继承操盘
                            }
                            location.href = json.url;
                        }
                    }
                });
                return false;
            });
            var
                version = /MSIE\s(\d)/.exec(navigator.userAgent);
            if (version != null && version[1] - 0 <= 8) {
                $('.broFt').show();
            }
        });
    </script>
</body>
</html>