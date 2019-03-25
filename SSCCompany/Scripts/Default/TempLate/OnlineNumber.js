///在线人数 
define(function (require, exports, module) {
    var OnlineNumber = function (params) {
        params = params || {};
        var that = this;
        this.params = params;
        //this.list = ko.observableArray();
        //this.listTwo = ko.observableArray();
        this.countNumber = ko.observable(0);//在线总人数
        this.managementNumber=ko.observable(0);//管理级别，在线总人数
        this.menberNumber=ko.observable(0);//会员级别，在线总人数
         
        this.onlineNameManagement = ko.observable();
        this.onlineNameMumber = ko.observable();
        this.GetData();
    }
    OnlineNumber.prototype.GetData = function (betTypeID) {

        var that = this;
        if (betTypeID == undefined) {
            betTypeID = 1;
        }
        $.ajax({
            url: "/index.php/portal/agent/GetAllOnlineUser",
            cache: false,
            dataType: "json",
            success: function (json) {
                if (json != null) {
                    var onlineManagement = "",
                        onlineMumber = "",
                        managementCount = 0,
                        mumberCount = 0;
                    var arrMana = [], arrMember = [];
                    that.countNumber(json.CmdObject.length);
                    for (var i = 0; i < json.CmdObject.length; i++) {
                        if (json.CmdObject[i].AccountType - 0 == 2) {/* SysAdmin = 0,  CompanyAdmin = 1, Member = 2,*/
                            if (mumberCount == 20) {
                                mumberCount = 0;
                            }
                            mumberCount += 1;
                            onlineMumber += json.CmdObject[i].LoginName + "," + (mumberCount == 20 ? "<br/>" : "");
                            arrMember.push(json.CmdObject[i].LoginName);
                        } else {
                            if (managementCount == 20) {
                                managementCount = 0;
                            }
                            managementCount += 1;
                            onlineManagement += json.CmdObject[i].LoginName + "," + (managementCount == 20 ? "<br/>" : "");
                            arrMana.push(json.CmdObject[i].LoginName);
                        }

                    }
                    var len = onlineManagement.length - 0;
                    that.managementNumber(arrMana.length);
                    that.onlineNameManagement(onlineManagement.substring(0, len - 1));

                    var len = onlineMumber.length - 0;
                    that.menberNumber(arrMember.length);
                    that.onlineNameMumber(onlineMumber.substring(0, len - 1));
                }
            }
        }); 

    }
    exports.viewmodel = OnlineNumber;
});