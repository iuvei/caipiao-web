/// 公司设置-域名管理
// <reference path="../_ref.js" />
/// <reference path="../utils.js" />
define(function (require, exports, module) {
    var Website = function (params) {
        params = params || {};
        var that = this;
        this.params = params;
        this.CompanyID = ko.observable(params.ID);
        this.CompanyName = ko.observable(params.CompanyName);
        this.list = ko.observableArray();
        this.selectList = ko.observableArray([{ text: '启用', value: 'true' }, { text: '禁用', value: 'false' }]);
        this.sub = function ($form) {
            var that = this;
            var list = that.list();
            var arr = [];
            for (var i = 0, len = list.length; i < len; i++) {
                var data = list[i];
                if (data.IsUsed() == 'true') {
                    arr.push(data.ID);
                }
            }
            $.post("/index.php/portal/agent/EditWebsite",
                { JsonWeblist: JSON.stringify(arr), CompanyName: that.CompanyName() },
                function (json) {
                    if (json.status) {
                        Utils.tip(json.info, true,true ? function () {
                            framework.view("/index.php/portal/agent/CompanySetting", "CompanySetting/index");
                        } : null);
                    } else {
                        Utils.tip(json.info, json.status,true ? function () {

                        } : null);
                    }
                });

        }
        this.menuMapping = {
            //1: "总公司皮肤",      //3: "代理皮肤",
            1: "公司皮肤",
            2: "会员皮肤"
        };
        this.GetData();
        this.companyStrMouse = function (data, event) {
            var target = $(event.target);
            if (event.type == "mouseover") {
                target.find("div").show();
            }
            else if(event.type == "mouseout"){
                target.find("div").hide();
            }
        }
    }
    Website.prototype.GetData = function () {
        
        var that = this;
        $.ajax({
            url: '//index.php/portal/agent/GetWebsiteList',
            data: { CompanyID: that.CompanyID() },
            cache: false,
            success: function (json) {
                $.each(json, function (a, b) {
                    b._init = $.extend({}, b)
                })
                if ($.isArray(json)) {
                    $.each(json, function (index, value) {
                        value['MenuType'] = that.menuMapping[value.MenuType];
                    })
                }
               // var CompanyStrArr = [];
                $.each(json, function (index, item) {
                    item.IsUsed = ko.observable(item.IsUsed ? 'true' : 'false');
                    var len = item.CompanyStr.length - 0;
                    item.CompanyStr = item.CompanyStr.substring(0, len - 1); 

                    item.CompanyStrArr = item.CompanyStr.split(',');
                    if (item.CompanyStrArr.length > 3) {
                        item.CompanyStr = item.CompanyStrArr[0] + ',' + item.CompanyStrArr[1] + ',' + item.CompanyStrArr[2];
                    } 
                });

                that.list(json);
            }

        })

    }
    exports.viewmodel = Website;
});