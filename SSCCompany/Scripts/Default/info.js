///  基本资料
/// <reference path="../_references.js" />
define(function (require, exports, module) {

    /// 提交表单
    this.sub = function () {
        var dom = $(this.node);
        var CompanyId = document.getElementById("CompanyId").value; 
        var NickName = "",
            LoginName = "";
        if (document.getElementById("CompanyType").value == 0)//总公司
        {
            NickName = document.getElementById("SuperCompanyNickName").value;
            LoginName = document.getElementById("SuperCompanyLoginName").innerText;
        }
        else if (document.getElementById("CompanyType").value == 1)//子公司
        {
            NickName = document.getElementById("CompanyNickName").value;
            LoginName = document.getElementById("CompanyLoginName").innerText;
        }
        else if (document.getElementById("CompanyType").value == 2)//代理
        {
            NickName = document.getElementById("AgentNickName").value;
            LoginName = document.getElementById("AgentLoginName").innerText;
        }
        $.ajax({
            url: "/index.php/portal/agent/EditBasicInformation",
            data:{
                CompanyId: CompanyId,
                NickName: NickName,
                LoginName: LoginName
            },
            type: "post",
            success: function (json) {
                Utils.tip(json.info, json.status, json.status ? function () {
                    framework.view("/index.php/portal/agent/info", "BasicInformation/index");
                } : null);
            }
        });
    }
    var AccountList = function () {
        var that = this;
        this.list = ko.observableArray();
        //document.getElementById("BasicDefaultCredit").innerHTML = Utils.Cookie.get('GetDefaultCredit') - 0; //总的信用额度        
        //document.getElementById("BasicUsedCredit").innerHTML = Utils.Cookie.get('GetUsedCredit') - 0; //已分配信用额度
        //document.getElementById("BasicRemainingCredit").innerHTML = Utils.Cookie.get('GetDefaultCredit') - Utils.Cookie.get('GetUsedCredit') - 0; //可分配信用额度

        //基本资料：下级归零
        this.SubordinateMakeZero = function ($data) {

            /*viewName为当前用户名  userName为被操者用户名*/
            if (confirm("确认是否清算？"))
            {
                $.post("/index.php/portal/agent/RecoverCredit", { viewName: $data.LoginName, userName: $data.LoginName, IsBool: false, _: new Date() - 0 }, function (json) {
                    Utils.tip(json.info, json.status, 2000);
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
            url: "/index.php/portal/agent/GetBasicInformationList",
            cache: false,
            dataType: "json",
            success: function (json) {

                that.list(json);
                /* SuperCompany = 0, Company = 1, Agent = 2, */
                if (json[0].CompanyType == 0) { //总公司帐户,基本资料则显示账号（不可修改,输入框背景色为淡灰色）、昵称（可修改）、公司数量（不可修改）、账户状态（启用、禁用、锁定）
                    $('#Company').hide();
                    $('#Agent').hide();
                } else if (json[0].CompanyType == 1) {//如果子公司账户进入，基本资料则显示账号、昵称（可修改）、福利、占成、工资、月费用、用户状态
                    $('#LineOfCredit').hide();
                    $('#SuperCompany').hide();
                    $('#Agent').hide();
                } else if (json[0].CompanyType == 2) {//如果代理账户进入，基本资料则显示账号、昵称（可修改）、信用额度、占成、状态
                    $('#Company').hide();
                    $('#SuperCompany').hide();
                    $('#LineOfCredit').show();
                }
            }
        });
    }

    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    }
});