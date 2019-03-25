///  
/// <reference path="../_references.js" />
define(function (require, exports, module) {
    var AccountList = function (params) {
        params = params || {}; /// 从列表中带来的参数       
        var that = this;
        this.history = ko.observableArray(params.history && params.history());
        this.params = params;
        this.isLogBack = ko.observable(params.isLogBack||false)
        this.isBack = ko.observable(params.isSearch ? false : that.isLogBack() ? params.isBack : (that.history().length || Utils.Cookie.get('CompanyType') - 0 === 0));
        if (Utils.Cookie.get("CompanyType") - 0 == 1) {//公司级别

            document.getElementById("agentGrade").options.remove(0);
        } else if (Utils.Cookie.get("CompanyType") - 0 == 2) {//代理级别

            document.getElementById("agentGrade").options.remove(0);
        }
         
        //搜索级别查询
        this.loginName = ko.observable(params.loginName || '');
        this.nickName = ko.observable(params.nickName || '');
        this.SearchID = ko.observable(params.AgentID);
        this.categoryGradeAgent = ko.observable(params.categoryGradeAgent || 0);
        this.Status = ko.observable(params.Status || 0);// 只查询代理级别状态
        this.isSearch = ko.observable(params.isSearch || false);//isSearch:true表示是条件筛选
        this.SearchLevel = function () {
            that.history.removeAll();
            if (that.categoryGradeAgent() - 0 == 1)
            {
                if (that.loginName() == "" && that.nickName() == "") {
                    that.isSearch(false);
                } else {
                    that.isSearch(true);
                }
            }
            else {
                // if (that.loginName() == "" && that.nickName() == "") {
                //     Utils.tip("请输入筛选条件", false, 3000, true ? function () {
                //     } : null);
                //     return;
                // }
                that.isSearch(true);
            }
          
           
            /*0:公司;1:代理;2:会员;*/
            if (that.categoryGradeAgent() - 0 == 0) {
                framework.view("/index.php/portal/agent/CompanySetting", "CompanySetting/index", {
                    AgentID: that.SearchID() || Utils.Cookie.get('AccountID'),
                    loginName: that.loginName(),//筛选时传参数
                    nickName: that.nickName(),
                    isSearch: that.isSearch(),
                    categoryGradeAgent: that.categoryGradeAgent() - 0

                });
            } else if (that.categoryGradeAgent() - 0 == 1) {
                this.GetData(that.SearchID());
                that.isBack(false);
            } else if (that.categoryGradeAgent() - 0 == 2) {
                framework.view(
                    "/index.php/portal/agent/Member",
                    "Member/Index", {
                        AgentID: Utils.Cookie.get('AgentID') - 0,
                        IsAgentEditMember: true,//表示是代理级别编辑会员
                        IsEndLevel: that.IsEndLevel,
                        loginName: that.loginName(),//筛选时传参数
                        nickName: that.nickName(),
                        isSearch: that.isSearch(),
                        categoryGradeAgent: that.categoryGradeAgent() - 0
                    });
            }

        }
        ///如果不是代理登录，就把信用额度提示信息隐藏
        if (Utils.Cookie.get('CompanyType') != 2) {
            document.getElementById("SubordinateNone").style.display = "none";
        }
        this.list = ko.observableArray();
        this.MemberList = ko.observableArray();//会员信息
        this.AgentID = ko.observable(params.AgentID);

        this.IsClickCompanyName = ko.observable(params.IsClickCompanyName); //IsClickCompanyName为true表示是点公司名称过来的，否则是点下级管理；解决如果是点下级管理操作时，没有下级时不需要提示没有下级用户。
        this.CreditLimit = ko.observable(params.CreditLimit);//// 子公司设置的新增会员额度
        if (that.IsClickCompanyName() == true) {
            Utils.Cookie.set('SubCreditLimit', params.CreditLimit, '', '/');

        }
        if (Utils.Cookie.get('CompanyType') == 2) {//如果是代理
            document.getElementById("DefaultCredit").innerHTML = Utils.Cookie.get('GetDefaultCredit') - 0;
           // document.getElementById("UsedCredit").innerHTML = Utils.Cookie.get('GetUsedCredit') - 0;
            //信用额度
            document.getElementById("HandlersName").innerHTML = Utils.Cookie.get('DevRationLable');
            document.getElementById("HandlersAccount").innerHTML = Utils.Cookie.get('AccountLoginName');
           // document.getElementById("RemainingCredit").innerHTML = Utils.Cookie.get('GetDefaultCredit') - Utils.Cookie.get('GetUsedCredit') - 0;
        }
        /*****获取最新信用额度********************/
        this.GetAgentCreditByID = function () {
            $.ajax({
                url: "/index.php/portal/agent/GetAgentCreditByID",
                type: "post",
                success: function (json) {
                    Utils.Cookie.set('GetDefaultCredit', parseFloat(json[0].DefaultCredit), 'undefined', '/');
                  //  Utils.Cookie.set('GetUsedCredit', parseFloat(json[0].UsedCredit), 'undefined', '/');

                    document.getElementById("DefaultCredit").innerHTML = Utils.Cookie.get('GetDefaultCredit') - 0;
                 //   document.getElementById("UsedCredit").innerHTML = Utils.Cookie.get('GetUsedCredit') - 0;
                  //  document.getElementById("RemainingCredit").innerHTML = Utils.Cookie.get('GetDefaultCredit') - Utils.Cookie.get('GetUsedCredit') - 0;

                    $('#HandlersName').html(json[0].AgentLevel);
                    $('#HandlersAccount').html(json[0].AgentName);
                }
            });
        }
        this.GetAgentCreditByID();
        ///删除
        this.Delete = function ($data) {
            if (confirm("确认是否删除?")) {
                $.post("/index.php/portal/agent/DeleteChildCompany", { LoginName: $data.LoginName, _: new Date() - 0 }, function (json) { 
                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                    } : null);
                    if (json.status) {
                        if (Utils.Cookie.get('CompanyType') - 0 == 2) {
                            that.GetAgentCreditByID();
                        }

                        that.list.remove($data);
                    }
                });
            }
        }
        ///会员删除
        this.MemberDelete = function ($data) {
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
        //代理编辑
        this.edit = function ($data) {
            $data.history = that.history;
            $data.IsSubordinateEdit = true;
            // $data.NewDefaultCredit = $data.DefaultCredit;
            framework.view("/index.php/portal/agent/NewSubordinateAdd", "NewSubordinate/Add", $data);
        }
        //会员编辑
        this.MemberEdit = function ($data) {
            $data.history = that.history;
            framework.view("/index.php/portal/agent/MemberAdd", "Member/add", $data);
        }
        //代理级别查询直属会员
        this.GetAgentMemCount = function ($data) {
            that.isSearch(false);
            that.history.push($data.AgentID);
            framework.view("/index.php/portal/agent/Member", "Member/Index", {
                ParentID: $data.ParentID,
                AgentID: $data.AgentID,
                IsAgentEditMember: true,//表示是代理级别编辑会员
                LevelName: $data.LevelName,
                newParentID: $data.ParentID,//会员index页面返回时需要
                history: that.history,
                IsEndLevel: that.IsEndLevel,

                loginName: that.loginName(),//筛选时传参数
                nickName: that.nickName(),
                isSearch: that.isSearch()
            });
        }
        //代理级别新增直属会员
        this.AddAgentDirectMember = function ($data) {
            framework.view("/index.php/portal/agent/MemberAdd", "Member/add", {
                IsAgentDirectMember: true,
                RaionID: $data.AgentID,
                LevelName: $data.LevelName,
                AgentLoginName: $data.LoginName,
                newDefaultCredit: $data.DefaultCredit,
                UsedCredit: $data.UsedCredit,
                ParentID: $data.ParentID,
                history: that.history || []
            });
        }
        //新增下级
        this.AddSubordinate = function ($data) {
            if (parseInt($data.AgentLevel) + 1 == 6) {
                framework.view("/index.php/portal/agent/MemberAdd", "Member/add", { AgentLoginName: $data.LoginName, ParentID: $data.ParentID, DefaultCredit: $data.DefaultCredit, UsedCredit: $data.UsedCredit, IsMember: true, history: that.history || [] });
            } else {
                framework.view("/index.php/portal/agent/NewSubordinateAdd", "NewSubordinate/Add", {
                    ParentName: $data.LoginName,
                    LevelID: $data.LevelID,
                    ParentID: $data.ParentID,
                    NewAgentID: $data.AgentID,
                    NewParentRatio: $data.ParentRatio,
                    //NewDefaultCredit: $data.DefaultCredit,
                    DefaultCredit: $data.DefaultCredit,
                    LevelName: $data.LevelName,
                    AgentRatio: $data.AgentRatio,
                    IsSubordinate: true,
                    ParentLevelName: $data.ParentLevelName,
                    UsedCredit: $data.UsedCredit,
                    //isAddSubordinateTbody: true,
                    history: that.history || []
                });
            }
        }
        //账号连接
        this.SubordinateList = function ($data) {

            that.isSearch(false).isBack(true);
            if ($data.IsEndLevel) {//如果是最后一级
                that.history.push($data.ParentID);
                framework.view("/index.php/portal/agent/Member", "Member/index", {
                    LevelName: $data.LevelName,
                    newParentID: $data.ParentID,
                    ParentID: $data.ParentID,
                    AgentID: $data.AgentID,
                    history: that.history,
                    IsEndLevel: $data.IsEndLevel,
                    AgentRatio: $data.AgentRatio,
                    isMemberList: false,
                    CompanyLoginName: $data.LoginName,
                    IsAgentEditMember: true,
                    categoryGradeAgent: 2
                });
            } else {
                var id = $data.AgentID || Utils.Cookie.get('AccountID') || params.AgentID;
                that.SearchID($data.AgentID);
                that.history.push($data.ParentID);
                that.GetData(id);
            }
        }
        //设置限额
        this.SttingsQuota = function ($data) {
            var data = $data;
            data.history = that.history || [];
            framework.view("/index.php/portal/agent/SttingsQuota", "SttingsQuota/index", $data);
        }
        //跳转月报表
        this.gotoMonthReport = function ($data) {
            $data.CompanyType = 2;
            $data.agentLevel = $data.AgentLevel;
            $data.SubSidaryID = $data.SubCompanyID;
            $data.isNewSubordinate = true;//表示是下级管理查询月报表
            $data.IsEndLevel = $data.IsEndLevel; //如果是true，表示最后等级，;
            //if (Utils.Cookie.get('CompanyType') - 0 == 0) {
            //     $data.AgentID = $data.SubCompanyID;
            //}            
            //Utils.Cookie.set('IsAgentCompanyType', 2, '', '/');//如果是代理跳转月报
            framework.view('/index.php/portal/agent/MonthReport', 'Report/MonthReport', $data);
        }
        //会员设置限额
        this.MemberSttingsQuota = function ($data) {
            var param = { history: that.history, ParentID: params.AgentID || $data.ParentID, MemberParentID: params.ParentID, AgentID: $data.MemberID, LoginName: $data.LoginName, SuperCompanyName: $data.SuperLoginName, isMember: "true" };
            framework.view("/index.php/portal/agent/SttingsQuota", "SttingsQuota/index", param);//isMember:"true"表示是会员设置限额
        }
        ///修改密码
        this.changepwdSubordinate = function ($data) {
            var d = dialog({
                title: "修改密码",
                width: 360,
                content: $("#COMPANY-CHANGEPWD-Subordinate").html(),
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

                            } : null); return false;
                        } else if (repwd === "") {
                            Utils.tip('重复密码不能为空', false, 3000, true ? function () {

                            } : null); return false;
                        }
                        else if (pwd !== repwd) {
                            Utils.tip('两次密码不一致', false, 3000, true ? function () {

                            } : null); return false;
                        }
                        $.ajax({
                            url: "/index.php/portal/agent/EditLoginPwd",
                            data: { Edit: $data.LoginName + "|" + pwd + "|True" },
                            type: "post",
                            success: function (json) {
                                if (json.status == true) { 
                                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                                    } : null);
                                    json.status && setTimeout(function () {
                                        d.close();
                                    }, 2000);
                                } else { 
                                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                                    } : null);
                                    return false;
                                }
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

        ///会员修改密码
        this.MemberChangepwdSubordinate = function ($data) {
            var d = dialog({
                title: "修改密码",
                width: 360,
                content: $("#COMPANY-CHANGEPWD-Subordinate").html(),
                button: [{
                    value: '确认修改',
                    callback: function () {
                        var dom = $(this.node);
                        var pwd = dom.find("input[name=pwd]").val();
                        var repwd = dom.find("input[name=repwd]").val();
                        if (pwd === "") {
                            Utils.dialogStatus(d, "密码不能为空");
                            return false;
                        } else if (!/(\d+[a-z]+)|([a-z]+\d+)/i.test(pwd)) {
                            Utils.dialogStatus(d, "密码必须包含字母和数字"); return false;
                        } else if (!/^[\da-zA-Z]{8,15}$/i.test(pwd)) {
                            Utils.dialogStatus(d, "密码的长度必须在8-15位之间,并且包含字母和数字"); return false;
                        } else if (repwd === "") {
                            Utils.dialogStatus(d, "重复密码不能为空"); return false;
                        }
                        else if (pwd !== repwd) {
                            Utils.dialogStatus(d, "两次密码不一致"); return false;
                        }
                        $.ajax({
                            url: "/index.php/portal/agent/ModifyMemberPasswordByUp",
                            data: { userName: $data.LoginName, superName: $data.SuperLoginName, password: pwd, password1: repwd },
                            type: "post",
                            success: function (json) {
                                if (json.status == true) {
                                     
                                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                                    } : null);
                                    Utils.dialogStatus(d, json.info, json.status);
                                    json.status && setTimeout(function () {
                                        d.close();
                                    }, 2000);
                                } else {
                                    
                                    Utils.tip(json.info, json.status, 3000, json.status ? function () {

                                    } : null);
                                    return false;
                                }
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
                CompanyID: $data.AgentID,
                isNewSubordinateClick: true,
                BackID: $data.AgentLevel -0 == 0 ? $data.SubCompanyID: $data.ParentID
            });
        }
        //公司查看代理级别的拦货金额日志
        this.LimitStoreLog = function (data, event) {
            
            framework.view('/index.php/portal/agent/LimitStoreLog', 'Logs/LimitStoreLog', {
                history: that.history,
                BackID: data.AgentLevel - 0 == 0 ? data.SubCompanyID: data.ParentID,
                AgentID: data.AgentID,
                isNewSubordinateClick: true,
                isBack:that.isBack()
            });
        }
        
        this.init();
    }

    AccountList.prototype.init = function () {
        var that = this;
        var ID = 0;
        var type = Utils.Cookie.get('CompanyType') - 0;
        if (that.params.AgentID != undefined) { //表示是加载
            ID = that.params.AgentID;
        }
        that.history(that.params.history ? that.params.history() : []);
        this.GetData(ID);
    };

    AccountList.prototype.GetData = function (id) {
        if (typeof id === 'undefined' || id === 0) {
            id = Utils.Cookie.get('AccountID');
        }
        var that = this;

        var postUrl = "";
        var isGetLowManage = false;

        if (Utils.Cookie.get('isAgentLevel') == 10) {//如果是最后一层：代理
            postUrl = "/index.php/portal/agent/GetMemberByParentID";
            //代理信息隐藏
            $('#AgentHandle').hide();
            $('#CompanyStatus').hide();
            $('#AgnRatio').hide();
            $('#HrefLginName').hide();
            $('#TDRatio').hide();

        } else {
            postUrl = "/index.php/portal/agent/GetLowManageList";
            //会员信息隐藏
            $('#MemberStatus').hide();
            $('#MemberLoginName').hide();
            $('#labMember').hide();
            $('#MemberStatus').hide();
            $('#MemberHandle').hide();
            isGetLowManage = true;
        }
        $.ajax({
            url: postUrl,
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
                // console.log('NewSubordinate.js', postUrl);
                // if (isGetLowManage && json.length > 0 && json[0].ParentCredit) {
                //     $('#DefaultCredit').text(parseFloat(json[0].ParentCredit).toFixed(4) - 0);
                // }
                // if (json.length > 0 && json[0].ParentDefaultCredit) {
                //     $('#DefaultCredit').text(parseFloat(json[0].ParentDefaultCredit).toFixed(4) - 0);
                // }
                $.each(json, function (index, value) {
                    var ip = value.LastLoginIP;
                    ip = ip.split('.');
                    // ip.splice(2, 1, '*');
                    // ip.splice(3, 1, '*');
                    value.LastLoginIP = ip.join('.');

                    if (typeof value.MemberStatus === 'undefined') {
                        value.MemberStatus = '-1';
                    }
                    if (typeof value.LevelName === 'undefined') {
                        value.LevelName = ' ';
                    }
                    if (typeof value.ParentLevelName === 'undefined') {
                        value.ParentLevelName = ' ';
                    }
                    if (typeof value.ParentRatio === 'undefined') {
                        value.ParentRatio = ' ';
                    }
                    if (typeof value.BaseRatio === 'undefined') {
                        value.BaseRatio = ' ';
                    }
                    if (typeof value.AgentRatio === 'undefined') {
                        value.AgentRatio = ' ';
                    }
                });
                that.isBack(that.isBack());
                that.list(json);
            }
        });
    };

    AccountList.prototype.back = function () {
        var
            that = this,
            params;
        if (that.history().length) {
            params = that.history.pop();
            that.SearchID(params);
            that.GetData(params);
        }
        else {            
            //如果是总公司就跳转
            that.isSearch(false);
            if (Utils.Cookie.get('CompanyType') -0 === 0) {
                framework.view('/index.php/portal/agent/CompanySetting', '/Scripts/Default/companysetting/index');
            }           
           
        }
        if (!that.history().length && !(Utils.Cookie.get('CompanyType') - 0 === 0)) {
            that.isBack(false);
        }
    };
    exports.viewmodel = AccountList;

    exports.highlight = function () {
        this.target.parent().addClass("active").siblings(".active").removeClass("active");
    };

});
