var EACH_STEP = 112;
var MAX_UNIT = 6;
var randomFeed = Math.floor(Math.random()*4)  //鑾峰彇寮€濂栨椂闂寸殑闅忔満鏁帮紝鐢ㄤ簬閿欏紑璇锋眰
/**
* 鍙戝竷璁㈤槄(淇″彿涓績)
*/
var Event = (function(){
  var list = {};  //鍥炶皟鍑芥暟鐨勭紦瀛樺垪琛�

  /**
   * [listen 璁㈤槄]
   * @param  {[string]}   key [绫诲瀷]
   * @param  {Function} fn  [鍥炶皟鍑芥暟]
   */
  var listen = function(key, fn){
    if(!list[key]){
      list[key] = [];
    }
    list[key].push(fn);
  }

  /**
   * [trigger 閫氱煡璁㈤槄鑰匽
   * @param  {[string]}   key [绫诲瀷]
   * @param  鍙彉鍙傛暟涓暟锛岄櫎浜嗙涓€涓紝鍏朵綑鐨勪负鍙傛暟
   */
  var trigger = function(){
    var key = Array.prototype.shift.call(arguments);
    var fns = list[key];
    if(!fns || fns.length === 0){
      return false;
    }
    //鎵цclientList[key]涓殑姣忎釜鍑芥暟
    for(var i = 0;i < fns.length;i++){
      var fn = fns[i];
      fn.apply(this, arguments);
    }
  }

  var remove = function(key, fn){
    var fns = list[key];
    if(!fns){             //濡傛灉杩欎釜key涓嬶紝娌℃湁浜鸿闃呭氨杩斿洖
      return this;
    }

    if(!fn){              //濡傛灉娌℃湁浼犲叆fn锛屼唬琛ㄨ繖涓猭ey涓嬫墍鏈夊洖璋冨嚱鏁伴兘鍒犻櫎
      fns && (fns.length = 0);
    }else{
      for(var i = 0; i < fns.length;i++){
        var _fn = fns[i];
        if(_fn === fn){
          fns.splice(i, 1);     //鍒犻櫎璁㈤槄鑰呯殑鍥炶皟鍑芥暟
        }
      }
    }
    return this;
  }

  return {
    listen:listen,
    trigger:trigger,
    remove: remove,
    list:list
  }

})();

//妫€鏌ュ僵绉嶅彿鏄惁瀛樺湪
function accessCheck(code){
  var url = location.pathname;
  if(!code){
    layer.url('鎮ㄦ墍璁块棶鐨勫僵绉嶄笉瀛樺湪锛屽嵆灏嗚繑鍥炶喘褰╁ぇ鍘�','/lottery.html');
    $('.container').css('opacity',0);
  }

  var pages = {
    '/lottery_k3.html': '蹇�3',
    '/lottery_ssc.html': '鏃舵椂褰�'
  };
  getRenData(['LotteryConfig'], function(d){
    var word = pages[url] || '';
    if(d.LotteryConfig){
      var lConfig = d.LotteryConfig;
      for(var i = 0, len = lConfig.length;i < len;i++){
        if(lConfig[i].LotteryClassName === word){
          if(lConfig[i].LotteryList.indexOf(code) === -1){
            layer.url('鎮ㄦ墍璁块棶鐨勫僵绉嶄笉瀛樺湪锛屽嵆灏嗚繑鍥炶喘褰╁ぇ鍘�','/lottery.html');
            $('.container').css('opacity',0);
          }
        }
      }
    }
  })
}

var LotteryCode = W_GetRequest().lottery;
accessCheck(LotteryCode);

