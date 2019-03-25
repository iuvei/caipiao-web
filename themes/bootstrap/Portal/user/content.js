var url = 'bf.jjvsmm.com';
var websocket;
var typeid;
var userid;
var wfid;
var jsq;
var kjdjs;
var zsid=0;
function alert(msg){
  layer.msg(msg);
}
$(document).ready(function(){
  websocket = new WebSocket("ws://"+url+":8585");
websocket.onmessage = function(event) {
        zdata=JSON.parse(event.data);
        console.log(zdata);
        window[zdata.act](zdata.msg);
};
});
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
  data.time=data.time-1;
  if(data.time>600){
    $('#'+data.id).html('预售中');
  }
  else if(data.time<=0){
    clearTimeout(jsq);
    xztype(typeid);
    return;
  }
  else{
  $('#'+data.id).html(hdtime(data.time));
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
                }
                if(data.status==1){
                    alert(data.info);
                    $('.checkedList table').html('');
                    $('#order').html('');
                    $('.betTotal em').eq(1).html(0);
                    $('.betTotal .money').html("￥ 0.00");
                    xzwf(wfid);
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
      if(money<0){
          money=0;
          $('#zsid'+id+" .eachPrice").val('0');
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