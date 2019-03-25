; (function (global, undefined) {
    var GrossPrint = function () {
       // this.getGrossListPrint();//加载获取数据 加载两次问题？？
        this.list = ko.observableArray([]);
        this.CountMember = ko.observable();
        this.CountAmt = ko.observable();
        this.CountWinorLoss = ko.observable();
        this.getGrossPrintTitle = ko.observable();
        ///打印
        this.Print = function () {

            var match = /<!--print startGrossPrint-->( .+? )<!--print endGrossPrint-->/;
            var startnum = window.document.body.innerHTML.indexOf("<!--print startGrossPrint-->");
            var endnum = window.document.body.innerHTML.indexOf("<!--print endGrossPrint-->");
            var xx = window.document.body.innerHTML.substring(startnum, endnum);
            window.document.body.innerHTML = xx;//window.document.body.innerHTML.match(match);//= window.document.getElementById("#PrintTable").innerHTML;
            window.print();
            window.location.reload()
            //window.document.body.innerHTML = x;
        }
        ko.koPage.init(this, this.getGrossListPrint, {
             pagesize: 1
        });
    };

    $.extend(GrossPrint.prototype, {
        getGrossListPrint: function (pageindex) {
            var _this = this;
            var loca = decodeURIComponent(location.search),
                loca = loca.substr(1).split('&');
            ///loca=["1IsWin=false", "2username=undefined", "IsShow3=false", "BeginNum4=-1", "EndNum45=-1", "SearchPeriodsNumber6=16240", "BetTypeID7=0", "QueryStatus8=0", "BetNumber9=", "paginationPrint10=4", "MemberId11=-1"]             
            if (pageindex == undefined) {
                pageindex = loca[9].substr(3, 100)
            }
            $.ajax({
                url: "/index.php/portal/agent/GetGrossList",
                data: {
                    IsWin: loca[0].substr(3, 100),
                    UserName: loca[1].substr(3, 100) == undefined ? "" : loca[1].substr(3, 100),
                    IsShow: loca[2].substr(3, 100),
                    BeginNum: loca[3].substr(3, 100),
                    EndNum: loca[4].substr(3, 100),
                    PeriodsNumber: loca[5].substr(3, 100),
                    BetTypeID: loca[6].substr(3, 100),
                    QueryStatus: loca[7].substr(3, 100),
                    BetNumber: loca[8].substr(3, 100),
                    PageNum: pageindex,
                    MemberId: loca[10].substr(9, 100),
                    isSearch: loca[11].substr(3, 100)
                },
                cache: false,
                dataType: "json",
                success: function (json) {
                   // pageindex = 1;
                    ko.koPage.count(json.PageCount);
                   // _this.list(json.list.slice((pageindex - 1) * 5, pageindex * 5));
               var CountMember = 0,
                   CountAmt = 0,
                   CountWinorLoss = 0;
                    $.each(json.list, function (index, value) { 
                        if (value.BetStatus != 1 || value.QueryStatus - 0 == 2) {//只统计成功数据                            
                            CountMember++;
                            CountAmt += value.BetAmount;//统计下注金额
                            CountWinorLoss += value.WinLoss;//统计输赢金额
                        }
                    });
                    _this.list(json.list);
                    _this.CountMember(CountMember.toFixed(4) - 0);
                    _this.CountAmt(CountAmt.toFixed(4) - 0);
                    _this.CountWinorLoss(CountWinorLoss.toFixed(4) - 0);
                    var myDate = new Date(),
                    mm = myDate.getMonth() + 1;
                    _this.getGrossPrintTitle("第" + loca[5].substr(3, 100) + "期    " + mm + "月" + myDate.getDate() + "日" + myDate.getHours() + "时" + myDate.getMinutes() + "分    ");
                }
            });
        }
    })

  
    $(function () {
        var grossprint = new GrossPrint();
        
        ko.applyBindings(grossprint);
    });
})(window);