/// <reference path="_ref.js" />
/// <reference path="../lib/knockout-3.3.0.debug.js" />

var DEBUG = true;
seajs.config({
    base: baseUrl ? baseUrl + "/Scripts/Default/" : "/Scripts/Default/",
    map: [
        [".js", ".js?_=" + 20170712000000] /// 后缀映射(可去缓存)
    ]
});

; (function () {

    var PlayType = Utils.Cookie.get('PlayType');// Serven = 0,Five = 1

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
                        Utils.tip('模板加载失败', false, 3000, true ? function () {

                        } : null);
                    }
                });
            }
        };

        /// 直接调用
        /// @path {String}  以 / 开头则认为是URL，否则认为是jQuery的选择器
        /// @alias {String} 模块的地址，可选值
        /// @params {} 传递到viewmodel中的参数
        this.view = function (path, alias, params) {
            that.params = params;
            if (/^\//.test(path)) {
                $.ajax({
                    dataType: 'html',
                    url: path,
                    success: function (res) {
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
        //始终通知，即便是相同的值。
        this.container = ko.observable('empty').extend({ notify: 'always' });
        this.params = undefined; /// 使用view方法时可传递参数到viewmodel

        this.temp = {}; /// 存放临时的东西
    };

    Framework.prototype.render = function (url, res, alias, dom) {
        if (res.indexOf("454247874248421werfwerae245121247512") > -1) {
            window.location.href = "/Home/Index";
            return;
        }
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

        var me = { target: dom || $(), main: $("#Container") }; /// 供模块中的函数使用
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
                    } else {
                        typeof m[i] === 'function' && m[i].call(me, url);
                    }
                }
            }
            ko.components.register(componentName, options);
            that.container(componentName);
            if (me.done) {
                setTimeout(function () {
                    me.done.call(options.viewModel, componentName); //绑定到组件之后调用的方法,以便访问DOM
                }, 0);
            }
            me.main.scrollTop(0);/// 滚动条置顶，避免切换页面时仍然保留之前的滚动条状态
        });
    };
    /**
    *@method koDialog                         结合artDialog、ko、sea的弹出框
    *@param {node/object}       nodes         需要触发弹窗的对话框的dom元素,也可以是配置项;
    *@param {object}            [config]      artdialog 配置项
    *@param {string}            viewUrl       视图的url
    *@param {string}            jsUrl         js的url
    *@param {node}              [selector]    jquery选择器,默认是ui-dialog-body,用于绑定到ko
    *@exmaple
      framework.koDialog($('#id'),{title:''},'index','index','selector')
    *@exmaple
      framework.koDialog({node:$('#id'),config:{title:''},viewUrl:'index',jsUrl:'index','.selector'},{node:$('#id'),config:{title:''},viewUrl:'index',jsUrl:'index','.selector'});
    */
    Framework.prototype.koDialog = (function () {
        var viewModelCache = {},
            applyNode,
            showDialg = function (config) {
                //定义必要的artdialog配置项。
                config.onshow = function () {
                    applyNode = $(config.selector)[0];
                    ko.cleanNode(applyNode);
                    ko.applyBindings(new config.viewmodel(), applyNode);
                };
                dialog(config)[config.model ? 'showModal' : 'show']();
            };
        return function (nodes, config, viewUrl, jsUrl, selector) {
            var node = nodes,
                callee = arguments.callee,
                cacheName,
                cache;
            if (node.nodeName) {
                node = $(node);
            }
            //如果config为空,其后的参数向上传递
            if (typeof config === "string") {
                selector = jsUrl;
                jsUrl = viewUrl;
                viewUrl = config;
                config = {};
            }
            else if (typeof config === 'undefined') {
                config = {};
            }
            config.selector = selector || '.ui-dialog-body';
            cacheName = viewUrl + '#' + jsUrl;

            //如果是数组或者对象,递归实现
            if ($.isPlainObject(node) || $.isArray(node)) {
                node = [].concat.apply([], arguments);
                $.each(node, function (index, value) {
                    callee(value['node'], value['config'], value['viewUrl'], value['jsUrl'], value['selector']);
                });
            }
            if (node instanceof jQuery) {
                node.off('click').on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    //如果不存在缓存
                    if (!(cache = viewModelCache[cacheName])) {
                        $.get(viewUrl + '?_=' + (new Date() - 0), function (view) {
                            seajs.use(jsUrl, function (js) {
                                viewModelCache[cacheName] = {};
                                viewModelCache[cacheName]['view'] = view;
                                viewModelCache[cacheName]['viewmodel'] = js.viewmodel;//先存入缓存

                                //配置config
                                config.content = view;  //artdialog的内容
                                config.viewmodel = js.viewmodel; //ko的viewmodel
                                showDialg(config);
                            });
                        });
                    }
                    else {
                        config.content = cache.view;
                        config.viewmodel = cache.viewmodel;
                        showDialg(config);
                    }
                });
            }
        }
    })();
    ko.components.register("empty", {
        template: '<div style="text-align:center;padding-top:10%;color:#999;">页面正在加载中...</div>'
    });
    window.framework = new Framework;

    $(function () {
        seajs.use('ui.js', function (o) {
            $.extend(framework, o);
            ko.applyBindings(framework);
            framework.view("#ROLE-TPL");
        });
    });
})();

//四十秒一次检测在线状态
//检测直接在定时公告时已做检查，
/*(function checkOnline() {
    setTimeout(function () {
        $.ajax({
            url: '/home/CheckOnline',
            cache: false,
            success: function (res) {
                if (res - 0 === 0) {
                    alert("您已被踢出！");
                    Utils.Cookie.remove('Ticks', '/').remove('isAgentLevel', '/').remove('RationLable', '/').remove('PeriodsNumber').remove('PeriodsID');
                    window.location.href = "/home/index";
                } else {
                    checkOnline();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //alert("无法连接服务器");
                //Utils.Cookie.remove('Ticks', '/').remove('isAgentLevel', '/').remove('RationLable', '/').remove('AgentLevel', '/').remove('PeriodsNumber').remove('PeriodsID');
                //window.location.href = "/home/index";
            }
        });
    }, 40000);
})();*/

//framework扩展
(function (global) {
    var extend = framework._extend = framework._extend || {};
    /**
    *右下角弹出框提示
    *@method TipDialog
    *@params {Object} option
    *{
       title:标题,
       content:内容,
       width:宽度,
       height:高度,
       parentEL:父元素,
       interval:几秒之后关闭
     }
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
                inner.css({ width: result.width }).animate({ height: result.height }, result.interval, fn).find('.close').one('click', this.close);
                return this;
            },
            close: function (event) {
                var callback = handels.flush('close');
                inner.animate({ height: 0 }, result.interval, callback);
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
        }
        return handels;
    };

})(window);