/// 分类帐
/// <reference path="../_references.js" />
/// <reference path="../_ref.js" />
/// <reference path="../utils.js" />
define(function (require, exports, module) {
    var ClassifyReportList = function (params) {
        var that = this;
        var params = params || {};
        this.params = params;
        this.lists = ko.observableArray();
        this.history = [];
        this.AllLevel = ko.observableArray();
        this.periodsNumber = ko.observableArray();//下拉期数
        this.IsMember = ko.observable(false);
        this.IsSelf = ko.observable(params.IsSelf || true);

        this.isMonthClick = ko.observable(params.isMonthClick || false);//true表示是从月分类帐跳转过来，取月分类帐日期
        this.ClassTime = ko.observable(params.ClassTime)

        //下拉期数的日期
        this.date = ko.observable();
        this.dateTo = ko.observable();
        this.dateList = ko.observableArray();
        this.ClickCount = function (data, event) {
            var element = $(event.target);
            element.closest('tr').nextAll(':lt(18)').toggle();
            if (element.hasClass('reduce-gif')) {
                element.addClass('add-gif').removeClass('reduce-gif');
            }
            else {
                element.addClass('reduce-gif').removeClass('add-gif');
            }
        }

        //直属会员
        this.IsDirectMember = ko.observable(false);//表示是否是直属会员;默认false
        /**
        *注:
        *第一列永远显示当前的等级,查询的时候使用viewmodel的数据查询下一级，
        *查询完成之后使用查询的结果来显示层级信息,
        *所以,这里能看到对CompanyType等的设置,而getData中也会有。
        */
        this.isClikeClassify = ko.observable(false);
        this.LoginNameNlineClassify = function ($data) {
            this.isClikeClassify(true);
            if (!this.Stop()) {
                this.history.push({
                    CompanyType: this.ParentCompanyType(),
                    CompanyID: this.CompanyID(),
                    LevelStatus: this.LevelStatus(),
                    IsSelf: this.IsSelf()
                });
                if (!$data.ID) {
                    this
                    .IsDirectMember(true)
                    .CompanyType(that.ParentCompanyType())
                    .getData();
                }
                else {
                    this
                       .LevelStatus($data.LevelStatus || -1)
                       .isBack(true)
                       .CompanyType($data.CompanyType)
                       .CompanyID($data.ID)
                       .IsSelf(false)
                       .IsDirectMember(!$data.ID)
                       .getData();
                }

            }
        }
        //参数
        this.CompanyID = ko.observable((Utils.Cookie.get('AccountID')) - 0);
        this.CompanyType = ko.observable((that.params.CompanyType || Utils.Cookie.get('CompanyType')) - 0);
        this.ParentCompanyType = ko.observable(this.CompanyType());
        this.LevelStatus = ko.observable(that.params.LevelStatus);
        this.PeriodsID = ko.observable(that.params.PeriodsID);//期数ID
        this.currentLevel = ko.observable(params.LevelStatus);//以数字方式记录当前的等级
        this.Level = ko.observable(); //显示当前的等级
        this.isBack = ko.observable(false);
        this.Stop = ko.observable();
        this.erziding = ko.observableArray();
        this.groupByTypeID = {
            0: { groupname: '一字定-二字定-快译', typename: '' },
            1: { groupname: '二定位', typename: 'OOXX' },
            2: { groupname: '二定位', typename: 'OOXX' },
            3: { groupname: '二定位', typename: 'OXOX' },
            4: { groupname: '二定位', typename: 'OXXO' },
            5: { groupname: '二定位', typename: 'XOXO' },
            6: { groupname: '二定位', typename: 'XOOX' },
            7: { groupname: '二定位', typename: 'XXOO' },
            9: { groupname: '三定位', typename: 'OOOX' },
            10: { groupname: '三定位', typename: 'OOXO' },
            11: { groupname: '三定位', typename: 'OXOO' },
            12: { groupname: '三定位', typename: 'XOOO' },
            13: { groupname: '四定位', typename: '四定位' },
            14: { groupname: '二字现', typename: '二字现' },
            15: { groupname: '三字现', typename: '三字现' },
            16: { groupname: '四字现', typename: '四字现' },
            17: { groupname: '二定位', typename: 'XXXOO' }, //四五二定位 新增：2017年6月30日 14:44:06
            18: { groupname: '一定位', typename: 'XOXX' },  //首位二定位 新增：2017年6月30日 14:44:21
            20: { groupname: '一定位', typename: 'OXXX' },
            21: { groupname: '一定位', typename: 'XOXX' },
            22: { groupname: '一定位', typename: 'XXOX' },
            23: { groupname: '一定位', typename: 'XXXO' },
            24: { groupname: '一定位', typename: 'XXXXO' },
        };

        if (this.CompanyType() == 2) { //如果是代理级别
            this.LevelStatus(Utils.Cookie.get('AgentLevel'));
        } else {
            this.LevelStatus(-1).currentLevel(-1);
        } this.init();
    }
    ClassifyReportList.prototype = {
        constructor: ClassifyReportList,
        C: ClassifyReportList,
        getData: function (fn) {
            var that = this;
            var load = Utils.loading({ delayTime: 5000 });
            $.ajax({
                url: "/index.php/portal/agent/ReportForGameType",
                cache: false,
                data: {
                    isClikeClassify:that.isClikeClassify(),
                    LotteryID: 1,  //游戏类型的ID
                    PeriodsID: that.PeriodsID, //期数ID
                    CompanyID: that.CompanyID(),//that.RedirectID(), 用户ID
                    CompanyType: that.CompanyType(), //that.CompanyType(),//公司类型
                    LevelStatus: that.LevelStatus(), //层级类型 -1：不是大股东 ； 0：大股东； 1：大股东； 2：总代理； 3：代理；4：第五层代理  ···  9：第十层代理
                    IsSelf: that.IsSelf(),//查询自己还是查询下线
                    IsDirectMember: that.IsDirectMember(),//表示是否是直属会员
                    IsMember: that.IsMember(), //是否是会员
                    AgentLevel : ko.observable(Utils.Cookie.get('AgentLevel')||-1),
                    isMonthClick: that.isMonthClick(),
                    ClassTime: that.ClassTime()
                },
                success: function (data) {
                    var
                        takeLevel = false,  //记录层级
                        takeMember = false; //记录会员     保证只执行一次
                    load.cancel();
                    that.lists([]);
                    //data = data.ls;
                    if (data) {
                        $.each(data, function (key, items) {
                            var
                                setting1 = [],
                                setting2 = [],
                                list1,
                                list2;
                            if (!takeLevel) {
                                if (items.CompanyType !== '' && items.LevelStatus !== '') {
                                    that.ParentCompanyType(that.CompanyType());
                                    that.CompanyType(items.CompanyType).currentLevel(items.LevelStatus);
                                    takeLevel = true;
                                }
                            }
                            $.each(items.LsSetting, function (index, value) {
                                if (!takeMember) {
                                    if (!!value.IsMember) {
                                        that.Stop(true).IsMember(true);
                                        takeMember = true;
                                    }
                                }
                                if (value.TotalStatus === 1) {
                                    setting1.push(value);
                                }
                                else if (value.TotalStatus === 2) {
                                    setting2.push(value);
                                }
                            });
                            items.LsSetting = setting1;
                            that.buildData([$.extend({}, items, true)], function (data) {
                                list1 = data;
                                items.LsSetting = setting2;
                            }).buildData([$.extend({}, items, true)], function (data) {
                                list2 = data;
                            }).lists.push(ko.observable({ list1: list1, list2: list2 }));
                        });
                        if (!($.cache.levelCache && $.cache.levelCache.length > 0)) {
                            $.ajax({
                                url: '/Report/GetAgentLevelByID',
                                data: {
                                    CompanyID: that.CompanyID()
                                }
                            }).done(function (data) {
                                if (data.length) {
                                    that.AllLevel($.cache.levelCache = data);
                                }
                                that.getLevel();
                            });
                        }
                        else {
                            that.AllLevel($.cache.levelCache);
                            that.getLevel();
                        }
                        fn && fn.call(that);
                    }
                }
            });

        },
        buildData: function (data, callback) {
            var that = this;
            //可能存在没有LsSetting的情况
            if (!data[0].LsSetting.length) {
                callback && callback.call(that, data);
                return that;
            }
            ko.utils.arrayForEach(data, function (item) {
                var _group = {};
                var TotalBetCount = 0, TotalBetAmount = 0, TotalBackComm = 0, TotalWinAmt = 0, TotalWinLoss = 0;
                var ids = [];
                ko.utils.arrayForEach(item.LsSetting, function (element) {
                    ids.push(element.BetTypeID);
                });
                Array.prototype.push.apply(item.LsSetting, that.buildAllItem(ids));
                ko.utils.arrayForEach(item.LsSetting, function (element) {
                    console.log(element.BetTypeID);
                    var groupname = that.groupByTypeID[element.BetTypeID].groupname;
                    TotalBetCount += element.BetCount;
                    TotalBetAmount += element.BetAmount;
                    TotalBackComm += element.BackComm;
                    TotalWinAmt += element.WinAmt;
                    TotalWinLoss += element.WinLoss;
                    element.typename = that.groupByTypeID[element.BetTypeID].typename;
                    _group[groupname] = _group[groupname] || [];
                    _group[groupname].push(element);

                });
                item.TotalBetCount = TotalBetCount;
                item.TotalBetAmount = Math.ceil(TotalBetAmount) - 0;
                item.TotalBackComm =  Math.ceil(TotalBackComm) - 0;
                item.TotalWinAmt =  Math.ceil(TotalWinAmt) - 0;
                item.TotalWinLoss =  Math.ceil(TotalWinLoss) - 0;
                var _list = [];
                for (var i in _group) {
                    var BetCount = 0, BetAmount = 0, BackComm = 0, WinLoss = 0; WinAmt = 0, GuessLoss = 0, CompanyType=0;
                    ko.utils.arrayForEach(_group[i], function (element) {
                        BetCount += element.BetCount;
                        BetAmount += element.BetAmount;
                        BackComm += element.BackComm;
                        WinLoss += element.WinLoss;
                        WinAmt += element.WinAmt;
                        GuessLoss = element.GuessLoss;//item.CompanyType
                        CompanyType=item.CompanyType;
                    });
                    _list.push({
                        groupname: i,
                        BetCount: BetCount,
                        BetAmount: BetAmount.toFixed(2) - 0,
                        BackComm: BackComm.toFixed(2) - 0,
                        WinLoss: WinLoss.toFixed(2) - 0,
                        WinAmt: WinAmt.toFixed(2) - 0,
                        GuessLoss: GuessLoss.toFixed(2) - 0,//二定，三定，四定，二现，三现
                        CompanyType:CompanyType-0,
                        BetTypeID: _group[i][0].BetTypeID,
                        children: _group[i],
                        SortID: _group[i][0].BetTypeID <= 12 && _group[i][0].BetTypeID >= 9 ? 8 : _group[i][0].BetTypeID >= 13 && _group[i][0].BetTypeID <= 16 ?  _group[i][0].BetTypeID: 1,
                    });
                }
                _list.sort(function (a, b) {
                    return a.SortID - b.SortID;
                });

                item.list = _list;
            });
            callback && callback.call(that, data);
            return that;
        },
        getPeriodsNumber: function (callback) {
            var that = this,
            /*  *@property date  生成当前和左右两个月的默认日期,setDate会设置为1号然后循环生成。  */
            date = new Date();
            date.setDate(1);
            for (var i = -1; i < 2; i++) {
                this.dateList().push({ text: Utils.DateHelp.add(date, i, 'month', 'yyyy-MM-dd') });
            }
            this.date(this.dateList()[0].text).dateTo(this.dateList()[2].text);
            $.get('/index.php/portal/agent/GetPeriodsByDay', {
                startDate: that.date(),
                endDate: that.dateTo(),
                pageIndex: 1,
                isGross: true,//true：表示总货明细查询；false：表示从其它报表跳转查询，需传日期
               // GetDateTime: that.GetDateTime(),
                _: +new Date()
            }, function (data) {
                var
                    arrlist = [],
                    select = $('.query-periods select');

                $.each(data.list, function (index, value) {
                    if (Utils.Cookie.get('CompanyType') - 0 == 2) {
                        arrlist.push({
                            PeriodsNumber: value.PeriodsNumber
                        });
                    }else  if (value.PeriodsStatus > 0) {//未开盘的期数不显示
                        arrlist.push({
                            PeriodsNumber: value.PeriodsNumber
                        });
                    }
                });
                select.off('change');
                that.periodsNumber(arrlist ? arrlist : []);
                if (that.params.PeriodsID) {
                    that.PeriodsID(that.params.PeriodsID);
                }
                else {
                    that.PeriodsID($.isArray(data.list) && data.list.length > 0 && data.list[0].PeriodsNumber !== undefined ? data.list[0].PeriodsNumber : '');
                }
                select.on('change', function (event) {
                    var
                        target = $(event.target);
                    that[target.data('map')] = target.val();
                    that.CompanyType(that.ParentCompanyType());
                    that.getData();
                });
                callback && callback.call(that);
            });
        },
        init: function () {
            this.getPeriodsNumber(function () {
                this.getData();
            });
        },
        getLevel: function () {
            var
                that = this,
                levels = that.AllLevel(),
                index = 0,
                len = levels && levels.length,
                companyType = that.CompanyType() - 0,
                companyID = that.CompanyID() - 0;
            if (companyType === 0) {
                that.Level('总公司');
                return;
            }
            if (companyType === 1) {
                that.Level('子公司');
                return;
            }
            if (that.IsMember()) {
                that.Level('会员');
                return;
            }
            while (len--) {
                if (levels[len].AgentLevel - 0 === that.currentLevel() - 0) {
                    that.Level(levels[len]['LevelName']);
                }
            }
        },
        buildAllItem: function (ids) {
            var arr = [];
            var allIds = [17, 18, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16];
            ko.utils.arrayForEach(ids, function (item) {
                var index = ko.utils.arrayIndexOf(allIds, item);
                if (index > -1) {
                    allIds.splice(index, 1);
                }
            });
            //2, 3, 4, 5, 6, 7
            //9, 10, 11, 12
            //[2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16]
            ko.utils.arrayForEach(allIds, function (item) {
                arr.push({
                    BetTypeID: item,
                    BetCount: 0,
                    BetAmount: 0,
                    BackComm: 0,
                    WinLoss: 0,
                    WinAmt: 0,
                    GuessLoss: 0//,
                    //CompanyType:0,
                });
            });
            return arr;
        },
        back: function () {
            var
                that = this,
                prop = ['CompanyType', 'CompanyID', 'LevelStatus', 'IsSelf'],
                single = that.history.pop();
            if (!single) {
                return;
            }
            if (!that.history.length) {
                that.isBack(false);
            }
            that.IsMember(false).Stop(false).IsDirectMember(false);
            $.each(prop, function (index, value) {
                that[value](single[value]);
            });
            that.getData();
        }
    };
    exports.viewmodel = ClassifyReportList;
    exports.done = function () {
        var
            guide_right = $('.guide_right a');
        //guide_right.css({ color: 'black' }).eq(1).css({ color: 'red' });.addClass("menuon").siblings().removeClass("menuon")
        guide_right.removeClass("menuon").eq(1).addClass("menuon");
        guide_right.on('click', function () {
            //guide_right.css({ color: 'black' });
            //$(this).css({ color: 'red' });
            $(this).addClass("menuon").siblings().removeClass("menuon");
        });
    };
});