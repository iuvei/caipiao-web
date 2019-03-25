///开奖结果列表页
//<reference path="../_ref.js" />
define(function (require, exports, module) {
    var koPage = require('/Scripts/Lib/ko.page');
    var DrawNumberList = function () {
        var that = this;
        this.list = ko.observableArray();
        this.PageCount = ko.observable(1);
        this.StartDate = ko.observable($("#ServerDateA").val());//(Utils.DateHelp.add('', -1, 'day', 'yyyy/MM/dd'));
        this.EndDate = ko.observable($("#ServerDateB").val());//(new Date().format('yyyy/MM/dd'));
        this.GameID = ko.observable(1);
        this.Pagenumber = ko.observable(1);
        this.pageCount = ko.observable(1);
        this.DataCheck = function () {
            if ($("#staDt").val().length == 0) {
                Utils.tip('起始日期不能为空', false, 3000, true ? function () {

                } : null);
                return;
            }
            if ($("#endDt").val().length == 0) {
                Utils.tip('结束日期不能为空', false, 3000, true ? function () {

                } : null);
                return;
            }
            that.StartDate($("#staDt").val());
            that.EndDate($("#endDt").val()); 
            this.GetData(1);
            this.currentPage(1);

        }
        this.prevpage = function () {
            var that = this;
            if (that.Pagenumber() - 0 > 1) {
                that.Pagenumber(that.Pagenumber() - 1);
            }
            //this.GetPageCount();
            this.GetData();
        }
        this.nextpage = function () {
            var that = this;
            if (that.Pagenumber() - 0 > 1) {
                that.Pagenumber(that.Pagenumber() + 1);
            }
            //this.GetPageCount();
            this.GetData();
        }
        //this.GetPageCount();
        //this.GetData(1);

        //====分页
        var getDataSettingData = {
            //startDate: Utils.DateHelp.add('', -1, 'month', 'yyyy/MM/dd'),
            //endDate: new Date().format('yyyy/MM/dd'),
            StartDate: that.StartDate(),
            EndDate: that.EndDate(),
            GameID: that.GameID(),
            PageNum: that.Pagenumber(),
            pageIndex: 1,
            
        }
        this.GetData = function (currentPage)
        {
            var that = this;
            getDataSettingData.StartDate = that.StartDate();
            getDataSettingData.EndDate = that.EndDate();
            getDataSettingData.pageIndex = currentPage;
            $.ajax({
                url: "/index.php/portal/agent/GetLotteryResult",
                cache: false,
                data: getDataSettingData,//{ StartDate: that.StartDate(), EndDate: that.EndDate(), GameID: that.GameID(), PageNum: that.Pagenumber() },
                dataType: "json",
                success: function (json) {
                    var arr = [];
                    if (json.list.length > 0) {
                        that.PageCount(json.PageCount);
                        koPage.count(json.PageCount * 50);
                        $.each(json.list, function (index, value) {
                            value.Numberlist = value.ResultNumber.split(",");
                            var a = value;
                            var i = index;
                            arr.push(value);
                        })
                        that.list(arr);
                    } else {
                        that.list.removeAll();
                    }


                }
            })
        }

        koPage.init(this, function (pageindex) {
            that.GetData(pageindex);
        }, {
            pagesize: 50
        });
    };



    ///获取日期的函数
    DrawNumberList.prototype.getStartDate = function (AddDay) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDay);//获取前天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;//获取当前月份的日期
        var d = dd.getDate();
        return y + "/" + m + "/" + d;
    }
    DrawNumberList.prototype.GetPageCount = function () {
        var that = this;
      /*  if ($("#staDt").val().length == 0 && $("#endDt").val().length == 0) {
            //前3个月信息
            var dd = new Date();
            var sy = dd.getFullYear();
            var sm = dd.getMonth() - 2;//获取当前月份的日期
            var sd = dd.getDate();


            ///当天日期
            ed = new Date();
            var ey = ed.getFullYear();
            var em = ed.getMonth() + 1;
            var edd = ed.getDate();//获取前天后的日期
            that.StartDate(sy + "/" + sm + "/" + sd);
            that.EndDate(ey + "/" + em + "/" + edd);


        }*/
        $.ajax({
            url: "/index.php/portal/agent/GetPageCount",
            cache: false,
            data: { StartDate: that.StartDate(), EndDate: that.EndDate(), GameID: that.GameID() },
            dataType: "json",
            success: function (json) { 
                if (that.pageCount() == that.Pagenumber()) {
                    $("#btnext").attr("hidden", true);
                }
                if (that.Pagenumber() == 1) {
                    $("#btprev").attr("hidden", true);
                }
            }
        })

    }
  /*  DrawNumberList.prototype.GetData = function (currentPage) {
        var that = this;
        getDataSettingData.pageIndex = currentPage;
        $.ajax({
            url: "/DrawNumber/GetLotteryResult",
            cache: false,
            data: { StartDate: that.StartDate(), EndDate: that.EndDate(), GameID: that.GameID(), PageNum: that.Pagenumber() },
            dataType: "json",
            success: function (json) {
                var arr = [];
                if (json.list.length > 0) {
                    that.PageCount(data.PageCount);
                    $.each(json.list, function (index, value) {
                        value.Numberlist = value.ResultNumber.split(",");
                        var a = value;
                        var i = index;
                        arr.push(value);
                    })
                    that.list(arr);
                } else {
                  //  that.list.
                }
               

            }
        })

    }*/


    exports.viewmodel = DrawNumberList;


});