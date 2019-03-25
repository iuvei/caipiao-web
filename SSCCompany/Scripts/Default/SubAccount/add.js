/// <reference path="../_references.js" />
/// 添加/编辑 账号管理
define(function (require, exports, module) {
    var accountStatus = [
      { name: "启用", value: "0" },
      { name: "锁住", value: "1" },
      { name: "禁用", value: "2" }//,
      //{ name: "已删除", value: "3" }
    ];
    var Add = function (params) {
      

        params = params || {}; /// 从列表中带来的参数       
        var that = this;
        this.params = params;

        this.isEdit = !!params.CompanyID;
        this.account = ko.observable(params.LoginName || '');
        this.nickname = ko.observable(params.NickName || '');
        this.password = ko.observable('');
        this.repassword = ko.observable('');
        this.statusList = ko.observableArray(accountStatus);
        this.status = ko.observable(params.CompanyStatus || "0");
        
        this.list = ko.observableArray();
        this.Subsidiarylist = ko.observableArray();
        this.menuid = (this.isEdit ? params.MenuId==null?[]:params.MenuId.split(',') : []);
        this.remark = ko.observable(params.Describe || '');
        this.IsChildShowReport = ko.observable(params.IsChildShowReport || false);
        // 如果不是总公司不显示“关联子公司”
       

        if (Utils.Cookie.get('CompanyType') != 0 || that.isEdit==true) { 
            document.getElementById("TRAssociatedSubsidiary").style.display = "none";

        }
        ///返回
        this.goback = function () {
            framework.view("/index.php/portal/agent/SubAccount", "SubAccount/Index");
        }
        /// 提交表单
        this.sub = function ($form) {
            var data = that.Validate();
            if (typeof data === 'string') {
                return Utils.tip(data, false, 3000, true ? function () {

                } : null);
            }
            data.Describe = that.remark();//备注
            data.Status = that.status();//状态
            data.IsChildShowReport = that.IsChildShowReport();//是否查看下级报表
            data.menu = (function () {
                var arr = [];
                $("#SubMenu-Jurisdiction").find("input[subaccountvalue=Subvalue]:checked").each(function () {
                    arr.push($(this).val());
                });
                return arr.join(",");
            })();
          
            data.LotteryList = (function () {
                var arr = [];
                $("#AssociatedSubsidiary").find("input[name=SubsidiaryName]:checked").each(function () {
                    arr.push($(this).val());
                });
                return arr.join(",");
            })();

            if (that.isEdit) { //如果是编辑需要传当前ID 
                data.id = that.params.CompanyID; 
            }

            $.ajax({
                url: that.isEdit ? '/index.php/portal/agent/EditSubAccount' : '/index.php/portal/agent/AddSubAccount',
                type: "post",
                data: data,
                success: function (json) {
                    Utils.tip(json.info, json.status, 3000,json.status ? function () {
                      
                    } : null);
                    if (json.info) {
                        framework.view("/index.php/portal/agent/SubAccount", "SubAccount/Index");
                    }
                }
            });
        } 
        this.GetData();
    }
     
    /// 获取权限
    Add.prototype.GetData = function () {
        var that = this;
        var checkeds = that.isEdit ? that.params.MenuId==null?[]:that.params.MenuId.split(',') : [];
        $.ajax({
            url: "/index.php/portal/agent/GetJurisdictionList",
            cache: false,
            success: function (json) {
                var arr = [];
                $.each(json, function (a, b) {
                    !b.IsChildMenu && arr.push(b);
                });
                that.list(arr);



                if (!that.isEdit) {
                    $("#SubMenu-Jurisdiction").find("input[subaccountvalue=Subvalue]").each(function () {
                        $(this).attr("checked", "checked").removeAttr("disabled");
                    });
                }

                $("#JurisdictionHtml").find("[name=parent]").on("change", function () {
                    var status = this.checked;
                    $(this).parent().next().find(":checkbox").each(function () {
                        this.checked = status;
                        status ? $(this).removeAttr("disabled") : $(this).attr("disabled", "disabled");
                    });
                }).end().find('[name=child]').delegate(':checkbox', 'change', function () {
                    var p = $(this).parent(), c = p.children(':checkbox');
                    if (c.length === c.not(':checked').length) {
                        p.prev().children(':checkbox').removeAttr('checked');
                        c.attr('disabled', 'disabled');
                    }
                });

            }
        });
      //  function _check(id) {
            // if (checkeds.length === 0) return true;
            // return ko.utils.arrayIndexOf(checkeds, id + '') > -1 ? true : false;
        // }

        /******获取子公司列表***********************************************/
        $.ajax({
            url: "/index.php/portal/agent/GetCompanyBySuperID",
            cache: false,
            dataType: "json",
            success: function (json) {
                if (json != null) {
                    var arr = [];
                    $.each(json, function (a, b) {
                        arr.push({
                            ID: b.ID,
                            LoginName: b.LoginName
                        });

                    });
                    that.Subsidiarylist(arr);
                }
               

            }
        });
    }


    Add.prototype.Validate = function () {
        var that = this;
        var account = that.account();//账号名称
        var nickname = $.trim(that.nickname());//昵称
        var password = that.password();//密码
        var repassword = that.repassword();//重复密码
        if (account === "") {
            return "账号不能为空";
        } else if (!/^[a-z][\da-z]+/i.test(account)) {
            return "账号只能是字母和数字，并由字母开头";
        } else if (!/^[\da-z]{3,12}$/i.test(account)) {// (!/^[a-z][\da-z]{4,11}/i.test(account)) {//用户名长度统一在3-12位
            return "账号的长度必须在3-12位之间";
        }
		/*
        if (nickname === "") {
            return "昵称不能为空";
        } else if (!/^.{1,12}$/.test(nickname)) {
            return "昵称的长度必须在1-10个字符之间";
        } */
        if (!that.isEdit) {
            if (password === "") {
                return "密码不能为空"; 
            } else if (!/(\d+[a-z]+)|([a-z]+\d+)/i.test(password)) {
                return "密码必须包含字母和数字";
            } else if (!/^[\da-z]{8,15}$/i.test(password)) {
                return "密码的长度必须在8-15位之间,并且包含字母和数字";
            } else if (repassword === "") {
                return "重复密码不能为空";
            } else if (password !== repassword) {
                return "两次密码不一致";// alert("两次密码不一致"); return false;
            }
        }
        if (!that.isEdit) {
            return {
                LoginName: account,
                NickName: nickname,
                password: password,
                password1: repassword
            };
        } else {
            return {
                LoginName: account,
                NickName: nickname
            };
        }
    }

    exports.viewmodel = Add;

});
//this.ResetAccount = function () {
//    alert($("#nicknameRes").val());
//}
