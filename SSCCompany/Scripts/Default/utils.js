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

/// 返回文本颜色
/// @msg {String}
/// @status {Boolen}
Utils.infoColor = function (msg, status) {
    return '<span style="color:' + (status ? 'green' : 'red') + ';">' + msg + '</span>';
}

/// artDialog弹窗内状态栏的提示
/// @d {artDialog}
/// @msg {String}
/// @status {Boolen}
/// @t {Number} 毫秒
Utils.dialogStatus = function (d, msg, status, t) {
    var dom = $(d.node);
    clearTimeout(dom.data('interval'));
    d.statusbar(Utils.infoColor(msg, status));
    var f = setTimeout(function () {
        d.statusbar('');
    }, t || 3000);
    dom.data("interval", f);
}

/// 弹窗提示 封装
/// @msg {String}
/// @status {Boolen}
/// @t {Number} 毫秒
/// @t {Function} 成功时的回调
Utils.tip = function (msg, status, t) {
    clearTimeout(Utils.tip.interval);
    Utils.tip.d && Utils.tip.d.close();
    var options = {
        title: "操作提示",
        content: Utils.infoColor(msg, status)
    };
    //if ($.isFunction(t)) {
        options.okValue = "确定";
        options.ok = t;
    //}
    Utils.tip.d = dialog(options).show();


    if ($.isNumeric(t) && t > 0) {
        Utils.tip.interval = setTimeout(function () {
            Utils.tip.d.close();
        }, t);
    }
};
Utils.loading = (function () {
    var
        instance = null,
        interval = null;
    /**
    *@param options 加载框配置
    * delayTime，延迟多久开始, 其他为artdialog的配置项
    */
    return function constructor(options) {
        var
            that = {},
            defaultOptions = {
                title: '请稍后.....'
            },
            delayTime = 3000;
        that.cancel = function () {
            clearInterval(interval);
            interval = null;
            instance.remove();
            return this;
        };
        if (instance != null && $.isFunction(instance._$)) {
            that.cancel();
        };
        options = options || {};
        if (!!options.delayTime) {
            delayTime = options.delayTime;
            delete options.delayTime;
        }
        options = $.extend(defaultOptions, options);
        instance = new dialog(options);
        interval = setTimeout(function () {
            instance.showModal();
        }, delayTime);
        return that;
    };
})();
///Cookie操作
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
/*******
 AJAX 分页
 使用方式: new Utils.AJAX_page({url:'url',data:{}})
 @option  一个AJAX设置,包括url,data参数等
*******/
Utils.AJAX_page = function (options) {
    var self = this,
        setting = options,
        fn = null,
        pageInfo = {
            list: [],
            listCount: 0,
            pageCount: 0,
            pageIndex: 1,
            CurrentServerTime:''
        };
    this.getPage = function (callback) {
        if (!setting) {
            throw new Error('setting param is not a object');
        }
        if (!fn) {
            fn = callback;
        }
        $.ajax(setting).done(function (data) {
            if (data) {
                pageInfo.list = data.list;
                //pageInfo.listCount = data.PageCount;
                pageInfo.pageCount = data.PageCount;//data.list.length > 0 ? Math.ceil(pageInfo.listCount / data.list.length) : 0;
                pageInfo.CurrentServerTime = data.CurrentServerTime;
                fn && fn(pageInfo);
            }
        });
    };
    this.next = function () {
        if (pageInfo.pageIndex >= pageInfo.pageCount) {
            return;
        }
        pageInfo.pageIndex++;
        setting.data.pageIndex = pageInfo.pageIndex;
        self.getPage();
    };
    this.prv = function () {
        if (pageInfo.pageIndex <= 0) {
            return;
        }
        pageInfo.pageIndex--;
        setting.data.pageIndex = pageInfo.pageIndex;
        self.getPage();
    };
    this.first = function () {
        if (pageInfo.list.length > 0) {
            pageInfo.pageIndex = 1;
            setting.data.pageIndex = pageInfo.pageIndex;
            self.getPage();
        }
    };
    this.last = function () {
        if (pageInfo.list.length > 0) {
            pageInfo.pageIndex = data.list.length > 0 ? Math.ceil(pageInfo.listCount / data.list.length) : 0;;
            setting.data.pageIndex = pageInfo.pageIndex;
            self.getPage();
        }
    };

};
/*************
 时间组件,支持格式化,增加 年月日,以扩展到Date.format方法
**************/
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
/**
*@class  Utils
*@method arrange               排列号码
*@param  nums  {Array}         所有需要排列的号码的数组
*@param  bit   {Number}        从muns中选择N个
*@return       {Array}
*/
Utils.arrange = function (nums, bit) {
    if (!$.isArray(nums) || nums.length <= 0) return [];
    return arrange(nums, bit);
    function arrange(arr, size) {
        var len = arr.length;
        var s = 'var arr=arguments[0],len=arguments[1],result=[];', items = '', end = '';
        for (var i = 0; i < size; i++) {
            items += 'arr[_' + i + '],';
            s += 'for(var _' + i + '=0;_' + i + '<len;_' + i + '++){';
            end += '}';
        }
        s += 'result.push([' + items.slice(0, -1) + '])' + end + 'return result;';
        return new Function(s)(arr, len);
    }
};
/**
*@class  Utils
*@method comb                  组合号码(00,11,22等也算是一组)
*@param  nums  {Array}         所有需要组合的号码的数组
*@param  bit   {Number}        从muns中选择N个
*@return       {Array}
*/
Utils.comb = function (nums, bit) {
    if (!$.isArray(nums) || nums.length <= 0) return [];
    return comb(nums, bit);
    function comb(arr, size) {
        var len = arr.length;
        var s = 'var arr=arguments[0],len=arguments[1],result=[];', items = '', end = '';
        for (var i = 0; i < size; i++) {
            items += 'arr[_' + i + '],';
            if (i === 0) {
                s += 'for(var _' + i + '=0;_' + i + '<=len+1-' + (size - i) + ';_' + i + '++){';
            } else {
                s += 'for(var _' + i + '=_' + (i - 1) + ';_' + i + '<len+1-' + (size - i) + ';_' + i + '++){';
            }
            end += '}';
        }
        s += 'result.push([' + items.slice(0, -1) + '])' + end + 'return result;';
        return new Function(s)(arr, len);
    }
};

