var _Obj={
	ActivityConfig:0,
	isHtml:''
};
var msgLoading='<div class="winningListLoading" style="padding:0 !important;">\
				<img src="'+_Path.Host.img+'/system/common/loadding/winningList.gif" alt="">\
				<h5>鍔犲璁＄畻涓�</h5>\
				<p>棰勮00:20寮€鏀鹃鍙栵紝璇风◢鍊�...</p>\
			</div>';
// 灞忓箷婊氬姩浣嶇疆
function getWinTop(Offset){
	$("html,body").animate({scrollTop:Offset},200);
}
// 鑾峰彇鐘舵€�
function getState(Name,Dom,_Obj,fun){
	var ajaxData = {
			Action: "GetActivityStateData"
		};
		ajaxData.Qort = Name;
		$.ajax({
			load:true,
			data: ajaxData,
			success: function(data) {
				if(data.Code===1){
					var msg=data.StrCode;
					var rg="璁＄畻涓�";
					if(msg.indexOf(rg)!=-1){
						Dom.removeClass("Not");
						layer.alert(msgLoading);
					}else{
						fun(data.BackData)						
					}
				}else if(data.Code===0){
					fun({unLogin:1})
				}else{
					layer.msgWarn(data.StrCode);
				}
			}
		})
}
//娲诲姩鍐呭娓叉煋
function getActivity(Type,Name,Dom,fun){
	var xhtml="";
	var isHtml=false;
	var _Obj={
		isYTD:0,
		isBonus:0,
		isState:0
	}
	switch(Type){
		case 0:
			xhtml='';
			fun();
		break;
		case 1:
			if(Name=="姣忔棩鍔犲"){
				getState(Name,Dom,_Obj,function(returnData){					
					getRenData(['RewardData'],function(data){
						if(data&&data!=undefined){
							var Data=data.RewardData;
							var xH='';
							var xData=Data[0].Title;
							var $hDom=$(".floorDetail");
							for(var i in xData){
								xH+='<th>'+xData[i]+'</th>'
							}
							//
							var isArr=['<h3>姣忔棩鍔犲<i></i></h3>\
								<em>鏄ㄦ棩鎶曟敞锛�<i class="isYTD">0</i></em>\
								<em>褰撳墠绛夌骇锛�<i class="isVIP">鏃 </i></em>\
								<em>鍔犲姣斾緥锛�<i class="isBili">0</i></em>\
								<em>鍙緱鍔犲锛�<i class="isBonus">0</i></em>\
								<a href="javascript:;" class="getBtn disable">涓嶅彲棰嗗彇</a>\
								<h3>鍔犲姣斾緥<i></i></h3>\
								<table width="60%"><tr>\
										<th class="tbplus">\
											<i>绛夌骇</i>\
											<ins></ins>\
											<em>鏄ㄦ棩鎶曟敞</em>\
										</th>'+xH+'\
									</tr>']
								$.each(Data,function(i,xObj){
									var xO='';
									var xRew=xObj.Rewards;
									for(var i in xRew){
										xO+='<td>'+xRew[i]+'</td>';
									}
									isArr.push('<tr>\
									<td>'+xObj.Grade+'</td>'+xO+'\
								</tr>');
								})

							isArr.push('</table><h3>娲诲姩璇存槑<i></i></h3>')
							xhtml=isArr.join('');
							Dom.html(xhtml);
							Dom.attr("data-key","true");
							if (!UserName) {
								Dom.find(".getBtn").text('鏈櫥褰�');
								$hDom.find("em:eq(1)").hide();
								$hDom.find("em:eq(2)").hide();
								fun();
							}else{
								var isTxt="涓嶅彲棰嗗彇";
								var theStr=returnData.State;
								if(theStr=="0"){
									isTxt="绔嬪嵆棰嗗彇"
								}else if(theStr=="1"){
									isTxt="宸查鍙�"
								};
								Dom.find(".getBtn").text(isTxt).removeClass(returnData.State=="0"?"disable":"");
								Dom.find(".isYTD").text(returnData.YesterdayBet);
								Dom.find(".isBili").text(returnData.BonusRate==null?"":(Number(returnData.BonusRate).toFixed(1)+'%'));
								Dom.find(".isVIP").text(returnData.UserGrade==null?"":'VIP'+returnData.UserGrade);
								Dom.find(".isBonus").text(returnData.Bonus);
								_Obj.isShow=true;
								fun();
							}

						}
					});
				});
			}else if(Name=="鏅嬬骇濂栧姳"){
				// isHtml=false;
				var _Obj={
					GradeList:0,
					GradeBonu:0
				},
				isStar=[0,0];
				getRenData(['UserUpGradeBonus','GradeList'],function(data){
					if(data){
						var isGradeList=data.GradeList;
						var isGradeBonus=data.UserUpGradeBonus;
						var thehtml=[];
						var isShow=0;
						if(isGradeBonus!=undefined){
							_Obj.GradeBonu=data.UserUpGradeBonus;
							switch(_Obj.GradeBonu.Grade){
								case "1":
								case "2":
								case "3":
								case "4":
								case "5":
								case "6":
								case "7":
								case "8":
								case "9":
								_Obj.GradeBonu.Grade="VIP"+_Obj.GradeBonu.Grade;
								break;
								default:
								break;
							}
							isStar[0]=1;
						};
						if(isGradeList!=undefined&&data.GradeList){
							var returnData=data.GradeList;
							isStar[1]=1;
							if(isStar[1]){
								var isArr=['<h3>鏅嬬骇濂栧姳<i></i></h3>\
								<em>褰撳墠绛夌骇锛�<i class="DomNum">鏃 </i></em>\
								<em>鏅嬬骇濂栧姳锛�<i class="GetNum">0</i></em>\
								<a href="javascript:;" class="getBtn disable">涓嶅彲棰嗗彇</a>\
								<h3>鏅嬬骇鏈哄埗<i></i></h3><table width="60%" style="table-layout: fixed;"><tr>\
										<th>绛夌骇</th>\
										<th>澶磋</th>\
										<th>鎴愰暱绉垎</th>\
										<th>鏅嬬骇濂栧姳(鍏�)</th>\
										<th>璺崇骇濂栧姳(鍏�)</th>\
									</tr>'];
								$.each(data.GradeList,function(i,Obj){
									isArr.push('<tr>\
										<td>VIP'+Obj.Grade+'</td>\
										<td>'+Obj.GradeName+'</td>\
										<td>'+Obj.GradeGrow+'</td>\
										<td>'+Obj.Bonus+'</td>\
										<td>'+Obj.JumpBonus+'</td>\
									</tr>');
								})
								isArr.push('</table><h3>娲诲姩璇存槑<i></i></h3>');
								Dom.html(isArr.join(''));
							}

						}
						var num=1;
						if(!UserName){
							$(".getBtn").text("鏈櫥褰�");
							fun();
						}
						for(var i=0;i<isStar.length;i++){
							if(isStar[i]==0){
								return false;
							}
						}
						if(num){
							getInDom(Dom,_Obj);
							fun();
						}
					}
				});
			}else if(Name=="褰╃浜夐湼"){
				fun();
			}
		break;
	}
}
function getInDom(Dom,_Obj){
	if(!UserName){
		Dom.find(".getBtn").text('鏈櫥褰�');
	}else{
		var isText="涓嶅彲棰嗗彇";
		var isState=_Obj.GradeBonu.State;
		if(isState=="0"){
			isText="鍙鍙�";
		}else if(isState=="1"){
			isText="宸查鍙�";
		}
		Dom.find(".getBtn").text(isText).removeClass(isState=="0"?"disable":"");
		Dom.find(".DomNum").text(_Obj.GradeBonu.Grade);
		Dom.find(".GetNum").text(_Obj.GradeBonu.GradeBonus);
		Dom.attr("data-key","true");
	}
}
function showDetail(target){
	var detail = $(target).parent().children('.floorDetail');
	$('.floorDetail').each(function(i){
		var that = $(this)
		if(that.css('display')=='block'){
			that.hide(100)
			that.parent().removeClass('show')
		}
	})
	if(detail.css('display')=='none'){
		var Title=$(target).data("title"),
			Type=$(target).data("type"),
			Dom=$(detail).find(".inHtml");			
			var isNo=Dom.hasClass('Not');
			if(isNo)return false;
			Dom.addClass("Not");
			// if(Dom.attr("data-key")=="false"){
				getActivity(Type,Title,Dom,function(){
					detail.show(50);
					Dom.removeClass("Not");
					$($(target)[0]).parent().addClass('show');
					setTimeout(function(){
						var isTop=$(target).closest(".floor").offset().top;
						getWinTop(isTop);
					},200)
				});
			// }
	}
}

