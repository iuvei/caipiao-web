//渚濊禆浜哹illboard.js鐨刡illboard鍑芥暟鍜宼ranstype鍑芥暟
$(function () {
  //璐僵澶у巺杞挱娓叉煋
   getRenData(['HallBanner'],function(data){
    if(data.HallBanner){
      var tli="",bli="";
      $.each(data.HallBanner,function(i,Obj){
        var xUrl=Obj.Url;
        if(Obj.Url==null){
          xUrl="javascript:;";
        }
        tli+='<li></li>';
        bli+='<li><a href="'+xUrl+'"><img src="'+_Path.Host.img+Obj.Image+'"></a></li>';
      })
      if (data.HallBanner.length>1) {
        $(".slideBox").html('<div class="hd"><ul>'+tli+'</ul></div><div class="bd"><ul>'+bli+'</ul></div>')
        .slide({mainCell:".bd ul",trigger:"click",effect:"left",autoPlay:true,interTime:7000});
      }else{
        $(".slideBox").html('<div class="bd"><ul>'+bli+'</ul></div>');
      }
    }
   });

  function fillLottery(data){
    getRenData(["LotteryList"],function(LotteryList){
      LotteryList=LotteryList.LotteryList;
      if (!LotteryList) return;
      var len = data.length,hd='',bd=[],tstr,t,thisL;
      for (var i = 0; i < len; i++) {
        hd+='<li class="ClickShade"><a>'+data[i].LotteryClassName+'</a></li>';
        var leng = data[i].LotteryList.length;
        tstr='<ul class="lotteryList fix">';
        for (var j = 0; j < leng; j++) {
          t = data[i].LotteryList[j];
          thisL = LotteryList[t+''];
          if(!thisL){
            continue;
          }
          //璐僵澶у巺锛屽悇褰╃閾炬帴鐨勫鐞�
          var _type = thisL.LotteryType;
          if(_type === 'K3' 
            || _type === 'SSC'
            ){
            thisL.LotteryUrl = '/lottery_' + _type.toLowerCase() + '.html?lottery=';
          }else{
            thisL.LotteryUrl = '/gameBet_cqssc.html?lottery=';
          }

          thisL.LotteryUrl+=t;
          tstr+='<li class="ClickShade"><a>\
                  <i class="iconfont L_'+thisL.LotteryType+'"></i>\
                  <div class="lotteryDetail">\
                      <h4>'+thisL.LotteryName+'</h4>\
                      <em>'+thisL.LotteryIntro+'</em>\
                  </div>\
              </a>\
              <div class="lotteryNow"><a class="now MustLogin"  href='+thisL.LotteryUrl+'>绔嬪嵆鎶曟敞</a><a class="help" data="'+t+'"><i class="iconfont">&#xe63f;</i></a></div>\
              </li>';
        }
        tstr+='</ul>';
        bd.push(tstr);
      }
      bd = '<ul class="lotteryNav hd fix">'+hd+'</ul><div class="bd">'+bd.join('')+'</div>';
      jQuery(".slideTabBox").html(bd).slide({trigger:"click"});
    })
  }

      getRenData(["LotteryConfig"],function(data){

        if (data.LotteryConfig) {
          var total = {
            "LotteryClassID": "1",
            "LotteryClassName": "鍏ㄩ儴",
            "LotteryList": []
          }
          for (var i = 1; i < data.LotteryConfig.length; i++) {
            total.LotteryList=total.LotteryList.concat(data.LotteryConfig[i].LotteryList);
          }
          data.LotteryConfig.splice(1, 0, total)
          fillLottery(data.LotteryConfig);
        }
      })


    $(".help").on('click',function(){
      how2play(this.getAttribute('data'));
    }).hover(function(e) {
      layer.tips('鐜╂硶璇存槑', this,{
        tips: [4, '#bd2004'],
        time:0,
      });
    },function(){
        layer.closeAll("tips");
    });

    billboard(20,3)
})
