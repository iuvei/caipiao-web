//要求：.winnerList，.winnerListSlide，以及对应轮播插件

/** [billboard description]风云榜数据渲染与更新数据
*   @param  {[num]} dataNum [每次获取数据的数量]
*   @param  {[num]} visible [可视区域的显示条数]
**/
var billboardCard = new InfoCard(); //风云榜名片，现在名片与风云榜解耦了
var billboard = (function(){
    var BonusList = [];     //渲染数组
    var refreshFlag;        //刷新标志，true代表新的轮播数据过来了，false代表目前没有新数据
    return function(dataNum, visible){
        //首次渲染
        getBonusList(dataNum,function(){
            for(var i = 0;i < BonusList.length;i++){
                $('.winnerList').append(BonusList[i]);
            }
            $(".winnerListSlide").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"topLoop",autoPlay:true,vis:visible,trigger:"click",endFun:function (i,c,s) {
                //如果有refreshFlag标志则进行无痕更新数据
                if(refreshFlag){
                    refreshCarousel(i);
                }
            }});
        });

        //一个图片上划2500ms，隔2500 * dataNum ms 拉取一次新数据，无痕顶掉旧数据。
        setInterval(function(){
            getBonusList(dataNum, function(){
                refreshCarousel = renderCarousel(visible,BonusList);
                refreshFlag = true;
            });
        },2500 * dataNum );

        billboardCard.bind($('.winnerList'), 'li');     
    }

    /** [getBonusList description]将取得的渲染数据赋给BonusList
    *   @param  {[num]} index [当前轮播的索引]
    *   @param  {[num]} visible [可视区域的显示条数]
    *   @param  {[num]} total [总的数据数]
    **/
    function getBonusList(DateNum, func){
        $.ajax({
            data: {
                Action: "GetNewestBonusList",
                dataNum: DateNum
            },
            success: function(data) {
                if (data.Code == 1) {
                    // console.log(data);
                    //数据处理
                    var _BackData = data.BackData.NewestBonusList;
                    for(var i = 0;i < _BackData.length;i++){
                        _BackData[i].fuzzyUserName = (_BackData[i].UserName ? fuzzyUsername(_BackData[i].UserName) : '匿名玩家' );//对账号进行模糊处理
                    }

                    //数据渲染
                    var str;
                    var arrMsg = [];
                    $.each(_BackData, function(i, item) {
                        var photo = item.UserPhoto || 'defaultHeadImg.png'; //没加载头像时，默认显示的头像
                        var name = item.Nickname ? item.Nickname : item.fuzzyUserName;       //如果有昵称就显示昵称，没有昵称就显示账号
                        item.Nickname = item.Nickname || '昵称未设置';
                        item.UserName = item.UserName || '无';
                        str = '<li data-id = "' +item.UserId+ '">\
                                <img src="'+_Path.Host.img + _Path.path.photos + photo + '">\
                                <p>'+name+' 在'+item.LotteryName+'<br>喜中<span>￥'+item.Bonus+'</span>\
                                </p>\
                            </li>';
                        arrMsg.push(str);
                    });
                    BonusList = arrMsg;
                    func(); //执行回调函数
                }
            }
        });
    }

    /** [renderCarousel description]新数据无痕取代旧的轮播数据
    *   @param  {[num]} visible [可视区域的显示条数]
    *   @param  {[num]} arr [渲染数组]
    **/
    function renderCarousel(visible,arr){
        var total = arr.length;
        var hasRendered = 0;
        return function(index){
            if(hasRendered < total){
                //如果还没加载完
                if(index < 0 || index >= total){
                    console.log('index < 0 or index > total');
                    return;
                }

                var target = index + visible >= total ? index + visible - total : index + visible;
                var domNum = target ===  total - 1 ? [total, 0] : [target + 1, target + 1 + total];
                $('.winnerList li').eq(domNum[0]).replaceWith(arr[hasRendered]);
                $('.winnerList li').eq(domNum[1]).replaceWith(arr[hasRendered]).addClass('clone');
                hasRendered++;
            }else{
                return;
            }
        };
    }
})()