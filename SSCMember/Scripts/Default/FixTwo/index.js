// 二字定
/// <reference path="../_references.js" />

define(function (require, exports, module) {
    var FixTwo = function (param) {
        var
             that = this,
             indexOf = ko.utils.arrayIndexOf,
             bitPosition = [0, 1],
             dingweiNums = {
                 0: [],
                 1: []
             },
             hefenNums = [],
             baseStyle = 'yellow';
        this.selectList = [];
        this.lotteryItem = ko.observable(2);
        this.model = ko.observable(1);
        this.betType = ko.observable(7);
        this.credit = ko.observable(false); //信用额度是否可用
        this.PeriodsID = Utils.Cookie.get('PeriodsID');
        this.PeriodsStatus = Utils.Cookie.get('PeriodsStatus');
        this.PeriodsNumber = Utils.Cookie.get("PeriodsNumber");
        this.list = ko.observableArray([]);
        this.MaxLimitItemBet = ko.observable(0);///单项上限
        this.MaxLimitSigleBet = ko.observable(0);///单注上限
        this.MinLimitBetAmount = ko.observable(0);///最小下注金额
        this.Count = ko.observable(0);///监控模式2选择多少个
        this.Money = ko.observable().extend({ limit: { range: [0], fix: 4 } });// ko.observable(0);//下注了多少金额
        this.modelTpl = ko.observable("modeltwo");
        this.AllMoney = ko.observable(0);//统计一共使用多少金额
        this.NumA = ko.observable("仟");
        this.NumB = ko.observable("佰");
        ///新加, 定位可选数字, 20161107
        ///上述this.NumA可选数字
        this.NumAInput = ko.observable();//.extend({ limit: { range: [0], fix: 0 } });//定位可选数字
        ///上述this.NumB可选数字
        this.NumBInput = ko.observable();//.extend({ limit: { range: [0], fix: 0 } });//定位可选数字
        ///监视, 只可以输入数字
        this.NumAInput.subscribe(function (newValue) { that.NumAInput(newValue.replace(/[^0-9]/g, "")); });
        this.NumBInput.subscribe(function (newValue) { that.NumBInput(newValue.replace(/[^0-9]/g, "")); });
        ///是否除重
        this.isEceptRepeat = ko.observable(true);
        ///根据下注号码, 获取对应号码信息(赔率等)
        this.getBetTypeByNumber = function (num) {
            var list = that.list();
            var lens = list.length;
            for (var i = 0; i < lens; i++) {
                var line = list[i].line;
                var ll = line.length;
                for (var j = 0; j < ll; j++) {
                    if (line[j].BetTypeName == num) {
                        return line[j];
                    }
                }
            }
            return null;
        }
        ///判断下注号码是否已在所选注单中
        this.hasSelectedNumber = function (num) {
            var lens = that.selectList.length;
            for (var i = 0; i < lens; i++) {
                if (num == that.selectList[i].BetTypeName) {
                    return true;
                }
            }
            return false;
        }
        ///根据输入生成注单号码数组
        this.fixedConvertList = function () {
            if (!that.NumAInput() && !that.NumBInput()) return [];
            ///分割输入数字并排序
            var numAArr = (that.NumAInput() ? that.NumAInput() : "0123456789").split("").sort(function (a, b) { return a - b; });
            var numBArr = (that.NumBInput() ? that.NumBInput() : "0123456789").split("").sort(function (a, b) { return a - b; });
            var i = 0, j = 0;
            if (that.isEceptRepeat()) {
                //去除重复数字
                i = 0;
                while (i < numAArr.length - 1) {
                    if (numAArr[i] == numAArr[i + 1]) {
                        numAArr.splice(i, 1);
                    } else {
                        i++;
                    }
                }
                i = 0;
                while (i < numBArr.length - 1) {
                    if (numBArr[i] == numBArr[i + 1]) {
                        numBArr.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            }
            var lensA = numAArr.length, lensB = numBArr.length, rtn = [];
            //生成符合条件的注单号码数组
            for (i = 0; i < lensA; i++) {
                for (j = 0; j < lensB; j++) {
                    var betNum = ["X", "X", "X", "X"];
                    if (that.lotteryItem() == 17 || that.lotteryItem() == 18) {
                        betNum = ["X", "X", "X", "X", "X"];
                    }
                    betNum[bitPosition[0]] = numAArr[i];
                    betNum[bitPosition[1]] = numBArr[j];
                    betNum = betNum.join("");
                    if (!(that.isEceptRepeat() && that.hasSelectedNumber(betNum))) {
                        var betObject = that.getBetTypeByNumber(betNum);
                        betObject && rtn.push(betObject);
                    }
                }
            }
            return rtn;
        }

        this.change = function (data, event) {
            var target = event.target;
            this.cancel();
            $('#Money').off('input propertychange').on('input propertychange', function (event) {
                that.countMoney();
            });
            if (this.modelTpl() === 'modelOne') {
                this.modelTpl('modeltwo');
                target.value = '模式2';
            }
            else {
                this.modelTpl('modelOne');
                target.value = '模式1';
            }

        };
        ///初始化数据
         $.post("/index.php/Portal/FixTwo/CheckCredit", function (data) {
            if (data.status) {
                that.credit(true);
            }
            //!that.credit() ||  只有没有期数时才调用NoGetData，信用额度<0，也需要显示赔率
            if (typeof that.PeriodsStatus === 'undefined' || that.PeriodsStatus == 0 || that.PeriodsStatus == null || that.PeriodsStatus > 2) {
                that.NoGetData(that.lotteryItem());
            }
            else {
                that.GetDate(that.lotteryItem());
            }
        });
        ///取消
        this.cancel = function () {
            $("#HeFen").find("input").removeClass("btred");
            $("#TwoBet1").find("input").removeClass("btred");
            $("#TwoBet2").find("input").removeClass("btred");
            that.NumAInput("");
            that.NumBInput("");
            that.Count(0);
            that.AllMoney(0);
            //that.Money(0);
            that.setData([]);
            for (var i in dingweiNums) {
                dingweiNums[i] = [];
            }
        };
        this.addHeFen = function (data, event) {
            var
                target = $(event.target),
                list = [],
                indexOf = ko.utils.arrayIndexOf,
                pos = 0,
                num = isNaN(target.val() - 0) ? target.val() : target.val() - 0;
            if (event.target.nodeName !== 'INPUT') return;
            list = that.convert(that.list());
            //清除定位号码
            for (var i in dingweiNums) {
                dingweiNums[i] = [];
            }
            $('#TwoBet1').find('input').removeClass('btred');
            $('#TwoBet2').find('input').removeClass('btred');
            target.toggleClass('btred');
            if ((pos = indexOf(hefenNums, num)) === -1) {
                hefenNums.push(num);
            }
            else {
                hefenNums.splice(pos, 1);
            }
            that.clear();
            $.each(list, function (index, value) {
                var
                     num = 0,
                     flags = false;
                if (value.BetTypeName.replace(/[^X]/gi, function () {
                       num += (arguments[0] - 0);                      //取数字之和
                }));
                for (var i = 0, len = hefenNums.length; i < len; i++) {
                    if (num % 10 === hefenNums[i]) {
                        value.selectStyle(baseStyle);
                        if (indexOf(that.selectList, value) === -1) {
                            that.selectList.push(value);
                        }
                        return;
                    }
                    switch (hefenNums[i]) {
                        case '单':
                            if (num % 2 === 1) {
                                value.selectStyle(baseStyle);
                                flags = true;
                            }
                            break;
                        case '双':
                            if (num % 2 === 0) {
                                value.selectStyle(baseStyle);
                                flags = true;
                            }
                            break;
                    }
                    if (flags) {
                        if (indexOf(that.selectList, value) === -1) {
                            that.selectList.push(value);
                        }
                    }
                }
            });
            that.countMoney();
        }
        this.addEven = function (data, event) {
            var
                list = [],
                target = $(event.target),
                num = isNaN(target.val() - 0) ? target.val() : target.val() - 0,
                indexOf = ko.utils.arrayIndexOf,
                numIndex = target.closest('td').data('nums') - 0,
                pos;

            if (event.target.nodeName !== 'INPUT') return;
            $('#HeFen').find('input').removeClass('btred');
            hefenNums = [];
            list = that.convert(that.list());
            target.toggleClass('btred');
            if ((pos = indexOf(dingweiNums[numIndex], num)) === -1) {
                //dingweiNums[numIndex] = [];
                dingweiNums[numIndex].push(num);//在相应的位置记录下所选的数字
            }
            else {
                dingweiNums[numIndex].splice(pos, 1);
            }
            /**
              *递归查找对应的号码,递归次数为玩法类的定位数,如：OOXX递归两次,OOOX递归三次
              *每次递归查找index指定的位置的位是否是已选的。
              *@position 存储当前玩法类的定位置
              *@index    对应position的每个位置,每次递归完成之后都将递增1
            */
            (function (position, index) {
                var
                     fn = arguments.callee,
                     curNums = dingweiNums[index],
                     curPosition = position[index],
                     betTypeName,
                     temp = [],
                     flags = false;

                if (typeof position[index] === 'undefined') return;
                $.each(list, function (key, value) {
                    betTypeName = value.BetTypeName.split('');
                    for (var i = 0, len = curNums.length; i < len; i++) {
                        if (!isNaN(curNums[i])) {
                            if (curNums[i] === betTypeName[curPosition] - 0) {
                                temp.push(value);
                            }
                        }
                        else {
                            switch (curNums[i]) {
                                case '单':
                                    if ((betTypeName[curPosition] - 0) !== 0 && (betTypeName[curPosition] - 0) % 2 !== 0) {
                                        flags = true;
                                    }
                                    break;
                                case '双':
                                    if ((betTypeName[curPosition] - 0) % 2 === 0) {
                                        flags = true;
                                    }
                                    break;
                                case '大':
                                    if ((betTypeName[curPosition] - 0) > 4) {
                                        flags = true;
                                    }
                                    break;
                                case '小':
                                    if ((betTypeName[curPosition] - 0) <= 4) {
                                        flags = true;
                                    }
                                    break;
                            }
                            if (flags) {
                                if (indexOf(temp, value) === -1) {
                                    temp.push(value);
                                    flags = false;
                                }
                            }
                        }
                    }
                });
                list = temp;
                temp = [];
                fn.call(that, position, ++index);
            })(bitPosition, 0);
            that.setData(list);
            that.countMoney();
        }
        ///选择单项
        this.checked = function (data, event) {
            var i = '';
            if (indexOf(that.selectList, data) !== -1) {
                i = indexOf(that.selectList, data);
                data.selectStyle('');
                that.selectList.splice(i, 1)
            } else {
                data.selectStyle(baseStyle);
                that.selectList.push(data);
            }
            that.countMoney();
        }
        /*Tao键和回车时；查询统计所有金额并提交下注信息*/
        this.disableEnterFixTwo = function (data, event) {
            var keyCodeval = event.keyCode - 0;
            //keyCodeval=9 Tab键；keyCodeval==13回车键
            if (keyCodeval == 13) {
                if (that.modelTpl() === 'modelOne') {
                    return that.submodelone();
                }
                that.countMoney();
                that.submodeltwo();
            }
            return true;
        }
        /*鼠标离开下注金额文本框时查询统计所有金额*/
        this.getIsEnterFixTwo = function (data, event) {
            that.countMoney();
        }
        ///统计所有金额
        this.countMoney = function () {
            var
                count = that.selectList.length,
                money = 0;
            if (that.modelTpl() === 'modelOne') {
                $.each(that.list(), function (key, value) {
                    $.each(value['line'], function (key, value) {
                        if (value.Gold()) {
                            count++;
                            money += (value.Gold() - 0);
                        }
                    });
                });
                that.AllMoney(money);
            }
            else {
                //that.Money($("#Money").val() - 0);
                if ($.trim(that.Money()) !== '') {
                    that.AllMoney((that.Money() * count).toFixed(4) - 0);
                }
            }
            that.Count(count);
        };
        ///设置一行
        this.SetRow = function (data, event) {
            var
                 target = $(event.target),
                 index,
                 list = [];
            if (target.hasClass('ignore')) {
                return;
            }
            if (target[0].nodeName !== 'TD') {
                target = target.parent();
            }
            $.each(that.list(), function (index, value) {
                list.push(value.line);
            });
            index = target.data('index');
            $.each(list[index], function (index, value) {
                if (value.selectStyle() !== baseStyle) {
                    value.selectStyle(baseStyle);
                    that.selectList.push(value);
                }
                else {
                    value.selectStyle('');
                    var willRemoveIndex;
                    ko.utils.arrayForEach(that.selectList, function (el, index) {
                        if (el.BetTypeName === value.BetTypeName) willRemoveIndex = index;
                    });
                    that.selectList.splice(willRemoveIndex, 1);
                }
            });
            that.countMoney();
        };
        ///设置一列
        this.SetCol = function (data, event) {
            var
                 target = $(event.target),
                 list = [],
                 temp = [],
                 baseLen = 10,
                 colIndex,
                 index = 0,
                 selectLen;
            if (target.hasClass('ignore')) {
                return;
            }
            if (target[0].nodeName !== 'TD') {
                target = target.parent();
            }
            colIndex = target.data('index');
            selectLen = colIndex * baseLen;
            list = that.convert(that.list());
            /**
            *将前面合并的list格式([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])转换为 [0,10,1,11,2,12,3,13,4,14,5,15,6,16,7,17,8,18,9,19]
            */
            (function (index) {
                var
                    fn = arguments.callee,
                    i = index;
                if (index > baseLen - 1) {
                    return
                }
                do {
                    temp.push(list[i]);
                    i += baseLen;
                } while (typeof list[i] !== 'undefined');
                index++;
                fn(index);
            })(0);
            list = temp;
            while (index < baseLen) {
                if (list[selectLen].selectStyle() !== baseStyle) {
                    list[selectLen].selectStyle(baseStyle);
                    that.selectList.push(list[selectLen]);
                }
                else {
                    list[selectLen].selectStyle('');
                    var willRemoveIndex;
                    ko.utils.arrayForEach(that.selectList, function (el, index) {
                        if (el.BetTypeName === list[selectLen].BetTypeName) willRemoveIndex = index;
                    });
                    that.selectList.splice(willRemoveIndex, 1);
                }
                selectLen++;
                index++;
            }
            that.countMoney();
        };
        ///模式2投注提交
        this.submodeltwo = function () {
            var BetTypeName = "00XX";
            var subflage = true;
            var error = "非法数据"
            var subarr = [];
            function setFocus() {
                var
                    money = $('#Money');

                setTimeout(function () {
                    money.blur();
                    setTimeout(function () {
                        money.focus();
                    }, 500);
                }, 0);
            }
            switch (that.lotteryItem()) {
                case 2:
                    BetTypeName = "00XX";
                    break;
                case 3:
                    BetTypeName = "0X0X";
                    break;
                case 4:
                    BetTypeName = "0XX0";
                    break;
                case 5:
                    BetTypeName = "X0X0";
                    break;
                case 6:
                    BetTypeName = "X00X";
                    break;
                case 7:
                    BetTypeName = "XX00";
                    break;
                case 17:
                    BetTypeName = "XXX00";
                    break;
                case 18:
                    BetTypeName = "0XXX0";
                    break;
            }
            //下注额度不能大于可用额度
            if (that.Money() - 0 > document.getElementById("DefaultCredit").innerText - 0) {

                Utils.tip('信用额度不足', false, true ? function () {

                } : null);
                return;
            }

            /*if (that.AllMoney() > that.MaxLimitItemBet()) {
                subflage = false;
                error = "下注金额超过" + BetTypeName + "单项金额上限(上限金额：" + that.MaxLimitItemBet() + ")";

            }*/
            if (that.Money() > that.MaxLimitSigleBet()) {
                subflage = false;
                error = "下注金额超过单注金额上限(单注上限金额:" + that.MaxLimitSigleBet() + ")"

            }
            /* else if (that.Money() > that.MaxLimitItemBet()) {
                 subflage = false;
                 error = "下注金额超过" + BetTypeName + "单项金额上限(上限金额：" + that.MaxLimitItemBet() + ")";
             }*/

            if (that.Money() < that.MinLimitBetAmount()) {
                subflage = false;
                error = "下注金额不能低于（" + that.MinLimitBetAmount() + ")";
            }
            if (that.Money() === "" || that.Money() === "0" || that.Money() === 0) {
                subflage = false;
                error = "下注金额不能为0";
            }
            ////获取离二字定封多少分钟内禁止下注 start
            var StopTime = that.SecondStopEarly;
            if (framework._extend.currentCloseMinute < StopTime - 0) {
                subflage = false;
                error = "离封盘" + StopTime + "分钟内不能下注";
            }
            //// 获取离二字定封多少分钟内禁止下注end
            if (that.PeriodsID == 0 || that.PeriodsStatus == 0 || typeof that.PeriodsStatus == "undefined" || that.PeriodsStatus == null) {
                subflage = false;
                error = "最近没有开盘期数，不能下注";
            }
            if (subflage) {
                var selectList = that.selectList.concat(that.fixedConvertList());
                $.each(selectList, function (index, value) {
                    var data = {
                        BetNumber: value.BetTypeName,/// 投注号
                        BetType: that.lotteryItem(),
                        BetAmt: that.Money(),
                        Odds: value.Odds //赔率
                    }
                    subarr.push(data);
                });
                if (selectList.length > 0) {
                    $.post("/index.php/Portal/FixTwo/SetMemberBet",
                        {
                            listbet: JSON.stringify(subarr)
                        },
                        function (json) {
                            $('#Money').blur();
                            if (!json.status && json.info.indexOf("重新登录") > -1) {
                                if (window.confirm(json.info)) {
                                    window.location.href = "/index.php/Index/login";
                                    return;
                                }
                            }
                            //Utils.tip(json.info, json.status, function () { });
                            if (json.status) {
                                Utils.sound.play();
                            }
                            else {
                                Utils.tip(json.info, false);
                                if (json.info.indexOf("无效期数数据") > -1) {
                                    if (framework.periods && $.isFunction(framework.periods.main)) {
                                        framework.periods.main();
                                    }
                                }
                            }
                            //var subUseCredit = that.Money() * subarr.length;
                            //framework._extend.calcCredit(subUseCredit);
                            /*刷新左边已用和可用金额:拿成功返回的最新额度*/
                            if (json.CmdObject != false) {
                                document.getElementById("DefaultCredit").innerHTML = parseFloat(json.CmdObject.Credit).toFixed(4) - 0;//总信用额度
                                //document.getElementById("UsedCredit").innerHTML = parseFloat(json.CmdObject.UsedCredit).toFixed(4) - 0;//已用额度
                                //document.getElementById("RemainingUndrawn").innerHTML = (json.CmdObject.Credit - json.CmdObject.UsedCredit).toFixed(4) - 0; //parseFloat(json.CmdObject.Credit).toFixed(4) - 0 - parseFloat(json.CmdObject.UsedCredit).toFixed(4) - 0;
                                framework._extend.getBetInfoForLeftInfo();
                            }

                            that.cancel();
                            that.reset();

                            if (json.isStopNum - 0 == 55) {//StopBetItem = 55表示是押停号码
                                framework.view("/index.php/Portal/FastBeat/Index", "BetPanel/FastBeat/Index");
                            }

                        });
                }
                else {
                    Utils.tip("没有选择下注号码", false, setFocus, 2000)
                }
            }
            else {
                Utils.tip(error, false, setFocus, 2000)
            }

        }
        this.SecondStopEarly = 0;
        this.getStopTime = function (callback) {
            var StopTime = Utils.Cookie.get("StopTime");
            if (StopTime != null) {
                that.SecondStopEarly = StopTime;
                return;
            }
            $.ajax({
                url: "/index.php/Portal/FixTwo/GetStopTime",
                success: function (data) {
                    Utils.Cookie.set("StopTime", data.StopTime, 0, "/");
                    that.SecondStopEarly = data.StopTime;
                }

            });
        }
        this.getStopTime();
        ////模式1投注提交
        this.submodelone = function () {
            var subflage = true,
                error = "",
                i = 1,
                subUseCredit = 0,
                list = [],
                subarr = [],
                gold;
            list = that.convert(that.list());
            $.each(list, function (index, value) {
                gold = value.Gold();
                if (gold != 0 && !!gold) {
                    if ((gold - 0) < that.MinLimitBetAmount()) {
                        subflage = false;
                        error = value.BetTypeName + "下注金额低于最小下注金额(" + that.MinLimitBetAmount() + ")";
                    }
                    if ((gold - 0) > that.MaxLimitSigleBet()) {
                        subflage = false;
                        error = value.BetTypeName + "单注金额超过上限(" + that.MaxLimitSigleBet() + ")";
                    }
                    subUseCredit = subUseCredit + (gold - 0);
                    var data = {
                        BetNumber: value.BetTypeName,/// 投注号
                        BetType: that.lotteryItem(),
                        BetAmt: gold,/// 下注金额
                        Odds: value.Odds //赔率
                    }
                    subarr.push(data);
                }
            });
            //下注额度不能大于可用额度

            if (subUseCredit > document.getElementById("DefaultCredit").innerText - 0) {
                Utils.tip('信用额度不足', false, true ? function () {

                } : null);
                return;
            }
            var StopTime = that.SecondStopEarly;
            if (framework._extend.currentCloseMinute < StopTime - 0) {

                subflage = false;
                error = "离封盘" + StopTime + "分钟内不能下注";
            }

            //// 获取离二字定封多少分钟内禁止下注end
            if (that.PeriodsID == 0 || that.PeriodsStatus == 0 || typeof that.PeriodsStatus == "undefined" || that.PeriodsStatus == null) {
                subflage = false;
                error = "最新期数没有开盘，不能下注";
            }
            if (subflage) {
                if (subarr.length == 0) {
                    Utils.tip('您没有下注', false, true ? function () {

                    } : null);
                } else {
                    $.post("/index.php/Portal/FixTwo/SetMemberBet",
                        {
                            listbet: JSON.stringify(subarr),
                            PeriodsID: that.PeriodsID,
                            PeriodsNumber: that.PeriodsNumber,
                            SubUseCredit: subUseCredit
                        },
                        function (json) {
                            $.each(list, function (index, value) {
                                value.Gold('');
                            });
                            if (json.status) {
                                Utils.sound.play();
                                framework._extend.calcCredit(subUseCredit);
                                framework._extend.getBetInfoForLeftInfo();
                            }
                            else {
                                Utils.tip(json.info, false);
                            }
                            /*刷新左边已用和可用金额:拿成功返回的最新额度*/
                            if (json.CmdObject != false) {
                                document.getElementById("DefaultCredit").innerHTML = parseFloat(json.CmdObject.Credit).toFixed(4) - 0;//总信用额度
                                //document.getElementById("UsedCredit").innerHTML = parseFloat(json.CmdObject.UsedCredit).toFixed(4) - 0;//已用额度
                                //document.getElementById("RemainingUndrawn").innerHTML = parseFloat(json.CmdObject.Credit).toFixed(4) - 0 - parseFloat(json.CmdObject.UsedCredit).toFixed(4) - 0;
                                framework._extend.getBetInfoForLeftInfo();
                            }
                            if (json.isStopNum - 0 == 55) {//StopBetItem = 55表示是押停号码
                                framework.view("/index.php/Portal/FastBeat/Index", "BetPanel/FastBeat/Index");
                            }

                        });
                }

            } else {
                if (error !== "") {
                    Utils.tip(error, false, true ? function () {

                    } : null);
                } else {
                    Utils.tip("最近没有开盘期数，不能下注", false, 2000);
                }
            }
        }
        //改变显示的玩法项
        this.ChangeItem = function (index, data, event) {

            if (index == 2) {
                that.NumA("仟");
                that.NumB("佰");
            } else if (index == 3) {
                that.NumA("仟");
                that.NumB("拾");
            } else if (index == 4) {
                that.NumA("仟");
                that.NumB("个");
            } else if (index == 5) {
                that.NumA("佰");
                that.NumB("个");
            } else if (index == 6) {
                that.NumA("佰");
                that.NumB("拾");
            } else if (index == 7) {
                that.NumA("拾");
                that.NumB("个");
            } else if (index == 17) {
                that.NumA("四");
                that.NumB("五");
            }else if (index == 18) {
                that.NumA("首");
                that.NumB("尾");
            }
            that.cancel();
            that.isEceptRepeat(true);
            event = event || window.event;
            var target = $(event.target);
            if (!target.hasClass('red')) {
                target.parent().find('a').removeClass('red');
                target.addClass('red');
            }
            that.lotteryItem(index);
            var text = target.text();
            if (index == 17)
                text = "XXX口口";
            if (index == 18)
                text = "口XXX口";
            that.setPosition(text);
            dingweiNums = {
                0: [],
                1: []
            };
            hefenNums = [];

            //!that.credit() || 删除，现只判断未建期数时，去NoGetData
            if (typeof that.PeriodsStatus === 'undefined' || that.PeriodsStatus == 0 || that.PeriodsStatus == null || that.PeriodsStatus > 2) {
                this.NoGetData(that.lotteryItem());
            }
            else {
                this.GetDate(that.lotteryItem());

            }
        }
        //选中金额内容
        this.getMoney = function () {
            document.getElementById("Money").select();
        }
        /**
        *@method setPosition 设置定位的位置
        *@param {String} typeText     类型的文本,如：OOXX则位置是0和1
        */
        this.setPosition = function (typeText) {
            var
                 oPosition = 0;
            typeText.replace(/[^X]/gi, function () {  //替换玩法类的定位置
                bitPosition[oPosition] = arguments[1];
                oPosition++;
            });
            //console.log("bitPosition ==>", bitPosition);
        };
        /**
        *@method  setStyle
        *@param {list} list    需要设置的对象
        */
        this.setData = function (list) {
            if (!$.isArray(list) && $.isPlainObject(list)) {
                list = [list];
            }
            $.each(that.selectList, function (index, value) { //先去掉样式
                value.selectStyle('');
            });
            $.each(list, function (index, value) {
                value.selectStyle(baseStyle);
            });
            that.selectList = list;  //设置样式之后需要将数据加入已选中列表。
        };
        /**
        *清除选中的号码
        */
        this.clear = function () {
            var
                 that = this;
            $.each(that.selectList, function (index, value) {
                value.selectStyle('');
            });
            that.selectList = [];
        };
        /**
        *清除选中的条件
        */
        this.reset = function () {
            for (var i in dingweiNums) {
                dingweiNums[i] = [];
            }
            for (var i in hefenNums) {
                hefenNums[i] = [];
            }
        };
        /**
        *2015/12/08 添加,将[{a:[]},{b:[]}]格式的list 转换成一维数组。
        *@param {Array}    sourceList      需要转换的源数组
        *@param {string}   childProperty   需要转换的属性
        */
        this.convert = function (sourceList, childProperty) {
            var
                list = [];
            $.each(sourceList, function (index, value) {
                list.push([].concat(value.line))
            });
            return [].concat.apply([], list);
        };
        this.next = function (data, event) {
            var
                target = $(event.target),
                nextTd = [],
                list = [];
            $.each(that.list(), function (key, value) {
                list.push(value.line);
            });
            list = [].concat.apply([], list);
            if (event.keyCode === 13) {
                if (ko.utils.arrayIndexOf(list, data) === list.length - 1) {
                    target.blur();
                    setTimeout(that.submodelone, 100);
                }
                else {
                    nextTd = target.closest('td').nextAll('td.left').first();
                }
                if (nextTd.length <= 0) {
                    nextTd = target.closest('tbody').nextAll('tbody').find('tr td.left').first();
                }
                nextTd.find('input[type=text]').focus();
            }
            return true;
        }
    }
    /**
    *查询可用信用额度
    */
    FixTwo.prototype.CheckCredit = function () {
        var that = this;
        $.ajax({
            url: '/index.php/Portal/FixTwo/CheckCredit',
            cache: false,
            dataType: 'json',
            success: function (data) {
                var xx = data;
                if (data.status) {
                    that.credit(true);
                }
            }
        });
    }
    ///没有期数或者信用额度的时候回调用这个不获取赔率的函数
    FixTwo.prototype.NoGetData = function (lotteryIdItem) {
        var that = this;
        var XX = "XX";
        var TableArr = [];
        for (var i = 0; i < 10; i++) {
            var arr = [];
            for (var j = 0; j < 10; j++) {
                var BetName = "";
                switch (lotteryIdItem) {
                    case 2:
                        BetName = i + "" + j + "XX";
                        break;
                    case 3:
                        BetName = i + "X" + j + "X";
                        break;
                    case 4:
                        BetName = i + "XX" + j;
                        break;
                    case 5:
                        BetName = "X" + i + "X" + j;
                        break;
                    case 6:
                        BetName = "X" + i + j + "X";
                        break;
                    case 7:
                        BetName = "XX" + i + j;
                        break;
                    case 17:
                        BetName = "XXX" + i + j;
                        break;
                    case 18:
                        BetName = i + "XXX" + j;
                        break;
                }
                var model = {
                    BetTypeName: BetName,
                    Odds: '',
                    Color: j == 4 ? 'blue' : j == 9 ? 'blue' : 'red',
                    Gold: ko.observable().extend({ limit: { range: 0, fix: 0 } }),
                    selectStyle: ko.observable(),
                    IsMaster: true
                }
                arr.push(model);
            }
            var line = {
                line: arr
            }
            TableArr.push(line);
            FixTwo.temp = TableArr;
        }

        that.list(TableArr)

    };
    FixTwo.prototype.GetDate = function (bettypeid) {
        var that = this,
            XX = "XX",
            Opennig = false;

        switch (bettypeid) {
            case 2:
                XX = "XX";
                break;
            default:
                XX = "XX";
                break;
        }
        $.ajax({
            url: '/index.php/Portal/FixTwo/GetMemberBetOdds',
            cache: false,
            data: { lottery: 1, betTypeId: bettypeid },
            dataType: 'json',
            success: function (data) {
                var TableArr = [];
                if (data.length) {
                    for (var k = 0; k < data.length; k++) {
                        if (data[k].IsMaster == true) {//判断为初始赔率
                            that.MaxLimitItemBet(data[k].MaxLimitItemBet);
                            that.MaxLimitSigleBet(data[k].MaxLimitSigleBet);
                            that.MinLimitBetAmount(data[k].MinLimitBetAmount);
                        }
                    }

                }
                var Odds = 0, MaxLimitItemBet = 0, MaxLimitSigleBet = 0, MinLimitBetAmount = 0, IsMaster;
                for (var i = 0; i < 10; i++) {
                    var arr = [];
                    for (var j = 0; j < 10; j++) {
                        //Odd:千位数字；Even:个位数数字； BetTypeName: "单项名"；Odds: “赔率”；MaxLimitItemBet: 单项上限；MaxLimitSigleBet: 单注上限 ；MinLimitBetAmount: 最小下注金额
                        var BetName = "";
                        switch (that.lotteryItem()) {
                            case 2:
                                BetName = i + "" + j + "XX";
                                break;
                            case 3:
                                BetName = i + "X" + j + "X";
                                break;
                            case 4:
                                BetName = i + "XX" + j;
                                break;
                            case 5:
                                BetName = "X" + i + "X" + j;
                                break;
                            case 6:
                                BetName = "X" + i + j + "X";
                                break;
                            case 7:
                                BetName = "XX" + i + j;
                                break;
                            case 17:
                                BetName = "XXX" + i + j;
                                break;
                            case 18:
                                BetName = i + "XXX" + j;
                                break;
                        }

                        var hight = i + "";
                        var low = j + "";
                        var len = data.length;
                        while (len--) {
                            if (data[len].BetItem == BetName) {//如果有相同的下注号码，应取最小的赔率
                                Odds = data[len].Odds;
                                MaxLimitItemBet = data[len].MaxLimitItemBet;
                                MaxLimitSigleBet = data[len].MaxLimitSigleBet;
                                MinLimitBetAmount = data[len].MinLimitBetAmount;
                                IsMaster = data[len].IsMaster;
                                break;
                            } else if (data[len].BetItem == '') {
                                Odds = data[len].Odds;
                                MaxLimitItemBet = data[len].MaxLimitItemBet;
                                MaxLimitSigleBet = data[len].MaxLimitSigleBet;
                                MinLimitBetAmount = data[len].MinLimitBetAmount;
                                IsMaster = data[len].IsMaster;
                            }
                        }
                        var model = {
                            Odd: i,
                            Even: j,
                            BetTypeName: BetName,
                            Odds: Odds,
                            MaxLimitItemBet: MaxLimitItemBet,
                            MaxLimitSigleBet: MaxLimitSigleBet,
                            MinLimitBetAmount: MinLimitBetAmount,
                            IsMaster: IsMaster,
                            Gold: ko.observable('').extend({ limit: { range: 0, fix: 0 } }),
                            selectStyle: ko.observable()
                        }
                        arr.push(model);
                    }

                    var line = {
                        line: arr
                    }
                    TableArr.push(line);
                    FixTwo.temp = TableArr;
                }

                that.list(TableArr)
            }
        });
    };
    $.extend(FixTwo, {
        temp: null
    });
    exports.viewmodel = FixTwo;
});