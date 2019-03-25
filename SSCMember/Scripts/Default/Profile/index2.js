///
/// <reference path="../_ref.js" />
define(function (require, exports, module) {
    var AccountList = function (params) {
        params = params || {}; /// 从列表中带来的参数
        var that = this;
        this.params = params;
        this.BetTypeSettingHasChanged = false;
        this.profileFormHasChanged = false;
        this.IsEnter = ko.observable(Utils.Cookie.get('IsEnter') === 'true');//录码模式：自动 false；回车 true
        this.IsShowLottory = ko.observable(Utils.Cookie.get('IsShowLottory') === 'true');// 0：小票打印；1：显示彩种
        this.IsOddsUse = ko.observable(Utils.Cookie.get('IsOddsUse') === 'true');// 0：实际赔率； 1：转换赔率

        this.join = function () {
            var arr = [];
            ko.utils.arrayForEach(arguments, function (element) {
                element - 0 > 0 && arr.push(element);
            });
            return arr.join('/');
        }

        this.changeVal = function ($list, $data) {
            var v = $data.CommissionVal();
            if (that.multiChange()) {
                ko.utils.arrayForEach(that.list(), function (item) {
                    ko.utils.arrayForEach(item.list, function (element) {
                        if (element.MaxCommission < v) { //(element.MaxCommission < v) {
                            return;
                        }
                        element.CommissionVal(v);
                    });
                });
            } else {
                ko.utils.arrayForEach($list.list, function (item) {
                    item.CommissionVal(v);
                });
            }

            that.BetTypeSettingHasChanged = true;
        }
        //this.changeVal = function ($list, $data) {
        //    var v = $data.CommissionVal() - 0;

        //    //var diff = (v * $data.Multiple).toFixed(9) - 0,
        //    var minOdds;
        //    if ($data.BetTypeName.indexOf('O') > -1 || $data.BetTypeID === 13 || $data.BetTypeID === 17) {
        //        minOdds = $data.BLimitOdds1;
        //    } else {
        //        var oddsArr = [$data.BLimitOdds1 - 0, $data.BLimitOdds2 - 0, $data.BLimitOdds3 - 0, $data.BLimitOdds4 - 0];
        //        oddsArr.length = $data.BetTypeID - 12;
        //        minOdds = Math.min.apply(null, oddsArr);
        //    }
        //    var commisionVal = (minOdds * (1 - $data.PCommission - v)).toFixed($data.oddDigs) - 0//(minOdds - diff).toFixed(4) - 0;

        //    if (that.multiChange()) {
        //        ko.utils.arrayForEach(that.list(), function (item) {
        //            ko.utils.arrayForEach(item.list, function (element) {
        //                if (element.EndCommission < v) {
        //                    return;
        //                }
        //                element.CommissionVal(v);
        //            });
        //        });
        //    } else {
        //        ko.utils.arrayForEach($list.list, function (item) {
        //            item.CommissionVal(v);
        //            item.oddsVal(commisionVal);
        //        });
        //    }
        //    that.BetTypeSettingHasChanged = true;
        //}
        this.multiChange = ko.observable(false);
        this.multiChange.subscribe(function () {
            if (that.multiChange()) {
                var v = that.list()[0].list[0].CommissionVal();
                ko.utils.arrayForEach(that.list(), function (item) {
                    ko.utils.arrayForEach(item.list, function (element) {
                        if (element.MaxCommission < v) {
                            return;
                        }
                        element.CommissionVal(v);
                    });
                });
            }
        });

        var profileChang = function (newValue) {
            that.profileFormHasChanged = true;
           // console.log("profileFormHasChanged --> " + that.profileFormHasChanged)
        }
        this.IsEnter.subscribe(profileChang);
        this.IsShowLottory.subscribe(profileChang);
        this.IsOddsUse.subscribe(profileChang);
        //this.oddsValHandle = function ($list, $data) {
        //    var val = $data.oddsVal(), minOdds;
        //    if ($data.BetTypeName.indexOf('O') > -1 || $data.BetTypeID === 13 || $data.BetTypeID === 17) {
        //        minOdds = $data.PLimitOdds1;
        //    } else {
        //        var oddsArr = [$data.BLimitOdds1 - 0, $data.BLimitOdds2 - 0, $data.BLimitOdds3 - 0, $data.BLimitOdds4 - 0];
        //        oddsArr.length = $data.BetTypeID - 12;
        //        minOdds = Math.min.apply(null, oddsArr);
        //    }
        //    //(minVal * (1 - element.PCommission - element.Commission)
        //    var commisionVal = (1 - $data.PCommission - (minOdds / val)).toFixed(4) - 0; //((minOdds - val) / $data.Multiple).toFixed(4) - 0;
        //    ko.utils.arrayForEach($list.list, function (item) {
        //        item.oddsVal(val);
        //        item.CommissionVal(commisionVal);
        //    });
        //    that.BetTypeSettingHasChanged = true;
        //}

        this.CommissionList = ko.observableArray();
        //var that = this;
        this.list = ko.observableArray();

        this.AgentID = ko.observable(params.AgentID);
        this.LoginName = ko.observable(params.LoginName);

        this.SuperCompanyName = ko.observable(params.SuperCompanyName || "");
        this.isMember = ko.observable(params.isMember);


        this.MaxLimitSigleBet = ko.observable(params.MaxLimitSigleBet);//单注上限
        this.MaxLimitItemBet = ko.observable(params.MaxLimitItemBet);//单项上限
        function infoSubmit() {
            var IsEnter = that.IsEnter();// document.getElementById("IsEnter").checked;
            var IsShowLottory = that.IsShowLottory();// document.getElementById("IsShowLottory").checked;
            var IsOddsUse = that.IsOddsUse();//  document.getElementById("IsOddsUse").checked;
            $.ajax({
                url: "/index.php/Portal/Profile/ModifyMemberMode",
                type: "post",
                cache: false,
                data: { IsEnter: IsEnter, IsShowLottory: IsShowLottory, IsOddsUse: IsOddsUse },
                success: function (json) {
                    if (json.status == true) {
                        that.profileFormHasChanged = false;
                        // Utils.tip(json.info, json.status,2000);
                        Utils.tip(json.info, json.status, json.status ? function () {

                        } : null);
                        Utils.Cookie.remove('IsEnter', '/').remove('IsShowLottory', '/').remove('IsOddsUse', '/');

                        /*修改录码模式默认值*/
                        Utils.Cookie.set('IsEnter', IsEnter, 0, '/');//自动 false；回车 true
                        Utils.Cookie.set('IsShowLottory', IsShowLottory, 0, '/');// 0：小票打印；1：显示彩种
                        Utils.Cookie.set('IsOddsUse', IsOddsUse, 0, '/');// 0：实际赔率； 1：转换赔率
                        if (Utils.Cookie.get('IsShowLottory') == "false") { //如果IsShowLottory是false，表示是小票打印
                            document.getElementById("IsShowLottoryFalse").style.display = 'none';
                            document.getElementById("IsShowLottoryTrue").style.display = '';
                        } else {
                            document.getElementById("IsShowLottoryFalse").style.display = '';
                            document.getElementById("IsShowLottoryTrue").style.display = 'none';
                        }
                    }

                }
            });
        }
        /***修改会员录码模式****************************************************/
        $('#editsubmit').on('click', function () {
            if (that.BetTypeSettingHasChanged){
                //$("#BetTypeSettingForm").submit();
                that.sub($("#BetTypeSettingForm"));
            }
            else if (that.profileFormHasChanged) {
                infoSubmit();
            }
        });

        /// 提交表单**限额设置***********************************************************************************/
        this.sub = function ($form) {
            var data = that.Validate();
            //console.log(data);
            if (!data.status) return Utils.tip(data.info, 0);

            var d = {
                list: JSON.stringify(data.data)
            }
            $.ajax({
                url: '/index.php/Portal/Profile/ModifyMemberBetTypeSetting',
                type: "post",
                data: d,
                success: function (json) {
                    if (json.status) that.BetTypeSettingHasChanged = false;
                    if (!that.profileFormHasChanged){
                        Utils.tip(json.info, json.status, json.status ? function () {
                            that.back();
                        } : null);
                    }
                    else {
                        infoSubmit();
                    }
                }
            });
        }
        this.init();
    };



    AccountList.prototype.init = function () {
        this.GetData();
    };
    //获取限额信息
    AccountList.prototype.GetData = function (id) {

        /*会员资料*/
        document.getElementById("MemberLoginNo").innerHTML = Utils.Cookie.get('LoginName');//账号名称
        document.getElementById("MemberName").innerHTML = Utils.Cookie.get('NickName');//昵称
        document.getElementById("MemberDefaultCredit").innerHTML = Utils.Cookie.get('DefaultCredit');//总信用额度


        var that = this;
        //var isMember = that.params.isMember;
        //if (isMember === undefined) {
        //    isMember = "false";
        //}
        $.ajax({
            url: "/index.php/Portal/Profile/GetMemberCommission", //获取限额列表信息
            data: { isMember: true },
            cache: false,
            dataType: "json",
            success: function (json) {
                var dataArr = [], dataObj = {}, defaultsel = [];
                ko.utils.arrayForEach(json, function (element) {
                    var count = element.BetTypeName.times('O');
                    element.MinLimitBetAmount = ko.observable(element.MinLimitBetAmount - 0).extend({ limitDP: { range: [element.PMinLimitBetAmount], fix: 1 } });
                    element.CommissionList = Utils.step(element.MaxCommission - 0, element.SpaceBetween - 0, element.BeginCommission - 0);//(element.MaxCommission - 0, 0.001, 0);
                    element.CommissionVal = ko.observable(0);
                    for (var i = 1; i < 5; i++) {
                        var calcOdds = element['BLimitOdds' + i] - element['HLimitOdds' + i] * (element.PCommission + element.CommissionVal()) //* (1 - element.PCommission - element.CommissionVal());
                        calcOdds = calcOdds.toFixed(9) - 0;
                        element['Odds' + i] = ko.observable(calcOdds);
                    }
                    element.CommissionVal.subscribe(function () {
                        var PCommission = element.CommissionVal();
                        for (var i = 1; i < 5; i++) {
                            var calcOdds = element['BLimitOdds' + i] - element['HLimitOdds' + i] * (element.PCommission + element.CommissionVal());
                            calcOdds = calcOdds.toFixed(9) - 0;
                            element['Odds' + i](calcOdds);
                        }
                    });
                    //element.oddsVal = ko.observable();;
                    ////var tt = '' + ((element.Multiple / 1000).toFixed(4) - 0);
                    ////tt = tt.split('.');
                    ////element.oddDigs = tt.length > 1 ? tt[1].length : 0;
                    //element.oddDigs = 9;
                    //var oddsRange = (function () {
                    //    /// 只有一个赔率的处理
                    //    if (element.BetTypeName.indexOf('O') > -1 || element.BetTypeID === 13 || element.BetTypeID === 17) {
                    //        //* (1 - element.PCommission - element.MaxCommission)
                    //        var min = (element.BLimitOdds1 - element.HLimitOdds1 * (element.PCommission + element.CommissionVal())).toFixed(element.oddDigs) - 0;
                    //        element.oddsVal(min);
                    //        return Utils.step(element.BLimitOdds1 - 0, (element.Multiple / 1000).toFixed(4) - 0, min);
                    //    }                            // 多个赔率取最小者
                    //    else {
                    //        var oddsArr = [element.BLimitOdds1 - 0, element.BLimitOdds2 - 0, element.BLimitOdds3 - 0, element.BLimitOdds4 - 0];
                    //        oddsArr.length = element.BetTypeID - 12;
                    //        var minVal = Math.min.apply(null, oddsArr);
                    //        var min = (minVal * (1 - element.PCommission - element.MaxCommission)).toFixed(element.oddDigs) - 0;
                    //        element.oddsVal((minVal * (1 - element.PCommission - element.Commission)).toFixed(element.oddDigs) - 0);
                    //        return Utils.step(minVal, (element.Multiple / 1000).toFixed(4) - 0, min);
                    //    }
                    //    //if (element.BetTypeName.indexOf('O') > -1 || element.BetTypeID === 13 || element.BetTypeID === 17) {
                    //    //    var min = (element.PLimitOdds1 - element.Multiple * element.EndCommission).toFixed(4) - 0;
                    //    //    element.oddsVal((element.PLimitOdds1 - element.Multiple * element.Commission).toFixed(4) - 0);
                    //    //    return Utils.step(element.PLimitOdds1 - 0, (element.Multiple / 1000).toFixed(4) - 0, min);
                    //    //}                            // 多个赔率取最小者
                    //    //else {
                    //    //    var oddsArr = [element.PLimitOdds1 - 0, element.PLimitOdds2 - 0, element.PLimitOdds3 - 0, element.PLimitOdds4 - 0];
                    //    //    oddsArr.length = element.BetTypeID - 12;
                    //    //    var minVal = Math.min.apply(null, oddsArr);
                    //    //    var min = (minVal - element.Multiple * element.EndCommission).toFixed(4) - 0;
                    //    //    element.oddsVal((minVal - element.Multiple * element.Commission).toFixed(4) - 0);
                    //    //    return Utils.step(minVal, (element.Multiple / 1000).toFixed(4) - 0, min);
                    //    //}
                    //})();
                    //element.OddsRangeList = oddsRange.reverse();
                    element.MaxLimitItemBet = ko.observable(element.MaxLimitItemBet).extend({ limit: { fix: 0 } });
                    element.MaxLimitSigleBet = ko.observable(element.MaxLimitSigleBet).extend({ limit: { fix: 0 } });
                    element.MaxLimitSigleBet.subscribe(function () {
                        var v = element.MaxLimitSigleBet();
                        ko.utils.arrayForEach(json, function (a) {
                            if (element.BetTypeName.indexOf('O') > -1) {
                                a.BetTypeName.times('O') === element.BetTypeName.times('O') && a.MaxLimitSigleBet(v);
                            } else {
                                a.BetTypeName === element.BetTypeName && a.MaxLimitSigleBet(v);
                            }
                        });
                    });
                    defaultsel.push({ BetTypeName: element.BetTypeName, select: element.Commission });

                    var title;
                    if (count === 2) {
                        title = '二定位';
                    } else if (count === 3) {
                        title = '三定位';
                    } else {
                        title = element.BetTypeName;
                    }
                    dataObj[title] = dataObj[title] || [];
                    dataObj[title].push(element);
                    element.CommissionVal(element.Commission);
                });
                for (var i in dataObj) {
                    dataArr.push({
                        title: dataObj[i].length === 1 ? false : i,
                        list: dataObj[i]
                    });
                }
                that.list(dataArr);
                $('.form-control').each(function (index, value, self) {
                    value.value = defaultsel[index].select - 0;
                });
                $('.lowest input').qtip({ content: { text: '最小下注不能大于单注上限' } });
                $('.single-upper input').qtip({ content: { text: '单注上限不能超过单项上限' } });
            }
        });
    }

    AccountList.prototype.Validate = function () {
        var that = this;
        var errors = [], oklist = [];
        var list = that.list();
        for (var i = 0, len1 = list.length; i < len1; i++) {
            for (var j = 0, len2 = list[i].list.length; j < len2; j++) {
                var item = list[i].list[j];
                if (item.MaxLimitSigleBet() - 0 > item.PMaxLimitSigleBet - 0) {
                    return { status: false, info: item.BetTypeName + '单注上限 不能超过' + item.PMaxLimitSigleBet };
                } else if (item.MaxLimitItemBet() - 0 > item.PMaxLimitItemBet - 0) {
                    return { status: false, info: item.BetTypeName + '单项上限 不能超过' + item.PMaxLimitItemBet };
                } else if (item.MaxLimitSigleBet() - 0 > item.MaxLimitItemBet() - 0) {
                    return { status: false, info: item.BetTypeName + '单注上限 不能大于 单项上限' };
                }
                else if (item.MinLimitBetAmount() - 0 > item.MaxLimitSigleBet() - 0) {
                    return { status: false, info: item.BetTypeName + '最小下注 不能超过' + item.MaxLimitSigleBet() };
                }
                oklist.push({
                    MinLimitBetAmount: item.MinLimitBetAmount(),//最小下注金额
                    BetTypeID: item.BetTypeID,
                    MaxLimitSigleBet: item.MaxLimitSigleBet(),//单注上限
                    MaxLimitItemBet: item.MaxLimitItemBet(),//单项上限
                    Commission: item.CommissionVal(),//赚水
                    BetTypeName: item.BetTypeName,
                    Lottery: item.Lottery,
                    MaxLimitStore: item.MaxLimitStore//,
                    //Odds1: item.Odds1() || "0",
                    //Odds2: item.Odds2() || "0",
                    //Odds3: item.Odds3() || "0",
                    //Odds4: item.Odds4() || "0"

                });
            }
        }
        return { status: true, data: oklist };
    };
    AccountList.prototype.back = function () {
        var that = this,
            params = that.params;
        if (params.isMember) {
            framework.view("/index.php/Portal/Member/index", "Member/index", { AgentID: params.ParentID, history: params.history, ParentID: params.MemberParentID });
        }
        else {
            //framework.view('/NewSubordinate/index', 'NewSubordinate/Index', { AgentID: params.ParentID, history: params.history });
        }
    };
    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };
});

