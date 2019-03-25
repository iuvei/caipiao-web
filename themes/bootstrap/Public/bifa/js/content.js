var url = 'bf.jjvsmm.com';
var websocket;
var typeid;
var userid;
var wfid;
var jsq;
var kjdjs;
var zsid=0;
var tzzt=0;
alert=layer.msg;
var tjzt=1;
$(document).ready(function(){
  websocket = new WebSocket("ws://"+url+":8585");
websocket.onmessage = function(event) {
        zdata=JSON.parse(event.data);
        console.log(zdata);
        window[zdata.act](zdata.msg);
};
websocket.onclose = function(event) {
  websocket = new WebSocket("ws://"+url+":8585");
};
});
function setdzxs(data){
  dzxs=data;
}
function xztype(id){
  clearTimeout(jsq);
  typeid=id;
  zsid=0;
  $('.checkedList table').html('');
  $('#order').html('');
  jsze();
  $('.typelist li').removeClass('active');
  $('#type'+id).addClass('active');
  $('#title').html($('#type'+id).html());
  var fs = {};
  fs.id=id;
  fs.wfid=wfid;
  fs.userid=userid;
  fs.act='xztype';
  var jsonStr = JSON.stringify(fs);
  websocket.send(jsonStr);
}
function xzwf(id){
  wfid=id;
  $('#wf li').removeClass('curr');
  $('#wf'+id).addClass('curr');
  var fs = {};
  fs.wfid=id;
  fs.userid=userid;
  fs.act='xzwf';
  var jsonStr = JSON.stringify(fs);
  websocket.send(jsonStr);
}
// function djskj(data){
//   //kjdjs=setTimeout('kjxx('+data+')',1000);
// }
function kjxx(data){
  clearTimeout(kjdjs);
  var fs = {};
  fs.typeid=typeid;
  fs.id=data;
  fs.act='kjxx';
  var jsonStr = JSON.stringify(fs);
  websocket.send(jsonStr);
}
function kjtz(data){
  var fs = {};
  fs.typeid=typeid;
  fs.id=data;
  fs.userid=userid;
  fs.act='kjtz';
  var jsonStr = JSON.stringify(fs);
  websocket.send(jsonStr);
}
function addhtml(data){
  $('#'+data.id).html(data.html);
}
function djs(data){
  var sj=data.time-Date.parse(new Date())/1000+sjc;
  if(sj>6000){
    tzzt=1;
    $('#'+data.id).html('预售中');
  }
  else if(sj<dzxs&&sj>0){
    $('#'+data.id).html('暂停投注');
    tzzt=0;
  }
  else if(sj<=0){
    tzzt=1;
    clearTimeout(jsq);
    xztype(typeid);
    return;
  }
  else{
    tzzt=1;
  $('#'+data.id).html(hdtime(sj-dzxs));
  }
  jsq=setTimeout('data={};data.time='+data.time+';data.id="'+data.id+'";djs(data);',1000);
}
function dqqs(data){
  layer.alert('当前期号为<b style="color:red">'+data+'</b>，<br>投注时请注意期号');
  $('#NowIssue').html('距<b>'+data+'</b>期投注截止还有：<em id="TimeBar">--</em>');
   $("#order div").each(function(){
          $(this).find('input[name="actionNo[]"]').val(data);
    })
}
function hdtime(id){
        var h=parseInt(id/3600);
        var m=parseInt((id-h*3600)/60);
        var s=id-h*3600-60*m;
        var x='';
        if(h<10){
          x=x+'0'+h;
        }
        else{
          x=x+h;
        }
        if(m<10){
          x=x+':0'+m;
        }
        else{
          x=x+':'+m;
        }
        if(s<10){
          x=x+':0'+s;
        }
        else{
          x=x+':'+s;
        }
        return x
    }
    function txhm(obj){
        if(obj.hasClass('active')){
            obj.removeClass('active');
        }
        else{
           obj.addClass('active');
        }
        zstj();
    }
    function tjbet(){
        if(tzzt==0){
          alert('本期暂停出售,等待下一期开放投注');
          return false;
        }
        var sfjx=1;
        $("#order div").each(function(){
            if($(this).find('input[name="amount[]"]').val()==0){
              alert('您有号码未设置金额,请核对后投注。');
              sfjx=0;
              return false;
            }
        })
        if(sfjx==0){
          return false;
        }
        if($('.betTotal em').eq(1).html()==0){
              alert('请至少选择一注投注号码！');
              return false;
        }
        var zhushu=0;
        var money=0;
        var qh=0;
        var a=[];
        $("#order div").each(function(){
          zhushu=zhushu-(-$(this).find('input[name="actionNum[]"]').val());
          money=money-(-$(this).find('input[name="amount[]"]').val()*$(this).find('input[name="actionNum[]"]').val()*$(this).find('input[name="beiShu[]"]').val()).toFixed(2);
          qh=$(this).find('input[name="actionNo[]"]').val();
          a.push('['+$(this).find('input[name="wfname[]"]').val()+']'+$(this).find('input[name="actionData[]"]').val());
        })
        var s='<div id="CheckBetLayer" class="lotteryConfirm" style="text-align: left;">\n<ul>\n<li><span>彩种：</span><em class="fill">'+$('#title').html()+'</em></li>\n<li><span>期号：</span>第<em class="fill">'+qh+'</em>期</li>\n<li><span>详情：</span><div class="fill textarea"><p>'+a.join("<br>")+'</p></div></li>\n<li><span>投注总金额：</span><em><em class="fill">'+money+'</em>元</em></li>\n</ul>\n</div>';
        tjzt=1;
        layer.open({
        content:s,
        area: ['450px', '450px'],
        title:'投注确认',
        btn: ['确认投注','取消'],
        yes:function(){
                  if(tjzt==1){
                  tjzt=0;
                  var action = "http://"+url+$("#order").attr('action');
                  $.ajax({
                      type: "POST",
                      url: action,
                      data: $("#order").serialize(),
                      dataType: "json",
                      success: function(data){
                          console.log(data);
                          if(data.status==0){
                                  alert(data.info);
                                  tjzt=1;
                          }
                          if(data.status==1){
                              alert(data.info);
                              $('#checkNumber li').removeClass('active');
                              $('.checkedList table').html('');
                              $('#order').html('');
                              jsze();
                              tjzt=1;
                          }
                      }
                  });
        }
        else{
          alert('提交中,请不要重复提交');
        }
      }
    });
    }
    function xzhm(obj,val,pl,ms){
        if(obj.hasClass('active')){
            delzs(obj.attr('zsid'));
        }
        else{
          zsid=zsid+1;
          obj.addClass('active');
          obj.attr('zsid',zsid);
          obj.attr('id','hmxx'+zsid);
          addzs(zsid,ms,val,pl,'1');
          $('#input'+zsid).attr('eq',obj.index());
        }
    }
    function addzs(zsid,ms,val,pl,zs){
        var html='<tr id="zsid'+zsid+'"><td><i class="order_type">['+ms+'] '+val+'</i></td>';      
            html=html+'<td><span class="order_zhushu">总共<i class="order_num c_red">'+zs+'</i>注</span></td><td>';
            html=html+'<i class="order_price">每注<input type="text" class="eachPrice" value="" onchange="zschange('+zsid+')">元</i>';
            html=html+'</td><td><i class="c_3">';
            html=html+'<span class="hide_this">可中金额：';                
            html=html+'<i class="orderMoney c_red">0</i>元';
            html=html+'</span></i></td><td><i class="orderCancel" onclick="delzs('+zsid+')">删除</i></td></tr>';
          $('.checkedList table').prepend(html);
          $('#zsid'+zsid+' input').focus();
          $('#zsid'+zsid).attr('pl',pl);
            var input='<div id="input'+zsid+'">';
                input=input+'<input type="hidden" name="playedId[]" value="'+wfid+'">';
                input=input+'<input type="hidden" name="type[]" value="'+typeid+'">';
                input=input+'<input type="hidden" name="actionNo[]" value="'+$('#NowIssue b').html()+'">';
                input=input+'<input type="hidden" name="actionNum[]" value="'+zs+'">';
                input=input+'<input type="hidden" name="actionData[]" value="'+val+'">';
                input=input+'<input type="hidden" name="amount[]" value="0">';
                input=input+'<input type="hidden" name="bonusProp[]" value="'+pl+'">';
                input=input+'<input type="hidden" name="beiShu[]" value="1">';
                input=input+'<input type="hidden" name="wfname[]" value="'+ms+'">';
                input=input+'</div>';
          $('#order').append(input);
          $('#input'+zsid).attr('zsid',zsid);
          jsze();
    }
    function jsze(){
        var zhushu=0;
        var money=0;
        $("#order div").each(function(){
          zhushu=zhushu-(-$(this).find('input[name="actionNum[]"]').val());
          money=money-(-$(this).find('input[name="amount[]"]').val()*$(this).find('input[name="actionNum[]"]').val()).toFixed(2);
        })
        $('.betTotal em').eq(1).html(zhushu);
        $('.betTotal .money').html("￥"+money.toFixed(2));
    }
    function zschange(id){
      var money=$('#zsid'+id+" .eachPrice").val();
      if(money%1!=0){
        money=0;
        $('#zsid'+id+" .eachPrice").val('');
      }
      if(money<0){
          money=0;
          $('#zsid'+id+" .eachPrice").val('');
      }
      var pl=$('#zsid'+id).attr('pl');
      $('#zsid'+id+" .orderMoney").html((money*pl).toFixed(2));

      $('#input'+id).find('input[name="amount[]"]').val(money);
      jsze();
    }
    function delzs(id){
      $('#hmxx'+id).removeClass('active');
      $('#zsid'+id).remove();
      $('#input'+id).remove();
      jsze();
    }
    function qrxz(){
      alert('号码选择不完整,请重新选择');
    }