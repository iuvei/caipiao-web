///实现会员赔率变动查询
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var BaleWhiteSingle = function (params) {
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
    BaleWhiteSingle.prototype.GetData = function (betTypeID) {

        var that = this;
        if (betTypeID == undefined) {
            betTypeID = 1;
        }
        if (!Utils.Cookie.get('PeriodsID')) {
            //如果封盘了查询最后一期数据
            $.ajax({
                url: "/Report/GetLastPeriodsNumber",
                cache: false,
                success: function (data) {
                }
            });
        }
        var
            d = new dialog({
                title: '打包数据表中,请稍后...',
                cancel: false
            });
        d.showModal();
        $.ajax({
            url: "/index.php/portal/agent/GetBaleWhiteSingle",
            data: { BetType: betTypeID },
            cache: false,
            dataType: "json",
            success: function (json) {
                that.list(json);
                d.close();
            }
        });


    }
    exports.viewmodel = BaleWhiteSingle;
});