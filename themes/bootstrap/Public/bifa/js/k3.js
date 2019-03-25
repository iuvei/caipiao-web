/**
 * [computeIssue 璁＄畻鏈熷彿,璇ユ柟娉曢渶瑕佸搴斿僵绉嶈繘琛岄€傚簲鎬х紪鍐�,闇€鎶藉嚭]
 * @param  {[int]} i [瀵瑰簲璁″垝涓殑绗嚑椤圭洰 璐熸暟涓烘槰澶�,瓒呰繃鍒欎负鏄庡ぉ]
 * @return {[str]}   [璁＄畻鍑烘潵鐨勬湡鍙风粨鏋淽
 */
baseData.computeIssue=function(index){
  var date, dateStr;
  date=Math.floor(index/baseData.PlanLen);
  var _index = index-date*baseData.PlanLen;
  var SerTime = (new Date().getTime()-baseData.Difftime)%aDayTime

  var firstIssue = baseData.LotteryPlan[0]
  if((firstIssue.End < firstIssue.Start) && (firstIssue.Start < SerTime)){
    date++
  }

  if (baseData.LotteryCode==1406) {
    var data = baseData.Todaystr.replace(/^(\d{4})(\d{2})(\d{2})$/,'$1/$2/$3');
    return '0'+(Math.floor((Date.parse(data)-Date.parse("2016/8/1"))/aDayTime)*89+staticIssue+index);
  }else{
    if(date){
      var todayTime = new Date(baseData.Todaystr.replace(/(\d{4})(\d{2})(\d{2})/,"$1/$2/$3")).getTime();
      dateStr = new Date(todayTime + date * aDayTime).format('yyyyMMdd');
    }else{
      dateStr = baseData.Todaystr;
    }

    return dateStr + baseData.LotteryPlan[_index].IssueNo
  }
};
/**
 * [updateResultsTxt 鏄剧ず寮€濂栦腑鎴栧紑濂栫粨鏋�,闇€瑕佹牴鎹笉鍚岀殑褰╃鍘婚噸鍐橾
 * @return {[type]} [description]
 */
