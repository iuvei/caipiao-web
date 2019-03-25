/// <reference path="../_ref.js" />
define(function (require, exports, module) {
    var MonthReport = function (param) {
        var
            that = this,
            changeColor = function (event) {
                target = $(event.target);
                target.closest('td').find('a').css({ 'color': 'yellow' });
                target.css({ 'color': 'red' });
            },
            param = param || {};
        this.params = param;
        this.allLevel = ko.observableArray();//所有等级
        this.nextLevel = ko.observable();
        this.upper = ko.observable();
        this.current = ko.observable();
        this.date = ko.observable();
        this.dateTo = ko.observable();
        this.periodsNumberFrom = ko.observable();
        this.periodsNumberFromTo = ko.observable();
        this.timeOrPeriods = ko.observable(false);
        this.list = ko.observableArray();
        this.monthInfo = ko.observable('日报表（期数）');
        this.dateList = ko.observableArray();
        this.periodsNumbers = ko.observableArray();
        this.title = ko.observable('期数');
        this.currentPeriods = ko.observable();
        this.top = ko.observable(!param.companyType);
        this.isMember = ko.observable(param.isMember);
        this.IsEndLevel = ko.observable(param.IsEndLevel);//下级管理传过来的值，表示是最后等级
        //this.isDirectMember = ko.observable(!!param.isDirectMember);
        this.parentStatus = ko.observable(false);
        this.isNewSubordinate = ko.observable(param.isNewSubordinate);
        this.total = {
            memberBetTotal: ko.observable(0),
            memberBetAmtTotal: ko.observable(0),
            memWLTotal: ko.observable(0),
            directMemberBetTotal: ko.observable(0),
            directMemberBetAmtTotal: ko.observable(0),
            directMemWLTotal: ko.observable(0),
            downLineBetTotal: ko.observable(0),
            downLineWLTotal: ko.observable(0),
            selfBetAmtTotal: ko.observable(0),
            selfWLTotal: ko.observable(0),
            makeWaterTotal: ko.observable(0),
            selfCommTotal: ko.observable(0),
            uperBetAmtTotal: ko.observable(0),
            uperWLTotal: ko.observable(0)
        };

        this.PeriodsNumber = ko.observable();//期数
        this.isDayReportPeriods = ko.observable(false);
        this.upperName = ko.observable();
        this.upperCompanyID = ko.observable();//上级ID，直属会员需要
        this.IsDirectMember = ko.observable(false);//是否是直属会员

        //this.getCompanyType = ko.observable(Utils.Cookie.get('CompanyType'));
        this.lastAgent = ko.observable(); //是否是最后一层代理
        this.SubSidaryID = ko.observable(param.SubSidaryID);//总公司登录，查看子公司的代理级别时需要(查询代理companyID是传公司ID)
        this.AccountID = ko.observable(Utils.Cookie.get('IsSubAccount') == 'true' ? Utils.Cookie.get('ParentId') : Utils.Cookie.get('AccountID'));
        this.companyID = ko.observable(param.ID || param.AgentID || that.AccountID());
        this.SubCompanyID = ko.observable(param.SubCompanyID||0);
        this.companyType = ko.observable(param.CompanyType || Utils.Cookie.get('CompanyType'));
        this.isAgent = ko.observable();
        this.currentLevel = ko.observable(param.agentLevel != undefined ? param.agentLevel : (Utils.Cookie.get('AgentLevel') ? Utils.Cookie.get('AgentLevel') : -1));//取到返回之后的等级
        this.levelStatus = ko.observable(this.currentLevel());
        this.isScreeningdateList = ko.observable(false);//是否刷新期数月份：2016年04月

        this.isSubAcc = ko.observable(Utils.Cookie.get('IsSubAccount') === 'true' ? true : false); //表示是否是子帐号 
        this.isChildShowReport = ko.observable(Utils.Cookie.get('IsChildShowReport') === 'true' ? true : false); //是否查看下级报表
        this.isLook = ko.observable(this.isChildShowReport() == false ? false : true); //IsChildShowReport为 false 不可以看下级报表。其它全部可以看

        this.queryFormDate = function (data, event) {

            var firstDate = new Date(data.text.replace(/-/g, '/') + '/01'),
                lastDate = new Date(data.text.split('-')[0], data.text.split('-')[1], 0);
            that.date(firstDate.format('yyyy-MM-dd')).dateTo(lastDate.format('yyyy-MM-dd')).timeOrPeriods(false);
            that.clearTotal();
            that.params.queryDate = null;
            that.canPeriodsNumberChange = false;
            that.getPeriodsNumber(function (data) {
                that.getData();
            });
            changeColor(event);
        };
        /////
        this.history = param.history || [];
        that.historyParams = {};
        that.isBack = ko.observable(this.history.length>0);
        this.goBack = function (data) {
            var
                levels = that.allLevel,
                hst = that.history.pop();
            //that.level(that.level() - 1);
            if (!that.history.length) {
                that.isBack(false);
            }
            //for (var i in hst) {
            //    that[i] && that[i](hst[i]);
            //}
            that.companyID(hst.companyID);
            that.companyType(hst.companyType);
            that.PeriodsNumber(hst.PeriodsNumber);
            that.levelStatus(hst.levelStatus);
            that.isDayReportPeriods(hst.isDayReportPeriods);
            that.isMember(hst.isMember);
            that.IsDirectMember(hst.IsDirectMember);

            that.isMember(false).IsDirectMember(false);
            that.getData();
            that.getLevel();
        }
        /////

        this.isqueryAll = ko.observable(false);
        this.queryAll = function (data, event) {
            if (that.companyType() == 2) {
                that.isqueryAll(true);
                that.isScreeningdateList(true);
                var taList = that.dateList();
                var reg = /[^\d]/,
                       text = taList[0].text;
                var len = text.length - 0;
                text = text.substring(0, len - 1);
                that.date(text.replace(reg, '-') + '-01');

                var dateTotext = taList[(taList.length - 1)].text;//data[(data.length - 1)].OpenDt;
                dateTo = dateTotext.split(reg);
                date = new Date(dateTo[0], dateTo[1], 0);
                that.dateTo(date.format('yyyy-MM-dd'));
            } else {
                that.date(that.M.dateTemp.from).dateTo(that.M.dateTemp.to);
            }

            that.getPeriodsNumber(function (data) {
                that.getData();
            });
            that.clearTotal();
            changeColor(event);
        };
        ///打印
        this.Print = function () {
            window.print();
        };
        if (that.params.backParams) {
            for (var i in that.params.backParams) {
                if ($.isFunction(that[i])) {
                    that[i](that.params.backParams[i]);
                }
                else {
                    that[i] = that.params.backParams[i];
                }
            }
        }
        if (this.companyType() == 2) {
            this.init();
            this.getPeriodsNumber(function (data) {
                that.getData();
            });
        } else {
            this.init();
        }
        //this.init();
        this.canPeriodsNumberChange = false;
        this.periodsNumberFrom.subscribe(function (newValue) {
            if (!that.canPeriodsNumberChange) return;
            that.timeOrPeriods(true).getData();
        })
        this.periodsNumberFromTo.subscribe(function (newValue) {
            if (!that.canPeriodsNumberChange) return;
            that.timeOrPeriods(true).getData();
        })
    };
    MonthReport.fn = MonthReport.prototype = {
        constructor: MonthReport,
        M: MonthReport,
        init: function (getDataList) {
            ///将中文转换成对应的ID
            var
                that = this,
                dateFrom,
                dateTo,
                /**
                *@property date  生成当前和前两个月的默认日期,setDate会设置为1号然后循环生成。
                */
                date = new Date();
            date.setDate(1);
            for (var i = -2; i < 1; i++) {
                this.dateList().push({ text: Utils.DateHelp.add(date, i, 'month', 'yyyy-MM') });
            }
            dateFrom = new Date((Utils.DateHelp.add(date, 0, 'month', 'yyyy-MM') + '/01').replace(/-/g, '/')).format('yyyy-MM-dd');

            dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0).format('yyyy-MM-dd');
            if (this.params.queryDate != null && this.params.queryDate != '全部') {
                //如果是日报表跳转过来,需要根据参数查询
                date = new Date(this.params.queryDate.replace(/-/g, '/') + '/01');
                this.date(date.format('yyyy-MM-dd')).dateTo(new Date(date.getFullYear(), date.getMonth() + 1, 0).format('yyyy-MM-dd'));
                setTimeout(function () {
                    var
                        mountInfor = $('.mount-infor');
                    mountInfor.find('a').css({ color: 'yellow' });
                    mountInfor.find('a:contains(' + that.params.queryDate + ')').css({ color: 'red' });
                }, 0);
            }
            else {//取得前三个月之间的边界,如: 07-01 —— 09-30
                 this.date(dateFrom).dateTo(dateTo);
            }
            //缓存时间的边界
            this.M.dateTemp.from = dateFrom;
            this.M.dateTemp.to = dateTo;
            if (that.companyType() != 2) {
                this.getPeriodsNumber(function (data) {
                    that.getData();
                });
            }
        },
        getPeriodsNumber: function (callback) {
            var
                that = this,
                queryPeriod = $('.query-period'),
                CompanyID = that.companyID();
            if (Utils.Cookie.get('CompanyType') - 0 == 0) {
                if (this.isNewSubordinate() == true) {
                    CompanyID = this.SubCompanyID();
                }
               else if (this.isMember() == true) {
                    //that.companyID(this.SubSidaryID());
                    CompanyID = this.SubSidaryID();
                }
            }
            var screeningMonth=-1,
                da1 = new Date().format('yyyy-MM-dd 00:00'),
                da2 = new Date().format('yyyy-MM-dd 00:00');
            if (that.companyType() == 2)// || Utils.Cookie.get('IsAgentCompanyType') - 0 == 2)
            {
                if (that.isqueryAll() == false) {//如果是‘全部’，显示全部的期数和月份
                    screeningMonth = that.date();
                }
            }
           da1 = that.date();
           da2 = that.dateTo();
           if (that.date() == "NaN-aN-aN" || that.date()==undefined) {
                da1 = new Date().format('yyyy-MM-dd 00:00'),
                da2 = new Date().format('yyyy-MM-dd 00:00');
            }
           $.get('/index.php/portal/agent/GetMothRortDay', {
                beginDate: da1,
                endDate: da2,
                _: +new Date()
           }, function (data) {
               var data = data.datelst;
                if (data.length == 0) {
                    that.list.removeAll();
                    return false;
                }
                that.clearTotal();

                if (!$.isArray(data) || !data.length) {
                    that.list.removeAll();
                    //queryPeriod.off('change');
                    that.canPeriodsNumberChange = false;
                    that.periodsNumbers.removeAll();
                    that.getLevel(that.allLevel());
                    return;
                }

                that.periodsNumbers(data.reverse());
                that.periodsNumberFrom(data[0]['PeriodsNumber']).periodsNumberFromTo(data[data.length - 1]['PeriodsNumber']);

                that.canPeriodsNumberChange = true;

                callback && callback.call(that);

            });
        },
        getData: function () {
            var that = this;
            var start = '' + that.periodsNumberFrom();
            start = start.substr(0, 4) + "/" + start.substr(4, 2) + "/" + start.substr(6,2);
            var end = '' + that.periodsNumberFromTo();
            end = end.substr(0, 4) + "/" + end.substr(4, 2) + "/" + end.substr(6,2);
            var params = {
                    Lottery: 1,
                    Date: start, //that.date(),
                    DateTo: end,//that.dateTo(),
                    PeriodsNumberFrom: that.periodsNumberFrom(),
                    PeriodsNumberTo: that.periodsNumberFromTo()
                },
                temp;
            //if (that.params.backParams) {
            //    for (var i in that.params.backParams) {
            //        if ($.isFunction(that[i])) {
            //            that[i](that.params.backParams[i]);
            //        }
            //        else {
            //            that[i] = that.params.backParams[i];
            //        }
            //    }
            //}
            params.TimeOrPeriods = that.timeOrPeriods();
            params.CompanyID = that.companyID();
            params.LevelStatus = that.levelStatus();
            params.CompanyType = that.companyType();
            params.SubSidaryID = that.SubSidaryID();
            params.isMember = that.isMember();
            params.isNewSubordinate = that.isNewSubordinate();
            params.IsDirectMember = that.IsDirectMember();//是否是直属会员

            //如果开始期数小于结束期数，两者交换
            if (params.PeriodsNumberFrom > params.PeriodsNumberTo) {
                temp = params.PeriodsNumberFrom;
                params.PeriodsNumberFrom = params.PeriodsNumberTo;
                params.PeriodsNumberTo = temp;
            }
            params._ = new Date() - 0;
            that.list.removeAll();
            var load = Utils.loading({ delayTime: 5000 });
            var url = "/index.php/portal/agent/ReportForDailyPeriods";
            if (that.isDayReportPeriods()) {
                url = "/index.php/portal/agent/GetReportList";
                params.PeriodsNumber = that.PeriodsNumber();
            }
            $.get(url, params, function (data) {
                load.cancel();
                that.clearTotal();
                that.historyParams = {
                    companyID: that.companyID(),
                    companyType: that.companyType(),
                    PeriodsNumber: that.PeriodsNumber() ? that.PeriodsNumber() : "",
                    levelStatus: that.levelStatus(),
                    isMember: false,
                    IsDirectMember: false,
                    isDayReportPeriods: that.isDayReportPeriods()
                };
                if ($.isArray(data) && data.length) {
                    that.totalData(data);
                    that.list(data);
                }

                that.getAllLeves(true, true);
                if (that.isDayReportPeriods()) {
                    var level = data[(data.length - 0) - 1].LevelStatus - 0;
                    that.isMember(level-0==-1?true:false);
                    that.upperName(level == 1 ? '公司' : level == 2 ? '公司' : level == 3 ? '大股东' : level == 4 ? '股东': level == 5 ? '总代理' : '代理');
                    that.title(level == 1 ? '公司' : level == 2 ? '大股东' : level == 3 ? '股东' : level == 4 ? '总代理': level == 5 ? '代理' : '会员');//-1：不是大股东 ； 0：大股东； 1：大股东； 2：总代理； 3：代理

                }
            });
        },
        /*月报表下级跳转*/
        goToAgent: function (data, event) {

            if ($.cache.levelCache.length >0&& $.cache.levelCache[$.cache.levelCache.length - 1].AgentLevel === data.levelStatus() - 0) {
                return;
            }
            data.IsEndLevel = this.IsEndLevel;
            framework.view("/Report/DownlineAgent", "Report/DownlineAgent", data);
        },
        totalData: function (list) {
            var that = this,
                memberBetTotal = 0,
                memberBetAmtTotal = 0,
                memWLTotal = 0,
                directMemberBetTotal = 0,
                directMemberBetAmtTotal = 0,
                directMemWLTotal = 0,
                downLineBetTotal = 0,
                downLineWLTotal = 0,
                selfBetAmtTotal = 0,
                selfWLTotal = 0,
                makeWaterTotal = 0,
                selfCommTotal = 0,
                uperBetAmtTotal = 0,
                uperWLTotal = 0;
            $.each(list, function (index, value) {
                memberBetTotal += (value.MemberBetCount = (value.MemberBetCount||0).toFixed(2) - 0);
                memberBetAmtTotal += (value.MemBetAmt = (value.MemBetAmt||0).toFixed(2) - 0);
                memWLTotal += (value.MemWL = (value.MemWL||0).toFixed(2) - 0);
               // directMemberBetTotal += (value.DirectMemBetCount = value.DirectMemBetCount.toFixed(2) - 0);
               // directMemberBetAmtTotal += (value.DirectMemBetAmt = value.DirectMemBetAmt.toFixed(2) - 0);
               // directMemWLTotal += (value.DirectMemWL = value.DirectMemWL.toFixed(2) - 0);
                downLineBetTotal += (value.DownLineBetAmt = (value.DownLineBetAmt||0).toFixed(2) - 0);
                downLineWLTotal += (value.DownLineWL = (value.DownLineWL||0).toFixed(2) - 0);
                selfBetAmtTotal += (value.SelfBetAmt = (value.SelfBetAmt||0).toFixed(2) - 0);
                selfWLTotal += (value.SelfWL = (value.SelfWL||0).toFixed(2) - 0);
                makeWaterTotal += (value.SelfComm = (value.SelfComm||0).toFixed(2) - 0);
                selfCommTotal += (value.SelfWLTotal = (value.SelfWLTotal||0).toFixed(2) - 0);
                uperBetAmtTotal += (value.UperBetAmt = (value.UperBetAmt||0).toFixed(2) - 0);
                uperWLTotal += (value.UperWL = (value.UperWL||0).toFixed(2) - 0);
            });
            that.total
                .memberBetTotal(memberBetTotal.toFixed(2) - 0)
                .memberBetAmtTotal(Utils.rounding(memberBetAmtTotal) - 0)
                .memWLTotal(Utils.rounding(memWLTotal) - 0)
                .directMemberBetTotal(directMemberBetTotal.toFixed(2) - 0)
                .directMemberBetAmtTotal(Utils.rounding(directMemberBetAmtTotal) - 0)
                .directMemWLTotal(Utils.rounding(directMemWLTotal) - 0)
                .downLineBetTotal(Utils.rounding(downLineBetTotal) - 0)
                .downLineWLTotal(Utils.rounding(downLineWLTotal) - 0)
                .selfBetAmtTotal(Utils.rounding(selfBetAmtTotal) - 0)
                .selfWLTotal(Utils.rounding(selfWLTotal) - 0)
                .makeWaterTotal(Utils.rounding(makeWaterTotal) - 0)
                .selfCommTotal(Utils.rounding(selfCommTotal) - 0)
                .uperBetAmtTotal(Utils.rounding(uperBetAmtTotal) - 0)
                .uperWLTotal(Utils.rounding(uperWLTotal) - 0);
        },
        clearTotal: function () {
            for (var i in this.total) {
                this.total[i](0);
            }
        },
        toGross: function ($data) {
            if (!$data) return;
            var that = this;
            //跳转到日报后,从日报返回需要的参数
            var backParams = {
                date: this.date(),
                dateTo: this.dateTo(),
                isMember: true,
                PeriodsNumber: that.PeriodsNumber(),
                periodsNumberFrom: this.periodsNumberFrom(),
                periodsNumberFromTo: this.periodsNumberFromTo(),
                //periodsTime: this.periodsTime(),
                currentLevel: this.currentLevel(),
                timeOrPeriods: this.timeOrPeriods(),
                companyID: this.companyID(),
                companyType: this.companyType(),
                levelStatus: this.levelStatus(),
                SubSidaryID: this.SubSidaryID(),
                isNewSubordinate: this.isNewSubordinate(),
                IsDirectMember: this.IsDirectMember(),
                isDayReportPeriods: that.isDayReportPeriods()
            };
            var params = {
                loginName: $data.LoginName,
                periodsNumber: that.PeriodsNumber(),
                //firstcheck: false,
                memberId: $data.CompanyID,
                companyID: that.companyID(),
                companyType: that.companyType(),
                levelStatus: that.parentStatus(),
                history: that.history,
                PeriodsNumber: that.PeriodsNumber(),
                isMember: true,
                //isDirectMember: that.isDirectMember(),
                //isMonthReport: that.isMonthReport(),
                anchor: 'dayReport',    //锚点
                //queryDate: that.queryDate(),
                isBack: that.isBack(),
                currentLevel: that.currentLevel(),
                backParams: backParams,
                dateList: that.dateList(),
                //IsDirectMember: this.IsDirectMember()
                //parentLevel: that.parentLevel(),
                //isSubAccount: that.isSubAccount()//,
                //parBackParams: that.params.parBackParams ? that.params.parBackParams : null
            };
            if (!that.IsDirectMember()) {
                var tt = that.history[that.history.length - 1];
                for (var i in tt) {
                    backParams[i] = tt[i];
                }
                backParams.isMember = true;
            }
            framework.view("/index.php/portal/agent/Gross", "Gross/Index", params);
        },
        next: function (data, event) {
            //, isDirectMember
            //if (typeof event === 'boolean') {
            //    var
            //        temp = event;
            //    event = isDirectMember;
            //    isDirectMember = event;
            //};

            this.history.push(this.historyParams);
            this.isBack(true);

            this.upperCompanyID(data.LoginName == null ? this.upperCompanyID() : data.CompanyID);
            if (this.isDayReportPeriods()) {
                if (data.LoginName == null) {
                    this.IsDirectMember(true);
                }
                if (this.isMember()) {
                    //framework.view("/Gross/Index", "Gross/Index", { PeriodsNumber: this.PeriodsNumber() });
                    this.toGross(data);
                    return false;
                }
                this.companyID(this.IsDirectMember() ? this.upperCompanyID (): data.CompanyID);
                this.levelStatus(data.LevelStatus);
                this.companyType(data.CompanyType);

            } else {
                if (this.companyType() - 0 == 2) {
                    this.upperCompanyID(this.companyID());
                }
                this.PeriodsNumber(data.PeriodsNumber);
                this.isDayReportPeriods(true);
            }
            this.getData();
        },
        //getNext: function (params) {
        //    var that = this;
        //    params['Date'] = new Date().getFullYear() + '-' + that.M.periodsTime
        //    params['PeriodsNumber'] = that.currentPeriods()
        //    params['TimeOrPeriods'] = true;
        //    $.ajax({
        //        url: "/Report/GetReportList",
        //        cache: false,
        //        data: params,
        //        success: function (data) {
        //            that.clearTotal();
        //            that.totalData(data);
        //            that.list(data);
        //            that.top(false);
        //            that.getAllLeves(params, false);
        //        }
        //    })
        //},
        getAllLeves: function (data, isInit) {
            var
                 that = this,
                 companyID = that.SubSidaryID() || that.companyID();
            //先获取所有等级
            if (!($.cache.levelCache && $.cache.levelCache.length > 0)) {
                $.ajax({
                    url: '/index.php/portal/agent/GetAgentLevelByID',
                    data: { CompanyID: companyID },
                    cache: false
                }).done(function (data) {
                    if (data.length) {
                        that.lastAgent(data.length - 1 == that.currentLevel());
                    }
                    that.allLevel($.cache.levelCache = data);
                    that.getLevel(data, isInit);
                });
            }
            else {
                that.allLevel($.cache.levelCache);
                that.lastAgent(that.params.lastAgent != null ? that.params.lastAgent : that.allLevel().length - 1 == that.currentLevel());
                that.getLevel(data, isInit);
            }
        },
        getLevel: function (params, isInit) {
            var
                that = this,
                levels = $.cache.levelCache,
                index = 0,
                len = levels.length,
                currentLevel = (this.levelStatus() || Utils.Cookie.get('AgentLevel')) - 0,
                companyType = this.companyType() - 0;
            if (that.IsDirectMember()) {
                currentLevel = that.parentStatus();
            }
            if (companyType === 0 && currentLevel === -1) {
                this.nextLevel('大股东').current('公司').upper('公司');
            }
            else if (companyType === 1 && currentLevel === -1) {
                that.nextLevel(levels[2]['LevelName']).current('大股东').upper('公司');
            }
            else {
                ///不等于0表示非公司和非子公司,所以当前的ID-1则能得到上一级的。
                ///等级有包含关系: companyType={0:'总公司',1:'子公司',2:'代理'},companyType包含currentLevel
                ///如果是子公司:currentLevel=-1;
                ///如果是代理:currentLevel可能是0,1,2,3                getLevel
                while (len--) {
                    if (levels[len].AgentLevel === currentLevel) {
                        index = len;
                    }
                }
                //代理的最后一级
                if (currentLevel === levels[levels.length - 1].AgentLevel || that.isMember()) {
                    index = levels.length - 1;
                    this.upper(levels[index - 1]['LevelName']).nextLevel('会员').current(levels[index]['LevelName']);
                }
                else {
                    //如果是0，即上级为子公司
                    if (currentLevel === 0) {
                        this.upper('大股东').nextLevel(levels[index + 1]['LevelName']).current(levels[index]['LevelName']);
                    }
                    else {
                        this.upper(levels[index - 1] ? levels[index - 1]['LevelName'] : that.upperName()).nextLevel(levels[index + 1]['LevelName']).current(levels[index]['LevelName']);
                    }
                }

            }
            if (that.IsDirectMember()) {
                that.title('直属会员').isMember(true);
            }
            if (!isInit) {
                this.title(this.nextLevel());
            }
            else {
                this.title('期数');
            }

        },
        clearTotal: function () {
            for (var i in this.total) {
                if (this.total.hasOwnProperty(i)) {
                    this.total[i](0);
                }
            }
        }
    };
    /**
    *作为全局变量或局部缓存的扩展
    */
    $.extend(MonthReport, {
        dateTemp: {
            from: null, to: null
        },
        periodsTime: null,
        initStatus: {} //记录初始状态
    });
    exports.done = function () {
        var
              guide_right = $('.guide_right a');
        //guide_right.css({ color: 'black' });
        //guide_right.eq(1).css({ color: 'red' });
        //guide_right.filter("[href*='DayReportPeriods']").css({ color: 'red' });
        guide_right.removeClass("menuon").filter("[href*='DayReportPeriods']").addClass("menuon");
    };
    exports.viewmodel = MonthReport;
});