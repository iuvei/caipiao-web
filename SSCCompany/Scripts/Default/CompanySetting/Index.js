/// 子公司列表
//<reference path="../_ref.js" />
define(function (require, exports, module) {
    var CompanyList = function (params) {
        params = params || {}; /// 从列表中带来的参数   
        var that = this;
        this.list = ko.observableArray();
        this.IsSuperCompany = ko.observable(false);
        this.history = ko.observableArray(params.history && params.history());
        this.params = params;
        //搜索级别查询
        this.loginName = ko.observable(params.loginName || '');
        this.nickName = ko.observable(params.nickName || '');
        this.categoryGrade = ko.observable(params.categoryGrade || 0);
        this.isSearch = ko.observable(params.isSearch || false);//isSearch:true表示是条件筛选
        this.SearchLevel = function () {
            // if (that.loginName() == "" && that.nickName() == "") {
            //     Utils.tip("请输入筛选条件", false,3000, true ? function () {
            //     } : null);
            //     return;
            // }

            that.isSearch(true);
            /*0:子公司;1:代理;2:会员;*/
            if (that.categoryGrade() - 0 == 0) {
                this.history.removeAll();
                this.GetData();
            } else if (that.categoryGrade() - 0 == 1) {
                framework.view("/index.php/portal/agent/NewSubordinate", "NewSubordinate/index", {
                    AgentID: Utils.Cookie.get('AccountID') - 0,
                    IsClickCompanyName: true,
                    categoryGradeAgent: that.categoryGrade() - 0,
                    loginName: that.loginName(),
                    nickName: that.nickName(),
                    isSearch: that.isSearch()

                });
            } else if (that.categoryGrade() - 0 == 2) {
                framework.view("/index.php/portal/agent/Member", "Member/Index", {
                    IsCompanySettingEditMember: true,
                    AgentID: Utils.Cookie.get('AccountID') - 0,
                    isMemberList: false,
                    categoryGradeAgent: that.categoryGrade() - 0,
                    loginName: that.loginName(),//筛选时传参数
                    nickName: that.nickName(),
                    isSearch: that.isSearch()
                });
            }
        }

        ///域名管理
        this.Website = function ($data) {
            $data.CompanyName = $data.LoginName;
            framework.view("/index.php/portal/agent/Website", "CompanySetting/Website", $data);
        }

        ///等级管理
        this.Level = function ($data) {
            $data.CompanyName = $data.LoginName;
            framework.view("/index.php/portal/agent/Level", "CompanySetting/Level", $data);
        }
        //基础设置
        this.Basic = function ($data) {
            $data.CompanyName = $data.LoginName;
            framework.view("/index.php/portal/agent/Basic", "CompanySetting/Basic", $data);
        }
        ///编辑
        this.Edit = function ($data) {
            $data.CompanyName = $data.LoginName;
            framework.view("/index.php/portal/agent/CompanySettingAdd", "CompanySetting/Add", $data);
        }
        /// 设置限额
        this.Setlimits = function ($data) {
            var data = {
                AgentID: $data.ID
            }
            var data = $data;
            data.AgentID = data.ID;
            framework.view("/index.php/portal/agent/Setlimits", "CompanySetting/Setlimits", data);
        }
        //跳转月报表
        this.gotoMonthReport = function ($data) {
            if (!$data.mayGotoMountReport) {
                return false;
            }
            $data.CompanyType = 1;//表示是公司
            $data.isNewSubordinate = true;//表示是下级管理查询月报表
            $data.SubCompanyID = $data.ID;
            $data.SubSidaryID = $data.ID;
            framework.view('/index.php/portal/agent/MonthReport', 'Report/MonthReport', $data);
        }
        //直属公司个数
        this.GetMemCount = function ($data) {
            /* if ($data.MemCount - 0 === 0) {
                 Utils.tip("暂无直属会员", false, 1000);
                 return false;
             }*/
            that.isSearch(false);
            framework.view("/index.php/portal/agent/Member", "Member/Index", {
                IsCompanySettingEditMember: true,//true表示是子公司编辑直属会员
                CompanyTypeName: $data.CompanyTypeName,//子公司名称 
                AgentID: $data.ID,
                isMemberList: false,
                CreditLimit: $data.CreditLimit, //总公司登录，子公司新增和编辑直属会员时需要
                CompanyLoginName: $data.LoginName,

                loginName: that.loginName(),//筛选时传参数
                nickName: that.nickName(),
                isSearch: that.isSearch()
            });//isMemberList表示是否会员列表，如果是会员列表信息为空时，不要提示‘暂无下级’；如果是逐级往下，并无信息时，需要提示‘暂无下级’



        }
        //子公司添加直属会员
        this.AddDirectMember = function ($data) {
            framework.view("/index.php/portal/agent/MemberAdd", "Member/add", {
                IsCompanySettingDirectMember: true,//表示是子公司新增直属会员
                getRatioID: $data.ID,
                CompanySettingLoginName: $data.LoginName,
                CompanyTypeName: $data.CompanyTypeName,
                history:that.history,
                CreditLimit: $data.CreditLimit //总公司登录，子公司新增和编辑直属会员时需要

            });
        }
        //跳到下级管理列表
        this.GetSubordinateList = function ($data) {
            that.isSearch(false);
            framework.view("/index.php/portal/agent/NewSubordinate", "NewSubordinate/index", {
                AgentID: $data.ID,
                IsClickCompanyName: true,
                CreditLimit: $data.CreditLimit,
                loginName: that.loginName(),
                nickName: that.nickName(),
                isSearch: that.isSearch(),
                categoryGradeAgent:1
            });
        }
        //新增下级管理
        this.AddLowManage = function ($data) {
            $data.IsSubsidiary = true;//表示是子公司新增代理
            $data.ziGongSiID = $data.ID;
            $data.ziLoginName = $data.LoginName;
            $data.LoginName = '';
            $data.NickName = '';
            $data.Describe = '';
            $data.history = that.history;
            framework.view("/index.php/portal/agent/NewSubordinateAdd", "NewSubordinate/Add", $data);
        }
        ///删除
        this.Delete = function ($data) {
            if (confirm("确认删除该账号吗?")) {
                $.post("/index.php/portal/agent/DeleteChildCompany", { LoginName: $data.LoginName, _: new Date() - 0 }, function (json) { 
                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                    } : null);
                    if (json.status) {
                        that.list.remove($data);
                    }
                });
            }

        }

        ///修改密码
        this.changepwd = function ($data) {
            var d = dialog({
                title: "修改密码",
                width: 360,
                content: $("#COMPANY-CHANGEPWD").html(),
                button: [{
                    value: '确认修改',
                    callback: function () {
                        var dom = $(this.node);
                        var pwd = dom.find("input[name=pwd]").val();
                        var repwd = dom.find("input[name=repwd]").val();
                        if (pwd === "") { 
                            Utils.tip('密码不能为空', false, 3000, true ? function () {

                            } : null);
                            return false;
                        } else if (!/(\d+[a-z]+)|([a-z]+\d+)/i.test(pwd)) { 
                            Utils.tip('密码必须包含字母和数字', false, 3000, true ? function () {

                            } : null);
                            return false;
                        } else if (!/^[\da-zA-Z]{8,15}$/i.test(pwd)) { 
                            Utils.tip('密码的长度必须在8-15位之间,并且包含字母和数字', false, 3000, true ? function () {

                            } : null);
                            return false;
                        } else if (repwd === "") { 
                            Utils.tip('重复密码不能为空', false, 3000, true ? function () {

                            } : null);
                            return false;
                        }
                        else if (pwd !== repwd) { 
                            Utils.tip('两次密码不一致', false, 3000, true ? function () {

                            } : null);
                            return false;
                        }
                        $.ajax({
                            url: "/index.php/portal/agent/EditLoginPwd",
                            data: { Edit: $data.LoginName + "|" + pwd + "|True" },
                            type: "post",
                            success: function (json) { 
                                Utils.tip(json.info, json.status, 3000, json.status ? function () {

                                } : null);
                            }
                        });
                    }
                }, {
                    value: '取消',
                    callback: function () { }
                }]
            });
            d.show();
        };

        //跳转定盘
        this.BatchOdds = function ($data) {
            var arr = {
                IsZCompany: true,
                ZCompanyID:$data.ID
            }
            //$data.IsZCompany = true;//表示下级管理
            //$data.ZCompanyID = $data.ID;
            //return;
            framework.view("/index.php/portal/agent/BatchOdds", "BatchOdds/Index", arr);
        }
        

        this.CheckSuper();
        this.GetData();


    }
    CompanyList.prototype.CheckSuper = function () {
        var that = this;
        $.ajax({
            url: "/index.php/portal/agent/IsSuper",
            cache: false,
            dataType: "json",
            success: function (json) {
                if (!json.status) {
                    that.IsSuperCompany(true);
                }
            }
        });

    }
    ///获取公司列表
    CompanyList.prototype.GetData = function () {
        var that = this;
        $.ajax({
            url: "/index.php/portal/agent/GetCompanySetingList",
            data: { loginName: that.loginName().replace(/(^\s*)|(\s*$)/g, ""), nickName: that.nickName().replace(/(^\s*)|(\s*$)/g, "") },
            cache: false,
            dataType: "json",
            success: function (json) {
                if ($.isArray(json)) {
                    $.each(json, function (key, value) {
                       // if (!value.CompanyStatus) {
                            if (value.IsDirectCompany == false) {
                                value.mayGotoMountReport = value.IsInheritComm || value.IsInheritPeriods || value.IsInheritTrading;
                            } else {
                                value.mayGotoMountReport = true;
                            }
                            
                      //  }
                    });
                    that.list(json);
                }

            }
        });


    };

    exports.viewmodel = CompanyList;
});