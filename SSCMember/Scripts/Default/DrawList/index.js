///开奖结果
/// <reference path="../../_references.js" />
define(function (require, exports, module) {
    var koPage = require('ko.page'),
       pageNum;
    var DrawList = function () {
        var that = this;
        this.list = ko.observableArray();
        this.PageCount = ko.observable(1);
        this.PageNum = ko.observable(1);
        this.StartDate = ko.observable($("#ServerDateA").val());//(Utils.DateHelp.add('', -1, 'day', 'yyyy/MM/dd'));
        this.EndDate = ko.observable($("#ServerDateB").val());//(new Date().format('yyyy/MM/dd'));

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
        ////上一页
        //this.provPage = function () {
        //    if (that.PageNum() >1)
        //        that.PageNum(that.PageNum()-1);
        //    that.GetData();
        //}
        ////下一页
        //this.nextPage = function () {
        //    if(that.PageNum()<that.PageCount())
        //    that.PageNum(that.PageNum() + 1);
        //    that.GetData();
        //}
         this.GetData = function (currentPage)
         {
             var that = this;
             that.PageNum(currentPage);
             $.ajax({
                 url: "/index.php/Portal/DrawList/GetLotteryResult",
                 data: {
                     StartDate: that.StartDate(),
                     EndDate: that.EndDate(),
                     pageIndex: that.PageNum(),
                 },
                 cache: false,
                 success: function (data) {
                     if (data.list.length != 0) {
                         var arr = [];
                         that.PageCount(data.PageCount);
                         koPage.count(data.PageCount * 50);
                         $.each(data.list, function (index, value) {
                             value.ResultNumber = value.ResultNumber.split(",");
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

    }
   /* DrawList.prototype.GetData = function () {
        var that = this;
        $.ajax({
            url: "/DrawList/GetLotteryResult",
            data:{PageNum:that.PageNum()},
            cache: false,
            success: function (data) {
                if (data.list.length != 0) {
                    var arr = [];
                    that.PageCount(data.PageCount);
                    $.each(data.list, function (index, value) {
                        value.ResultNumber = value.ResultNumber.split(",");
                        arr.push(value);
                    })
                    
                    that.PageCount(data.PageCount[0].Column1);
                    that.list(arr);
                }
            }


        })
    }*/

    exports.viewmodel= DrawList;
});