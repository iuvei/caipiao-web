/// 账户管理列表
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var AccountList = function () {
        var that = this;
        this.list = ko.observableArray();
        if (Utils.Cookie.get('IsSubAccount') == "true" || Utils.Cookie.get('CompanyType') - 0 == 2)
        {
            document.getElementById('isShowCompany').style.display = "none";
        }
        //else {
        //    document.getElementById('isShowCompany').style.display = "inline";
        //}
       
        /// 提交表单
        this.sub = function () {
            
            var isAdvancedPassword=document.getElementById('isAdvancedPassword').checked;//true表示修改高级密码

            //旧密码
            var oldpassword = document.getElementById("oldpassword").value;
             
            var newpassword = document.getElementById("newpassword").value;
            var newpassword2 = document.getElementById("newpassword2").value;
            if (oldpassword === "") {
                alert("旧密码不能为空");
                return false;
            }else if (newpassword === "") {
                alert("密码不能为空");
                return false;
            } else if (!/(\d+[a-z]+)|([a-z]+\d+)/i.test(newpassword)) {
                alert("密码必须包含字母和数字"); return false;
            } else if (!/^[\da-z]{8,15}$/i.test(newpassword)) {
                alert("密码的长度必须在8-15位之间,并且包含字母和数字"); return false;
            } else if (newpassword2 === "") {
                alert("重复密码不能为空"); return false;
            } else if (newpassword !== newpassword2) {
                alert("两次密码不一致"); return false;
            }
            $.ajax({
                url: "/index.php/portal/agent/EditPassword", 
                type: "post",
                data: { oldpassword: oldpassword, password: newpassword, password1: newpassword2, isAdvancedPassword: isAdvancedPassword },
                success: function (json) { 
                    if (json.status == true) {
                        if (isAdvancedPassword == true) {
                            Utils.tip(json.info, true, 3000, true ? function () {

                            } : null);
                            document.getElementById('isAdvancedPassword').checked = false;
                            document.getElementById("oldpassword").value = '';
                            document.getElementById("newpassword").value = '';
                            document.getElementById("newpassword2").value = '';                            
                            return false;
                        }else if (isAdvancedPassword == false) {
                            alert("密码修改成功,请重新登录！");
                            window.location.href = "/index.php/portal/index/agent";
                        }     
                    } else { 
                        Utils.tip(json.info, false, 3000, true ? function () {

                        } : null); 
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
        $.ajax({
            url: "/index.php/portal/agent/GetSubAccountList",
            cache: false,
            dataType: "json",
            success: function (json) { 
                that.list(json);
            }
        });
    }
   
    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    }
});