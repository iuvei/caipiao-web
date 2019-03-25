$(function() {
    //渲染轮播图以及名片
    billboard(20,3);

    /**
     * [首页开奖结果模块]
     */
    (function(){
        var showList = [
            {code:1401, exist:false},
            {code:1000, exist:false},
            {code:1101, exist:false}
        ];      //要获取开奖结果的彩种
        var ul = $(".slideTxtBox").find(".bd").find("ul");  //本模块所有的ul都在这里
        //调用superSlide插件，并为点击绑定事件
        jQuery(".slideTxtBox").slide({trigger:"click",startFun:function(i){
        }});
    })()

    var slideCon = $(".slideCon");
    /*function splitTime(time) {
        var _time = time;
        var arr1 = _time.split(" ");
        var arr2 = arr1[0].split("2016-");
        return arr2[arr2.length - 1];
    }*/

    getRenData(['LotteryConfig','BannerList','RankingList'],function(data){
        //昨日奖金榜
        (function(rankingList){
            if (rankingList==undefined) {return}
            if (!rankingList || !rankingList[0]) {
                //显示倒计时
                $(".yestodayWinning").replaceWith('<div class="winningListLoading" style="padding: 18px 0 !important;">\
                    <img src="'+_Path.Host.img+'/system/common/loadding/winningList.gif" alt="">\
                    <h5>排名计算中</h5>\
                    <p>将在00:20公布榜单，请稍候...</p>\
                  </div>');
                return;
            };
            var $rankingTr  = $('._cardTrigger');          //操作的dom
            var len = $rankingTr.size();
            if (rankingList.length<len) {len=rankingList.length} //如果过来的数据不够，就截取下len
            for(var i = 0;i < len;i++){
                    //数据梳理
                var item = rankingList[i];
                var $theTr = $rankingTr.eq(i);
                var imgsrc = _Path.Host.img + _Path.path.photos + item.UserPhoto;
                var showName = item.NickName || item.UserName;
                //字符串填充
                var str = '<td>\
                    <img src="' + imgsrc + '">\
                    <p>账号昵称：<span>' +showName+ '</span><br>昨日奖金：<i>' +item.Bonus+ '</i></p>\
                </td>\
                <td>\
                    <ins>' + (i + 1) + '</ins>\
                </td>';
                //生成dom
                $theTr.attr('data-id', item.UserId).html(str)
            }
            //生成一个名片的实例
            var infoCard = new InfoCard();                //昨日奖金榜名片
                    infoCard.bind($('.yestodayWinning'), '._cardTrigger');
        })(data.RankingList)


        if(data.BannerList){
            var _Objhtml={
                BtnLi:'',
                ImgUrl:''
            }
            $(data.BannerList).each(function(i,Obj){
                var xurl=Obj.Url;
                if(Obj.Url==null){
                    xurl="";
                }else if(Obj.Url[0]==="/"){
                    xurl="href="+xurl
                }else{
                    xurl="target='_blank' href="+xurl
                }
                _Objhtml.BtnLi+='<li></li>';
                _Objhtml.ImgUrl+='<li><a '+xurl+'><img src="'+_Path.Host.img+Obj.Image+'"></a></li>';
            });
            if (data.BannerList.length>1) {
                $("#slideBox").html('<div class="hd"><ul>'+_Objhtml.BtnLi+'</ul></div><div class="bd"><div class="tempWrap"><ul>'+_Objhtml.ImgUrl+'</ul></div></div>')
                .slide({mainCell:".bd ul",trigger:"click",effect:"left",autoPlay:true,interTime:7000});
            }else{
                $("#slideBox").html('<div class="bd"><div class="tempWrap"><ul>'+_Objhtml.ImgUrl+'</ul></div></div>');
            }
        }
        // var NoticeData = data.NoticeData;
        // if(NoticeData){
        //     if(NoticeData.length) {
        //         var str = [];
        //         var len = 5 > NoticeData.length ? NoticeData.length : 5;
        //         for(var i=0;i<len;i++) {
        //             var _date = splitTime(NoticeData[i].Add_Time);
        //             str.push("<li>\
        //                 <a class='MustLogin' href='/NoticeDetail.html?id="+NoticeData[i].ID+"' class='c666'>"+ NoticeData[i].Title +"</a><span>" + _date + "</span></li>");
        //         }
        //         slideCon.html(str.join(""));
        //     }
        // }
        if (data.LotteryConfig) {
            var Lottery=data.LotteryConfig[0].LotteryList;
            var str=[],t,thisL;
            var len = Lottery.length;
            if(len>10){len=10};
            getRenData(['LotteryList'],function(data){
                data = data.LotteryList;
                if (!data) {return;}
                for (var i = 0; i < len; i++) {
                    t=Lottery[i];
                    thisL = data[t];
                    if(thisL){
                        //购彩大厅，各彩种链接的处理
                        var _type = thisL.LotteryType;
                        if(_type === 'K3'
                            || _type === 'SSC'
                            ){
                          thisL.LotteryUrl = '/lottery_' + _type.toLowerCase() + '.html?lottery=';
                        }else{
                          thisL.LotteryUrl = '/gameBet_cqssc.html?lottery=';
                        }
                        thisL.LotteryUrl+=t;
                        str.push('<li><a href="'+thisL.LotteryUrl+'" class="MustLogin"><i class="iconfont L_'+thisL.LotteryType+'"></i><span class="sortName">'+thisL.LotteryName+'</span><span class="des">'+thisL.LotteryIntro+'</span></a></li>')
                    }else{
                        console.log('LotteryList缺少'+t);
                    }
                }
                $('.subnav').html(str.join(''))
            })
        }
    })

    // //显示余额
    // $(".showMoneryBtn").click(function(){
    //     var self=this,
    //         btnval=$(self).text(),
    //         istrue=btnval=="显示",
    //         intext=istrue?"隐藏":"显示",
    //         GetMoney=$(".GetMoney em").text(),
    //         hideMoney=$(".logined .hideMoney"),
    //         showMoney=$(".logined .showMoney");
    //     $(self).text(intext);
    //     if(istrue){
    //         getRenData(['UserBalance'],function(data){
    //             if(data.UserBalance){
    //               showMoney.text(data.UserBalance);
    //             }
    //         })
    //         hideMoney.addClass("dpn");
    //         showMoney.removeClass("dpn");
    //     }else{
    //         hideMoney.removeClass("dpn");
    //         showMoney.addClass("dpn");
    //     }
    // })
})