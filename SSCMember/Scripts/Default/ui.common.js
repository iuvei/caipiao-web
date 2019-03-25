/// <reference path="_ref.js" />
/// <reference path="../lib/knockout-3.3.0.debug.js" />

var DEBUG = true;
seajs.config({
    base: baseUrl ? baseUrl + "/Scripts/Default/" : "/Scripts/Default/",
    map: [
        [".js", ".js?_=20170717"] /// 后缀映射(可去缓存)
    ]
});

;
(function () {
    var Framework = function () {
        var that = this;
        this.xhr = {};
        this.autoRefresh = false; // 切换游戏时不自动刷新页面
        /// 点击的时候触发
        /// @alias:String 对应的模块名
        /// 如果参数的长度为4则认为是不是直接通过在dom中通过事件直接调用
        this.open = function (alias, data, event) {
            /// 如果长度为3则清空that.temp的值
            if (arguments.length === 3) {
                that.temp = {};
            }
            that.container('empty');
            that.xhr.abort && that.xhr.abort();
            var url = event.currentTarget.href; /// 取元素上href的值
            var dom = $(event.currentTarget);
            that.autoRefresh = dom.data("refresh");
            var cacheView = dom.data("cache-view");
            if (!DEBUG && cacheView) {
                that.render(url, cacheView, alias, dom);
            } else {
                that.xhr = $.ajax({
                    url: url,
                    dataType: "html",
                    cache: !DEBUG,
                    success: function (res) {
                        that.render(url, res, alias, dom);
                        dom.data("cache-view", res);
                    },
                    error: function () {
                        if (arguments[1] === 'abort') {
                            return console.log('已取消加载');
                        }
                        Utils.tip("模板加载失败", false);
                    }
                });
            }
        };
        ///view cache处理
        this.viewCache = {};
        /// 直接调用
        /// @path {String}  以 / 开头则认为是URL，否则认为是jQuery的选择器
        /// @alias {String} 模块的地址，可选值
        /// @params {} 传递到viewmodel中的参数
        this.view = function (path, alias, params, cache) {
            that.params = params;
            if (/^\//.test(path)) {
                if (cache) {
                    if (that.viewCache[path]) {
                        that.render(path, that.viewCache[path], alias);
                        return;
                    }
                }
                $.ajax({
                    dataType: 'html',
                    url: path,
                    success: function (res) {
                        cache && (that.viewCache[path] = res);
                        that.render(path, res, alias);
                    }
                });
            } else {
                that.render(path, $(path).html(), alias);
            }
        };

        /// 刷新局部视图
        this.refresh = function () {
            var currentComponentName = that.container();
            that.container('empty');
            setTimeout(function () {
                that.container(currentComponentName);
            }, 0);
        }

        this.container = ko.observable('empty').extend({ notify: 'always' });
        this.params = undefined; /// 使用view方法时可传递参数到viewmodel

        this.temp = {}; /// 存放临时的东西



    };

    Framework.prototype.render = function (url, res, alias, dom) {
        var that = this;
        var options = { template: res };
        var componentName = url + '#' + alias;
        if (ko.components.isRegistered(componentName)) ko.components.unregister(componentName);

        /// 没有js模块的情况
        if (!alias) {
            ko.components.register(componentName, options);
            that.container(componentName);
            return;
        }

        /// 非view方法则将参数置空
        if (arguments.length !== 3) that.params = undefined;

        var me = { target: dom || $(), main: $("#Container"), done: null }; /// 供模块中的函数使用
        seajs.use(alias, function (m) {
            var t = new Date() - 0;
            /// 对模块返回的内容进行处理
            if (typeof m === 'function') {
                m.call(me, url);
            } else if ($.isPlainObject(m)) {
                for (var i in m) {
                    if (i === 'viewmodel') {
                        options.viewModel = m.viewmodel;
                    } else if (i === 'done' && typeof m[i] === 'function') {
                        me.done = m[i];
                    }
                    else {
                        typeof m[i] === 'function' && m[i].call(me, url);
                    }
                }
            }
            if (ko.components.isRegistered(componentName)) ko.components.unregister(componentName);
            ko.components.register(componentName, options);
            that.container(componentName);
            if (me.done) {
                setTimeout(function () {
                    me.done.call(options.viewModel, componentName); //绑定到组件之后调用的方法,以便访问DOM
                }, 0);
            }
            me.main.scrollTop(0);/// 滚动条置顶，避免切换页面时仍然保留之前的滚动条状态
            $(window).on('resize', function () {
                $('#main_box').height($(window).height() - $('#print_box').height());
            });
            setTimeout(function () {
                $('#main_box').height($(window).height() - $('#print_box').height());
            }, 200);
        });
    };

    ko.components.register("empty", {
        template: '<div style="text-align:center;padding-top:10%;color:#999;">页面正在加载中...</div>'
    });
    ko.components.register("clear", {
        template: ' '
    });
    window.framework = new Framework;

    $(function () {
        seajs.use('ui.js', function (o) {
            $.extend(framework, o);
            ko.applyBindings(framework);
            //if (request.IsMobile()) {
            //    framework.view("/Mobile/FastBeat/Index", "Mobile/FastBeat/Index");//登录成功后先跳转快打页面("#RULE");
            //} else {
            //    framework.view("/FastBeat/Index", "BetPanel/FastBeat/Index");//登录成功后先跳转快打页面("#RULE");
            //}
            var hash = location.hash;
            if (!/^#\$\d+/.test(hash)) {
                framework.view("/index.php/Portal/FastChoose/Index", "BetPanel/FastChoose/Index", undefined, true);
                location.hash = "$2"; /// 1 为默认菜单的索引值
            }
        });
    });
})();

//四十秒一次检测在线状态//直接在定时刷新期数时，已判断
/*(function checkOnline() {
    setTimeout(function () {
        $.ajax({
            url: '/home/CheckOnline',
            cache: false,
            success: function (res) {
                if (res - 0 === 0) {
                    alert("您已被踢出！");
                    Utils.Cookie.remove('Ticks', '/').remove('StopNumber', '/').remove('DeleteStopNumber', '/').remove('isFirst', '/').remove('PeriodsNumber').remove('PeriodsID');
                    window.location.href = "/home/index";
                } else {
                    checkOnline();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //alert("无法连接服务器");
                //Utils.Cookie.remove('Ticks', '/').remove('StopNumber', '/').remove('DeleteStopNumber', '/').remove('isFirst', '/').remove('PeriodsNumber').remove('PeriodsID');
                //window.location.href = "/home/index";
            }
        });
    }, 40000);
})();*/