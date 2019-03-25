///  
/// <reference path="../_references.js" />
define(function (require, exports, module) {

    var AccountList = function (params) {
        params = params || {}; /// 从列表中带来的参数       
        var that = this;
        this.history = ko.observableArray(params.history && params.history());
        this.list = ko.observableArray();
        this.isNewSubordinateClick = ko.observable(params.isNewSubordinateClick||false);//表示公司查看代理拦货日志
        this.AgentID = ko.observable(params.AgentID||0);
        this.isBack= ko.observable(params.isBack||false);
        this.BackID = ko.observable(params.BackID||0);//返回下级管理需要
        //条件查询
        this.subGetBasicDataLog = function () {

            this.GetData();
        }
        this.more = function (data, event) {
            var target = $(event.target);
            target.closest('tr').next('tr').toggle();
        };
        //返回
        this.back = function () {
           
            framework.view("/index.php/portal/agent/NewSubordinate", "NewSubordinate/index",
                {
                    AgentID: that.BackID(),
                    isBack: that.isBack(),
                    isLogBack: true,
                    history: that.history
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
            url: "/index.php/portal/agent/GetLimitStoreLog",
            cache: false,
            data: {
                isNewSubordinateClick: that.isNewSubordinateClick(),
                AgentID: that.AgentID()
            },
            dataType: "json",
            success: function (json) {
                var
                 numCount = 5,//5组数据 
                 temp = [];
                if ($.isArray(json) && json.length) {
                    $.each(json, function (index, value) {
                        //var ip = value.OperateIP;
                        //ip = ip.split('.');
                        //ip.splice(2, 1, '*');
                        //ip.splice(3, 1, '*')
                        //value.OperateIP = ip.join('.');
                        value['Describe'] = value['Describe'].split('<br>');
						
                        value['Describe'].pop();
                        value['DescribeCount'] = value['Describe'].length;
                        for (i = 0, len = Math.ceil(value['DescribeCount'] / numCount) ; i < len; i++) {
                            temp.push(value['Describe'].slice(i * numCount, numCount * (i + 1)));
                        }
                        if (!temp.length) {
                            value['Describe'] = [value['Describe'].slice(0, numCount)];
                        }
                        else {
                            value['Describe'] = temp;
                            temp = [];
                        }
                    });
                }
				
                that.list(json);
            }
        });
    };


    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };

});