$("body").on("mouseenter",".showDetail",function(){
	var isImg=$(this).find(".ImgLI");
	if($(isImg).length>1){
		$(isImg).eq(1).show();
		$(isImg).eq(0).hide();
	}
}).on("mouseleave",".showDetail",function(){
	var isImg=$(this).find(".ImgLI");
	if($(isImg).length>1){
		$(isImg).eq(0).show();
		$(isImg).eq(1).hide();
	}
}).on("click",".getBtn",function(){
	// 鑾峰彇濂栧姳
	var self=this,isDis=$(self).hasClass("disable"),isTit=$(self).closest(".floor").find(".showDetail").data("title");
	console.log(isTit);
	if(isDis)return false;
	$(self).addClass("disable");
	var dataArr={Action:"GetReward",Qort:isTit};
	$.ajax({
		load:true,
		data:dataArr,
		success:function(data){
			if(data.Code==1){
				if (isTit=="鏅嬬骇濂栧姳") {
					localStorage.setItem('UserUpGradeBonus',localStorage.getItem('UserUpGradeBonus').replace(":0,",":1,"));//宸查鍙栧悗閲嶇疆State涓�1
				}
				layer.alert(data.StrCode);
				$(self).text("宸查鍙�").addClass("disable");
			}else if(data.Code==2&&isTit=="鏅嬬骇濂栧姳"){
				localStorage.setItem('UserUpGradeBonus',localStorage.getItem('UserUpGradeBonus').replace(":0,",":1,"));//宸查鍙栧悗閲嶇疆State涓�1
			}else{
				layer.msgWarn(data.StrCode);
				$(self).removeClass("disable");
			}
		}
	})
});
$(function() {
	// 娓叉煋妯℃澘鍐呭鍧�
	var ActivityConfig="";
	getRenData(['ActivityConfig'],function (data) {
		ActivityConfig=data.ActivityConfig;
		if (!!ActivityConfig){
			ActivityConfig=ActivityConfig;
		}
		if(ActivityConfig&&ActivityConfig!=undefined){_Obj.ActivityConfig=1}
		if(_Obj.ActivityConfig){
			$(ActivityConfig).each(function(i,Obj){
				var img1,img2;
				var Type=Obj.Type,
					Name=Obj.Name,
					Intro=Obj.Intro,
					Content=Obj.Content,
					Ohtml="",
					isImg2="",
					isImg="";
				if(!!Obj.Img){
					img1=_Path.Host.img+Obj.Img[0];
					img2=_Path.Host.img+Obj.Img[1];
					if(Obj.Img[0]!=null){isImg2='<img class="ImgLI floorTitleImg defaultImg" src="'+img1+'" alt="">';};
					if(Obj.Img[1]!=null){isImg='<img class="ImgLI floorTitleImg defaultImg" style="display:none" src="'+img2+'" alt="">';};
				}else{
					isImg2='<img class="ImgLI floorTitleImg defaultImg" src="" alt="">';
				}
				if(!Name)Name=i;
				if(!Intro)Intro="";
				if(!Content)Content="";
				_Obj.isHtml+='<div class="floor fix">\
						<div class="showDetail fix" onclick="showDetail(this)" data-title="'+Name+'" data-type="'+Type+'">\
							'+isImg2+isImg+'\
							<div class="floorRright">\
								<h2>'+Name+'</h2>\
								<p>'+Intro+'</p>\
								<a href="javascript:;">鏌ョ湅璇︽儏<i></i></a>\
							</div>\
						</div>\
						<div class="floorDetail">\
							<div class="inHtml" data-key="false"></div><div class="activityCon">'+Content+'</div>\
						</div>\
					</div>\
					<div class="floorLine"></div>'
			});
			$("#ActivityBox").append(_Obj.isHtml);
		}

	})
	//End
})
