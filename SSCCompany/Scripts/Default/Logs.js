///  
/// <reference path="../_references.js" />
define(function (require, exports, module) {
   
    var AccountList = function (params) {
        params = params || {}; /// 从列表中带来的参数       
        var that = this;
        this.list = ko.observableArray();
        this.isNewSubordinateClick = ko.observable(params.isNewSubordinateClick || false);
        this.CompanyID = ko.observable(params.CompanyID);
        //document.getElementById("usernameto").value = params.LogName;
       
        this.BackID = ko.observable(params.BackID);//返回下级管理需要
        this.history = ko.observableArray(params.history && params.history());
       
        this.UserName = ko.observable(params.LogName);//params.LogName || 
        this.isMemberUrl = ko.observable(params.isMemberUrl || false);

        //返回
        this.back = function () {
            if (this.isMemberUrl())
            {
                framework.view("/index.php/portal/agent/Member", "Member/index", {
                    AgentID: that.BackID(),
                    history: that.history
                });
            }
            else {
                framework.view("/index.php/portal/agent/NewSubordinate", "NewSubordinate/index", {
                    AgentID: that.BackID(),
                    history: that.history
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
            url: "/index.php/portal/agent/GetBasicDataLog",
            data: {
                name: this.UserName(), //document.getElementById("usernameto").value || '',
                isNewSubordinateClick: this.isNewSubordinateClick(),
                isMember:this.isMemberUrl(),
                CompanyID: this.CompanyID()
            },
            cache: false,
            dataType: "json",
            success: function (json) {
                $.each(json, function (index, value) { 
                    var ip = value.OperateIP;
                    ip = ip.split('.');
                    ip.splice(2, 1, '*');  
                    ip.splice(3, 1, '*')
                    value.OperateIP = ip.join('.');  
                });

                that.list(json);
            }
        });
    };


    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };

});