var baseData=(function(){
  var timeBuff = 1*3600000+35*60000;
  var fill = $("#CheckBetLayer").find('.fill');

  var baseData = {
    Difftime:Number(localStorage.getItem('Difftime')),//鏃堕棿宸�
    LotteryCode:LotteryCode,//褰╃ID
    LotteryResults:{},//鐢ㄤ簬鍌ㄥ瓨鍚勫僵绉嶇殑寮€濂栫粨鏋�
    DomJson:{
      TimeBar:document.getElementById('TimeBar'),//鍊掕鏃�
      NowIssue:document.getElementById('NowIssue'),//褰撳墠鏈熷彿
      OldIssue:document.getElementById('OldIssue'),//涓婁竴鏈熷彿
      Results:document.getElementById('Results'),//涓婃湡寮€濂栫粨鏋滃睍绀哄尯
      ResultsList:document.getElementById('ResultsList'),//寮€濂栫粨鏋滃垪琛�
      chart:document.getElementById('chart'),//璧板娍鍥炬寜閽�
      title:document.getElementsByTagName('title')[0],//鏍囬澶�
      $mybet:$(".mybet").find("table:eq(0)"),
      $mychase:$('.mybet').find('table:eq(1)'),
      CheckBetLayer:{//纭鎶曟敞闈㈡澘
        Name:fill.get(0),//褰╃
        Issue:fill.get(1),//鏈熷彿
        BetTextarea:fill.get(2),//涓嬫敞璇︽儏
        Money:fill.get(3),//鎶曟敞鎬婚
      }
    },
    /**
     * [updateBetRecord 鏇存柊鎴戠殑鎶曟敞]
     * @return {[type]} [description]
     */
    updateBetRecord:function(){
      //寮€濮嬪埛鏂版椂缁欐姇娉ㄥ拰杩藉彿鍒涘缓鍔ㄧ敾
      function createMybetAnimation($table, num){
        if(num == 3){
          var title = "<tr><th>鏈熷彿</th><th>鎶曟敞閲戦</th><th>濂栭噾</th></tr>";
        }else{
          var title = "<tr><th>璧峰鏈熷彿</th><th>宸茶拷/鎬�</th><th>鎬婚噾棰�</th><th>濂栭噾</th></tr>"
        }

        var animation = '<tr>\
                            <td colspan="'+num+'"><img src="'+_Path.path.serLink+'js/skin/default/loading-0.gif" width="60" height="24" alt=""></td>\
                        </tr>';
        return title + animation;
      }

      var $mybet = baseData.DomJson.$mybet;
      var $mychase = baseData.DomJson.$mychase;

      $mybet.html(createMybetAnimation($mybet, 3));
      $mychase.html(createMybetAnimation($mychase, 4));

      var isBetRecord = !$('.mybet h3').eq(0).hasClass('notSelect')
      if(isBetRecord){
        $.ajax({
          data:{
            Action: 'GetBetting'
          },
          success: function(data){
            if(data.Code === 1){
              var betting = data.Data
              //娓叉煋鎴戠殑鎶曟敞
              var end = ['<tr><th>鏈熷彿</th><th>鎶曟敞閲戦</th><th>濂栭噾</th></tr>']
              for (var i = 0, len = betting.length; i < len; i++) {
                var issueNo = betting[i].url.replace(/^\S+\/(\d+).html$/, '$1');
                var openStateColor = betting[i].openState*1 && 'style = "color:#e4393c"';
                end.push('<tr>\
                  <td><a href="betDetail.html?id=' +issueNo+ '&UID=0">' + betting[i].issueNo + '</a></td>\
                  <td>' + betting[i].normal_money + '</td>\
                  <td '+ openStateColor +'>' + betting[i].openState + '</td>\
                </tr>');
              }

              if(len < 5){
                for(var i = 0;i < (5-len);i++){
                  end.push('<tr><td></td><td></td><td></td></tr>')
                }
              }

              $mybet.html(end.join(''));
            }
          }
        })
      }else{
        $.ajax({
          data:{
            Action:'GetChaseBetting'
          },
          success: function(data){
            if(data.Code === 1){
              var chaseBetting = data.Data
              //娓叉煋鎴戠殑杩藉彿
              var end = ['<tr><th>璧峰鏈熷彿</th><th>宸茶拷/鎬�</th><th>鎬婚噾棰�</th><th>濂栭噾</th></tr>']
              for (var i = 0,len = chaseBetting.length; i < len; i++) {
                end.push('<tr>\
                  <td><a href="/seekOrder.html">' + chaseBetting[i].issueNo + '</a></td>\
                  <td>' + chaseBetting[i].complete_count + '</td>\
                  <td>锟�' + chaseBetting[i].chase_money + '</td>\
                  <td>锟�' + chaseBetting[i].state + '</td>\
                </tr>');
              }
              if(len < 5){
                for(var i = 0;i < (5-len);i++){
                  end.push('<tr><td></td><td></td><td></td></tr>')
                }
              }
              $mychase.html(end.join(''));
            }
          }
        })
      }
    },
    /**
     * [updateDate 鏂板紑鎴栬€呰秴杩囧崄浜岀偣闇€瑕佽皟鐢ㄧ殑鏂规硶,鐢ㄤ簬鏇存柊baseData涓殑涓€浜涙椂闂寸姸鎬乚
     * @return {[type]} [description]
     */
    updateDate:function(){
      nowSerTime = new Date().getTime()-baseData.Difftime+GMTdif;
      baseData.Todaystr = new Date(nowSerTime).format("yyyyMMdd");
      baseData.Tomorrowstr = new Date(nowSerTime+aDayTime).format("yyyyMMdd");
      baseData.Yestodaystr = new Date(nowSerTime-aDayTime).format("yyyyMMdd");
    },
    /**
     * [updateLotteryTitle 鏍规嵁褰撳墠Code鍘绘覆鏌撴爣棰樺拰鍥炬爣]
     * @return {[type]} [description]
     */
    updateLotteryTitle:function(){
      var L;
      getRenData(["LotteryList"],function(data){
        data=data.LotteryList;
        // console.log(data)
        if (!data) return;
        L=data[baseData.LotteryCode];
        // console.log(L)
        $(".betLogo").html('<h2>'+L.LotteryName+'</h2><i class="iconfont L_'+L.LotteryType+'"></i>')
        baseData.DomJson.CheckBetLayer.Name.innerText=L.LotteryName;
        var name = baseData.DomJson.title.innerText;
        if (name.search('-')>-1) {
          document.title=name.replace(/-\S+$/,'-'+L.LotteryName);
        }else{
          document.title=L.LotteryName;
        }

      })
    },
    /**
     * [clearCheck 娓呯┖鎵€鏈夌殑鏂规娉ㄥ崟,瀹炵幇鏂瑰紡鍗虫ā鎷熷皢鏂规娉ㄥ崟閲岀殑鎵€鏈夊垹闄ゆ寜閽偣鍑讳竴閬峕
     * @return {[type]} [description]
     */
    clearCheck:function(){
      $(".checkedList").find('.orderCancel').trigger('click');
    },
    /**
     * [Lottery 鏂板紑鎴栬€呭叿浣撳僵绁ㄥ彉鍖栧悗闇€瑕佽皟鐢ㄧ殑鏂规硶,鐢ㄤ簬鏇存柊椤甸潰鍙奲aseData涓殑涓€浜涙椂闂寸姸鎬乚
     * @param {[type]} code [description]
     */
    updateLottery:function(){
      this.updateLotteryTitle();
      //鐢熸垚LotteryResults瀵瑰簲鏁扮粍;
      $(".betNav").find(".active").removeClass("active").end().find('[data='+baseData.LotteryCode+']').addClass('active');
      baseData.DomJson.chart.href='/tender_chart/'+baseData.LotteryCode+'.html';
      this.clearCheck();

      if(!baseData.LotteryResults[baseData.LotteryCode]){
        baseData.LotteryResults[baseData.LotteryCode]=[];
      }
      if (baseData.LotteryResults[baseData.LotteryCode].length) {
        baseData.updateResults();
      }
      baseData.wait4Results=0;
      // baseData.getResults();
      //鍙樻洿寮€濂栬鍒�
      if (!baseData.wait4Results) {
        this.getResults();
      }
      this.updatePlan();
      // 鏇存柊浠婃棩寮€濂�,鎴戠殑鎶曟敞,涓淇℃伅

    },
    /**
     * [updateIssue 杩涜椤甸潰鏈熷彿娓叉煋 鍏辩敤]
     * @return {[type]} [description]
     */
    updateIssue:function(){
      //璇ユ柟娉曢渶瑕佹牴鎹笉鍚岀殑褰╃鍒ゅ畾
      baseData.NowIssue = baseData.computeIssue(baseData.IssueNo);
      baseData.OldIssue = baseData.computeIssue(baseData.IssueNo-1);
      baseData.DomJson.NowIssue.innerHTML='璺�<b>'+baseData.NowIssue+'</b>鏈熸姇娉ㄦ埅姝㈣繕鏈夛細';
      baseData.DomJson.OldIssue.innerHTML='绗�<b>'+baseData.OldIssue+'</b>鏈熷紑濂栦腑...';
      layer.closeAll('page');
      baseData.DomJson.CheckBetLayer.Issue.innerHTML = baseData.NowIssue;
      baseData.wait4Results=1;
      this.updateResultsTxt();
      Event.trigger('updateIssue');
    },
    /**
     * [updatePlan 鏇存柊鍒板搴旂殑褰╃瀹夋帓璁″垝]
     * @return {[type]} [description]
     */
    updatePlan:function(LotteryCode,LotteryPlan){
      //濡傛灉娌℃湁寮€濂栬鍒掞紝鎴栬€呬笉鏄湰褰╃鐨勫紑濂栬鍒�
      if (!LotteryPlan||baseData.LotteryCode!==LotteryCode) {
        if(baseData.LotteryCode === '1407' || baseData.LotteryCode === '1008'){
        //1407澶у彂蹇笁銆�1008澶у彂鏃舵椂褰� 鐨勪娇鐢ㄨ绠楄幏寰楀紑濂栬鍒�
          LotteryPlan = (function(){
            var plan = [],IssueNo,EndTime;
            for (var i = 0; i < 1440; i++) {
              var el = {}
              el.IssueNo = ('000'+(i+1)).slice(-4)
              el.StartTime = [('0'+Math.floor((i-1)/60)).slice(-2),('0'+Math.floor((i-1)%60)).slice(-2),'59'].join(':')
              el.EndTime = [('0'+Math.floor(i/60)).slice(-2),('0'+Math.floor(i%60)).slice(-2),'59'].join(':')
              if(i===0)el.StartTime = '23:59:59'
              plan.push(el)

              // plan.push({
              //   "IssueNo":('000'+(i+1)).slice(-4),
              //   "StartTime":[('0'+Math.floor((i-1)/60)).slice(-2),('0'+Math.floor((i-1)%60)).slice(-2),'59'].join(':'),
              //   "EndTime":[('0'+Math.floor(i/60)).slice(-2),('0'+Math.floor(i%60)).slice(-2),'59'].join(':')
              // })
            }
            return plan;
          })();
        }else{
          //涓嶆槸澶у彂鏃舵椂褰╁拰澶у彂蹇笁鐨勫僵绉嶏紝 闇€瑕佽繘琛孍ndTime鐨勬牎楠岋紝浠ョ‘淇濇湰鍦扮殑璁″垝鏄渶鏂扮殑
          LotteryPlan = localStorage.getItem("lotteryPlan"+baseData.LotteryCode);
          LotteryPlan = LotteryPlan&&JSON.parse(LotteryPlan);
          if (LotteryPlan) {
            //琛ヤ竵(鐭鏈熷彿)
            refer = this.LotteryList[baseData.LotteryCode];
            if (refer&&LotteryPlan[refer.VerifyIssue*1-1].EndTime!==refer.VerifyEndTime.split(' ')[1]) {
              localStorage.removeItem("lotteryPlan"+baseData.LotteryCode);
              LotteryPlan=false;
              console.log("闇€瑕佺煫姝�");
            }
          }
        }
      }else if(LotteryPlan&&baseData.LotteryCode!==LotteryCode){
        return
      }

      if (LotteryPlan) {
        //濡傛灉鏈夎鍒掔殑璇濓紝灏辫绠楀綋鍓嶆湡鍙�
        baseData.LotteryPlan=LotteryPlan;
        var time=[],EndTime,StartTime;
        baseData.SerTime = (new Date().getTime()-baseData.Difftime)%aDayTime;
        baseData.PlanLen=baseData.LotteryPlan.length;

        var lastIssue_E = baseData.LotteryPlan[baseData.LotteryPlan.length - 1].EndTime.split(':')
            ,lastIssueEnd = lastIssue_E[0]*3600000 + lastIssue_E[1]*60000 + lastIssue_E[2]*1000
            ,firstIssue_E = baseData.LotteryPlan[0].EndTime.split(':')
            ,firstIssueEnd = firstIssue_E[0]*3600000 + firstIssue_E[1]*60000 + firstIssue_E[2]*1000

        if((baseData.SerTime > lastIssueEnd)&&(lastIssueEnd > firstIssueEnd)){
          baseData.IssueNo = baseData.PlanLen
        }else{
          baseData.IssueNo = 0
        }
        // baseData.IssueNo = 0;

        for (var i = baseData.PlanLen - 1; i >= 0; i--) {
          time=baseData.LotteryPlan[i].EndTime.split(':');
          EndTime=baseData.LotteryPlan[i].End = time[0]*3600000+time[1]*60000+time[2]*1000;
          time=baseData.LotteryPlan[i].StartTime.split(':');
          StartTime=baseData.LotteryPlan[i].Start = time[0]*3600000+time[1]*60000+time[2]*1000;

          if((baseData.SerTime < EndTime) && (baseData.SerTime >= StartTime)){
            baseData.IssueNo = i;
          }else if(StartTime>EndTime){
            //鏌愭湡璺ㄥぉ浜�
            if((baseData.SerTime<EndTime)||(baseData.SerTime>=StartTime)){
              baseData.IssueNo = i;
            }
          }

          // if(i===baseData.PlanLen-1&&baseData.SerTime>=EndTime){
          //   baseData.IssueNo = i;
          // }
          /*else if (i===0&&baseData.SerTime<StartTime&&baseData.LotteryCode!=1407) {
            baseData.IssueNo=baseData.IssueNo||0;
          }*/
        }
        // console.log(baseData.IssueNo);
        baseData.updateIssue();
      }else{
        //濡傛灉娌℃湁璁″垝鐨勮瘽锛屽氨鑾峰彇褰撳墠鏈熷彿
        var LotteryCode=baseData.LotteryCode;
        $.ajax({
          data: {
            Action: "GetLotteryPlan",
            Qort: LotteryCode
          },
        })
        .done(function(data) {
          if (data.Code === 1) {
            localStorage.setItem("lotteryPlan" + LotteryCode, JSON.stringify(data.Data));
            baseData.updatePlan(LotteryCode,data.Data);
          }else{
            layer.msgWarn(data.StrCode);
          }
        })
      }
    },
    /**
     * [updateResults 鏇存柊寮€濂栫粨鏋滃垪琛╙
     * @return {[type]} [description]
     */
    updateResults:function(){
      // 鏍规嵁褰╃绫诲瀷璁剧疆
      var str=[],sum,Results;
      var len = baseData.LotteryResults[baseData.LotteryCode].length;
      if (len) {
        try{
          var type = (location.pathname.indexOf('k3') > -1) ? 'col4' : 'col3';
          var titleStr = {
            'col4':'<table width="100%" border="0" cellspacing="0" cellpadding="0" class="ty_table_gameBet curr" id="fn_getoPenGame">\
                      <tbody><tr>\
                        <th scope="col">鏈熷彿</th>\
                        <th scope="col">寮€濂栧彿</th>\
                        <th scope="col">鍜屽€�</th>\
                        <th scope="col">褰㈡€�</th>\
                      </tr>\
                    </tbody><tbody>',
            'col3': '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="ty_table_gameBet curr" id="fn_getoPenGame">\
                      <tbody><tr>\
                        <th scope="col">鏈熷彿</th>\
                        <th scope="col">寮€濂栧彿</th>\
                        <th scope="col">寮€濂栨椂闂�</th>\
                      </tr>\
                    </tbody><tbody>'
          }


          str.push(titleStr[type]);
          for (var i = 0; i < len; i++) {
            Results=baseData.LotteryResults[baseData.LotteryCode][i];
            if(type === 'col4'){
              sum=Results.LotteryOpen.split(',');
              sum=sum[0]*1+sum[1]*1+sum[2]*1;
              str.push('<tr>\
              <td class="c_green"><i class="o_qi">'+Results.IssueNo+'</i></td>\
              <td><i class="numbers">'+Results.LotteryOpen+'</i></td>\
              <td class="sum">'+sum+'</td>\
              <td><em class="'+(sum>10?'da':'xiao')+'">'+(sum>10?'澶�':'灏�')+'</em><em class="'+(sum%2?'dan':'shuang')+'">'+(sum%2?'鍗�':'鍙�')+'</em></td></tr>');
            }else{
              var time = Results.OpenTime.split(' ')[1];
               str.push('<tr>\
              <td class="c_green"><i class="o_qi">'+Results.IssueNo+'</i></td>\
              <td><i class="numbers">'+Results.LotteryOpen+'</i></td>\
              <td>'+time+'</td></tr>');
            }
          }
          str.push('</tbody></table>')
        }catch(e){
          console.log(len);
        }
        baseData.DomJson.ResultsList.innerHTML=str.join('');
      }
    },
    /**
     * [getResults 閫氳繃ajax鑾峰彇寮€濂栫粨鏋淽
     * @param  {[string]} IssueNo     [鏈熷彿,鍙€塢
     * @param  {[string]} LotteryCode [褰╃,鍙€�,涓昏鍒ゆ柇涓庡綋鍓嶅僵绉嶆槸鍚︿粛鐒剁浉鍚宂
     * @return {[type]}             [description]
     */
    getResults:function(){
      var LotteryCode=baseData.LotteryCode/*,
        Results=baseData.LotteryResults[LotteryCode];
      var IssueNo = Results&&Results.length?Results[0].IssueNo:0;*/
      $.ajax({
        data: {
          Action: "GetLotteryOpen",
          LotteryCode: LotteryCode,
          IssueNo: 0,
          DataNum: 10
        },
        success:function(data){
          if (data.Code === 1) {
            var len = data.BackData.length;
            if (len/*&&baseData.LotteryResults[LotteryCode]*/) {
              /*for (var i = len - 1; i >= 0; i--) {
                if (data.BackData[i].IssueNo>IssueNo) {
                  baseData.LotteryResults[LotteryCode].unshift(data.BackData[i])
                }
              }
              if (baseData.LotteryResults[LotteryCode].length>10) {
                baseData.LotteryResults[LotteryCode].length=10;
              }*/
              baseData.LotteryResults[LotteryCode]=data.BackData
              baseData.updateResults();
              IssueNo = baseData.LotteryResults[LotteryCode][0].IssueNo;
            }
          } else {
            // layer.msgWarn(data.StrCode);
          }
        }
      })
    },
    /**
     * [
      瀹氭椂鍣ㄨ繍琛岀殑鏂规硶,瑙﹀彂鍊掕鏃�,鏇存柊鏈熷彿,鏇存柊寮€濂栫殑涓灑鏂规硶]
     */
    Refresh:function(){
      function computeCountdown(issueNo, _SerTime){
        var _issue = baseData.LotteryPlan[baseData.IssueNo % baseData.PlanLen]
            ,isCrossDay = (_issue.Start > _issue.End) && (_SerTime > _issue.Start)  //鏈湡璺ㄥぉ,涓斿綋鍓嶆椂闂村ぇ浜嶦nd
            ,isOutOfIssue = baseData.IssueNo === baseData.PlanLen                       //濡傛灉鐜板湪涓嶅湪浠讳綍鏈熷唴
            ,needAddOneDay = isCrossDay || isOutOfIssue

        var Countdown = baseData.LotteryPlan[baseData.IssueNo % baseData.PlanLen].End
                        +needAddOneDay * aDayTime
                        -_SerTime;

        // console.log(_issue.StartTime,_issue.EndTime,_SerTime,_issue.Start,_issue.End, issueNo,isCrossDay,isOutOfIssue, needAddOneDay, Countdown)
        return Countdown
      }

      var isStop = baseData.LotteryList[LotteryCode].IsStop
      if(isStop === '1'){
        commit('lt_stopSell')   //鏆傚仠閿€鍞�
        return
      }


      baseData.SerTime = (new Date().getTime() - baseData.Difftime)%aDayTime;
      if (baseData.SerTime<1000) {
        console.log("鏂扮殑涓€澶�");
        this.updateDate();
        baseData.IssueNo=baseData.IssueNo%baseData.PlanLen;
        return;
      }

      if (baseData.IssueNo||baseData.IssueNo===0) {
        // console.log(baseData.IssueNo);
        // console.log(baseData.LotteryPlan[baseData.IssueNo%baseData.PlanLen].End);
        var Countdown =computeCountdown(baseData.IssueNo, baseData.SerTime)
           // baseData.LotteryPlan[baseData.IssueNo%baseData.PlanLen].End+(baseData.IssueNo>=baseData.PlanLen)*aDayTime - baseData.SerTime;
        Countdown%=aDayTime;

        if (Countdown<=0){
          while(Countdown<=0){
            var lastIssueEnd = baseData.LotteryPlan[baseData.PlanLen - 1].End
                ,firstIssueStart = baseData.LotteryPlan[0].Start

            if(firstIssueStart >= lastIssueEnd){
              baseData.IssueNo = (baseData.IssueNo+1)%baseData.PlanLen;
            }else{
              baseData.IssueNo = baseData.IssueNo+1;
            }

            Countdown=computeCountdown(baseData.IssueNo, baseData.SerTime)
          }
          baseData.updateIssue();
          layer.alert('褰撳墠鏈熷彿涓�<b style="color:red">'+baseData.NowIssue+'</b>锛�<br/>鎶曟敞鏃惰娉ㄦ剰鏈熷彿',{title:'娓╅Θ鎻愮ず'});
        }

        Countdown = Math.floor(Countdown/1000);   //鍙樻垚浜嗘寜绉掕鐨勪簡锛� 鍊掕鏃�
        if(Countdown>600&&baseData.LotteryCode!=1407){
          baseData.DomJson.TimeBar.innerText = "棰勫敭涓�";
        }else/* if (baseData.IssueNo&&Countdown>0) */{
          var hh=Math.floor(Countdown/3600);
          var MM=Math.floor(Countdown%3600/60);
          var ss=Math.floor(Countdown%60);
          hh=hh>9?hh:('0'+hh);
          MM=MM>9?MM:('0'+MM);
          ss=ss>9?ss:('0'+ss);
          baseData.DomJson.TimeBar.innerText = hh+':'+MM+':'+ss;
        }
      }

      var Results = baseData.LotteryResults[baseData.LotteryCode],
        len = Results?Results.length:0;
      if (!len||Results[0].IssueNo*1<baseData.OldIssue*1) {
        baseData.wait4Results=baseData.wait4Results||0;
        baseData.wait4Results++;
        var interval
        switch(baseData.LotteryCode){
          case "1407":
          case "1008":
            interval=5
            break
          default:
            interval=30
        }
        if (baseData.wait4Results > (5 + randomFeed) && baseData.wait4Results%interval === randomFeed) {
          baseData.getResults();
        }
      }else if(baseData.wait4Results>0){
        if (Number(Results[0].IssueNo)>=Number(baseData.NowIssue)) {
          baseData.DomJson.TimeBar.innerHTML='鏆傚仠閿€鍞�';
        }else{
          console.log("寰楀埌寮€濂�");
          baseData.wait4Results=0;
          baseData.updateResultsTxt();
          baseData.wait4Results=-1;
        }
      }else if(baseData.wait4Results<0){
        baseData.wait4Results--;
        if(baseData.wait4Results == -(11 + randomFeed)){
          baseData.updateBetRecord();
          baseData.wait4Results=0;
        }

        // if (baseData.wait4Results==-6) {
        //   baseData.updateBetRecord();
        // }else if(baseData.wait4Results==-12){
        //   baseData.updateBetRecord();
        //   baseData.wait4Results=0;
        // }
      }
    },
    /**
     * [updateDifftime 涓庢湇鍔″櫒姣斿鏃堕棿,鏇存柊鏃堕棿宸甝
     * @return {[type]} [description]
     */
    updateDifftime:function(fun){
      getServerTime(function(serTime){
        baseData.serTime=serTime;
        baseData.Difftime = new Date().getTime()-baseData.serTime+GMTdif;
        localStorage.setItem('Difftime',baseData.Difftime);
        fun&&fun();
      });
    },
    navMax:0,
    nowNav:0,
    renNav:function(){
      var urlToType = {
        '/lottery_ssc.html':['SSC', '鏃舵椂褰�'],
        '/lottery_k3.html':['K3', '蹇�3'],
      }
      var path = location.pathname;
      var type = urlToType[path];

      getRenData(['LotteryList'], function(d){
        if(d.LotteryList){
          baseData.LotteryList=d.LotteryList
          var list = [];
          // console.log(d.LotteryList)
          for(var item in d.LotteryList){
            if(d.LotteryList[item].LotteryType === type[0]){
              d.LotteryList[item].code = item;
              list.push(d.LotteryList[item])
            }
          }
          baseData.navMax = list.length - MAX_UNIT;

          getRenData(['LotteryConfig'], function(data){
            var code = [];
            if(data.LotteryConfig){
              data.LotteryConfig.forEach(function(item){
                if(item.LotteryClassName === type[1]){
                  code = item.LotteryList;
                }
              })

              var str = '';
              for(var i = 0;i < code.length;i++){
                var tmpName = '';
                for(var j = 0;j < list.length;j++){
                  if(list[j].code === code[i]){
                    tmpName = list[j].LotteryName
                  }
                }

                str += '<li class = "ClickShade" data ="' + code[i] + '">' + tmpName +'</li>'
              }

              $('.betNav').html(str).css('width', code.length * EACH_STEP + 'px');

              $('.betNavtab').removeClass('dpn').on('click', function(){
                var _no = $(this).index();
                  // console.log(_no, baseData.nowNav, baseData.navMax)
                if(list.length > MAX_UNIT){
                  if(_no === 1){
                    if(baseData.nowNav > 0){
                      baseData.nowNav --;
                    }else{
                      layer.msg('宸茬粡鍒伴《鍟�',{time:1000})
                    }
                    baseData.moveNav();
                  }else{
                    if(baseData.nowNav < baseData.navMax){
                      baseData.nowNav ++;
                    }else{
                      layer.msg('宸茬粡鍒板簳鍟�',{time:1000})
                    }
                    baseData.moveNav();
                  }
                }else{
                  if(_no === 1){
                    layer.msg('宸茬粡鍒伴《鍟�',{time:1000})
                  }else{
                    layer.msg('宸茬粡鍒板簳鍟�',{time:1000})
                  }
                }
              })

            }
          })
        }
      })
      return this;
    },
    moveNav:function(){
      var X = - baseData.nowNav * EACH_STEP;
      $('.betNav')[0].setAttribute('style', 'transform:translateX('+X+'px); -moz-transform:translateX('+X+'px); -webkit-transform:translateX('+X+'px); -ms-transform:translateX('+X+'px);')
    },
    ClearRebate:function(){
      sessionStorage.removeItem('RebateK3');
      sessionStorage.removeItem('RebateSSC');
      layer.url("杩旂偣閿欒锛岄渶閲嶆柊鍔犺浇杩旂偣锛�");
    },
    /**
     * [init 鍚姩baseData,涓€鑸湪(瀵瑰簲褰╃鑴氭湰涓�)鎵€鏈夎缃畬鎴愬悗璋冪敤,閬垮厤鍩虹鏁版嵁涓嶈冻瀵艰嚧鎶ラ敊]
     * @return {[type]} [description]
     */
    init:function(){
      baseData.renNav();
      /*杩涘叆椤甸潰璋冪敤鐨勬柟娉� star*/
      (function(fun){
        if(baseData.Difftime){
          fun();
        }
        baseData.updateDifftime(baseData.Difftime?function(){}:fun);
      })(function(){
        baseData.updateDate();
        $('[data='+baseData.LotteryCode+']').trigger('click');
        // baseData.updateLottery();
      })

      baseData.updateRankingList();
      setInterval(function(){
        baseData.Refresh();
      },1000)
    }
  };
  /**
   * [updateRankingList 鐢熸垚鏄ㄦ棩濂栭噾姒淽
   * @return {[type]} [description]
   */
  baseData.updateRankingList=function(){
    getRenData(["RankingList"],function(D){
      ;(function(R){
        var $moneyList = $('#moneyList');
        var Table = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>\
          <th colspan="2">鏄ㄦ棩绱濂栭噾鎺掕姒�</th>\
        </tr></table>').appendTo($moneyList );
        if(R && R.length){
          var len = R.length;
          var htmlArr=[];
          var Obj;
          for (var i = 0; i < len; i++) {
            Obj=R[i];
            var Name=Obj.UserName;
            Name= Obj.NickName||Name.replace(/^(\S{2})\S+(\S)$/,'$1***$2');
            htmlArr.push('<tr class = "_cardTrigger" data-id = "' +Obj.UserId+ '">\
              <td><img src="'+_Path.Host.img+_Path.path.photos+Obj.UserPhoto+'">\
              <p>璐﹀彿鏄电О锛�'+Name+'<br />\
              鏄ㄦ棩濂栭噾锛�<i>锟�'+Obj.Bonus+'</i></td>\
              <td><ins>'+Obj.Ranking+'</ins></td>\
            </tr>');
          }
          Table.find('tr').after(htmlArr.join(''));
          var infoCard = new InfoCard();                //鏄ㄦ棩濂栭噾姒滃悕鐗�
          infoCard.bind($moneyList, '._cardTrigger');
        }else{
          Table.after('<div class="winningListLoading">\
            <img src="'+_Path.Host.img+'/system/common/loadding/winningList.gif" alt="">\
            <h5>鎺掑悕璁＄畻涓�</h5>\
            <p>灏嗗湪00:20鍏竷姒滃崟锛岃绋嶅€�...</p>\
          </div>');
        }
        $moneyList.appendTo('#Ranking')
      })(D.RankingList)
    });
  }
  /*杩涘叆椤甸潰鍒ゆ柇鏄惁鏈夊僵绉�,骞剁珛鍗冲皢鍚嶇О鍜屽浘鏍囪繘琛屾樉绀�*/
  baseData.updateLotteryTitle();
  baseData.updateBetRecord();
  return baseData;
})();


