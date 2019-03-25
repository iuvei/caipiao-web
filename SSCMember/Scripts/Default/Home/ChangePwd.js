/// 会员修改自己的密码
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var AccountList = function () {
        var that = this;
        this.list = ko.observableArray();
        /// 提交表单
        this.sub = function () {

            //旧密码
            var oldpassword = document.getElementById("oldpassword").value;
            var newpassword = document.getElementById("newpassword").value;
            var newpassword2 = document.getElementById("newpassword2").value;
            if (oldpassword === "") {
                alert("原密码不能为空");
                return false;
            } else if (newpassword === "") {
                alert("新密码不能为空");
                return false;
            } else if (newpassword == "a12345" || newpassword == "ab1234" || newpassword == "abc123" || newpassword == "a1b2c3" || newpassword == "aaa111" || newpassword == "123qwe"  ) {
                alert("密码过于简单,请重新输入!"); return false;//系统禁止使用如：a12345 、ab1234 、abc123 、a1b2c3 、aaa111 、123qwe 等过于简单的密码。
            }
            else if (!/(\d+[a-z]+)|([a-z]+\d+)/i.test(newpassword)) {
                alert("新密码必须包含字母和数字"); return false;
            } else if (!/^[\da-z]{8,15}$/i.test(newpassword)) {
                alert("新密码的长度必须在8-15位之间,并且包含字母和数字"); return false;
            } else if (newpassword2 === "") {
                alert("重复密码不能为空"); return false;
            } else if (newpassword !== newpassword2) {
                alert("两次密码不一致"); return false;
            }
            $.ajax({
                url: "/index.php/portal/home/ChangePassword",
                type: "post",
                data: { oldpassword: oldpassword, password: newpassword, password1: newpassword2 },
                success: function (json) {
                    if (json.status == true) {
                        alert("密码修改成功,请重新登录！");
                        window.location.href = "/index.php/portal/index/login";
                        if (d) {
                            Utils.dialogStatus(d, json.info, json.status);
                            json.status && setTimeout(function () {
                                d.close();
                            }, 2000);
                        }
                    } else {
                        alert(json.info);

                        return false;
                    }
                }
            });
        }


        this.init();
    }

    AccountList.prototype.init = function () {
        this.GetData();
    };

    AccountList.prototype.GetData = function () {
        var that = this;
        //$.ajax({
        //    url: "/SubAccount/GetSubAccountList",
        //    cache: false,
        //    dataType: "json",
        //    success: function (json) { 
        //        that.list(json);
        //    }
        //});
    }

    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };
    exports.done = function () {
        //旧密码
        var passwordTip = $('#pssword-Tip'); 
        $('#newpassword2').on('input', function () {
            if (this.value.length > 15) {
                setTimeout(function () {
                    passwordTip.html('(密码长度不能超过15位)');
                }, 0);
                return;
            }
            passwordTip.html('(确认密码与密码必须保持一致)');
        });


        //新密码
        var newpasswordTip = $('#newpssword-Tip');
        $('#newpassword').on('input', function () {
            if (this.value.length > 15) {
                setTimeout(function () {
                    newpasswordTip.html('(密码长度不能超过15位)');
                }, 0);
                return;
            }
            newpasswordTip.html('(新密码不能跟账号和原密码相同)');
        });
    };
});