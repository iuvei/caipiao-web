/// <reference path="../_references.js" />
/// 添加/编辑 
define(function (require, exports, module) {
    var accountStatus = [
      { name: "启用", value: "1" },
      { name: "锁住", value: "2" },
      { name: "禁用", value: "3" }//,
     // { name: "已删除", value: "3" }
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
    // var CompanyTypeCookie = Utils.Cookie.get('CompanyType'); //用户类型(总公司？子公司？代理？)   
    var Add = function (params) {
        params = params || {}; /// 从列表中带来的参数       
        var that = this;
        this.params = params;
        this.rationlist = ko.observableArray();
        this.Agentlist = ko.observableArray();
        this.list = ko.observableArray();
        this.isEdit = !!params.MemberID;

        /***开始**新版**********************************************************************************************************************/
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
        this.CompanyType = ko.observable(Utils.Cookie.get('CompanyType'));
        this.IsCompanySettingDirectMember = ko.observable();//为true，表示子公司新增直属会员，不用限定信用额度
        this.IsCompanySettingEditMember = ko.observable();  //为true，表示子公司编辑直属会员，不用限定信用额度
        this.getRatioID = ko.observable();
        this.ParentDefaultCredit = ko.observable();//总信用额度
        this.ParentRemainingCredit = ko.observable();//可分配信用额度
        this.ParentUsedCredit = ko.observable();//已分配信用额度
        this.LoginNameMember = ko.observable();
        this.ParentName = ko.observable();
        this.IsAgentDirectMember = ko.observable();//如果IsAgentDirectMember是true，表示代理级别新增直属会员，需要控制限定信用额度
		this.IsDLUpdateRatio = Utils.Cookie.get('IsDLUpdateRatio');
        //this.CreditLimit = ko.observable();// 子公司设置的新增会员额度

        if (that.CompanyType() - 0 == 0) { //总公司登录********************************************
            if (params.IsCompanySettingDirectMember == true)//true表示是子公司新增直属会员
            {
                that.IsCompanySettingDirectMember = true;
                Utils.Cookie.set('SubCreditLimit', params.CreditLimit, '', '/');
                that.getRatioID(params.getRatioID);
                that.LoginNameMember(params.CompanyTypeName + params.CompanySettingLoginName);
                that.ParentName(params.CompanySettingLoginName);
            } else if (params.IsCompanySettingEditMember == true && that.isEdit == true) {//子公司编辑直属会员
                Utils.Cookie.set('SubCreditLimit', params.CreditLimit, '', '/');
                that.getRatioID(params.MemberParentID);
                that.LoginNameMember(params.CompanyTypeName + params.ParentName);
                that.ParentName(params.ParentName);
            } else if (params.IsAgentDirectMember == true) {//代理级别新增会员
                //代理级别需要限制信用额度
                that.IsCompanySettingDirectMember = false;
                that.getRatioID(params.RaionID);
                that.LoginNameMember(params.LevelName + params.AgentLoginName);
                that.ParentName(params.AgentLoginName);
                that.ParentDefaultCredit(params.newDefaultCredit);
                //that.ParentUsedCredit(params.UsedCredit);
                //that.ParentRemainingCredit(params.newDefaultCredit - 0 - params.UsedCredit - 0)
            } else if (params.IsAgentEditMember == true) {//代理级别编辑会员
                that.IsCompanySettingDirectMember = false;

                that.getRatioID(params.ParentID);
                that.LoginNameMember(params.LevelName + params.ParentName);
                that.ParentName(params.ParentName);
                that.ParentDefaultCredit(params.ParentDefaultCredit);
                //that.ParentUsedCredit(params.ParentUsedCredit);
                //that.ParentRemainingCredit(params.ParentDefaultCredit - 0 - params.ParentUsedCredit - 0)
            } else if (params.IsMemberEdit == true && params.IsEndLevel == true)//最后一级会员编辑;IsEndLevel是数据库返回，true表示是最后等级
            {
                that.getRatioID(params.ParentID);
                that.LoginNameMember(params.LevelName + params.ParentName);
                that.ParentName(params.ParentName);
                that.ParentDefaultCredit(params.ParentDefaultCredit);
                //that.ParentUsedCredit(params.ParentUsedCredit);
                //that.ParentRemainingCredit(params.ParentDefaultCredit - 0 - params.ParentUsedCredit - 0);
            }
        } else if (that.CompanyType() - 0 == 1 || that.CompanyType() - 0 == 2) { //子公司登录登录和代理级别登录**********************************************************
            if (params.IsAgentDirectMember == true) {//代理级别新增会员
                //代理级别需要限制信用额度
                /*if (that.CompanyType() - 0 == 1) {
                    that.IsCompanySettingDirectMember = true;
                } else {
                    that.IsCompanySettingDirectMember = false;
                }*/
                that.IsCompanySettingDirectMember = false;
                that.getRatioID(params.RaionID);
                that.LoginNameMember(params.LevelName + params.AgentLoginName);
                that.ParentName(params.AgentLoginName);
                that.ParentDefaultCredit(params.newDefaultCredit);
                //that.ParentUsedCredit(params.UsedCredit);
                //that.ParentRemainingCredit(params.newDefaultCredit - 0 - params.UsedCredit - 0)
            } else if (params.IsAgentEditMember == true) {//代理级别编辑会员
                /*  if (that.CompanyType() - 0 == 1) {
                      that.IsCompanySettingDirectMember = true;
                  } else {
                      that.IsCompanySettingDirectMember = false;
                  }*/
                that.IsCompanySettingDirectMember = false;
                that.getRatioID(params.ParentID);
                that.LoginNameMember(params.LevelName + params.ParentName);
                that.ParentName(params.ParentName);
                that.ParentDefaultCredit(params.ParentDefaultCredit);
                //that.ParentUsedCredit(params.ParentUsedCredit);
                //that.ParentRemainingCredit(params.ParentDefaultCredit - 0 - params.ParentUsedCredit - 0)
            } else {
                if (that.CompanyType() - 0 == 1) {
                    that.IsCompanySettingDirectMember = true;
                    that.LoginNameMember('公司' + Utils.Cookie.get('AccountLoginName'));
                } else {
                    that.IsCompanySettingDirectMember = false;
                    that.LoginNameMember(Utils.Cookie.get('RationLable') + Utils.Cookie.get('AccountLoginName'));
                }

                that.getRatioID(Utils.Cookie.get('AccountID'));                 
                that.ParentName(Utils.Cookie.get('AccountLoginName'));
                that.ParentDefaultCredit(Utils.Cookie.get('GetDefaultCredit'));
                //that.ParentUsedCredit(Utils.Cookie.get('GetUsedCredit'));
                //that.ParentRemainingCredit(that.ParentDefaultCredit() - 0 - that.ParentUsedCredit() - 0)
            }

        }

        /***结束************************************************************************************************************************/

        this.AgentLoginName = ko.observable(params.AgentLoginName || ''); //第4级代理名称
        this.SuperLoginName = ko.observable(params.SuperLoginName || '');
        this.account = ko.observable(that.isEdit?params.LoginName : '');//账号
        this.nickname = ko.observable(params.NickName || '');//昵称
        this.password = ko.observable('');//密码
        this.repassword = ko.observable('');
        this.statusList = ko.observableArray(accountStatus);//状态
        this.status = ko.observable(params.CompanyStatus || "0");
        this.remark = ko.observable(params.Describe || '');//备注 
        this.DefaultCredit = ko.observable(that.isEdit ? params.DefaultCredit - 0 || '0' : '').extend({ limit: { range: [0], fix: 3 } });//会员上级信用额度
        this.DefaultCreditChinese = ko.pureComputed(function () {
            var number = this.DefaultCredit();
            if (!isNaN(number)) {
                return numberToChinese(number);
            }
        }, this);
        this.DefaultCash = ko.observable(that.isEdit ? params.DefaultCash - 0 || '0' : '');//会员信用额度

        this.UsedAmount = ko.observable((params.DefaultCredit - 0) > (params.DefaultCash - 0)?0:((params.DefaultCash - 0) - (params.DefaultCredit - 0)).toFixed(2) - 0);//已用额度 ，计算方法：DefaultCash-DefaultCredit。

        this.IsMember = ko.observable(params.IsMember);
        this.CurrentLevelRatio = ko.observable();//占成上限



        /// 提交表单******************************************************
        this.sub = function ($form) {
            var data = that.Validate();
            if (typeof data === 'string') {
                return Utils.tip(data, false, 3000, true ? function () {

                } : null);
            }
            data.CurrentLevelRatio = that.CurrentLevelRatio();//拦货占成上限
            data.Describe = that.remark();//备注
            data.Status = that.status();//状态 

            data.ParentName = that.ParentName();
            data.SuperLoginName = that.SuperLoginName();
            if (that.isEdit) { //如果是编辑需要传当前ID 
                data.id = that.params.ParentID;
            }

            $.ajax({
                url: that.isEdit ? '/index.php/portal/agent/ModifyMemberInfo' : '/index.php/portal/agent/InsertMember',
                type: "post",
                data: data,
                success: function (json) {
                    if (json.status == true) {
                        if (that.isEdit) {
                            if (Utils.Cookie.get('CompanyType') - 0 == 2) {//如果是代理级别才查询
                                that.GetAgentCreditByID();//获取最新信用额度
                            }
                            Utils.tip(json.info, json.status, 3000, json.status ? function () {

                            } : null);
                            //that.back();
                        }
                        else {
                            var obj = {};
                            obj.AgentID = json.newAgentID;
                            obj.LoginName = that.account();
                            obj.SuperCompanyName = that.ParentName();
                            obj.isMember = true;
                            obj.history = params.history;
                            obj.back = that.back.bind(that);
                            framework.view("/index.php/portal/agent/SttingsQuota", "SttingsQuota/index", obj);
                        }
                        
                    }
                    else {
                        Utils.tip(json.info, json.status, 3000, json.status ? function () {

                        } : null);
                    }
                   
                }
            });
        }


        //检查会员用户是否已存在
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
                    data: { loginName: account, isMember: true },
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
            RatioID = that.getRatioID();

        $.ajax({
            url: "/index.php/portal/agent/GetRatioByCompanyID",
            cache: false,
            data: { ID: RatioID },
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
                that.CurrentLevelRatio(that.params.Ratio);


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
        if (DefaultCredit === "") {
            return "信用额度不能为空";
        } else {
            if (that.IsCompanySettingDirectMember == false) {//如果信用额度是显示的
                if (DefaultCredit - 0 > Number(that.ParentDefaultCredit()) + Number(that.params.DefaultCredit))// Number(that.ParentRemainingCredit()) + Number(that.params.DefaultCash))////Number(that.ParentRemainingCredit()) + Number(that.params.DefaultCredit))
                {
                    return "当前的信用额度不能超过可用额度!";
                }
            }
            
        }

		/*
        if (nickname === "") {
            return "昵称不能为空";
        } else if (!/^.{1,20}$/.test(nickname)) {
            return "昵称的长度必须在1-20个字符之间";
        }
		*/

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
        var params = this.params,
            urlView,
            urlJS,
            that = this,
            data = {};
        if (that.CompanyType() - 0 == 0) { //总公司登录********************************************
            if (params.IsCompanySettingEditMember == true && that.isEdit == true) {//子公司返回
                urlView = "/index.php/portal/agent/Member";
                urlJS = "Member/index";
                data = {
                    IsCompanySettingEditMember: params.IsCompanySettingEditMember,
                    AgentID: params.MemberParentID,
                    CompanyTypeName: params.CompanyTypeName,
                    CreditLimit: params.CreditLimit
                }
            } else if (params.IsAgentDirectMember == true) {//代理级别新增返回
                urlView = "/index.php/portal/agent/NewSubordinate";
                urlJS = "NewSubordinate/index";
                data = {
                    AgentID: params.ParentID
                }
            } else if (params.IsAgentEditMember == true) {//代理级别编辑返回
                urlView = "/index.php/portal/agent/Member";
                urlJS = "Member/index";
                data = {
                    ParentID: params.ParentID,
                    AgentID: params.AgentID,
                    IsAgentEditMember: params.IsAgentEditMember,
                    LevelName: params.LevelName,
                    newParentID: params.newParentID  //代理级别编辑直属会员返回时
                }
            } else if (params.IsMemberEdit == true && params.IsEndLevel == true)//最后一级会员编辑;IsEndLevel是数据库返回，true表示是最后等级
            {
                urlView = "/index.php/portal/agent/Member";
                urlJS = "Member/index";
                data = {
                    // ParentID: params.ParentID,
                    AgentID: params.ParentID,
                    LevelName: params.LevelName,
                    IsEndLevel: params.IsEndLevel,
                    newParentID: params.newParentID
                }

            } else {//否则跳转子公司首页
                urlView = "/index.php/portal/agent/CompanySetting";
                urlJS = "CompanySetting/index";
            }

        } else if (that.CompanyType() - 0 == 1 || that.CompanyType() - 0 == 2) {
            if (params.IsAgentDirectMember == true) {//代理级别新增返回
                urlView = "/index.php/portal/agent/NewSubordinate";
                urlJS = "NewSubordinate/index";
                data = {
                    AgentID: params.ParentID
                }
            } else if (params.IsAgentEditMember == true) {//代理级别编辑返回
                urlView = "/index.php/portal/agent/Member";
                urlJS = "Member/index";
                data = {
                    ParentID: params.ParentID,
                    AgentID: params.ParentID,
                    IsAgentEditMember: params.IsAgentEditMember,
                    LevelName: params.LevelName,
                    newParentID: params.newParentID  //代理级别编辑直属会员返回时
                }
            } else if (params.IsMemberEdit == true && params.IsEndLevel == true)//最后一级会员编辑;IsEndLevel是数据库返回，true表示是最后等级
            {
                urlView = "/index.php/portal/agent/Member";
                urlJS = "Member/index";
                data = {
                    // ParentID: params.ParentID,
                    AgentID: params.ParentID,
                    LevelName: params.LevelName,
                    IsEndLevel: params.IsEndLevel,
                    newParentID: params.newParentID
                }
            } else {
                urlView = "/index.php/portal/agent/Member";
                urlJS = "Member/index";
                data = {
                    AgentID: Utils.Cookie.get('AccountID')
                }
            }
        }
        data.history = params.history;
        framework.view(urlView, urlJS, data);
    };
    exports.viewmodel = Add;

});