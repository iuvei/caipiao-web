/*! layer-v1.9.3 弹层组件 License LGPL  http://layer.layui.com/ By 贤心 */
;!function(a,b){"use strict";var c,d,e={getPath:function(){var a=document.scripts,b=a[a.length-1],c=b.src;if(!b.getAttribute("merge"))return c.substring(0,c.lastIndexOf("/")+1)}(),config:{},end:{},btn:["&#x786E;&#x5B9A;","&#x53D6;&#x6D88;"],type:["dialog","page","iframe","loading","tips"]};a.layer={v:"1.9.3",ie6:!!a.ActiveXObject&&!a.XMLHttpRequest,index:0,path:e.getPath,config:function(a,b){var d=0;return a=a||{},layer.cache=e.config=c.extend(e.config,a),layer.path=e.config.path||layer.path,"string"==typeof a.extend&&(a.extend=[a.extend]),layer.use("skin/layer.css",a.extend&&a.extend.length>0?function f(){var c=a.extend;layer.use(c[c[d]?d:d-1],d<c.length?function(){return++d,f}():b)}():b),this},use:function(a,b,d){var e=c("head")[0],a=a.replace(/\s/g,""),f=/\.css$/.test(a),g=document.createElement(f?"link":"script"),h="layui_layer_"+a.replace(/\.|\//g,"");return layer.path?(f&&(g.rel="stylesheet"),g[f?"href":"src"]=/^http:\/\//.test(a)?a:layer.path+a,g.id=h,c("#"+h)[0]||e.appendChild(g),function i(){(f?1989===parseInt(c("#"+h).css("width")):layer[d||h])?function(){b&&b();try{f||e.removeChild(g)}catch(a){}}():setTimeout(i,100)}(),this):void 0},ready:function(a,b){var d="function"==typeof a;return d&&(b=a),layer.config(c.extend(e.config,function(){return d?{}:{path:a}}()),b),this},alert:function(a,b,d){var e="function"==typeof b;return e&&(d=b),layer.open(c.extend({content:a,yes:d},e?{}:b))},confirm:function(a,b,d,f){var g="function"==typeof b;return g&&(f=d,d=b),layer.open(c.extend({content:a,btn:e.btn,yes:d,cancel:f},g?{}:b))},msg:function(a,d,f){var h="function"==typeof d,i=e.config.skin,j=(i?i+" "+i+"-msg":"")||"layui-layer-msg",k=g.anim.length-1;return h&&(f=d),layer.open(c.extend({content:a,time:3e3,shade:!1,skin:j,title:!1,closeBtn:!1,btn:!1,end:f},h&&!e.config.skin?{skin:j+" layui-layer-hui",shift:k}:function(){return d=d||{},(-1===d.icon||d.icon===b&&!e.config.skin)&&(d.skin=j+" "+(d.skin||"layui-layer-hui")),d}()))},load:function(a,b){return layer.open(c.extend({type:3,icon:a||0,shade:.01},b))},tips:function(a,b,d){return layer.open(c.extend({type:4,content:[a,b],closeBtn:!1,time:3e3,maxWidth:210},d))}};var f=function(a){var b=this;b.index=++layer.index,b.config=c.extend({},b.config,e.config,a),b.creat()};f.pt=f.prototype;var g=["layui-layer",".layui-layer-title",".layui-layer-main",".layui-layer-dialog","layui-layer-iframe","layui-layer-content","layui-layer-btn","layui-layer-close"];g.anim=["layui-anim","layui-anim-01","layui-anim-02","layui-anim-03","layui-anim-04","layui-anim-05","layui-anim-06"],f.pt.config={type:0,shade:.3,fix:!0,move:g[1],title:"&#x4FE1;&#x606F;",offset:"auto",area:"auto",closeBtn:1,time:0,zIndex:19891014,maxWidth:360,shift:0,icon:-1,scrollbar:!0,tips:2},f.pt.vessel=function(a,b){var c=this,d=c.index,f=c.config,h=f.zIndex+d,i="object"==typeof f.title,j=f.maxmin&&(1===f.type||2===f.type),k=f.title?'<div class="layui-layer-title" style="'+(i?f.title[1]:"")+'">'+(i?f.title[0]:f.title)+"</div>":"";return f.zIndex=h,b([f.shade?'<div class="layui-layer-shade" id="layui-layer-shade'+d+'" times="'+d+'" style="'+("z-index:"+(h-1)+"; background-color:"+(f.shade[1]||"#000")+"; opacity:"+(f.shade[0]||f.shade)+"; filter:alpha(opacity="+(100*f.shade[0]||100*f.shade)+");")+'"></div>':"",'<div class="'+g[0]+" "+(g.anim[f.shift]||"")+(" layui-layer-"+e.type[f.type])+(0!=f.type&&2!=f.type||f.shade?"":" layui-layer-border")+" "+(f.skin||"")+'" id="'+g[0]+d+'" type="'+e.type[f.type]+'" times="'+d+'" showtime="'+f.time+'" conType="'+(a?"object":"string")+'" style="z-index: '+h+"; width:"+f.area[0]+";height:"+f.area[1]+(f.fix?"":";position:absolute;")+'">'+(a&&2!=f.type?"":k)+'<div class="layui-layer-content'+(0==f.type&&-1!==f.icon?" layui-layer-padding":"")+(3==f.type?" layui-layer-loading"+f.icon:"")+'">'+(0==f.type&&-1!==f.icon?'<i class="layui-layer-ico layui-layer-ico'+f.icon+'"></i>':"")+(1==f.type&&a?"":f.content||"")+'</div><span class="layui-layer-setwin">'+function(){var a=j?'<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>':"";return f.closeBtn&&(a+='<a class="layui-layer-ico '+g[7]+" "+g[7]+(f.title?f.closeBtn:4==f.type?"1":"2")+'" href="javascript:;"></a>'),a}()+"</span>"+(f.btn?function(){var a="";"string"==typeof f.btn&&(f.btn=[f.btn]);for(var b=0,c=f.btn.length;c>b;b++)a+='<a class="'+g[6]+b+'">'+f.btn[b]+"</a>";return'<div class="'+g[6]+'">'+a+"</div>"}():"")+"</div>"],k),c},f.pt.creat=function(){var a=this,b=a.config,f=a.index,h=b.content,i="object"==typeof h;switch("string"==typeof b.area&&(b.area="auto"===b.area?["",""]:[b.area,""]),b.type){case 0:b.btn="btn"in b?b.btn:e.btn[0],layer.closeAll("dialog");break;case 2:var h=b.content=i?b.content:[b.content||"http://sentsin.com?from=layer","auto"];b.content='<iframe scrolling="'+(b.content[1]||"auto")+'" allowtransparency="true" id="'+g[4]+f+'" name="'+g[4]+f+'" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="'+b.content[0]+'"></iframe>';break;case 3:b.title=!1,b.closeBtn=!1,-1===b.icon&&0===b.icon,layer.closeAll("loading");break;case 4:i||(b.content=[b.content,"body"]),b.follow=b.content[1],b.content=b.content[0]+'<i class="layui-layer-TipsG"></i>',b.title=!1,b.shade=!1,b.fix=!1,b.tips="object"==typeof b.tips?b.tips:[b.tips,!0],b.tipsMore||layer.closeAll("tips")}a.vessel(i,function(d,e){c("body").append(d[0]),i?function(){2==b.type||4==b.type?function(){c("body").append(d[1])}():function(){h.parents("."+g[0])[0]||(h.show().addClass("layui-layer-wrap").wrap(d[1]),c("#"+g[0]+f).find("."+g[5]).before(e))}()}():c("body").append(d[1]),a.layero=c("#"+g[0]+f),b.scrollbar||g.html.css("overflow","hidden").attr("layer-full",f)}).auto(f),2==b.type&&layer.ie6&&a.layero.find("iframe").attr("src",h[0]),4==b.type?a.tips():a.offset(),b.fix&&d.on("resize",function(){a.offset(),(/^\d+%$/.test(b.area[0])||/^\d+%$/.test(b.area[1]))&&a.auto(f),4==b.type&&a.tips()}),b.time<=0||setTimeout(function(){layer.close(a.index)},b.time),a.move().callback()},f.pt.auto=function(a){function b(a){a=h.find(a),a.height(i[1]-j-k-2*(0|parseFloat(a.css("padding"))))}var e=this,f=e.config,h=c("#"+g[0]+a);""===f.area[0]&&f.maxWidth>0&&(/MSIE 7/.test(navigator.userAgent)&&f.btn&&h.width(h.innerWidth()),h.outerWidth()>f.maxWidth&&h.width(f.maxWidth));var i=[h.innerWidth(),h.innerHeight()],j=h.find(g[1]).outerHeight()||0,k=h.find("."+g[6]).outerHeight()||0;switch(f.type){case 2:b("iframe");break;default:""===f.area[1]?f.fix&&i[1]>d.height()&&(i[1]=d.height(),b("."+g[5])):b("."+g[5])}return e},f.pt.offset=function(){var a=this,b=a.config,c=a.layero,e=[c.outerWidth(),c.outerHeight()],f="object"==typeof b.offset;a.offsetTop=(d.height()-e[1])/2,a.offsetLeft=(d.width()-e[0])/2,f?(a.offsetTop=b.offset[0],a.offsetLeft=b.offset[1]||a.offsetLeft):"auto"!==b.offset&&(a.offsetTop=b.offset,"rb"===b.offset&&(a.offsetTop=d.height()-e[1],a.offsetLeft=d.width()-e[0])),b.fix||(a.offsetTop=/%$/.test(a.offsetTop)?d.height()*parseFloat(a.offsetTop)/100:parseFloat(a.offsetTop),a.offsetLeft=/%$/.test(a.offsetLeft)?d.width()*parseFloat(a.offsetLeft)/100:parseFloat(a.offsetLeft),a.offsetTop+=d.scrollTop(),a.offsetLeft+=d.scrollLeft()),c.css({top:a.offsetTop,left:a.offsetLeft})},f.pt.tips=function(){var a=this,b=a.config,e=a.layero,f=[e.outerWidth(),e.outerHeight()],h=c(b.follow);h[0]||(h=c("body"));var i={width:h.outerWidth(),height:h.outerHeight(),top:h.offset().top,left:h.offset().left},j=e.find(".layui-layer-TipsG"),k=b.tips[0];b.tips[1]||j.remove(),i.autoLeft=function(){i.left+f[0]-d.width()>0?(i.tipLeft=i.left+i.width-f[0],j.css({right:12,left:"auto"})):i.tipLeft=i.left},i.where=[function(){i.autoLeft(),i.tipTop=i.top-f[1]-10,j.removeClass("layui-layer-TipsB").addClass("layui-layer-TipsT").css("border-right-color",b.tips[1])},function(){i.tipLeft=i.left+i.width+10,i.tipTop=i.top,j.removeClass("layui-layer-TipsL").addClass("layui-layer-TipsR").css("border-bottom-color",b.tips[1])},function(){i.autoLeft(),i.tipTop=i.top+i.height+10,j.removeClass("layui-layer-TipsT").addClass("layui-layer-TipsB").css("border-right-color",b.tips[1])},function(){i.tipLeft=i.left-f[0]-10,i.tipTop=i.top,j.removeClass("layui-layer-TipsR").addClass("layui-layer-TipsL").css("border-bottom-color",b.tips[1])}],i.where[k-1](),1===k?i.top-(d.scrollTop()+f[1]+16)<0&&i.where[2]():2===k?d.width()-(i.left+i.width+f[0]+16)>0||i.where[3]():3===k?i.top-d.scrollTop()+i.height+f[1]+16-d.height()>0&&i.where[0]():4===k&&f[0]+16-i.left>0&&i.where[1](),e.find("."+g[5]).css({"background-color":b.tips[1],"padding-right":b.closeBtn?"30px":""}),e.css({left:i.tipLeft,top:i.tipTop})},f.pt.move=function(){var a=this,b=a.config,e={setY:0,moveLayer:function(){var a=e.layero,b=parseInt(a.css("margin-left")),c=parseInt(e.move.css("left"));0===b||(c-=b),"fixed"!==a.css("position")&&(c-=a.parent().offset().left,e.setY=0),a.css({left:c,top:parseInt(e.move.css("top"))-e.setY})}},f=a.layero.find(b.move);return b.move&&f.attr("move","ok"),f.css({cursor:b.move?"move":"auto"}),c(b.move).on("mousedown",function(a){if(a.preventDefault(),"ok"===c(this).attr("move")){e.ismove=!0,e.layero=c(this).parents("."+g[0]);var f=e.layero.offset().left,h=e.layero.offset().top,i=e.layero.outerWidth()-6,j=e.layero.outerHeight()-6;c("#layui-layer-moves")[0]||c("body").append('<div id="layui-layer-moves" class="layui-layer-moves" style="left:'+f+"px; top:"+h+"px; width:"+i+"px; height:"+j+'px; z-index:2147483584"></div>'),e.move=c("#layui-layer-moves"),b.moveType&&e.move.css({visibility:"hidden"}),e.moveX=a.pageX-e.move.position().left,e.moveY=a.pageY-e.move.position().top,"fixed"!==e.layero.css("position")||(e.setY=d.scrollTop())}}),c(document).mousemove(function(a){if(e.ismove){var c=a.pageX-e.moveX,f=a.pageY-e.moveY;if(a.preventDefault(),!b.moveOut){e.setY=d.scrollTop();var g=d.width()-e.move.outerWidth(),h=e.setY;0>c&&(c=0),c>g&&(c=g),h>f&&(f=h),f>d.height()-e.move.outerHeight()+e.setY&&(f=d.height()-e.move.outerHeight()+e.setY)}e.move.css({left:c,top:f}),b.moveType&&e.moveLayer(),c=f=g=h=null}}).mouseup(function(){try{e.ismove&&(e.moveLayer(),e.move.remove()),e.ismove=!1}catch(a){e.ismove=!1}b.moveEnd&&b.moveEnd()}),a},f.pt.callback=function(){function a(){var a=f.cancel&&f.cancel(b.index);a===!1||layer.close(b.index)}var b=this,d=b.layero,f=b.config;b.openLayer(),f.success&&(2==f.type?d.find("iframe")[0].onload=function(){this.className="",f.success(d,b.index)}:f.success(d,b.index)),layer.ie6&&b.IE6(d),d.find("."+g[6]).children("a").on("click",function(){var e=c(this).index();0===e?f.yes?f.yes(b.index,d):layer.close(b.index):1===e?a():f["btn"+(e+1)]?f["btn"+(e+1)](b.index,d):layer.close(b.index)}),d.find("."+g[7]).on("click",a),f.shadeClose&&c("#layui-layer-shade"+b.index).on("click",function(){layer.close(b.index)}),d.find(".layui-layer-min").on("click",function(){layer.min(b.index,f),f.min&&f.min(d)}),d.find(".layui-layer-max").on("click",function(){c(this).hasClass("layui-layer-maxmin")?(layer.restore(b.index),f.restore&&f.restore(d)):(layer.full(b.index,f),f.full&&f.full(d))}),f.end&&(e.end[b.index]=f.end)},e.reselect=function(){c.each(c("select"),function(a,b){var d=c(this);d.parents("."+g[0])[0]||1==d.attr("layer")&&c("."+g[0]).length<1&&d.removeAttr("layer").show(),d=null})},f.pt.IE6=function(a){function b(){a.css({top:f+(e.config.fix?d.scrollTop():0)})}var e=this,f=a.offset().top;b(),d.scroll(b),c("select").each(function(a,b){var d=c(this);d.parents("."+g[0])[0]||"none"===d.css("display")||d.attr({layer:"1"}).hide(),d=null})},f.pt.openLayer=function(){var a=this;layer.zIndex=a.config.zIndex,layer.setTop=function(a){var b=function(){layer.zIndex++,a.css("z-index",layer.zIndex+1)};return layer.zIndex=parseInt(a[0].style.zIndex),a.on("mousedown",b),layer.zIndex}},e.record=function(a){var b=[a.outerWidth(),a.outerHeight(),a.position().top,a.position().left+parseFloat(a.css("margin-left"))];a.find(".layui-layer-max").addClass("layui-layer-maxmin"),a.attr({area:b})},e.rescollbar=function(a){g.html.attr("layer-full")==a&&(g.html[0].style.removeProperty?g.html[0].style.removeProperty("overflow"):g.html[0].style.removeAttribute("overflow"),g.html.removeAttr("layer-full"))},layer.getChildFrame=function(a,b){return b=b||c("."+g[4]).attr("times"),c("#"+g[0]+b).find("iframe").contents().find(a)},layer.getFrameIndex=function(a){return c("#"+a).parents("."+g[4]).attr("times")},layer.iframeAuto=function(a){if(a){var b=layer.getChildFrame("body",a).outerHeight(),d=c("#"+g[0]+a),e=d.find(g[1]).outerHeight()||0,f=d.find("."+g[6]).outerHeight()||0;d.css({height:b+e+f}),d.find("iframe").css({height:b})}},layer.iframeSrc=function(a,b){c("#"+g[0]+a).find("iframe").attr("src",b)},layer.style=function(a,b){var d=c("#"+g[0]+a),f=d.attr("type"),h=d.find(g[1]).outerHeight()||0,i=d.find("."+g[6]).outerHeight()||0;(f===e.type[1]||f===e.type[2])&&(d.css(b),f===e.type[2]&&d.find("iframe").css({height:parseFloat(b.height)-h-i}))},layer.min=function(a,b){var d=c("#"+g[0]+a),f=d.find(g[1]).outerHeight()||0;e.record(d),layer.style(a,{width:180,height:f,overflow:"hidden"}),d.find(".layui-layer-min").hide(),"page"===d.attr("type")&&d.find(g[4]).hide(),e.rescollbar(a)},layer.restore=function(a){var b=c("#"+g[0]+a),d=b.attr("area").split(",");b.attr("type");layer.style(a,{width:parseFloat(d[0]),height:parseFloat(d[1]),top:parseFloat(d[2]),left:parseFloat(d[3]),overflow:"visible"}),b.find(".layui-layer-max").removeClass("layui-layer-maxmin"),b.find(".layui-layer-min").show(),"page"===b.attr("type")&&b.find(g[4]).show(),e.rescollbar(a)},layer.full=function(a){var b,f=c("#"+g[0]+a);e.record(f),g.html.attr("layer-full")||g.html.css("overflow","hidden").attr("layer-full",a),clearTimeout(b),b=setTimeout(function(){var b="fixed"===f.css("position");layer.style(a,{top:b?0:d.scrollTop(),left:b?0:d.scrollLeft(),width:d.width(),height:d.height()}),f.find(".layui-layer-min").hide()},100)},layer.title=function(a,b){var d=c("#"+g[0]+(b||layer.index)).find(g[1]);d.html(a)},layer.close=function(a){var b=c("#"+g[0]+a),d=b.attr("type");if(b[0]){if(d===e.type[1]&&"object"===b.attr("conType")){b.children(":not(."+g[5]+")").remove();for(var f=0;2>f;f++)b.find(".layui-layer-wrap").unwrap().hide()}else{if(d===e.type[2])try{var h=c("#"+g[4]+a)[0];h.contentWindow.document.write(""),h.contentWindow.close(),b.find("."+g[5])[0].removeChild(h)}catch(i){}b[0].innerHTML="",b.remove()}c("#layui-layer-moves, #layui-layer-shade"+a).remove(),layer.ie6&&e.reselect(),e.rescollbar(a),"function"==typeof e.end[a]&&e.end[a](),delete e.end[a]}},layer.closeAll=function(a){c.each(c("."+g[0]),function(){var b=c(this),d=a?b.attr("type")===a:1;d&&layer.close(b.attr("times")),d=null})},e.run=function(){c=jQuery,d=c(a),g.html=c("html"),layer.open=function(a){var b=new f(a);return b.index}},"function"==typeof define?define(function(){return e.run(),layer}):function(){e.run(),layer.use("skin/layer.css")}()}(window);
layer.config({title:"温馨提示"});
layer.config({offset:'auto'});
alert=layer.msgWarn=layer.alert;
layer.url=function (msg,url) {
    layer.open({
        content: msg,
        title:'温馨提示',
        btn:['确定'],
        shadeClose: true,
        end: function () {
            if(url==0||url==undefined){
                window.location.reload()
            }
            else if(!isNaN(url)){
                window.history.back()
            }
            else{
                window.location.href=url
            }
        }
    })
};
var allLotteryType = [{type:'K3', code: 1407 }, {type:'SSC', code:1000 }, {type:'SYX5', code:1100 }, {type:'PK10', code:1303 },
// {type:'XYNC', code:1304 },
{type:'KL8', code:1302 }, {type:'FC3D', code:1201 }, {type:'PL35', code:1202 }];

var _Tool = {
	obscure : {
		Base: function(s,f,e,m) {
			var l = m||s.length-f-e,j='';
			for(var i = l;i>0;i--){
				j+='*';
			}
			s=s.substring(0,f)+j+s.slice(-e);
			return s;
		},
		Mail: function(s) {
			s=s.split('@');

			return this.Base(s[0],2,1)+'@'+s[1];
		},
		Mobile:function(s){
			return this.Base(s,2,2);
		}
	},
  commonDom:{
    Load:'<div class="iconLoadingCon" style="transform: scale(.6);"> <span class="iconLoadingText" style="left:0;color:#253646;">&#xe647;</span> <div class="iconLoadingMove"></div> </div>',
    NoData:'<i class="iconfont"></i>暂无记录',
    Warp:function(s){
      return '<div class="notContent" style="padding:100px 0;">'+s+'</div>'
    }
  }
}
;(function(){
  for(var k in _Tool.commonDom){
    if (k!=="Warp") {
      _Tool.commonDom[k]=_Tool.commonDom.Warp(_Tool.commonDom[k])
    }
  }
})()
//对账号进行模糊,如果boolean为真，则模糊后的账号和原账号等长
function fuzzyUsername(str,boolean){
	if(!String.prototype.repeat){
		String.prototype.repeat = function(num){
			if(num<0)return;
			var str = '';
			for(var i = 0;i < num; i++){
				str += this;
			}
			return str;
		}
	}

	if(str){
		var len = str.length;
		if(len > 3 && len <=6 ){
			return str = str.slice(0,2) + '*'.repeat(len - 3) + str.slice(-1);
		}else if(len > 6){
			return str = str.slice(0,2) + '*'.repeat(boolean ? (len-3):3) + str.slice(-1);
		}else{
			return str;
		}
	}
}

/**
 * [InfoCard 名片类]
 * @param {[数组]} delta [名片相对于触发dom的相对位移]
 * 现在名片与风云榜解耦了，可以自己选择触发父元素，也可以自己设相对位置
 */
function InfoCard(delta){
  this.delta = delta || [0, -300];        //有默认位置的
  this.showFlag = [0,0];
  this.showTimer = null;
  this.layerIndex = 0;
}

/**
 * [render 名片类渲染函数]
 * @param  {[int]} id  [用于获取名片信息所需的id,获取自己的名片传0]
 * @param  {[dom]} dom [父元素的dom节点]
 */
InfoCard.prototype.render = function(id, dom){
    var that = this;
    if(sessionStorage.getItem('infoCard'+id)){
        //如果有在sessionStorage的话，就直接从sessionStorage获取数据
        if(!that.showFlag[0] && !that.showFlag[1]){
            return;
        }

        var card = JSON.parse(sessionStorage.getItem('infoCard'+id));
        var cardStr = createCardStr(card);  //将名片对象填充到dom结构里，生成一个可渲染的字符串
        // console.log(cardStr)
        showCard(dom, cardStr);         //渲染名片
    }else{
        //缓存没找到的话就用ajax获取
        ajaxCard(id);
    }

    /**
     * [ajaxCard 使用ajax去获取名片，并调用各个函数渲染]
     * @param  {[type]} id [获取名片使用的id]
     */
    function ajaxCard(id){
        $.ajax({
            data:{
                "Action" : "GetCard",
                "UserId": id
            },
            success:function(data){
                if(data.Code === 1 || data.Code === 0){
                    if(!that.showFlag[0] && !that.showFlag[1]){
                        return;
                    }

                    data = data.BackData;
                    console.log(data);
                    var card = createCard(data);        //将获得的数据处理后，生成一个名片对象
                    var cardStr = createCardStr(card);  //将名片对象填充到dom结构里，生成一个可渲染的字符串
                    // console.log(cardStr)
                    showCard(dom, cardStr);         //渲染名片
                    sessionStorage.setItem('infoCard'+id, JSON.stringify(card));
                }else{
                    console.log(data.StrCode);
                }
            }
        });
    }

    /**
     * [createCard 对获得的数据进行处理，形成卡片对象]
     * @param  {[obj]} data [ajax返回的数据]
     * @return {[str]}      [卡片对象]
     */
    function createCard(data){
    		console.log(data)

        var sexArr = ['女','男','保密'];
        var card = {};
        card.award = parseInt(data.Award) || 0;                              				//累计投注
        card.groupTitle = data.GroupTitle || '';                                    //等级
        card.lotteryList = data.LotteryType ? data.LotteryType.split(',') : [];     //已玩彩种列表
        card.nickname = data.NickName;                                              //昵称
        card.rank = data.Rank || '';                                                //头衔
        card.sex = data.Sex ? sexArr[data.Sex] : '保密';                            //性别
        card.username = data.UserName;                                              //账号
        card.fizzyUsername = fuzzyUsername(card.username,true);                     //模糊后的账号
        card.userPhoto = _Path.Host.img + _Path.path.photos+data.UserPhoto;         //用户头像
        return card;
    }

    /**
     * [createCardStr 将卡片对象生成可渲染的字符串]
     * @param  {[obj]} card [卡片对象]
     * @return {[type]}      [可渲染的字符串]
     */
    function createCardStr(card){
        //名片左上
        console.log(card)
        var photo = card.userPhoto || 'defaultHeadImg.png'; //默认头像
        card.nickname = card.nickname || '昵称未设置';
        var cardLeftStr = '<div class="cardLeft">\
            <img src="'+ photo+'" alt="" title="' + card.lotteryList.LotteryName+ '" width="80" height="80">\
            <h6>'+card.nickname+'</h6>\
        </div>';

        //名片右上
        var cardInfoStr = '<div class="cardInfo">\
            <ul>\
                <li>性别：'+card.sex+'</li>\
                <li>账号：'+card.fizzyUsername+'</li>\
                <li>等级：'+card.groupTitle+'</li>\
                <li>头衔：'+card.rank+'</li>\
                <li>累计中奖：'+card.award+'</li>\
            </ul>\
        </div>';

        //下方已玩彩种列表
        var arr = card.lotteryList;
        var unactiveArr = []; //存放亮的icon
        var activeArr = []; //存放暗的icon
        //已经更新的彩种
        var pathConfig = {
        	K3: '/lottery_k3.html?lottery=',
        	SSC: '/lottery_ssc.html?lottery='
        }
        for(var i = 0; i < allLotteryType.length;i++){
            var isActive = 'noActive';
            for(var j = 0;j < card.lotteryList.length;j++){
                if(card.lotteryList[j].toLowerCase() === allLotteryType[i].type.toLowerCase()){
                    isActive = '';
                }
            }
            var lotteryUrl = pathConfig[allLotteryType[i].type] || '/gameBet_cqssc.html?lottery=';
            var str = '<li><a href="'+ lotteryUrl + allLotteryType[i].code +'"><i class="iconfont L_'+ allLotteryType[i].type +' '+ isActive +'"></i></a></li>';
            isActive ? unactiveArr.push(str) : activeArr.push(str);
        }
        //把亮的放前面，暗的放后面
        var cardIconStr = '<ul class="cardIcon fix">' + activeArr.join('') + unactiveArr.join('') +'</ul>';
        // console.log(cardIconStr)
        return '<div class="card fix"  >'+ cardLeftStr + cardInfoStr + cardIconStr + '</div>';
    }

    /**
     * [showCard 使用layer生成名片并绑定事件]
     * @param  {[dom]} dom     [触发元素的dom节点]
     * @param  {[str]} cardStr [用以渲染的字符串]
     */
    function showCard(dom, cardStr){
        var offset = $(dom).offset();
        var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
        var scrollLeft = window.pageXOffset|| document.documentElement.scrollLeft || document.body.scrollLeft;
        layer.open({
            type:1,
            closeBtn:0,
            shift:5,
            shade:0,
            title:false,
            content:cardStr,
            skin:'cardCon',
            offset:[offset.top - scrollTop + that.delta[0],offset.left - scrollLeft + that.delta[1]],
            success:function(layero, index){
            		that.layerIndex = index;
                that.layer = layero;
                layero.on("mouseenter",function(e){
                    that.showFlag[1] = 1;
                    console.log(that.layerIndex, that.showFlag)
                }).on("mouseleave",function(e){
                    that.showFlag[1] = 0;
                    if (!that.showFlag[0] && !that.showFlag[1]) {
                        layer.closeAll();
                        that.layer = null;
                    }
                });
            }
        });
    }

}
/**
 * [bind 为触发元素绑定触发名片事件]
 * @param  {[jq对象]} $dom [触发元素的父框]
 * @param  {[str]} item [触发元素的子框，用字符串表示，使用jq可识别的方式即可]
 */
InfoCard.prototype.bind = function($dom, item){
    var that = this;
    $dom.css('cursor', 'pointer').on("mouseenter", item, function(){
        that.showFlag[0] = 1;
        layer.closeAll();
        var ths=this;
        //悬浮500s后再触发渲染名片的程序
        showTimer = setTimeout(function(){
                //从轮播图上获取头像，昵称，账号等信息
            if(that.showFlag[0] + that.showFlag[1]){
                var id = $(ths).attr('data-id');
                that.render(id,ths);  //从ajax获得剩余数据，并渲染卡片于页面
                clearTimeout(showTimer)
            }
        },500);
    }).on("mouseleave", item,function(e){
        that.showFlag[0] = 0;
        clearTimeout(showTimer)
        setTimeout(function(){
            if (!that.showFlag[0] && !that.showFlag[1]) {
                layer.closeAll();
            }
        },100);
    }).on('mouseleave',function(){
        //1s后如果既不在轮播图上，也不在名片上，就关闭所有页面
        setTimeout(function(){
            if(!that.showFlag[0] && !that.showFlag[1]){
                layer.closeAll();
            }
        },400);
    });
}
/*名片类结束*/


/**
 * [hoverShow description]
 * @param  {[dom]} show [关联鼠标移入的区域]
 * @param  {[dom]} hide [原本隐藏,移入show区域后显示]
 * @return {[无]}      [description]
 */
function hoverShow(show,hide) {
	var hideDom = $(hide)
	$(show).hover(function(){
		hideDom.show()
	},function(){
		hideDom.hide()
	})
}
/**
 * [hoverShow description]
 * @param  {[dom]} show [关联鼠标点击的区域]
 * @param  {[dom]} hide [原本隐藏,点击show区域后显示]
 * @return {[无]}      [description]
 */
function clickShow(show,hide) {
	var showDom = $(show)
	showDom.children('i').click(function(){
		$(hide).show()
		showDom.hide()
	})
}
/**
 * [W_GetRequest 获取url上的参数,比如]
 * @param {string} url [(可选)基本不传]
 * @return {json} 返回参数对象,如?a=1&b=2 返回的为 {a:1,b:2}
 */
function W_GetRequest(url) {
  url=url||location.search;
  var theRequest={};
  if (url.indexOf("?") !=-1) {
	var str=url.substr(1),
	strs=str.split("&");
	for (var i=0; i < strs.length; i++) {
	  theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
	}
  }
  return theRequest;
}
/**
 * [withdrawBtnCheck 提现按钮判断]
 * @param {obj} data [ajax返回的数据]
 */
function withdrawBtnCheck(data){
  if(data.UserHasSafePwd === '1'){
	  if(data.UserFirstCardInfo && data.UserFirstCardInfo.length && data.UserFirstCardInfo[0]){
		  location.href= '/withdraw.html';
	  }else{
		  //用户没有银行卡
		  layer.confirm('您还未绑定银行卡，请先绑定银行卡?', function(){
			  location.href = '/setBankcard.html?Q=withdraw';
		  },function(){
			  layer.close();
		  });
	  }
  }else{
	  //用户没有安全密码
	  layer.confirm('您还未设置安全密码，请先设置安全密码?<br/>（安全密码用于提现等操作，可保障资金安全）', function(){
		  location.href = '/setSafePwd.html?Q=withdraw';
	  },function(){
		  layer.close();
	  });
  }
}


/**
 * [format 为Date对象追加format方法]
 * @param  {[string]} format [设置要输出的目标格式 如"yyyy-MM-dd hh:mm:ss" ]
 * @return {[string]}        [按格式输出的时间字符串]
 * 示例console.log(new Date().format("yyyyMd hh:mm:ss")) 输出2016816 14:12:17;
 */
Date.prototype.format = function(format) {
  var date = {
	"M+": this.getMonth() + 1,
	"d+": this.getDate(),
	"h+": this.getHours(),
	"m+": this.getMinutes(),
	"s+": this.getSeconds(),
	"q+": Math.floor((this.getMonth() + 3) / 3),
	"S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
	format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
	if (new RegExp("(" + k + ")").test(format)) {
	  format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
	}
  }
  return format;
}
var aDayTime = 24 * 60 * 60 * 1000,//一天的总毫秒值
	GMTdif = new Date().getTimezoneOffset()*60*1000;//本地时间和格林威治的时间差,比如中国差了8小时即480分钟


var _Path = {
	Host: {
		img: "http://imagess-google.com"
	},
	path: {
		thisPath:location.pathname.toLowerCase(),
		photos: '/system/common/headimg/',
	},
  IsLottery:false
}
;(function(){
  var script = document.getElementsByTagName("script");
  if(_Path.path.thisPath.search(/lottery_\w+.html/)>-1||_Path.path.thisPath==="/gamebet_cqssc.html"){
    _Path.IsLottery=true
  }
  _Path.path.serLink = script[script.length-1].src.replace("js/public.js",'');
})()

var _AJAXUrl = '/tools/ssc_ajax.ashx'; //AJAX目标地址
var _UnLogin,_PublicRenData={};
var userCardLayer={show:0};
var sexArr = ['女','男','保密'];
var _FomatConfig = {
	ImgCode: {
		Name: "验证码",
		Reg: /^[0-9a-zA-Z]{4}$/,
	},
	SmsCode: {
		Name: "短信验证码",
		Reg: /^\d{4}$/
	},
	MailCode:{
		Name: "邮箱验证码",
		Reg: /^\d{4}$/
	},
	UserName: {
		Name: "账号",
		Reg: /^[\w|\d]{4,16}$/
	},
	Password: {
		Name: "密码",
		ErrMsg:"密码应为6-16位字符",
		Reg: /^[\w!@#$%^&*.]{6,16}$/
	},
	Mobile: {
		Name: "手机号",
		ErrMsg:"请输入13|14|15|17|18开头的11位手机号码",
		Reg: /^1[3|4|5|7|8]\d{9}$/,
	},
	RealName: {
		Name: "姓名",
		Reg: /^[\u4e00-\u9fa5|·]{2,16}$|^[a-zA-Z|\s]{2,20}$/,
	},
	BankNum: {
		Name: "银行卡号",
		Reg: /^\d{10,19}$/
	},
	Money: {
		Name: "金额",
		Reg: /^\d{1,}(\.\d{1,2})?$/,
		Between: [100, 500000] //100~50w之间
	},
	Answer:{
		Name: "答案",
		Reg: /^\S+$/
	}
	,
	Mail:{
		Name:"邮箱",
		Reg:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
	},

}
_FomatConfig['SafePassword'] = _FomatConfig['Password'];

var _InputJson = {};
var _DomObj = {
	Input: _InputJson,
	Radio: {},
	Select: {},
	getAjaxData: function(data) {
		data = data || {};
		var isErr = false;
		for (var t in this.Input) {
			// console.log(t);
			t = this.Input[t];
			// console.log(t.isErr);
			if (t.isErr === undefined) {
				t.check();
			}
			if (t.isErr) {
				isErr = t;
				break;
			} else if (!t.isRepeat) {
				// 重复确认的值不用传入结果
				if (t.val) {
					data[t.name] = t.val;
				}
			}
		}
		return [data, isErr];
	},
	returnAjaxData:function(data){
		data = this.getAjaxData(data);
		if(data[1]){
			layer.msgWarn(data[1].tipMsg[data[1].isErr]);
			return [data[0],false];
		}else{
			return [data[0],true];
		}
	}
}

function SetInput(ths) {
	if (ths.name&&!ths.getAttribute('disabled')) {
		var t = new FomatDom(ths);
		t.setShowMsg();
	}
}
function FomatDom(dom) { //目前包含输入框和select
	this.dom = dom; //本<input>的JQ对象
	this.name = dom.name; //name
	this.val = dom.value; //用于AJAX取值
	this.isErr; //0表示正确,1表示为空错误,2表示格式错误,3表示超出范围或重复输入不相同
	this.tipMsg; //根据isErr设置匹配的提示信息;
	this.canNull = dom.className.search("CanNull") > -1;
}
/**
 *1. 将值更新到对象的val中
 *2.判断是否是重复输入的对象(isRepeat)  如果是,则和原对象值比较,并生成isErr状态
 *3.判断值是否为空
 *   如果为空判断是否可以为空(canNull)
 *   不为空就去从配置中获取正则进行判断 如果错误则isErr=2
 *     如果正则正确,判断是否配置中有between,进行判断值域有效性,可以报错,也可以改成强制变为合法值
 */
FomatDom.prototype.check = function(fun) {
		var v = this.val = this.dom.value;
		if (this.isRepeat) {
			this.isErr = 3 * (v !== _InputJson[this.isRepeat].dom.value);
		} else if (v) {
			var f = _FomatConfig[this.name];
			this.isErr = !f.Reg.test(v) * 2;
			//正则错误则阻止进一步判断
			if (this.isErr != 2) {
				var b = f.Between;
				v = parseFloat(v);
				if (b) {
					this.isErr = (v < b[0] || v > b[1]) * 3;
				}
			}
		} else {
			this.isErr = 1 - this.canNull;
		}
		showMsg(this.dom, !this.isErr, this.tipMsg[this.isErr]);
	}
	/*
	 *1.先判断是否为重复确认的对象 如果是,将确认的对象Name存给isRepeat
	 *2.判断是否有配置,没配置的进行调试报错预警
	 *3.为提示语句数组(修改tipMsg)设置初始值(包括正确,为空,格式错误)
	 *4.判断如果是重复确认的对象,修改tipMsg,并同时为要确认的对象增加事件,让这两个对象绑定校验.
	 *5.判断是否有值域要求,设置tipMsg
	 */
FomatDom.prototype.setShowMsg = function() {
	var name = this.name;
	this.isRepeat = name.search('check') > -1;
	if (this.isRepeat) {
		this.isRepeat = name = name.split('check')[1];
	}

	var b = _FomatConfig[name];

	if (b) {
		var ths = this;
		ErrMsg=b.ErrMsg,
		name = b.Name;
		b = b.Between;
		this.tipMsg = ["", name + "不能为空", ErrMsg||(name + "格式错误")];
		if (this.isRepeat) {
			this.tipMsg[0] = '';
			this.tipMsg[1] = "请再次输入" + name;
			this.tipMsg.push("两次" + name + "不相同");
			_DomObj.Input[this.isRepeat].dom.addEventListener('change', function() {
				ths.check();
			})
		} else if (b) {
			this.tipMsg.push(name + "必须在" + b[0] + "与" + b[1] + "之间");
		}
		ths.dom.addEventListener('blur', function() {
			ths.check(showMsg);
		});
		// ths.check();
		_DomObj.Input[ths.name] = ths;

	} else {
		// console.err(this.name);
		console.log(this.name + '的名字没在表里')
	}
}

function showMsg(dom, isRight, msg) {
	$(dom).next('em').text(msg).attr("class", isRight ? 'verifyRight' : 'verifyWrong').prepend('<i></i>');
}

$.fn.addInputCheck = function(fun) {
	this.each(function() {
		// console.log(this)
		var name = this.name;
		if (!name) {
			return;
		}
		var type = this.type.toLowerCase();
		switch (type) {
			case "radio":
			case "checkbox":
			case "select":
				break;
			default:
				SetInput(this);
		}
	})
	return this;
}


//检测浏览器对localstorage的支持
function hasLocalStorage() { //返回boolean
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}
var CacheData = localStorage.getItem('CacheData');
CacheData = CacheData?JSON.parse(localStorage.getItem('CacheData')):{};
var VerifyCacheArr = [//需要校验更新版本的列表
    'LotteryConfig', //所有彩种列表
    'LotteryList', //所有彩种信息
    'ActivityConfig',//活动种类及数据
    'FooterConfig',//底部连接设置
    'HelpConfig',//帮助指南
    'SiteConfig',//网站属性设置
    'BannerList',//首页轮播
    'HallBanner',//购彩大厅轮播
    'GradeList',//等级体系
    'LoginGreet',//登录页面问候语列表
    'DefaultPhotoList',//默认头像组
    'RewardData',//每日加奖设置
    'AbstractType',
    'PayLimit',
    'CloudUrl'//大发云链接
];
var DailyCacheArr = [
    'ServiceRating',
    'RankingList'
]
var VerifyUserArr = [
    'UserHasSafePwd', //返回是否已经设置安全密码,1为有,0为没有设置
    'UserSafeQuestions', //返回设置的密保问题,如果没设置可以返回0或者空数组
    'UserMobile', //返回已绑定手机的模糊状态,如未绑定,返回空字符串或0
    'UserMail', //返回已绑定手机的模糊状态,如未绑定,返回空字符串或0
]
var UserCacheArr = [
    'UserName', //返回对应的账号,未登陆用户返回空字符串
    "UserNickName",//用户昵称
    'UserPhoto', //返回用户头像的图片地址,暂时还未开放头像功能
    'UserFirstCardInfo', //返回绑定的第一张银行卡的模糊信息
    'UserUpGradeBonus',
    'NoticeData',//网站公告
    'AgentRebate'//获取代理人返点情况
];
var UserNoCacheArr = [
    'UserUnread',
    // 'UserBalance'
]
// localStorage.removeItem('NoticeData');
var paraArr = DailyCacheArr.concat(VerifyCacheArr);
var today = new Date().format('YYYYMMdd');
(function(){
    var k;
    for (var i = VerifyCacheArr.length - 1; i >= 0; i--) {
        k=VerifyCacheArr[i];
        if(localStorage.getItem(k)!=null&&!CacheData[k]){
            CacheData[k]=1;
        }
    }
    clearlocalStorage(UserNoCacheArr);
})()
function clearlocalStorage(arr){
	for (var i = arr.length - 1; i >= 0; i--) {
		localStorage.removeItem(arr[i]);
    if (CacheData[arr[i]]) {
        delete CacheData[arr[i]];
    }
	}
    localStorage.setItem('CacheData',JSON.stringify(CacheData));
};


/**
 * [getRenData 获取首屏渲染数据]
 * @param  {[数组]} Arr     [需要获取的数据有哪些]
 * @param  {[函数]} fun     [得到数据后的处理方式]
 * @return {[无]}
 * 调用方法：
 * getRenData(arr,function(renderData){
 *     console.log(renderData);
 * });
 */
function getRenData(Arr, fun) {
	var len = Arr.length,
		renderData = {},
		ajaxArr = [];
	for (var i = 0; i < len; i++) {
		if (localStorage.getItem(Arr[i])!==null) { //如果localStorage中有，则localStorage中获取
			try {
				renderData[Arr[i]] = JSON.parse(localStorage.getItem(Arr[i]));
			} catch (e) {
				renderData[Arr[i]] = localStorage.getItem(Arr[i]);
			}
		} else { //如果没有，把剩下的参数压入一个数组，用以ajax获取
			ajaxArr.push(Arr[i]);
		}
	}
	fun(renderData)
}

function alwaysMid(value, total, min ,max){
	var t,rate = value/total;
	if(rate >= min && rate <= max){
		t = total;
	}else if(rate > max){
		t = value/max;
	}else if(rate > 0 && rate < min){
		t = value/min
	}else{
		t = total;
	}
	return Math.floor(t);
}

$(function() {
	/*new一个名片对象*/
	$('._personalInfo').attr('data-id', 0);
	var selfCard = new InfoCard([30,-100]);                //自己的名片卡,卡片出现位置和别的地方卡片不一样
	selfCard.bind($('.userName'), '._personalInfo');
	/*调用名片完结*/

	;(function(){
		//确认导航位置
		var navIndex;
		if($(".slideUser").length){
			navIndex='navSecurityCenter';
		}else{
			switch(_Path.path.thisPath){
				case '/index.html':navIndex='navIndex';break;
				case '/lottery.html':navIndex='navLottery';break;
				case '/activity.html':navIndex='navActivity';break;
				case '/mobile.html':navIndex='navMobile';break;
				case '/helpcenter.html':navIndex='navHelp';break;
			}
		}
		navIndex&&$("#"+navIndex).addClass('curr');
	})()
	$('._no_paste').on('paste', function() { return false }) //禁用粘贴
	// document.body.oncontextmenu=function(){ return false;}  //全屏禁用右键

	/*顶部使用的下拉列表,显示金额 star*/
	hoverShow('.HoverShow','.HoverShowContent')
	$('#unreadMsgNum').hover(function(){
		$(this).attr('data-on',1);
		var ths = this;
		setTimeout(function(){
			if($(ths).attr('data-on')){
				$('.MessageShowContent').show()
			}
		},500)
	},function(){
		$(this).removeAttr('data-on');
		setTimeout(function(){
			if(!$('.MessageShowContent').attr('data-on')){
				$('.MessageShowContent').hide();
			}
		},500)
	})

	$('.MessageShowContent').hover(function(){
		$(this).attr('data-on',1);
	},function(){
		$(this).removeAttr('data-on').hide();
	})
	// hoverShow('#unreadMsgNum','.MessageShowContent')

	clickShow('.ShowMoney','.GetMoney')
	//点击隐藏
	$('.GetMoney i:last').on('click',function(){
		$('.ShowMoney').show();
		$('.GetMoney').hide();
	})
	//点击刷新公用头部的余额
	$('.GetMoney i.iconfont').on('click', function(){
        var self=this;
        self.className+=" refreshMove";
        setTimeout(function(){
            self.className = "iconfont";
        },500);
		getRenData(['UserBalance'],function(renderData){
			var balance = renderData.UserBalance;
			if(balance){
				$('.GetMoney em').text(balance);
			}
		})
	});
	/*顶部使用的下拉列表,显示金额 end*/



	$(".LoginOut").on("click", function() {
		$.ajax({
			data: { action: "LogOut" },
			load:true,
			success: function(data) {
				if (data.Code == "1") {
          var CanPc = sessionStorage.getItem('CanPc');
          sessionStorage.clear();
          if(CanPc){
              sessionStorage.setItem('CanPc',1);
          }
					localStorage.setItem('Login',0);
					clearlocalStorage(UserCacheArr.concat(VerifyUserArr))       //清除缓存
					window.location.href = "login.html";
				} else {
					layer.msgWarn(data.StrCode);
				}
			}
		});
	})

	$(document).delegate(".MustLogin","click",function(e){
		if (!UserName) {
			e.preventDefault();
			layer.confirm('非常抱歉！您还未登录，请先登录。',{
				title:"温馨提示",
				shadeClose:true,
				btn:['立即登录','用户注册']
			},function(i){
				if (location.href.search('login')===-1) {
					location.href="login.html";
				}else{
					layer.close(i)
				}
			},function(){
				if (location.href.search('register')===-1) {
					location.href="register.html";
				}
			})
		}
	}).on("click",".ClickShade",function(e){
    var $this=$(this);
    var off=$this.offset(),
      T=off.top,
      L=off.left,
      W=$this.outerWidth(),
      H=$this.outerHeight(),
      l=e.clientX+$(window).scrollLeft(),
      t=e.clientY+$(window).scrollTop();
    var Newdiv = $("<div>").css({
      position: "absolute",
      top:T,
      left:L,
      width:W,
      height:H,
      overflow:"hidden",
      "z-index":10
    }).appendTo('body');
    W=W>H?W:H;
    var bowen = $("<div>").css({
      position: "absolute",
      width:2*W,
      height:2*W,
      top:t-T-W,
      left:l-L-W,
      "border-radius": "100%",
      transform: "scale(.01)",
      transition:"transform .5s",
      background:"rgba(69,84,103,.2)"
    }).appendTo(Newdiv);
    setTimeout(function(){
      bowen.css({
        transform: "scale(1.414)"
      });
      setTimeout(function(){
        Newdiv.remove();
      },500)
    },100)
  })
})

//刷新缓存数据
function refreshData(arr,fun){
	clearlocalStorage(arr);
}
function how2play(code){
	var h=window.screen.height-80,w=window.screen.width,t,l;
	var Ww=1040,Wh=h*0.9;
	if (w<Ww) {Ww=w*0.9}
	// if (h<Wh) {Wh=h*0.9}
	t= ( h-Wh)/2;
	l= (w-Ww)/2;
	window.open("/howtoplay.html?id="+code, '_blank', 'top='+t+',left='+l+',width='+Ww+',height='+Wh);
}


$(".selectEg").mouseover(function(){
  $(".EgContent").addClass('zmmshow');
});
$(".selectEg").mouseleave(function(){
  $(".EgContent").removeClass('zmmshow');
});