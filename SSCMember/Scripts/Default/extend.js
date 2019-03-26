/// <reference path="~/Scripts/_references.js" />
/**
* @class _extend
* @static  framework扩展
*/
(function (global) {
    var extend = framework._extend = framework._extend || {};
    extend.betRoot = "http://www.wlx.com:811/"
    //ajax超时时间, 1分钟
    //extend.ajaxTimeout = 0;
    /**
    * 右下角对话框
    * @param {object} options
    *   @param [title]     {string}  标题
    *   @param [content]   {string}  内容
    *   @param [width]     {string}  宽度
    *   @param [height]    {string}  高度
    *   @param [parentEL]  {Element} 父元素
    *   @param [interval]  {int}     消失时间(暂时没有实现)
    *   @return {object}             包含show|close|remove等方法的单例。
    */
    extend.TipDialog = function (options) {
        var defaults = {
            title: '公告提示',
            content: '',
            width: '200px',
            height: '130px',
            parenrEL: document.body,
            interval: 500
        },
            eventQueue = [];
        var result = $.extend(defaults, options),
            inner = $("<div id='model-dialog'><div class='head'><span class='dialog-title'>" + result.title + "</span><span class='close' >×</span></div><div class='content'>" + result.content + "</div>"),
            parent = $(result.parenrEL);
        parent.append(inner);

        var handels = {
            show: function (fn) {
                inner
                .css({ width: result.width })
                .animate({ height: result.height }, result.interval, fn)
                .find('.close').one('click', this.close);
                return this;
            },
            close: function (event) {
                var callback = handels.flush('close');
                inner.animate({ height: 0 }, result.interval, $.proxy(callback, handels));
                return this;
            },
            remove: function (fn) {
                inner.remove();
                typeof fn === 'function' && fn();
                return this;
            },
            addEvent: function (eventName, fn) {
                var self = this,
                    queue = {};
                queue[eventName] = fn;
                eventQueue.push(queue);
                return self;
            },
            removeEvent: function (eventName) {
                eventQueue.splice(handels.flush(eventName), 1);
            },
            flush: function (handel) {
                for (var i = eventQueue.length; i--;) {
                    if (eventQueue[i][handel]) {
                        return eventQueue[i][handel];
                    }
                }
            }
        };
        return handels;
    };

    /**
    * @method getUserInfo  获取会员信息
    * @param {function} fn 回调函数
    */
    extend.getUserInfo = function (fn) {
        $.ajax({
            url: "/index.php/Home/GetMemberCredit",
            cache: false,
            dataType: "json",
            success: function (json) {
                fn && fn.call(extend, json);
            }
        });
    };

    /**
    *@method refreshInfo 刷新会员信息
    */
    extend.refreshInfo = function () {
        this.getUserInfo(function (json) {
            $("#LoginName").html(json.UserName);//账号名称
            $("#MemberLoginName").html(json.UserName);
            $("#DefaultCredit").html(parseFloat(json.Credit).toFixed(4) - 0);//总信用额度
            $("#UsedCredit").html(parseFloat(json.UsedCredit).toFixed(4) - 0);//已用信用额度
            $("#RemainingUndrawn").html(parseFloat(json.Credit - json.UsedCredit).toFixed(4) - 0 < 0 ? 0 : parseFloat(json.Credit - json.UsedCredit).toFixed(4) - 0);//剩余信用额度
            Utils.Cookie.set('CancelBet', json.CancelBet, 0, '/'); //退码时间在该时间内
            Utils.Cookie.set('SecondStopEarly', json.SecondStopEarly, 0, '/');//二字定封盘前多少分钟内不能下注
        });
    };

    /**
        *@method BetTypeIDXian 判断是否显示现字
        *@param  t {int}       下注类型
        */
    function BetTypeIDXian(t) {
        switch (t - 0) {
            case 14: case 15: case 16:// TwoDisplay = 14,  ThreeDiplay = 15,  FourDisplay = 16
                return "inline";
            default:  //OOXX = 2,OXOX = 3,OXXO = 4,XOXO = 5,XOOX = 6,XXOO = 7,OOOX = 9,OOXO = 10, OXOO = 11,XOOO = 12,FourFix = 13,
                return "none";
        }
    }
    /**
    * @method  GetBetInfoForLeft  查询及时注单操作(左边下注信息)
    */
    extend.getBetInfoForLeftInfo = function (pagNumIndex) {
        var order = $('#Order'),
            ColumnLeft = $("#ColumnLeft").html();
        if (pagNumIndex == undefined) {
            pagNumIndex = 1;
        }
        //防止下一页的页数大于总页数判断
        if (ColumnLeft != "" && ColumnLeft != undefined && ColumnLeft != null) {
            if (pagNumIndex > ColumnLeft) {
                pagNumIndex = ColumnLeft;
            }
        }
        var ajaxRequest = $.ajax({
            url: "/index.php/Portal/FastBeat/GetBetInfoForLeft",
            data: {
                /**
                *@property lotteryId
                *@type {int}
                *@default 1  七星目前是写死的1
                */
                lotteryId: 1,
                pagNum: pagNumIndex
            },
            cache: false,
            success: function (json) {
                    var
                        Column = 0,//数据库返回的总页数
                         PreviousPageLeftID = document.getElementById("PreviousPageLeftID"),
                         NextPageLeftID = document.getElementById("NextPageLeftID");
                    if (json.list.length != 0) {
                        if (json.PageCount - 0 != 0 || json.PageCount[0].Column1 - 0 != 0 || json.list - 0 != 0) {
                            Column = json.PageCount[0].Column1 - 0;
                            $("#ColumnLeft").html(json.PageCount[0].Column1);//共几页

                        }
                    }
                    if (Column >= 2) {
                        document.getElementById("FenYeStyle").style.display = "inline";//"inline";
                    } else {
                        document.getElementById("FenYeStyle").style.display = "none";
                    }
                    //if (Column <= 1) {
                    //    $("#isVisibleLeft").hide();
                    //}
                    if (pagNumIndex - 1 == 0) {//上一页
                        PreviousPageLeftID.disabled = true;
                    } else {
                        PreviousPageLeftID.disabled = false;
                    }
                    if (pagNumIndex == Column) {//下一页
                        NextPageLeftID.disabled = true;
                    } else {
                        NextPageLeftID.disabled = false;
                    }


                    json || (json = []);
                    order.find('.active').remove();
                    $("#CountHome").html(json.list.length);//笔数
                    var SumHome = 0;
                    for (var i = 0; i < json.list.length; i++) {
                        SumHome += parseFloat(json.list[i].BetAmount);
                    }
                    $("#SumHome").html(SumHome.toFixed(4) - 0);//总金额
                    if (json.list.length) {
                        $("#BetDt").html(json.Numbering[0].BetDt);// new Date(new Date(json[0].BetDt).toUTCString()).format('yyyy-MM-dd hh:mm:ss');
                        $("#Number").html(json.Numbering[0].Number);
                        var strHtml = "";
                        for (var i = 0; i < json.list.length; i++) {
                            strHtml += "<tr class='user-b active'><td class='no' width='30%'>"
                                + json.list[i].BetNumber
                                + " <label style='font-weight: bold;color:red;display:" + BetTypeIDXian(json.list[i].BetTypeID) + "'' >现</label>"
                                + "</td>"
                                + "<td width='40%'>"
                                + 1//json.list[i].BetAmount
                                + " : "
                                + json.list[i].Odds
                                + "</td>"
                                + "<td width='30%'class='hasBd'>"
                                + json.list[i].BetAmount
                                + "</td></tr> \r";

                        }
                        $("#PeriodsNumberHtml").after(strHtml);
                    }
                    if (json.list.length == 0) {
                        $("#BetDt").html('');
                        $("#Number").html('');
                        return;
                    }
                    var scrollContainer = $("#sideScrollContainer");
                    scrollContainer.scrollTop(scrollContainer[0].scrollHeight);
            }
        });
    };
    extend.resetBetInfoForLeftInfo = function (PeriodsNumber) {
        if (PeriodsNumber&&$('#Order .active').length > 0 && $("#Number").html().indexOf(PeriodsNumber) == -1) {
            $("#BetDt").html('');
            $("#Number").html('');
            $("#FenYeStyle").css("display", "none");
            $('#Order .active').remove();
            $("#CountHome").html(0);
            $("#SumHome").html(0);
        }
    }
    /**
     *@method appendBetInfoForLeftInfo 添加及时注单操作(左边下注信息)
     */
    extend.appendBetInfoForLeftInfo = function (betInfo, isPrint) {
        console.log('1111')
        isPrint = !!isPrint;
        if ($.isPlainObject(betInfo)) {
            betInfo = [betInfo];
        }
        else if (!$.isArray(betInfo)) {
            return;
        }
        if (isPrint) {
            $("#CountHome").html(0);
            $("#SumHome").html(0);
            $("#FenYeStyle").css("display", "none");
            $("#ColumnLeft").html(1);
            $("#PeriodsNumberHtml").parent().find('.active').remove();
        }
        var ColumnLeft = $("#ColumnLeft").html() - 0;
        var CountHome = $("#CountHome").html() - 0;
        var  NextPageLeftID = $("#NextPageLeftID");
        if (betInfo.length > 0) {
            var nextCan = false;
            var lens = betInfo.length;
            var obj = betInfo[lens - 1]
            $("#BetDt").html(obj.BetDt);//new Date(new Date(betInfo[lens - 1].BetDt).toUTCString()).format('yyyy-MM-dd hh:mm:ss'));
            $("#Number").html('' + obj.PeriodsNumber + obj.BetInfoID);
            if (CountHome >= 500) {
                nextCan = true;
            }
            else {
                var strHtml = "";
                var sumHome = $("#SumHome").html() - 0;
                var tempNum = CountHome + lens;
                if (tempNum > 500) {
                    nextCan = true;
                    lens = 500 - CountHome;
                    tempNum = 500;
                }
                CountHome = tempNum;
                for (var i = 0; i < lens; i++) {
                    strHtml += "<tr class='user-b active'><td class='no' width='30%'>"
                        + betInfo[i].BetNumber
                        + " <label style='font-weight: bold;color:red;display:" + BetTypeIDXian(betInfo[i].BetTypeID) + "'' >现</label>"
                        + "</td>"
                        + "<td width='40%'>"
                        + 1//json.list[i].BetAmount
                        + " : "
                        + betInfo[i].Odds
                        + "</td>"
                        + "<td width='30%'class='hasBd'>"
                        + betInfo[i].BetAmount
                        + "</td></tr> \r";
                    sumHome += parseFloat(betInfo[i].BetAmount).toFixed(3) - 0;;
                }
                $("#SumHome").html(sumHome);
                $("#CountHome").html(CountHome)
                $("#PeriodsNumberHtml").parent().append(strHtml);
            }
            if (nextCan &&($("#FenYeStyle").css("display") == "none" || NextPageLeftID.prop("disabled"))) {
                $("#ColumnLeft").html(ColumnLeft + 1);
                $("#FenYeStyle").css("display", "inline");
                NextPageLeftID.prop("disabled", false);
            }
        }

        var scrollContainer = $("#sideScrollContainer");
        scrollContainer.scrollTop(scrollContainer[0].scrollHeight);
    }
    /**
    * @method calcCredit 计算会员已用的额度和剩余额度。
    * @param {int} credit 当前一次使用的额度
    */
    extend.calcCredit = function (credit) {
        var usedCredit = $("#UsedCredit"),
            defaultCredit = $("#DefaultCredit"),
            countUsed = usedCredit.html() - 0 + credit;
        usedCredit.html(countUsed.toFixed(4) - 0);
        $("#RemainingUndrawn").html(defaultCredit.html() - 0 - countUsed);
    };

    /**
    *@ReturnCredit 计算：退码成功后返回额度
    */
    extend.ReturnCredit = function (credit) {
        var usedCredit = $("#UsedCredit"),
           defaultCredit = $("#DefaultCredit"),
           countUsed = usedCredit.html() - 0 - credit;
        usedCredit.html(countUsed.toFixed(4) - 0);
        $("#RemainingUndrawn").html((defaultCredit.html() - 0 - countUsed).toFixed(4) - 0);
    };
    extend.currentCloseMinute = 0;
    $(function () {
        extend.refreshInfo();
        document.getElementById("SubNickName").innerHTML = Utils.Cookie.get("SubNickName"); //显示会员昵称
    });
})(window);

// 额度刷新
$(function() {
    setInterval(function() {
        $('#dvMemberRefreshButton').trigger('click');
    }, 10E3);
})