/*鐐瑰嚮褰╃杩涜鍒囨崲*/
$(".betNav").delegate("li","click",function(e){
  if (this.className.search("active")==-1) {
    var index = $(this).index()//褰撳墠閫夊湪鍝釜nav鐨勭储寮�
    if(index < baseData.nowNav || index>=baseData.nowNav + MAX_UNIT){
      var _no = index - MAX_UNIT + 1
      baseData.nowNav = index<baseData.nowNav ? index: (index - MAX_UNIT + 1)
      baseData.moveNav()
      e.stopPropagation()
    }
    baseData.LotteryCode=this.getAttribute('data')
    baseData.updateLottery()
  }
})

document.getElementById('how2paly').onclick=function(){
  baseData.LotteryCode&&how2play(baseData.LotteryCode);
}
;(function(){
  billboard(20, 10)
  //涓淇℃伅鎸夐挳鍒囨崲
  $h3 = $('.winningList h3').css('cursor', 'pointer');
  $h3.eq(0).on('click', function() {
    $h3.eq(0).removeClass('notSelect')
    $h3.eq(1).addClass('notSelect');
    $('#moneyList').addClass('dpn');
    $('#lotteryInfo').removeClass('dpn');
  })

  $h3.eq(1).on('click', function() {
    $h3.eq(0).addClass('notSelect');
    $h3.eq(1).removeClass('notSelect')
    $('#moneyList').removeClass('dpn');
    $('#lotteryInfo').addClass('dpn');
  });
  //鎴戠殑杩藉彿-鎴戠殑鎶曟敞
  $('.mybet.box').on('click', 'h3', function(){
    var index = $(this).index();
    $(this).removeClass('notSelect').siblings('h3').addClass('notSelect');
    $('.mybet').find('table:eq('+ index +')').removeClass('dpn').siblings('._mybetContent').addClass('dpn');
    baseData.updateBetRecord()
  })

})()
