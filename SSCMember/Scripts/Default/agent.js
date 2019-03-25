/// <reference path="../_references.js" />
$(document).ready(function () {
    var tip = $("#tip");
    //function getValidateCode() {
    //    var img = $("#ValidateCode");
    //    img.attr("src", img.data("src") + "?t=" + (+new Date()));
    //}
    //$("#ValidateCode").click(getValidateCode);
    $("form").on("submit", function () {
        Utils.Cookie.set("StopNumber", "", -1, "/");
        var UserName = $("#admin_username").val().replace(/(^\s*)|(\s*$)/g, "");
        var UserPwd = $("#admin_password").val().replace(/(^\s*)|(\s*$)/g, "");
       // var UserCode = $.trim($("#admin_code").val().replace(/(^\s*)|(\s*$)/g, ""));//验证码
        if ($.trim(UserName) === '') {
            tip.text("账号不能为空");
            return false;
        } else if (UserPwd === '') {
            tip.text("密码不能为空");
            return false;
        }
        //else if (UserCode === '') {
        //    tip.text("验证码不能为空");
        //    return false;
        //}
        $.ajax({
            url: "/index.php/Portal/index/dologin2",
            data: { user_login: UserName, user_pass: UserPwd },//, UserCode: UserCode
            type: "post",
            success: function (json) {
                if (json.status == false) {
                    tip.text(json.info);
                    $("#admin_code").val('');
                    //getValidateCode();
                } else {
                    data = json.info;
                    Utils.Cookie.set('UserId', data.UserId, 0, '/');//账号ID
                    Utils.Cookie.set('LoginName', data.LoginName, 0, '/');//账号名称
                    Utils.Cookie.set('NickName', data.NickName, 0, '/');//账号昵称
                    Utils.Cookie.set('DefaultCredit', data.DefaultCredit, 0, '/');//总信用额度
                    Utils.Cookie.set('UsedCredit', data.UsedCredit, 0, '/');//已用信用额度
                    Utils.Cookie.set('SuperCompanyName', data.SuperCompanyName, 0, '/');//公司名称

                    /*录码模式默认值*/
                    Utils.Cookie.set('IsEnter', data.IsEnter, 0, '/');//录码模式：自动 false；回车 true
                    Utils.Cookie.set('IsShowLottory', data.IsShowLottory, 0, '/');//false：小票打印；true：显示彩种
                    Utils.Cookie.set('IsOddsUse', data.IsOddsUse, 0, '/');// 0：实际赔率； 1：转换赔率
                    Utils.Cookie.set('IsSingleBack', data.IsSingleBack, 0, '/');//IsSingleBack true 为单个退码
                    Utils.Cookie.set('SecondStopEarly', data.SecondStopEarly, 0, '/');//二字定封盘前多少分钟内不能下注
                    Utils.Cookie.set('IsInheritTrading', data.IsInheritTrading, 0, '/');// 是否继承操盘
                    Utils.Cookie.set('IsInheritComm', data.IsInheritComm, 0, '/');// 是否继承定盘

                    Utils.Cookie.set('SubNickName', data.SubNickName, 0, '/');// 会员昵称
                    Utils.Cookie.set('PlayType', data.PlayType, 0, '/'); // Serven = 0(七星),  Five = 1(排列五),
                    Utils.Cookie.set('UserNo', data.UserNo, 0, '/'); //
                    //是否是第一次登陆
                    //if (data.isFirst) {
                    //    Utils.Cookie.set('isFirst', data.isFirst, 0, '/');

                    //}
                    //else {
                    //    Utils.Cookie.remove('isFirst');
                    //}
                    //Utils.Cookie.set('CancelBet', data.CancelBet, 0, '/'); //退码时间在该时间内

                    location.href = json.url;
                }
            }
        });
        return false;
    });
});