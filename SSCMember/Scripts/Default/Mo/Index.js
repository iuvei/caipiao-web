///实现会员赔率变动查询
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var MO = function (params) {
        params = params || {};
        var that = this;
        this.params = params;
        this.list = ko.observableArray();
        this.listTwo = ko.observableArray();
       
        this.getBetType = function (t) {
            switch (t - 0) {
                case 2: return "OOXX";
                case 3: return "OXOX";
                case 4: return "OXXO";
                case 5: return "XOXO";
                case 6: return "XOOX";
                case 7: return "XXOO";
                case 9: return "OOOX";
                case 10: return "OOXO";
                case 11: return "OXOO";
                case 12: return "XOOO";
                case 13: return "四定位";
                case 14: return "二字现";
                case 15: return "三字现";
                case 16: return "四字现";
                case 17: return "XXXOO";
                case 18: return "OXXXO";
            }
        }
        this.GetBetType = function (Bettype, data, event) {
            event = event || window.event;
            var target = $(event.target);
            if (!target.hasClass('red')) {
                target.parent().find('a').removeClass('red');
                target.addClass('red');
            }
            that.GetData(Bettype.num);            
        }
        this.changeColor = function (data, event) {
            
            if (event.target.nodeName.toLowerCase() === 'span') {
                $.cache.elementClassName = $(event.target).parent('a')[0].className;
                return;
            }
            $.cache.elementClassName = event.target.className;
        };

        this.GetData();
    }
    MO.prototype.GetData = function (betTypeID) {

        var that = this;
        if (betTypeID == undefined) {
            betTypeID = 1;
        }
        $.ajax({
            url: "/index.php/Portal/Mo/GetOddsChange",
            data: { BetType: betTypeID },
            cache: false,
            dataType: "json",
            success: function (json) {
                if (json != null && json.length) {
                    var
                        numCount = 5,//5组数据 
                        temp = [];
                    $.each(json, function (key, value) {
                        for (i = 0, len = Math.ceil(value.LsSetting.length / numCount) ; i < len; i++) {
                            temp.push(value.LsSetting.slice(i * numCount, numCount * (i + 1)));
                        }
                        if (!temp.length) {
                            value.LsSetting = [value.LsSetting.slice(0, numCount)];
                        }
                        else {
                            value.LsSetting = temp;
                            temp = [];
                        }

                    });
                    that.list(json);
                }
            }
        })


    }
    exports.viewmodel = MO;
});