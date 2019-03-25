/// <reference path="../_references.js" />
/// 添加/编辑 
define(function (require, exports, module) {
    var accountStatus = [
      { name: "启用", value: "1" },
      { name: "锁住", value: "2" },
      { name: "禁用", value: "3" }
    ];
    var ContributeRatioStatus = [
        { name: "0", value: "0" },
        { name: "1", value: "1" },
        { name: "2", value: "2" },
        { name: "3", value: "3" },
        { name: "4", value: "4" },
        { name: "5", value: "5" },
        { name: "6", value: "6" },
        { name: "7", value: "7" },
        { name: "8", value: "8" },
        { name: "9", value: "9" },
        { name: "10", value: "10" }
    ];
    //数字转换中文
    var numberToChinese = function (num) {
        if (!/^\d*(\.\d*)?$/.test(num)) { return "Number is wrong!"; }
        var cName = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
        var cUnit = ["", "拾", "佰", "仟", "萬", "億", "点", ""];
        var temp = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
        var integer = temp[0], remainder = temp[1], len = integer.length;
        for (var i = len - 1; i >= 0; i--) {
            switch (k) {
                case 0: re = cUnit[7] + re; break;
                case 4: if (!new RegExp("0{4}\\d{" + (len - i - 1) + "}$").test(integer))
                    re = cUnit[4] + re; break;
                case 8: re = cUnit[5] + re; cUnit[7] = cUnit[5]; k = 0; break;
            }
            if (k % 4 == 2 && integer.charAt(i + 2) != 0 && integer.charAt(i + 1) == 0) re = cName[0] + re;
            if (integer.charAt(i) != 0) re = cName[integer.charAt(i)] + cUnit[k % 4] + re; k++;
        }

        if (temp.length > 1) //加上小数部分(如果有小数部分) 
        {
            re += cUnit[6];
            for (var i = 0; i < remainder.length; i++) re += cName[remainder.charAt(i)];
        }
        return re;
    };

    var Add = function (params) {
        params = params || {}; /// 从列表中带来的参数       
        var that = this;
        this.params = params;
        this.rationlist = ko.observableArray();
        this.Agentlist = ko.observableArray();
        this.list = ko.observableArray();
        this.isEdit = !!params.AgentID;
         
        /****开始**************************************************************************************************************************************************************************/
        this.CompanyType = ko.observable(Utils.Cookie.get('CompanyType'));
        this.getTitle = ko.observable();
        this.CreditTitle = ko.observable();
        this.RationLable = ko.observable();
        this.AgentLable = ko.observable();
        this.ziGongSiID = ko.observable();
        this.IsSubsidiary = ko.observable();
        this.IsSubordinate = ko.observable(params.IsSubordinate);//表示是代理层级新增        
        this.ParentName = ko.observable();
        this.NewDefaultCredit = ko.observable(0);        
        this.DefaultCredit = ko.observable().extend({ limit: { range: [0], fix: 3 } });//总信用额度
        this.DefaultCreditChinese = ko.pureComputed(function () {
            var number = this.DefaultCredit();
            if (!isNaN(number)) {
                return numberToChinese(number);
            }  
        }, this);
        this.UsedCredit = ko.observable(0);//已用额度
        this.RemainingCredit = ko.observable(0);//可用额度
        this.IsSubordinateEdit = ko.observable(params.IsSubordinateEdit);//true为代理级别编辑 
        this.isShowContributeRatio = ko.observable(false);
        this.ContributeRatioList = ko.observable(ContributeRatioStatus);//贡献度占成上限
        this.ContributeRatio = ko.observable(params.ContributeRatio)
        this.statusList = ko.observableArray(accountStatus);//状态
        this.IsDLUpdateRatio = ko.observable(params.IsDLUpdateRatio);//-- 是否允许下级修改占成
        this.RBeginDtInt = ko.observable(Utils.Convert2Time(params.RBeginDtInt));// -- 修改占成开始时间
        this.REndDtInt = ko.observable(Utils.Convert2Time(params.REndDtInt));// -- 修改占成结束时间

        this.AgentLevel = ko.observable(params.AgentLevel - 0==0?true:false);//只有是公司看大股东（AgentLevel：0表示是大股东）“已清算”按钮可看；大股东以下代理隐藏该按钮；

        if (that.CompanyType() - 0 == 0) { //总公司登录********************************************
            console.log(params);
            //由子公司新增代理传的参数
            if (params.IsSubsidiary == true) {
                that.isShowContributeRatio(true);//显示贡献度占成上限
                that.ziGongSiID(params.ziGongSiID);//子公司ID
                that.IsSubsidiary=params.IsSubsidiary;//表示是子公司新增代理
                that.CreditTitle(params.CompanyTypeName +" ："+ params.ziLoginName);
                that.getTitle(params.CompanyTypeName + params.ziLoginName + ">>新增 ");// + params.LevelName
                that.RationLable(params.CompanyTypeName);
                that.AgentLable(params.LevelName);
                that.ParentName(params.ziLoginName);
            } else if (that.IsSubordinate() == true && that.isEdit==false) {
                that.IsSubsidiary=false;//表示是代理新增
                that.ziGongSiID(params.NewAgentID);
                that.CreditTitle(params.LevelName + " ：" + params.ParentName);
                that.getTitle(params.LevelName + params.ParentName + ">>新增 " );
                that.RationLable(params.LevelName); 
                that.NewDefaultCredit(params.DefaultCredit);
                //that.UsedCredit(params.UsedCredit);
                //that.RemainingCredit(that.NewDefaultCredit() - 0 - that.UsedCredit() - 0);
                that.ParentName(params.ParentName);
            } else if (that.IsSubordinateEdit() == true && that.isEdit == true) {
                if (params.AgentLevel - 0 == 0) {//等级AgentLevel=0;表示是子公司编辑下级(大股东)
                    that.isShowContributeRatio(true);//显示贡献度占成上限
                    that.IsSubsidiary = true;
                } else {
                    that.IsSubsidiary = false;
                }
                
                that.ziGongSiID(params.ParentID);
                that.CreditTitle(params.ParentLevelName + " ：" + params.ParentName);
                that.getTitle(params.ParentLevelName + params.ParentName + ">>编辑 ");// + params.LevelName
                that.RationLable(params.ParentLevelName); 
                that.NewDefaultCredit(params.ParentCredit);
                //that.UsedCredit(params.ParentUsedCredit);
                //that.RemainingCredit(that.NewDefaultCredit() - 0 - that.UsedCredit() - 0);
                that.ParentName(params.ParentName);
                that.DefaultCredit(params.DefaultCredit);
            }
        } else if (that.CompanyType() - 0 == 1) { //子公司登录登录**********************************************************
            if (that.IsSubordinate() == true && that.isEdit == false) {
                that.IsSubsidiary=false;//表示是代理新增
                that.ziGongSiID(params.NewAgentID);
                that.getTitle(params.LevelName + params.ParentName + ">>新增 ");//+ params.LevelName
                that.RationLable(params.LevelName);
                that.AgentLable(params.LevelName);
                that.ParentName(params.ParentName);
                that.NewDefaultCredit(params.DefaultCredit);
                //that.UsedCredit(params.UsedCredit);
                //that.RemainingCredit(that.NewDefaultCredit() - 0 - that.UsedCredit() - 0);
            } else if (that.IsSubordinateEdit() == true && that.isEdit == true) {                 
                if (params.AgentLevel - 0 == 0) {//等级AgentLevel=0;表示是子公司编辑下级(大股东)     
                    that.isShowContributeRatio(true);//显示贡献度占成上限
                    that.IsSubsidiary = true;
                    that.NewDefaultCredit(params.DefaultCredit);
                    //that.UsedCredit(params.UsedCredit);
                    //that.RemainingCredit(that.NewDefaultCredit() - 0 - that.UsedCredit() - 0);
                } else {
                    that.IsSubsidiary = false;
                    that.NewDefaultCredit(params.ParentCredit);
                    //that.UsedCredit(params.ParentUsedCredit);
                    //that.RemainingCredit(that.NewDefaultCredit() - 0 - that.UsedCredit() - 0);
                }
                that.ziGongSiID(params.ParentID);
                that.CreditTitle(params.ParentLevelName + " ：" + params.ParentName);
                that.getTitle(params.ParentLevelName + params.ParentName + ">>编辑 ");// + params.LevelName
                that.RationLable(params.ParentLevelName); 
                that.ParentName(params.ParentName);
                that.DefaultCredit(params.DefaultCredit);
            } else {
                // 大股东新增下级
                that.isShowContributeRatio(true);//显示贡献度占成上限
                that.IsSubsidiary = false;
                that.NewDefaultCredit(Utils.Cookie.get('GetDefaultCredit'));
                var IsSubAccount = Utils.Cookie.get('IsSubAccount');//是否是子账号
                that.ziGongSiID(IsSubAccount == "true" ? Utils.Cookie.get('ParentId') : Utils.Cookie.get('AccountID'));
                that.getTitle('大股东' + Utils.Cookie.get('AccountLoginName') + ">>新增 ");// + Utils.Cookie.get('RationLable')
                that.RationLable('大股东');
                that.AgentLable(Utils.Cookie.get('RationLable'));
                that.ParentName(Utils.Cookie.get('AccountLoginName'));
            }
        } else if (that.CompanyType()-0==2)//代理级别登录**************************************************************
        {
            if (that.IsSubordinate() == true && that.isEdit == false) {
                that.IsSubsidiary = false;//表示是代理新增
                that.ziGongSiID(params.NewAgentID);
                that.getTitle(params.LevelName + params.ParentName + ">>新增 ");//+ params.LevelName
                that.RationLable(params.LevelName);
                that.AgentLable(params.LevelName);
                that.ParentName(params.ParentName);
                that.NewDefaultCredit(params.DefaultCredit);
                //that.UsedCredit(params.UsedCredit);
                //that.RemainingCredit(that.NewDefaultCredit() - 0 - that.UsedCredit() - 0);
            } else if (that.IsSubordinateEdit() == true && that.isEdit == true) {
                that.IsSubsidiary = false;
                that.ziGongSiID(params.ParentID);
                that.CreditTitle(params.ParentLevelName + " ：" + params.ParentName);
                that.getTitle(params.ParentLevelName + params.ParentName + ">>编辑 ");// + params.LevelName
                that.RationLable(params.ParentLevelName); 
                that.NewDefaultCredit(params.ParentCredit);
                //that.UsedCredit(params.ParentUsedCredit);
                //that.RemainingCredit(params.ParentCredit - 0 - params.ParentUsedCredit - 0);
                that.ParentName(params.ParentName);
                that.DefaultCredit(params.DefaultCredit);
            } else {
                that.IsSubsidiary = false;
                that.ziGongSiID(Utils.Cookie.get('AccountID'));
                that.getTitle(Utils.Cookie.get('RationLable') + Utils.Cookie.get('AccountLoginName') + ">>新增 ");                
                that.RationLable(Utils.Cookie.get('RationLable'));
                that.AgentLable(Utils.Cookie.get('RationLable'));
                that.ParentName(Utils.Cookie.get('AccountLoginName'));
                that.NewDefaultCredit(Utils.Cookie.get('GetDefaultCredit'));
                //that.UsedCredit(Utils.Cookie.get('GetUsedCredit'));
                //that.RemainingCredit(Utils.Cookie.get('GetDefaultCredit') - 0 - Utils.Cookie.get('GetUsedCredit') - 0);
            }
        }
        
        /****结束**************************************************************************************************************************************************************************/
         
        this.ParentID = ko.observable(params.ParentID || Utils.Cookie.get('AccountID'));

        this.NewAgentID = ko.observable(params.NewAgentID || '');
        this.NewParentRatio = ko.observable(params.NewParentRatio || '');

        this.LevelName = ko.observable(params.LevelName || '');
         
         
        this.account = ko.observable(that.isEdit?params.LoginName: '');//账号
        this.nickname = ko.observable(params.NickName || '');//昵称
        this.password = ko.observable('');//密码
        this.repassword = ko.observable('');
        this.tip = ko.pureComputed(function () {
            if (this.repassword().length > 15) {
                return '(密码长度不能超过15位)'
            }
            return '(确认密码与密码必须保持一致)';
        }, this);
        this.status = ko.observable(params.CompanyStatus || "0");

        this.remark = ko.observable(params.Describe || '');//备注

       // this.DefaultCredit = ko.observable();//(params.DefaultCredit - 0 || '');//信用额度
        this.CurrentLevelRatio = ko.observable();//(params.CurrentLevelRatio || '');//占成上限:总代理.CurrentLevelRatio//
        this.DownLevelRatio = ko.observable(params.DownLevelRatio || '');//占成上限:总代理：DownLevelRatio
        this.LevelID = ko.observable();//ko.observable(params.LevelID || '');//等级

        /*****获取最新信用额度********************/
        this.GetAgentCreditByID = function () {
            $.ajax({
                url: "/index.php/portal/agent/GetAgentCreditByID",
                type: "post",
                success: function (json) {
                    // Utils.Cookie.remove('BetDetailClearDT');
                    Utils.Cookie.set('GetDefaultCredit', parseFloat(json[0].DefaultCredit), 'undefined', '/');
                    Utils.Cookie.set('GetUsedCredit', parseFloat(json[0].UsedCredit), 'undefined', '/');
                }
            });
        }
        /// 提交表单
        this.sub = function ($form) {
            var data = that.Validate();
            if (typeof data === 'string') {
                //return Utils.tip(data, false);
                Utils.tip(data, false, 3000, true ? function () {

                } : null);
                return;
            }

            data.Describe = that.remark();//备注
            data.Status = that.status();//状态
            data.CurrentLevelRatio = that.CurrentLevelRatio();
            data.DownLevelRatio = that.DownLevelRatio();
            data.LevelID = that.LevelID();

            data.ParentName = that.ParentName();

            //data.NewAgentID = that.NewAgentID();
            data.ParentID = Utils.Cookie.get('AccountID');

            data.ContributeRatio = that.ContributeRatio();
            if (that.isEdit) { //如果是编辑需要传当前ID 
                data.id = that.params.AgentID;
            }

            $.ajax({
                url: that.isEdit ? '/index.php/portal/agent/EditNewSubordinate' : '/index.php/portal/agent/AddNewSubordinate',
                type: "post",
                data: data,
                success: function (json) {
                    if (json.status == true) {
                        if (Utils.Cookie.get('CompanyType') - 0 == 2) {//如果是代理级别才查询
                            that.GetAgentCreditByID();//获取最新信用额度
                        }
                        if (that.isEdit) {
                            Utils.tip(json.info, json.status, 3000, json.status ? function () { } : null);
                            that.back();
                        }
                        else {
                          //  console.log(json);
                            var obj = {};
                            obj.AgentID = json.newAgentID;
                            obj.LoginName = that.account();
                            obj.SuperCompanyName = that.ParentName();
                            obj.isMember = false;
                            obj.history = params.history;
                            obj.back = that.back.bind(that);
                            framework.view("/index.php/portal/agent/SttingsQuota", "SttingsQuota/index", obj);
                        }                        
                        
                    } else {
                        Utils.tip(json.info, json.status, 3000, json.status ? function () {

                        } : null);
                    }
                }
            });
        }

        
        //下级管理-->编辑：下级归零
        this.SubordinateMakeZeroTrue = function ($data) {            
            /*viewName为当前用户名  userName为被操者用户名*/
            if (confirm("确认是否清算？"))
            {
                var IsBool = "";
                if (Utils.Cookie.get('CompanyType') == 0) {  //如果是总公司登录
                    IsBool = "true";
                } else {
                    IsBool = "false";
                }

                $.post("/index.php/portal/agent/RecoverCredit", { viewName: Utils.Cookie.get('AccountLoginName'), userName: $data.account, IsBool: IsBool, _: new Date() - 0 }, function (json) {
                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                    } : null);
                    if (json.status) {
                        that.list.remove($data);
                    }
                });

            }
           


        }

        //检查代理用户是否已存在
        this.GetCheckRepeatAccount = function () {
            var that = this;
            var account = that.account().replace(/(^\s*)|(\s*$)/g, "");//账号名称
            if (account === "") {
                Utils.tip("账号不能为空", false, 3000, true ? function () {

                } : null);
                return false;
            }
            else if (!/^[a-z][\da-z]{2,11}$/i.test(account)) {//用户名长度统一在3-12位
                Utils.tip("账号只能是字母和数字，并由字母开头, 长度必须在3-12位之间", false, 3000, true ? function () {

                } : null);
                return false;
            }
            else {
                $.ajax({
                    url: '/index.php/portal/agent/CheckRepeatAccount',
                    type: "post",
                    data: { loginName: account, isMember: false },
                    success: function (json) {
                        Utils.tip(json.info, json.status, 3000, json.status ? function () {

                        } : null);
                    }
                });
            }

        }


        this.GetData();
    }


    Add.prototype.GetData = function () {        
        var that = this,
            endRatioID=that.ziGongSiID();
        if (that.IsSubsidiary == true) {
            endRatioID = that.ziGongSiID();
        }
        /// 获取等级**************************************************************** 
      
        $.ajax({
            url: "/index.php/portal/agent/GetUsableAgentLevel",
            cache: false,
            data: { ID: endRatioID },
            success: function (json) {
                if (json == "") {
                   
                    framework.view("/index.php/portal/agent/MemberAdd", "Member/add", { AgentLoginName: Utils.Cookie.get('AccountLoginName'), DefaultCredit: Utils.Cookie.get('GetDefaultCredit'), UsedCredit: Utils.Cookie.get('GetUsedCredit'), IsMember: true });
                } else {
                    var arrLevel = [];
                    $.each(json, function (a, b) {                        
                        arrLevel.push({
                            AgentLevel: b.LevelID,
                            AgentLevelName: b.AgentLevel,
                            LevelName: b.LevelName
                        });

                    });
                    that.list(arrLevel);
                    that.AgentLable(arrLevel[0].LevelName); 
                  
                }


            }
        });
        //获取占成上限*********************************************************************/
        //如果是总公司登录，子公司新增下级，拿的是当前子公司的ID返回的占成IsSubsidiary：true表示是子公司新增下级
        
        $.ajax({
            url: "/index.php/portal/agent/GetRatioByCompanyID",//ParentID是子公司ID也是上级ID
            cache: false,
            data: { ID: endRatioID },//GetRatioByCompanyID || that.params.ParentID || Utils.Cookie.get('AccountID') },  
            success: function (json) {
                var arr = [];
                var len = json[0].Ratio / 5;
                for (var i = len; i >= 0; i--) {
                    arr.push({
                        Ratio: i * 5,
                        RatioName: i * 5
                    });
                }
                that.rationlist(arr); //自己的占成
                //下级占成如果是新增时所有都默认0
                if (that.isEdit) {//如果是编辑 
                    var arrAgent = [];
                    var num = that.params.BaseRatio - that.params.ParentRatio;
                    var agentLen = num / 5;
                    for (var i = agentLen; i >= 0; i--) {
                        arrAgent.push({
                            Agent: i * 5,
                            AgentName: i * 5
                        });
                    }
                    that.Agentlist(arrAgent);
                    that.DownLevelRatio(that.params.AgentRatio);
                    that.CurrentLevelRatio(that.params.ParentRatio);
                } else { //添加时默认是0
                    var arrAgent = [];
                    arrAgent.push({
                        Agent: 0,
                        AgentName: 0
                    });
                    that.Agentlist(arrAgent);
                    that.DownLevelRatio(0);
                }
                $("#ratioLen").on("change", function () {  //自己的占成下拉事件
                    var arrAgent = [];
                    var RatioValue = json[0].Ratio;
                    if (RatioValue == 0) {
                        RatioValue = that.params.NewParentRatio;
                    }
                    var num = RatioValue - this.value;//100 - this.value;
                    var agentLen = num / 5;
                    for (var i = agentLen; i >= 0; i--) {
                        arrAgent.push({
                            Agent: i * 5,
                            AgentName: i * 5
                        });
                    }
                    that.Agentlist(arrAgent);
                    that.DownLevelRatio(arrAgent['0']['Agent']);
                });
                $("#downLen").on("change", function () {//下级占成下拉事件
                    var arrAgent = [];

                    var RatioValue = json[0].Ratio;
                    if (RatioValue == 0) {
                        RatioValue = that.params.NewParentRatio;
                    }
                    var num = RatioValue - this.value;//100 - this.value;
                    var agentLen = num / 5;
                    for (var i = agentLen; i >= 0; i--) {
                        arrAgent.push({
                            Ratio: i * 5,
                            RatioName: i * 5
                        });
                    }
                    that.rationlist(arrAgent);
                });
            }
        });

    }



    Add.prototype.Validate = function () {
        var that = this;
        var account = that.account().replace(/(^\s*)|(\s*$)/g, "");//账号名称
        var nickname = $.trim(that.nickname());//昵称
        var password = that.password();//密码
        var repassword = that.repassword();//重复密码
        var DefaultCredit = that.DefaultCredit();//信用额度
        var NewDefaultCredit = that.NewDefaultCredit();

        if (account === "") {
            return "账号不能为空";
        } else if (!/^[a-z][\da-z]+/i.test(account)) {
            return "账号只能是字母和数字，并由字母开头";
        } else if (!/^[a-z][\da-z]{2,11}/i.test(account)) {//用户名长度统一在3-12位
            return "账号的长度必须在3-12位之间";
        }
        if (!that.isEdit) {
            if (password === "") {
                return "密码不能为空";//(!(/(\d+[a-z]+)|([a-z]+\d+)/i.test(password) && /^[\da-z]{8,15}$/.test(password))) 
            } else if (!/(\d+[a-z]+)|([a-z]+\d+)/i.test(password)) {
                return "密码必须包含字母和数字";
            } else if (!/^[\da-z]{8,15}$/i.test(password)) {
                return "密码的长度必须在8-15位之间,并且包含字母和数字";
            } else if (repassword === "") {
                return "重复密码不能为空";
            } else if (password !== repassword) {
                return "两次密码不一致";// alert("两次密码不一致"); return false;
            }
        }
        if (DefaultCredit === ""||DefaultCredit==undefined) {
            return "信用额度不能为空";
        }
        //  if (that.CompanyType() - 0 == 0) { //总公司登录
        if (that.IsSubsidiary == false) {//显示信用额度时，
            if (that.IsSubordinateEdit() == true && that.isEdit == true) {
                if (Number(DefaultCredit) > Number(NewDefaultCredit + that.params.DefaultCredit))//Number(that.RemainingCredit()) + Number(that.params.DefaultCredit))// // Number(that.RemainingCredit()) + Number(that.params.DefaultCredit))
                {
                    return "当前的信用额度不能超过可用额度!";
                }
            } else {// if (that.IsSubordinate() == true && that.isEdit == false) {
                if (Number(DefaultCredit) > Number(that.NewDefaultCredit())) {
                    return "当前的信用额度不能超过可用额度!"; 
                }
            }
        } 
        if (nickname === "") {
            return "昵称不能为空";
        } else if (!/^.{1,20}$/.test(nickname)) {
            return "昵称的长度必须在1-20个字符之间";
        }

        if (!that.isEdit) {
            return {
                LoginName: account,
                NickName: nickname,
                password: password,
                DefaultCredit: DefaultCredit
            };
        } else {
            return {
                LoginName: account,
                NickName: nickname,
                DefaultCredit: DefaultCredit
            };
        }
    }
    Add.prototype.back = function () {
        var params = this.params;
        if (Utils.Cookie.get('CompanyType') - 0 === 0 && params.IsSubsidiary) {
            framework.view('/index.php/portal/agent/CompanySetting', 'companysetting/index');
        }
        else {
            framework.view('/index.php/portal/agent/NewSubordinate', 'NewSubordinate/Index', { AgentID: params.ParentID, history: params.history });
        } 
    }

    exports.viewmodel = Add;

});