/// 公司设置- 添加子公司
// <reference path="../_ref.js" />
define(function (require, exports, module) {
    var Add = function (params) {

        params = params || {};
        var that = this;
        this.params = params;
        this.rationlist = ko.observableArray();//占成
        this.CompanySettingRatio = ko.observable(this.params.Ratio);//占成上限

        ///公司的基本属性
        this.IsEdit = !!params.ID;
        this.ID = ko.observable(this.params.ID || 0);
        this.LoginName = ko.observable(this.params.LoginName || '');
        this.NickName = ko.observable(this.params.NickName || '');
        this.LoginPwd = ko.observable(this.params.LoginPwd || '');
        this.AdvancePwd = ko.observable(this.params.AdvancePwd || '');
        this.CompanyStatus = ko.observable(this.IsEdit ? this.params.CompanyStatus + '' : '1');
        //this.Ratio = ko.observable(this.params.Ratio || '');
        this.Welfare = ko.observable(this.params.Welfare - 0 === 0 ? 0 : this.params.Welfare - 0 || '');
        this.Salary = ko.observable(this.params.Salary - 0 === 0 ? 0 : this.params.Salary - 0 || '');
        this.Expend = ko.observable(this.params.Expend - 0 === 0 ? 0 : this.params.Expend - 0 || '');
        this.Describe = ko.observable(this.params.Describe || '');
        this.CreditType = ko.observable(this.params.CreditType === undefined ? '1' : '' + this.params.CreditType);//账户类型, 默认为现金账户

        //保存下一步和编辑的状态判断
        this.AddorEdit = ko.observable(this.params.AddorEdit);
        this.SaveAndNext = ko.observable("False");

        if (typeof this.CompanyStatus == undefined) {
            this.CompanyStatus = ko.observable("0");
        }
        if (!this.IsEdit) {
            that.AddorEdit("Add");
        }
        if (this.IsEdit) {
            //IE不支持 hidden='hidden'
            document.getElementById("LoginTip").style.display = "none"; //$("#LoginTip").attr("hidden", true);
            //document.getElementById("ShowLoginName").style.display = "none"; //$("#ShowLoginName").attr("hidden", false);
            document.getElementById("LoginName").style.display = "none"; //$("#LoginName").attr("hidden", true);
            $("#BTSAVE").val("保存");

            document.getElementById("trPass").style.display = "none"; //$("#trPass").attr("hidden", true);hidden='hidden'IE不支持
            document.getElementById("Next").style.display = "none";//$("#Next").attr("hidden", true);
        }
        //触发保存下一步
        this.Next = function ($form, d) {
            this.SaveAndNext("True");
            this.sub($form);

        }


        ///提交事件
        this.sub = function ($form) {
            var that = this;
            var data = that.Validate();
            if (typeof data === 'string') {
                return Utils.tip(data, false, 3000, true ? function () {

                } : null);
            }
            data.CompanyStatus = this.CompanyStatus();//账号状态
            data.Welfare = this.Welfare();//福利
            data.Ratio = that.CompanySettingRatio();//占成
            data.Salary = this.Salary();//工资
            data.Expend = this.Expend();//月费用
            data.Describe = this.Describe();//备注
            data.CreditType = this.CreditType();//账户类型

            if (that.IsEdit) {
                data.ID = that.params.ID;
            }
            $.ajax({
                url: that.IsEdit ? "/index.php/portal/agent/EditCompanySetting" : "/index.php/portal/agent/AddCompanySetting",//that.IsEdit ? "/CompanySetting/EditCompanySetting" :
                cache: false,
                type: "post",
                data: data,
                success: function (json) {
                    if (!json.status)
                    {
                        Utils.tip(json.info, json.status, 3000, json.status ? function () {

                        } : null);
                    }
                    else if (that.SaveAndNext() != "True") {
                        Utils.tip(json.info, json.status,3000, json.status ? function () {

                        } : null);
                        framework.view("/index.php/portal/agent/CompanySetting", "CompanySetting/Index");
                    } else if (that.SaveAndNext() == "True") {

                        if (json.status) {
                            if (that.SaveAndNext() == "True") {
                                var BasicData = { ID: json.ID, AddorEdit: that.AddorEdit(), CompanyName: data.LoginName }
                                framework.view("/index.php/portal/agent/Basic", "CompanySetting/Basic", BasicData);
                            }
                            else {
                                framework.view("/index.php/portal/agent/CompanySetting", "CompanySetting/Index");
                            }
                        }

                    }

                }
            })

        }
        this.GetData();

    }
    Add.prototype.GetData = function () {
        var that = this;
        var arr = [];
        var len = 100 / 5;
        for (var i = len; i >= 0; i--) {
            arr.push({
                Ratio: i * 5,
                RatioName: i * 5
            });
        }
        that.rationlist(arr); //自己的占成
        that.CompanySettingRatio(that.params.Ratio);

    }
    Add.prototype.Validate = function () {
        var that = this;
        var LoginName = that.LoginName().replace(/(^\s*)|(\s*$)/g, "");
        var NickName = $.trim(that.NickName());
        var LoginPwd = that.LoginPwd();
        var AdvancePwd = that.AdvancePwd();
        var Welfare = that.Welfare();//福利
        var Expend = that.Expend();//月费用
        var Salary = that.Salary();//工资
        var Ratio = that.CompanySettingRatio();//占成
        if (LoginName === "") {
            return "账号不能为空";
        } else if (!/^[a-z][\da-z]+/i.test(LoginName)) {
            return "账号只能是字母和数字，并由字母开头";
        } else if (!/^[a-z][\da-z]{2,11}/i.test(LoginName)) {//用户名长度统一在3-12位
            return "账号的长度必须在3-12位之间";
        }

		/*
        if (NickName === "") {
            return "昵称不能为空";
        } else if (!/^.{1,20}$/.test(NickName)) {
            return "昵称的长度必须在1-20个字符之间";
        }
		*/
        // if (Welfare.length == 0) {

        //     return "福利不能为空"
        // }
        if (Ratio.length == 0) {
            return "占成不能为空"
        }
        //if (Salary.length == 0) {
        //    return "工资不能为空"
        //}
        //if (Expend.length == 0) {
        //    return "月费用不能为空"
        //}
        //else if (Welfare - 0 > 1000) {
        //    return "占成或者福利不能超过1000";
        //}
        if (!that.IsEdit) {
            if (LoginPwd === "") {
                return "密码不能为空";
            } else if (!(/(\d+[a-z]+)|([a-z]+\d+)/i.test(LoginPwd) && /^.{8,15}$/.test(LoginPwd))) {
                return "密码必须由8-15位字母和数字组成";
            } else if (AdvancePwd === "") {
                return "高级密码不能为空";
            } else if (!(/(\d+[a-z]+)|([a-z]+\d+)/i.test(AdvancePwd) && /^.{8,15}$/.test(AdvancePwd))) {

                return "高级密码必须由8-15位字母和数字组成";
            } else if (AdvancePwd === LoginPwd) {
                return "高级密码不能与密码一致";
            }

        }
        return {
            LoginName: LoginName,
            NickName: NickName,
            LoginPwd: LoginPwd,
            AdvancePwd: AdvancePwd
        };
    }

    exports.viewmodel = Add;

});