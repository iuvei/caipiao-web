var url = 'bf.jjvsmm.com';
var websocket;
var typeid;
var userid;
var wfid;
var jsq;
var kjdjs;
var wfzid;
var zsid=0;
var zhqs=0;
var zhbs=1;
var tzzt=0;
var tjzt=1;
function alert(msg){
  layer.msg(msg);
}
function setdzxs(data){
  dzxs=data;
}
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
function xzzh(){
      var playedId=0;
      var amount=0;
  $("#order div").each(function(){
            if(!playedId){
              playedId=$(this).find('input[name="playedId[]"]').val();
            }
            if(!amount){
              amount=$(this).find('input[name="amount[]"]').val();
            }
            if(playedId!=$(this).find('input[name="playedId[]"]').val() || amount!=$(this).find('input[name="amount[]"]').val() ){
              alert('追号不支持混投，请确保您的投注都为同一玩法且元角分模式一致。');
             $('#zgtype').trigger('click');
             playedId='-1';
              return false;
            }
        })
  if(playedId=='-1'){
      return false;
  }
  if(!playedId){
      alert('请至少选择一注投注号码');
      $('#zgtype').trigger('click');
      return false;
    }
  $("#order div").each(function(){
    $(this).find('input[name="beiShu[]"]').val('1');
  })
  $(".checkedList ._planRate").each(function(){
    $(this).html('1倍');
  })
  jsze();
  var input='<p id="wfway"><input type="hidden" name="wfway" value="1"><input type="hidden" name="sftz" value="1"></p><p id="zhorder"></p>';
  $('#sftz').attr('checked','checked');
  $('#order').append(input);
  $('#tzbtn').hide();
  $('#zhlist').show();
  bs=1;
  zhqs=5;
  zhlist();
}
function sftz(n){
  if(n){
      $('#wfway input[name=sftz]').val('1');
  }
  else{
    $('#wfway input[name=sftz]').val('0');
  }

}
function zhqsact(qs){
  zhqs=qs;
  zhlist();
}
function zhbsact(bs){
  zhbs=bs;
  zhlist();
}
function zhlist(){
  var fs = {};
  fs.qs=zhqs;
  fs.id=typeid;
  fs.userid=userid;
  fs.act='zhlist';
  var jsonStr = JSON.stringify(fs);
  websocket.send(jsonStr);
}
function zhorder(data){
  console.log(data);
  var html='';
  var input='';
  for(i=0;i<data.length;i++){
    if(i==0){
      var dqhtml='(当前期)';
    }
    else{
      var dqhtml='';
    }
    var money=$('.betTotal .money').attr('data-money')*zhbs;
    html=html+'<tr id="zhorder'+data[i]['qs']+'">';
    html=html+'<td>'+(i-(-1))+'</td>'; 
    html=html+'<td><input onclick="zhsfxz('+data[i]['qs']+')" type="checkbox" checked >'+data[i]['qs']+'<em>'+dqhtml+'</em></td>'; 
    html=html+'<td><input  type="tel" value="'+zhbs+'" onchange="bscs('+data[i]['qs']+')" > 倍</td>'; 
    html=html+'<td>'+money.toFixed(2)+'元</td>';
    html=html+'<td>'+data[i]['time']+'</td>';
     html=html+'</tr>';
     var input=input+'<input id="radio'+data[i]['qs']+'" type=checkbox name="zhorder[]" value="'+data[i]['qs']+'" checked><input  name="zhbs[]" value="'+zhbs+'" type="tel" id="bs'+data[i]['qs']+'">';
  }
  $('#zhorder').html(input);
  $('#xzqslist').html(html);
  jsze2();
}
function allzh(n){
  if(n){
      $('#zhorder input').prop("checked",true);
      $("#xzqslist").find('input[type=checkbox]').prop("checked",true);
  }
  else{
     $('#zhorder input').prop("checked",false);
     $("#xzqslist").find('input[type=checkbox]').prop("checked",false);
  }
  jsze2();
}
function zhsfxz(qs){
  if($("#zhorder"+qs).find('input').eq(0).is(':checked')){
    $("#radio"+qs).prop("checked","checked");
  }
  else{
    $("#radio"+qs).prop("checked",false);
  }
  jsze2();
}
function bscs(qs){
  var bs=$("#zhorder"+qs).find('input').eq(1).val();
  $("#zhorder"+qs).find('td').eq('3').html(($('.betTotal .money').attr('data-money')*bs).toFixed(2)+'元');
  $("#bs"+qs).val(bs);
  jsze2();
}
function jsze2(){
        var zqs=0;
        var money=0;
        $("#xzqslist tr").each(function(){
          if($(this).find('input').eq(0).is(':checked')){
              zqs=zqs-(-1);
              money=money-(-$(this).find('input').eq(1).val()*$('.betTotal .money').attr('data-money'));
          }
        })
        $('.chaseDes em').eq(0).html(zqs);
        $('.chaseDes i').eq(0).html(zqs*$('.betTotal em').eq(2).html());
        $('.chaseDes em').eq(1).html(money);
}
function tjbet2(){
        if($('.chaseDes em').eq(0).html()==0){
              alert('请至少选择一注投注号码！');
              return false;
        }
         var zhushu=0;
        var money=0;
        var qh=0;
        var qh2=0;
        var a=[];
        $("#order div").each(function(){
          zhushu=zhushu-(-$(this).find('input[name="actionNum[]"]').val());
          money=money-(-$(this).find('input[name="amount[]"]').val()*$(this).find('input[name="actionNum[]"]').val()*$(this).find('input[name="beiShu[]"]').val()).toFixed(2);
          qh=$(this).find('input[name="actionNo[]"]').val();
          a.push('['+$(this).find('input[name="wfname[]"]').val()+']'+$(this).find('input[name="actionData[]"]').val());
        })
        $("#zhorder input[name='zhorder[]']").each(function(){
          qh2=$(this).val();
        })
        qh=qh+'-'+qh2;
        var s='<div id="CheckBetLayer" class="lotteryConfirm" style="text-align: left;">\n<ul>\n<li><span>彩种：</span><em class="fill">'+$('#title').html()+'</em></li>\n<li><span>期号：</span>第<em class="fill">'+qh+'</em>期</li>\n<li><span>详情：</span><div class="fill textarea"><p>'+a.join("<br>")+'</p></div></li>\n<li><span>投注总金额：</span><em><em class="fill">'+ $('.chaseDes em').eq(1).html()+'</em>元</em></li>\n</ul>\n</div>';
        layer.open({
        content:s,
        area: ['450px', '450px'],
        title:'投注确认',
        btn: ['确认投注','取消'],
        yes:function(){
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
                              $('#checkNumber li').removeClass('active');
                              $('.checkedList table').html('');
                              $('#order').html('');
                              $('#zgtype').trigger('click');
                              jsze();
                          }
                      }
                  });
        }
    });
    }
