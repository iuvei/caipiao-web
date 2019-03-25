/// <reference path="../lib/knockout-3.3.0.debug.js" />
/// <reference path="../lib/jquery-1.11.1.min.js" />
/// <reference path="../lib/artDialog/dialog-plus-min.js" />
/// 工具类
var Utils = {};

if (!(window.console && console.log)) {
    window.console = {
        log: function () {
          //  throw (arguments);
        }
    };
}
/**
*音频播放
*/
Utils.sound = {
    /// options.path        文件所在路径
    /// options.filename    文件名不包含后缀名
    /// options.times       声音播放次数，默认5次
    create: function (options) {
        var filename = options.path + options.filename;/// 文件名，不包含后缀
        var times = this.times = options.times || 5;/// 声音播放的次数
        /// modern:1为FF/CHROME，2为ie8及以下，3为Safari
        if (/msie/i.test(navigator.userAgent) && parseInt(navigator.userAgent.match(/msie.([\d\.]+)/i)[1], 10) < 9) {
            this.modern = 2;
            filename += ".mp3";
            this.filename = filename;
            var bgsoundEle = this.ele = document.createElement("bgsound");
            bgsoundEle.setAttribute("src", "#");
            bgsoundEle.setAttribute("id", "BGSound");
            bgsoundEle.setAttribute("loop", times);
            document.body.appendChild(bgsoundEle);
        } else if (/version.+safari/i.test(navigator.userAgent)) {
            this.modern = 3;
            filename += ".swf";
            var embedEle = this.ele = document.createElement("embed");
            embedEle.setAttribute("src", filename);
            embedEle.setAttribute("id", "BGSound");
            embedEle.style.position = "fixed";
            embedEle.style.top = "-10px";
            embedEle.setAttribute("height", "0");
            embedEle.style.visibility = "hidden";
            document.body.appendChild(embedEle);
        } else {
            this.modern = 1;
            filename += /trident/i.test(navigator.userAgent) ? ".mp3" : ".ogg";
            var audioEle = this.ele = document.createElement("audio");
            audioEle.setAttribute("src", filename);
        }
    },
    play: function () {
        var that = this;
        if (that.modern === 1) {
            var i = 1;
            /// 播放一次再调用一次
            that.ele.addEventListener('ended', function () {
                if (i < that.times) {
                    ++i;
                    that.ele.play();
                }
            });
            that.ele.play && $.isFunction(that.ele.play) && that.ele.play();
        } else if (that.modern === 2) {
            that.ele.src = that.filename + '?_=' + (new Date() - 0);
        } else if (that.modern === 3) {
            that.ele.soundPlay && $.isFunction(that.ele.soundPlay) && that.ele.soundPlay(that.times);
        }
    }
};
/**
*返回文本颜色
*@param msg {String}
*@param status {Boolen}
*/
Utils.infoColor = function (msg, status) {
    return '<span style="color:' + (status ? 'green' : 'red') + ';">' + msg + '</span>';
}

/**
*artDialog弹窗内状态栏的提示
*@param d      {object}
*@param msg    {String}
*@param status {Boolen}
*@param t      {Number} 毫秒
*/
Utils.dialogStatus = function (d, msg, status, t) {
    var dom = $(d.node);
    clearTimeout(dom.data('interval'));
    d.statusbar(Utils.infoColor(msg, status));
    var f = setTimeout(function () {
        d.statusbar('');
    }, t || 3000);
    dom.data("interval", f);
}