baseData.updateResultsTxt=function(){
  // 杩欎釜闇€瑕佹牴鎹僵绉嶅鍐�
  if (baseData.wait4Results) {
    baseData.DomJson.Results.innerHTML='<img width="61" height="71" src="'+_Path.Host.img+'/system/pc/k3/open_num.gif"/><img width="61" height="71" src="'+_Path.Host.img+'/system/pc/k3/open_num.gif"/><img width="61" height="71" src="'+_Path.Host.img+'/system/pc/k3/open_num.gif"/>';
  }else{
    baseData.DomJson.OldIssue.innerHTML='绗�<b>'+baseData.OldIssue+'</b>鏈熷紑濂栧彿鐮侊細';
    var arr = baseData.LotteryResults[baseData.LotteryCode][0].LotteryOpen.split(',');
    baseData.DomJson.Results.innerHTML='<li class="announcedNo'+arr[0]+'"></li> <li class="announcedNo'+arr[1]+'"></li> <li class="announcedNo'+arr[2]+'"></li>';
  }
};
function getRebate(fun){
  var Rebate = sessionStorage.getItem("RebateK3");
  if (Rebate) {
    Rebate = JSON.parse(Rebate);
    fun(Rebate);
  }else{
    $.ajax({
      data:{Action:"GetBetRebate",LotteryType:"K3"},
      success:function(data){
        if (data.Code===1) {
          fun(data.BackData);
          sessionStorage.setItem("RebateK3",JSON.stringify(data.BackData));
        }else{
          layer.msgWarn(data.StrCode);
        }
      }
    })
  }
}
var Mode = {
  A:{
    Name:"鍜屽€�",
    Btn:[["3"], ["4"], ["5"], ["6"], ["7"], ["8"], ["9"], ["10"], ["11"], ["12"], ["13"], ["14"], ["15"], ["16"], ["17"], ["18"], ["澶�"], ["灏�"], ["鍗�"], ["鍙�"]],
    Intro:"鐚�3涓紑濂栧彿鐩稿姞鐨勫拰锛�3-10涓哄皬锛�11-18涓哄ぇ銆�",
  },
  B:{
    Name:"涓夊悓鍙烽€氶€�",
    Btn:["涓夊悓鍙烽€氶€�"],
    Intro:"瀵规墍鏈夌浉鍚岀殑涓変釜鍙风爜(111銆�222銆�333銆�444銆�555銆�666)杩涜鎶曟敞锛屼换鎰忓彿鐮佸紑鍑猴紝鍗充负涓銆�",
  },
  C:{
    Name:"涓夊悓鍙峰崟閫�",
    Btn:[111, 222, 333, 444, 555, 666],
    Intro:"瀵圭浉鍚岀殑涓変釜鍙风爜(111銆�222銆�333銆�444銆�555銆�666)涓殑浠绘剰涓€涓垨澶氫釜杩涜鎶曟敞锛屾墍閫夊彿鐮佸紑鍑猴紝鍗充负涓銆�",
  },
  D:{
    Name:"涓変笉鍚屽彿",
    Btn:[1, 2, 3, 4, 5, 6],
    Intro:"浠�1-6涓换閫�3涓垨澶氫釜鍙风爜,鎵€閫夊彿鐮佷笌寮€濂栧彿鐮佺殑3涓彿鐮佺浉鍚�,鍗充负涓銆�"
  },
  E:{
    Name:"涓夎繛鍙烽€氶€�",
    Btn:["涓夎繛鍙烽€氶€�"],
    Intro:"瀵规墍鏈夌殑3涓浉杩炲彿鐮�(123銆�234銆�345銆�456)杩涜鎶曟敞锛屼换鎰忓彿鐮佸紑鍑猴紝鍗充负涓銆�"
  },
  F:{
    Name:"浜屽悓鍙峰閫�",
    Btn:[11, 22, 33, 44, 55, 66],
    Intro:"浠�11-66涓换閫�1涓垨澶氫釜鍙风爜锛岄€夊彿涓庡鍙�(鍖呭惈11-66锛屼笉闄愰『搴�)鐩稿悓锛屽嵆涓轰腑濂栵紙涓嶅惈璞瑰瓙锛夈€�"
  },
  G:{
    Name:"浜屽悓鍙峰崟閫�",
    Btn:[11, 22, 33, 44, 55, 66, 1, 2, 3, 4, 5, 6],
    Intro:"閫夋嫨1瀵圭浉鍚屽彿鐮佸拰1涓笉鍚屽彿鐮佹姇娉紝閫夊彿涓庡鍙风浉鍚岋紝鍗充负涓锛�"
  },
  H:{
    Name:"浜屼笉鍚屽彿",
    Btn:[1, 2, 3, 4, 5, 6],
    Intro:"浠�1-6涓换閫�2涓垨澶氫釜鍙风爜锛屾墍閫夊彿鐮佷笌寮€濂栧彿鐮佷换鎰�2涓彿鐮佺浉鍚岋紝鍗充负涓銆�"
  }
}
// 鍖椾含蹇笁鐨勮绠楀熀纭€
var staticDay= Date.parse("2016/8/1"),staticIssue = 52596+1-7*89; //鍖椾含鏈熷彿璁＄畻
//鍚姩 baseData
baseData.init();

// var myBet = $(".mybet").find("table:eq(0)");

var betFilter = $(".betFilter");
var ModeIndex = '',//鐢ㄤ簬鍌ㄥ瓨褰撳墠鐜╂硶,濡侫,B,C..
  thisUl,
  betTip=$('.betTip'),
  $Method=$('.checkNumber ul').hide(0),$checkedList=$(".checkedList tbody"),
  $PanelBtn=$(".Panel"),
  $PanelEm=$PanelBtn.find('em'),
  $BetBtn = $(".Bet"),
  $totalBet = $BetBtn.find('em'),
  $totalMoney = $BetBtn.find('i');
