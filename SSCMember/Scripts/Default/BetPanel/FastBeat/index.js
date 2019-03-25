///
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var oneFix = ['口XXX', 'X口XX', 'XX口X', 'XXX口', 'XXXX口'];
    var AccountList = function () {
        var that = this;//,
        this.periodslist = ko.observableArray();//压停号码：获取三期期数
        this.list = ko.observableArray();
        this.sanzixian = ko.observable(false);
        this.erzixian = ko.observable(false);

        this.currentType = ko.observable(0); //0: 无, 1: 四字现, 2: XXX囗囗(4，5位)
        this.currentType.subscribe(function (newV) {
            that.sizixian(newV === 1);
            if (newV >= 2) {
                that.quanZhuang(false);
                document.getElementById("NumberFastBeat").focus();
                document.getElementById("NumberFastBeat").select();
            }
            that.number("");
        })

        this.IsSingleBack = ko.observable(Utils.Cookie.get('IsSingleBack') == "true" ? false : true);//IsSingleBack true 为单个退码，隐藏全选按钮(为了隐藏全选按钮，取反值的；如果是返回true单个退码，设IsSingleBack为false)
        this.SecondStopEarly = ko.observable(Utils.Cookie.get('SecondStopEarly'));//SecondStopEarly:二字定封盘前多少分钟内不能下注
        ///打印
        this.Print = function () {
            var match = /<!--print startStopList-->( .+? )<!--print endStopList-->/;
            var startnum = window.document.body.innerHTML.indexOf("<!--print startStopList-->");
            var endnum = window.document.body.innerHTML.indexOf("<!--print endStopList-->");
            var xx = window.document.body.innerHTML.substring(startnum, endnum);
            window.document.body.innerHTML = xx;
            window.print();
            window.location.reload();
            /*var
                 leftTable = $('.user').parent('td'),
                 stopnumber = $('#stopnumber');
            leftTable.addClass('no-print');
            stopnumber.removeClass('overFlow');
            window.print();
            leftTable.removeClass('no-print');
            stopnumber.addClass('overFlow');*/
        }
        this.periodsStatus = ko.observable(((!!Utils.Cookie.get('PeriodsID')) && Utils.Cookie.get('PeriodsStatus') == 1) ? true : false);
        // !!Utils.Cookie.get('PeriodsID') || Utils.Cookie.get('PeriodsStatus') - 0 !== 0;     //期数状态,如果为true，则为开盘
        /*获取停用号码------开始*/
        this.PeriodsNumber = ko.observable();
        this.stopnumberList = ko.observableArray();
        this.deletestopList = ko.observableArray();///删除停押号码保留区
        this.CkeckinputValue = ko.observable(false);
        this.CkeckinputValueDelete = ko.observable(false);
        this.CountStopNumber = ko.observable(0);
        this.CountStopMoney = ko.observable(0);
        this.CountDeleteStopNumber = ko.observable(0);
        this.CountDeleteStopMoney = ko.observable(0);
        this.TopEightList = ko.observableArray();
        this.CkeckinputValue.subscribe(function (newValue) {/*目前压停号码：全选*/
            if (newValue) {
                that.cancelStopCheckAll(!newValue);
            } if (!that.cancelStopCheckAll()) {
                setTimeout(function () {
                    $.each(that.stopnumberList(), function (index, value) {
                        value.checkedstop && value.checkedstop(newValue);
                    });
                }, 10);
            }

        });
        this.cancelStopCheckAll = ko.observable(false);
        this.CkeckinputValueDelete.subscribe(function (newValue) {/*删除停押号码保留区:全选*/
            setTimeout(function () {
                $.each(that.deletestopList(), function (index, value) {
                    value.checkedstopdelete && value.checkedstopdelete(newValue);
                });
            }, 10);
        });

        this.deleteStopNumber = function () {/***********压停号码删除**********************************************************/
            var that = this;
            var arr = [];
            $.each(that.stopnumberList(), function (index, value) {
                var single = [];
                if (value.checkedstop && value.checkedstop()) {
                    single = value.ID;//压停号码ID
                    arr.push(single);
                }
            });
            if (arr.length == 0) {
                //  Utils.tip("请勾选需要删除的号码", false);
                Utils.tip("请勾选需要删除的号码!", false, true ? function () {

                } : null);
            } else {
                var that = this;
                $.ajax({
                    url: "/index.php/Portal/FastBeat/DeleteStopBetNumber",
                    type: "post",
                    data: {
                        lsIds: JSON.stringify(arr)
                    },
                    cache: false,
                    dataType: "json",
                    success: function (json) {
                        if (json.status) {
                            Utils.tip(json.info, json.status, json.status ? function () {

                            } : null);
                            that.GetData(renderIntData);
                            that.getStopBetNumber();
                            that.CkeckinputValue(false);

                        } else {
                            Utils.tip(json.info, json.status, json.status ? function () {
                                that.back();
                            } : null);
                        }

                    }
                });
            }
        }
        /*获取停用号码------结束*/
        this.BetTypeShow = function (t) {
            switch (t - 0) {
                case 14: case 15: case 16:/* TwoDisplay = 14,  ThreeDiplay = 15,  FourDisplay = 16*/
                    return true;
                default:  /*OOXX = 2,OXOX = 3,OXXO = 4,XOXO = 5,XOOX = 6,XXOO = 7,OOOX = 9,OOXO = 10, OXOO = 11,XOOO = 12,FourFix = 13,*/
                    return false;
            }
        }
        this.LotteryType = function (t) {/*彩种*/
            return "重庆时时彩";
            /* if (t == 1) {
                 if(Utils.Cookie.get("PlayType")-0==0)// Serven = 0(七星),  Five = 1(排列五),
                 {
                     return "七星彩";
                 }else  if(Utils.Cookie.get("PlayType")-0==1)
                 {
                     return "排列五";
                 }
             } else {
                 return "--";
             }*/
        };
        /*状态--0:正常； 1：退码； 2：结算； 3：逻辑删除；*/
        this.BetStatusType = function (t) {/*彩种*/

            switch (t - 0) {

                case 0:
                    return "成功";
                case 1:
                    return "退码";
                case 2:
                    return "结算";
                case 3:
                    return "删除";
                default:
                    return "--";
            }
        };
        this.number = ko.observable();

        this.isEnter = ko.observable(Utils.Cookie.get("IsEnter"));//录码模式：自动 false；回车 true
        this.odds = ko.observable();//赔率
        this.maxLimitItemBet = ko.observable();//可下单项上限
        this.isShowOdds = ko.observable(false);//是否显示会员赔率
        this.MaxLimitSigleBet = ko.observable(0);//最大下注金额
        this.MinLimitBetAmount = ko.observable(0);//最小下注金额

        this.getMemberBetOdds = function () {/**获取会员赔率*会默认优先拿子公司下设置的赔率***********************************/
            var number = that.number();//下注号码
            var type = (number + '').replace(/\d/g, 'O').toUpperCase();
            var betTypeId = "";
            if (number != undefined && number.length >= 2) {
                var numberLenX = number.match(/x/ig);
                if (that.currentType() > 1) {
                    if (type == "XXXOO") {
                        betTypeId = group.groupKeycode[type][1];
                    }
                    else if (type == "OXXXO") {
                        betTypeId = group.groupKeycode[type][1];
                    }
                    else {
                        that.isShowOdds(false);//隐藏出赔率和可下额度
                        that.odds('');//赔率
                        that.maxLimitItemBet('');//可下额度
                        return true;
                    }
                }
                else if (numberLenX == null || number.length == 4 ||number.length == 5) {
                    if (that.sizixian() == true && type == 'OOOO') {
                        betTypeId = "16";
                    } else {
                        betTypeId = group.groupKeycode[type][1];
                    }
                } else {
                    that.isShowOdds(false);//隐藏出赔率和可下额度
                    that.odds('');//赔率
                    that.maxLimitItemBet('');//可下额度
                    return true;
                }
                var ajaxRequest = $.ajax({
                    url: '/index.php/Portal/FixTwo/GetMemberBetOdds',
                    cache: false,
                    data: { lottery: 1, betTypeId: betTypeId, BetNumber: number },
                    dataType: 'json',
                    success: function (data) {
                        if (data != null) {
                            $.each(data, function (index, value) {
                                if (value.IsMaster == true) {
                                    that.MaxLimitSigleBet(value.MaxLimitSigleBet);
                                    that.MinLimitBetAmount(value.MinLimitBetAmount);
                                }

                            });
                            var dataLen = data.length;
                            //版本一：在MaxLimitItemBet和Odds不等于0情况下，各取最小
                            if (dataLen == 0) {
                                return;
                            }
                            if (dataLen - 0 == 1) {
                                that.isShowOdds(true);//显示出赔率和可下额度
                                that.odds(data[0].Odds);//赔率
                                that.maxLimitItemBet(parseFloat(data[0].Store));//可下额度
                            } else {
                                //如果返回多条数据，比较后选择MaxLimitItemBet和Odds最小的值
                                that.isShowOdds(true);//显示出赔率和可下额度

                                $.isArray(data) && data.sort((function (p) {
                                    return function (a, b) {
                                        //排序，MaxLimitItemBet最小的放第一个
                                        return a[p] - b[p];

                                    }
                                })('MaxLimitItemBet'));
                                if (data[0].MaxLimitItemBet - 0 == 0) {

                                    that.maxLimitItemBet(data[1].Store);//可下额度:Store）
                                } else {

                                    that.maxLimitItemBet(data[0].Store);//可下额度（Store）

                                }
                                $.isArray(data) && data.sort((function (p) {
                                    return function (a, b) {
                                        return a[p] - b[p];//排序，Odds最小的放第一个
                                    }
                                })('Odds'));
                                if (data[0].Odds - 0 == 0) {
                                    that.odds(data[1].Odds);//赔率
                                } else {
                                    that.odds(data[0].Odds);//赔率
                                }
                            }
                        }
                    }
                });
            }


        }
        this.getAmount = function () {//选中金额
            document.getElementById("SumFastBeat").select();
        };
        this.disableEnterAmount = function (data, event) {//金额回车直接提交
            if (event.keyCode - 0 == 13) {
                that.ConfirmTheBet();
            }
            return false;
        }
        /**录码模式：回车*******************************/
        this.disableEnter = function (data, event) {
            if (that.stopnumberList().length <= 0 && that.currentType() > 1 && that.number().length == 5 && (!/^XXX\d{2}$/i.test(that.number()) || !!/^\dXXX\d$/i.test(that.number()))) {
                document.getElementById("NumberFastBeat").focus();
                //document.getElementById("NumberFastBeat").select();
                return true;
            }
            var keyCodeval = event.keyCode - 0;
            //keyCodeval=9 Tab键；keyCodeval==13回车键
            if (keyCodeval == 13 && this.number().length > 0) {
                document.getElementById("SumFastBeat").focus();
                document.getElementById("SumFastBeat").select();
            }
            if (that.isEnter() == "true" && keyCodeval == 13) {//如果录码设置的是：回车模式&& keyCodeval == 9 || keyCodeval == 13
                that.getMemberBetOdds();
            }
            return true;

        }
        /**录码模式：自动*******************************/
        this.getIsEnter = function (data, event) {
            if (that.stopnumberList().length <= 0 && ((that.currentType() == 2 && !/^XXX\d{2}$/i.test(that.number())) || (that.currentType() == 3 && !/^\dXXX\d$/i.test(that.number())))) {
                document.getElementById("NumberFastBeat").focus();
                //document.getElementById("NumberFastBeat").select();
                return;
            }
            if (that.isEnter() == "false")
                that.getMemberBetOdds();
        }
        this.number.subscribe(function (newValue) {
            if (that.currentType() > 1 && newValue.length > 5) newValue = newValue.substring(0, 5);
            if (that.currentType() < 2 && newValue.length > 4 && !/^XXXX/i.test(newValue)) newValue = newValue.substring(0, 4);
            
            var value = newValue.replace('+', 'X').replace('*', 'X').replace(/[^0-9|O|X]/i, "");
            var xlength = (value.match(/x/ig) || [] ).length;
            var vlength = value.length;
            
            // 一定截取
            if(vlength > 4 && /^XXXXX$/i.test(value)){
                value = value.substr(0, 4)
            }

            if (that.currentType() == 2) {
                while (!/^xxx/i.test(value) && value.length > 3) {
                    var t3 = value.substring(0, 3);
                    t3 = t3.replace(/[^x]/i, "");
                    value = t3 + value.substring(3);
                }
                if (value.length <= 3) {
                    value = value.replace(/[^x]/i, "");
                }
            }
            if (that.currentType() == 3) {
                while (!/^\d/i.test(value) && value.length > 0) {
                    value = value.substring(1);
                }
                var t = value.substring(0, 1);
                var tt = value.substring(1);
                while (!/^xxx/i.test(tt) && tt.length > 3) {
                    var t3 = tt.substring(0, 3);
                    t3 = t3.replace(/[^x]/i, "");
                    tt = t3 + tt.substring(3);
                }
                if (tt.length <= 3) {
                    tt = tt.replace(/[^x]/i, "");
                }
                value = t + tt;
                if (value.length == 5 && !/^\dXXX\d$/i.test(value)) {
                    value = value.substring(0, 4);
                }
            }
            that.number(value);
            if (value.match(/x/ig) != undefined) {
                var numberLenX = value.match(/x/ig);
                if (that.currentType() < 2) {
                    if( (vlength == 4 && vlength - xlength === 1) || (vlength == 5 && /^XXXX\d$/i.test(value) )) {
                        // 1定
                        // 数字位超过2位
                        if( vlength - xlength > 1){
                            that.number(value.substr(0, value.length - 1))
                        }
                        
                        // XXXXX情况 和 x3xxx 情况
                        if( (vlength == 5 && xlength == 5 ) ||
                            (vlength == 5 && value[vlength -1] === 'x') ) {
                            that.number(value.substr(0, vlength - 1))
                        }
                    }
                }
                else {
                    if (numberLenX.length >= 4) {
                        that.number(value.replace(value.charAt(value.length - 1), ''));
                    }
                }
            }

            var betBettypeID = group.groupPattern[value];
            if (value.length === 3 && !isNaN(value)) {
                that.sanzixian(true);
            }
            else {
                that.sanzixian(false);
            }
            if (value.length === 2 && !isNaN(value)) {
                that.erzixian(true);
            }
            else {
                that.erzixian(false);
            }
            if ((that.currentType() < 2 && (vlength - xlength > 0 && value.length == 4) || /^XXXX\d$/i.test(value) ) || 
                (that.currentType() > 1 && value.length == 5)) {
                document.getElementById("SumFastBeat").select();
                //if (that.isEnter() == "false") {//如果录码设置的是：自动模式
                //that.getMemberBetOdds();
                //}
                document.getElementById("SumFastBeat").focus();
            }
        });

        this.quanZhuang = ko.observable(false);
        this.sizixian = ko.observable(false);
        this.amount = ko.observable().extend({ limit: { range: [0], fix: 4 } });//.extend({ limit: { range: [0] } });
        this.changed = (function () {

            var cur = null;
            return function (data, event) {
                event = event || window.event;
                var target = event.target || event.srcElement;
                if (cur === target) {
                    if (target.id === 'FourDisplayCheckbox') {
                        if (that.number() != undefined) {
                            that.getMemberBetOdds();
                        }

                    }
                }
                else {
                    if (target.id === 'FourDisplayCheckbox') {

                        if (that.number() != undefined) {
                            that.getMemberBetOdds();

                        }
                        that.currentType(1).quanZhuang(false);
                        cur = target;
                    }
                    else {
                        //that.sizixian(false).quanZhuang(true);
                        cur = target;
                    }
                }
                return true;
            }
        })();

        /**快打退码********/
        this.BackYards = function () {
            var that = this;
            var arr = [],
                money = 0;
            $.each(that.list(), function (index, value) {
                //var single = [];
                if (value.checked && value.checked()) {
                    /*single.push(
                        BetInfoID=value.BetInfoID,
                        BetNumber=value.BetNumber); //= value.BetDetailID;//注单号*/
                    money += value.BetAmount - 0;//单笔金额
                    var data = {
                        BetInfoID: value.BetInfoID,
                        BetNumber: value.BetNumber
                    }
                    arr.push(data);
                }

            });
            if (arr.length == 0) {
                Utils.tip("请勾选需要退码的注单!", false, true ? function () {

                } : null);
            } else if (that.IsSingleBack() == false && arr.length >= 2) {////IsSingleBack true 为单个退码，隐藏全选按钮
                Utils.tip("只能单个退码!", false, true ? function () {

                } : null);
            }
            else {
                var that = this;
                $.ajax({
                    url: "/index.php/Portal/FastBeat/BackBetOperator",
                    type: "post",
                    data: {
                        LsBetIds: JSON.stringify(arr)//,
                        //UserName: Utils.Cookie.get('LoginName'),//用户名称
                        //SuperCompany: Utils.Cookie.get('SuperCompanyName')//公司名称
                    },
                    cache: false,
                    dataType: "json",
                    success: function (json) {
                        if (json.status) {
                            framework._extend.refreshInfo();
                            // Utils.tip(json.info, json.status, 2000);
                            Utils.tip(json.info, json.status, json.status ? function () {

                            } : null);
                            that.GetData(renderIntData);
                            //退码成功之后，左侧的注单栏只显示下注成功的，会员信息的金额应退回
                            framework._extend.ReturnCredit(money);/*刷新左边已用和可用金额*/
                            framework._extend.getBetInfoForLeftInfo();
                            that.checkeAll(false);

                        } else {
                            Utils.tip(json.info, json.status, json.status ? function () {
                                that.back();
                            } : null);
                        }

                    }
                });
            }
        }

        this.checkeAll = ko.observable();
        this.checkeAll.subscribe(function (newValue) {
            if (newValue) {
                that.cancelCheckAll(!newValue);
            }
            if (!that.cancelCheckAll()) {
                $.each(that.list(), function (index, value) {
                    value.checked && value.checked(newValue);
                });
            }
        });
        this.cancelCheckAll = ko.observable();
        var group = {
            groupKeycode: {
                'OOXX': [/^\d{2}XX$/i, '2'],
                'OXOX': [/^\dX\dX$/i, '3'],
                'OXXO': [/^\dXX\d$/i, '4'],
                'XOXO': [/^X\dX\d$/i, '5'],
                'XOOX': [/^X\d{2}X$/i, '6'],
                'XXOO': [/^XX\d{2}$/i, '7'],
                'OOOX': [/^\d{3}X$/i, '9'],
                'OOXO': [/^\d{2}X\d$/i, '10'],
                'OXOO': [/^\dX\d{2}$/i, '11'],
                'XOOO': [/^X\d{3}$/i, '12'],
                'OOOO': [/^\d{4}$/i, '13'],
                'OO': [/^\d{2}$/i, '14'],
                'OOO': [/^\d{3}$/i, '15'],
                'XXXOO': [/^XXX\d{2}$/i, '17'],
                'OXXXO': [/^\dXXX\d$/i, '18'],
                // 1定
                'OXXX': [/^\dXXX$/i, '20'],
                'XOXX': [/^X\dXX$/i, '21'],
                'XXOX': [/^XX\dX$/i, '22'],
                'XXXO': [/^XXX\d$/i, '23'],
                'XXXXO': [/^XXXX\d$/i, '24'],
            },
            groupPattern: {
                'OOXX': [/^\d{2}XX$/i, 'B2'],
                'OXOX': [/^\dX\dX$/i, 'B3'],
                'OXXO': [/^\dXX\d$/i, 'B4'],
                'XOXO': [/^X\dX\d$/i, 'B5'],
                'XOOX': [/^X\d{2}X$/i, 'B6'],
                'XXOO': [/^XX\d{2}$/i, 'B7'],
                'OOOX': [/^\d{3}X$/i, 'B9'],
                'OOXO': [/^\d{2}X\d$/i, 'B10'],
                'OXOO': [/^\dX\d{2}$/i, 'B11'],
                'XOOO': [/^X\d{3}$/i, 'B12'],
                'OOOO': [/^\d{4}$/i, 'B13'],
                'OO': [/^\d{2}$/i, 'B14'],
                'OOO': [/^\d{3}$/i, 'B15'],
                'XXXOO': [/^XXX\d{2}$/i, 'B17'],
                'OXXXO': [/^\dXXX\d$/i, 'B18'],
                //1定
                'OXXX': [/^\dXXX$/i, 'B20'],
                'XOXX': [/^X\dXX$/i, 'B21'],
                'XXOX': [/^XX\dX$/i, 'B22'],
                'XXXO': [/^XXX\d$/i, 'B23'],
                'XXXXO': [/^XXXX\d$/i, 'B24'],
            },
            group_arr: {
                'B2': [],
                'B3': [],
                'B4': [],
                'B5': [],
                'B6': [],
                'B7': [],
                'B9': [],
                'B10': [],
                'B11': [],
                'B12': [],
                'B13': [],
                'B14': [],
                'B15': [],
                'B16': [],
                'B17': [],
                'B18': [],
                'B20': [],
                'B21': [],
                'B22': [],
                'B23': [],
                'B24': [],

            }
        };
        var renderIntData = function () {
            var initData = [],
                len;
            len = that.list().length - 10;
            for (len < 10; len++;) {
                initData.push({
                    LotteryID: '--',
                    PeriodsNumber: '--',
                    BetAmount: '--',
                    BetTypeID: '--',
                    Odds: '--',
                    BetStatus: '--',
                    UpdateDt: '--',
                    BetInfoID: '--',
                    BetNumber: '--',
                    IsHotNum: false
                });
            }
            that.list(that.list().concat(initData));
        };
        this.renderIntData = renderIntData;
        //向顶端Top Ten添加注单信息
        this.refreshTopTenBet = function (arr) {
            if (!$.isArray(arr) || arr.length <= 0) {
                return;
            }
            var obj = {};
            obj.LotteryID = 1;
            obj.PeriodsNumber = Utils.Cookie.get('PeriodsNumber');
            obj.LsBetIds = arr[0];
            obj.BetInfoID = arr[1];
            obj.BetNumber = arr[2];
            obj.BetAmount = arr[3];
            obj.BetTypeID = arr[4];
            obj.Odds = arr[5];
            obj.BetDt = arr[6];
            obj.BetStatus = 0;
            obj.IsHotNum = !!arr[7];
            var list = that.list();
            var length = list.length;
            var CancelBet = Utils.Cookie.get('CancelBet');//退码时间在该时间内
            var Diff = Utils.DateHelp.add(new Date($("#ServerDateTM").val()), -(CancelBet - 0), 'minute');
            if (!(new Date(obj.BetDt) < new Date(Diff)) && obj.BetStatus === 0) {
                obj.checked = ko.observable(false);
                obj.checked.subscribe(function (newValue) {
                    if (!newValue) {
                        that.cancelCheckAll(!newValue);
                    }
                    setTimeout(function () {
                        if (!newValue) {
                            that.checkeAll(false);
                        }
                    }, 0);
                });
            } else {

            }
            for (var i = 0; i < length; i++) {
                if (list[i].PeriodsNumber === "--") {
                    break;
                }
            }
            if (i < length) {
                list[i] = obj;
                that.list(list);
            }
            else {
                that.list.push(obj);
                that.list.shift();
            }
            return obj;
        }
        /*
         *确认下注
         *PeriodsStatus表示：未开盘UnOpen=0,开盘Open=1,封盘Close=2,开奖Lottery=3,结算中Settlementing=4,已结算Settlement=5,重新结算  (返还金额)ReSettlement=6,已删除Delete=7
         */
        var confirmTheBetAjaxComp = true;
        this.ConfirmTheBet = function () {
            if (!confirmTheBetAjaxComp)
                return;
            confirmTheBetAjaxComp = false;
            var status = Utils.Cookie.get('PeriodsStatus'),//期数状态
                credit = Utils.Cookie.get('UsedCredit'),//已用信用额度
                number = that.number(),//下注号码
                result = [],
                order = $('#Order'),
                amount = that.amount(), //下注金额
                SecondStopEarly = that.SecondStopEarly();//二字定封盘前多少分钟内不能下注
            //$('#NumberFastBeat').blur();
            $('#SumFastBeat').blur();
            function setFocus() {
                var sumFastBeat = $('#SumFastBeat');

                setTimeout(function () {
                    sumFastBeat.blur();
                    setTimeout(function () {
                        $('#NumberFastBeat').focus();
                        $('#NumberFastBeat').select();
                    }, 500);
                }, 0);
            }
            function setAmountFocus() {
                var sumFastBeat = $('#SumFastBeat');

                setTimeout(function () {
                    sumFastBeat.blur();
                    setTimeout(function () {
                        sumFastBeat.focus();
                        sumFastBeat.select();
                    }, 500);
                }, 0);
            }
            if (number != undefined || number === '') {
                number = number.toUpperCase()
            }
            if (typeof number === 'undefined' || number === '') {
                confirmTheBetAjaxComp = true;
                Utils.tip('请输入号码', false, setFocus);
                return;
            } else if (typeof amount === 'undefined' || amount === '') {
                confirmTheBetAjaxComp = true;
                Utils.tip('请输入金额', false, setAmountFocus);
                return;
            } else {
                if (status === '1') {
                    //先清空
                    for (var i in group.group_arr) {
                        group.group_arr[i] = [];
                    }
                    var xArr = number.match(/x/ig);
                    var xLen = xArr ? xArr.length : 0;
                    // if (/X/.test(number) && number.length < 4 || /(X)/g.exec(number) && /(X)/g.exec(number).length > 2 || number.length < 2) {
                    if ((number.length === 5 && xLen > 4) || (number.length === 4 && xLen > 3) || (number.length < 4 && !/^\d{2,4}$/.test(number))) {
                        confirmTheBetAjaxComp = true;
                        Utils.tip('号码出错,没有定位到号码', false, setFocus);
                        return;
                    } else if (that.quanZhuang()) {
                        if (number.length - xLen === 1) {
                            // 一定
                            var num = +number.match(/[0-9]/ig)[0];
                            if (typeof num === 'number') {
                                oneFix.forEach( function (item) {
                                    result.push(item.replace('口', num))
                                })
                            }


                        } else if ( number.length === 4 ) {
                            // 其他
                            /*
                             * 4^4中除去重叠和重复
                             */
                            number = number.split('');
                            for (var i = 0; i < number.length; i++) {
                                for (var j = 0; j < number.length; j++) {
                                    for (var t = 0; t < number.length; t++) {
                                        for (var k = 0; k < number.length; k++) {
                                            if (i !== j && i !== t && i !== k && j !== t && j !== k && t !== k) {
                                                var temp = number[i] + number[j] + number[t] + number[k]
                                                if (ko.utils.arrayIndexOf(result, temp) === -1) {
                                                    result.push(temp);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                    }
                    if (that.sizixian() && /^\d{4}$/.test(number)) {
                        group.group_arr['B16'].push(number);
                    }
                    else {
                        if (!(result.length > 0)) {
                            result.push(number);
                        }
                        for (var i = result.length; i--;) {
                            for (var single in group.groupPattern) {
                                if (group.groupPattern[single][0].test(result[i])) {
                                    group.group_arr[group.groupPattern[single][1]].push(result[i]);
                                    break;
                                }
                            }
                        }
                    }
                    //下注额度不能大于可用额度
                    if (amount * result.length > document.getElementById("DefaultCredit").innerText) {
                        confirmTheBetAjaxComp = true;
                        Utils.tip('信用额度不足', false, setFocus);
                        return;
                    }

                    /* 金额不能小于（限额设置的最小下注）和不能大于（限额设置的单注上限）*/
                    if (amount - 0 == 0) {
                        confirmTheBetAjaxComp = true;
                        Utils.tip('金额错误', false, setFocus);
                        return;
                    }
                    /*if (that.MinLimitBetAmount() > amount || that.MaxLimitSigleBet() < amount) {
                        confirmTheBetAjaxComp = true;
                        Utils.tip("输入的金额必须在" + that.MinLimitBetAmount() + '-' + that.MaxLimitSigleBet() + '之间', false, setAmountFocus);
                        return;
                    }*/
                    //获取离二字定封多少分钟内禁止下注
                    if (result.length > 0) {
                        var typeFixTwo = (result[0] + '').replace(/\d/g, 'O').toUpperCase();
                        var typeNum = group.groupKeycode[typeFixTwo][1];
                        if (typeNum - 0 <= 7 && framework._extend.currentCloseMinute < SecondStopEarly - 0) {
                            confirmTheBetAjaxComp = true;
                            Utils.tip("离封盘" + SecondStopEarly + "分钟内不能下注", false);
                            return;
                        }
                    }
                    confirmTheBetAjaxComp = true;
                    var isSelectQuanzhuan = that.quanZhuang();
                    that.sizixian(false).isShowOdds(false).odds('').maxLimitItemBet('').number(''); //.quanZhuang(false)
                    $('#SumFastBeat').blur();
                    setTimeout(function () { $('#NumberFastBeat').focus(); }, 0);
                    var ajaxRequest = $.ajax({
                        url: '/index.php/Portal/FastBeat/MemberBet',
                        data: {
                            BetAmt: amount,// 下注金额
                            BetNumber: JSON.stringify(group.group_arr),// 投注号
                            _: +new Date
                        },
                        type: "post",
                        //timeout: framework._extend.ajaxTimeout,
                        cache: false,
                        dataType: "json",
                        success: function (json) {
                            /*刷新左边已用和可用金额:拿成功返回的最新额度*/
                            if (json.CmdObject) {
                                document.getElementById("DefaultCredit").innerHTML = parseFloat(json.CmdObject.Credit).toFixed(4) - 0;//总信用额度
                                //  document.getElementById("UsedCredit").innerHTML = parseFloat(json.CmdObject.UsedCredit).toFixed(4) - 0;//已用额度
                                //parseFloat(json.CmdObject.Credit).toFixed(4) - 0 - parseFloat(json.CmdObject.UsedCredit).toFixed(4) - 0;
                                //  document.getElementById("RemainingUndrawn").innerHTML = (json.CmdObject.Credit - json.CmdObject.UsedCredit).toFixed(4) - 0;
                            }
                            if (!json.status && json.info.indexOf("重新登录") > -1) {
                                if (window.confirm(json.info)) {
                                    window.location.href = "/Home/Index";
                                    return;
                                }
                            }
                            if (json.status) {
                                //$('#SumFastBeat').blur();
                                //setTimeout(function () { $('#NumberFastBeat').focus(); }, 0);
                                //confirmTheBetAjaxComp = true;
                                //that.GetData(renderIntData);
                                //framework._extend.getBetInfoForLeftInfo();
                                if (isSelectQuanzhuan) {
                                    that.GetData(renderIntData);
                                    framework._extend.getBetInfoForLeftInfo();
                                }
                                else {
                                    var betInfoObj = that.refreshTopTenBet(json.CmdObject.BetInfo);
                                    framework._extend.appendBetInfoForLeftInfo(betInfoObj, json.CmdObject.C);
                                }

                                ///*刷新左边已用和可用金额:拿成功返回的最新额度*/
                                //document.getElementById("DefaultCredit").innerHTML = parseFloat(json.CmdObject.Credit).toFixed(4) - 0;//总信用额度
                                //document.getElementById("UsedCredit").innerHTML = parseFloat(json.CmdObject.UsedCredit).toFixed(4) - 0;//已用额度
                                //document.getElementById("RemainingUndrawn").innerHTML = (json.CmdObject.Credit - json.CmdObject.UsedCredit).toFixed(4) - 0; //parseFloat(json.CmdObject.Credit).toFixed(4) - 0 - parseFloat(json.CmdObject.UsedCredit).toFixed(4) - 0;
                                //framework._extend.getBetInfoForLeftInfo();
                                /*1.确认下注成功后，要清空所有已填和已选。*///新需求：会员快打投注，输入金额投注后，金额保留。amount('').
                                //that.sizixian(false).quanZhuang(false).isShowOdds(false).odds('').maxLimitItemBet('').number('');
                                Utils.sound.play();

                            }
                            else {
                                //confirmTheBetAjaxComp = true;
                                Utils.tip(json.info, false, setFocus);
                                if (json.info.indexOf("无效期数数据") > -1) {
                                    if (framework.periods && $.isFunction(framework.periods.main)) {
                                        framework.periods.main();
                                    }
                                }
                                if (json.isStopNum - 0 == 55) {
                                    if (isSelectQuanzhuan) {
                                        that.GetData(renderIntData);
                                        framework._extend.getBetInfoForLeftInfo();
                                    }
                                    else {
                                        var betInfoObj = that.refreshTopTenBet(json.CmdObject.BetInfo);
                                        framework._extend.appendBetInfoForLeftInfo(betInfoObj, json.CmdObject.C);
                                    }
                                }
                                //that.GetData(renderIntData);
                                //framework._extend.getBetInfoForLeftInfo();
                                //that.sizixian(false).quanZhuang(false).isShowOdds(false).odds('').maxLimitItemBet('');//.amount('')
                            }
                            if (json.isStopNum - 0 == 55) {//StopBetItem = 55表示是押停号码
                                var PeriodsNumber = Utils.Cookie.get('PeriodsNumber');
                                var list = that.periodslist(), temp = null;
                                if (that.PeriodsNumber() != PeriodsNumber) {
                                    $.each(list, function (n, o) {
                                        if (o.PeriodsNumber == PeriodsNumber) {
                                            temp = o.PeriodsNumber;
                                            return false;
                                        }
                                    });
                                    if (temp === null) {
                                        that.StopBetNumber();
                                    } else {
                                        that.PeriodsNumber(temp);
                                    }
                                } else {
                                    that.getStopBetNumber();
                                }
                            }
                        }//,
                        //complete: function (xhr, status) {
                        //    if (status == 'timeout') {
                        //        //confirmTheBetAjaxComp = true;
                        //        ajaxRequest.abort();
                        //        //Utils.tip('下注超时, 请稍候或刷新页面重试', false, setFocus);
                        //    }
                        //}
                    });
                    //that.amount(""); //清空金额
                    that.currentType(0);//重置四字现和xxx
                    that.quanZhuang(false);//重置全转
                } else {
                    confirmTheBetAjaxComp = true;
                    Utils.tip('当前没有开盘的期数,不可下注', false, setFocus);
                }
            }
        }
        //查询停压号三期数据
        this.PeriodsNumber.subscribe((function (newValue) {
            // 开盘时，不请求停压号码
            if (framework.temp.isFromCloseToOpen || !framework.temp.notFirstTime) return framework.temp.notFirstTime = 1;
            this.getStopBetNumber();
        }).bind(this));

        this.memberBetInfo = {};/// 用户下注信息
        this.getStopBetNumber = function () {
            var that = this;
            if (framework._extend.NotAjax) return;
            /**查询停压号码:这里返回二类数据，包含删除数据*******************************/
            var ajaxRequest = $.ajax({
                url: "/index.php/Portal/FastBeat/GetStopBetNumber",
                cache: false,
                dataType: "json",
                data: {
                    PeriodsNumber: that.PeriodsNumber()
                },
                success: function (json) {
                    var stopArr = new Array();//目前压停号码
                    var deleteArr = new Array();//删除停押号码保留区
                    var CountStopnumber = 0,
                        CountStopmoney = 0;
                    var deleteCountDeleteStopMoney = 0;
                    var deleteCountDeleteStopNumber = 0;
                    if (json != null) {
                        $.each(json, function (index, value) {
                            value.checkedstop = ko.observable(false);
                            value.checkedstop.subscribe(function (newValue) {
                                if (!newValue) {
                                    that.cancelStopCheckAll(!newValue);
                                }
                                setTimeout(function () {
                                    if (!newValue) {
                                        that.cancelStopCheckAll(!newValue).CkeckinputValue(newValue);
                                    }
                                }, 0);
                            });
                            if (value.IsDelete == false)//目前压停号码
                            {
                                stopArr.push({
                                    ID: value.ID,
                                    BetTypeID: value.BetTypeID,
                                    BetNumber: value.BetNumber,
                                    BetAmount: value.BetAmount,
                                    checkedstop: value.checkedstop
                                });

                                CountStopmoney = CountStopmoney + (value.BetAmount - 0);
                                CountStopnumber++;
                            } else {//删除停押号码保留区
                                deleteArr.push({
                                    ID: value.ID,
                                    BetTypeID: value.BetTypeID,
                                    BetNumber: value.BetNumber,
                                    BetAmount: value.BetAmount,
                                    checkedstopdelete: ko.observable(false)
                                });
                                deleteCountDeleteStopNumber++;
                                deleteCountDeleteStopMoney = deleteCountDeleteStopMoney + (value.BetAmount - 0);
                            }

                        });
                        that.CountStopMoney(CountStopmoney.toFixed(2) - 0);
                        that.CountStopNumber(CountStopnumber.toFixed(2) - 0);
                        that.stopnumberList(stopArr);


                        that.CountDeleteStopMoney(deleteCountDeleteStopMoney.toFixed(2) - 0);
                        that.CountDeleteStopNumber(deleteCountDeleteStopNumber.toFixed(2) - 0);
                        that.deletestopList(deleteArr);
                    }
                }
            });
        }


        //查询前8条开奖号码
        this.GetTopEightPeriodsNumber = function () {
            var that = this; 
            /**查询停压号码:这里返回二类数据，包含删除数据*******************************/
            var ajaxRequest = $.ajax({
                url: "/index.php/Portal/FastBeat/GetTopEightPeriodsNumber",
                cache: false,
                dataType: "json", 
                success: function (json) {
                    var time = json[0].c_t
                    var number = json[0].c_r.replace(/,/g,'')
                    $('#bonus_time').text(time)
                    $('#bonus_number').text(number)
                    // $.each(json, function (index, value) {

                    //     value.c_r = value.c_r.replace(/,/g, ' ');
                    // });

                    // that.TopEightList(json);
                }
            });
        }

        
        this.init(renderIntData);
    };

    //AccountList.prototype.StopNumber = function () {
    //    this.numberlist(ko.observableArray(JSON.parse(Utils.Cookie.get("StopNumber"))));//framework.StopNumber());

    //}
    AccountList.prototype.init = function (fn) {
        var that = this;
        // 设置值，判断开封盘有些接口不需要请求
        var isInit = framework.temp.FastBeatIsInit;
        
        framework._extend.clearFastBeatData = function () {
            that.periodsStatus(((!!Utils.Cookie.get('PeriodsID')) && Utils.Cookie.get('PeriodsStatus') == 1) ? true : false);
            //that.stopnumberList.removeAll();
            //that.deletestopList.removeAll();
            that.list.removeAll();
            that.renderIntData();
        }
        //没有缓存时，重新获取一次数据，只自动获取一次数据
        if (1) {//!framework._extend.NotAjax && !isInit
            that.GetData(fn);
        } else {
            that.renderIntData();
        }
        // if(that.periodsStatus()) {
            that.GetTopEightPeriodsNumber();   
        // }
        
        // 只自动获取一次停压号码。
        if(!isInit) {
            that.StopBetNumber(fn);
        }

        !isInit && (framework.temp.FastBeatIsInit = 1);
    };

    AccountList.prototype.GetData = function (fn) {/**加载查询*******/
        if (framework.temp.isFromCloseToOpen) return;
        var that = this;
        /*查询下注框数据object[]{lotteryId ，memberId ，periodsNumber } periodsNumber：当前的期号（String）//lotteryId等于1表示是七星*/
        var ajaxRequest = $.ajax({
            url: "/index.php/Portal/FastBeat/GetBetInfoTopTen",
            cache: false,
            dataType: "json",
            success: function (json) {
                var CancelBet = Utils.Cookie.get('CancelBet');//退码时间在该时间内
                if ($.isArray(json) && json.length > 0) {
                    $.each(json, function (index, value) {
                        var Diff = Utils.DateHelp.add(new Date($("#ServerDateTM").val()), -(CancelBet - 0), 'minute');

                        if (!(new Date(value.BetDt) < new Date(Diff)) && value.BetStatus === 0) {

                            value.checked = ko.observable(false);
                            value.checked.subscribe(function (newValue) {
                                if (!newValue) {
                                    that.cancelCheckAll(!newValue);
                                }
                                setTimeout(function () {
                                    if (!newValue) {
                                        that.checkeAll(false);
                                    }
                                }, 0);
                            });
                        } else {

                        }

                        //value.LsBetIds = value.PeriodsNumber + new Date(value.UpdateDt).format('yyyyMMdd') + value.BetInfoID;
                    });
                } else {
                    json = [];
                }
                that.list(json);
                fn && fn.call(that);
            }
        });

        //that.getStopBetNumber();//查询押停号码
    };

    AccountList.prototype.StopBetNumber = function (fn) {
        var that = this;
        if (framework.temp.isFromCloseToOpen) {
            if (framework.temp.latestPeriod) {
                framework.temp.stopBetPeriods = framework.temp.stopBetPeriods || [];
                if (framework.temp.stopBetPeriods.length === 0 || framework.temp.latestPeriod.id - framework.temp.stopBetPeriods[0].PeriodsID > 0) {
                    framework.temp.stopBetPeriods.unshift({
                        PeriodsID: framework.temp.latestPeriod.id,
                        PeriodsNumber: framework.temp.latestPeriod.period
                    });
                    framework.temp.stopBetPeriods = framework.temp.stopBetPeriods.slice(0, 3);
                    //that.PeriodsNumber(framework.temp.latestPeriod.period);
                }
            }
            that.periodslist(framework.temp.stopBetPeriods);
            fn && fn.call(this);
        } else {
            $.ajax({
                url: "/index.php/Portal/FastBeat/GetPeriodsNumberByStop",
                cache: false,
                dataType: "json",
                success: function (data) {
                    var arr = $.isArray(data) ? data : [];
                    arr.sort(function (a, b) {
                        return (a.PeriodsNumber - 0) < (b.PeriodsNumber - 0) ? 1 : -1;
                    });
                    framework.temp.stopBetPeriods = arr;
                    that.periodslist([{"PeriodsID": 0,"PeriodsNumber": "请选择"}].concat(arr || []));
                    that.PeriodsNumber(that.periodslist().length > 0 ? that.periodslist()[0].PeriodsNumber : $("#periodsnumber").val());
                    //that.getStopBetNumber();//查询押停号码
                    fn && fn.call(that);
                }
            });
        }
    }


    AccountList.prototype.dispose = function () {
        framework._extend.clearFastBeatData = null;
    }
    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };

});
