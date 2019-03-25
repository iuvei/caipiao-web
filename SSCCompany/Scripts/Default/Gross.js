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
        this.UserName = ko.observable();
        this.FormerUserName = ko.observable();
        this.IsWin = ko.observable(false);//bool IsWin,   是否赢利
        this.IsShow = ko.observable(false);//bool IsShow  是否是现
        this.BeginNum = ko.observable("").extend({ limit: { range: [-10, 1000], fix: 2 } });//decimal  BeginNum 起始数字
        this.EndNum = ko.observable("").extend({ limit: { range: [-10, 1000], fix: 2 } });;//decimal EndNum    结束数字
        this.SearchPeriodsNumber = ko.observable();//string PeriodsNumber 期数号码
        this.FromRrport = ko.observable(false);///是否来自报表跳转
        this.BetTypeID = ko.observable(0);//int BetTypeID 下注类型 0为全部
        this.BetInfoID = 0;
        this.uid = 0;
        this.QueryStatus = ko.observable(0);//bool QueryStatus  金额或者赔率
        this.BetNumber = ko.observable("");//string BetNumber 下注号码
        this.BetNumber.subscribe(function (newValue) {
            that.BetNumber(newValue.replace(/[^0-9|X]/i, ''));
        });
        this.PageNum = ko.observable(1);//int PageNum=1 页码
        this.MemberId = ko.observable(that.params.memberId || -1);//int MemberId=-1 会员ID  -1为全部
        this.anchor = this.params.anchor;//标记锚点，记录是从日报还是从月报跳转过来的
        GrossList.anchor = this.anchor;
        this.isSearch = ko.observable(this.anchor == 'dayReport' ? true : false);//如果是报表和提交按钮查询
        this.isShowWin = ko.observable(this.anchor==undefined?false:true);

        this.isGross = ko.observable(true);//true：表示总货明细查询；false：表示从其它报表跳转查询，需传日期
        this.GetDateTime = ko.observable();
        if (this.params.memberId) {
            that.MemberId(this.params.memberId);
            that.UserName(this.params.loginName).FormerUserName(this.params.loginName);
            that.firstcheck(false).isGross(params.periodsTime?false:true).GetDateTime(params.periodsTime);
            that.SearchPeriodsNumber(this.params.periodsNumber);
            that.params.history && that.params.history.length>0&&that.FromRrport(true);
           // that.isSearch(true);
            var arrIsWin = that.UserName() + "&" + that.SearchPeriodsNumber() + "&" + that.isSearch() + "&" + that.MemberId() + "&" + that.anchor;//是从报表跳转过来，设置缓存给中奖明细
            arrIsWin += "&" + that.params.levelStatus;
            arrIsWin += "&" + that.params.companyID;
            arrIsWin += "&" + that.params.companyType;
            arrIsWin += "&" + that.params.isMember;
            arrIsWin += "&" + that.params.isSubAccount;
            //window["winHistory"] = that.params.history;
            Utils.Cookie.set('arrIsWin', arrIsWin, 0, '/');

        }
        //else if (this.params.periodsNumber) {
        //    that.SearchPeriodsNumber(this.params.periodsNumber);
        //}
        this.isDayReport = ko.observable(that.params.isDayReport || false);//true表示从日结报表跳转过来；公司子账号判断

        //回车查询：总货明细回车查询数据
        this.grossEnter = function (data, event) {
            if (event.keyCode - 0 == 13) {
                this.Search();
                this.GetData();
            }
            return false;
        }

        //总货明细下载，封盘后才显示下载按钮
        this.IsShowDownload = ko.observable(Utils.Cookie.get('PeriodsStatus')-0==0?true:false);
        //if (!Utils.Cookie.get('PeriodsID')) {
        //    this.IsShowDownload(true);
        //}
        //合计的变量( 已退码的除外)
        this.CountMember = ko.observable(0);///统计有多少个会员
        this.CountAmt = ko.observable(0);///统计一共下注多少金额
        this.CountWinorLoss = ko.observable(0);//统计中奖金额
        this.CountBackComm = ko.observable(0);///统计下限回水
        this.CountRealyAmount = ko.observable(0);//统计实收下线
        this.CountPayAmount = ko.observable(0);///统计实付上线
        this.CountSelftComm = ko.observable(0);///统计自己回水
        this.CountCommission = ko.observable(0);//统计赚水

        this.paginationPrint = ko.observable(1);//页面，传打印的页数

        /**2017-06-05 总公司新需求***/
        this.CompanyList= ko.observableArray();//子公司List
        this.CompanyType = ko.observable(Utils.Cookie.get('CompanyType') - 0);
        this.IsDisablePeriodsOrDay = ko.observable(that.CompanyType() == 0 ? true : false);
        this.ZCompanyID = ko.observable(that.params.ZCompanyID || 0);
       
        
        this.IsPeriodsOrDay = ko.observable(that.CompanyType() == 0 ? true : false);// false:按照期数查询  ；  true：按照天查询
        this.BetDate = ko.observable(that.params.periodsTime);//  查询日期：如：2017-03-23 
        this.BetDateList = ko.observableArray();
        this.isFirstOpen = true;
        if(that.CompanyType() ==0)//只有总公司查询子公司列表
        {
        that.GetCompanyData();
        }
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

        //下载总货明细（.sql文件）Backup
        this.DownloadGross = function ($data) {
            framework.view("/index.php/portal/agent/DownloadGross", "Gross/DownloadGross", $data);
        }

        ///打印
        this.Print = function () {
          var BeginNum = that.BeginNum() === "" ? -1 : that.BeginNum(),
              EndNum = that.EndNum() == "" ? -1 : that.EndNum();
          var v = "01=" + that.IsWin() + "&02=" + that.UserName() + "&03=" + that.IsShow() + "&04=" + BeginNum + "&05=" + EndNum + "&06=" + that.SearchPeriodsNumber() + "&07=" + that.BetTypeID() + "&08=" + that.QueryStatus() + "&09=" + that.BetNumber() + "&10=" + that.paginationPrint() + "&11=" + that.MemberId() + "&12=" + that.isSearch();
          window.open("/index.php/portal/agent/GrossPrint?" + encodeURIComponent(v));

        };
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
        this.Search = function () {
            this.isSearch(true);
            var SearchFlage = true;
            var error = "";
            if (that.CompanyType() == 0)
            {
                if( $("#companyIDVal").val()-0==0)
                {
                    Utils.tip("请选择子公司名称!!", false, 3000, true ? function () {

                    }: null);
                    return false;
                 }
            }  
            if (that.CompanyType() != 0&&that.IsPeriodsOrDay()) {
                if (that.UserName() == undefined || that.UserName() == null || that.UserName() == "") {
                    Utils.tip("账号名称不能为空!!", false, 3000, true ? function () {

                    } : null);
                    return false;
                }
            }
            if (that.BeginNum() == "" || that.EndNum() == "") {
                if (that.BeginNum() == "" || that.BeginNum().length == 0) {
                    that.BeginNum(-1);
                }
                if (that.EndNum() == "" || that.EndNum().length == 0) {
                    that.EndNum(-1);
                }
            }
           
            that.UserName($("#UserName").val().replace(/(^\s*)|(\s*$)/g, ""));
            that.SearchPeriodsNumber($("#periodsnumber").val());
            that.BetDate($("#betdateVal").val());
            that.currentPage(0);
            that.currentPage(1);

        };

        //中奖明细
        this.GetIsWin = function () {
            if (that.UserName() == undefined || that.UserName() == null || that.UserName() == "") {
                    Utils.tip("账号名称不能为空!!", false, 3000, true ? function () {

                    } : null);
                    return false;
                }
            that.IsWin(true).isSearch(true).SearchPeriodsNumber($("#periodsnumber").val()).BetDate($("#betdateVal").val());
            that.GetData();

        }
      
    };

    ///获取公司列表
    GrossList.prototype.GetCompanyData = function () {
        var that = this;
        $.ajax({
            url: "/index.php/portal/agent/GetCompanySetingList",
            data: { loginName:'', nickName: '' },
            cache: false,
            dataType: "json",
            success: function (json) {
                var arr = {
                    ID: 0,
                    LoginName: "--请选择--" 
                }
                json.unshift(arr);

                that.CompanyList(json);

                if (that.ZCompanyID() - 0 > 0) {
                    $("#companyIDVal").val(that.ZCompanyID());
                }
            }
        });


    };

    GrossList.prototype.GetPeriodsList = function (pageindex) {
        if (!Utils.Cookie.get('PeriodsID')) {
            //如果封盘了查询最后一期数据
            $.ajax({
                url: "/index.php/portal/agent/GetLastPeriodsNumber",
                cache: false,
                success: function (data) {
                    data && data.length && that.SearchPeriodsNumber(data[0].PeriodsNumber);
                }
            });
        }
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
                isGross:that.isGross ,//true：表示总货明细查询；false：表示从其它报表跳转查询，需传日期
                GetDateTime:that.GetDateTime()
            },
            success: function (data) {
                that.periodslist(data.list);
                that.periodslist().sort(function (a, b) { if ((a.PeriodsNumber - 0) < (b.PeriodsNumber - 0)) return 1; if ((a.PeriodsNumber - 0) > (b.PeriodsNumber - 0)) return -1; return 0 });
                if (that.firstcheck() && !that.FromRrport())
                    that.SearchPeriodsNumber($("#periodsnumber").val()).BetDate($("#betdateVal").val());
                that.GetData(pageindex);

            }
        });
    };
    GrossList.prototype.ajaxFlag = true;
    GrossList.prototype.GetData = function (pageindex, reset) {
        var that = this;
        if (that.firstcheck()) {
            that.firstcheck(false);
        }
        var load = Utils.loading({ delayTime: 5000 });
        if (that.ajaxFlag) {
            that.ajaxFlag = false;
            $.ajax({
                url: "/index.php/portal/agent/GetGrossList",
                data: {
                    isSearch: that.isSearch(),
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
                    MemberId: that.FormerUserName() == that.UserName() ? that.MemberId() : -1,
                    IsPeriodsOrDay :that.IsPeriodsOrDay(),// false:按照期数查询  ；  true：按照天查询
                    BetDate: that.BetDate(),//  查询日期：如：2017-03-23 
                    ZCompanyID: $("#companyIDVal").val(),
                    IsExpand: 1,
                },
                cache: false,
                success: function (data) {
                    // if(that.BetInfoID){
                        $('#bsxxss').html('赔率');
                    // }
                    // else{
                    //     $('#bsxxss').html('注数');
                    // }
                    that.PageCount(data.PageCount);
                    koPage.count(data.PageCount * 30);
                    if (reset) {
                        that.currentPage(0);
                        that.currentPage(1);
                    }
                    that.ajaxFlag = true;
                    //统计的都是 非退码的数量
                    var CountMember = 0,///统计有多少个会员
                          CountAmt = 0,///统计一共下注多少金额
                          CountWinorLoss = 0,//统计中奖金额
                          CountBackComm = 0,///统计下限回水
                          CountRealyAmount = 0,//统计实收下线
                          CountPayAmunt = 0,///统计实付上线
                          CountSelftComm = 0,///统计自己回水
                          CountCommission = 0;//统计赚水
                    var arrPrint = new Array();

                    $.each(data.list, function (index, value) {//
                        var ip =value.BetIP;
                        ip = ip.split('.');
                        ip.splice(2, 1, '*'); //将1这个位置的字符，替换成'xxxxx'. 用的是原生js的splice方法。
                        ip.splice(3, 1, '*')
                        value.BetIP = ip.join('.');  //将数组转换成字符串。  完成。
                        if (value.BetStatus === 1)
                        {
                            var backIP = value.BackBetIP;
                            backIP = backIP.split('.');
                            backIP.splice(2, 1, '*'); //将1这个位置的字符，替换成'xxxxx'. 用的是原生js的splice方法。
                            backIP.splice(3, 1, '*')
                            value.BackBetIP = backIP.join('.');  //将数组转换成字符串。  完成。
                        }
                        if (value.BetStatus != 1 || that.QueryStatus() - 0 == 2) {
                            var BackComm = value.BackComm.toFixed(4) - 0;//下线回水:
                            var BetAmount = value.BetAmount.toFixed(4) - 0;//下注金额
                            var SelfBackComm = value.SelfBackComm.toFixed(4) - 0;//自己回水: SelfBackComm
                            var RealyAmount = BetAmount - BackComm;//实收下线 :  BetAmount - BackComm
                            var RealyPayAmount = BetAmount - SelfBackComm;//实付上线： BetAmount - SelfBackComm
                            var WinLoss = value.WinLoss.toFixed(4) - 0;///输赢金额
                            CountMember++;
                            CountAmt = CountAmt + BetAmount;///统计一共下注多少金额
                            CountWinorLoss = CountWinorLoss + WinLoss;
                            CountBackComm = CountBackComm + BackComm;///统计回水
                            CountRealyAmount = CountRealyAmount + RealyAmount;//统计实收下线
                            CountPayAmunt = CountPayAmunt + RealyPayAmount;///统计实付上线
                            CountSelftComm = CountSelftComm + SelfBackComm;///统计自己回水
                            CountCommission = CountCommission + value.Commission;
                            //生成打印数据，不包括退码数据listPrint   /*状态--0:正常； 1：退码； 2：结算； 3：逻辑删除；*/
                            arrPrint.push({
                                PBetStatus: value.BetStatus,//
                                PBetIdentifier: value.BetIdentifier,//注单号
                                PLoginName: value.LoginName,
                                PNickName: value.NickName,
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
                            });
                        }
                    });
                    that.list(data.list);
                    that.CountMember(CountMember.toFixed(4) - 0);
                    that.CountAmt(CountAmt.toFixed(4) - 0);
                    that.CountWinorLoss(CountWinorLoss.toFixed(4) - 0);
                    that.CountBackComm(CountBackComm.toFixed(4) - 0);
                    that.CountRealyAmount(CountRealyAmount.toFixed(4) - 0);
                    that.CountPayAmount(CountPayAmunt.toFixed(4) - 0);
                    that.CountSelftComm(CountSelftComm.toFixed(4) - 0);
                    that.CountCommission(CountCommission.toFixed(4) - 0);
                    that.printList(arrPrint);//存储需要打印的数据，不包含退码数据
                    load.cancel();
                }
            })
        }
        if (that.SearchPeriodsNumber() != null) {
            $("#periodsnumber").val(that.SearchPeriodsNumber());
            $("#betdateVal").val(that.BetDate() );
        }
        if (that.BeginNum() == -1)
            that.BeginNum("");
        if (that.EndNum() == -1)
            that.EndNum("");
        var leng = (Utils.DateHelp.add('', 0, 'day', 'yyyyMMdd') - 0) - (Utils.DateHelp.add('', -7, 'day', 'yyyyMMdd') - 0);
        
        $.ajax({
            url: "/index.php/portal/agent/GetBetDateList",
            cache: false,
            dataType: "json", 
            success: function (json) {
                if (json.list.length > 0) {
                    that.BetDateList(json.list.reverse());
                    
                }
            }
        });
    };
    GrossList.prototype.back = function () {
        this.params.history.pop();
        if (this.anchor === 'day') {
            require('../ui.js').childList($('#menus > li[id="3"] > a').data("child"));
            $('#menus > li[id="3"]').addClass('active').siblings('.active').removeClass('active');
            framework.view('/index.php/portal/agent/Report', 'Report/Index', this.params);
            return;
        }
        else if (this.anchor === "dayReport") {
            require('../ui.js').childList($('#menus > li[id="3"] > a').data("child"));
            $('#menus > li[id="3"]').addClass('active').siblings('.active').removeClass('active');
            framework.view('/index.php/portal/agent/DayReportPeriods', 'Report/DayReportPeriods', this.params);
            return;
        }
        framework.view('/index.php/portal/agent/MonthReport', 'Report/MonthReport', this.params);
    };
    exports.viewmodel = GrossList;
    exports.done = function () {
        var
            a = $('.guide_right a');
        if (!GrossList["anchor"]) {
            //a.eq(0).css({ color: 'red' });
            a.eq(0).addClass("menuon").siblings().removeClass("menuon");
        }
        a.click(function () {
            //a.css({ color: '#555' });
            //$(this).css({ color: 'red' });
            $(this).addClass("menuon").siblings().removeClass("menuon");
        });
        //if (Utils.Cookie.get('PeriodsID')) {

        //    a.eq(3).off('click').on('click', function () {
        //        return false;
        //    }).css({ color: '#FFFFFF' });
        //}
    };
});