$BetBtn = $BetBtn.find('.betBtn');
$PanelBtn = $PanelBtn.find('.betBtn');
var ModeTypeList=['A','B','C','D','E','F','G','H'];
var Rebate=[];
var BetData=[];
getRebate(function(data){
  Rebate.push(data.Rebate);
  Odds=data.Odds;
  var play;
  var thisOdds;
  for (var i = Odds.length - 1; i >= 0; i--) {
    play=Odds[i].PlayCode.charAt(0);
    thisOdds=Odds[i].Bonus;
    if (play==="A") {
      thisOdds=thisOdds.split(",");
      Mode[play].Odds=thisOdds[8]+'-'+thisOdds[0];
      for (var j = 16; j < 20; j++) {
        Mode[play].Btn[j][1]=thisOdds[8];
      }
      for (var j = 0; j < 8; j++) {
        Mode[play].Btn[j][1]=thisOdds[j];
        Mode[play].Btn[15-j][1]=thisOdds[j];
      }
    }else{
      Mode[play].Odds=thisOdds;
    }
  }
  for(var i in Mode){
    Mode[i].Intro += '璧旂巼'+Mode[i].Odds+'鍊嶃€�';
  }
  for (var j = ModeTypeList.length - 1; j >= 0; j--) {
    var thisM = Mode[ModeTypeList[j]];
    var html=[],Btn=thisM.Btn;
    for (var i = 0, len = Btn.length; i < len; i++) {
      if (ModeTypeList[j]==='A') {
        html.push('<li data-val="'+Btn[i][0]+'" data-i="'+i+'"><a class="ClickShade">'+Btn[i][0]+'</a><span>璧�'+(i>15?'鐜�':'')+Btn[i][1]+'</span></li>');
      } else {
        html.push('<li data-val="'+Btn[i]+'" data-i="'+i+'"><a class="ClickShade">'+Btn[i]+'</a></li>');
      }
    }
    html = html.join('');
    $Method.eq(j).html(html);
  }
  betFilter.delegate("li","click",function(){
    if (this.className!=="ClickShade curr") {
      var ths = this;
      betFilter.find("li").each(function(i,t){
        t.className='ClickShade';
        if (t===ths) {
          t.className='ClickShade curr';
          thisUl=$Method.hide(0).eq(i).show(0);
          ModeIndex=ModeTypeList[i];
          betTip.html('<i class="iconfont">&#xe633;</i>'+Mode[ModeIndex].Intro);
          if ("ABE".search(ModeIndex)>-1) {
            $(".Panel").css('display','none');
          }else{
            clearActive();
            $(".Panel").css('display','block');
          }
        }
      })
    }
  }).find("li:eq(0)").trigger('click');
})

