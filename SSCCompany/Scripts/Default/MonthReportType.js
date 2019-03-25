/// 月分类帐
/// <reference path="../_references.js" />
/// <reference path="../_ref.js" />
/// <reference path="../utils.js" />
define(function (require, exports, module) {
    var MonthReportType = function (params) {
        var that = this;
        var
            params = params || {};
        this.params = params;
        this.lists = ko.observableArray();
        this.periodsNumber = ko.observableArray();//下拉期数
        this.IsMember = ko.observable();//是否是会员
        this.PeriodsID = ko.observable();//期数ID
        this.IsSelf = ko.observable(true);
        this.Stop = ko.observable();
        //下拉期数的日期
        this.dateFrom = ko.observable();
        this.dateTo = ko.observable();
        this.periodsNumberFrom = ko.observable();
        this.periodsNumberFromTo = ko.observable();
        this.periodsNumberTo = ko.observable();
        this.dateList = ko.observableArray();
        this.timeOrPeriods = ko.observable(false);
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
        this.LoginNameNlineClassify = function ($data) {
            if (!$data.periodsTime) { return };
            framework.view(
                '/index.php/portal/agent/DayReportType',
                'Classify/index',
                {
                    IsRedirect: true,
                    IsSelf: true,
                    CompanyID: that.CompanyID(),
                    CompanyType: that.CompanyType(),
                    PeriodsID: $data.PeriodsNumber,
                    LevelStatus: that.LevelStatus(),
                    isMonthClick: true,
                    ClassTime: $data.PeriodsNumber
                });
        };
        this.CompanyType = ko.observable(Utils.Cookie.get('CompanyType')); //this.getCompanyTypeID = ko.observable(Utils.Cookie.get('CompanyType') - 0);
        this.isScreeningdateList = ko.observable(false);//是否刷新期数月份：2016年04月
        this.queryFormDate = function (data, event) {
            var
                 fn = this.fn,
                 target = event.target,
                 data = ko.dataFor(target),
                 text = data.text,
                 reg = /[^\d]/g,
                 date,
                 dateTo,
                 dateList = that.dateList();
            target = $(target);
            that.isScreeningdateList(true);
            if (that.CompanyType() == 2) {//如果是代理级别
                text = data.text;
            }
            //排除月份和全部之外的其他元素点击事件
            if (data instanceof MonthReportType && !target.hasClass('query-all')) {
                return;
            }
            that.timeOrPeriods(false);
            target.addClass("active").siblings('a').removeClass("active")//.css({ color: 'yellow' });
            if (target.hasClass('query-all')) {
                var setDateF = dateList[0].text.replace(reg, '-') + '01';
                that.dateFrom(setDateF);
                dateTo = dateList[dateList.length - 1].text.split(reg);
                date = new Date(dateTo[0], dateTo[1], 0);
                that.dateTo(date.format('yyyy-MM-dd'));
            }
            else if (text) {
                that.dateFrom(text.replace(reg, '-') + '01'); //fn.date.from = text.replace(reg, '-') + '01';
                dateTo = text.split(reg);
                date = new Date(dateTo[0], dateTo[1], 0);
                that.dateTo(date.format('yyyy-MM-dd')); //fn.date.to = date.format('yyyy-MM-dd');
            }
            that.getPeriodsNumber(function () {
                that.getData();
            });
        };
        this.CompanyID = ko.observable(Utils.Cookie.get('AccountID'));

        this.LevelStatus = ko.observable(Utils.Cookie.get('AgentLevel') || -1);
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
        this.init();
    }
    MonthReportType.prototype = {
        constructor: MonthReportType,
        fn: MonthReportType,
        getData: function () {
            var
                that = this,
                fn = that.fn;
            var load = Utils.loading({ delayTime: 5000 });

            var da1 = new Date().format('yyyy-MM-dd 00:00'),
               da2 = new Date().format('yyyy-MM-dd 00:00');

            if (that.isScreeningdateList() == true) {
                screeningMonth = that.dateFrom();
                da1 = that.dateFrom() == undefined ? new Date().format('yyyy-MM-dd 00:00') : that.dateFrom();
                da2 = that.dateTo() == undefined ? new Date().format('yyyy-MM-dd 00:00') : that.dateTo();
            } else {
                var taList = that.dateList();
                var reg = /[^\d]/,
                       text = taList[taList.length - 1].text;
                var len = text.length - 0;
                text = text.substring(0, len - 1);
                that.dateFrom(text.replace(reg, '-') + '-01');

                var dateTotext = taList[(taList.length - 1)].text;//data[(data.length - 1)].OpenDt;
                dateTo = dateTotext.split(reg);
                date = new Date(dateTo[0], dateTo[1], 0);
                that.dateTo(date.format('yyyy-MM-dd'));
                da1 = that.dateFrom();
                da2 = that.dateTo();
            }

            /*if (that.CompanyType() == 2) {
                da1 = that.dateFrom();
                da2 = that.dateTo();
            }*/
            var
                params = {
                    Date: da1,
                    DateTo: da2,
                    PeriodsNumberFrom: that.periodsNumberFrom(),
                    PeriodsNumberTo: that.periodsNumberTo(),
                    TimeOrPeriods: that.timeOrPeriods(),
                    IsMember: that.IsMember(), //是否是会员
                    LotteryID: 1,  //游戏类型的ID
                    CompanyID: that.CompanyID(),
                    CompanyType: that.CompanyType(),
                    LevelStatus: that.LevelStatus(), //层级类型 -1：不是大股东 ； 0：大股东； 1：大股东； 2：总代理； 3：代理
                    IsSelf: that.IsSelf()//查询自己还是查询下线
                },
                temp;
            //如果开始期数小于结束期数，两者交换
            if (params.PeriodsNumberFrom > params.PeriodsNumberTo) {
                temp = params.PeriodsNumberFrom;
                params.PeriodsNumberFrom = params.PeriodsNumberTo;
                params.PeriodsNumberTo = temp;
            }
            $.ajax({
                url: "/index.php/portal/agent/ReportForGameTypeMonth",
                cache: false,
                data: params,
                success: function (data) {
                    that.lists([]);
                    load.cancel();
                    if (data && data.length > 0) {
                        var
                            list = [],
                            list1 = [],
                            single,
                            key,
                            times = {},
                            len,
                            item,
                            totalData = { 1: { data: [] } }, //用数字1作为属性，方便排序
                            props = ['BackComm', 'BetAmount', 'BetCount', 'WinAmt', 'WinLoss'];
                        //根据日期拼接成   日期:{data:{}}的方式
                        for (key in data) {
                            single = data[key];
                            if (!times[single.PeriodsTime]) {
                                times[single.PeriodsTime] = { periodsTime: single.PeriodsTime, data: [] };
                            }
                            times[single.PeriodsTime].data.push(single);
                        }
                        single = null;
                        item = totalData['1']['data'];
                        for (key in times) {
                            $.each(times[key].data, function (index, value) {
                                len = item.length;
                                single = null;
                                if (len) {
                                    while (len--) {
                                        if (item[len]['BetTypeID'] === value['BetTypeID'] && item[len]['TotalStatus'] === value['TotalStatus']) {
                                            single = item[len];
                                            break;
                                        }
                                    }
                                }
                                if (!single) {
                                    single = {};
                                    $.each(props, function (index, prop) {
                                        single[prop] = 0;
                                    });
                                    single['BetTypeID'] = value['BetTypeID'];
                                    single['groupname'] = value['typename'];
                                    single['TotalStatus'] = value['TotalStatus']
                                    item.push(single);
                                }
                                $.each(props, function (index, prop) {
                                    single[prop] += value[prop];
                                });
                            });
                        }

                        times['1'] = totalData['1'];
                        //再将数据拼接成 [{PeriodsTime:time,data1:[],data2:[]}]
                        for (key in times) {
                            single = { PeriodsNumber: key, periodsTime: times[key].periodsTime?times[key].periodsTime.replace(/[^0-9]/g, ""):1, data1: [], data2: [] };
                            $.each(times[key].data, function (index, value) {
                                if (value.TotalStatus === 1) {
                                    single.data1.push(value);
                                }
                                else {
                                    single.data2.push(value);
                                }

                            });
                            list.push(single);
                        }
                        times = null;
                        list.sort(function (a, b) {
                            return b.periodsTime - a.periodsTime;
                        });
                        len = list.length;
                        //firefox下会导致总统计在最下面,这里需要做处理
                        while (len--) {
                            if (list[len].PeriodsNumber == 1) {
                                list.unshift(list.splice(len, 1)[0]);
                                break;
                            }
                        }
                        $.each(list, function (index, value) {
                            value.data = value.data1;
                            that.buildData([value], function (result1) {
                                list1 = list1.concat($.extend(true, [], result1));
                            });
                            value.data = value.data2;
                            that.buildData([value], function (result2) {
                                list1 = list1.concat(result2);
                            });
                        });
                        that.lists([{ list1: list1 }]);

                    }
                }
            });

        },
        buildData: function (list, callback) {
            var
                that = this,
                key,
                indexOf = ko.utils.arrayIndexOf;
            if (!$.isArray(list)) {
                return;
            }
            $.each(list, function (index, item) {
                var
                    _group = {},
                    TotalBetCount = 0,
                    TotalBetAmount = 0,
                    TotalBackComm = 0,
                    TotalWinAmt = 0,
                    TotalWinLoss = 0,
                    items = item.data,
                    ids = [];
                $.each(items, function (index, element) {
                    ids.push(element.BetTypeID);
                });
                Array.prototype.push.apply(items, that.buildAllItem(ids));
                $.each(items, function (index, element) {
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
                item.TotalBackComm = Math.ceil(TotalBackComm) - 0;
                item.TotalWinAmt = Math.ceil(TotalWinAmt) - 0;
                item.TotalWinLoss = Math.ceil(TotalWinLoss) - 0;
                var _list = [];
                for (var i in _group) {
                    var BetCount = 0, BetAmount = 0, BackComm = 0, WinLoss = 0; WinAmt = 0;
                    $.each(_group[i], function (index, element) {
                        BetCount += element.BetCount;
                        BetAmount += element.BetAmount;
                        BackComm += element.BackComm;
                        WinLoss += element.WinLoss;
                        WinAmt += element.WinAmt;
                    });
                    _list.push({
                        groupname: i,
                        BetCount: BetCount,
                        BetAmount: BetAmount.toFixed(2) - 0,
                        BackComm: BackComm.toFixed(2) - 0,
                        WinLoss: WinLoss.toFixed(2) - 0,
                        WinAmt: WinAmt.toFixed(2) - 0,
                        BetTypeID: _group[i][0].BetTypeID,
                        children: _group[i],
                        SortID: _group[i][0].BetTypeID <= 12 && _group[i][0].BetTypeID >= 9 ? 8 : _group[i][0].BetTypeID >= 13 && _group[i][0].BetTypeID <= 16 ? _group[i][0].BetTypeID : 1,

                    });
                }
                _list.sort(function (a, b) {
                    return a.SortID - b.SortID;
                });
                item.list = _list;//.reverse();
            });
            callback && callback.call(that, list);
            return that;
        },
        /**
        *生成查询时间和显示在页面上的时间
        */
        buildDate: function (isAll) {
            var
                date = new Date(),
                dateFrom,
                dateTo,
                single = {},
                reg = /[^\d]/,
                fn = this.fn;
            date.setDate(1);
            //显示在页面上的日期
            for (var i = -1; i < 1; i++) {
                single = { text: Utils.DateHelp.add(date, i, 'month', 'yyyy年MM月'), cur: false };
                if (i === 0) {
                    single.cur = true;
                }
                this.dateList.push(single);
            }
            this.dateFrom(this.dateList()[0].text).dateTo(this.dateList()[1].text);


            //查询的日期
            dateFrom = isAll ? this.dateList()[0].text : date.format('yyyy-MM-dd');
            dateTo = this.dateTo().split(reg);
            dateTo = new Date(dateTo[0], dateTo[1], 0).format('yyyy-MM-dd');//day取0可以取到一个月的最后一天
            fn.date.from = dateFrom;
            fn.date.to = dateTo;
            fn.date.lastDate = dateTo;
        },
        buildAllItem: function (ids) {
            var arr = [];
            var allIds = [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16,17,18];
            ko.utils.arrayForEach(ids, function (item) {
                var index = ko.utils.arrayIndexOf(allIds, item);
                if (index > -1) {
                    allIds.splice(index, 1);
                }
            });
            ko.utils.arrayForEach(allIds, function (item) {
                arr.push({
                    BetTypeID: item,
                    BetCount: 0,
                    BetAmount: 0,
                    BackComm: 0,
                    WinLoss: 0,
                    WinAmt: 0
                });
            });
            return arr;
        },
        getPeriodsNumber: function (callback) {
            var
                that = this,
                fn = this.fn;

            var screeningMonth = -1,
                da1,
                da2;
            if (that.isScreeningdateList() == true) {
                screeningMonth = that.dateFrom();
                da1 = that.dateFrom() == undefined ? new Date().format('yyyy-MM-dd 00:00') : that.dateFrom();
                da2 = that.dateTo() == undefined ? new Date().format('yyyy-MM-dd 00:00') : that.dateTo();
            } else {
                var taList = that.dateList();
                var reg = /[^\d]/,
                       text = taList[0].text;
                var len = text.length - 0;
                text = text.substring(0, len - 1);
                that.dateFrom(text.replace(reg, '-') + '-01');

                var dateTotext = taList[(taList.length - 1)].text;//data[(data.length - 1)].OpenDt;
                dateTo = dateTotext.split(reg);
                date = new Date(dateTo[0], dateTo[1], 0);
                that.dateTo(date.format('yyyy-MM-dd'));

                da1 = that.dateFrom() == undefined ? new Date().format('yyyy-MM-dd 00:00') : that.dateFrom();
                da2 = that.dateTo() == undefined ? new Date().format('yyyy-MM-dd 00:00') : that.dateTo();
            }
           /* var screeningMonth = -1,
                da1 = fn.date.from,
                da2 = fn.date.to;
            if (that.CompanyType() == 2) {
                if (that.isScreeningdateList() == true) {
                    screeningMonth = that.dateFrom();
                }
                da1 = that.dateFrom() == undefined ? new Date().format('yyyy-MM-dd 00:00') : that.dateFrom();
                da2 = that.dateTo() == undefined ? new Date().format('yyyy-MM-dd 00:00') : that.dateTo()
            }*/
            $.get('/index.php/portal/agent/GetMothRortDay', {
                screeningMonth:screeningMonth,
                setMonthReport: true,//表示是月分类账查询(同月报表)，会返回日期；指令是GetPeriodsDTByCount
                beginDate: da1,
                endDate: da2,
                 pageIndex: 1,
                _: +new Date()
            }, function (data) {
                var
                    data = data.datelst ? data.datelst : [],
                    selects = $('.query-periods select');
                selects.off('change');
                that.periodsNumber(data.reverse());
                that.periodsNumberFrom(data[0]['PeriodsNumber']).periodsNumberTo(data[data.length - 1]['PeriodsNumber']);

                //that.periodsNumber(data.reverse());
                //that.periodsNumber(list);
               /* if (that.CompanyType() == 2) {
                    if (that.isScreeningdateList() == false) {

                        var arrTime = [],
                            arrIndexof = [];
                        for (var t = 0; t < data.list.length; t++) {
                            if (arrTime.length > 0) {
                                for (var d = 0; d < arrTime.length; d++) {
                                    if (ko.utils.arrayIndexOf(arrIndexof, data.list[t].OpenDt) == -1) //(data.list[t].OpenDt != arrTime[d]['text'])
                                    {
                                        arrIndexof.push(data.list[t].OpenDt);
                                        arrTime.push({ 'text': data.list[t].OpenDt, cur: false });//arrTime.push(data.list[t].OpenDt);
                                    }
                                }
                            } else {
                                arrIndexof.push(data.list[t].OpenDt);
                                arrTime.push({ 'text': data.list[t].OpenDt, cur: false });

                            }
                        }
                        that.dateList(arrTime);
                    }
                    if (Utils.Cookie.get('CompanyType') - 0 == 2) {
                        var reg = /[^\d]/,
                           text = data.list[0].OpenDt;
                        var len = text.length - 0;
                        text = text.substring(0, len - 1);

                        that.dateFrom(text.replace(reg, '-') + '-01');

                        var dateTotext = data.list[(data.list.length - 1)].OpenDt;
                        dateTo = dateTotext.split(reg);
                        date = new Date(dateTo[0], dateTo[1], 0);
                        that.dateTo(date.format('yyyy-MM-dd'));

                    }
                }*/
                //if (list.length - 0 > 0) {
                //   // that.periodsNumber(data.reverse());
                //  //  that.periodsNumberFrom(list[0].PeriodsNumber).periodsNumberTo(list[list.length - 1].PeriodsNumber);
                //}
                //selects.on('change', function (event) {
                //    var
                //        target = $(event.target);
                //    that[target.attr('data-query')](target.val());
                //    that.timeOrPeriods(true).getData();
                //});
                callback && callback.call(that);

            });
        },
        init: function () {
            if (this.CompanyType != 2) {
                this.buildDate();
            }
            this.getPeriodsNumber(function () {
                this.getData();
            });
        }
    };
    $.extend(MonthReportType, {
        /**
        *存储查询的开始日期、结束日期和最后一个月
        */
        date: { from: '', to: '', lastDate: '' }
    });

    exports.viewmodel = MonthReportType;
})