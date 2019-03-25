///  
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var koPage = require('ko.page'),
        pageNum;
    var AccountList = function (params) {
        params = params || {}; /// 从列表中带来的参数       
        var that = this;

        this.PeriodsNumber = ko.observable(params.PeriodsNumber);
        this.IsHistoryList = ko.observable(params.IsHistoryList);//为true表示是历史账单跳转
        this.list = ko.observableArray();
        this.listPrint = ko.observableArray();//打印数据：不包括退码数据
        this.BetNumber = ko.observable('');
        this.IsShow = ko.observable(false);
        this.QueryStatus = ko.observable(0);
        this.BeginNum = ko.observable();
        this.EndNum = ko.observable();
        this.BetTypeID = ko.observable(0);
        var status = Utils.Cookie.get('PeriodsStatus');//期数状态
        this.IsSingleBack = ko.observable(Utils.Cookie.get('IsSingleBack') == "true" ? false : true);//IsSingleBack true 为单个退码，隐藏全选按钮(为了隐藏全选按钮，取反值的；如果是返回true单个退码，设IsSingleBack为false)
        this.IsOpening = ko.observable(false);//是否开盘，如果是未开盘，不允许退码
        if (status != 1 || params.IsHistoryList) {//PeriodsStatus表示：未开盘UnOpen=0,开盘Open=1,封盘Close=2,开奖Lottery=3,结算中Settlementing=4,已结算Settlement=5,重新结算  (返还金额)ReSettlement=6,已删除Delete=7
            that.IsOpening(false);
        }
        if (params.PeriodsNumber != undefined) {
            if (params.PeriodsNumber != Utils.Cookie.get('PeriodsNumber')) {
                that.IsOpening(true);
            }
        }
        ///打印
        this.Print = function () {
            //var
            //   leftTable = $('.user').parent('td');
            //leftTable.addClass('no-print');
            //window.print();
            //leftTable.removeClass('no-print');
            var match = /<!--print startBetList-->( .+? )<!--print endBetList-->/;
            var startnum = window.document.body.innerHTML.indexOf("<!--print startBetList-->");
            var endnum = window.document.body.innerHTML.indexOf("<!--print endBetList-->");
            var xx = window.document.body.innerHTML.substring(startnum, endnum);
            window.document.body.innerHTML = xx;
            window.print();
            window.location.reload();
        }


        /*返回历史账单*/
        this.BackBetHistory = function ($data) {
            framework.view("/index.php/Portal/BetHistory/Index", "BetHistory/index");
        }

        /****************中奖明细*************/
        this.isWin = ko.observable(false);
        this.ClickIsWin = function () {
            var that = this;
            that.isWin(true);
            that.GetData();
        }

        this.history = ko.observableArray();
        this.params = params;


        /*退码时间*/
        this.BetStatusShow = function (t) {
            switch (t - 0) {
                case 1:
                    return true;
                default:
                    return false;
            }
        }
        this.BetTypeShow = function (t) {
            switch (t) {
                case 14: //case 15: case 16:/* TwoDisplay = 14,  ThreeDiplay = 15,  FourDisplay = 16*/
                    return true;
                case 15:
                    return true;
                case 16:
                    return true;
                default:  /*OOXX = 2,OXOX = 3,OXXO = 4,XOXO = 5,XOOX = 6,XXOO = 7,OOOX = 9,OOXO = 10, OXOO = 11,XOOO = 12,FourFix = 13,*/
                    return false;
            }
        }


        /*状态--0:正常； 1：退码； 2：结算； 3：逻辑删除；*/
        this.BetStatusType = function (t) {/*彩种*/
            switch (t - 0) {
                case 0:
                    return "成功";
                case 1:
                    return "已退码";
                case 2:
                    return "结算";
                case 3:
                    return "删除";
                default:
                    return "--";
            }
        }
        /*下注明细*退码********/
        this.BackYards = function () {
            var that = this;
            var arr = [],
                money = 0;

            $.each(that.list(), function (index, value) {
               // var single = [];
                if (value.checked && value.checked()) {
                    //single = value.BetDetailID;//注单号
                    money += value.BetAmount - 0;//单笔金额
                    var data = {
                        BetInfoID: value.BetInfoID,
                        BetNumber: value.BetNumber
                    }
                    arr.push(data);
                }

            });
            if (arr.length == 0) {
                alert("请勾选需要退码的注单");
                return false;
            } else if (that.IsSingleBack() == false && arr.length >= 2) {////IsSingleBack true 为单个退码，隐藏全选按钮
                Utils.tip("只能单个退码!", false, true ? function () {

                } : null);
            } else {
                var that = this;
                $.ajax({
                    url: "/index.php/Portal/FastBeat/BackBetOperator",
                    type: "post",
                    data: {
                        LsBetIds: JSON.stringify(arr)//,
                        // UserName: Utils.Cookie.get('LoginName'),//用户名称
                        //SuperCompany: Utils.Cookie.get('SuperCompanyName')//公司名称
                    },
                    cache: false,
                    dataType: "json",
                    success: function (json) {

                        if (json.status) {
                            framework._extend.refreshInfo();
                            Utils.tip(json.info, json.status, json.status ? function () {

                            } : null);
                            that.GetData();
                            //退码成功之后，左侧的注单栏只显示下注成功的，会员信息的金额应退回
                            framework._extend.ReturnCredit(money);/*刷新左边已用和可用金额*/
                            framework._extend.getBetInfoForLeftInfo(); /*刷新左边信息*/
                            that.checkeAll(false);
                        } else {
                            Utils.tip(json.info, json.status, json.status ? function () {
                                that.back();
                            } : null);
                        }
                    }
                });
            }


        }
        /****条件查询**************/
        this.ClickSubmit = function () {
            that.isWin(false);
            that.GetData(1);
            that.currentPage && that.currentPage(1); //初始化kopage的currentPage。
        }

        this.checkeAll = ko.observable();
        this.checkeAll.subscribe(function (newValue) {
            if (newValue) {
                that.cancelCheckAll(!newValue);
            } if (!that.cancelCheckAll()) {
                $.each(that.list(), function (index, value) {

                    value.checked && value.checked(newValue);

                });
            }
        });
        this.cancelCheckAll = ko.observable(false);//这个字段标志是否点击其他checkbox，如果是，需要取消checkeAll
        this.LotteryType = function (t) {/*彩种*/
            switch (t - 0) {
                //case 1:
                //    return "七星彩";
                default:
                    return "重庆时时彩";
            }
        };
        koPage.init(this, this.GetData, {
            pagesize: 30
        });
    }

    AccountList.prototype.GetData = function (pageIndex) {
        var that = this;
        var Lottery = "1";//1表示是七星
        pageNum = pageIndex   //页数，加载时，0和1默认是第一页
        var IsHistoryList = that.IsHistoryList();
        var PeriodsNumber = "";
        if (IsHistoryList == true) {
            PeriodsNumber = that.PeriodsNumber();
            document.getElementById("BetListTitle").innerHTML = "第" + that.PeriodsNumber() + "期下注明细";
            //document.getElementById("PrintBetListTitle").innerHTML = "第" + that.PeriodsNumber() + "期下注明细";

        } else {
            //PeriodsNumber = Utils.Cookie.get('PeriodsNumber');
            document.getElementById("BetListTitle").innerHTML = "本期下注明细";
            //document.getElementById("PrintBetListTitle").innerHTML = "本期下注明细";
        }
        $.ajax({
            url: "/index.php/Portal/BetList/GetBetInfoByMemID",
            data: {
                QueryStatus: that.QueryStatus() || 0,
                BeginNum: that.BeginNum() || -1,
                EndNum: that.EndNum() || -1,
                BetNumber: that.BetNumber().replace(/(^\s*)|(\s*$)/g, ""),
                BetTypeID: that.BetTypeID(),
                IsShow: that.IsShow(),
                IsWin: that.isWin(),
                Lottery: Lottery,
                PageNum: pageNum,
                PeriodsNumber: PeriodsNumber,
                IsHistoryList: IsHistoryList
            },
            cache: false,
            dataType: "json",
            success: function (json) {
                var BetListSum = 0;//总金额
                var BetListWinLoss = 0;//总中奖
                var BetListBackwater = 0;//总回水 
                var BetListBackComm = 0;//总盈亏 
                that.countItems(json.PageCount * 30);
                var CancelBet = Utils.Cookie.get('CancelBet'),
                    result = json.list;
                var arrPrint = new Array();
                $.each(result, function (index, value) {
                    if (value.BetStatus - 0 == 0 || value.BetStatus - 0 == 2) {
                        BetListSum = BetListSum + (value.BetAmount - 0);//总金额
                        BetListWinLoss = BetListWinLoss + (value.WinLoss - 0);//总中奖
                        BetListBackwater = BetListBackwater + (parseFloat(value.BackComm));//总回水 =金额*回水
                        BetListBackComm = BetListBackComm + (value.WinLoss - value.BetAmount + value.BackComm);//盈亏＝中奖－金额 + 回水 
                        //生成打印数据，不包括退码数据listPrint   /*状态--0:正常； 1：退码； 2：结算； 3：逻辑删除；*/                       
                        arrPrint.push({
                            PLotteryID: value.LotteryID,
                            PLsBetIds: value.LsBetIds,
                            PBetDt: value.BetDt,
                            PBetNumber: value.BetNumber,
                            PBetStatus: value.BetStatus,
                            PBetTypeID: value.BetTypeID,
                            PBetAmount: value.BetAmount,
                            POdds: value.Odds,
                            PWinLoss: value.WinLoss,
                            PBackwater: parseFloat(value.BackComm).toFixed(4) - 0,//总回水 =金额*回水
                            PProfitAndLoss: value.ProfitAndLoss,//盈亏＝中奖－金额 + 回水 
                            PBetListSum: BetListSum,
                            PBetListWinLoss: BetListWinLoss,
                            PBetListBackwater: BetListBackwater,
                            PBetListBackComm: BetListBackComm
                        });
                    }
                    var Diff = Utils.DateHelp.add('', -(CancelBet - 0), 'minute');
                    if (!(new Date(value.BetDt.replace('-', '/')) < new Date(Diff)) && value.BetStatus === 0) {
                        value.checked = ko.observable(false);
                        value.checked.subscribe(function (newValue) {
                            if (!newValue) {
                                that.cancelCheckAll(!newValue);
                            }
                            setTimeout(function () {
                                if (!newValue) {
                                    that.cancelCheckAll(!newValue).checkeAll(newValue);
                                }
                            }, 0);
                        });
                    } else {
                        // value.BetTypeID = '--';
                    }
                    value.Backwater = parseFloat(value.BackComm).toFixed(4) - 0//(value.BetAmount * (value.BetAmount - value.BackComm)).toFixed(4) - 0;//总回水 =金额*回水
                    // value.ProfitAndLoss = parseFloat(value.WinLoss - value.BetAmount + value.BackComm).toFixed(4) - 0; //盈亏＝中奖－金额 + 回水    
                });
                that.list(result);
                that.listPrint(arrPrint);
               // document.getElementById("PBetListCount").innerHTML = arrPrint.length;//打印总行数 
                //document.getElementById("PBetListSum").innerHTML = BetListSum.toFixed(4) - 0;//总金额 
                //document.getElementById("PBetListWinLoss").innerHTML = BetListWinLoss.toFixed(4) - 0;//总中奖 
                //document.getElementById("PBetListBackwater").innerHTML = BetListBackwater.toFixed(4) - 0;//总回水 
                //document.getElementById("PBetListBackComm").innerHTML = BetListBackComm.toFixed(4) - 0;//总盈亏 

                document.getElementById("BetListCount").innerHTML = json.list.length;//总行数
                document.getElementById("BetListSum").innerHTML =Utils.rounding(BetListSum);//总金额 
                document.getElementById("BetListWinLoss").innerHTML = Utils.rounding(BetListWinLoss);//总中奖 
                document.getElementById("BetListBackwater").innerHTML = Utils.rounding(BetListBackwater);//总回水 
                document.getElementById("BetListBackComm").innerHTML =Utils.rounding( BetListBackComm);//总盈亏 
                that.checkeAll(false);

            }
        });
    };


    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };

});
