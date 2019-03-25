///开奖结果列表页
/// <reference path="../../Lib/ko.page.js" />
//<reference path="../_ref.js" />
define(function (require, exports, module) {
    var koPage = require('/Scripts/Lib/ko.page'),
    PageNum;
    var GrossList = function (params) {
        var that = this;
        this.params = params || {};
        this.list = ko.observableArray();
        this.printList = ko.observableArray();
        this.periodslist = ko.observableArray();
        this.PageCount = ko.observable(1);
        this.firstcheck = ko.observable(that.params.firstcheck == undefined ? true : false);
        this.UserName = ko.observable("");
        this.IsWin = ko.observable(false);//bool IsWin,   是否赢利
        this.IsShow = ko.observable(false);//bool IsShow  是否是现
        this.BeginNum = ko.observable("").extend({ limit: { range: [-10, 1000], fix: 2 } });//decimal  BeginNum 起始数字
        this.EndNum = ko.observable("").extend({ limit: { range: [-10, 1000], fix: 2 } });;//decimal EndNum    结束数字
        this.SearchPeriodsNumber = ko.observable();//string PeriodsNumber 期数号码
        this.FromRrport = ko.observable(false);///是否来自报表跳转
        this.BetTypeID = ko.observable(0);//int BetTypeID 下注类型 0为全部
        this.BetTypeIDs = ko.observable(0);//汇总打印用
         this.BetInfoID = 0;
        this.uid = 0;
        this.QueryStatus = ko.observable(0);//bool QueryStatus  金额或者赔率
        this.BetNumber = ko.observable("");//string BetNumber 下注号码
        this.BetNumber.subscribe(function (newValue) {
            that.BetNumber(newValue.replace(/[^0-9|X]/i, ''));
        });
        this.PageNum = ko.observable(1);//int PageNum=1 页码
        this.MemberId = ko.observable(that.params.MemberId || -1);//int MemberId=-1 会员ID  -1为全部
        this.anchor = this.params.anchor;//标记锚点，记录是从日报还是从月报跳转过来的
        if (this.params.memberId) {
            that.MemberId(this.params.memberId);
            that.UserName(this.params.loginName);
            that.firstcheck(false);
            that.SearchPeriodsNumber(this.params.periodsNumber);
            that.FromRrport(true);
        }
        //合计的变量( 已退码的除外)
        this.Count= ko.observable(0);///统计有多少个会员
        this.CountBetAmount = ko.observable(0);
        this.CountPercentageAmt = ko.observable(0);
        this.CountSelfBackComm = ko.observable(0);
        this.CountWinLoss = ko.observable(0);
        this.CountProfitAndLoss = ko.observable(0);

        this.isShowRatioDetailGather = ko.observable(false);//拦货明细汇总，默认隐藏；只有代理级别可以看到
        if (Utils.Cookie.get('CompanyType') - 0 == 2)//&&Utils.Cookie.get('PeriodsID')并且是封盘状态
        {
              this.isShowRatioDetailGather(true);
        }
        this.isFirstOpen = true;
        koPage.init(this, function (pageindex) {
            if (that.isFirstOpen) {
                that.GetPeriodsList(pageindex);
                that.isFirstOpen = false;
            } else {
                that.GetData(pageindex);
            }
        }, {
            pagesize: 30
        });
        ///打印
        this.Print = function () {
            var v = "1=" + this.BetTypeIDs() + "&2=1";
            window.open("/index.php/portal/agent/RatioDetailPrint?" + encodeURIComponent(v));

        };
        //回车查询：拦货明细回车查询数据
        this.ratioDetailEnter = function (data, event) {
            if (event.keyCode - 0 == 13) {
                this.Search();
            }
            return false;
        }

        //提交查询
        this.detail = function ($data) {
             if($data.BetNumber=='-1'){
             that.BetInfoID=$data.betinfoid;
             that.uid=$data.uid;
         }
         else{
             that.BetInfoID=0;
             that.uid=0;
         }
            that.IsWin = ko.observable(false);
            that.GetData(1);
        }
        //提交查询
        this.zdetail = function ($data) {
            if($data.BetNumber=='-1'){
             that.BetInfoID=$data.betinfoid;
             that.uid=$data.uid;
         }
         else{
             that.BetInfoID=0;
             that.uid=0;
         }
             that.IsWin = ko.observable(false);
             if($data.uid){
                that.IsWin(true);
             }
             that.GetData(1);
        }
        //提交查询
        this.Search = function () {
            var SearchFlage = true;
            var error = "";
            if (that.BeginNum() == "" || that.EndNum() == "") {
                if (that.BeginNum() == "" || that.BeginNum().length == 0) {
                    that.BeginNum(-1);
                }
                if (that.EndNum() == "" || that.EndNum().length == 0) {
                    that.EndNum(-1);
                }
            }
           // that.UserName($("#UserName").val().replace(/(^\s*)|(\s*$)/g, ""));
            that.SearchPeriodsNumber($("#periodsnumber").val());
            that.currentPage(0);
            that.currentPage(1);

        };
    };

    GrossList.prototype.GetPeriodsList = function (pageindex) {
        var that = this;
        that.PageNum;
        $.ajax({
            url: "/index.php/portal/agent/GetPeriodsByDay",
            cache: false,
            dataType: "json",
            data: {
                startDate: Utils.DateHelp.add('', -1, 'month', 'yyyy/MM/dd'),
                endDate: new Date().format('yyyy/MM/dd'),
                pageIndex: 1,
                isGross:true
            },
            success: function (data) {
                that.periodslist(data.list);
                that.periodslist().sort(function (a, b) { if ((a.PeriodsNumber - 0) < (b.PeriodsNumber - 0)) return 1; if ((a.PeriodsNumber - 0) > (b.PeriodsNumber - 0)) return -1; return 0 });
                if (that.firstcheck() && !that.FromRrport())
                    that.SearchPeriodsNumber($("#periodsnumber").val());
                that.GetData(pageindex);

            }
        });
    };
    GrossList.prototype.GetData = function (pageindex, reset) {
        var that = this;
        if (that.firstcheck()) {
            that.firstcheck(false);
        }

        $.ajax({
            url: "/index.php/portal/agent/GetBetInfoRatioDetail",
            data: {
                IsWin: that.IsWin(),
                UserName: that.UserName().replace(/(^\s*)|(\s*$)/g, ""),
                IsShow: that.IsShow(),
                BeginNum: that.BeginNum() === "" ? -1 : that.BeginNum(),
                EndNum: that.EndNum() == "" ? -1 : that.EndNum(),
                PeriodsNumber: that.SearchPeriodsNumber(),
                BetTypeID: that.BetTypeID(),
                QueryStatus: that.QueryStatus(),
                BetInfoID: that.BetInfoID,
                    uid: that.uid,
                BetNumber: that.BetNumber(),
                PageNum: pageindex,//that.PageNum(),
                MemberId: that.MemberId(),
                IsExpand: 1,
            },
            cache: false,
            success: function (data) {
                that.list(data.list);
                that.PageCount(data.PageCount);
                koPage.count(data.PageCount * 30);
                if (reset) {
                    that.currentPage(0);
                    that.currentPage(1);
                }
                //统计的都是 非退码的数量
                var Count = 0,
                    CountBetAmount = 0,//下注金额
                    CountPercentageAmt = 0,//占成金额
                    CountSelfBackComm = 0,//回水
                    CountWinLoss = 0,//中奖
                    CountProfitAndLoss = 0;//盈亏
                //var arrPrint = new Array();
                $.each(that.list(), function (index, value) {
                    if (value.BetStatus != 1) {
                        var BetAmount = value.BetAmount.toFixed(2) - 0;//下注金额
                        var Ratio = value.Ratio.toFixed(2) - 0;//占成
                        var PercentageAmt = value.PercentageAmt.toFixed(2) - 0;//占成金额
                        var Odds = value.Odds.toFixed(2) - 0;
                        var SelfBackComm = value.SelfBackComm.toFixed(2) - 0;//自己回水
                        var WinLoss = value.WinLoss.toFixed(2) - 0;//中奖
                        var ProfitAndLoss = value.ProfitAndLoss.toFixed(2) - 0;//盈亏
                        Count++;
                        CountBetAmount = CountBetAmount + BetAmount;///统计下注金额
                        CountPercentageAmt = CountPercentageAmt + PercentageAmt;//占成金额
                        CountSelfBackComm = CountSelfBackComm + SelfBackComm;///统计自己回水
                        CountWinLoss = CountWinLoss + WinLoss;
                        CountProfitAndLoss = CountProfitAndLoss + ProfitAndLoss;

                        //生成打印数据，不包括退码数据listPrint   /*状态--0:正常； 1：退码； 2：结算； 3：逻辑删除；*/
                        /*arrPrint.push({
                            PBetStatus: value.BetStatus,//
                            PBetIdentifier: value.BetIdentifier,//注单号
                            PBetDt: value.BetDt,
                            PBetNumber: value.BetNumber,
                            PBetTypeID: value.BetTypeID,
                            PBetAmount: value.BetAmount,
                            POdds: value.Odds,
                            PWinLoss: value.WinLoss,
                            PBackComm: value.BackComm,
                            PSelfBackComm: value.SelfBackComm,
                            PCommission: value.Commission,
                            PBetWayID: value.BetWayID,
                            PBetIP: value.BetIP
                        });*/
                    }

                });

                that.Count(Count.toFixed(4) - 0);
                that.CountBetAmount(CountBetAmount.toFixed(4) - 0);
                that.CountWinLoss(CountWinLoss.toFixed(4) - 0);
                that.CountSelfBackComm(CountSelfBackComm.toFixed(4) - 0);
                that.CountPercentageAmt(CountPercentageAmt.toFixed(4) - 0);
                that.CountProfitAndLoss(CountProfitAndLoss.toFixed(4) - 0);

                //that.printList(arrPrint);//存储需要打印的数据，不包含退码数据
            }
        })
        if (that.SearchPeriodsNumber() !== "undefined") {
            $("#periodsnumber").val(that.SearchPeriodsNumber());
        }
        if (that.BeginNum() == -1)
            that.BeginNum("");
        if (that.EndNum() == -1)
            that.EndNum("");
    };
    GrossList.prototype.back = function () {
        if (this.anchor === 'day') {
            framework.view('/index.php/portal/agent/Report', 'Report/Index', this.params);
            return;
        }
        framework.view('/index.php/portal/agent/MonthReport', 'Report/MonthReport', this.params);

    };
    exports.viewmodel = GrossList;
    exports.done = function () {
        var
            a = $('.guide_right a');
        if (Utils.Cookie.get('PeriodsID')) {
            a.eq(3).off('click').on('click', function () {
                return false;
            }).css({ color: '#FFFFFF' });
        }
    };
});