// 一字定
/// <reference path="../_references.js" />

define(function (require, exports, module) {

	var OneFixEnum = {
		t20: '口XXX',
		t21: 'X口XX',
		t22: 'XX口X',
		t23: 'XXX口',
		t24: 'XXXX口'
	};

	// 下注多选类型
	var actions = {
		'single': '1',
		'double': '2',
		'big': '3',
		'little': '4' 
	}
	var FixOne = function (param) {
		var that = this;
		this.selectList = [];
		this.Count = ko.observable(0);
		this.Money = ko.observable(0).extend({ limit: { range: [0], fix: 4 } });// ko.observable(0);//下注了多少金额
		this.AllMoney = ko.observable(0);//统计一共使用多少金额
		this.MaxLimitItemBet = ko.observable(0);///单项上限
        this.MaxLimitSigleBet = ko.observable(0);///单注上限
        this.MinLimitBetAmount = ko.observable(0);///最小下注金额
        this.SecondStopEarly = 0;
        
        this.PeriodsID = Utils.Cookie.get('PeriodsID');
        this.PeriodsStatus = Utils.Cookie.get('PeriodsStatus');

		this.modelTpl = ko.observable("oneFix");
		this.t20 = ko.observableArray();
		this.t21 = ko.observableArray();
		this.t22 = ko.observableArray();
		this.t23 = ko.observableArray();
		this.t24 = ko.observableArray();


		// 获取停止下注时间
        this.getStopTime = function (callback) {
            var StopTime = Utils.Cookie.get("StopTime");
            if (StopTime != null) {
                that.SecondStopEarly = StopTime;
                return;
            }
            $.ajax({
                url: "/index.php/Portal/FixTwo/GetStopTime",
                success: function (data) {
                    Utils.Cookie.set("StopTime", data.StopTime, 0, "/");
                    that.SecondStopEarly = data.StopTime;
                }
			});
        }
        this.getStopTime();


		// 多选
		this.multiple = function (data, event) {
			var target = $(event.target);
			var ActionType = target.attr('data-role');
			if (ActionType) {
				var BetType = target.parent().attr('data-type');
				var type = !target.hasClass('select') ? (target.addClass('select'), 'add') : (target.removeClass('select'), 'remove');
				// 获取多选结果
				var result = this.getSelectionItems(ActionType, BetType);
				var except = [];
				if(type == 'remove'){
					$('.' + BetType + ' .operator div').each(function(index, item){
						if(item.className.indexOf('select') != -1) {
							except = except.concat(that.getSelectionItems(item.getAttribute('data-role'), BetType));
						}
					})
				}
				result.forEach(function (BetNumber) {
					type === 'add' ? that.addItemByBetNumber(BetNumber, BetType) : except.indexOf(BetNumber) === -1 && that.removeItem(BetNumber)
				})
			}
		}

		// 根据下注号码，添加到选择列表
		this.addItemByBetNumber = function (BetNumber, BetType) {
			var item = that[BetType]() && that[BetType]().filter(function (item) {
				return item.title == BetNumber
			})[0];

			if(item) {
				this.addItem(item)
			}
		}
		// 选择项目
		this.checked = function (data, event) {
			var target = event.target;
			if(target.tagName === 'TD'){
				target = event.target.parentNode
			}

			if($(target).hasClass('yellow')){
				that.removeItem(data.title)
			}else{
				that.addItem(data)
			}
		}

		// 添加下注项目
		this.addItem = function (data) {

			if(this.selectList.filter(function (item) {
				return item.BetNumber === data.title
			}).length === 0) {
				this.selectList.push({
					BetNumber: data.title,
					BetType: data.BetType,
					Odds: data.Odds
				});

				$('[data-title="' + data.title + '"]').addClass('yellow')
				this.Count(this.selectList.length)
				this.AllMoney(this.selectList.length * +this.Money())
			}
		}

		// 删除下注项目
		this.removeItem = function(BetNumber) {
			for(var i = 0; i< this.selectList.length;i++) {
				if(this.selectList[i].BetNumber === BetNumber){
					this.selectList.splice(i, 1)
					break;
				}
			}
			$('[data-title="' + BetNumber + '"]').removeClass('yellow')
			this.Count(this.selectList.length)
			this.AllMoney(this.selectList.length * this.Money())
		}
		// 下注
		this.submit = function () {
			
			this.selectList.map(function(item){
				item.BetAmt = that.Money();
			})
			var subflage = true;
	        var error = "非法数据"
	        var subarr = [];
	        function setFocus() {
	            var money = $('#Money');

	            setTimeout(function () {
	                money.blur();
	                setTimeout(function () {
	                    money.focus();
	                }, 500);
	            }, 0);
	        }

	        //下注额度不能大于可用额度
	        if (that.Money() - 0 > document.getElementById("DefaultCredit").innerText - 0) {
				
				return Utils.tip('信用额度不足', false, true ? function () {} : null);
	        }

            if (that.Money() === "" || that.Money() === "0" || that.Money() === 0) {
                subflage = false;
                error = "下注金额不能为0";
            }
            ////获取离二字定封多少分钟内禁止下注 start
            var StopTime = that.SecondStopEarly;
            if (framework._extend.currentCloseMinute < StopTime - 0) {
                subflage = false;
                error = "离封盘" + StopTime + "分钟内不能下注";
            }
            //// 获取离二字定封多少分钟内禁止下注end
            if (that.PeriodsID == 0 || that.PeriodsStatus == 0 || typeof that.PeriodsStatus == "undefined" || that.PeriodsStatus == null) {
                subflage = false;
                error = "最近没有开盘期数，不能下注";
            }
            if (subflage) {
                if (that.selectList.length > 0) {
                    $.post("/index.php/Portal/FixOne/SetMemberBet",
                        {
                            listbet: JSON.stringify(that.selectList)
                        },
                        function (json) {
                            $('#Money').blur();
                            if (!json.status && json.info.indexOf("重新登录") > -1) {
                                if (window.confirm(json.info)) {
                                     window.location.href = "/index.php/Index/login";
                                    return;
                                }
                            }
                            //Utils.tip(json.info, json.status, function () { });
                            if (json.status) {
                                Utils.sound.play();
                            }
                            else {
                                Utils.tip(json.info, false);
                                if (json.info.indexOf("无效期数数据") > -1) {
                                    if (framework.periods && $.isFunction(framework.periods.main)) {
                                        framework.periods.main();
                                    }
                                }
                                return;
                            }
                            //var subUseCredit = that.Money() * subarr.length;
                            //framework._extend.calcCredit(subUseCredit);
                            /*刷新左边已用和可用金额:拿成功返回的最新额度*/
                            if (json.CmdObject != false) {
                                document.getElementById("DefaultCredit").innerHTML = parseFloat(json.CmdObject.Credit).toFixed(4) - 0;//总信用额度
                                //document.getElementById("UsedCredit").innerHTML = parseFloat(json.CmdObject.UsedCredit).toFixed(4) - 0;//已用额度
                                //document.getElementById("RemainingUndrawn").innerHTML = (json.CmdObject.Credit - json.CmdObject.UsedCredit).toFixed(4) - 0; //parseFloat(json.CmdObject.Credit).toFixed(4) - 0 - parseFloat(json.CmdObject.UsedCredit).toFixed(4) - 0;
                                framework._extend.getBetInfoForLeftInfo();
                            }

                            that.reset();

                            if (json.isStopNum - 0 == 55) {//StopBetItem = 55表示是押停号码
                                framework.view("/index.php/Portal/FastBeat/Index", "BetPanel/FastBeat/Index");
                            }

                        });
                }
                else {
                    Utils.tip("没有选择下注号码", false, setFocus, 2000)
                }
            }
            else {
                Utils.tip(error, false, setFocus, 2000)
            }
		}
		this.init()
	}
	

	// 初始化页面
	FixOne.prototype.init = function () {
		var me = this;
		
		$.ajax({
            url: '/index.php/Portal/FixOne/GetFixOneOddsInfo',
            cache: false,
            dataType: 'json',
            success: function (data) {
            	var types = [];
            	var hot = [];

            	// 区分类型
            	data.forEach( function (item) {
            		if (item.IsMaster) {
            			types.push(item)
            		} else { 
            			hot.push(item)
            		}
            	})

            	// 填充数据
            	for(var j = 0; j < types.length; j++) {
            		var type = types[j];
            		var result = [];

            		for (var i = 0; i < 10; i++) {
            			!function(j, i){
            				var number = OneFixEnum['t' + type.BetType].replace('口', i);
		            		var currentData;

		            		hot.length > 0 && hot.forEach( function (hot) {
		            			if(hot.BetItem === number) {
		            				currentData = hot;
		            			}
		            		})

		            		!currentData && (currentData = type);
		            		currentData.title = number;
		            		result.push(JSON.parse(JSON.stringify(currentData)));
			            }(j, i)
	            	}

	            	me['t' + type.BetType](result)
	            }
			}
	    });
	}

	
	FixOne.prototype.reset = function () {
		// 清理自身数据
		this.Count(0);
        this.AllMoney(0);
        this.Money('');

		// 清除选中数据
		this.selectList = [];
		// 压住号码除色
		$('.tblock .yellow').removeClass('yellow');
		// 多选按钮除色
		$('.tblock .select').removeClass('select');
	}

	// 计算总金额
	FixOne.prototype.countMoney = function () {
		this.AllMoney(this.selectList.length * this.Money())
	}

	// 回车时；查询统计所有金额并提交下注信息
	FixOne.prototype.disableEnterFixTwo = function (data, event) {
		var that = this;
		var keyCodeval = event.keyCode - 0;
        //keyCode val=9 Tab键；keyCode val==13回车键
        if (keyCodeval == 13) {
           	that.countMoney();
            that.submit();
        }
        return true;
	}
	// 默认选中金额
	FixOne.prototype.getMoney = function () {
		 $("#Money").select();
	}
	// 多选,获取需要被选中的类目
	FixOne.prototype.getSelectionItems = function (actionType, BetType) {
		var result = [];
		var selectedIndex = [];
		// 获取下注类型模板
		var template = OneFixEnum[BetType];

		if(!template) {
			return [];
		}
		switch(actionType) {
			case actions.single:
				selectedIndex = [1, 3, 5, 7, 9]
				break;
			case actions.double:
				selectedIndex = [0, 2, 4, 6, 8]
				break;
			case actions.big:
				selectedIndex = [5, 6, 7, 8, 9]
				break;
			case actions.little:
				selectedIndex = [0, 1, 2, ,3, 4]
				break;
		}

		selectedIndex.forEach(function (item) {
			result.push(template.replace('口', item))
		})

		return result
	}

	exports.viewmodel = FixOne;
})