/*! layer-v2.4 弹层组件 License LGPL  http://layer.layui.com/ By 贤心 */
;!function(a,b){"use strict";var c,d,e={getPath:function(){var a=document.scripts,b=a[a.length-1],c=b.src;if(!b.getAttribute("merge"))return c.substring(0,c.lastIndexOf("/")+1)}(),enter:function(a){13===a.keyCode&&a.preventDefault()},config:{},end:{},btn:["&#x786E;&#x5B9A;","&#x53D6;&#x6D88;"],type:["dialog","page","iframe","loading","tips"]},f={v:"2.4",ie6:!!a.ActiveXObject&&!a.XMLHttpRequest,index:a.layer&&a.layer.v?1e5:0,path:e.getPath,config:function(a,b){var d=0;return a=a||{},f.cache=e.config=c.extend(e.config,a),f.path=e.config.path||f.path,"string"==typeof a.extend&&(a.extend=[a.extend]),f.use("skin/layer.css",a.extend&&a.extend.length>0?function g(){var c=a.extend;f.use(c[c[d]?d:d-1],d<c.length?function(){return++d,g}():b)}():b),this},use:function(a,b,d){var e=c("head")[0],a=a.replace(/\s/g,""),g=/\.css$/.test(a),h=document.createElement(g?"link":"script"),i="layui_layer_"+a.replace(/\.|\//g,"");return f.path?(g&&(h.rel="stylesheet"),h[g?"href":"src"]=/^http:\/\//.test(a)?a:f.path+a,h.id=i,c("#"+i)[0]||e.appendChild(h),function j(){(g?1989===parseInt(c("#"+i).css("width")):f[d||i])?function(){b&&b();try{g||e.removeChild(h)}catch(a){}}():setTimeout(j,100)}(),this):void 0},ready:function(a,b){var d="function"==typeof a;return d&&(b=a),f.config(c.extend(e.config,function(){return d?{}:{path:a}}()),b),this},alert:function(a,b,d){var e="function"==typeof b;return e&&(d=b),f.open(c.extend({content:a,yes:d},e?{}:b))},confirm:function(a,b,d,g){var h="function"==typeof b;return h&&(g=d,d=b),f.open(c.extend({content:a,btn:e.btn,yes:d,btn2:g},h?{}:b))},msg:function(a,d,g){var i="function"==typeof d,j=e.config.skin,k=(j?j+" "+j+"-msg":"")||"layui-layer-msg",l=h.anim.length-1;return i&&(g=d),f.open(c.extend({content:a,time:3e3,shade:!1,skin:k,title:!1,closeBtn:!1,btn:!1,end:g},i&&!e.config.skin?{skin:k+" layui-layer-hui",shift:l}:function(){return d=d||{},(-1===d.icon||d.icon===b&&!e.config.skin)&&(d.skin=k+" "+(d.skin||"layui-layer-hui")),d}()))},load:function(a,b){return f.open(c.extend({type:3,icon:a||0,shade:.01},b))},tips:function(a,b,d){return f.open(c.extend({type:4,content:[a,b],closeBtn:!1,time:3e3,shade:!1,fix:!1,maxWidth:210},d))}},g=function(a){var b=this;b.index=++f.index,b.config=c.extend({},b.config,e.config,a),b.creat()};g.pt=g.prototype;var h=["layui-layer",".layui-layer-title",".layui-layer-main",".layui-layer-dialog","layui-layer-iframe","layui-layer-content","layui-layer-btn","layui-layer-close"];h.anim=["layer-anim","layer-anim-01","layer-anim-02","layer-anim-03","layer-anim-04","layer-anim-05","layer-anim-06"],g.pt.config={type:0,shade:.3,fix:!0,move:h[1],title:"&#x4FE1;&#x606F;",offset:"auto",area:"auto",closeBtn:1,time:0,zIndex:19891014,maxWidth:360,shift:0,icon:-1,scrollbar:!0,tips:2},g.pt.vessel=function(a,b){var c=this,d=c.index,f=c.config,g=f.zIndex+d,i="object"==typeof f.title,j=f.maxmin&&(1===f.type||2===f.type),k=f.title?'<div class="layui-layer-title" style="'+(i?f.title[1]:"")+'">'+(i?f.title[0]:f.title)+"</div>":"";return f.zIndex=g,b([f.shade?'<div class="layui-layer-shade" id="layui-layer-shade'+d+'" times="'+d+'" style="'+("z-index:"+(g-1)+"; background-color:"+(f.shade[1]||"#000")+"; opacity:"+(f.shade[0]||f.shade)+"; filter:alpha(opacity="+(100*f.shade[0]||100*f.shade)+");")+'"></div>':"",'<div class="'+h[0]+(" layui-layer-"+e.type[f.type])+(0!=f.type&&2!=f.type||f.shade?"":" layui-layer-border")+" "+(f.skin||"")+'" id="'+h[0]+d+'" type="'+e.type[f.type]+'" times="'+d+'" showtime="'+f.time+'" conType="'+(a?"object":"string")+'" style="z-index: '+g+"; width:"+f.area[0]+";height:"+f.area[1]+(f.fix?"":";position:absolute;")+'">'+(a&&2!=f.type?"":k)+'<div id="'+(f.id||"")+'" class="layui-layer-content'+(0==f.type&&-1!==f.icon?" layui-layer-padding":"")+(3==f.type?" layui-layer-loading"+f.icon:"")+'">'+(0==f.type&&-1!==f.icon?'<i class="layui-layer-ico layui-layer-ico'+f.icon+'"></i>':"")+(1==f.type&&a?"":f.content||"")+'</div><span class="layui-layer-setwin">'+function(){var a=j?'<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>':"";return f.closeBtn&&(a+='<a class="layui-layer-ico '+h[7]+" "+h[7]+(f.title?f.closeBtn:4==f.type?"1":"2")+'" href="javascript:;"></a>'),a}()+"</span>"+(f.btn?function(){var a="";"string"==typeof f.btn&&(f.btn=[f.btn]);for(var b=0,c=f.btn.length;c>b;b++)a+='<a class="'+h[6]+b+'">'+f.btn[b]+"</a>";return'<div class="'+h[6]+'">'+a+"</div>"}():"")+"</div>"],k),c},g.pt.creat=function(){var a=this,b=a.config,g=a.index,i=b.content,j="object"==typeof i;if(!c("#"+b.id)[0]){switch("string"==typeof b.area&&(b.area="auto"===b.area?["",""]:[b.area,""]),b.type){case 0:b.btn="btn"in b?b.btn:e.btn[0],f.closeAll("dialog");break;case 2:var i=b.content=j?b.content:[b.content||"http://layer.layui.com","auto"];b.content='<iframe scrolling="'+(b.content[1]||"auto")+'" allowtransparency="true" id="'+h[4]+g+'" name="'+h[4]+g+'" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="'+b.content[0]+'"></iframe>';break;case 3:b.title=!1,b.closeBtn=!1,-1===b.icon&&0===b.icon,f.closeAll("loading");break;case 4:j||(b.content=[b.content,"body"]),b.follow=b.content[1],b.content=b.content[0]+'<i class="layui-layer-TipsG"></i>',b.title=!1,b.tips="object"==typeof b.tips?b.tips:[b.tips,!0],b.tipsMore||f.closeAll("tips")}a.vessel(j,function(d,e){c("body").append(d[0]),j?function(){2==b.type||4==b.type?function(){c("body").append(d[1])}():function(){i.parents("."+h[0])[0]||(i.show().addClass("layui-layer-wrap").wrap(d[1]),c("#"+h[0]+g).find("."+h[5]).before(e))}()}():c("body").append(d[1]),a.layero=c("#"+h[0]+g),b.scrollbar||h.html.css("overflow","hidden").attr("layer-full",g)}).auto(g),2==b.type&&f.ie6&&a.layero.find("iframe").attr("src",i[0]),c(document).off("keydown",e.enter).on("keydown",e.enter),a.layero.on("keydown",function(a){c(document).off("keydown",e.enter)}),4==b.type?a.tips():a.offset(),b.fix&&d.on("resize",function(){a.offset(),(/^\d+%$/.test(b.area[0])||/^\d+%$/.test(b.area[1]))&&a.auto(g),4==b.type&&a.tips()}),b.time<=0||setTimeout(function(){f.close(a.index)},b.time),a.move().callback(),h.anim[b.shift]&&a.layero.addClass(h.anim[b.shift])}},g.pt.auto=function(a){function b(a){a=g.find(a),a.height(i[1]-j-k-2*(0|parseFloat(a.css("padding"))))}var e=this,f=e.config,g=c("#"+h[0]+a);""===f.area[0]&&f.maxWidth>0&&(/MSIE 7/.test(navigator.userAgent)&&f.btn&&g.width(g.innerWidth()),g.outerWidth()>f.maxWidth&&g.width(f.maxWidth));var i=[g.innerWidth(),g.innerHeight()],j=g.find(h[1]).outerHeight()||0,k=g.find("."+h[6]).outerHeight()||0;switch(f.type){case 2:b("iframe");break;default:""===f.area[1]?f.fix&&i[1]>=d.height()&&(i[1]=d.height(),b("."+h[5])):b("."+h[5])}return e},g.pt.offset=function(){var a=this,b=a.config,c=a.layero,e=[c.outerWidth(),c.outerHeight()],f="object"==typeof b.offset;a.offsetTop=(d.height()-e[1])/2,a.offsetLeft=(d.width()-e[0])/2,f?(a.offsetTop=b.offset[0],a.offsetLeft=b.offset[1]||a.offsetLeft):"auto"!==b.offset&&(a.offsetTop=b.offset,"rb"===b.offset&&(a.offsetTop=d.height()-e[1],a.offsetLeft=d.width()-e[0])),b.fix||(a.offsetTop=/%$/.test(a.offsetTop)?d.height()*parseFloat(a.offsetTop)/100:parseFloat(a.offsetTop),a.offsetLeft=/%$/.test(a.offsetLeft)?d.width()*parseFloat(a.offsetLeft)/100:parseFloat(a.offsetLeft),a.offsetTop+=d.scrollTop(),a.offsetLeft+=d.scrollLeft()),c.css({top:a.offsetTop,left:a.offsetLeft})},g.pt.tips=function(){var a=this,b=a.config,e=a.layero,f=[e.outerWidth(),e.outerHeight()],g=c(b.follow);g[0]||(g=c("body"));var i={width:g.outerWidth(),height:g.outerHeight(),top:g.offset().top,left:g.offset().left},j=e.find(".layui-layer-TipsG"),k=b.tips[0];b.tips[1]||j.remove(),i.autoLeft=function(){i.left+f[0]-d.width()>0?(i.tipLeft=i.left+i.width-f[0],j.css({right:12,left:"auto"})):i.tipLeft=i.left},i.where=[function(){i.autoLeft(),i.tipTop=i.top-f[1]-10,j.removeClass("layui-layer-TipsB").addClass("layui-layer-TipsT").css("border-right-color",b.tips[1])},function(){i.tipLeft=i.left+i.width+10,i.tipTop=i.top,j.removeClass("layui-layer-TipsL").addClass("layui-layer-TipsR").css("border-bottom-color",b.tips[1])},function(){i.autoLeft(),i.tipTop=i.top+i.height+10,j.removeClass("layui-layer-TipsT").addClass("layui-layer-TipsB").css("border-right-color",b.tips[1])},function(){i.tipLeft=i.left-f[0]-10,i.tipTop=i.top,j.removeClass("layui-layer-TipsR").addClass("layui-layer-TipsL").css("border-bottom-color",b.tips[1])}],i.where[k-1](),1===k?i.top-(d.scrollTop()+f[1]+16)<0&&i.where[2]():2===k?d.width()-(i.left+i.width+f[0]+16)>0||i.where[3]():3===k?i.top-d.scrollTop()+i.height+f[1]+16-d.height()>0&&i.where[0]():4===k&&f[0]+16-i.left>0&&i.where[1](),e.find("."+h[5]).css({"background-color":b.tips[1],"padding-right":b.closeBtn?"30px":""}),e.css({left:i.tipLeft-(b.fix?d.scrollLeft():0),top:i.tipTop-(b.fix?d.scrollTop():0)})},g.pt.move=function(){var a=this,b=a.config,e={setY:0,moveLayer:function(){var a=e.layero,b=parseInt(a.css("margin-left")),c=parseInt(e.move.css("left"));0===b||(c-=b),"fixed"!==a.css("position")&&(c-=a.parent().offset().left,e.setY=0),a.css({left:c,top:parseInt(e.move.css("top"))-e.setY})}},f=a.layero.find(b.move);return b.move&&f.attr("move","ok"),f.css({cursor:b.move?"move":"auto"}),c(b.move).on("mousedown",function(a){if(a.preventDefault(),"ok"===c(this).attr("move")){e.ismove=!0,e.layero=c(this).parents("."+h[0]);var f=e.layero.offset().left,g=e.layero.offset().top,i=e.layero.outerWidth()-6,j=e.layero.outerHeight()-6;c("#layui-layer-moves")[0]||c("body").append('<div id="layui-layer-moves" class="layui-layer-moves" style="left:'+f+"px; top:"+g+"px; width:"+i+"px; height:"+j+'px; z-index:2147483584"></div>'),e.move=c("#layui-layer-moves"),b.moveType&&e.move.css({visibility:"hidden"}),e.moveX=a.pageX-e.move.position().left,e.moveY=a.pageY-e.move.position().top,"fixed"!==e.layero.css("position")||(e.setY=d.scrollTop())}}),c(document).mousemove(function(a){if(e.ismove){var c=a.pageX-e.moveX,f=a.pageY-e.moveY;if(a.preventDefault(),!b.moveOut){e.setY=d.scrollTop();var g=d.width()-e.move.outerWidth(),h=e.setY;0>c&&(c=0),c>g&&(c=g),h>f&&(f=h),f>d.height()-e.move.outerHeight()+e.setY&&(f=d.height()-e.move.outerHeight()+e.setY)}e.move.css({left:c,top:f}),b.moveType&&e.moveLayer(),c=f=g=h=null}}).mouseup(function(){try{e.ismove&&(e.moveLayer(),e.move.remove(),b.moveEnd&&b.moveEnd()),e.ismove=!1}catch(a){e.ismove=!1}}),a},g.pt.callback=function(){function a(){var a=g.cancel&&g.cancel(b.index,d);a===!1||f.close(b.index)}var b=this,d=b.layero,g=b.config;b.openLayer(),g.success&&(2==g.type?d.find("iframe").on("load",function(){g.success(d,b.index)}):g.success(d,b.index)),f.ie6&&b.IE6(d),d.find("."+h[6]).children("a").on("click",function(){var a=c(this).index();if(0===a)g.yes?g.yes(b.index,d):g.btn1?g.btn1(b.index,d):f.close(b.index);else{var e=g["btn"+(a+1)]&&g["btn"+(a+1)](b.index,d);e===!1||f.close(b.index)}}),d.find("."+h[7]).on("click",a),g.shadeClose&&c("#layui-layer-shade"+b.index).on("click",function(){f.close(b.index)}),d.find(".layui-layer-min").on("click",function(){var a=g.min&&g.min(d);a===!1||f.min(b.index,g)}),d.find(".layui-layer-max").on("click",function(){c(this).hasClass("layui-layer-maxmin")?(f.restore(b.index),g.restore&&g.restore(d)):(f.full(b.index,g),setTimeout(function(){g.full&&g.full(d)},100))}),g.end&&(e.end[b.index]=g.end)},e.reselect=function(){c.each(c("select"),function(a,b){var d=c(this);d.parents("."+h[0])[0]||1==d.attr("layer")&&c("."+h[0]).length<1&&d.removeAttr("layer").show(),d=null})},g.pt.IE6=function(a){function b(){a.css({top:f+(e.config.fix?d.scrollTop():0)})}var e=this,f=a.offset().top;b(),d.scroll(b),c("select").each(function(a,b){var d=c(this);d.parents("."+h[0])[0]||"none"===d.css("display")||d.attr({layer:"1"}).hide(),d=null})},g.pt.openLayer=function(){var a=this;f.zIndex=a.config.zIndex,f.setTop=function(a){var b=function(){f.zIndex++,a.css("z-index",f.zIndex+1)};return f.zIndex=parseInt(a[0].style.zIndex),a.on("mousedown",b),f.zIndex}},e.record=function(a){var b=[a.width(),a.height(),a.position().top,a.position().left+parseFloat(a.css("margin-left"))];a.find(".layui-layer-max").addClass("layui-layer-maxmin"),a.attr({area:b})},e.rescollbar=function(a){h.html.attr("layer-full")==a&&(h.html[0].style.removeProperty?h.html[0].style.removeProperty("overflow"):h.html[0].style.removeAttribute("overflow"),h.html.removeAttr("layer-full"))},a.layer=f,f.getChildFrame=function(a,b){return b=b||c("."+h[4]).attr("times"),c("#"+h[0]+b).find("iframe").contents().find(a)},f.getFrameIndex=function(a){return c("#"+a).parents("."+h[4]).attr("times")},f.iframeAuto=function(a){if(a){var b=f.getChildFrame("html",a).outerHeight(),d=c("#"+h[0]+a),e=d.find(h[1]).outerHeight()||0,g=d.find("."+h[6]).outerHeight()||0;d.css({height:b+e+g}),d.find("iframe").css({height:b})}},f.iframeSrc=function(a,b){c("#"+h[0]+a).find("iframe").attr("src",b)},f.style=function(a,b){var d=c("#"+h[0]+a),f=d.attr("type"),g=d.find(h[1]).outerHeight()||0,i=d.find("."+h[6]).outerHeight()||0;(f===e.type[1]||f===e.type[2])&&(d.css(b),f===e.type[2]&&d.find("iframe").css({height:parseFloat(b.height)-g-i}))},f.min=function(a,b){var d=c("#"+h[0]+a),g=d.find(h[1]).outerHeight()||0;e.record(d),f.style(a,{width:180,height:g,overflow:"hidden"}),d.find(".layui-layer-min").hide(),"page"===d.attr("type")&&d.find(h[4]).hide(),e.rescollbar(a)},f.restore=function(a){var b=c("#"+h[0]+a),d=b.attr("area").split(",");b.attr("type");f.style(a,{width:parseFloat(d[0]),height:parseFloat(d[1]),top:parseFloat(d[2]),left:parseFloat(d[3]),overflow:"visible"}),b.find(".layui-layer-max").removeClass("layui-layer-maxmin"),b.find(".layui-layer-min").show(),"page"===b.attr("type")&&b.find(h[4]).show(),e.rescollbar(a)},f.full=function(a){var b,g=c("#"+h[0]+a);e.record(g),h.html.attr("layer-full")||h.html.css("overflow","hidden").attr("layer-full",a),clearTimeout(b),b=setTimeout(function(){var b="fixed"===g.css("position");f.style(a,{top:b?0:d.scrollTop(),left:b?0:d.scrollLeft(),width:d.width(),height:d.height()}),g.find(".layui-layer-min").hide()},100)},f.title=function(a,b){var d=c("#"+h[0]+(b||f.index)).find(h[1]);d.html(a)},f.close=function(a){var b=c("#"+h[0]+a),d=b.attr("type");if(b[0]){if(d===e.type[1]&&"object"===b.attr("conType")){b.children(":not(."+h[5]+")").remove();for(var g=0;2>g;g++)b.find(".layui-layer-wrap").unwrap().hide()}else{if(d===e.type[2])try{var i=c("#"+h[4]+a)[0];i.contentWindow.document.write(""),i.contentWindow.close(),b.find("."+h[5])[0].removeChild(i)}catch(j){}b[0].innerHTML="",b.remove()}c("#layui-layer-moves, #layui-layer-shade"+a).remove(),f.ie6&&e.reselect(),e.rescollbar(a),c(document).off("keydown",e.enter),"function"==typeof e.end[a]&&e.end[a](),delete e.end[a]}},f.closeAll=function(a){c.each(c("."+h[0]),function(){var b=c(this),d=a?b.attr("type")===a:1;d&&f.close(b.attr("times")),d=null})};var i=f.cache||{},j=function(a){return i.skin?" "+i.skin+" "+i.skin+"-"+a:""};f.prompt=function(a,b){a=a||{},"function"==typeof a&&(b=a);var d,e=2==a.formType?'<textarea class="layui-layer-input">'+(a.value||"")+"</textarea>":function(){return'<input type="'+(1==a.formType?"password":"text")+'" class="layui-layer-input" value="'+(a.value||"")+'">'}();return f.open(c.extend({btn:["&#x786E;&#x5B9A;","&#x53D6;&#x6D88;"],content:e,skin:"layui-layer-prompt"+j("prompt"),success:function(a){d=a.find(".layui-layer-input"),d.focus()},yes:function(c){var e=d.val();""===e?d.focus():e.length>(a.maxlength||500)?f.tips("&#x6700;&#x591A;&#x8F93;&#x5165;"+(a.maxlength||500)+"&#x4E2A;&#x5B57;&#x6570;",d,{tips:1}):b&&b(e,c,d)}},a))},f.tab=function(a){a=a||{};var b=a.tab||{};return f.open(c.extend({type:1,skin:"layui-layer-tab"+j("tab"),title:function(){var a=b.length,c=1,d="";if(a>0)for(d='<span class="layui-layer-tabnow">'+b[0].title+"</span>";a>c;c++)d+="<span>"+b[c].title+"</span>";return d}(),content:'<ul class="layui-layer-tabmain">'+function(){var a=b.length,c=1,d="";if(a>0)for(d='<li class="layui-layer-tabli xubox_tab_layer">'+(b[0].content||"no content")+"</li>";a>c;c++)d+='<li class="layui-layer-tabli">'+(b[c].content||"no  content")+"</li>";return d}()+"</ul>",success:function(b){var d=b.find(".layui-layer-title").children(),e=b.find(".layui-layer-tabmain").children();d.on("mousedown",function(b){b.stopPropagation?b.stopPropagation():b.cancelBubble=!0;var d=c(this),f=d.index();d.addClass("layui-layer-tabnow").siblings().removeClass("layui-layer-tabnow"),e.eq(f).show().siblings().hide(),"function"==typeof a.change&&a.change(f)})}},a))},f.photos=function(b,d,e){function g(a,b,c){var d=new Image;return d.src=a,d.complete?b(d):(d.onload=function(){d.onload=null,b(d)},void(d.onerror=function(a){d.onerror=null,c(a)}))}var h={};if(b=b||{},b.photos){var i=b.photos.constructor===Object,k=i?b.photos:{},l=k.data||[],m=k.start||0;if(h.imgIndex=(0|m)+1,b.img=b.img||"img",i){if(0===l.length)return f.msg("&#x6CA1;&#x6709;&#x56FE;&#x7247;")}else{var n=c(b.photos),o=function(){l=[],n.find(b.img).each(function(a){var b=c(this);b.attr("layer-index",a),l.push({alt:b.attr("alt"),pid:b.attr("layer-pid"),src:b.attr("layer-src")||b.attr("src"),thumb:b.attr("src")})})};if(o(),0===l.length)return;if(d||n.on("click",b.img,function(){var a=c(this),d=a.attr("layer-index");f.photos(c.extend(b,{photos:{start:d,data:l,tab:b.tab},full:b.full}),!0),o()}),!d)return}h.imgprev=function(a){h.imgIndex--,h.imgIndex<1&&(h.imgIndex=l.length),h.tabimg(a)},h.imgnext=function(a,b){h.imgIndex++,h.imgIndex>l.length&&(h.imgIndex=1,b)||h.tabimg(a)},h.keyup=function(a){if(!h.end){var b=a.keyCode;a.preventDefault(),37===b?h.imgprev(!0):39===b?h.imgnext(!0):27===b&&f.close(h.index)}},h.tabimg=function(a){l.length<=1||(k.start=h.imgIndex-1,f.close(h.index),f.photos(b,!0,a))},h.event=function(){h.bigimg.hover(function(){h.imgsee.show()},function(){h.imgsee.hide()}),h.bigimg.find(".layui-layer-imgprev").on("click",function(a){a.preventDefault(),h.imgprev()}),h.bigimg.find(".layui-layer-imgnext").on("click",function(a){a.preventDefault(),h.imgnext()}),c(document).on("keyup",h.keyup)},h.loadi=f.load(1,{shade:"shade"in b?!1:.9,scrollbar:!1}),g(l[m].src,function(d){f.close(h.loadi),h.index=f.open(c.extend({type:1,area:function(){var e=[d.width,d.height],f=[c(a).width()-50,c(a).height()-50];return!b.full&&e[0]>f[0]&&(e[0]=f[0],e[1]=e[0]*d.height/d.width),[e[0]+"px",e[1]+"px"]}(),title:!1,shade:.9,shadeClose:!0,closeBtn:!1,move:".layui-layer-phimg img",moveType:1,scrollbar:!1,moveOut:!0,shift:5*Math.random()|0,skin:"layui-layer-photos"+j("photos"),content:'<div class="layui-layer-phimg"><img src="'+l[m].src+'" alt="'+(l[m].alt||"")+'" layer-pid="'+l[m].pid+'"><div class="layui-layer-imgsee">'+(l.length>1?'<span class="layui-layer-imguide"><a href="javascript:;" class="layui-layer-iconext layui-layer-imgprev"></a><a href="javascript:;" class="layui-layer-iconext layui-layer-imgnext"></a></span>':"")+'<div class="layui-layer-imgbar" style="display:'+(e?"block":"")+'"><span class="layui-layer-imgtit"><a href="javascript:;">'+(l[m].alt||"")+"</a><em>"+h.imgIndex+"/"+l.length+"</em></span></div></div></div>",success:function(a,c){h.bigimg=a.find(".layui-layer-phimg"),h.imgsee=a.find(".layui-layer-imguide,.layui-layer-imgbar"),h.event(a),b.tab&&b.tab(l[m],a)},end:function(){h.end=!0,c(document).off("keyup",h.keyup)}},b))},function(){f.close(h.loadi),f.msg("&#x5F53;&#x524D;&#x56FE;&#x7247;&#x5730;&#x5740;&#x5F02;&#x5E38;<br>&#x662F;&#x5426;&#x7EE7;&#x7EED;&#x67E5;&#x770B;&#x4E0B;&#x4E00;&#x5F20;&#xFF1F;",{time:3e4,btn:["&#x4E0B;&#x4E00;&#x5F20;","&#x4E0D;&#x770B;&#x4E86;"],yes:function(){l.length>1&&h.imgnext(!0,!0)}})})}},e.run=function(){c=jQuery,d=c(a),h.html=c("html"),f.open=function(a){var b=new g(a);return b.index}},"function"==typeof define?define(function(){return e.run(),f}):function(){e.run(),f.use("skin/layer.css")}()}(window);
layer.config({title:"温馨提示"});
layer.msgWarn=layer.alert;
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
$.ajaxSetup({
	dataType: "json",
	type: "post",
	url: _AJAXUrl,
	cache:false,
	beforeSend: function(xhr) {
		if (this.load) {
			layer.load(0,{shade:.17});
		}
	},
	complete:function(){
		if (this.load) {
			layer.closeAll('loading');
		}
	},
	error:function(){
		console.error(this);
	}
});
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
if (UserName) {
    paraArr = paraArr.concat(VerifyUserArr,UserCacheArr);
}else{
    clearlocalStorage(UserCacheArr);
}
var today = new Date().format('YYYYMMdd');
if (localStorage.getItem('Today')!==today) {
    localStorage.setItem('RankingList','');
    if (new Date().format('hhmm')*1>20) {
        clearlocalStorage(DailyCacheArr);
        localStorage.setItem('Today',today);
        paraArr.concat(DailyCacheArr);
    }
}
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
}
function RenDataFilter(data){
	for(var k in data){
		if(data[k]==null){
			data[k]='';
		}
	}
	if (data.GradeList&&data.GradeList.length) {
		for (var i = data.GradeList.length - 1; i >= 0; i--) {
			data.GradeList[i].Grade=Number(data.GradeList[i].Grade);
			data.GradeList[i].GradeGrow=Number(data.GradeList[i].GradeGrow);
			data.GradeList[i].Bonus=Number(data.GradeList[i].Bonus);
			data.GradeList[i].JumpBonus=Number(data.GradeList[i].JumpBonus);
		}
	}
	var LotteryList = data.LotteryList;
	if (LotteryList) {
		if (LotteryList.length) {
			data.LotteryList = {};
			for (var i = LotteryList.length - 1; i >= 0; i--) {
				data.LotteryList[LotteryList[i].LotteryCode] = LotteryList[i]
				delete LotteryList[i].LotteryCode
			}
		} else {
			delete data.LotteryList;
		}
	}
	if(data.ServiceRating){
		data.ServiceRating.WithdrawTime=data.ServiceRating.WithdrawTime*1;
		data.ServiceRating.RechargeTime=data.ServiceRating.RechargeTime*1;
    if(data.ServiceRating.WithdrawTime<0) data.ServiceRating.WithdrawTime=0;
    if(data.ServiceRating.RechargeTime<0) data.ServiceRating.RechargeTime=0;
	}
    if(data.LotteryConfig&&!data.LotteryConfig.length){
      delete data.LotteryConfig;
    }
	return data;
}
function RenDefault(data){
  ;(function(d){
    if (!d||d.State) {return}
    layer.open({
      shadeClose: false,
      title: "恭喜",
      content: '恭喜您成功晋级，当前等级为VIP'+d.Grade+'，<br/>赶紧到活动中心领取奖励吧。',
      className: "layerConfirm",
      btn: ["领取奖励", "留在本页"],
      end:function(){
      sessionStorage.setItem('UpGradeReaded',1);
      },
      yes: function(Lindex) {
      layer.close(Lindex);
      location.href = "/activity.html";
      }
    })
  })(data.UserUpGradeBonus)
	/*if (data.LotteryConfig) {
		for (var i = 0; i < data.LotteryConfig.length; i++) {
			if (data.LotteryConfig[i].LotteryClassID=="14") {
				(function(LotteryList){
					function GetLotteryPlan(lottery_code) {
					  $.ajax({
						data: {
						  Action: "GetLotteryPlan",
						  Qort: lottery_code
						},
					  })
					  .done(function(data) {
						if (data.Code === 1) {
						  localStorage.setItem("lotteryPlan"+lottery_code, JSON.stringify(data.Data));
						}
					  })
					}
					function saveLotteryPlan(){
					  for (var i = LotteryList.length - 1; i >= 0; i--) {
						if (!localStorage.getItem("lotteryPlan"+LotteryList[i])) {
						  GetLotteryPlan(LotteryList[i]);
						}
					  }
					}
					saveLotteryPlan();
				})(data.LotteryConfig[i].LotteryList)
			}
		}
	}*/
  ;(function(F){
    if (F) {
      function LogOut(){
        $.ajax({
          data: { action: "LogOut" },
          async:false,
          load:true,
          success: function(data) {
            if (data.Code == "1") {
              alert(F);
              location.href='/login.html'
              /*layer.alert(F,{
                end:function(){
                  location.href='/login.html'
                }
              })*/
            } else {
              LogOut();
            }
          }
        });
      }
      LogOut();
    }
  })(data.UserFreeze)
}
/**
 * [ajaxGetRenData 通过ajax去获取首屏数据,并进行缓存,如果有回调则执行回调函数]
 * @param  {[数组]} Arr        [需要获取的数据有哪些]
 * @param  {[函数]} fun        [得到数据后的处理方式]
 * @param  {int} time          [(可选),最多查询几次]
 * @return {[无]}
 */
function ajaxGetRenData(Arr, fun, time) {
	time = time || 0;
	time++;
	if (time == 2) {
		console.log("GetInitData error");
		return;
	} else if (time > 1) {
		console.log("GetInitData time " + time);
	}
	var len = Arr.length,
		renderData = {},
		ajaxArr = [],
		ajaxData={
			"Action": "GetInitData",
			"Requirement": JSON.stringify(Arr),
			"CacheData":localStorage.getItem('CacheData')
		};
	// console.log(ajaxData);
	$.ajax({
		data: ajaxData,
		success: function(data) {
			if (data.Code == 1||data.Code == 0) {
        sessionStorage.setItem('NeedGetRenData',0);
				var resultArr = RenDataFilter(data.BackData);
				for(var k in resultArr){
					renderData[k] = resultArr[k];
					//如果参数在paraArr数组中存在，才存储至localStorage，否则不存储
					if ($.inArray(k, paraArr) > -1) {
						if (data.CacheData&&data.CacheData[k]) {
						  CacheData[k]=data.CacheData[k];
						}
						if (typeof(resultArr[k])=='object') {
						localStorage.setItem(k, JSON.stringify(resultArr[k]));
						}else{
						localStorage.setItem(k, resultArr[k]);
						}
					}
				}
				// console.log(CacheData);
				localStorage.setItem('CacheData',JSON.stringify(CacheData));
				RenDefault(resultArr);
				fun(renderData);
				/*if (data.Code!=localStorage.getItem('Login')) {
					var newArr = UserCacheArr.concat(VerifyUserArr,UserNoCacheArr)
				  if (data.Code === 0) {
					clearlocalStorage(newArr);
				  }else{
					ajaxGetRenData(newArr,function(){});
				  }
				  localStorage.setItem('Login',data.Code);
				}*/
			} else {
				ajaxGetRenData(ajaxArr, fun, time);
				console.log('返回数据错误');
			}
		}

	})
}


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

	if (ajaxArr.length) {
		ajaxGetRenData(ajaxArr, fun)
	} else {
		console.log("已全部缓存");
	}
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
	})
	/*顶部使用的下拉列表,显示金额 end*/

	;(function(){
		var hasSafePwd; //是否有安全密码
		var firstCard;   //第一张银行卡信息
		var aboutArr;   //关于我们的列表
		var helpArr;    //新手教程的列表
        paraArr=UserName?paraArr.concat(UserNoCacheArr):paraArr;
    var _count = 0;
		// console.log(paraArr)
    getRenData(paraArr,function(renderData){
      if (UserName) {
          (function(d){
              if (d&&d.length) {
                  d=d[0];
                  // console.log(d);
                  if (sessionStorage.getItem('dontLookOldNotive')==d.ID) {return;}
                  var NoticeBar = "<div class='notice'><div class='noticCon'>\
                    <h3>网站最新公告 <a class='iconfont closeNotice'>&#xe618;</a></h3>\
                    <ul><li><a class='MustLogin' href='NoticeDetail.html?id="+d.ID+"'><i></i>"+d.Title+"<br>["+d.Add_Time+"]</a></li>\
                    </ul></div></div>";
                  NoticeBar = $(NoticeBar);
                  NoticeBar.appendTo("body").find(".closeNotice").on("click",function(){
                      NoticeBar.remove();
                      sessionStorage.setItem('dontLookOldNotive',d.ID);
                  });
              }
          })(renderData.NoticeData)
          ;(function(data){
              if (!data) {return}
              console.log(data);
              var len=data.length,
                  lenNum=len>=5?"5+":len;
              var dataArr=['<dt>\
                      <p>我的未读消息(<small>'+lenNum+'</small>)</p>\
                      <a href="letter.html">更多</a>\
                      </dt>\
                      <dd>'];
              for(var i=0;i<len;i++){
                  var lidata=data[i];
                  dataArr.push('<p class="mList"><a href="letterDetail.html?id='+lidata.ID+'">'+lidata.Title+'</a></p>')
              }
              dataArr.push('</dd>');
              $("#unreadMsgNum").text(lenNum);
              $(".MessageShowContent dl").html(dataArr.join(''));
          })(renderData.UserUnread)
      }
			if (UserName&&renderData.UserPhoto) {
				$(".userName ").find("img").attr("src",_Path.Host.img+_Path.path.photos+renderData.UserPhoto);
			}
			/*帮助中心与关于我们start*/
			aboutArr = renderData.FooterConfig;
			helpArr = renderData.HelpConfig;
			if(aboutArr && aboutArr.length){
				var str = [];
				for(var i = 0; i < aboutArr.length;i++){
					str.push('<a href="./about.html?' + aboutArr[i].ID + '">' +aboutArr[i].Title + '</a>');
				}
				$('._about p').eq(0).html(str.join('|'));
			}
			if(helpArr&&helpArr.length){
				var guide = document.getElementById("guide");
				if (guide) {
					guide.href='/helpCenter.html?' + helpArr[0].ID;
					guide.parentNode.style.display='block';
					if (!UserName&&_Path.path.thisPath==='/index.html') {
						$(".help").on('click',function(){
							location.href=document.getElementById("guide").href;
						})
					}
				}
			}
			/*帮助中心与关于我们end*/
			(function(SiteConfig){
				if(!SiteConfig) return;
				var title = document.getElementsByTagName('title')[0],
					tStr=title.innerText,
					Name = SiteConfig.Name,
					Service = SiteConfig.Service,
					Logo = SiteConfig.PCLogo;
				if (Name) {
					$(".siteName").html(Name);
					var Hi = document.getElementById('Hi');
					if(_Path.IsLottery){
						Hi.href='/';
					}else{
						Hi.innerText="Hi，欢迎来到"+Name+"！";
					}
					var lottery = W_GetRequest().lottery;
					if(lottery){
						document.title = Name+'-'
						getRenData(['LotteryList'],function(LotteryList){
							LotteryList=LotteryList.LotteryList;
							if(LotteryList){
								lottery=LotteryList[lottery].LotteryName;
								document.title = document.title+lottery
							}
						})
					}else{
						document.title = Name+'-'+tStr;
					}
				}
				if (_Path.path.thisPath==='/index.html'&&SiteConfig.Title) {
					document.title = SiteConfig.Title;
				}
				if (Logo) {
					var L1= document.getElementById('Logo1');
					if(L1){
					  L1.src=_Path.Host.img+Logo.logo1;
					  L1.style.display='block';
					}
					var L2= document.getElementById('Logo2');
					if(L2){
					  L2.src=_Path.Host.img+Logo.logo2;
					  L2.style.display='block';
					}
				}
				if (Service) {
					$('.ServiceBtn').on('click', function(event) {
						var h=window.screen.height-80,w=window.screen.width,t,l;
						if (w<Service.Width) {Service.Width=w*0.9}
						if (h<Service.Height) {Service.Height=h*0.9}
						t= ( h-Service.Height)/2;
						l= (w-Service.Width)/2;
						window.open(Service.Url, '_blank', 'top='+t+',left='+l+',width='+Service.Width+',height='+Service.Height);
					});
				}
			})(renderData.SiteConfig)
			if (renderData.AgentRebate) {
				$('.slideUser').find('ul:eq(3)').show();
				$('.accountList').find('a:gt(2)').show();
			}
			if(renderData.CloudUrl){
				$('#dafaCloud').attr({href:renderData.CloudUrl,target:"_blank"});
			}
			;(function(data){
				if(!data)return;
				var arr = [{
					now: 0,
					finish: data.RechargeTime
				}, {
					now: 0,
					finish: data.WithdrawTime
				}];
				arr[0].max=Math.round(arr[0].finish*2/60)*60;
				arr[1].max=Math.round(arr[1].finish*2/60)*60;
				arr[0].max=arr[0].max||60;
				arr[1].max=arr[1].max||60;
				var duration=1500,Frames=24;
				var speed=100000/(duration*Frames),count=0,footBar=$(".footBar");
				var rBar = footBar.eq(0).find('span'),
					wBar = footBar.eq(1).find('span'),
					rTxt = footBar.eq(0).next().get(0),
					wTxt = footBar.eq(1).next().get(0);
				var Inter = setInterval(function() {
					count++;
					var p = 100-Math.abs(100-count*speed);
					arr[0].now = Math.round(p*arr[0].max/100);
					arr[1].now = Math.round(p*arr[1].max/100);
					if(count*speed>100){
						if(arr[0].now<arr[0].finish){
							arr[0].now=arr[0].finish
						}
						if(arr[1].now<arr[1].finish){
							arr[1].now=arr[1].finish
						}
						if(arr[0].now==arr[0].finish&&arr[1].now==arr[1].finish){
							clearInterval(Inter);
						}
					}
					arr[0].minutes = Math.floor(arr[0].now/60)>0?Math.floor(arr[0].now/60)+"'":"";
					arr[1].minutes = Math.floor(arr[1].now/60)>0?Math.floor(arr[1].now/60)+"'":"";
					arr[0].seconds = arr[0].now%60>10?arr[0].now%60:"0"+arr[0].now%60;
					arr[1].seconds = arr[1].now%60>10?arr[1].now%60:"0"+arr[1].now%60;
					arr[0].text =[arr[0].minutes,arr[0].seconds];
					arr[0].text=arr[0].text.join("");
					arr[1].text =[arr[1].minutes,arr[1].seconds];
					arr[1].text=arr[1].text.join("");
					rBar.css('width',arr[0].now*100/arr[0].max+'%');
					rTxt.innerText=arr[0].text;
					wBar.css('width',arr[1].now*100/arr[1].max+'%');
					wTxt.innerText=arr[1].text;
				},1000/Frames)
			})(renderData.ServiceRating)
			//更多彩种
			;(function(LotteryConfig){
				_count ++
				if(_count < 2){
					var path = _Path.path.thisPath;
					if(path === '/gamebet_cqssc.html'){
						$('.gameBet').prepend('<table class="betMoreList"></table>')
					}else{
						$('.container.bet').prepend('<table class="betMoreList"></table>')
					}

					//更多彩种--显隐
				  $('.betNavMore').on('mouseenter', function(){
				    if($('.betMoreList').css('display') == 'none'){
				      $('.betNavMore').addClass('active')
				      $('.betMoreList').show();
				    }
				  });

					var rData = {}; //用来渲染的数据

					if(LotteryConfig){
	          getRenData(['LotteryList'],function(data){
	            var lConfig = LotteryConfig;
	            var lList = data.LotteryList;
	            var baseArr = lConfig.map(function(item){
	            	item = item.LotteryClassName;
	            	if(item === '热门')return;
	            	return item;
	            })
	            // console.log(lConfig, lList)
	            baseArr.forEach(function(item){
	              lConfig.forEach(function(group){
	                if(item === group.LotteryClassName){
	                  rData[item] = group.LotteryList.map(function(stuff){
	                    var href = './gameBet_cqssc.html?lottery=';
	                    var address = {
	                      '快3': './lottery_k3.html?lottery=',
	                      '时时彩': './lottery_ssc.html?lottery='
	                    }
	                    href = address[item] ? address[item]: href;
	                    return {'code': stuff, 'name': lList[stuff].LotteryName, 'href': href + stuff}
	                  })
	                }
	              })
	            })

	            actualRen();

	            function actualRen(){
	              var titleStr = '';
	              var bodyStr = '';
	              var table = {
	              	'k3': '快3',
	              	'ssc': '时时彩'
	              }
	              var type = table[path.replace(/\/lottery_(\w+).html/, '$1')];
	              var columnNum = [];

	              for(var item in rData){
	                titleStr += '<th>' + item + '</th>';
	                //是不是本彩种的
	                if(item === type){
	                  var tdStr = '';
	                  rData[item].forEach(function(un){
	                    var name = un.name === '内蒙古快3' ? '内蒙快3' : un.name;
	                    tdStr += '<a class = "_selfMode" data = "' + un.code + '">' + name + '</a>';
	                  });
	                  bodyStr += '<td>' + tdStr + '</td>';
	                  columnNum.push(rData[item].length)
	                }else{
	                  var tdStr = '';
	                  rData[item].forEach(function(un){
	                    var name = un.name === '内蒙古快3' ? '内蒙快3' : un.name;
	                    tdStr += '<a href = "' + un.href + '">' + name + '</a>'
	                  });
	                  bodyStr += '<td>' + tdStr + '</td>';
	                  columnNum.push(rData[item].length)
	                }
	              }
	              //整个表格的渲染字符串
	              var str = '<tr>' + titleStr +'</tr>' + '<tr>' + bodyStr +'</tr>';
	              var $betList = $('.betMoreList');
	              $betList.html(str);

	              columnNum.forEach(function(item, index){
	              	var width = 33
	              	var col = Math.ceil(item/5);

	              	width += col * 60;
	              	if(col > 1){
	              		$betList.find('th:eq('+index+')').css('width', (width+1) + 'px');
	              	}
	              })

	              $betList.on('click', '._selfMode', function(){
	                var code = this.getAttribute('data');
	                $('.betNav li[data="'+code+'"]').trigger('click');
	                $betList.hide();
	              }).on('mouseleave', function(){
	                $('.betNavMore').removeClass('active');
	                $betList.hide()
	              })
	            }
	          })
	        }

				}
			})(renderData.LotteryConfig)
      ;(function(level){
        level=level&&(level.Grade>2)
        if (level&&!_Path.IsLottery) {
          $('.betNavMore').show().text("线路切换").css("color","#e4393c").attr('href','/Ping.html').addClass('pingLink').prev().show()
        }
      })(renderData.UserUpGradeBonus)
		})
	})()

	$('#toWithdraw').on('click', function(){
		ajaxGetRenData(['UserHasSafePwd','UserFirstCardInfo'],function(data){
			withdrawBtnCheck(data);
		})
	})

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
  if (!localStorage.getItem('Difftime')) {
      getServerTime(function(serTime){
          localStorage.setItem('Difftime',new Date().getTime()-serTime+GMTdif);
      });
  }
  ;(function(){
    // 强制踩点功能
    if(UserName) return;
    var t = sessionStorage.getItem('NeedGetRenData');
    console.log(t);
    if (!t||t==4) {
      ajaxGetRenData(['CloudUrl'],function(){});
    }else{
      sessionStorage.setItem('NeedGetRenData',t*1+1);
    }
  })()
})

//刷新缓存数据
function refreshData(arr,fun){
	clearlocalStorage(arr);
	ajaxGetRenData(arr,fun)
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
/*获取服务器时间*/
function getServerTime(fun) {
  $.ajax({
    data: {Action: "GetServerTimeMillisecond"},
    success:function(data){
      if (data.Code === 1) {
        fun(Number(data.Data));
      } else {
        cantGetTime++;
        if (cantGetTime > 4) {
          layer.msgWarn("因无法同步服务器时间,您将无法投注,请检查网络情况")
        } else {
          getServerTime();
        }
      }
    }
  })
}