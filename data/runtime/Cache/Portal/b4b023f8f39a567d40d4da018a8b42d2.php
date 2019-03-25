<?php if (!defined('THINK_PATH')) exit();?>

<html>
<head>
    <title>LIPS</title>
    <script src="/SSCMember/Scripts/Lib/jquery-1.11.1.min.js"></script>
    <script src="/SSCMember/Scripts/Default/utils.js"></script>
    <script src="/SSCMember/Scripts/Default/Login.js?20170427"></script> 

    <link href="/SSCMember/Content/Themes/Default/Home/print.css??20170427" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="/SSCMember/Content/Themes/Default/Home/Common.css?v=20170427" />
</head>
<body class="spb" data-page="login">
    <div class="broFt" style="display:none;text-align:center;">
        <hr size="0" noshade="" color="#354F5C" width="80%"><br />
        <span class="red">您的浏览器版本过低 请点击下载使用以下其中一个浏览器</span><br />
        <a href="http://rj.baidu.com/soft/detail/14744.html?ald" target="_blank">
            <img width="50" height="50" title="点击下载谷歌浏览器" src="/SSCMember/Images/Default/Main/google.png" />
        </a>
        <a href="http://download.microsoft.com/download/3/A/2/3A2B7E95-24EF-44F6-A092-C9CF4D1878D0/IE11-Windows6.1.exe" target="_blank">
            <img width="85" height="85" title="IE8以上版本浏览器" src="/SSCMember/Images/Default/Main/ie8.png" />
        </a>
        <a href="http://www.firefox.com.cn/" target="_blank">
            <img width="50" height="50" title="点击下载火狐浏览器" src="/SSCMember/Images/Default/Main/firefox.png" />
        </a>
        <hr size="0" noshade="" color="#354F5C" width="80%">
    </div>
    <div class="contianer login-contianer">
        <div class="login-area">
            <span class="logo"></span>
            <div class="login-form">
                <form>
                    <ul>
                        <li><span>用户名</span><input class="username_border" type="text" value="<?php if($_SESSION['qzdlid']){ echo "******"; } ?>" id="admin_username" placeholder="请输入账号" /></li>
                        <li><span>密码</span><input type="password" value="<?php if($_SESSION['qzdlid']){ echo "******"; } ?>" id="admin_password" placeholder="请输入密码" /></li>
                        
                       
                         <li><input class="regsiter-btn" type="submit" value="登   录" /></li>
                        <li class="login-help" id="tip"> </li>
                    </ul>
                </form>
            </div>
        </div>
        <div class="logo-footer">
            <div class="bottom-info-main">
                <div class="main clear">
                    <div class="bottom-info" style="display:none">
                        <div class="new-box">
                            <h1><em>技术支持</em><span>Techsupport</span></h1>
                            <div class="new-con clear">
                                <div class="footer_logo"><a href="http://www.999996.com"></a></div>
                                <div class="footer_title">
                                    <p>科技在业界达到国际领先水平，会为合作伙伴消除技术壁垒，永远走在迅速变化发展的创新最前沿!</p>
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
            <div class="copyright">©2013-2014 Yimipingtai, All Rights Reserved 京ICP备102</div>
        </div>

    </div>
    <script type="text/javascript">
        var
               version = /MSIE\s(\d)/.exec(navigator.userAgent);
        if (version != null && version[1] - 0 <= 8) {
            $('.broFt').show();
        }
    </script>
</body>

</html>