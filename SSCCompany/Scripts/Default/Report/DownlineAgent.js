/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var AccountList = function (params) {
        params = params || {}; /// 从列表中带来的参数       
        var that = this;
        this.params = params;
        this.list = ko.observableArray();
        this.ID = ko.observable(params.companyID());
        this.agentLevel = ko.observable(params.parentStatus && (params.parentStatus() !== false ? params.parentStatus() : params.levelStatus()));//当前的等级
        this.companyType = ko.observable(params.companyType && params.companyType());
        this.isMember = ko.observable(params.isMember && params.isMember());
        this.isCheckMember = ko.observable(!!(this.isMember()));
        this.IsEndLevel = ko.observable(params.IsEndLevel());
        // 跳转月报表
        this.AgentNlineMonthReport = function ($data) {
            $data.agentLevel = $data.LevelStatus;
            $data.isMember = that.isMember();
            //if ($data.isMember) {
            //    $data = that.backParam;
            //}
            if (that.IsEndLevel() == true) {
                $data.lastAgent = true;
            }
            if (Utils.Cookie.get('CompanyType') - 0 == 0)//总公司
            {
                $data.SubCompanyID=$data.SubSidaryID;
            }
            $data.isNewSubordinate = true;//表示是下级管理查询月报表
            framework.view("/index.php/portal/agent/MonthReport", "Report/MonthReport", $data);
        };
        this.backParam = {
            agentLevel: that.agentLevel(),
            CompanyType: params.companyType(),
            AgentID: params.companyID(),
            history: params.history
        };
        this.init();
    };
    AccountList.prototype.init = function () {
        this.GetData(this.ID());
    };

    AccountList.prototype.GetData = function (id) {
        var that = this;
        var postUrl = "",
            companyType = that.params.companyType() - 0;
        $.ajax({
            url: '/index.php/portal/agent/GetDownLineIDByParent',
            cache: false,
            data: {
                companyId: id,
                compnayType: that.companyType(),
                levleStatus: that.agentLevel(),
                isMember: that.isMember(),
                IsCheckMember: that.isCheckMember(),
                AgentLevel:Utils.Cookie.get('AgentLevel')
            },
            dataType: "json",
            success: function (json) {
                if (json && json.length) {
                    //如果没有这个字段，表示是子公司
                    if (json[0]['AgentLevel'] == undefined) {
                        that.companyType(1);
                    }
                    else {
                        that.companyType(2);
                    }
                    that.agentLevel(json[0]['AgentLevel'] != undefined ? json[0]['AgentLevel'] : -1);
                    that.backParam.SubSidaryID = json[0]['SubSidaryID'];
                }
                that.list(json);
            }
        });
    };
    AccountList.prototype.back = function () {
        this.params.history.pop(); //去掉最后一条
        framework.view("/index.php/portal/agent/MonthReport", "Report/MonthReport", this.backParam);
    };
    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    }
});