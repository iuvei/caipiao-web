// JavaScript Document
		
//手机站em标准js代码文字大小变化	
(function(){

})();

$(function(){
	
	$(window).resize(function(){
		document.getElementsByTagName('html')[0].style.fontSize = Math.min(window.innerWidth*12/320,200)+"px";
	});
})


//头部选项卡特效
$(function(){
	$(".topBtnList li").on("click",function(){
		$(this).addClass("on").siblings().removeClass("on");
		var num =$(this).index();
		 $('.optionList').eq(num).show().siblings('.optionList').hide()
	})	
})


$(function(){
	$(".recordList li").on("click",function(){
		$(this).addClass("on").siblings().removeClass("on");
		var num =$(this).index();
		$('.recordDataList').eq(num).show().siblings('.recordDataList').hide();
	})	
})
