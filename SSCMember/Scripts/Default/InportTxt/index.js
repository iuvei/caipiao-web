// 会员修改自己的密码
/// <reference path="../_references.js" />

$(function () {
    var conut = $('#Allcount'),
         countMoney = $('#CountMoney');
    $('#Money').on('propertychange input', function (event) {
        var target = event.target,
             result = '',
             execResult = null;
        if (!(/^\d+(\.{1}\d+)$/.test(target.value))) {
            execResult = target.value;///^\d+/.exec(target.value);
            if (execResult) {
                result = execResult;
            }
            target.value = result;
        }
        setTimeout(function () {
            if (!isNaN(target.value)) {
                countMoney.text(parseFloat((conut.attr('title') - 0) * (target.value - 0)).toFixed(2) - 0);
            }
        }, 50);
    });
    $('#Betzero').click(function () {
        var money = $("#Money").val();
        if (!isNaN(money)) {
            if (money.length == 0)
                money = 0;
            $.post("/index.php/Portal/Home/BetSubmit", { Money: money }
                , function (json) {
                    window.top.Utils.tip(json.info, json.status, 2000);
                    window.top.framework._extend.refreshInfo();
                    window.top.framework._extend.getBetInfoForLeftInfo();
                    $("#Money").val('');
                    setTimeout(function () {
                        $($('.title')[1]).next().hide();
                        window.top.$('.menu > ul > li:eq(1) > a').trigger('click');
                    }, 2500);
                })
        } else {
            window.top.Utils.tip('请输入正确金额', false, 2000);
            return;
        }
       
    });
    $('#Betone').click(function () {
        var money = $("#Money").val();
        if (!isNaN(money)) {
            if (money.length == 0)
                money = 0;
            $.post("index.php/Portal/Home/BetSubmit", { Money: money }
                , function (json) {
                    window.top.Utils.tip(json.info, json.status, 2000);
                    window.top.framework._extend.refreshInfo();
                    window.top.framework._extend.getBetInfoForLeftInfo();
                    $("#Money").val('');
                    if (json.isStopNum - 0 == 55) {//StopBetItem = 55表示是押停号码 
                        $("#IFRAM").hide();
                    }
                    setTimeout(function () {
                        $($('.title')[1]).next().next().hide();
                        window.top.$('.menu > ul > li:eq(1) > a').trigger('click');
                    }, 2500);
                })
        } else {
            window.top.Utils.tip('请输入正确金额', false, 2000);
            return;
        }
    });
});