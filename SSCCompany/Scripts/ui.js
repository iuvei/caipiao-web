/// container外共用
/// <reference path="_ref.js" />
/// <reference path="utils.js" />
/// <reference path="ui.common.js" />
define(function (require, exports, module) {
    exports.childList = ko.observableArray();
    exports.menuName = ko.observable('规则说明');
    exports.tabmenu = function (url, js, $data, event) {
        if (window && window["PeriodsListInterval"] != null) {
            clearInterval(window["PeriodsListInterval"]);
            window["PeriodsListInterval"] = null;
        }
        exports.childList([]);
        var ele = $(event.target);
        var child = ele.data("child");
        ele.parent().addClass('active').siblings('.active').removeClass("active");
        exports.childList(child).menuName(!!js ? ele.text() : '规则说明');
        //右边的a标签点击
        $('.guide_right a').on('click', function () {
            exports.childList(child).menuName(!!js && $(this).text());
        });
        if (Utils.Cookie.get('CompanyType') - 0 != 2) {
            if (url == "/TempLate/Homes") {
                url = '/index.php/portal/agent/OnlineNumber';
                js = 'TempLate/OnlineNumber';
                $('a[href="/TempLate/OnlineNumber"]').addClass('menuon').siblings('.menuon').removeClass("menuon");
            }
        }
        Utils.Cookie.set('arrIsWin', '', 0, '/');
        clearTimeout(Utils.tip.interval);
        Utils.tip.d && Utils.tip.d.close();
        framework.view(url, js);
    };
    exports.signOut = function () {
        Utils.Cookie.remove('Ticks', '/').remove('isAgentLevel', '/').remove('RationLable', '/').remove('AgentLevel', '/').remove('PeriodsNumber').remove('PeriodsID');
        location.href = '/index.php/portal/index/agent';
    };
    exports.openChild = function ($data, event) {
        if (!Utils.Cookie.get('PeriodsID')) {
            //如果封盘了查询最后一期数据
            $.ajax({
                url: "/index.php/portal/agent/GetLastPeriodsNumber",
                cache: false,
                success: function (data) {
                    if (data.length > 0) {
                        Utils.Cookie.set('PeriodsNumber', data[0].PeriodsNumber, 0, '/').set('PeriodsID', data[0].ID, 0, '/');// that.PeriodsNumber(data[0].PeriodsNumber);
                    }
                }
            });
        }
        $(event.target).addClass('menuon').siblings('.menuon').removeClass("menuon");
        /// 要打开页面，需执行 framework.view()方法
        var alias = /^\//.test($data.MenuKey) ? $data.MenuKey.slice(1) : $data.MenuKey;
        var alias=alias.replace('index.php/portal/agent/', "");
        framework.view($data.MenuKey, alias);
    };
    exports.refre = function () {
        framework.refresh();
    };
    exports.periodsStatus = ko.observable(false);
    $(function () {
        // $.ajaxSetup({
            // error: function () {
                // alert("您已经被踢出，请重新登录!")
                // location.href = "/Home/Index";
            // }
        // })
        var info = $('.stoptime'),
            periods,
            notice,
            noticeSettings = {
                url: "/index.php/portal/agent/GetUserLoginNoticeByType",
                cache: false,
                dataType: "json",
                data: {}
            };
        Utils.Cookie.remove('Ticks', '/');
        $('#menus').children(':first').addClass('active');
        exports.childList($('#menus > :first > a').data("child"));
        // if (Utils.Cookie.get('CompanyType') != 2 && Utils.Cookie.get('CompanyType') != 1) {
        //     framework.view('/index.php/portal/agent/OnlineNumber', 'TempLate/OnlineNumber');
        // } else {
            // 代理、大股东登录时，默认切换到报表
            var ele = $("#menus li#3 a");
            var child = ele.data("child");
            exports.childList(child).menuName(ele.text());
            $("#menus li#3").addClass("active").siblings().removeClass("active");
            framework.view('/index.php/portal/agent/Report', 'Report/Index');
        // }
        setTimeout(function () {
            $('a[href="/TempLate/OnlineNumber"]').addClass('menuon').siblings('.menuon').removeClass("menuon");
        }, 100)
        var periods = {
            calcDiff: function (e, n, callback) {
                var end = new Date(e),
                    now = new Date(n),
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
                    n = last + sc*1000;
                    seconds -= sc;
                    last = n;
                    callback.call(periods, day, hours, minute, seconds, (day + hours + minute + seconds) <= 0 ? false : true);
                }, 1000);
                callback.call(periods, day, hours, minute, seconds, (day + hours + minute + seconds) <= 0 ? false : true);
            },
            periodsStatus:'',
            /**
            定时获取期数状态
            */
            main: function () {
                $.get('/index.php/portal/agent/GetLastPeriods?_=' + (new Date() - 0), function (data) {
                    if (data.status == false && data.isCheckOnline == true) {
                        clearInterval(periods.interval);
                        clearInterval(periodsMainInterval);
                        clearInterval(noticeMainInterval);
                        location.href = "/index.php/portal/index/agent";
                        alert(data.info);
                    }
                    if (!data.status) {
                        exports.periodsStatus(false);
                        clearInterval(periods.interval);
                        info.text('[最近无开盘期数]');
                        Utils.Cookie.remove('PeriodsNumber', '/').remove('PeriodsID', '/').remove('PeriodsStatus', 0);
                        return;
                    }
                    Utils.Cookie.set('PeriodsStatus', data.PeriodsStatus, 0, '/');
                    
                    switch (data.PeriodsStatus) {
                        case 0:
                            exports.periodsStatus(false);
                            var temp = new Date(data.OpenDt);
                            temp.setSeconds(temp.getSeconds() + 5);
                            periods.calcDiff(temp, data.nowDateTime, function (day, hours, minute, seconds, flags) {
                                var tempvalue = periods.periodsStatus;
                                if (flags) {
                                    tempvalue = "01";
                                    info.text('距离[' + data.PeriodsNumber + ']期开盘还有' + day + '天' + hours + '小时' + minute + '分钟' + seconds + '秒');
                                    //if (periodsMainInterval) {
                                    //    clearInterval(periodsMainInterval);
                                    //    periodsMainInterval = null;
                                    //}
                                } else {
                                    tempvalue = "00";
                                    info.text('[正在开盘中......]');
                                    if (periods.periodsStatus !== tempvalue && periodsMainInterval) {
                                        clearInterval(periodsMainInterval);
                                        periodsMainInterval = null;
                                    }
                                    if (!periodsMainInterval) {
                                        //periods.main();
                                        setTimeout(function (){periods.main.call(periods)}, 5000);
                                        periodsMainInterval = setInterval(periods.main, 180000);
                                    }
                                }
                                periods.periodsStatus = tempvalue;
                            });
                            Utils.Cookie.set('PeriodsNumber', data.PeriodsNumber, 0, '/').set('PeriodsID', data.ID, 0, '/');
                            break;
                        case 1:
                            var temp = new Date(data.CloseDt);
                            temp.setSeconds(temp.getSeconds() + 3);
                            periods.calcDiff(temp, data.nowDateTime, function (day, hours, minute, seconds, flags) {
                                var tempvalue = periods.periodsStatus;
                                if (flags) {
                                    exports.periodsStatus(true);
                                    info.text('距离[' + data.PeriodsNumber + ']期封盘还有' + day + '天' + hours + '小时' + minute + '分钟' + seconds + '秒');
                                    //if (periodsMainInterval) {
                                    //    clearInterval(periodsMainInterval);
                                    //    periodsMainInterval = null;
                                    //}
                                    tempvalue = "11";
                                }
                                else {
                                    exports.periodsStatus(false);
                                    tempvalue = "10";
                                    info.text('[正在开盘中......]');
                                    //info.text('[最近无开盘期数]');
                                    Utils.Cookie.remove('PeriodsNumber', '/').remove('PeriodsID', '/').remove('PeriodsStatus', 0);
                                    if (periods.periodsStatus !== tempvalue && periods.getInterval != null) {
                                        clearInterval(periods.getInterval);
                                        periods.getInterval = null;
                                    }
                                    if (periods.getInterval == null) {
                                        //periods.main();
                                        setTimeout(function () { periods.main.call(periods) }, 5000);
                                        periods.getInterval = setInterval(periods.main, 180000);
                                    }
                                }

                                periods.periodsStatus = tempvalue;
                            });
                            Utils.Cookie.set('PeriodsNumber', data.PeriodsNumber, 0, '/').set('PeriodsID', data.ID, 0, '/');
                            break;
                    }
                });
            }
        };
        exports.periods = periods;
        var notice = {
            noticeFactory: {
                marquee: function (element, content) {
                    element.innerHTML += content[0].Detail;
                    return this;
                },
                popup: function (content) {
                    var flags = 0;
                    (function (f) {
                        var self = arguments.callee;
                        var d = dialog({
                            title: content[f].Title == null ? '公告提示' : content[f].Title,
                            content: content[f].Detail,
                            width: 300
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
                        var tip = framework._extend.TipDialog({
                            height: '200px',
                            width: '300px',
                            content: content[f].Detail,
                            title: content[f].Title == null ? '公告提示' : content[f].Title
                        })
                        .show()
                        .addEvent('close', function () {
                            tip.remove();
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
            *定时获取公告
            */
            main: function () {
                var ticks = Utils.Cookie.get('Ticks');
                noticeSettings.data.Ticks = ticks ? ticks : '';
                $.ajax(noticeSettings)
                    .done(function (data) {
                        if (data && data[1].length) {
                            Utils.Cookie.set('Ticks', noticeSettings.data.Ticks = data.shift(), 0, '/');
                            //跑马灯,弹窗,右下角
                            var marquee = [],
                                popup = [],
                                right = [],
                                type,
                                endTime,
                                data = data[0];
                            for (var i = 0, len = data.length; i < len; i++) {
                                type = data[i]['ShowType'];
                                window.last_marquee = data[i].Detail;
                                switch (type) {
                                    case 1:
                                        marquee.push(data[i]);
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
        periods.main();
        window["periodsMainInterval"] = setInterval(periods.main, 180000);
        notice.main();
        window["noticeMainInterval"] = setInterval(notice.main, 120000);
        /**
        *点击滚动的时候弹出窗口
        */
        $('#childMenu0 .marquee_wrap').click(function () {
            var detail = window.last_marquee || '';
            var d = dialog({
                    title: '详细公告',
                    content: detail,
                    width: 300,
                    height: 150
                });
            if (!($.trim(detail) === '')) {
                d.show();
            }
        });
        /**
        *记录hash值
        */
        $('#menus li').click(function (e) {
            window.location.hash = '!' + e.currentTarget.id;
            $.cache.currentViewID = e.currentTarget.id;
        });
        $(window).on('hashchange', function () {
            var hash = location.hash,
                selector = hash.replace('!', '');
            //如果点击了后退按钮，那么ID肯定是和当前不一致的。
            if (!(selector.replace('#', '') === $.cache.currentViewID)) {
                $(selector).find('a').trigger('click', { isHashChange: true });
            }
        });
    });
});