function clearActive(){
  thisUl.find('.active').removeClass('active');
  $PanelEm.text(0);
  $PanelBtn.addClass('UnClick');
}
$BetBtn.on('click',function(){
  if(baseData.DomJson.TimeBar.innerText==='鏆傚仠閿€鍞�'){
    layer.msgWarn('鎶辨瓑锛屽綋鍓嶅僵绁ㄥ凡鏆傚仠閿€鍞€�');
    return;
  }
  var len = BetData.length;
  if (!len) {
    layer.msgWarn("璇疯嚦灏戦€夋嫨涓€娉ㄦ姇娉ㄥ彿鐮侊紒");
    return;
  }
  if (this.className.search('UnClick')>-1) {
    layer.msg("鎮ㄦ湁鍙风爜鏈缃噾棰濓紝璇锋牳瀵瑰悗鎶曟敞銆�")
    return;
  }

  var ajaxData={action:"AddBetting"},
    betArr=[],betListArr=[],d;
  for (var i = 0; i < len; i++) {
    d=BetData[i];
    betListArr.push('['+d.PlayName+']\t'+d.BetNum);
    betArr.push({
      "lottery_code": baseData.LotteryCode,
      "play_detail_code": baseData.LotteryCode+d.PlayMode+"10",
      "betting_issuseNo": baseData.NowIssue,
      "betting_number": d.BetNum,
      "betting_count": d.BetCount,
      "graduation_count": 1,
      "betting_money": d.BetMoney,
      "betting_point": d.Odds+"-"+d.Rebate,
      "betting_model": 1
    })
  }
  ajaxData.data=JSON.stringify({BettingData:betArr});
  baseData.DomJson.CheckBetLayer.BetTextarea.innerHTML=betListArr.join('<br/>');
  layer.open({
    type:1,
    title:'鎶曟敞纭',
    content:$(".lotteryConfirm"),
    area:'450px',
    btn:['纭鎶曟敞','鍙栨秷'],
    yes:function(index){
      layer.close(index);
      /*寮€濮嬫姇娉�*/
      $.ajax({
        load:true,
        data: ajaxData,
        success:function(data){
          if(data.Code===1){
            layer.alert(data.StrCode);
            baseData.clearCheck();
            setTimeout(function(){
              console.log('闅斾笁绉�')
              baseData.updateBetRecord()

            }, 3000)
          }else if(data.Code===-9){
            sessionStorage.removeItem('RebateK3');
            layer.url("杩旂偣閿欒锛岄渶閲嶆柊鍔犺浇杩旂偣锛�");
          }else{
              layer.msgWarn(data.StrCode);
          }
        },
      })
    }
  })
})
function betCompute(){
  var num=0,money=0,canClick=true;
  for (var i = BetData.length - 1; i >= 0; i--) {
    num += BetData[i].BetCount;
    money += BetData[i].BetMoney;
    if (!BetData[i].BetMoney) {
      canClick=false;
    }
  }
  $totalBet.text(num);
  $totalMoney.text(money);
  baseData.DomJson.CheckBetLayer.Money.innerText=money;
  $BetBtn[num&&canClick?'removeClass':'addClass']('UnClick');
}

