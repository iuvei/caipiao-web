///  
/// <reference path="../_ref.js" />
define(function (require, exports, module) {
    var AccountList = function (params) {
        params = params || {}; /// 从列表中带来的参数       
        var that = this;
        this.params = params;

        /*
       设置限额控制:
       1.IsEditComm  为true时才可以修改赚水，反之不可以修改。
       2.IsEditOdds  为true时才可以修改限额（最小下注，单注上限，单项上限）
       */
        this.IsEditComm = false;
        this.IsEditOdds = false;
        var CompanyType = Utils.Cookie.get('CompanyType');
        if (CompanyType == 0) {
            this.IsEditComm = false;
            this.IsEditOdds = false;
        } else {
            if (Utils.Cookie.get('IsEditComm') === "true") {
                this.IsEditComm = false;
            } else {
                this.IsEditComm = true;
            }
            if (Utils.Cookie.get('IsEditOdds') === "true") {
                this.IsEditOdds = false
            } else {
                this.IsEditOdds = true;

            }
        }

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
        }
        this.multiChange = ko.observable(false);
        this.multiChange.subscribe(function () {
            if (that.multiChange()) {
                var v = that.list()[0].list[0].CommissionVal();
                ko.utils.arrayForEach(that.list(), function (item) {
                    ko.utils.arrayForEach(item.list, function (element) {
                        if (element.MaxCommission < v) { //if (element.MaxCommission < v) {
                            return;
                        }
                        element.CommissionVal(v);
                    });
                });
            }
        });

        this.CommissionList = ko.observableArray();
        //var that = this;
        this.list = ko.observableArray();

        this.AgentID = ko.observable(params.AgentID);
        this.LoginName = ko.observable(params.LoginName);

        this.SuperCompanyName = ko.observable(params.SuperCompanyName || "");
        this.isMember = ko.observable(params.isMember);


        this.MaxLimitSigleBet = ko.observable(params.MaxLimitSigleBet);//单注上限
        this.MaxLimitItemBet = ko.observable(params.MaxLimitItemBet);//单项上限 

        /// 提交表单*************************************************************************************/
        this.sub = function ($form) {
            var that = this,
            params = that.params;
            var data = that.Validate();
            if (!data.status) return Utils.tip(data.info, false, 3000, true ? function () {

            } : null);  
            //console.log(JSON.stringify(data.data));

            var d = {
                SuperCompanyName: that.SuperCompanyName(),
                isMember: that.isMember(),
                UserName: that.LoginName(),
                list: JSON.stringify(data.data)
            }
            //console.log(d); 
            // data.UserName = that.LoginName();

            $.ajax({
                url: '/index.php/portal/agent/ModifyAgentBetTypeSetting',
                type: "post",
                data: d,
                success: function (json) {
                    if (params.back && $.isFunction(params.back)) {
                        Utils.tip(json.info, json.status, json.status ? function () {
                            if (params.back && $.isFunction(params.back)) {
                                params.back();
                            }
                        } : null);
                    }
                    else {
                        Utils.tip(json.info, json.status,3000)
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

        var that = this;
        var isMember = that.params.isMember;
        if (isMember === undefined) {
            isMember = "false";
        }
        $.ajax({
            url: "/index.php/portal/agent/GetAgentCommission",
            data: { AgentID: id || that.AgentID, isMember: isMember },
            cache: false,
            dataType: "json",
            success: function (json) {
                if ($.isArray(json)) {
                    json.sort(function (a, b) {
                        if(a['BetTypeID']>19){
                            a['BetTypeID']=a['BetTypeID']-25;
                        }
                        return a['BetTypeID'] - b['BetTypeID'];
                    });

                    var dataArr = [], dataObj = {}, defaultsel = [];
                    ko.utils.arrayForEach(json, function (element) {
                        element.MinLimitBetAmount = ko.observable(element.MinLimitBetAmount - 0).extend({ limitDP: { range: [element.PMinLimitBetAmount], fix: 1 } });
                        element.CommissionList = Utils.step(element.MaxCommission - 0, element.SpaceBetween - 0, element.BeginCommission - 0);//Utils.step(element.MaxCommission - 0, 0.001, 0);
                        element.CommissionVal = ko.observable(0);
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
                        //var diff = ((element.CommissionVal() - 0) * element.Multiple).toFixed(9) - 0;
                        //element.Odds1 = ko.observable((element.PLimitOdds1 - 0 - diff) > 0 ? (element.PLimitOdds1 - 0 - diff).toFixed(9) - 0 : '');
                        //element.Odds2 = ko.observable((element.PLimitOdds2 - 0 - diff) > 0 ? (element.PLimitOdds2 - 0 - diff).toFixed(9) - 0 : '');
                        //element.Odds3 = ko.observable((element.PLimitOdds3 - 0 - diff) > 0 ? (element.PLimitOdds3 - 0 - diff).toFixed(9) - 0 : '');
                        //element.Odds4 = ko.observable((element.PLimitOdds4 - 0 - diff) > 0 ? (element.PLimitOdds4 - 0 - diff).toFixed(9) - 0 : '');
                        for (var i = 1; i < 5; i++) {
                            var calcOdds = element['BLimitOdds' + i] - element['HLimitOdds' + i] * (element.PCommission + element.CommissionVal() ) //* (1 - element.PCommission - element.CommissionVal());
                            calcOdds = calcOdds.toFixed(9) - 0;
                            element['Odds' + i] = ko.observable(calcOdds);
                        }
                        element.CommissionVal.subscribe(function () {
                            //var diff = ((element.CommissionVal() - 0) * element.Multiple).toFixed(9) - 0;
                            //element.Odds1((element.PLimitOdds1 - 0 - diff) > 0 ? (element.PLimitOdds1 - 0 - diff).toFixed(9) - 0 : '');
                            //element.Odds2((element.PLimitOdds2 - 0 - diff) > 0 ? (element.PLimitOdds2 - 0 - diff).toFixed(9) - 0 : '');
                            //element.Odds3((element.PLimitOdds3 - 0 - diff) > 0 ? (element.PLimitOdds3 - 0 - diff).toFixed(9) - 0 : '');
                            //element.Odds4((element.PLimitOdds4 - 0 - diff) > 0 ? (element.PLimitOdds4 - 0 - diff).toFixed(9) - 0 : '');
                            var PCommission = element.CommissionVal();
                            for (var i = 1; i < 5; i++) {
                                var calcOdds = element['BLimitOdds' + i] - element['HLimitOdds' + i] * (element.PCommission + element.CommissionVal());// * (1 - element.PCommission - PCommission);
                                calcOdds = calcOdds.toFixed(9) - 0;
                                element['Odds' + i](calcOdds);
                            }
                        });
                        var count = element.BetTypeName.times('O');
                        var title;
                        if (count === 1) {
                            title = '一定位';
                        }
                        else if (count === 2) {
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
                    return { status: false, info: item.BetTypeName + '最小下注 不能超过 单注上限' + item.MaxLimitSigleBet() };
                }
                else if (item.MinLimitBetAmount() - 0 < item.PMinLimitBetAmount - 0) {
                    return { status: false, info: item.BetTypeName + '最小下注 不能小于 最小下注' + item.PMinLimitBetAmount };
                }
                oklist.push({
                    MinLimitBetAmount: item.MinLimitBetAmount(),//最小下注金额
                    BetTypeID: item.BetTypeID,
                    MaxLimitSigleBet: item.MaxLimitSigleBet(),//单注上限
                    MaxLimitItemBet: item.MaxLimitItemBet(),//单项上限
                    Commission: item.CommissionVal(),//赚水
                    BetTypeName: item.BetTypeName,
                    Lottery: item.Lottery,
                    MaxLimitStore: item.MaxLimitStore,
                    Odds1: item.Odds1() || "0",
                    Odds2: item.Odds2() || "0",
                    Odds3: item.Odds3() || "0",
                    Odds4: item.Odds4() || "0"

                });
            }
        }
        return { status: true, data: oklist };
    };
    AccountList.prototype.back = function () {
        var that = this,
            params = that.params;
        if(params.back && $.isFunction(params.back)){
            params.back();
        }
        else if (params.isMember && !params.isNotAdd) {
            framework.view("/index.php/portal/agent/Member", "Member/index", { AgentID: params.ParentID, history: params.history, newParentID: params.MemberParentID, ParentID: params.ParentID, IsAgentEditMember: params.IsAgentEditMember, LevelName: params.LevelName });
        }
        else {
            framework.view('/index.php/portal/agent/NewSubordinate', 'NewSubordinate/Index', { AgentID: params.ParentID, history: params.history });
        }
    };
    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };
});