/// 期数分类账
/// <reference path="../_ref.js" />
define(function (require, exports, module) {
    var DefaultShowDetail = true;   ///默认是否展开分类账详情
    var Classify_ReportClassify = function (params) {
        params = params || {}; /// 从列表中带来的参数
        var that = this;
        this.periodsNumber = ko.observableArray();
        this.list = ko.observableArray();
        this.LevelStatus= ko.observable(Utils.Cookie.get('CompanyType')-0==2?Utils.Cookie.get('AgentLevel'):-1);//-1：不是大股东 ； 0：大股东； 1：大股东； 2：总代理； 3：代理
       // this.PeriodsNumber=ko.observable();


        this.GroupByTypeID = {
            2: { GroupID: 0, GroupName: '二定位', TypeName: 'OOXX' },
            3: { GroupID: 0, GroupName: '二定位', TypeName: 'OXOX' },
            4: { GroupID: 0, GroupName: '二定位', TypeName: 'OXXO' },
            5: { GroupID: 0, GroupName: '二定位', TypeName: 'XOXO' },
            6: { GroupID: 0, GroupName: '二定位', TypeName: 'XOOX' },
            7: { GroupID: 0, GroupName: '二定位', TypeName: 'XXOO' },
            17: { GroupID: 0, GroupName: '二定位', TypeName: 'XXXOO' },
            18: { GroupID: 0, GroupName: '二定位', TypeName: 'OXXXO' },
            9: { GroupID: 1, GroupName: '三定位', TypeName: 'OOOX' },
            10: { GroupID: 1, GroupName: '三定位', TypeName: 'OOXO' },
            11: { GroupID: 1, GroupName: '三定位', TypeName: 'OXOO' },
            12: { GroupID: 1, GroupName: '三定位', TypeName: 'XOOO' },
            13: { GroupID: 2, GroupName: '四定位', TypeName: '四定位' },
            14: { GroupID: 3, GroupName: '二字现', TypeName: '二字现' },
            15: { GroupID: 4, GroupName: '三字现', TypeName: '三字现' },
            16: { GroupID: 5, GroupName: '四字现', TypeName: '四字现' }

        };
        this.ClickShowDetails = function (data, evt) {
            data.IsShowDetails(!data.IsShowDetails());
        }
        this.getPeriodsNumber();

    }
    Classify_ReportClassify.prototype.BuildData = function (data) {
        if (data.length == 0) {
            return null;
        }
        var that = this;
        var childBasicData = { BetTypeID: 0, BetCount: 0, BetAmount: 0, BackComm: 0, WinAmt: 0, WinLoss: 0 }
        var childrenData = {};
        $.each(that.GroupByTypeID, function (key, value) {
            var obj = $.extend({}, value, childBasicData);
            obj.BetTypeID = key - 0;
            childrenData[key] = obj;
        });
        $.each(data, function (idx, value) {
            var obj = childrenData[value.BetTypeID];
            obj.BetCount += value.BetCount - 0;
            obj.BetAmount += value.BetAmount - 0;
            obj.BackComm += value.BackComm - 0;
            obj.WinAmt += value.WinAmt - 0;
            obj.WinLoss += value.WinLoss - 0;
        });
        var rtnObj = {
            LoginName: Utils.Cookie.get("AccountLoginName"),
            TotalBetCount: 0,
            TotalBetAmount: 0,
            TotalBackComm: 0,
            TotalWinAmt: 0,
            TotalWinLoss: 0,
            IsShowDetails: ko.observable(DefaultShowDetail)
        }
        var TypeList = [];
        $.each(childrenData, function (key, val) {
            var id = val.GroupID;
            if (!TypeList[id]) {
                TypeList[id] = {
                    GroupName:val.GroupName,
                    BetCount: 0,
                    BetAmount:0,
                    BackComm: 0,
                    WinAmt: 0,
                    WinLoss: 0,
                    Children: []
                }
            }
            var obj = TypeList[id];
            obj.BetCount += val.BetCount;
            obj.BetAmount += val.BetAmount - 0;
            obj.BackComm += val.BackComm - 0;
            obj.WinAmt += val.WinAmt - 0;
            obj.WinLoss += val.WinLoss - 0;
            obj.Children.push(val);

            rtnObj.TotalBetCount += val.BetCount;
            rtnObj.TotalBetAmount += val.BetAmount - 0;
            rtnObj.TotalBackComm += val.BackComm - 0;
            rtnObj.TotalWinAmt += val.WinAmt - 0;
            rtnObj.TotalWinLoss += val.WinLoss - 0;
        });
        rtnObj.TypeList = TypeList;

        return rtnObj;
    }


    Classify_ReportClassify.prototype.getPeriodsNumber = function () {
        var that = this;
        var queryPeriod = $('.query-period');
            queryPeriod.off('change');
        $.ajax({
            url: "/index.php/portal/agent/GetPeriodsByDay",//查询当天的期数
            cache: false,
            data: {
                beginDate:new Date().format("yyyy-MM-dd"),
                endDate: new Date().format("yyyy-MM-dd"),
                isGross:true

            },
            success: function (data) {
                if (data.list.length == 0) {
                    return false;
                }
                if (!$.isArray(data.list) || !data.list.length) {
                    that.list.removeAll();
                    that.periodsNumber.removeAll();

                    return;
                }
                that.periodsNumber(data.list);//.reverse()
                $("#PeriodsNumber").val(data.list[0].PeriodsNumber);
                that.GetData();
                queryPeriod.on('change', function (event) {
                    var
                        target = $(event.target),
                        query = target.data('query');
                    $("#PeriodsNumber").val(target.val());
                    that.GetData();
                });
                ;
            }
        });
    };
    Classify_ReportClassify.prototype.GetData = function () {
        var that = this;
        $.ajax({
            url: "/index.php/portal/agent/ReportForRecentlyGameType",//查询期数分类帐
            data: {
                LevelStatus: that.LevelStatus(),//-1：不是大股东 ； 0：大股东； 1：大股东； 2：总代理； 3：代理
                PeriodsNumber: $("#PeriodsNumber").val()
            },
            cache: false,
            dataType: "json",
            success: function (json) {
                if ($.isArray(json)) {
                    var list = [];
                    var data = that.BuildData(json);
                    if (data) {
                        list.push(data);
                    }
                    that.list(list);
                }
            }
        });


    };
    exports.viewmodel = Classify_ReportClassify;
    exports.done = function () {
        var guide_right = $('.guide_right a');
        //guide_right.css({ color: 'black' }).eq(0).css({ color: 'red' });
        guide_right.removeClass("menuon").eq(0).addClass("menuon");
        guide_right.on('click', function () {
            //guide_right.css({ color: 'black' });
            //$(this).css({ color: 'red' });
            $(this).addClass("menuon").siblings().removeClass("menuon");
        });
    };
});