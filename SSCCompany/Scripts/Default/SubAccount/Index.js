/// 账户管理列表
/// <reference path="../_references.js" />
define(function (require, exports, module) {

    var AccountList = function () {
        // 如果不是总公司不显示“关联子公司”
        if (Utils.Cookie.get('CompanyType') != 0) {

            document.getElementById("SetThePermissionsShow").style.display = "none";
        }
        var that = this;
        this.list = ko.observableArray();
        // this.menuid = (this.isEdit ? params.CompanyID.split(',') : []);
        this.changePwdSubAccount = function ($data) {
            var d = dialog({
                lock: true,
                title: "修改密码",
                width: 360,
                content: $("#ACCOUNT-CHANGEPWD-SubAccount").html(),
                button: [{
                    value: '确定修改',
                    callback: function () {
                        var dom = $(this.node);
                        var pwd = dom.find("input[name=pwd]").val();
                        var repwd = dom.find("input[name=repwd]").val();
                        if (pwd === "") {
                            Utils.dialogStatus(d, "密码不能为空");
                            return false;
                        } else if (!/(\d+[a-z]+)|([a-z]+\d+)/i.test(pwd)) {
                            Utils.dialogStatus(d, "密码必须包含字母和数字"); return false;
                        } else if (!/^[\da-z]{8,15}$/i.test(pwd)) {
                            Utils.dialogStatus(d, "密码的长度必须在8-15位之间,并且包含字母和数字"); return false;
                        } else if (repwd === "") {
                            Utils.dialogStatus(d, "重复密码不能为空"); return false;
                        } else if (pwd !== repwd) {
                            Utils.dialogStatus(d, "两次密码不一致"); return false;
                        }
                        $.ajax({
                            url: "/index.php/portal/agent/EditSubAccountPassword",
                            data: { LoginName: $data.LoginName, password: pwd, password1: repwd },
                            type: "post",
                            success: function (json) {
                                if (json.status == true) {
                                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                                    } : null);
                                   // Utils.dialogStatus(d, json.info, json.status);
                                    json.status && setTimeout(function () {
                                        d.close();
                                    }, 2000);
                                } else {
                                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                                    } : null);

                                    return false;
                                }
                            }
                        });
                    }
                }],
                cancelValue: "取消",
                cancel: function () { }
            });
            d.show();
        };
        this.SetThePermissions = function ($data) {//设置权限：子帐号和子公司关联
            var d = dialog({
                title: "子帐号和子公司关联",
                width: 360,
                content: '<div id="CHILD-RELATION">' + $("#CHILD-RELATION-TPL").html() + '</div>',
                button: [{
                    value: '确定',
                    callback: function () {
                        var dom = $(this.node);
                        LotteryList = (function () {
                            var arr = [];
                            ko.utils.arrayForEach(d.viewmodel.childCompanyIds(), function (item) {
                                arr.push(d.viewmodel.mapping[item].LoginName);
                            });
                            return arr.join(",");
                        })();
                        $.ajax({
                            url: "/index.php/portal/agent/InsertSuperSubAccCompany",
                            data: { userName: $data.LoginName, LotteryList: LotteryList },
                            type: "post",
                            success: function (json) {
                                if (json.status == true) {
                                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                                    } : null);
                                    json.status && setTimeout(function () {
                                        d.close();
                                    }, 2000);
                                } else {
                                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                                    } : null);

                                    return false;
                                }
                            }
                        });
                    }
                }],
                cancelValue: "取消",
                onshow: function () {
                    //子viewmodel
                    var child = function () {
                        var self = this;
                        this.SetSubsidiarylist = ko.observableArray();
                        this.childCompanyIds = ko.observableArray();
                        this.allIds = [];
                        this.checkedAll = ko.observable(false);
                        this.checkedAll.subscribe(function () {
                            var status = self.checkedAll();
                            self.childCompanyIds(status ? self.allIds : []);
                        });
                        this.GetData();
                    }

                    /// 获取子公司列表
                    child.prototype.GetData = function () {
                        var self = this;
                        $.ajax({
                            url: "/index.php/portal/agent/GetCompanyBySuperID",
                            cache: false,
                            dataType: "json",
                            success: function (json) {
                                if (json != null) {
                                    var childCompany = self.mapping = {};
                                    $.each(json, function (a, b) {
                                        self.allIds.push(b.CompanyID);
                                        childCompany[b.CompanyID] = b;
                                        b.ID = ko.observable(b.CompanyID);
                                    });
                                    $.ajax({
                                        url: "/index.php/portal/agent/GetCompanyBySubAcc",//查询子帐号关联的子公司
                                        cache: false,
                                        dataType: "json",
                                        data: { subacountId: $data.CompanyID },
                                        success: function (_json) {
                                            $.each(_json, function (a, b) {
                                                childCompany[b.CompanyID] && self.childCompanyIds.push(b.CompanyID);
                                            });
                                            self.checkedAll(json.length === _json.length); /// 默认是否全选
                                            self.SetSubsidiarylist(json);
                                        }
                                    });
                                }
                            }
                        });
                    }
                    d.viewmodel = new child;
                    ko.applyBindings(d.viewmodel, document.getElementById("CHILD-RELATION"));
                },
                cancel: function () { },
                lock: true
            });
            d.show();
        };

        this.edit = function ($data) {
            console.log($data);
            framework.view("/index.php/portal/agent/SubAccountAdd", "SubAccount/add", $data);
        }

        this.del = function ($data) {
            if (confirm("确认删除该账号吗?")) {
                $.post("/index.php/portal/agent/DeleteChildCompany", { LoginName: $data.LoginName, _: new Date() - 0 }, function (json) {
                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                    } : null);
                    if (json.status) {
                        framework.view("/index.php/portal/agent/SubAccount", "SubAccount/index", $data);
                        // that.list.remove($data);
                    }
                });
            }
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
                $.each(json, function (index, value) {
                    var ip = value.LastLoginIP;
                    ip = ip.split('.');
                    // ip.splice(2, 1, '*');
                    // ip.splice(3, 1, '*');
                    value.LastLoginIP = ip.join('.');
                    value.IsChildShowReportTitle = value.IsChildShowReport == true ? "是" : "否";
                });
                that.list(json);
            }
        });

    }

    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    }
});