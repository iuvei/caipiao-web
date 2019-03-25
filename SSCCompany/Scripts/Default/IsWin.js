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
        this.periodslist = ko.observableArray();
        this.PageCount = ko.observable(1);

        this.firstcheck = ko.observable(that.params.firstcheck == undefined ? true : false);


        this.FromRrport = ko.observable(false);///是否来自报表跳转
        this.UserName = ko.observable("");
        this.IsWin = ko.observable(true);//bool IsWin,   是否赢利
        this.BetInfoID = 0;
        this.uid = 0;
        this.IsShow = ko.observable(false);//bool IsShow  是否是现
        this.BeginNum = ko.observable("").extend({ limit: { range: [-10, 1000], fix: 2 } });//decimal  BeginNum 起始数字
        this.EndNum = ko.observable("").extend({ limit: { range: [-10, 1000], fix: 2 } });;//decimal EndNum    结束数字
        this.SearchPeriodsNumber = ko.observable(that.params.PeriodsNumber || "");//string PeriodsNumber 期数号码
        this.BetTypeID = ko.observable(0);//int BetTypeID 下注类型 0为全部
        this.QueryStatus = ko.observable(0);//bool QueryStatus  金额或者赔率
        this.BetNumber = ko.observable("");//string BetNumber 下注号码
        this.BetNumber.subscribe(function (newValue) {
            that.BetNumber(newValue.replace(/[^0-9|X]/i, ''));
        });
        this.PageNum = ko.observable(1);//int PageNum=1 页码
        this.MemberId = ko.observable(that.params.MemberId || -1);//int MemberId=-1 会员ID  -1为全部

        if (window.location.hash) {
            var hash = window.location.hash.replace('#', '').split(',');
            that.MemberId(hash[0]);
            that.firstcheck(false);
            that.SearchPeriodsNumber(hash[1]);
            window.location.hash = '';
        }
        ////合计的变量( 已退码的除外)
        this.CountMember = ko.observable(0);///统计有多少个会员
        this.CountAmt = ko.observable(0);///统计一共下注多少金额
        this.CountWinorLoss = ko.observable(0);//统计中奖金额
        this.CountBackComm = ko.observable(0);///统计下限回水
        this.CountRealyAmount = ko.observable(0);//统计实收下线
        this.CountPayAmount = ko.observable(0);///统计实付上线
        this.CountSelftComm = ko.observable(0);///统计自己回水
        this.CountCommission = ko.observable(0);//统计赚水
        this.paginationPrint = ko.observable(1);//页面，传打印的页数

        this.isFirstOpen = true;


        koPage.init(this, function (pageindex) {
            this.paginationPrint(pageindex);
            if (that.isFirstOpen) {
                that.GetPeriodsList(pageindex);
                that.isFirstOpen = false;
            } else {
                that.GetData(pageindex);
            }
        }, {
            pagesize: 30
        });

        //回车查询：中奖明细回车查询数据
        this.isWinEnter = function (data, event) {
            if (event.keyCode - 0 == 13) {
                this.Search();
            }
            return false;
        }

        ///打印
        this.Print = function () {
            var BeginNum = that.BeginNum() === "" ? -1 : that.BeginNum(),
              EndNum = that.EndNum() == "" ? -1 : that.EndNum();
            var v = "01=" + that.IsWin() + "&02=" + that.UserName() + "&03=" + that.IsShow() + "&04=" + BeginNum + "&05=" + EndNum + "&06=" + that.SearchPeriodsNumber() + "&07=" + that.BetTypeID() + "&08=" + that.QueryStatus() + "&09=" + that.BetNumber() + "&10=" + that.paginationPrint() + "&11=" + that.MemberId() + "&12=" + that.isSearch();
            window.open("/index.php/portal/agent/GrossPrint?" + encodeURIComponent(v));


            //var match = /<!--print start-->( .+? )<!--print end-->/;
            //var startnum = window.document.body.innerHTML.indexOf("<!--print start-->");
            //var endnum = window.document.body.innerHTML.indexOf("<!--print end-->");
            //var xx = window.document.body.innerHTML.substring(startnum, endnum);
            //window.document.body.innerHTML = xx;//window.document.body.innerHTML.match(match);//= window.document.getElementById("#PrintTable").innerHTML;
            //window.print();
            //window.location.reload()
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
             that.GetData(1);
        }
        this.isSearch = ko.observable(false);
        this.Search = function () {
            Utils.Cookie.set('arrIsWin', '', 0, '/');
            this.isSearch(true);//var SearchFlage = true;
            var error = "";
            if (that.BeginNum() == "" || that.EndNum() == "") {
                if (that.BeginNum() == "" || that.BeginNum().length == 0) {
                    that.BeginNum(-1);
                }
                if (that.EndNum() == "" || that.EndNum().length == 0) {
                    that.EndNum(-1);
                }
            }
            // if (that.UserName() == undefined || that.UserName() == null || that.UserName() == "") {
            //         Utils.tip("账号名称不能为空!!", false, 3000, true ? function () {

            //         } : null);
            //         return false;
            //     }
            that.UserName($("#UserName").val().replace(/(^\s*)|(\s*$)/g, ""));
            that.SearchPeriodsNumber($("#periodsnumber").val());
            //that.GetPeriodsList();
            //that.GetData(1, true);
            that.currentPage(0);
            that.currentPage(1);

        }
        //this.GetPeriodsList();
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
                //if (that.firstcheck())
                    that.SearchPeriodsNumber($("#periodsnumber").val());
                that.GetData(pageindex);

            }
        });
    }
    GrossList.prototype.back = function () {//返回
        var that = this;
        $('.guide_right a').css({ color: '#555' });
        var getarrIsWin = Utils.Cookie.get('arrIsWin');//报表跳转时，会员名和期数
        if (getarrIsWin != null) {
            getarrIsWin = getarrIsWin.split("&");
            if (getarrIsWin.length > 0) {
                function toBoolean(str) {
                    return typeof str === "string" ? (str == "true" ? true : false) : str;
                }
                framework.view('/index.php/portal/agent/Gross', 'Gross/Index',
                    {
                        anchor: getarrIsWin[4],
                        memberId: getarrIsWin[3]|0,
                        loginName: getarrIsWin[0],
                        periodsNumber: getarrIsWin[1],
                        levelStatus: getarrIsWin[5],
                        companyID: getarrIsWin[6]|0,
                        companyType: getarrIsWin[7],
                        isMember: toBoolean(getarrIsWin[8]),
                        isSubAccount: toBoolean(getarrIsWin[9])//,
                        //history: window["winHistory"]
                    });
                return;
            }
        }
    };

    GrossList.prototype.GetData = function (pageindex, reset) {
        var that = this;
        var getarrIsWin = Utils.Cookie.get('arrIsWin');//报表跳转时，会员名和期数
        if (getarrIsWin != null) {
            if (getarrIsWin.length > 0) {
                that.FromRrport(true);
                that.UserName(getarrIsWin.split('&')[0]);
                that.SearchPeriodsNumber(getarrIsWin.split('&')[1]);
                that.isSearch(getarrIsWin.split('&')[2])
                $("#UserName").val(that.UserName());
            }
        }

        if (that.firstcheck()) {
            //    that.SearchPeriodsNumber($("#periodsnumber").val());
            that.firstcheck(false);
        }
        $.ajax({
            url: "/index.php/portal/agent/GetGrossList",
            data: {
                isSearch:that.isSearch(),//是否是点提交查询
                IsWin: that.IsWin(),
                UserName: that.UserName(),
                IsShow: that.IsShow(),
                BeginNum: that.BeginNum() === "" ? -1 : that.BeginNum(),
                EndNum: that.EndNum() == "" ? -1 : that.EndNum(),
                PeriodsNumber: that.SearchPeriodsNumber(),
                BetTypeID: that.BetTypeID(),
                BetInfoID: that.BetInfoID,
                    uid: that.uid,
                QueryStatus: that.QueryStatus(),
                BetNumber: that.BetNumber(),
                PageNum: pageindex,//that.PageNum(),
                MemberId: that.MemberId(),
                IsExpand: 1,
            },
            success: function (data) {
                //Utils.Cookie.set('arrIsWin', '', 0, '/');
               
                that.PageCount(data.PageCount);
                koPage.count(data.PageCount * 30);
                if (reset) {
                    that.currentPage(0);
                    that.currentPage(1);
                }
                //统计的都是 非退码的数量
                var CountMember = 0,///统计有多少个会员
                      CountAmt = 0,///统计一共下注多少金额
                      CountWinorLoss = 0,//统计中奖金额
                      CountBackComm = 0,///统计下限回水
                      CountRealyAmount = 0,//统计实收下线
                      CountPayAmunt = 0,///统计实付上线
                      CountSelftComm = 0,///统计自己回水
                      CountCommission = 0;//统计赚水
                $.each(data.list, function (index, value) {
                    var ip = value.BetIP;
                    ip = ip.split('.');
                    ip.splice(2, 1, '*'); //将1这个位置的字符，替换成'xxxxx'. 用的是原生js的splice方法。
                    ip.splice(3, 1, '*')
                    value.BetIP = ip.join('.');  //将数组转换成字符串。  完成。
                    if (value.BetStatus === 1) {
                        var backIP = value.BackBetIP;
                        backIP = backIP.split('.');
                        backIP.splice(2, 1, '*'); //将1这个位置的字符，替换成'xxxxx'. 用的是原生js的splice方法。
                        backIP.splice(3, 1, '*')
                        value.BackBetIP = backIP.join('.');  //将数组转换成字符串。  完成。
                    }
                    if (value.BetStatus !== "2") {
                        var BackComm = value.BackComm;//下线回水:
                        var BetAmount = value.BetAmount;//下注金额
                        var SelfBackComm = value.SelfBackComm//自己回水: SelfBackComm
                        var RealyAmount = BetAmount - BackComm;//实收下线 :  BetAmount - BackComm
                        var RealyPayAmount = BetAmount - SelfBackComm//实付上线： BetAmount - SelfBackComm
                        var Commission = SelfBackComm - BackComm//赚水： SelfBackComm  - BackComm
                        var WinLoss = value.WinLoss;///输赢金额
                        CountMember++;
                        CountAmt = CountAmt + BetAmount;///统计一共下注多少金额
                        CountWinorLoss = CountWinorLoss + WinLoss;
                        CountBackComm = CountBackComm + BackComm;///统计回水
                        CountRealyAmount = CountRealyAmount + RealyAmount;//统计实收下线
                        CountPayAmunt = CountPayAmunt + RealyPayAmount;///统计实付上线
                        CountSelftComm = CountSelftComm + SelfBackComm;///统计自己回水
                        CountCommission = CountCommission + Commission;
                    }

                });
                that.list(data.list);
                that.CountMember(CountMember);
                that.CountAmt(CountAmt.toFixed(4) - 0);
                that.CountWinorLoss(CountWinorLoss.toFixed(4) - 0);
                that.CountBackComm(CountBackComm);
                that.CountRealyAmount(CountRealyAmount.toFixed(4) - 0);
                that.CountPayAmount(CountPayAmunt.toFixed(4) - 0);
                that.CountSelftComm(CountSelftComm);
                that.CountCommission(CountCommission);
            }
        })
        if (that.SearchPeriodsNumber() != null) {
            $("#periodsnumber").val(that.SearchPeriodsNumber());
        }
        if (that.BeginNum() == -1)
            that.BeginNum("");
        if (that.EndNum() == -1)
            that.EndNum("");
    }
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