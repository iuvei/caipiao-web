///栏货金额
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var Commission = function (params) {
        params = params || {};
        var that = this;
        this.params = params;
        this.list = ko.observableArray();
        this.join = function () {
            var arr = [];
            ko.utils.arrayForEach(arguments, function (element) {
                element - 0 > 0 && arr.push(element);
            });
            return arr.join('/');
        };
        this.sub = function () {
            if (confirm("如果庄家先吃满，则不以所设成数来分配，以实际分配到拦货中金额为准，你同意吗?")) {
                var that = this;
                var list = that.list();
                console.log(list);
                var arr = [];
                var reg = /^[0-9]*$/;
                var changeList = [];
                for (var i = 0, len = list.length; i < len; i++) {
                    var data = list[i];
                    if (i == 0 || i == 6 || i == 15) continue;
                    if (data.MaxLimitStore !== data._init.MaxLimitStore) {
                        if ($.trim(data.MaxLimitStore) === "") { 
                            Utils.tip('栏货金额不能为空', false, 3000, true ? function () {

                            } : null);
                            return;
                        } else if (!reg.test(data.MaxLimitStore)) { 
                            Utils.tip('只能输入纯数字', false, 3000, true ? function () {

                            } : null);
                            return;
                        }
                        else if (data.MaxLimitStore - 0 > 10000000) { 
                            Utils.tip('栏货金额不能大于10000000', false, 3000, true ? function () {

                            } : null);
                            return;
                        } else {
                            arr.push({
                                MaxLimitStore: data.MaxLimitStore,
                                BetTypeName: data.BetTypeName,
                                Lottery: 1,
                                BetTypeID: data.BetTypeID,
                                Commission: data.Commission,
                                LimitOdds1: data.LimitOdds1,
                                LimitOdds2: data.LimitOdds2,
                                LimitOdds3: data.LimitOdds3,
                                LimitOdds4: data.LimitOdds4,
                                PLimitOdds1: data.PLimitOdds1,
                                PLimitOdds2: data.PLimitOdds2,
                                PLimitOdds3: data.PLimitOdds3,
                                PLimitOdds4: data.PLimitOdds4,
                                MaxLimitItemBet: data.MaxLimitItemBet,
                                MaxLimitSigleBet: data.MaxLimitSigleBet,
                                MaxLimitStore: data.MaxLimitStore,
                                MinLimitBetAmount: data.MinLimitBetAmount,
                                Odds: data.Odds
                            });
                            changeList.push(data);
                        }
                    }
                }
                if (arr.length < 1) {
                    Utils.tip('无任何操作', false, 3000, true ? function () {

                    } : null); 
                    return;
                }

                $.post("/index.php/portal/agent/ModifyLimitStore",
                    { TestList: JSON.stringify(arr) },
                    function (json) { 
                        Utils.tip(json.info, json.status, 3000, json.status ? function () {

                        } : 1000);
                        $.each(changeList, function (index, value) {
                            value._init.MaxLimitStore = value.MaxLimitStore;
                        });
                    });

            }
        }
        this.GetData();

    }
    Commission.prototype.GetData = function () {
        var that = this;
        var arr = [];
        $.ajax({
            url: "/index.php/portal/agent/GetCommission",
            cache: false,
            dataType: "json",
            success: function (json) {
                if ($.isArray(json)) {
                    json.sort(function (a, b) {
                        return a['BetTypeID'] - b['BetTypeID'];
                    });
                     arr.push({
                        BetTypeName: "一定位",
                        MinLimitBetAmount: "",
                        LimitOdds1: '',
                        LimitOdds2: '',
                        LimitOdds3: '',
                        LimitOdds4: '',
                        PLimitOdds1: '',
                        PLimitOdds2: '',
                        PLimitOdds3: '',
                        PLimitOdds4: '',
                        MaxLimitSigleBet: '',
                        MaxLimitStore: "",
                        MaxLimitItemBet: '',
                        hidden: true
                    });

                    $.each(json, function (a, b) {
                        b.hidden = false;
                        b._init = $.extend({}, b);
                        // if (b.BetTypeID - 0 == 20 || b.BetTypeID - 0 == 21 || b.BetTypeID - 0 == 22 || b.BetTypeID - 0 == 23 || b.BetTypeID - 0 == 24) {
                        if (b.BetTypeID - 0 >= 20 && b.BetTypeID - 0 <= 24) {
                            arr.push(b);
                        }

                    })
                    arr.push({
                        BetTypeName: "二定位",
                        MinLimitBetAmount: "",
                        LimitOdds1: '',
                        LimitOdds2: '',
                        LimitOdds3: '',
                        LimitOdds4: '',
                        PLimitOdds1: '',
                        PLimitOdds2: '',
                        PLimitOdds3: '',
                        PLimitOdds4: '',
                        MaxLimitSigleBet: '',
                        MaxLimitStore: "",
                        MaxLimitItemBet: '',
                        hidden: true
                    });
                    $.each(json, function (a, b) {
                        b.hidden = false;
                        b._init = $.extend({}, b);
                        if (b.BetTypeID - 0 <= 7 || b.BetTypeID - 0 == 17 || b.BetTypeID - 0 == 18) {
                            arr.push(b);
                        }

                    })

                    $.each(json, function (a, b) {
                        b.hidden = false;
                        b._init = $.extend({}, b);
                        if (b.BetTypeID == "9") {
                            arr.push({
                                BetTypeName: "三定位",
                                MinLimitBetAmount: "",
                                LimitOdds1: '',
                                LimitOdds2: '',
                                LimitOdds3: '',
                                LimitOdds4: '',
                                PLimitOdds1: '',
                                PLimitOdds2: '',
                                PLimitOdds3: '',
                                PLimitOdds4: '',
                                MaxLimitSigleBet: '',
                                MaxLimitStore: "",
                                MaxLimitItemBet: '',
                                hidden: true
                            })
                        }
                        if (b.BetTypeID - 0 >= 9 && b.BetTypeID - 0 <= 16) {
                            arr.push(b);
                        }
                    })
                }
                that.list(arr);
            }
        })


    }
    exports.viewmodel = Commission;
});