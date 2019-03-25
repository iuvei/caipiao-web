define(function (require, exports, module) {
    var ContributionList = function (params) {
        var that = this;
        var params = params || {};
        this.params = params;
        this.list = ko.observableArray();///贡献度内容列表
        this.periodslist = ko.observableArray();///期数列表

        //this.periodsNumber = ko.observableArray();
        //this.GetDateTime = ko.observable();
        //this.isGross = ko.observable(false);//true：表示总货明细查询；false：表示从其它报表跳转查询，需传日期

        this.CompanyID = ko.observable(Utils.Cookie.get('AccountID'));
        this.CompanyType = ko.observable(Utils.Cookie.get('CompanyType'));
        this.NewPeriods = ko.observable();
        this.TimeOrPeriods = ko.observable(false);//// false:Time ; true:Periods
        this.firstcheck = ko.observable(true);
        this.StartDate = ko.observable(new Date().format('yyyy/MM/dd'));
        this.EndDate = ko.observable(this.StartDate());
        this.Monthlist = ko.observableArray();///获取日期列表 3个月内的
        this.history = ko.observableArray();
        var changeColor = function (event) {
            target = $(event.target);
            target.closest('div').find('a').removeClass("red");//css({ 'color': '#555555' });
            target.addClass("red");//.css({ 'color': 'red' });
        };
        this.flags = 'nowPeriods';
        ///层级数据
        this.IsMember = ko.observable(false);
        this.isBack = ko.observable(false);
        this.SuperCompany = ko.observable(false);
        this.TopLevel = ko.observable(1);
        this.AllLevel = ko.observableArray();
        this.LevelStatus = ko.observable(Utils.Cookie.get('AgentLevel') || -1);
        this.currentLevel = ko.observable();
        ///表格列名
        this.NextName = ko.observable();
        this.td3 = ko.observable('贡献金额');
        this.td4 = ko.observable('贡献总金额');
        this.td5 = ko.observable('占成总盈亏');
        this.td6 = ko.observable('百分比贡献盈亏');
        this.td7 = ko.observable('实际贡献盈亏');
        this.td8 = ko.observable('占成百分比');
        this.td9 = ko.observable('贡献度');

        this.isThatDay = ko.observable(true);//表示当天，10点之前日期是昨天的日期；

        //this.canPeriodsNumberChange = false;
        //this.periodsNumberFrom.subscribe(function (newValue) {
        //    if (!that.canPeriodsNumberChange) return;
        //    that.timeOrPeriods(true).GetData();
        //})
        //this.periodsNumberFromTo.subscribe(function (newValue) {
        //    if (!that.canPeriodsNumberChange) return;
        //    that.timeOrPeriods(true).GetData();
        //})

        //返回功能
        this.GoBack = function () {
            var
                history = that.history(),
                params = history.pop();

            that
                .isBack(!!history.length)
                .CompanyID(params.companyID)
                .CompanyType(params.companyType)
                .LevelStatus(params.levelStatus)
                .currentLevel(params.currentLevel)
                .StartDate(params.startDate)
                .EndDate(params.endDate)
                .IsMember(false)
                .isClickContrbution(that.CompanyType() - 0 == 1 ? params.levelStatus - 0 == -1 ? false : true : true);;
            that.GetData();
        }
        this.isNowPeriodsGetDate = ko.observable(true);//如果是‘本期’，日期格式为：PeriodsTime+'('+PeriodsNumber+')'如:06-30(16347)；其它为2016年06月
        this.NowPeriodsGetDate = function ($data, event) {
            var
                date = that.GetDate();
            that.CompanyID(Utils.Cookie.get('AccountID'));
            that.CompanyType(Utils.Cookie.get('CompanyType'));
            that.LevelStatus(Utils.Cookie.get('AgentLevel') || -1);
            that.isClickContrbution(false);
            that.isNowPeriodsGetDate(true);
            that.TimeOrPeriods(false); //按照期数查询
            that.StartDate(new Date().format('yyyy/MM/dd')).EndDate(new Date().format('yyyy/MM/dd'));
            that.IsMember(false);
            that.isThatDay(true);
            changeColor(event);
            that.flags = 'nowPeriods';
            that.GetData();
        }
        this.CheckMonthlist = function ($data, event) {
            that
                .isNowPeriodsGetDate(false)
                .isClickContrbution(false)
                .TimeOrPeriods(true)
                .StartDate($data.StartDate.replace(/-/g, '/'))
                .EndDate($data.EndDate)
            .CompanyID(Utils.Cookie.get('AccountID'))
            .CompanyType(Utils.Cookie.get('CompanyType'))
           .LevelStatus(Utils.Cookie.get('AgentLevel') || -1)
           .IsMember(false)
           .isThatDay(false);
            that.isBack(false);
            changeColor(event);
            that.flags = 'mountList';
            that.GetData();

        }
        ///重置获取全部数据
        this.GetAll = function (data, event) {
            var
                date = that.GetDate();
            changeColor(event);
            that.isClickContrbution(false);
            that.EndDate(date.dateTo);
            that.StartDate(date.dateFrom);
            that.TimeOrPeriods(true);
            that.isNowPeriodsGetDate(false);
            that.CompanyID(Utils.Cookie.get('AccountID'))
            that.CompanyType(Utils.Cookie.get('CompanyType'));
            that.LevelStatus(Utils.Cookie.get('AgentLevel') || -1);
            that.IsMember(false);
            that.isBack(false);
            that.history.removeAll();
            that.flags = 'all';
            that.isThatDay(false);
            that.GetData();
        }
        ///根据ID获取贡献度列表
        this.isClickContrbution = ko.observable(params.isClickContrbution||false);//(that.CompanyType() - 0 == 1 ? false : true);
        this.NextLevel = function ($data) {
            that.isClickContrbution(true);
            if ($data.AgentLevel === -2) {
                return;
            }
            if (!that.IsMember()) {
                if (!(that.CompanyType() === '0' || that.CompanyType() === '1')) {
                    if (that.currentLevel() === that.AllLevel().length - 1) {
                        that.IsMember(true);
                    }
                    else {
                        that.td3('占成金额')
                            .td4('占成总金额')
                            .td5('占成总盈亏')
                            .td6('实际占成盈亏')
                            .td7('百分比占成盈亏')
                            .td8('占成百分比')
                            .td9('贡献度');
                    }
                }
                else {
                    that.td3('贡献金额')
                        .td4('总金额')
                        .td5('总盈亏')
                        .td6('百分比贡献盈亏')
                        .td7('实际贡献盈亏')
                        .td8('占成百分比')
                        .td9('贡献度');
                }
                that.history.push({
                    companyID: that.CompanyID(),
                    companyType: that.CompanyType(),
                    levelStatus: that.LevelStatus(),
                    currentLevel: that.LevelStatus(),
                    startDate: that.StartDate(),
                    endDate: that.EndDate()
                });

                if (that.TimeOrPeriods()) {
                    that.StartDate($data.PeriodsTime);
                    that.EndDate($data.PeriodsTime);
                    that.isClickContrbution(false);
                } else {
                    that.CompanyID($data.ID).CompanyType($data.CompanyType).LevelStatus($data.LevelStatus).currentLevel($data.LevelStatus);
                }


                that.TimeOrPeriods(false);
                if (that.flags === 'nowPeriods') {
                    that.GetData();
                    that.isBack(true);
                } else {
                    // $('#NowPeriods').trigger('click');
                    $('#counClass a').css({ color: '#555555' });
                    $('#NowPeriods').css({ color: 'red' });
                    that.GetData();
                    that.isBack(true);
                }
            }
        }

        ///合计统计
        this.CountPercents = ko.observableArray();
        this.CountPercentageAmt = ko.observable();//
        this.CountPercentageTotal = ko.observable();
        this.CountWinLossTotal = ko.observable();
        this.CountPercentWinLossAndCountibution = ko.observable();//统计总贡献百分比
        this.CountWinLoss = ko.observable();///实际贡献盈亏
        this.CountContibution = ko.observable();//统计贡献度
        this.ConutPercentContibution = ko.observable();//统计占成百分比

        if (that.CompanyType() != 2) {
            that.GetDate();
        }
        that.GetData();
    };


    ContributionList.prototype.GetData = function () {
        var that = this;
        var load = Utils.loading({ delayTime: 5000 });

        //var start = '' + that.StartDate();
        //start = start.substr(0, 4) + "/" + start.substr(4, 2) + "/" + start.substr(6, 2);

        //var end = '' + that.EndDate();
        //end = end.substr(0, 4) + "/" + end.substr(4, 2) + "/" + end.substr(6, 2);

        $.ajax({
            url: '/index.php/portal/agent/ReportContribute',
            data: {
                isClickContrbution: that.isClickContrbution(),//false:表示登录者查看下级贡献度；true表示往下点查看
                CompanyType: that.CompanyType(),
                CompanyID: that.CompanyID(),
               // PeriodsId: $("#periodsid").val(),
                StartDate: that.StartDate(),//that.StartDate() == 'NaN-aN-aN' ? new Date().format('yyyy-MM-dd 00:00') : that.StartDate(),
                EndDate: that.EndDate(),//that.EndDate() == 'NaN-aN-aN' ? new Date().format('yyyy-MM-dd 00:00') : that.EndDate(),
                TimeOrPeriods: that.TimeOrPeriods(),
                IsMember: that.IsMember(),
                LotteryID: 1,
                LevelStatus: that.LevelStatus(),
                isThatDay: that.isThatDay(),
                AgentLevel: ko.observable(Utils.Cookie.get('AgentLevel') || -1)
            },
            success: function (data) {
                var a = [];
                var CountPercentageAmt = 0
                var CountPercentageTotal = 0
                var CountWinLossTotal = 0
                var CountPercents = 0;
                var CountPercentWinLossAndCountibution = 0;//统计总贡献百分比
                var CountWinLoss = 0;///实际贡献盈亏
                var CountContibution = 0; //统计贡献度
                var periodsid = $('#periodsid');
                var takeLevel = false;
                if (data) {
                    $.each(data, function (index, value) {
                        if (value.AgentLevel != -2 && !takeLevel) {
                            takeLevel = true
                            that.currentLevel(value.LevelStatus - 0);
                        }

                        CountPercentageAmt = CountPercentageAmt + value.PercentageAmt;
                        CountPercentageTotal = CountPercentageTotal + value.PercentageTotal;
                        CountWinLossTotal = CountWinLossTotal + value.WinLossTotal;
                        CountPercentWinLossAndCountibution = CountPercentWinLossAndCountibution + value.PercentRatioWL;
                        CountWinLoss = CountWinLoss + value.WinLoss;
                        CountPercents = CountPercents + value.Percents;
                        CountContibution = CountContibution + value.Contribute;
                    });
                    that.CountPercentageAmt(Math.ceil(CountPercentageAmt) - 0); //(CountPercentageAmt.toFixed(4) - 0);//
                    that.CountPercentageTotal(Math.ceil(CountPercentageTotal) - 0); //(CountPercentageTotal.toFixed(4) - 0);//
                    that.CountWinLossTotal(CountWinLossTotal.toFixed(4) - 0);
                    that.CountPercentWinLossAndCountibution(Math.ceil(CountPercentWinLossAndCountibution) - 0);//统计总贡献百分比
                    that.CountWinLoss(Math.ceil(CountWinLoss) - 0);///实际贡献盈亏
                    that.CountPercents(CountPercents.toFixed(4) - 0);
                    that.CountContibution(CountContibution.toFixed(2) - 0 + '%');//(Math.ceil(CountContibution) - 0+'%'); //统计贡献度
                    that.list(data);
                }
                if (!($.cache.levelCache && $.cache.levelCache.length > 0)) {
                    $.ajax({
                        url: '/index.php/portal/agent/GetAgentLevelByID',
                        data: {
                            CompanyID: that.CompanyID()
                        }
                    }).done(function (data) {
                        if (data.length) {
                            that.AllLevel($.cache.levelCache = data);
                        }
                        that.GetLevel();
                    });
                }
                else {
                    that.AllLevel($.cache.levelCache);
                    that.GetLevel();
                }
                periodsid.off('change').on('change', function (event) {
                    var
                        periodsID = $(event.target).val();
                    that.TimeOrPeriods(true);
                    that.GetData();
                });
                load.cancel();
            }
        });
    };
    ContributionList.prototype.GetDate = function (getDataList) {
        var that=this,
            dateList = [],
            date = new Date(),
                dateFrom,
                dateTo;

        date.setDate(1);

        this.Monthlist.removeAll();
        if (!that.TimeOrPeriods()&&that.CompanyType() == 2) {
            if (getDataList == undefined) {
                getDataList = this.periodslist();
            }
            var indexOf = [];
            for (var i = 0; i < getDataList.length; i++) {
                var startdt,
                    enddt,
                    reg = /[^\d]/g,
                    date,
                    dateTo,
                    text;

                if (that.Monthlist().length > 0) {
                    for (var d = 0; d < that.Monthlist().length; d++) {
                        if (ko.utils.arrayIndexOf(indexOf, getDataList[i].OpenDt) == -1) //(that.Monthlist()[d].Text != '【' + getDataList[i].OpenDt + '】')
                        {
                            text = getDataList[i].OpenDt;
                            startdt = new Date(getDataList[0].OpenDt.replace(/[^\d]/g, '/') + '/01').format('yyyy-MM-dd');
                            dateTo = text.split(reg);
                            date = new Date(dateTo[0], dateTo[1], 0);
                            enddt = date.format('yyyy-MM-dd');
                            var Dtime = {
                                Text: '【' + getDataList[i].OpenDt + '】',
                                StartDate: startdt,
                                EndDate: enddt,
                                TimeOrPeriods: false
                            }
                            indexOf.push(getDataList[i].OpenDt);
                            that.Monthlist.push(Dtime);
                        }
                    }

                } else {
                    text = getDataList[i].OpenDt;
                    startdt = new Date(getDataList[0].OpenDt.replace(/[^\d]/g, '/') + '/01').format('yyyy-MM-dd');
                    dateTo = text.split(reg);
                    date = new Date(dateTo[0], dateTo[1], 0);
                    enddt = date.format('yyyy-MM-dd');
                    var Dtime = {
                        Text: '【' + getDataList[i].OpenDt + '】',
                        StartDate: startdt,
                        EndDate: enddt,
                        TimeOrPeriods: false
                    }
                    indexOf.push(getDataList[i].OpenDt);
                    that.Monthlist.push(Dtime);
                }

            }
            dateFrom = new Date(getDataList[0].OpenDt.replace(/[^\d]/g, '/') + '/01').format('yyyy-MM-dd');//new Date(dateList[0].text.replace(/-/g, '/') + '/01').format('yyyy-MM-dd');
            dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0).format('yyyy-MM-dd');
        } else {
            for (var i = -1; i < 1; i++) {
                dateList.push({ text: Utils.DateHelp.add(date, i, 'month', 'yyyy/MM') });
                var Dttext = Utils.DateHelp.add(date, i, 'month', 'yyyy/MM');
                var startdt = new Date(Dttext + '/01').format('yyyy-MM-dd');
                var enddt = new Date(Dttext.toString().split('/')[0], Dttext.toString().split('/')[1], 0).format('yyyy-MM-dd');
                var Dtime = {
                    Text: '【' + Dttext.toString().replace('/', '年') + '月' + '】',
                    StartDate: startdt,
                    EndDate: enddt,
                    TimeOrPeriods: false
                }
                this.Monthlist.push(Dtime);
            }
            dateFrom = new Date(dateList[0].text.replace(/-/g, '/') + '/01').format('yyyy-MM-dd');
            dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0).format('yyyy-MM-dd');
        }

         return {
            dateFrom: dateFrom,
            dateTo: dateTo
        }
    };
    ContributionList.prototype.GetLevel = function () {
        var
            that = this,
            levels = that.AllLevel(),
            index = 0,
            len = levels && levels.length,
            companyType = that.CompanyType() - 0,
            companyID = that.CompanyID() - 0;
        if (companyType === 0) {
            that.NextName('子公司');
            return;
        }
        if (that.IsMember()) {
            that.NextName('会员');
            return;
        }
        while (len--) {
            if (levels[len].AgentLevel - 0 === that.currentLevel() - 0) {
                that.NextName(levels[len]['LevelName']);
            }
        }
    };
    exports.viewmodel = ContributionList;
});