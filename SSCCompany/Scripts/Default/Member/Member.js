///  
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var AccountList = function (params) {
        params = params || {}; /// 从列表中带来的参数       
        var that = this;
        this.history = ko.observableArray(params.history && params.history());
        this.params = params;
        this.isBack = ko.observable(params.isSearch ? false : (that.history().length || Utils.Cookie.get('CompanyType') - 0 === 0));

        if (Utils.Cookie.get("CompanyType") - 0 == 1) {//公司级别，移除公司选项
            document.getElementById("memberGrade").options.remove(0);
        } else if (Utils.Cookie.get("CompanyType") - 0 == 2) {//代理级别
            document.getElementById("memberGrade").options.remove(0);
            if (Utils.Cookie.get("NextLevelListCount") - 0 == 0) {
                document.getElementById("memberGrade").options.remove(0);
            }
        }
        //搜索级别查询
        this.loginName = ko.observable(params.loginName || '');
        this.nickName = ko.observable(params.nickName || '');
        this.SearchID = ko.observable(params.AgentID);
        this.isSearch = ko.observable(params.isSearch || false);//isSearch:true表示是条件筛选
        this.categoryGradeAgent = ko.observable(params.categoryGradeAgent || 2);
        this.SearchLevel = function () {
            that.isSearch(true);
            /*0:子公司;1:代理;2:会员;*/
            if (that.categoryGradeAgent() - 0 == 0) {
                framework.view("/index.php/portal/agent/CompanySetting", "CompanySetting/index", {
                    AgentID: that.SearchID() || Utils.Cookie.get('AccountID'),
                    loginName: that.loginName(),//筛选时传参数
                    nickName: that.nickName(),
                    isSearch: that.isSearch(),
                    categoryGrade: that.categoryGradeAgent() - 0

                });
            } else if (that.categoryGradeAgent() - 0 == 1) {
                framework.view("/index.php/portal/agent/NewSubordinate", "NewSubordinate/index", {
                    AgentID: that.SearchID() || Utils.Cookie.get('AccountID'),
                    loginName: that.loginName(),//筛选时传参数
                    nickName: that.nickName(),
                    isSearch: that.isSearch(),
                    categoryGradeAgent: that.categoryGradeAgent() - 0

                });
            } else if (that.categoryGradeAgent() - 0 == 2) {
               
                if (that.loginName() == "" && that.nickName() == "") {
                    that.isSearch(false);
                } else {
                    that.isSearch(true);
                }
                this.GetData(that.SearchID() || Utils.Cookie.get('AccountID'));
            }
        }
        ///如果不是代理登录，就把信用额度提示信息隐藏
        if (Utils.Cookie.get('CompanyType') != 2) {
            document.getElementById("SubordinateNone").style.display = "none";
        }
        this.list = ko.observableArray();
        this.newParentID = ko.observable(params.newParentID);
        this.isMemberList = ko.observable(params.isMemberList);//isMemberList:false表示是否会员列表，如果是会员列表信息为空时，不要提示‘暂无下级’；如果是逐级往下，并无信息时，需要提示‘暂无下级’

        this.AgentID = ko.observable(params.AgentID);//代理ID
        this.AgentRatio = ko.observable(params.AgentRatio || 100);//代理占成
        this.Status = ko.observable(params.Status || 0);//  
        if (Utils.Cookie.get('CompanyType') == 2) {//如果是代理

            document.getElementById("DefaultCredit").innerHTML = Utils.Cookie.get('GetDefaultCredit') - 0;
            //document.getElementById("UsedCredit").innerHTML = Utils.Cookie.get('GetUsedCredit') - 0;

            //信用额度
            document.getElementById("HandlersName").innerHTML = Utils.Cookie.get('DevRationLable')
            document.getElementById("HandlersAccount").innerHTML = Utils.Cookie.get('AccountLoginName')



           // document.getElementById("RemainingCredit").innerHTML = Utils.Cookie.get('GetDefaultCredit') - Utils.Cookie.get('GetUsedCredit') - 0;
        }

        ///删除
        this.Delete = function ($data) {
            if (confirm("确认是否删除?")) {
                $.post("/index.php/portal/agent/DeleteMember", { superCompanyName: $data.SuperLoginName, userName: $data.LoginName, _: new Date() - 0 }, function (json) { 
                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                    } : null);
                    if (json.status) {
                        that.list.remove($data);
                    }
                });
            }

        }
        //子公司传过来的参数
        this.IsCompanySettingEditMember = ko.observable(params.IsCompanySettingEditMember);
        this.CompanyTypeName = ko.observable(params.CompanyTypeName);
        this.IsAgentEditMember = ko.observable(params.IsAgentEditMember);
        this.IsEndLevel = ko.observable(params.IsEndLevel);
        //this.CompanySettingID = ko.observable(params.CompanySettingID)
        //编辑
        this.edit = function ($data) {
            $data.history = that.history;
            if (that.IsCompanySettingEditMember()) {//子公司编辑会员
                Utils.Cookie.set('SubCreditLimit', params.CreditLimit, '', '/');
                $data.CreditLimit = params.CreditLimit;
                $data.IsCompanySettingEditMember = that.IsCompanySettingEditMember();//true;
                $data.CompanyTypeName = $data.ParentLevelName; //that.CompanyTypeName();
                $data.MemberParentID = $data.ParentID;
                $data.ParentName = $data.ParentName;

            } else if (that.IsAgentEditMember()) {//代理级别编辑会员时传参数
                $data.IsAgentEditMember = that.IsAgentEditMember();
                $data.ParentID = $data.ParentID; //params.ParentID;
                $data.AgentID = params.AgentID;
                $data.LevelName = $data.ParentLevelName; //params.LevelName;
                $data.newParentID = that.newParentID();
            } else if (that.IsEndLevel()) {
                $data.IsMemberEdit = true;
                $data.LevelName = $data.ParentLevelName; //params.LevelName;
                $data.IsEndLevel = that.IsEndLevel();
                $data.newParentID = that.newParentID();
            }
            $data.CompanyStatus = $data.MemberStatus;
            /* $data.AgentRatio = that.AgentRatio();
             $data.IsCompanySettingDirectMember = false;
             
             $data.RaionID = $data.ParentID;
            
             $data.CompanySettingLoginName = params.CompanyLoginName;
             $data.CompanyTypeName = params.CompanyTypeName || Utils.Cookie.get('RationLable') || $data.ParentName;*/
            framework.view("/index.php/portal/agent/MemberAdd", "Member/add", $data);
        }
        //强制登录
        this.login = function ($data) {
            alert("确认登录");
            window.open("/index.php/portal/agent/dologin/id/"+$data.MemberID);
        }
        this.AddSubordinate = function ($data) {
            /*
            以后没有10级。只有4级; 4级之后就跳到新增会员
            */
            if (parseInt($data.AgentLevel) + 1 == 5) {
                alert("跳到新增会员");
                return false;
            } else {
                framework.view("/index.php/portal/agent/NewSubordinateAdd", "NewSubordinate/Add", {
                    ParentName: $data.LoginName,
                    LevelID: $data.LevelID,
                    ParentID: $data.ParentID,
                    NewAgentID: $data.AgentID,
                    NewParentRatio: $data.ParentRatio,
                    NewDefaultCredit: $data.DefaultCredit,
                    LevelName: $data.LevelName,
                    AgentRatio: $data.AgentRatio,
                    IsSubordinate: true,
                    ParentLevelName: $data.ParentLevelName,
                    UsedCredit: $data.UsedCredit,
                    isAddSubordinateTbody: true,
                    history: that.history || []
                });
            }
        }
        this.SubordinateList = function ($data) {
            var id = $data.AgentID || Utils.Cookie.get('AccountID') || params.AgentID;
            that.history.push($data.ParentID);
            that.GetData(id);
        }
        //会员跳转月报表
        this.gotoMonthReport = function ($data) {
            //$data.CompanyType = 2;
            //$data.agentLevel = $data.AgentLevel;
            $data.SubSidaryID = $data.SubCompanyID;
            $data.AgentID = $data.MemberID;
            $data.isDirectMember = true;
            $data.agentLevel = $data.ParentAgentLevel;
            $data.CompanyType = $data.ParentCompanyType;
            $data.isMember = true;
            $data.isNewSubordinate = true;//表示是下级管理查询月报表
            framework.view('/index.php/portal/agent/MonthReport', 'Report/MonthReport', $data);
        }
        //设置限额
        this.SttingsQuota = function ($data) {
            framework.view("/index.php/portal/agent/SttingsQuota", "SttingsQuota/index", {
                history: that.history,
                ParentID: params.AgentID,
                MemberParentID: params.ParentID,
                AgentID: $data.MemberID, LoginName:
                    $data.LoginName,
                SuperCompanyName: $data.SuperLoginName,
                isMember: "true",
                IsAgentEditMember: that.IsAgentEditMember(),
                LevelName: params.LevelName
            });//isMember:"true"表示是会员设置限额,LevelName和IsAgentEditMember是‘返回’用，
        }
        ///修改密码
        this.changepwdSubordinate = function ($data) {
            var d = dialog({
                title: "修改密码",
                width: 360,
                content: $("#COMPANY-CHANGEPWD-Member").html(),
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
                            url: "/index.php/portal/agent/ModifyMemberPasswordByUp",
                            //data: { Edit: $data.LoginName + "|" + pwd + "|True" },
                            data: { userName: $data.LoginName, superName: $data.SuperLoginName, password: pwd, password1: repwd },
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

        //查询日志
        this.gotoLog = function ($data) {

            framework.view('/index.php/portal/agent/Logs', 'Logs/index', {
                history: that.history,
                LogName: $data.LoginName,
                CompanyID: $data.SubCompanyID,
                isNewSubordinateClick: true,
                BackID: $data.AgentLevel - 0 == 0 ? $data.SubCompanyID : $data.ParentID,
                isMemberUrl:true //表示是会员跳转
            });
        }

        this.init();
    }

    AccountList.prototype.init = function () {
        var that = this;
        that.history(that.params.history ? that.params.history() : []);
        this.GetData(that.params.AgentID || Utils.Cookie.get('AccountID'));
    };

    AccountList.prototype.GetData = function (id) {
        var that = this;
        $.ajax({
            url: "/index.php/portal/agent/GetMemberByParentID",
            data: {
                AgentID: id,
                loginName: that.loginName().replace(/(^\s*)|(\s*$)/g, ""),
                nickName: that.nickName().replace(/(^\s*)|(\s*$)/g, ""),
                isSearch: that.isSearch(),
                Status: that.Status()
            },
            cache: false,
            dataType: "json",
            success: function (json) {
                if (json.length > 0 && json[0].ParentDefaultCredit) {
                    $('#DefaultCredit').text(parseFloat(json[0].ParentDefaultCredit).toFixed(4) - 0);
                }
                 $.each(json, function(index, value) {
                        var ip = value.LastLoginIP;
                        ip = ip.split('.');
                        // ip.splice(2, 1, '*');
                        // ip.splice(3, 1, '*');
                        value.LastLoginIP = ip.join('.');
                 });
                if (that.isMemberList() == false) {
                    if (json == "") {
                        alert("暂无下级!");
                        that.back();
                        return false;
                    } else {
                        that.list(json);
                    }
                } else {
                   
                    that.list(json);
                }
            }
        });
    };

    AccountList.prototype.back = function () {
        var that = this;
        if (that.params.ParentID == undefined) {
            framework.view('/index.php/portal/agent/CompanySetting', 'CompanySetting/Index');
        }
        else {
            that.history.pop();
            framework.view('/index.php/portal/agent/NewSubordinate', 'NewSubordinate/Index', {
                AgentID: that.params.newParentID,
                history: that.params.history,
                AgentRatio: that.params.AgentRatio,
                IsEndLevel: that.params.IsEndLevel,
                Directly: that.params.Directly,//Directly是否为直属会员 
                categoryGradeAgent: 1
            });
        }
    };
    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };

});