Date.prototype.format = Utils.DateHelp.format; //新增原型
if (window.ko) {

    /// ko 在视图中赋值 data-bind="initVal:{key:val}"
    /// @key ko.observable()
    /// @val Object
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

    /// 对输入的数字进行限制
    /// @type {Object}, Default: {range:[0,100],fix:0}  range值的范围,fix保留小数的位数
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
    /**
    *@method toObservable   深层递归转换为observable
    *@param  o  {object|array}  要转换的对象
    */
    ko.utils.toObservable = function (o) {
        var result = $.isPlainObject(o) ? {} : [];
        for (var i in o) {
            if (o.hasOwnProperty) {
                if ($.isArray(o[i])) {
                    result[i] = ko.observableArray(this.toObservable(o[i]));
                } else if ($.isPlainObject(o[i])) {
                    result[i] = this.toObservable(o[i]);
                } else if ($.isFunction(o[i])) {
                    result[i] = o[i];
                }
                else {
                    result[i] = ko.observable(o[i]);
                }
            }
        }
        return result;
    };
}

/// @max {Number}
/// @step {Number}
/// @min {Number}   default:0
/// @increase {Boolean}  默认为递减,设置为true为递增
/// return {Array}
Utils.step = function (max, step, min, increase) {
    var arr = [];
    if (typeof max !== 'number') {
        throw new Error('max must is a number');
    }
    if (step - 0 === 0) {
        return [];
    }
    if (typeof min === 'boolean') {
        increase = min;
        min = 0;
    }
    else {
        min = min || 0;
    }
    if (increase) {
        while (min <= max) {
            arr.push(min);
            min = (min + step).toFixed(9) - 0;
        }
    }
    else {
        while (max >= min) {
            arr.push(max);
            max = (max - step).toFixed(9) - 0;
        }
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
/// 检查str在字符串中出现的次数
/// @str {String}
/// return {Number}
String.prototype.times = function (str) {
    var reg = new RegExp(str, 'g');
    var arr = this.match(reg);
    if (!arr) return 0;
    return arr.length;
};
Utils.Convert2Time=function(num) {
    num = ("0000" + num).substr(('' + num).length);
    num = num.substr(0, 2) + ":" + num.substr(2);
    return num;
}