$checkedList.delegate('input','change input',function(){
  var tr = $(this).closest('tr');
  var i = tr.index();
  this.value=+this.value.replace(/\D/g,'');
  if (this.value>1000000) {
    layer.msg('鏈€楂樻姇娉ㄩ涓�1000000鍏�');
    this.value=1000000;
  }
  var unitMoney = this.value;
  BetData[i].BetMoney = BetData[i].BetCount*unitMoney;
  var m = this.value*BetData[i].Odds;
  var fixed = BetData[i].Odds>2?100:1000;
  m = Math.round(m*fixed)/fixed;
  tr.find('.orderMoney').text(m);
  betCompute();
}).delegate('.orderCancel','click',function(){
  var tr = $(this).closest('tr');
  var i = tr.index();
  tr.remove();
  var thisB = BetData.splice(i,1)[0];
  if ("ABE".search(thisB.PlayMode)>-1) {
    $Method.filter('.'+thisB.PlayMode).find('li').eq(thisB.Index).removeClass('active');
  }
  betCompute();
}).on('click','.BetNum',function(){
  var showText = $(this).prev().text();
  layer.open({
    title:'鎶曟敞鍐呭',
    content:showText,
    btn:['鍏抽棴']
  });
})
function addBetList(json){
  $('<tr>\
      <td>\
          <i class="order_type">[' + json.PlayName + '] ' + json.BetNum + '</i>'+(json.BetNum.length>16?'<a class="BetNum c_red">璇︾粏</a>':'')+'</td>\
      <td>\
          <span class="order_zhushu">鎬诲叡\
              <i class="order_num c_red">' + json.BetCount + '</i>娉�</span></td>\
      <td>\
          <i class="order_price">姣忔敞\
              <input type="text" class="eachPrice" value="">鍏�</i></td>\
      <td>\
          <i class="c_3">\
              <span class="hide_this">鍙腑閲戦锛歕
                  <i class="orderMoney c_red">0</i>鍏僜
              </span>\
          </i>\
      </td>\
      <td>\
          <i class="orderCancel">鍒犻櫎</i>\
      </td>\
  </tr>').prependTo($checkedList).find('input').focus();
  BetData.unshift(json);
  betCompute();
}
/*纭閫夊彿鎸夐挳*/
$PanelBtn.on('click',function(){
  if (this.className.search('UnClick')>-1) {
    layer.msg("鍙风爜閫夋嫨涓嶅畬鏁达紝璇烽噸鏂伴€夋嫨銆�")
    return;
  }
  var betBtn=[];
  var thisM = Mode[ModeIndex];
  thisUl.find('.active').each(function(ii, tt) {
    betBtn.push(this.innerText.replace(/\s/,''));
  });
  console.log(ModeIndex);
  switch(ModeIndex){
    case "C":
      betBtn = betBtn.join(",");
      break;
    case "G":
      betBtn = betBtn.join(" ").replace(/(\d\d) (\d |\d$)/, "$1,$2");
      break;
    default:
      betBtn = betBtn.join(" ");
  }
  addBetList({
    PlayMode: ModeIndex,
    // Index:index,
    PlayName:thisM.Name,
    BetNum: betBtn,//鍙风爜
    BetCount: $PanelEm.text()*1,//鍑犳敞
    Multiple: 1,//鍊嶆暟
    BetMoney: 0,//鎬婚噾棰�
    Rebate:Rebate[0],
    Odds:thisM.Odds
  });
  clearActive();
})
$Method.delegate('li','click',function(){
  var hasActive = this.className==='active';
  var $this=$(this);
  var val = this.getAttribute('data-val');
  // console.log(index,val);
  this.className="active";
  var thisM = Mode[ModeIndex];
  var index = $this.index();
  var allLi = $this.parent().find("li");
  var kind;
  switch(ModeIndex){
    case 'A'://鍜屽€�
    case 'B'://涓夊悓鍙烽€氶€�
    case 'E'://涓夎繛鍙烽€氶€�
      // console.log(Mode[ModeIndex]);
      if (hasActive) {
        for (var i = BetData.length - 1; i >= 0; i--) {
          if(BetData[i].BetNum==val){
            // BetData.splice(i,1);
            $this.removeClass("active");
            $checkedList.find('tr').eq(i).find(".orderCancel").trigger("click");
            break;
          }
        }
      }else{
        addBetList({
          PlayMode: ModeIndex,
          Index:index,
          PlayName:thisM.Name,
          BetNum: val,//鍙风爜
          BetCount: 1,//鍑犳敞
          Multiple: 1,//鍊嶆暟
          BetMoney: 0,//鎬婚噾棰�
          Rebate:Rebate[0],
          Odds:ModeIndex==='A'?thisM.Btn[index][1]:thisM.Odds
        });
      }
    break;
    case 'G'://浜屽悓鍙峰崟閫�
      if(!hasActive){
        allLi.eq((index+6)%12).removeClass('active');
      }
      $this[hasActive?'removeClass':'addClass']('active');
      kind=allLi.filter(':gt(5)').filter(".active").size()*allLi.filter(':lt(6)').filter(".active").size();
    break;
    case 'D'://涓変笉鍚屽彿
    case 'H'://浜屼笉鍚屽彿
      $this[hasActive?'removeClass':'addClass']('active');
      var group = (ModeIndex === 'D') ? 3 : 2;
      var len = allLi.filter(".active").size();
      kind = 0;
      if (len >= group) {
        kind = 1;
        for (var i = 0; i < group; i++) {
          kind *= (len - i) / (i + 1);
        }
      }
    break;
    case 'C'://涓夊悓鍙峰崟閫�
    case 'F'://浜屽悓鍙峰閫�
      $this[hasActive?'removeClass':'addClass']('active');
      kind = allLi.filter(".active").size();
    break;
  }
  $PanelEm.text(kind);
  $PanelBtn[kind?'removeClass':'addClass']('UnClick');
})
/*杩涘叆椤甸潰璋冪敤鐨勬柟娉� end*/