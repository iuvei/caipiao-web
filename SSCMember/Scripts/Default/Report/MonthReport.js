///
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var koPage = require('ko.page'),
        pageNum;
    var Report_Index = function (params) {
        params = params || {}; /// 从列表中带来的参数
        var that = this;

        this.params = params;
        this.list = ko.observableArray();
        this.SumList = ko.observableArray();
        this.ReportStatus = ko.observable(0);
        this.LastMonth = ko.observable(params.LastMonth || false);
        if (that.LastMonth()) {
            $("#LastMonth").addClass("red");
            $("#Month").removeClass("red");
            //document.getElementById('LastMonth').style.color = "red";
            //document.getElementById('Month').style.color = "#fff";
        }

        this.GetLastMonth = function () {//获取上个月 or   本周
            this.LastMonth(true);
            $("#LastMonth").addClass("red");
            $("#Month").removeClass("red");
            //document.getElementById('LastMonth').style.color = "red";
            //document.getElementById('Month').style.color = "#fff";
            this.GetData();
        }
        this.GeMonth = function () { //本月 or 本周
            //document.getElementById('LastMonth').style.color = "#fff";
            //document.getElementById('Month').style.color = "red";
            this.LastMonth(false);
            $("#LastMonth").removeClass("red");
            $("#Month").addClass("red");
            this.GetData(); //framework.view('/Report/MonthIndex', 'Report/Index');
        }
        this.goBetHistory = function ($data) {//跳转历史
            var data = {
                isReport:true,
                LastMonth: this.LastMonth(),
            }
            framework.view('/index.php/Portal/BetHistory/Index', 'BetHistory/Index', data);
        }
        this.GetData();
    }

    Report_Index.prototype.GetData = function () {
        var that = this;

        $.ajax({
            url: "/index.php/Portal/Report/GetReportMember",
            data: {
                LastMonth: that.LastMonth(),
                ReportStatus: 2
            },
            cache: false,
            dataType: "json",
            success: function (json) {
                if (json.list.length > 0) {
                    Utils.Cookie.set('ReportStatus', json.ReportStatus, 0, '/');
                    Utils.Cookie.set('RBeginDt', json.RBeginDt, 0, '/');
                    Utils.Cookie.set('REndDt', json.REndDt, 0, '/');
                    var json = json.list;
                    var MemberBetCountSum = 0,
                        MemBetAmtSum = 0,
                        MemWLSum = 0;
                    $.each(json, function (index, value) {
                        MemberBetCountSum += value.MemberBetCount;
                        MemBetAmtSum += value.MemBetAmt;
                        MemWLSum += value.MemWL
                        var data = {
                            MemberBetCountSum: MemberBetCountSum,
                            MemBetAmtSum: MemBetAmtSum,
                            MemWLSum: Utils.rounding(MemWLSum)
                        }
                        value.SumList = data;
                    });
                    that.SumList(json[json.length - 1].SumList);
                    that.list(json);
                }

            }
        });
    };


    exports.viewmodel = Report_Index;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };

});
