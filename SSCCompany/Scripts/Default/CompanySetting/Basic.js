/// 公司设置-基础设置
// <reference path="../_ref.js" />
define(function (require, exports, module) {
    var Basic = function (params) {
        params = params || {};
        var that = this;
        this.params = params;
        this.ID = ko.observable(params.ID);

        this.LoginName = ko.observable(params.LoginName || '');
        this.SecondStopEarly = ko.observable(params.SecondStopEarly || '');
        this.IsOddsUse = ko.observable(params.IsOddsUse || '');
        this.CancelBet = ko.observable(params.CancelBet || '');
        this.DownlineEditForbid = ko.observable(params.DownlineEditForbid || true);
        this.CreditLimit = ko.observable(params.CreditLimit || '');
        this.IsInheritPeriods = ko.observable(params.IsInheritPeriods || false);
        this.IsDownlineEditForbid = ko.observable(params.IsDownlineEditForbid || false);
        this.IsDownlineCommEdit = ko.observable(params.IsDownlineCommEdit || false);
        this.IsSuperFirstLimit = ko.observable(params.IsSuperFirstLimit || false);
        this.CustomeContent = ko.observable(params.CustomeContent || '');
        this.Ratio = ko.observable(params.Ratio || ''); /// 占成
        this.Welfare = ko.observable(params.Welfare || '');/// 福利
        this.Salary = ko.observable(params.Salary || '');/// 月花销
        this.Expend = ko.observable(params.Expend || ''); //Expend

        this.CompanyCheckCode=ko.observable();//公司验证码
        this.MemCheckCode=ko.observable();//会员验证码
        this.IsCompanyCheckCode = ko.observable(false);//是否需要重新生成公司验证码
        this.IsMemCheckCode = ko.observable(false);//会员验证码

        this.IsShowLottory = ko.observable(params.IsShowLottory || '');// 小票打印
        this.IsSingleBack = ko.observable(params.IsSingleBack || '');// 批量退码
        this.IsCheckUper = ko.observable(params.IsCheckUper || '');// 是否查看上级报表

        this.IsDirectCompany = ko.observable(params.IsDirectCompany);// 是否是直属公司
        this.IsInheritTrading = ko.observable(params.IsInheritTrading);// 是否继承操盘
        this.IsInheritComm = ko.observable(params.IsInheritComm);// 是否继承定盘

        this.PlayType = ko.observable(params.PlayType);

        this.IsControlReport = ko.observable(false);//是否控制下级结算后查看报表
        this.ReportShowCount = ko.observable(0);//下级月报表显示几期数据
        this.PeriodDays = ko.observable(0);//批量创建的天数

        /*
          最新需求：
          1、公司基本设置需要做如下控制：只有继承期数，才可以选继承定盘，只有继承定盘才可以选继继承操盘。*/
        this.IsInheritCommUpdate = ko.observable(true);//继承定盘 是否可操作
        this.IsInheritTradingUpdate = ko.observable(true); //继承操盘 是否可操作
        this.IsInheritPeriodsUpdate = ko.observable(true);//开启期数继承 是否可操作

        this.IsInheritPeriods.subscribe(function (newValue) { //只有继承期数之后，才可以选继承定盘
            if (Utils.Cookie.get('PeriodsStatus') - 0 != 1 || that.AddorEdit() == "Add")
            {
                if (newValue) {
                    that.IsInheritCommUpdate(false);
                } else {
                    that.IsInheritCommUpdate(true);
                    that.IsInheritComm(false);
                }
            }

        });
        this.IsInheritComm.subscribe(function (newValue) {//只有继承定盘才可以选继继承操盘
            if (Utils.Cookie.get('PeriodsStatus') - 0 != 1 || that.AddorEdit() == "Add") {
                if (newValue) {
                    that.IsInheritTradingUpdate(false);
                } else {
                    that.IsInheritTradingUpdate(true);
                    that.IsInheritTrading(false);
                }

            }

        });

        //PeriodsStatus表示：未开盘UnOpen=0,开盘Open=1,封盘Close=2,开奖Lottery=3,结算中Settlementing=4,已结算Settlement=5,重新结算  (返还金额)ReSettlement=6,已删除Delete=7
        if (Utils.Cookie.get('PeriodsStatus') - 0 != 1) {//只有未开盘是否继承期数，是否继承操盘，是否继承定盘才可以操作
             that.IsInheritCommUpdate(false);
             that.IsInheritTradingUpdate(false);
             that.IsInheritPeriodsUpdate(false);
        }
        //保存下一步和编辑的状态判断
        this.CompanyName = ko.observable(params.CompanyName);
        this.AddorEdit = ko.observable(this.params.AddorEdit);
        this.SaveAndNext = ko.observable("False");

        this.isShowCode = ko.observable(false);//是否显示验证码，只有编辑级别设置时才显示，新增子公司不显示验证码
        if (this.AddorEdit() !== "Add") {
            that.isShowCode(true);
            $("#BTSAVE").val("保存");
            document.getElementById("Next").style.display = "none";
           // $("#Next").attr("hidden", true);
        } else if (this.AddorEdit() == "Add") {
            //如果是新增，开启期数继承可以修改
            $("#BTSAVE").val("保存");
            document.getElementById("Next").style.display = "none";
            that.IsInheritPeriodsUpdate(false);
        }

        //触发保存下一步
        this.Next = function ($form, d) {
            this.SaveAndNext("True");
            this.sub($form);

        }

        this.IsDLUpdateRatio = ko.observable(false);// -- 是否允许下级修改占成 (如果允许，则只能在下面设置的时间段内使用)
        //this.RBeginDtInt = ko.observable();//-- 下级修改占成的开始时间
        //this.REndDtInt = ko.observable();// -- 下级修改占成的结束时间

        this.IsDLUpdateLimitStore = ko.observable(false);// -- 是否允许下级修改拦货 (如果允许，则只能在下面设置的时间段内使用)
        //this.LSBeginDtInt = ko.observable();//-- 下级修改拦货的开始时间
        //this.LSEndDtInt = ko.observable();//-- 下级修改拦货的结束时间


        this.sub = function ($form) {
            var that = this;
            var data = this.Validate()
            if (typeof data == "string") {
                Utils.tip(data);
                return;
            }
            data.ID = that.ID();
            data.CompanyID = data.ID;
            data.LoginName = that.LoginName();
            data.IsOddsUse = that.IsOddsUse() == 0 ? "false" : "true";    /// 0表示实际赔率、1表示转换赔率
            data.IsDownlineEditForbid = that.IsDownlineEditForbid();    /// 是否允许下级修改单注上限和单项上限
            data.IsInheritPeriods = that.IsInheritPeriods();//是否继承系统期数
            data.IsDownlineCommEdit = that.IsDownlineCommEdit();    /// 0表示不限制下线修改赚水，1表示限制
            data.IsSuperFirstLimit = that.IsSuperFirstLimit();
            data.CustomeContent = that.CustomeContent();    /// 自定义内容
            data.Ratio = that.Ratio(); /// 占成
            data.Welfare = that.Welfare();/// 福利
            data.Salary = that.Salary();/// 月花销
            data.Expend = that.Expend();//Expend

            data.IsCompanyCheckCode = that.IsCompanyCheckCode();//公司验证码
            data.IsMemCheckCode = that.IsMemCheckCode();//会员验证码

            data.IsShowLottory = that.IsShowLottory() == 0 ? "false" : "true";
            data.IsSingleBack = that.IsSingleBack() == 0 ? "false" : "true";
            data.IsCheckUper = that.IsCheckUper() == 0 ? "false" : "true";

            data.IsDirectCompany = that.IsDirectCompany();// 是否是直属公司
            //如果开启期数继承为false，那么继承操盘和继承定盘都改为false
            if (data.IsInheritPeriods == true) {

                data.IsInheritTrading = that.IsInheritTrading();// 是否继承操盘
                data.IsInheritComm = that.IsInheritComm();// 是否继承定盘
            } else {
                data.IsInheritTrading = false;// 是否继承操盘
                data.IsInheritComm = false;// 是否继承定盘
            }
            data.PlayType = that.PlayType() == false ? 0 : 1;//1表示是排列5
            data.IsControlReport = that.IsControlReport();//是否控制下级结算后查看报表
            data.ReportShowCount = that.ReportShowCount();//下级月报表显示
            data.PeriodDays = that.PeriodDays();//批量创建的天数

            data.IsDLUpdateRatio = that.IsDLUpdateRatio();// -- 是否允许下级修改占成 (如果允许，则只能在下面设置的时间段内使用)
            data.RBeginDtInt = $("#RBeginDtInt").val().replace(/[^0-9]/g, "");//that.RBeginDtInt();//-- 下级修改占成的开始时间
            data.REndDtInt = $("#REndDtInt").val().replace(/[^0-9]/g, "");//that.REndDtInt();// -- 下级修改占成的结束时间

            data.IsDLUpdateLimitStore = that.IsDLUpdateLimitStore();// -- 是否允许下级修改拦货 (如果允许，则只能在下面设置的时间段内使用)
            data.LSBeginDtInt = $("#LSBeginDtInt").val().replace(/[^0-9]/g, "");//that.LSBeginDtInt();//-- 下级修改拦货的开始时间
            data.LSEndDtInt = $("#LSEndDtInt").val().replace(/[^0-9]/g, "");//that.LSEndDtInt();//-- 下级修改拦货的结束时间

            $.ajax({
                url: '/index.php/portal/agent/EditBasic',
                data: data,
                dataType: "json",
                success: function (json) {
                    if (!json.status)
                    {
                        Utils.tip(json.info, json.status, 3000, json.status ? function () {

                        } : null);
                    }
                    else if (that.SaveAndNext() != "True") {
                        Utils.tip(json.info, json.status,3000, json.status ? function () {

                        } : null);
                        framework.view("/index.php/portal/agent/CompanySetting", "CompanySetting/Index");
                    } else if (that.SaveAndNext() == "True") {
                        if (json.status) {
                            if (that.SaveAndNext() == "True") {
                                var BasicData = { ID: that.ID(), AddorEdit: that.AddorEdit(), CompanyName: that.CompanyName() }
                                framework.view("/index.php/portal/agent/Level", "CompanySetting/Level", BasicData);
                            }
                            else {

                                framework.view("/index.php/portal/agent/Index", "CompanySetting/Index");
                            }


                        }

                    }
                }
            });
        }
        //数据绑定
        this.GetData();
    }
    Basic.prototype.GetData = function () {
        var that = this;
        $.ajax({
            url: "/index.php/portal/agent/GetCompanySettingByID",
            data: { ID: that.params.ID },
            cache: false,
            dataType: 'json',
            success: function (json) {
                if (json != null) {
                    that.LoginName(json[0].LoginName);
                    that.SecondStopEarly(json[0].SecondStopEarly)
                    that.IsOddsUse(json[0].IsOddsUse === false ? '0' : '1');
                    that.CancelBet(json[0].CancelBet);
                    that.IsDownlineEditForbid(json[0].IsDownlineEditForbid == true ? true : false);
                    that.IsInheritPeriods(json[0].IsInheritPeriods == true ? true : false);
                    that.IsDownlineCommEdit(json[0].IsDownlineCommEdit == true ? true : false);
                    that.IsSuperFirstLimit(json[0].IsSuperFirstLimit == true ? true : false);
                    that.CreditLimit(json[0].CreditLimit);
                    that.CustomeContent(json[0].CustomeContent);
                    that.IsShowLottory(json[0].IsShowLottory === false ? '0' : '1');
                    that.IsSingleBack(json[0].IsSingleBack === false ? '0' : '1');
                    that.IsCheckUper(json[0].IsCheckUper === false ? '0' : '1');

                    that.PlayType(json[0].PlayType == 1 ? true : false);// 是否是直属公司

                    that.IsDirectCompany(json[0].IsDirectCompany == true ? true : false);// 是否是直属公司
                    that.IsInheritTrading(json[0].IsInheritTrading == true ? true : false);// 是否继承操盘
                    that.IsInheritComm(json[0].IsInheritComm == true ? true : false);// 是否继承定盘

                    that.IsControlReport(json[0].IsControlReport == true ? true : false);//是否控制下级结算后查看报表
                    that.ReportShowCount(json[0].ReportShowCount);//下级月报表显示
                    that.PeriodDays(json[0].PeriodDays);//批量创建的天数
                    that.CompanyCheckCode(json[0].CompanyCheckCode);
                    that.MemCheckCode(json[0].MemCheckCode);

                    that.IsDLUpdateRatio(json[0].IsDLUpdateRatio);// -- 是否允许下级修改占成 (如果允许，则只能在下面设置的时间段内使用) 
                    $("#RBeginDtInt").val(Utils.Convert2Time(json[0].RBeginDtInt));//that.RBeginDtInt();//-- 下级修改占成的开始时间
                    $("#REndDtInt").val(Utils.Convert2Time(json[0].REndDtInt));//that.REndDtInt();// -- 下级修改占成的结束时间

                    that.IsDLUpdateLimitStore(json[0].IsDLUpdateLimitStore);// -- 是否允许下级修改拦货 (如果允许，则只能在下面设置的时间段内使用)
                    $("#LSBeginDtInt").val(Utils.Convert2Time(json[0].LSBeginDtInt));//that.LSBeginDtInt();//-- 下级修改拦货的开始时间
                    $("#LSEndDtInt").val(Utils.Convert2Time(json[0].LSEndDtInt));//that.LSEndDtInt();//-- 下级修改拦货的结束时间  

                    //1、公司基本设置需要做如下控制：只有继承期数，才可以选继承定盘，只有继承定盘才可以选继继承操盘。
                   if (Utils.Cookie.get('PeriodsStatus') - 0 != 1) {//如果未开盘
                        if (that.IsInheritPeriods() == true) {//只有继承期数，才可以选继承定盘，
                            that.IsInheritCommUpdate(false);
                        } else {
                            that.IsInheritCommUpdate(true);
                        }
                        if (that.IsInheritComm() == true)//只有继承定盘才可以选继继承操盘
                        {
                            that.IsInheritTradingUpdate(false);
                        } else {
                            that.IsInheritTradingUpdate(true);
                        }
                    }
                }
            }
        });
    }
    /// 占成  Ratio, 福利 Welfare, 工资 Salary , 月花销 Expend


    Basic.prototype.Validate = function () {
        var that = this;
        var SecondStopEarly = that.SecondStopEarly();    /// 二定提前封盘
        var CreditLimit = that.CreditLimit();    /// 新增会员的限额
        var CancelBet = that.CancelBet();    /// 投注多久内可以退码
        /// 离停盘多少分钟前使用B分批赔率var BatchOddsEnable = that.BatchOddsEnable();
        //var OddsUse=that.OddsUse();    /// 0表示实际赔率、1表示转换赔率
        //var DownlineEditForbid=that.DownlineEditForbid();    /// 是否允许下级修改单注上限和单项上限
        //var WelfareEnabled=that.WelfareEnabled();    /// 是否显示大股东福利
        //var SubordinateCommEdit=that.SubordinateCommEdit();    /// 0表示不限制大股东修改赚水，1表示限制
        //var DownlineCommEdit=that.DownlineCommEdit();    /// 0表示不限制下线修改赚水，1表示限制
        //var CustomeContent=that.CustomeContent();    /// 自定义内容
        if (CancelBet === "") {
            return "退码不能为空";
        } else if (CancelBet - 0 >= 1000) {
            return "退码不能大于999";
        }

        if (SecondStopEarly === "") {
            return "二字定提前封盘不能为空";

        } else if (CancelBet - 0 > 999) {
            return "二字定提前封盘不能大于999";
        }

        if (CreditLimit === "") {
            return "新增会员额度不能为空";
        } else if (CreditLimit - 0 > 2147483647) {
            return "新增会员额度不能大于2147483647";
        }

        return {
            SecondStopEarly: SecondStopEarly,
            CreditLimit: CreditLimit,
            CancelBet: CancelBet
        }

    }

    exports.viewmodel = Basic;
});