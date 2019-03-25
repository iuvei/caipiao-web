//检测用户请求是否移动端
var request = {
    IsMobile: function () {
        var osUserAgent = navigator.userAgent.toLowerCase();
        if (osUserAgent.indexOf("iphone") > -1 || osUserAgent.indexOf("ipad") > -1 || osUserAgent.indexOf("ipod") > -1 || osUserAgent.indexOf("micromessenger") > -1 || osUserAgent.indexOf("android") > -1 || osUserAgent.indexOf("adr") > -1 || osUserAgent.indexOf("mobile") > -1 || osUserAgent.indexOf("playbook")>-1) {
            return true;
        }
        else {
            return false;
        }
    }
}

 