///栏货金额
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var Commission = function (params) {
        params = params || {};
        var that = this;
        this.params = params;
        this.list = ko.observableArray();
        this.isInheritComm = ko.observable(false);//false 可修改
        if (Utils.Cookie.get('CompanyType') - 0 == 1) {  //如果子公司继承定盘，定盘数据不可更改。只可以查看。
            if (Utils.Cookie.get('IsInheritComm') == "true") {
                that.isInheritComm(true);
            }
        }
        //添加赔率
        this.oprater = function (data, event) {
            var
                 target = $(event.target),
                 flags = target.data('flags'),
                 data;
            if (!(flags === 'add' || flags === 'abatch')) {
                return;
            }
            data = ko.toJS(ko.dataFor(target[0]));
            data.ZCompanyID=that.ZCompanyID();
            data.IsZCompany = that.IsZCompany();
            if (flags === 'add') {
                framework.view("/index.php/portal/agent/AddOdds", "BatchOdds/AddOdds", data);
            }
            else if (flags === 'abatch') {
                framework.view("/index.php/portal/agent/aBatch", "BatchOdds/aBatch", data);
            }
            return false;
        }
        /**A分批******/
        this.aBatch = function ($data) {
            framework.view("/index.php/portal/agent/ABatch", "BatchOdds/ABatch", $data);
        };
        this.betTypeID = params.betTypeID;
        this.isBack = ko.observable(params.betTypeID !== undefined);
        this.change = function (data, event) {
            if (data.parentID == null) return;
            var
                list = that.list(),
                target = $(event.target),
                changeVar = /textinput:(\w*)/.exec(target.data('bind'))[1],  //取到改变的变量
                changeValue = target.val();
            if (changeVar === 'MaxLimitItemBet' || changeVar === 'minLimitOdds' || changeVar === 'upperLimit') {
                return;
            }
            $.each(list, function (index, value) {
                if (value.parentID === data.parentID) {
                    value[changeVar] && $.isFunction(value[changeVar]) && value[changeVar](changeValue);
                }
            });
        };

        /**总公司查询子公司定盘：参数**************/
        this.IsZCompany = ko.observable(params.IsZCompany ||false);
        this.ZCompanyID = ko.observable(params.ZCompanyID || 0);

        this.getData(this.betTypeID);
    }
    $.extend(Commission.prototype, {
        fn: Commission,
        getData: function (id) {
            var
                that = this,
                arr = [],
                //需要转换成observable的变量
                upperLimit,
                maxLimit,
                getLocationUrl = "/index.php/portal/agent/GetCompanyFixSettingByID",
                isDingPan = true,//isDingPan为true表示是获取定盘数据，false是下级管理的限额设置数据
                AgentID = Utils.Cookie.get('AccountID') - 0;
            if (1) {  //如果子公司继承定盘，定盘数据不可更改。只可以查看。//Utils.Cookie.get('CompanyType') - 0 == 1
                if (1) {//Utils.Cookie.get('IsInheritComm') == "true"
                    getLocationUrl = "/index.php/portal/agent/GetAgentCommission";
                    isDingPan = false;
                }
            }
            if (Utils.Cookie.get('IsSubAccount') == "true") {//如果是子账号
                AgentID = Utils.Cookie.get('ParentId');
            }
            $.ajax({
                url: getLocationUrl,
                data: {
                    ZCompanyID: that.ZCompanyID(),
                    IsZCompany: that.IsZCompany(),
                    AgentID: AgentID,
                    isMember:false
                },
                cache: false,
                dataType: "json",
                success: function (json) {
                    $.each(json, function (index, value) {
                        /*if (isDingPan == true) {
                            upperLimit = value['MaxLimitOdds1'] + "/" + value['MaxLimitOdds2'] + "/" + value['MaxLimitOdds3'] + "/" + value['MaxLimitOdds4'];//拼接赔率上限
                        } else if (isDingPan == false) {
                            upperLimit = value['PLimitOdds1']+"/"+ value['PLimitOdds2']+"/"+value['PLimitOdds3']+"/"+ value['PLimitOdds4'];//拼接赔率上限
                        }*/
                        if (value.BetTypeID - 0 >= 2 && value.BetTypeID - 0 <= 7) {//二定位
                            minLimitOdds = value['MinLimitOdds1'];
                            if (isDingPan == true) {
                                upperLimit = value['MaxLimitOdds1'];//拼接赔率上限
                            } else if (isDingPan == false) {
                                upperLimit = value['LimitOdds1'];//拼接赔率上限
                            }
                        }
                        if (value.BetTypeID - 0 >= 9 && value.BetTypeID - 0 <= 12) {//三定位
                            minLimitOdds = value['MinLimitOdds1'];
                            if (isDingPan == true) {
                                upperLimit = value['MaxLimitOdds1'];//拼接赔率上限
                            } else if (isDingPan == false) {
                                upperLimit = value['LimitOdds1'];//拼接赔率上限
                            }
                        }
                        if (value.BetTypeID - 0==13) {//四定位
                            minLimitOdds = value['MinLimitOdds1'];
                            if (isDingPan == true) {
                                upperLimit = value['MaxLimitOdds1'];//拼接赔率上限
                            } else if (isDingPan == false) {
                                upperLimit = value['LimitOdds1'];//拼接赔率上限
                            }
                        }
                        if (value.BetTypeID - 0 == 14) {//二字现
                            minLimitOdds = value['MinLimitOdds1'] + "/" + value['MinLimitOdds2'];
                            if (isDingPan == true) {
                                upperLimit = value['MaxLimitOdds1'] + "/" + value['MaxLimitOdds2'];//拼接赔率上限
                            } else if (isDingPan == false) {
                                upperLimit = value['LimitOdds1'] + "/" + value['LimitOdds2'];//拼接赔率上限
                            }
                        }
                        if (value.BetTypeID - 0 == 15) {//三字现
                            minLimitOdds = value['MinLimitOdds1'] + "/" + value['MinLimitOdds2'] + "/" + value['MinLimitOdds3'];
                            if (isDingPan == true) {
                                upperLimit = value['MaxLimitOdds1'] + "/" + value['MaxLimitOdds2'] + "/" + value['MaxLimitOdds3'];//拼接赔率上限
                            } else if (isDingPan == false) {
                                upperLimit = value['LimitOdds1'] + "/" + value['LimitOdds2'] + "/" + value['LimitOdds3'];//拼接赔率上限
                            }
                        }
                        if (value.BetTypeID - 0 == 16) {//四字现
                            minLimitOdds = value['MinLimitOdds1'] + "/" + value['MinLimitOdds2'] + "/" + value['MinLimitOdds3'] + "/" + value['MinLimitOdds4'];
                            if (isDingPan == true) {
                                upperLimit = value['MaxLimitOdds1'] + "/" + value['MaxLimitOdds2'] + "/" + value['MaxLimitOdds3'] + "/" + value['MaxLimitOdds4'];//拼接赔率上限
                            } else if (isDingPan == false) {
                                upperLimit = value['LimitOdds1'] + "/" + value['LimitOdds2'] + "/" + value['LimitOdds3'] + "/" + value['LimitOdds4'];//拼接赔率上限
                            }
                        }
                        if (value.BetTypeID - 0 == 17) {//四五二定位
                            minLimitOdds = value['MinLimitOdds1'];
                            if (isDingPan == true) {
                                upperLimit = value['MaxLimitOdds1'];//拼接赔率上限
                            } else if (isDingPan == false) {
                                upperLimit = value['LimitOdds1'];//拼接赔率上限
                            }
                        } if (value.BetTypeID - 0 == 18) {//四五二定位
                            minLimitOdds = value['MinLimitOdds1'];
                            if (isDingPan == true) {
                                upperLimit = value['MaxLimitOdds1'];//拼接赔率上限
                            } else if (isDingPan == false) {
                                upperLimit = value['LimitOdds1'];//拼接赔率上限
                            }
                        }
                        //value.BetTypeName = '';
                        /**
                        *添加第一个元素作为父玩法的标题
                        *除了标题之外还需要取第一个元素的倍数(multiple)
                        *子类改变一行,其他的子类都必须改变,使用parentID来做分类。
                        */
                        if (value.BetTypeID == '2') {
                            arr.push({
                                BetTypeName: '二定位',
                                hidden: true,
                                multiple: value.Multiple,
                                parentID: 1,
                                isParent: true,
                                upperLimit: upperLimit,
                                minLimitOdds: minLimitOdds
                            });
                        }
                        //三字定也需要父玩法的标题
                        if (value.BetTypeID == '9') {
                            arr.push({
                                BetTypeName: '三定位',
                                hidden: true,
                                parentID: 8,
                                isParent: true,
                                multiple: value.Multiple,
                                upperLimit: upperLimit,
                                minLimitOdds: minLimitOdds
                            });
                        };
                        value.hidden = false;
                        value.upperLimit = upperLimit;
                        value.minLimitOdds = minLimitOdds;
                        value.multiple = value.Multiple;
                        value._init = $.extend({}, value); //记录初始状态

                        //转换成Observable
                        $.each(that.fn.convertList, function (key, prop) {
                            value[prop] = ko.observable(value[prop]);
                            if (prop !== 'upperLimit' && prop !== 'minLimitOdds') {
                                value[prop].extend({ limit: { fix: 4 } });
                            }
                        });

                        if (value.BetTypeID < 8) {
                            value.parentID = 1;
                        }
                        else if (value.BetTypeID < 13) {
                            value.parentID = 8;
                        }
                        else {
                            value.parentID = value.BetTypeID;
                            value.isParent = true;
                        }
                        arr.push(value);
                    })
                    that.list(arr);
                }
            });
        },
        /**
        *连接赔率,为空忽略
        */
        concatOdds: function () {
            var
                arg = [].concat.apply([], arguments),
                len = arg.length;
            while (len--) {
                if (arg[len] - 0 === 0) {
                    arg.splice(len, 1);
                }
            }
            return arg.join('/');
        },
        check: function () {
            var
                that = this,
                list = that.list(),
                len = list.length,
                convert = that.fn.convertList,
                cLen,
                count,
                checkResult = {
                    result: [],
                    msg: '',
                    success: true
                },
                single,
                oddsSplit;
            while (len--) {
                single = list[len];
                cLen = convert.length;
                count = that.fn.oddsCount[single['BetTypeID']] || 1;
                if ($.isFunction(single['upperLimit']) && single['BetTypeID']-0>=14) {
                    oddsSplit = ("" + single['upperLimit']()).split('/')
                    if (oddsSplit.length !== count) {
                        checkResult.msg = single['BetTypeName'] + '的赔率上限个数应为' + count + '个';
                    }
                    else {
                        $.each(oddsSplit, function (index, value) {
                            if (isNaN(value - 0) || $.trim(value) === '') {
                                checkResult.msg = single['BetTypeName'] + '填写错误';
                            }
                        });
                    }
                    if (checkResult.msg) {
                        checkResult.result = [];
                        checkResult.success = false;
                        break;
                    }
                }
                if ($.isFunction(single['minLimitOdds']) && single['BetTypeID'] - 0 >= 14) {
                    oddsSplit = ("" + single['minLimitOdds']()).split('/')
                    if (oddsSplit.length !== count) {
                        checkResult.msg = single['BetTypeName'] + '的赔率下限个数应为' + count + '个';
                    }
                    else {
                        $.each(oddsSplit, function (index, value) {
                            if (isNaN(value - 0) || $.trim(value) === '') {
                                checkResult.msg = single['BetTypeName'] + '填写错误';
                            }
                        });
                    }
                    if (checkResult.msg) {
                        checkResult.result = [];
                        checkResult.success = false;
                        break;
                    }
                }
                /**
                *convert 列举出了用户可以修改的所有参数，在list中查找这个这些参数，如果与初始数据不一致，表示用户修改了该项。
                */
                while (cLen--) {
                    if ($.isFunction(single[convert[cLen]])) {
                        //对比初始数据
                        if (single[convert[cLen]]() != single._init[convert[cLen]]) {
                            checkResult.result.push(single);
                            break;
                        }
                    }
                }
            }
            return checkResult;
        },
        submit: function () {
            var
                that = this,
                checkResult = this.check(),
                params = [],
                paramsKey = ['BetTypeID', 'MinLimitBetAmount', 'upperLimit', 'minLimitOdds', 'Lottery', 'MaxLimitItemBet', 'MaxLimitSigleBet'];
            if (!checkResult.success) {
                Utils.tip(checkResult.msg, checkResult.success);
                return;
            }
            if (!checkResult.result.length) {
                Utils.tip('没有做任何修改', false, 3000, true ? function () {

                } : null);
                return;
            }
            $.each(checkResult.result, function (index, value) {
                var
                      single = {},
                      oddsSplit;
                $.each(paramsKey, function (key, prop) {
                    if (prop === 'upperLimit') {
                        oddsSplit = '' + value[prop]();
                        if (single['BetTypeID'] - 0 >= 14) {
                            oddsSplit = oddsSplit.split('/');
                            single['MaxLimitOdds1'] = oddsSplit[0] || 0;
                            single['MaxLimitOdds2'] = oddsSplit[1] || 0;
                            single['MaxLimitOdds3'] = oddsSplit[2] || 0;
                            single['MaxLimitOdds4'] = oddsSplit[3] || 0;
                        } else {
                            single['MaxLimitOdds1'] = oddsSplit;
                        }

                    }
                    else if (prop === 'minLimitOdds') {
                        oddsSplit = '' + value[prop]();
                        if (single['BetTypeID'] - 0 >= 14) {
                            oddsSplit = oddsSplit.split('/');
                            single['MinLimitOdds1'] = oddsSplit[0] || 0;
                            single['MinLimitOdds2'] = oddsSplit[1] || 0;
                            single['MinLimitOdds3'] = oddsSplit[2] || 0;
                            single['MinLimitOdds4'] = oddsSplit[3] || 0;
                        } else {
                            single['MinLimitOdds1'] = oddsSplit;
                        }
                    }
                    else {
                        single[prop] = $.isFunction(value[prop]) ? value[prop]() : value[prop];
                    }
                });
                params.push(single);
            });
            $.post('/index.php/portal/agent/ModifyCompanyFixSetting',
                { LsSetting: JSON.stringify(params) },
                function (json) {
                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                    } : 1000);
                    if (json.status) {
                        that.reInit(checkResult.result, '_init', function () { that.getData() });
                    }
                });
        },
        /**
        *重新初始化,数据提交完成之后,将attr覆盖为当前的数据。
        *@param  list         {Array}    需要初始化的数组
        *@param  [attr=_init] {String}   需要被最新数据覆盖的属性
        *@param  [fn]           {Function} 初始化完成之后的回调函数
        */
        reInit: function (list, attr, fn) {
            var
                that = this;
            list = !$.isArray(list) ? [] : list;
            if ($.isFunction(attr)) {
                fn = attr;
                attr = '_init';
            }
            if (typeof attr !== 'string' || attr.length <= 0) {
                attr = '_init';
            }
            $.each(list, function (index, value) {
                $.each(that.fn.convertList, function (key, prop) {
                    value[attr][prop] = $.isFunction(value[prop]) ? value[prop]() : value[prop]
                });
            });
            fn && fn();
        },
        back: function () {
            framework.view('/index.php/portal/agent/Master', 'master/index', { betTypeID: this.betTypeID });
        }
    });
    $.extend(Commission, {
        convertList: ['MinLimitBetAmount', 'upperLimit', 'MaxLimitSigleBet', 'MaxLimitItemBet', 'minLimitOdds'],
        oddsCount: {
            14: 2,
            15: 3,
            16: 4
        }
    })
    exports.viewmodel = Commission;
});