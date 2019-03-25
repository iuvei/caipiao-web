/// 公司设置-等级管理
// <reference path="../_ref.js" />
/// <reference path="../utils.js" />
define(function (require, exports, module) {
    var Level = function (params) {
        params = params || {};
        var that = this;
        this.params = params;
        this.list = ko.observableArray();
        this.isChangeList = ko.observableArray();
        this.ID = ko.observable(this.params.ID);
        this.CompanyID = ko.observable(this.params.ID);
        this.LoginName = ko.observable(this.params.LoginName);
        this.SaveAndNext = ko.observable(this.params.SaveAndNext || 'False');
        this.change = function (data, event) {
            var list = that.list(),
                length = list.length,
                i = data.AgentLevel;
            if (!data.IsEnable()) {
                for (var i = data.AgentLevel + 1; i < length; i++) {
                    list[i].IsEnable(false).IsDisabled(true);
                }
            }
            else {
                list[data.AgentLevel + 1] && list[data.AgentLevel + 1].IsDisabled(false);
            }
        };


        //保存下一步和编辑的状态判断
        this.CompanyName = ko.observable(params.CompanyName);
        this.AddorEdit = ko.observable(this.params.AddorEdit);
        this.SaveAndNext = ko.observable("False");

        if (this.AddorEdit() !== "Add") {
            $("#BTSAVE").val("保存");
            document.getElementById("Next").style.display = "none";// $("#Next").attr("hidden", true);
        }

        this.GetAgentLevel = function (t) {
            switch (t - 0) {
                case 0:
                case 1:
                case 2:
                case 3:
                    return true;
                default:
                    return false;
            }
        }


        ///保存并下一页
        this.Next = function ($form) {
            this.SaveAndNext("True");
            this.sub($form)
        }
        this.result = ko.observable(false);
        this.IsModified = function (list)/*判断数据是否有修改*/ {
            var result = that.result();//初始化返回值 

            //获取输入框控件
            for (var i = 0; i < list.length; i++) {
                if (list[i].changeLevelName != list[i].LevelName || list[i].changeIsEnable != list[i].IsEnable()) //判断输入的值是否等于初始值
                {
                    result = true;//如果不相等，返回true，表示已经修改 
                }
            }
            return result;
        }

        this.leName = ko.observable();
        ///提交信息
        this.sub = function ($form) {
            var that = this;
            var arr = [];
            //var PutList = $("#LIST").children("tr"); 
            var list = that.list();
            var IsEdit = false;

            if (that.IsModified(list)) {/*判断数据是否有修改*/
                for (var i = 0, len = list.length; i < len; i++) {
                    var data = list[i];
                    if ($.trim(data.LevelName) === "" && data.IsEnable()) { 
                        Utils.tip('等级' + (i + 1) + '中的等级名称不能为空', false, 3000, true ? function () {

                        } : null);
                        return;
                    } else {
                        arr.push({
                            LevelName: data.LevelName,
                            IsEnable: data.IsEnable(),
                            AgentLevel: data.AgentLevel,
                            ID: data.ID,
                            CompanyID: data.CompanyID,
                            CompanyName: data.LoginName
                        });
                    }
                }
            }
            if (arr.length === 0) {
                if (that.result() == true) { 
                    Utils.tip('没有做任何操作', false, 3000, true ? function () {

                    } : null);
                    return;
                } else if (that.SaveAndNext() == "True") {
                    var BasicData = { ID: that.ID(), AddorEdit: that.AddorEdit(), CompanyName: that.CompanyName() }
                    framework.view("/index.php/portal/agent/Website", "CompanySetting/Website", BasicData);

                } else if (this.AddorEdit() !== "Add") {
                    var status = true;
                    return Utils.tip("没有做任何操作", false, 3000,status ? function () {
                       
                    } : null);
                    framework.view("/index.php/portal/agent/CompanySetting", "CompanySetting/index");
                }
            }
            else {
                IsEdit = true;
            }
            if (IsEdit) {
                $.post("/index.php/portal/agent/EditLevel",
                    { TestList: JSON.stringify(arr), CompanyName: that.CompanyName() },
                    function (json) {
                        if (!json.status) { 
                            Utils.tip(json.info, json.status, 3000, json.status ? function () {

                            } : null);
                        }
                        else if (that.SaveAndNext() != "True") {
                            Utils.tip(json.info, json.status,3000, json.status ? function () {
                               
                            } : null);
                            $.each(list, function (index, value) {
                                value.changeLevelName = value.LevelName;//存储初始数据
                                value.changeIsEnable = value.IsEnable;
                            });
                            that.result(false);//修改成功后，初始新数据
                            framework.view("/index.php/portal/agent/CompanySetting", "CompanySetting/Index");
                        } else if (that.SaveAndNext() == "True") {
                            $.each(list, function (index, value) {
                                value.changeLevelName = value.LevelName;//存储初始数据
                                value.changeIsEnable = value.IsEnable;
                            });
                            that.result(false);//修改成功后，初始新数据
                            if (json.status) {
                                if (that.SaveAndNext() == "True") {
                                    var BasicData = { ID: that.ID(), AddorEdit: that.AddorEdit(), CompanyName: that.CompanyName() }
                                    framework.view("/index.php/portal/agent/Website", "CompanySetting/Website", BasicData);
                                }
                                else
                                    framework.view("/index.php/portal/agent/CompanySetting", "CompanySetting/index");
                            }
                        }

                    })
            }
        }

        this.changeStatus = function ($data, event) {
            var tr = $(event.target).parents("tr");
            if (event.target.value === 'False') {
                tr.nextAll().removeClass('active').each(function () {
                    $(this).find("select").val('False');
                    $(this).find("input,select").attr("disabled", "disabled");
                });
            } else {
                tr.find("input,select").removeAttr("disabled");
                tr.next().addClass('active').find("select").removeAttr("disabled");
            }
        }

        //获取数据
        this.GetData();

    }
    Level.prototype.GetData = function () {
        var that = this;
        $.ajax({
            url: "/index.php/portal/agent/GetCompanyLevel",
            data: { CompanyID: that.CompanyID },
            dataType: "json",
            success: function (json) {
                var flags,
                    count = 0;
                $.each(json, function (a, b) {
                    b.accountStatus = ko.observableArray([{ name: "启用", value: true }, { name: "禁用", value: false }]);
                    if (!b.IsEnable) { count++; }
                    b.changeLevelName = b.LevelName;//存储初始数据
                    b.changeIsEnable = b.IsEnable;
                    b.IsDisabled = ko.observable(!b.IsEnable);
                    b.IsEnable = ko.observable(b.IsEnable);
                });

                //如果所有都是禁用，需要把最高一级开启，暂时写死
                if (count === 6) {
                    json[4].IsDisabled(false);
                }
                else {
                    //否则就将最近启用的一级的下一级开启
                    for (var i = 4, len = json.length; i < len; i++) {
                        if (json[i].IsEnable()) {
                            json[i].IsDisabled(true);
                            flags = i + 1;
                        }
                    }
                    json[flags] && json[flags].IsDisabled(false);
                }
                that.list(json);
                var actives = $("#LIST").children('.active');
            }
        });
    }
    exports.viewmodel = Level;
});