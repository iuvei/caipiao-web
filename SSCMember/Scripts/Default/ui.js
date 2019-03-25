/// container外共用
/// <reference path="_ref.js" />
/// <reference path="utils.js" />
/// <reference path="ui.common.js" />
define(function (require, exports, module) {
    exports.StopNumber = ko.observableArray();
    exports.childList = ko.observableArray();
    exports.menuName = ko.observable('规则说明');
    exports.tabmenu = function (url, js, $index, $data, event) {
        if (event === undefined) {
            event = $data;
            $data = $index;
            $index = null;
        }
        exports.childList([]);
        var ele = $(event.target);
        exports.currentItem[0] = ele;
        var child = ele.data("child");
        ele.parent().addClass('active').siblings('.active').removeClass("active");
        exports.childList(child).menuName(!!js ? ele.text() : '规则说明');
        //右边的a标签点击
        $('.guide_right a').on('click', function () {
            exports.childList(child).menuName(!!js && $(this).text());
        });
        $('#' + ele.data('hide')).hide();
        if ((!Utils.Cookie.get('PeriodsID') || Utils.Cookie.get('PeriodsStatus') - 0 === 0) && ele.closest('div').hasClass('menu') && !ele.data('exclude')) {
            this.replace(); return;
        }
        //console.log($('#print_box').height() + '' + $('body').height());
        if ($index !== null) location.hash = "$" + $index;
        framework.view(url, js, undefined, true);
    };
    /**
    *@property currentItem  当前选中的功能,用于开/封盘刷新使用
    */
    exports.currentItem = [];
    /**
    *@method signOut 退出登录(清除Cookie);
    */
    exports.signOut = function () {
        Utils.Cookie.remove('Ticks', '/').remove('StopNumber', '/').remove('DeleteStopNumber', '/').remove('isFirst', '/').remove('PeriodsNumber').remove('PeriodsID');
        location.href = '/index.php/portal/index/login';
    };
    exports.replace = function () {
        if (framework.container().indexOf("FastBeat/Index") > -1) {
            return;
        }
        if (!ko.components.isRegistered('Tip-Dialog')) {
            ko.components.register('Tip-Dialog', { template: $('#Tip-Dialog').html() });
        }
        this.container('Tip-Dialog');
    };
    /**
    *@method openChild 加载一个组件
    *@param $data {object}  一个model
    *@paran event {Event}   对象触发事件的信息
    */
    exports.openChild = function ($data, event) {
        var target = $(event.target);
        target.addClass('menuon').siblings('.menuon').removeClass("menuon");
        $('#' + target.data('hide')).hide();
        /// 要打开页面，需执行 framework.view()方法
        var alias = /^\//.test($data.MenuKey) ? $data.MenuKey.slice(1) : $data.MenuKey;
        framework.view($data.MenuKey, alias);
    };
    /**
    *@method clear 清除当前组件,触发的元素可以包含一个id,用于清除之后显示其他局部内容
    */
    exports.clear = function (data, event) {
        this.container('clear');
        var target = $(event.target);
        $('#' + target.data('show')).show();
        target.parent().addClass('active').siblings('.active').removeClass("active");
    };
    /**
    *@method refre 刷新组件
    */
    exports.refre = function () {
        framework.refresh();
    };
    /**
    *@method memberRefresh 刷新会员信息
    */
    exports.memberRefresh = function () {
        framework._extend.refreshInfo();
    };

    /// 开盘刷新当前组件
    /// @param {Boolean} isForce 是否强制刷新组件
    exports.refreshWhenOpen = function (isForce) {
        var hash = location.hash;
        if (!/^#\$\d+/.test(hash)) return;
        var $index = Number(hash.slice(2));
        var $li = $("#TabMenuBox").children().eq($index);
        if (isForce) framework.container("empty");
        $li.children("a").trigger("click");
    }

    var countPage = 1,
        pagNumIndex = 1;

    /*上一页*/
    exports.clickPreviousPageLeft = function () {

        countPage = countPage - pagNumIndex;
        if (countPage - 0 == 0) {
            countPage = 1;
        }
        framework._extend.getBetInfoForLeftInfo(countPage);
    }
    /*下一页*/
    exports.clickNextPageLeft = function () {

        countPage = countPage + pagNumIndex;
        framework._extend.getBetInfoForLeftInfo(countPage);
    }
    /**
    *@method WipeData 清空下注信息
    */
    exports.WipeData = function () {
        var order = $('#Order');
        $.ajax({
            url: "/index.php/Home/ModifyBetLeftClear",
            type: "post",
            success: function (json) {
                if (json.status == true) {
                    $('#BetDt').html('');
                    $('#Number').html('');
                    framework._extend.getBetInfoForLeftInfo();
                }
            }
        });
    };
    exports.clearSingleNote = function () {
        $('#PeriodsNumberHtml').nextAll('.active').remove();
        $('#BetDt').html('');
        $('#Number').html('');
        $('#CountHome').html(0);
        $('#SumHome').html(0);
    };
    $(function () {
        // $.ajaxSetup({
        // error: function () {
        // if (confirm("您已经被踢出，请重新登录!")) {
        // location.href = "/Home/Index";
        // }
        // }
        // })
        //var lottoryResult = {
        //    nowLastPeriodsNumber: "",
        //    timeout:null,
        //    //获取上期开奖结果
        //    getLastPeriodsNumber:function () {
        //        $.ajax({
        //            url: "/Home/GetDrawResult",
        //            cache: false,
        //            dataType: 'json',
        //            success: function (json) {
        //                if (json.status) {
        //                    var r = json.info.c_r;
        //                    var l = lottoryResult.nowLastPeriodsNumber;
        //                    if (l !== '' && r === l) {
        //                        lottoryResult.timeout = setTimeout(lottoryResult.getLastPeriodsNumber, 30000);
        //                    }
        //                    $("#lastPeriodsNumber").text(json.info.c_r);
        //                    $("#Member-Issue").text(json.info.c_t);
        //                }
        //            }
        //        })
        //    },
        //    clearTimeoutL: function () {
        //        if (lottoryResult.timeout) {
        //            clearTimeout(lottoryResult.timeout);
        //            lottoryResult.timeout = null;
        //        }
        //    }
        //}
        if (Utils.Cookie.get('IsShowLottory') == "false") { //如果IsShowLottory是false，表示是小票打印
            $('#IsShowLottoryFalse').hide();
            $('#IsShowLottoryTrue').show();
        } else {
            $('#IsShowLottoryFalse').show();
            $('#IsShowLottoryTrue').hide();

        }

        var info = $('.stoptime'),
            noticeSettings = {
                url: "/index.php/Home/GetUserLoginNoticeByType",
                cache: false,
                dataType: "json",
                data: {}
            };
        Utils.Cookie.remove('Ticks', '/');
        var periods = {
            calcDiff: function (e, n, callback) {
                var end = new Date(e),
                    now = new Date(n.replace(/-/g, '/')),
                    secondsCount = (end - now) / 1000,
                    day = (secondsCount / 86400) | 0,
                    hours = (secondsCount % 86400) / 3600 | 0,
                    minute = (secondsCount % 3600) / 60 | 0,
                    seconds = (secondsCount % 60);
                if (periods.interval !== null) {
                    clearInterval(periods.interval);
                }
                var last = +(new Date());
                periods.interval = setInterval(function () {
                    if (seconds <= 0) {
                        if (minute > 0) {
                            minute = minute - 1;
                            seconds = 60;
                        }
                        else if (hours > 0) {
                            hours = hours - 1;
                            minute = 59;
                            seconds = 60;
                        }
                        else if (day > 0) {
                            day = day - 1;
                            hours = 23;
                            minute = 59;
                            seconds = 60;
                        }
                        else {
                            clearInterval(periods.interval);
                            callback.call(periods, day, hours, minute, seconds, (day + hours + minute + seconds) <= 0 ? false : true);
                            return;
                        }
                    }
                    var n = +(new Date());
                    sc = Math.round((n - last) / 1000);
                    n = last + sc * 1000;
                    seconds -= sc;
                    last = n;
                    framework._extend.currentCloseMinute = day * 24 * 60 + hours * 60 + minute;
                    callback.call(periods, day, hours, minute, seconds, ((day * 60 * 60 * 24) + (hours * 60 * 60) + (minute * 60) + seconds) <= 0 ? false : true);
                }, 1000);
                callback.call(periods, day, hours, minute, seconds, ((day * 60 * 60 * 24) + (hours * 60 * 60) + (minute * 60) + seconds) <= 0 ? false : true);
            },
            interval: null,
            getInterval: null,
            periodsStatus: "",
            /**
             *@method  mian  定时获取期数状态
             *@params  fn    首次调用该方法执行的回调。
             */
            main: function (fn) {
                var that = this;
                $.ajax({ url: '/index.php/Home/GetLastPeriods', cache: false }).done(function (data) {
                    clearInterval(periods.getInterval);
                    if (data.status == false && data.isCheckOnline == true) {
                        location.href = "/index.php/Index/login";
                        alert(data.info);
                    }
                    if (data.PeriodsStatus !== Utils.Cookie.get('PeriodsStatus')) {
                        Utils.Cookie.remove("PeriodsStatus", '/').remove('PeriodsID', '/').remove('PeriodsNumber', '/');
                    }
                    if (!data.status) {
                        info.text('[最近无开盘期数]');
                        periods.statusObservable(undefined);
                        framework.clearSingleNote();
                        //document.getElementById("Member-Issue").innerHTML = '';//期数空
                        if (periods.periodsStatus !== "20") {
                            periods.periodsStatus = "20";
                            Utils.Cookie.set('PeriodsStatus', 0, 0, '/');
                            //framework.view("/FastBeat/Index", "BetPanel/FastBeat/Index/FastBeat/Index");
                            framework._extend && framework._extend.clearFastBeatData && framework._extend.clearFastBeatData();
                        }
                        return;
                    }
                    if ($.isPlainObject(data.dw)) {
                        $("#lastPeriodsNumber").text(data.dw.c_r);
                        $("#Member-Issue").text(data.dw.c_t);
                    }
                    var newData = {};
                    $.extend(newData, data);
                    //已经封盘，服务器PeriodsStatus还是1时
                    if (data.PeriodsStatus === 1 && (new Date(data.nowDateTime).getTime() > new Date(data.CloseDt).getTime())) {
                        newData["OpenDt"] = data.DrawDt;
                        newData["PeriodsStatus"] = 0;
                    }
                    //已经开盘，服务器PeriodsStatus还是0时
                    if (data.PeriodsStatus === 0 && (new Date(data.nowDateTime).getTime() > new Date(data.OpenDt).getTime())) {
                        newData["PeriodsStatus"] = 1;
                    }
                    periods.statusObservable(data.PeriodsStatus);
                    function next(d) {
                        Utils.Cookie.set('PeriodsNumber', d.PeriodsNumber, 0, '/').set('PeriodsID', d.ID, 0, '/').set('PeriodsStatus', d.PeriodsStatus, 0, '/');
                        var time = new Date(), text = [];
                        switch (d.PeriodsStatus) {
                            case 0://未开盘
                                Utils.Cookie.set('PeriodsStatus', 0, 0, '/');
                                time = new Date(d.OpenDt);
                                text = ["开盘", "[正在开盘,请稍后......]"];
                                framework._extend.NotAjax = true;//NotAjax[true:阻止压停列表查询，阻止盘口投注信息获取]
                                exports.refreshWhenOpen(true);
                                break;
                            case 1: //已开盘
                                Utils.Cookie.set('PeriodsStatus', 1, 0, '/');
                                time = new Date(d.CloseDt);
                                text = ["封盘", "[正在开盘,请稍后......]"];
                                setTimeout(function () {
                                    framework._extend.NotAjax = false;
                                    exports.refreshWhenOpen();
                                }, 50);
                                break;
                        }
                        time.setSeconds(time.getSeconds() + 3);
                        clearInterval(periods.getInterval);
                        periods.calcDiff(time, d.nowDateTime, function (day, hours, minute, seconds, flags) {
                            var tempvalue = "";
                            if (flags) {
                                tempvalue = "01";
                                info.text('距离[' + d.PeriodsNumber + ']期' + text[0] + '还有' + day + '天' + hours + '小时' + minute + '分钟' + seconds + '秒');
                                $("#PeriodsNumberPrompt").text("第" + d.PeriodsNumber + "期，3天内有效！！");
                            }
                            else {
                                tempvalue = "00";
                                info.text(text[1]);
                                framework._extend.NotAjax = true;
                                if (periods.periodsStatus !== tempvalue && periods.getInterval != null) {
                                    clearInterval(periods.getInterval);
                                    //准备封盘时
                                    if (d.PeriodsStatus === 1) {
                                        Utils.Cookie.set('PeriodsStatus', 0, 0, '/');
                                        framework.replace();
                                        framework.clearSingleNote();
                                    }
                                    setTimeout(periods.main, Math.floor(Math.random() * 3 + 3) * 1000);
                                    periods.getInterval = setInterval(periods.main, 180000);
                                }
                            }
                            if (periods.periodsStatus !== tempvalue) {
                                framework._extend && framework._extend.clearFastBeatData && framework._extend.clearFastBeatData();
                            }
                            periods.periodsStatus = tempvalue;
                        });
                    };
                    next(newData);
                    fn && fn();
                });
            },
            /**
            @method statusObservable  状态监控
            */
            statusObservable: (function () {
                var status = undefined;
                return function (currentStatus) {
                    if (currentStatus !== status) {
                        status = currentStatus;
                        if (framework.currentItem[0] && !framework._extend.NotAjax) {
                            framework.container('empty');
                            if (framework.container().indexOf("FastBeat/Index") < 0) {
                                setTimeout(function () {
                                    framework.currentItem[0].trigger('click');
                                }, 0);
                            }
                        }
                    }
                }
            })()
        };
        exports.periods = periods;
        var notice = {
            interval: null,
            noticeFactory: {
                marquee: function (element, content, endTime) {
                    var
                        element = $(element);
                    element.html(content[0].Detail);//element.html() + content[0].Detail
                    interval = setInterval(function () {
                        if (Date.now() >= (new Date(endTime)) - 0) {
                            element.html('');
                            clearInterval(interval);
                        }
                    }, 1000);
                    return this;
                },
                popup: function (content) {
                    var flags = 0;
                    (function (f) {
                        var self = arguments.callee;
                        var d = dialog({
                            title: content[f].Title == null ? '公告提示' : content[f].Title,
                            content: content[f].Detail,
                            width: 300,
                            fixed: true
                        });
                        d.addEventListener('close', function () {
                            f++;
                            if (content[f]) {
                                self(f);
                            }
                        });
                        d.show();
                    })(flags);
                    return this;
                },
                tip: function (content) {
                    var flags = 0;
                    (function (f) {
                        var self = arguments.callee;
                        framework._extend.TipDialog({
                            height: '200px',
                            width: '300px',
                            content: content[f].Detail,
                            title: content[f].Title == null ? '公告提示' : content[f].Title
                        })
                            .show()
                            .addEvent('close', function () {
                                this.remove();
                                f++;
                                if (content[f]) {
                                    setTimeout(function () {
                                        self(f);
                                    }, 20);
                                }
                            });
                    })(flags);
                }
            },
            /**
             定时获取公告
             */
            main: function () {
                var ticks = Utils.Cookie.get('Ticks');
                noticeSettings.data.Ticks = ticks ? ticks : '';
                $.ajax(noticeSettings)
                    .done(function (data) {
                        if (data && data[1] && data[1].length) {
                            Utils.Cookie.set('Ticks', noticeSettings.data.Ticks = data.shift(), 0, '/');
                            //跑马灯,弹窗,右下角
                            var marquee = [],
                                popup = [],
                                right = [],
                                endTime,
                                type,
                                data = data[0];
                            for (var i = 0, len = data.length; i < len; i++) {
                                type = data[i]['ShowType'];
                                switch (type) {
                                    case 1:
                                        marquee.push(data[i]);
                                        if (i === data.length - 1) {
                                            endTime = data[i].EndDt;
                                        }
                                        break;
                                    case 2:
                                        popup.push(data[i]);
                                        break;
                                    default:
                                        right.push(data[i]);
                                        break;
                                }

                            }
                            if (popup.length) {
                                notice.noticeFactory.popup(popup)
                            }
                            if (marquee.length) {
                                notice.noticeFactory.marquee(document.getElementById('Detail'), marquee, endTime);
                            }
                            if (right.length) {
                                notice.noticeFactory.tip(right);
                            }
                        }
                    });
            }
        };
        periods.main(function () {
            if (Utils.Cookie.get('PeriodsNumber') !== null) {
                framework._extend.getBetInfoForLeftInfo();
            }
        });
        periods.getInterval = setInterval(periods.main, 120000);
        //setInterval(periods.main, 5000);
        notice.main();
        setInterval(notice.main, 200000);
        //lottoryResult.getLastPeriodsNumber();
        /**
         *点击滚动的时候弹出窗口
         */
        $('.marquee .mar').click(function () {
            var detail = $('#Detail').text(),
                d = dialog({
                    title: '详细公告',
                    content: detail,
                    width: 300
                    // height: 150

                });
            if (!($.trim(detail) === '')) {
                d.show();
            }
        });
        $(window).on('unload', function () {
            Utils.Cookie.set('reOpen', 'true', '0', '/');
        });
        /**
       *记录hash值
       */
        $('#menus li').click(function (e) {
            var
                anchor = e.currentTarget.id;
            window.location.hash = '!' + anchor;
            $.cache.currentViewID = anchor;
        });
        $(window).on('hashchange', function () {
            var hash = location.hash;
            if (/^#\$/.test(hash)) return; /// #$ 开头则为玩法的切换
            var selector = hash.replace('!', '');
            if (selector === '') {
                window.location.reload();
            }
            //如果点击了后退按钮，那么hash肯定是和当前不一致的。
            if (!(selector.replace('#', '') === $.cache.currentViewID)) {
                $(selector).find('a').trigger('click', { isHashChange: true });
            }
        });
    });
});