function xzzg(){
  $('#zhorder').remove();
  $('#wfway').remove();
  $('#zhlist').hide();
  $('#tzbtn').show();
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
  fs.wfzid=wfzid;
  fs.userid=userid;
  fs.act='xztype';
  var jsonStr = JSON.stringify(fs);
  websocket.send(jsonStr);
}
function xzwf(id){
  wfid=id;
  $('#wf a').removeClass('curr');
  $('#wf'+id).addClass('curr');
  var fs = {};
  fs.wfid=id;
  fs.userid=userid;
  fs.act='xzwf';
  var jsonStr = JSON.stringify(fs);
  websocket.send(jsonStr);
}
function xzwfz(id){
  wfzid=id;
  $('#wfz li').removeClass('curr');
  $('#wfz'+id).addClass('curr');
  var fs = {};
  fs.wfzid=id;
  fs.wfid=wfid;
  fs.userid=userid;
  fs.act='xzwfz';
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
        if(obj.hasClass('curr')){
            obj.removeClass('curr');
        }
        else{
           obj.addClass('curr');
        }
        zstj();
    }
    function txhm2(obj){
      $(".C a").removeClass('curr');
        if(obj.hasClass('curr')){
            obj.removeClass('curr');
        }
        else{
           obj.addClass('curr');
        }
        zstj();
    }
    function txhm3(obj,n){
        if(obj.hasClass('curr')){
            obj.removeClass('curr');
        }
        else{
          var m=0;
          $(".C .buyNumber").eq(0).find("a").each(function(){
              if($(this).hasClass('curr')){
                if(m>=n-2){
                  $(this).removeClass('curr')
                }
                else{
                m=m-(-1);
                }
              }
              if($(this).html()==obj.html()){
                $(this).removeClass('curr');
              }
          })
          $(".C .buyNumber").eq(1).find("a").each(function(){
              if($(this).html()==obj.html()){
                $(this).removeClass('curr');
              }
          })
           obj.addClass('curr');
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
        if($('.betTotal em').eq(2).html()==0){
              alert('请至少选择一注投注号码！');
              return false;
        }
        var zhushu=0;
        var money=0;
        var qh=0;
        var qh2=0;
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
    function addzs(zsid,ms,val,pl,zs,bs,type){
        var bsms={};
        bsms['2']='元';
        bsms['0.2']='角';
        bsms['0.02']='分';
        var html='<tr id="zsid'+zsid+'"><td><i class="order_type">['+ms+'] '+val+'</i></td>';      
            html=html+'<td><span class="order_zhushu"><i class="order_num c_red">'+zs+'</i>注</span></td><td>';
            html=html+'<td class="_planRate">'+bs+'倍</td><td>'+bsms[type]+'</td>';
            html=html+'</td><td><i class="c_3">';
            html=html+'<span class="hide_this">可中金额：';                
            html=html+'<i class="orderMoney c_red">'+(pl*bs*type/2).toFixed(2)+'</i>元';
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
                input=input+'<input type="hidden" name="amount[]" value="'+type+'">';
                input=input+'<input type="hidden" name="bonusProp[]" value="'+(pl/2)+'">';
                input=input+'<input type="hidden" name="beiShu[]" value="'+bs+'">';
                input=input+'<input type="hidden" name="wfname[]" value="'+ms+'">';
                input=input+'</div>';
          $('#order').append(input);
          $('#input'+zsid).attr('zsid',zsid);
          jsze();
    }
    function addzs2(zsid,ms,val,pl,zs,bs,type){
        var bsms={};
        bsms['2']='元';
        bsms['0.2']='角';
        bsms['0.02']='分';
        var html='<tr id="zsid'+zsid+'"><td><i class="order_type">['+ms+'] '+val+'</i></td>';      
            html=html+'<td><span class="order_zhushu"><i class="order_num c_red">'+zs+'</i>注</span></td><td>';
            html=html+'<td class="_planRate">'+bs+'倍</td><td>'+bsms[type]+'</td>';
            html=html+'</td><td><i class="c_3">';
            html=html+'<span class="hide_this">最高可中金额：';                
            html=html+'<i class="orderMoney c_red">'+(pl*bs*type/2).toFixed(2)+'</i>元';
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
                input=input+'<input type="hidden" name="amount[]" value="'+type+'">';
                input=input+'<input type="hidden" name="bonusProp[]" value="'+(pl/2)+'">';
                input=input+'<input type="hidden" name="beiShu[]" value="'+bs+'">';
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
          money=money-(-$(this).find('input[name="amount[]"]').val()*$(this).find('input[name="beiShu[]"]').val()*$(this).find('input[name="actionNum[]"]').val()).toFixed(2);
        })
        $('.betTotal em').eq(2).html(zhushu);
        $('.betTotal .money').html("￥"+money.toFixed(2));
        $('.betTotal .money').attr('data-money',money)
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
    function zstj(){

    }
    function xzall(n){
      $('#checkNumber .buyNumber').eq(n).find('a').addClass('curr');
      zstj();
    }
    function qlall(n){
      $('#checkNumber .buyNumber').eq(n).find('a').removeClass('curr');
      zstj();
    }
    function dan(n){
      $('#checkNumber .buyNumber').eq(n).find('a').each(function(){
        if($(this).html()>5){
          $(this).addClass('curr');
        }
        else{
          $(this).removeClass('curr');
        }
      });
      zstj();
    }
    function xiao(n){
      $('#checkNumber .buyNumber').eq(n).find('a').each(function(){
        if($(this).html()<5){
          $(this).addClass('curr');
        }
        else{
          $(this).removeClass('curr');
        }
      });
      zstj();
    }
    function qishu(n){
      $('#checkNumber .buyNumber').eq(n).find('a').each(function(){
        if($(this).html()%2!=0){
          $(this).addClass('curr');
        }
        else{
          $(this).removeClass('curr');
        }
      });
      zstj();
    }
    function oshu(n){
      $('#checkNumber .buyNumber').eq(n).find('a').each(function(){
        if($(this).html()%2==0){
          $(this).addClass('curr');
        }
        else{
          $(this).removeClass('curr');
        }
      });
      zstj();
    }
    function addrate2(){
        var rate=$('#rate').val();
        rate=rate-1;
        if(rate<1){rate=1;}
        $('#rate').val(rate);
        jsjg();
    }
    function addrate(){
        var rate=$('#rate').val();
        rate=rate-(-1);
        $('#rate').val(rate);
        jsjg();
    }
    function jsjg(){
      $('.betTotal ._betMoney').html(($('#rate').val()*$('#ms').val()*$('.betTotal em').eq(0).html()).toFixed(2));
      $('#zgtype').trigger('click');
    }