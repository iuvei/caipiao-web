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
        this.monthInfo = ko.observable('月报表');
        this.dateList = ko.observableArray();
        this.periodsNumber = ko.observableArray();
        this.title = ko.observable('日期');
        this.currentPeriods = ko.observable();
        this.top = ko.observable(!param.companyType);
        this.isMember = ko.observable(param.isMember || false);
        this.IsEndLevel = ko.observable(param.IsEndLevel);//下级管理传过来的值，表示是最后等级
        this.isDirectMember = ko.observable(!!param.isDirectMember);

        this.queryDate = ko.observable(that.params.queryDate || '');
        this.isSubAccount = ko.observable(that.params.isSubAccount != null ? that.params.isSubAccount : Utils.Cookie.get('IsSubAccount'));
        this.parentLevel = ko.observable(that.params.parentLevel); //从月报表跳转过来的等级名称

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

        this.isBack = ko.observable(param.isBack);//this.getCompanyType = ko.observable(Utils.Cookie.get('CompanyType'));
        this.level = ko.observable(1);///1:子公司  2:大股东  3:大股东  4:总代理 5:代理 6:会员
        this.periodsTime = ko.observable(param.periodsTime);
        this.isDirecet = ko.observable(param.isDirecet);//表示是否是直属会员

        this.isSubAcc = ko.observable(Utils.Cookie.get('IsSubAccount') === 'true' ? true : false); //表示是否是子帐号 
        this.isChildShowReport = ko.observable(Utils.Cookie.get('IsChildShowReport') === 'true' ? true : false); //是否查看下级报表 
        this.isLook = ko.observable(this.isChildShowReport() == false ? false : true); //IsChildShowReport为 false 不可以看下级报表。其它全部可以看

        this.isMonthReport = ko.observable(param.isMonthReport);//表示是月报跳转过来
        this.nextLeveName = ko.observable();

        /*代理级别子账号需要*****/
        this.AgentLevel = ko.observable(Utils.Cookie.get('AgentLevel') || -1);

        /**直属会员参数*********************/
        this.IsDirectID = ko.observable();
        this.IsDirectType = ko.observable();
        this.IsDirectLevel = ko.observable();
        this.isDayReport = ko.observable(param.isDayReport || false);

        this.lastAgent = ko.observable(); //是否是最后一层代理
        this.SubSidaryID = ko.observable(param.SubSidaryID);//总公司登录，查看子公司的代理级别时需要(查询代理companyID是传公司ID)
        this.companyID = ko.observable(param.companyID || Utils.Cookie.get('AccountID'));
        this.SubCompanyID = ko.observable(param.SubCompanyID || 0);
        this.companyType = ko.observable(param.companyType || Utils.Cookie.get('CompanyType'));
        this.isAgent = ko.observable();
        this.currentLevel = ko.observable(param.agentLevel != undefined ? param.agentLevel : (Utils.Cookie.get('AgentLevel') ? Utils.Cookie.get('AgentLevel') : -1));//取到返回之后的等级
        this.levelStatus = ko.observable(that.isNewSubordinate() ? param.levelStatus : this.currentLevel());
        this.isScreeningdateList = ko.observable(false);//是否刷新期数月份：2016年04月
        this.queryFormDate = function (data, event) {
            if (that.companyType() == 2) {
                that.isScreeningdateList(true);
                var reg = /[^\d]/,
                    daval = data.text.replace(/[^\d]/, '-'),
                    len = daval.length - 0,
                    daval = daval.substring(0, len - 1),
                    firstDate = daval + '-01';
                dateTo = firstDate.split(reg);
                date = new Date(dateTo[0], dateTo[1], 0);
                lastDate = date.format('yyyy-MM-dd');

                that.date(firstDate).dateTo(lastDate).timeOrPeriods(false);
            } else {
                var firstDate = new Date(data.text.replace(/-/g, '/') + '/01'),
                lastDate = new Date(data.text.split('-')[0], data.text.split('-')[1], 0);
                that.date(firstDate.format('yyyy-MM-dd')).dateTo(lastDate.format('yyyy-MM-dd')).timeOrPeriods(false);
            }
            that.clearTotal();
            that.params.queryDate = null;
            //that.getPeriodsNumber(function (data) {
            that.getData();
            //});
            changeColor(event);
        };
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

            //that.getPeriodsNumber(function (data) {
            that.getData();
            //});
            that.clearTotal();
            changeColor(event);
        };
        ///返回
        this.goBack = function (data) {
            var
                levels = that.allLevel,
                history = that.history.pop();
            if (history == null) { //如果为null但是能点击返回,说明是月报表跳转过来的。
                framework.view('/index.php/portal/agent/MonthReport', 'Report/MonthReport', { backParams: param.parBackParams });
                return;
            }
            that.level(that.level());
            if (!that.history.length && !param.parBackParams) {
                that.isBack(false);
            }
            for (var i in history) {
                that[i] && that[i](history[i]);
            }
            that.isMember(false).isDirectMember(false);
            that.getData();
            that.getLevel();
        }
        ///打印
        this.Print = function () {
            window.print();
        };
        this.history = param.history || [];
        that.historyParams = {};
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
            //this.getPeriodsNumber(function (data) {
            that.getData();
            // });
        } else {
            this.init();
        }

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
            if (that.companyType() == 2) {
                var len = this.dateList()[0].text.replace(/[^\d]/, '/').length - 0;
                //this.dateList()[0].text = this.dateList()[0].text.substring(0, len - 1);
                dateFrom = new Date(this.dateList()[0].text.replace("年", "/").replace("月", "/") + '01').format('yyyy-MM-dd');

            } else {
                for (var i = -2; i < 1; i++) {
                    this.dateList().push({ text: Utils.DateHelp.add(date, i, 'month', 'yyyy-MM') });
                }
                dateFrom = new Date((this.dateList()[0].text + '/01').replace(/-/g, '/')).format('yyyy-MM-dd');
            }


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
                //this.getPeriodsNumber(function (data) {
                that.getData();
                //});
            }
        },

        getData: function ($data) {
            var that = this,
                params = {
                    Lottery: 1,
                    Date: that.date(),
                    DateTo: that.dateTo(),
                    PeriodsNumberFrom: that.periodsNumberFrom(),
                    PeriodsNumberTo: that.periodsNumberFromTo()
                },
                temp;
            params.isMonthReport = that.isMonthReport();//表示是月表跳转过来
            params.TimeOrPeriods = that.timeOrPeriods();
            params.CompanyID = that.companyID();
            params.LevelStatus = that.levelStatus();
            params.CompanyType = that.companyType();
            params.SubSidaryID = that.SubSidaryID();
            params.isMember = that.isMember();
            params.isNewSubordinate = that.isNewSubordinate();
            params.Date = that.isBack() ? that.periodsTime() : new Date().format('yyyy-MM-dd');
            params.IsDirectMember = that.isDirecet() ? true : that.isDirectMember();
            params.isDayReport = that.isDayReport();
            params.AgentLevel = that.AgentLevel();

            //下级管理-->（代理）月报表（代理有直属会员）
            that.IsDirectID(that.companyID()).IsDirectType(that.companyType()).IsDirectLevel(that.levelStatus());

            //如果开始期数小于结束期数，两者交换
            if (params.PeriodsNumberFrom > params.PeriodsNumberTo) {
                temp = params.PeriodsNumberFrom;
                params.PeriodsNumberFrom = params.PeriodsNumberTo;
                params.PeriodsNumberTo = temp;
            }
            params._ = new Date() - 0;
            that.list.removeAll();
            var load = Utils.loading({ delayTime: 5000 });
            $.get('/index.php/portal/agent/ReportForDailyAll', params, function (data) {
                load.cancel();
                that.clearTotal();
                that.historyParams = {
                    companyID: that.companyID(),
                    companyType: that.companyType(),
                    periodsNumber: that.periodsNumber(),
                    levelStatus: that.levelStatus(),
                    isMember: false,
                    isDirectMember: false
                };
                if ($.isArray(data) && data.length) {
                    that.totalData(data);
                    console.log(data);
                    var level = data[(data.length - 0) - 1].LevelStatus - 0;
                    that.nextLeveName(level == 1 ? '公司' : level == 2 ? '大股东' : level == 3 ? '股东' : level == 4 ? '总代理': level == 5 ? '代理'  : '会员');//-1：不是大股东 ； 0：大股东； 1：大股东； 2：总代理； 3：代理
                    that.list(data);
                }
                that.getAllLeves(true, true, $data);
            });
        },
        /*月报表下级跳转*/
        goToAgent: function (data, event) {

            if ($.cache.levelCache.length > 0 && $.cache.levelCache[$.cache.levelCache.length - 1].AgentLevel === data.levelStatus() - 0) {
                return;
            }
            data.IsEndLevel = this.IsEndLevel;
            framework.view("/index.php/portal/agent/DownlineAgent", "Report/DownlineAgent", data);
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
                memberBetTotal += (value.MemberBetCount = (value.MemberBetCount || 0).toFixed(2) - 0);
                memberBetAmtTotal += (value.MemBetAmt = (value.MemBetAmt || 0).toFixed(2) - 0);
                memWLTotal += (value.MemWL = (value.MemWL || 0).toFixed(2) - 0);
                /*directMemberBetTotal += (value.DirectMemBetCount = value.DirectMemBetCount.toFixed(2) - 0);
                directMemberBetAmtTotal += (value.DirectMemBetAmt = value.DirectMemBetAmt.toFixed(2) - 0);
                directMemWLTotal += (value.DirectMemWL = value.DirectMemWL.toFixed(2) - 0);*/
                downLineBetTotal += (value.DownLineBetAmt = (value.DownLineBetAmt || 0).toFixed(2) - 0);
                downLineWLTotal += (value.DownLineWL = (value.DownLineWL || 0).toFixed(2) - 0);
                selfBetAmtTotal += (value.SelfBetAmt = (value.SelfBetAmt || 0).toFixed(2) - 0);
                selfWLTotal += (value.SelfWL = (value.SelfWL || 0).toFixed(2) - 0);
                makeWaterTotal += (value.SelfComm = (value.SelfComm || 0).toFixed(2) - 0);
                selfCommTotal += (value.SelfWLTotal = (value.SelfWLTotal || 0).toFixed(2) - 0);
                uperBetAmtTotal += (value.UperBetAmt = (value.UperBetAmt || 0).toFixed(2) - 0);
                uperWLTotal += (value.UperWL = (value.UperWL || 0).toFixed(2) - 0);
            });
            that.total
                .memberBetTotal(memberBetTotal.toFixed(2) - 0)
                .memberBetAmtTotal(Utils.rounding(memberBetAmtTotal) - 0)
                .memWLTotal(Utils.rounding(memWLTotal) - 0)
               /* .directMemberBetTotal(directMemberBetTotal.toFixed(2) - 0)
                .directMemberBetAmtTotal(Utils.rounding(directMemberBetAmtTotal) - 0)
                .directMemWLTotal(Utils.rounding(directMemWLTotal) - 0)*/
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
                periodsNumberFrom: this.periodsNumberFrom(),
                periodsNumberFromTo: this.periodsNumberFromTo(),
                periodsTime: this.periodsTime(),
                currentLevel: this.currentLevel(),
                timeOrPeriods: this.timeOrPeriods(),
                companyID: this.companyID(),
                companyType: this.companyType(),
                levelStatus: this.levelStatus(),
                SubSidaryID: this.SubSidaryID(),
                isNewSubordinate: this.isNewSubordinate()
            };
            var params = {
                loginName: $data.LoginName,
                //periodsNumber: that.periodsNumber(),
                firstcheck: false,
                memberId: $data.CompanyID,
                companyID: that.companyID(),
                companyType: that.companyType(),
                levelStatus: that.parentStatus(),
                history: that.history,
                isMember: true,
                isDirectMember: that.isDirectMember(),
                isMonthReport: that.isMonthReport(),
                anchor: 'day',    //锚点
                queryDate: that.queryDate(),
                isBack: that.isBack(),
                currentLevel: that.currentLevel(),
                backParams: backParams,
                dateList: that.dateList(),
                parentLevel: that.parentLevel(),
                isSubAccount: that.isSubAccount(),
                parBackParams: that.params.parBackParams ? that.params.parBackParams : null,
                periodsTime: this.periodsTime(),
                ZCompanyID: this.SubSidaryID() || 0,//总公司查询总货明细需要
                isDayReport: that.isDayReport()
            };
            if (!that.isDirectMember()) {
                var tt = that.history[that.history.length - 1];
                for (var i in tt) {
                    backParams[i] = tt[i];
                }
                backParams.isMember = true;
            }
            framework.view("/index.php/portal/agent/Gross", "Gross/Index", params);
        },
        next: function (data, event, isDirectMember) {
            var that = this;
            if (typeof event === 'boolean') {
                var
                    temp = event;
                event = isDirectMember;
                isDirectMember = event;
            };
            if (!this.isDirectMember() && this.isMember()) {
                return false;
            }
            that.history.push(that.historyParams);
            if (this.isDirectMember() || data.AgentLevel - 0 == -2 && data.CompanyID - 0 != 0) {
                //framework.view("/Gross/Index", "Gross/Index");
                that.toGross(data);
                return;
            }
            that.IsDirectID(data.CompanyID > 0 ? data.CompanyID : that.IsDirectID());
            that.IsDirectType(data.CompanyID > 0 ? data.CompanyType : that.IsDirectType());
            that.IsDirectLevel(data.CompanyID > 0 ? data.LevelStatus : that.IsDirectLevel());


            that.isDirectMember(data.CompanyID - 0 == 0 && data.AgentLevel - 0 == -2 ? true : false);
            that.companyID(that.isDirectMember() ? that.IsDirectID() : data.CompanyID);
            that.companyType(that.isDirectMember() ? that.IsDirectType() : data.CompanyType); //(data.CompanyType);
            that.currentLevel(that.isDirectMember() ? that.IsDirectLevel() : data.LevelStatus); //(data.LevelStatus);
            that.levelStatus(that.isDirectMember() ? that.IsDirectLevel() : data.LevelStatus); //(data.LevelStatus);

            that.isDayReport(true);//表示“级别”
            that.isBack(true);
            // that.parBackParams(this.params.backParams ? this.params : null);
            that.getData(data);
            /* framework.view('/Report/Index', 'Report/Index', {
                // periodsNumber: data.PeriodsNumber,
                 companyID: data.CompanyID,
                 CompanyType: data.CompanyType,
                 agentLevel: data.LevelStatus,
                // dateList: this.dateList(),
                // parentLevel: this.nextLevel(),
                // queryDate: data.PeriodsTime.replace(/-\d+$/, ''),
                 isDirectMember: isDirectMember || this.isDirectMember(),
                 isBack: true,
                 parBackParams:this.params.backParams?this.params:null,
                // isNewSubordinate: this.isNewSubordinate(),
                 //跳转到日报后,从日报返回需要的参数
                 backParams: {
                     date: this.date(),
                     dateTo: this.dateTo(),
                     isMember: this.isMember(),
                     periodsNumberFrom: this.periodsNumberFrom(),
                     periodsNumberFromTo: this.periodsNumberFromTo(),
                     currentLevel: this.currentLevel(),
                     timeOrPeriods: this.timeOrPeriods(),
                     companyID: this.companyID(),
                     companyType: this.companyType(),
                     levelStatus: this.levelStatus(),
                     SubSidaryID: this.SubSidaryID(),
                     isNewSubordinate: this.isNewSubordinate()
                 }
             });*/
        },
        getNext: function (params) {
            var that = this;
            params['Date'] = new Date().getFullYear() + '-' + that.M.periodsTime
            params['PeriodsNumber'] = that.currentPeriods()
            params['TimeOrPeriods'] = true;
            $.ajax({
                url: "/index.php/portal/agent/GetReportList",
                cache: false,
                data: params,
                success: function (data) {
                    that.clearTotal();
                    that.totalData(data);
                    that.list(data);
                    that.top(false);
                    that.getAllLeves(params, false);
                }
            })
        },
        getAllLeves: function (data, isInit, $data) {
            var
                 that = this,
                 companyID = that.SubSidaryID() || that.companyID();
            //先获取所有等级
            if (1) {//!($.cache.levelCache && $.cache.levelCache.length > 0)
                $.ajax({
                    url: '/index.php/portal/agent/GetAgentLevelByID',
                    data: { CompanyID: companyID },
                    cache: false
                }).done(function (data) {
                    if (data.length) {
                        that.lastAgent(data.length  == that.currentLevel());
                    }
                    that.allLevel($.cache.levelCache = data);
                    that.getLevel(data, isInit, $data);
                });
            }
            else {
                that.allLevel($.cache.levelCache);
                that.lastAgent(that.params.lastAgent != null ? that.params.lastAgent : that.allLevel().length  == that.currentLevel());
                that.getLevel(data, isInit, $data);
            }
        },
        getLevel: function (params, isInit, $data) {
            var
                that = this,
                levels = $.cache.levelCache,
                index = 0,
                len = levels.length,
                currentLevel = (this.levelStatus() || Utils.Cookie.get('AgentLevel')) - 0,
                companyType = this.companyType() - 0;
            //会员一层传递到总货明细的参数
            //data = {
            //    memberId: this.companyID(),
            //    loginName: params.loginName,
            //    firstcheck: false,
            //    periodsNumber: that.currentPeriods(),
            //    anchor: 'mount'
            //}
            //if (that.isDirectMember()) {
            //    currentLevel = that.parentStatus();
            //}
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
                if (currentLevel === levels[levels.length-1].AgentLevel || that.isMember()) {
                    index = levels.length - 1;
                    this.upper(levels[index - 1]['LevelName']).nextLevel('会员').current(levels[index]['LevelName']);
                }
                else {
                    //如果是0，即上级为子公司
                    if (currentLevel === 0) {
                        this.upper('大股东').nextLevel(levels[index + 1]['LevelName']).current(levels[index]['LevelName']);
                    }
                    else {
                        if (index == 0) {
                            if (this.isDirectMember()) {
                                this.upper('').nextLevel('会员').current('');
                            } else {
                                if (this.isNewSubordinate()) {
                                    var le = that.levelStatus();
                                    this.upper('公司').nextLevel(levels[index + 1]['LevelName']).current(levels[index]['LevelName']);
                                } else {
                                    that.toGross($data);
                                }
                            }

                        } else {
                            console.log(index);
                            this.upper(levels[index - 1]['LevelName']).nextLevel(levels[index + 1]['LevelName']).current(levels[index]['LevelName']);
                        }

                    }
                }

            }
            if (that.isDirectMember()) {
                that.title('直属会员').isMember(true);
            }
            if (!isInit) {
                this.title(this.nextLevel());
            }
            else {
                this.title('期数');//-1：不是大股东 ； 0：大股东； 1：大股东； 2：总代理； 3：代理
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
        //guide_right.eq(0).css({ color: 'red' });
        //guide_right.filter("[href*='index']").css({ color: 'red' });
        //guide_right.removeClass("menuon").filter("[href*='index']").addClass("menuon");
    };
    exports.viewmodel = MonthReport;
});