/**
*@method tip  弹窗提示 封装
*@param msg {String}
*@param status {Boolen}
*@param t {Number|Function} 毫秒|成功时的回调
*/
Utils.tip = function (msg, status, t) {
    clearTimeout(Utils.tip.interval);
    Utils.tip.d && Utils.tip.d.close();
    var
        options = {
            title: "操作提示",
            content: Utils.infoColor(msg, status)
        };

    if ($.isFunction(t)) {
        options.okValue = "确定";
        options.ok = t;
    }
    Utils.tip.d = dialog(options).show();

    var node = $(Utils.tip.d.node);
    if ($.isNumeric(t) && t > 0) {
        Utils.tip.interval = setTimeout(function () {
            Utils.tip.d.close();
        }, t);
    }
    node.on('keyup', function (event) {
        if (event.keyCode === 13) {
            node.find('[i-id=ok]').trigger('click');
        }
    });

};
/**
*@class Cookie操作
*@static
*/
Utils.Cookie = {
    get: function (name) {
        var name = name.replace('.', '\\.')
        var reg = new RegExp(" " + name + "=[\\S^;]*", "g");
        var arr = (" " + document.cookie + ";").match(reg);
        if (arr === null) return null;
        return unescape(arr[0].replace(/^.*=/, '').slice(0, -1));
    },
    /// name:Cookie名称,  value:Cookie值,  expires:过期时间
    set: function (name, value, expires, path, domain, secure) {
        var today = new Date();
        today.setTime(today.getTime());
        if (expires) {
            expires = expires * 1000 * 60 * 60 * 24;
        }
        var expires_date = new Date(today.getTime() + (expires));
        document.cookie = name + "=" + escape(value) + ((expires) ? ";expires=" +
            expires_date.toGMTString() : "") + ((path) ? ";path=" +
            path : "") + ((domain) ? ";domain=" + domain : "") +
            ((secure) ? ";secure" : "");
        return this;
    },
    remove: function (name, path, domain) {
        if (this.get(name)) {
            document.cookie = name + "=" + ((path) ? ";path=" + path : "") +
                ((domain) ? ";domain=" + domain : "") +
                ";expires=Thu,01-Jan-1970 00:00:01 GMT";
        }
        return this;
    }
};
/**
*@class  时间组件,支持格式化,增加 年月日
*@static
*/
Utils.DateHelp = {
    format: function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    },
    add: function (date, value, type, format) {
        var date = date ? new Date(date) : new Date(),
            value = value || 0,
            type = type || 'day';
        switch (type) {
            case 'minute':
                date.setMinutes(date.getMinutes() + value);
                break;
            case 'hours':
                date.setHours(date.getHours() + value);
                break;
            case 'day':
                date.setDate(date.getDate() + value);
                break;
            case 'month':
                date.setMonth(date.getMonth() + value);
                break;
            case 'year':
                date.setFullYear(date.getFullYear() + value);
                break;
        }
        return format ? this.format.call(date, format) : date;
    }
};
Date.prototype.format = Utils.DateHelp.format; //新增原型
if (window.ko) {
    /**
     *@example   <a>data-bind="initVal:{key:val}</a>"
     *@param   key {object}
     *@param   val {object}
     */
    ko.bindingHandlers.initVal = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var obj = valueAccessor();
            if ($.isPlainObject(obj)) {
                for (var i in obj) {
                    viewModel[i] && viewModel[i](obj[i]);
                }
            } else {
                throw ('initVal绑定方法接收的值为对象');
            }
        }
    };

    /** 对输入的数字进行限制
    *@param target {Element}
    *@param type  {object}
    *@default  {range:[0,100],fix:0}  range值的范围,fix保留小数的位数
    */
    ko.extenders.limit = function (target, type) {
        target.subscribe(function (newValue) {
            if (newValue === "") return;
            var range = ko.toJS(type.range) || [0, Infinity];
            newValue = $.trim(newValue + '');
            type.fix = type.fix || 0;
            /// 处理点开头的
            if (/^\./.test(newValue)) return target(range[0]);

            /// 去除非数字字符
            if (!$.isNumeric(newValue)) newValue = newValue.replace(/[^\d\.]/g, '');

            /// 去除第二个小数点及其后面的数字
            newValue = newValue.replace(/^(\d*\.\d*).*/, '$1');
            var len = type.fix - 0 + 1;
            if (type.fix > 0) {
                if (newValue.indexOf('.') > -1 && newValue.match(/\.(\d*)$/)[1].length > type.fix) {
                    newValue = ((newValue - 0).toFixed(len || 0).slice(0, -1)) - 0 + '';
                }
            } else {
                newValue = ((newValue - 0).toFixed(len || 0).slice(0, -1)) - 0 + '';
            }
            if (range[0] > newValue - 0) {
                target(range[0]);
            } else if (range[1] < newValue - 0) {
                target(range[1]);
            } else {
                target(newValue + '');
            }
        });
        return target;
    };
}

/**
*@method step
*@param max {Number}
*@param step {Number}
*@param min {Number}   default:0
*@return {Array}
*/
Utils.step = function (max, step, min) {
    var arr = [];
    min = min || 0;
    if (step <= 0) return [max, min];
    while (max >= min) {
        arr.push(max);
        max = (max - step).toFixed(9) - 0;
    }
    return arr;
};
/**
*期数限制
*@periodsNumber {string} 期数
*@format        {string} 格式
*/
Utils.periodsNumberValidate = function (periodsNumber, format) {
    var periodsNumber = $.trim(periodsNumber),
        format = $.trim(format);
    if (periodsNumber.length <= 0 || !(periodsNumber - 0) || format.length <= 0) {
        return false
    }
    return new RegExp('^' + (format.replace('YYYY', '20((1[5-9])|([2-9]\\d))').replace('YY', '((1[5-9])|([2-9]\\d))').replace('MM', '((0[1-9])|(1[0-2]))').replace('DD', '((0[1-9])|([1-2]\\d)|(3[0-1]))').replace('III', '((0((0[1-9])|([1-9]\\d)))|([1-2]\\d{2})|(3[0-6][0-5]))').replace(/X/g, '\\d')) + '$').test(periodsNumber);
}

Utils.print = function () {
    window.print();
};
/**
*检查str在字符串中出现的次数
*@param str {String}
*@param return {Number}
*/
String.prototype.times = function (str) {
    var reg = new RegExp(str, 'g');
    var arr = this.match(reg);
    if (!arr) return 0;
    return arr.length;
};

/**
*如果是负数,如： -1.1, 取-2
*/
Utils.rounding = function (num) {
    var
        ceil = Math.ceil;
    if (isNaN(num)) {
        return 0;
    }
    return num < 0 ? -ceil(Math.abs(num)) : ceil(num);
}