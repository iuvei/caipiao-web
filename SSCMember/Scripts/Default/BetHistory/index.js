///  
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var AccountList = function (params) {
        params = params || {}; /// 从列表中带来的参数       
        var that = this;
        this.history = ko.observableArray();
        this.params = params;
        
        this.list = ko.observableArray();
        this.isReport = ko.observable(params.isReport||false)
        this.LastMonth = ko.observable(params.LastMonth || false);//LastMonth:true 表示上周或上月
        this.ReportStatus = ko.observable(Utils.Cookie.get('ReportStatus')||-1);//-1表示历史账单；0表示日报表；1表示周报表；2表示月报表
        var myDate = new Date(); // myDate.getMonth();//获取当前月份(0-11,0代表1月)
       
        //this.BeginDt = ko.observable(new Date().format('yyyy/MM/dd'));
        //this.EndDt = ko.observable(new Date().format('yyyy/MM/dd'));
        this.isSeach = ko.observable(false);
        this.SeachClick = function () {
            this.isSeach(true);
            this.GetData();
        }
        //document.getElementById("HistoryTitle").innerHTML = myDate.getFullYear() + "年" +parseInt(myDate.getMonth()+1)+ "月历史账单";
        
        //历史订单跳转下注明细
        this.HistoryToBetList = function ($data) {
            framework.view("/index.php/Portal/BetList/Index", "BetList/index", { PeriodsNumber: $data.PeriodsNumber, IsHistoryList:true});
        }
        this.goReport = function () {//返回报表
            var ReportStatus = that.ReportStatus()-0;
            if (ReportStatus == 0)
            {
                framework.view('/index.php/Portal/Report/DayReport', 'Report/DayReport');
            }
            else if (ReportStatus == 1)
            {
                framework.view('/index.php/Portal/Report/WeekReport', 'Report/WeekReport', { LastMonth: this.LastMonth() });
            }
            else if (ReportStatus == 2)
            {
                
                framework.view('/index.php/Portal/Report/MonthReport', 'Report/MonthReport', { LastMonth: this.LastMonth() });
            }
        }
        this.init();
    }

    AccountList.prototype.init = function () {
        window.account_that = this;
         setTimeout(function() {
            account_that.GetData();
         }, 300);
    };

    AccountList.prototype.GetData = function () {  
        var that = this;
        /*用户查询历史账单*/
        $.ajax({
            url: "/index.php/Portal/BetHistory/GetHistoryBetInfo",
            data: {
                lotteryId: 1,
                LastMonth:that.LastMonth(),
                isReport:that.isReport(),
                BeginDt: document.getElementById("staDt").value,
                EndDt: document.getElementById("endDt").value,
                isSeach: that.isSeach()
            }, 
            cache: false,
            dataType: "json",
            success: function (json) { 
              //  that.list(json);
                var HistoryLineNumber = 0;//历史账单行数
                var HistoryBetCount = 0;//笔数
                var HistoryBetAmountSum = 0;//金额
                var HistorySumCommission = 0;//回水
                var HistorySumWinLoss = 0;//中奖
                var HistorySumProfitAndLoss = 0;//盈亏
                $.each(json, function (index, value) {
                    HistoryLineNumber = json.length;
                    HistoryBetCount += value.BetCount;
                    HistoryBetAmountSum += value.BetAmountSum;
                    HistorySumCommission += value.SumBackComm;
                    HistorySumWinLoss += value.SumWinLoss;
                    
                   // value.SumProfitAndLoss =(value.BetAmountSum - value.SumBackComm - value.SumWinLoss).toFixed(4)-0;//盈亏= 下注金额-回水-中奖
                    HistorySumProfitAndLoss += value.SumProfitAndLoss;
                });
                that.list(json);
                document.getElementById("HistoryLineNumber").innerHTML = HistoryLineNumber.toFixed(4) - 0;
                document.getElementById("HistoryBetCount").innerHTML = HistoryBetCount.toFixed(4) - 0;
                document.getElementById("HistoryBetAmountSum").innerHTML = Utils.rounding(HistoryBetAmountSum);
                document.getElementById("HistorySumCommission").innerHTML =Utils.rounding(HistorySumCommission);
                document.getElementById("HistorySumWinLoss").innerHTML = Utils.rounding(HistorySumWinLoss);
                document.getElementById("HistorySumProfitAndLoss").innerHTML = Utils.rounding(HistorySumProfitAndLoss);//HistorySumProfitAndLoss.toFixed(4) - 0;//.toFixed(4) - 0;
            }
        });
    };
     
    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };

});
