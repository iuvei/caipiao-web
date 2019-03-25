//瑕佹眰锛�.winnerList锛�.winnerListSlide锛屼互鍙婂搴旇疆鎾彃浠�

/** [billboard description]椋庝簯姒滄暟鎹覆鏌撲笌鏇存柊鏁版嵁
*   @param  {[num]} dataNum [姣忔鑾峰彇鏁版嵁鐨勬暟閲廬
*   @param  {[num]} visible [鍙鍖哄煙鐨勬樉绀烘潯鏁癩
**/
var billboardCard = new InfoCard(); //椋庝簯姒滃悕鐗囷紝鐜板湪鍚嶇墖涓庨浜戞瑙ｈ€︿簡
var billboard = (function(){
    var BonusList = [];     //娓叉煋鏁扮粍
    var refreshFlag;        //鍒锋柊鏍囧織锛宼rue浠ｈ〃鏂扮殑杞挱鏁版嵁杩囨潵浜嗭紝false浠ｈ〃鐩墠娌℃湁鏂版暟鎹�
    return function(dataNum, visible){
        //棣栨娓叉煋
        getBonusList(dataNum,function(){
            for(var i = 0;i < BonusList.length;i++){
                $('.winnerList').append(BonusList[i]);
            }
            $(".winnerListSlide").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"topLoop",autoPlay:true,vis:visible,trigger:"click",endFun:function (i,c,s) {
                //濡傛灉鏈塺efreshFlag鏍囧織鍒欒繘琛屾棤鐥曟洿鏂版暟鎹�
                if(refreshFlag){
                    refreshCarousel(i);
                }
            }});
        });

        //涓€涓浘鐗囦笂鍒�2500ms锛岄殧2500 * dataNum ms 鎷夊彇涓€娆℃柊鏁版嵁锛屾棤鐥曢《鎺夋棫鏁版嵁銆�
        setInterval(function(){
            getBonusList(dataNum, function(){
                refreshCarousel = renderCarousel(visible,BonusList);
                refreshFlag = true;
            });
        },2500 * dataNum );

        billboardCard.bind($('.winnerList'), 'li');     
    }

    /** [getBonusList description]灏嗗彇寰楃殑娓叉煋鏁版嵁璧嬬粰BonusList
    *   @param  {[num]} index [褰撳墠杞挱鐨勭储寮昡
    *   @param  {[num]} visible [鍙鍖哄煙鐨勬樉绀烘潯鏁癩
    *   @param  {[num]} total [鎬荤殑鏁版嵁鏁癩
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
                    //鏁版嵁澶勭悊
                    var _BackData = data.BackData.NewestBonusList;
                    for(var i = 0;i < _BackData.length;i++){
                        _BackData[i].fuzzyUserName = (_BackData[i].UserName ? fuzzyUsername(_BackData[i].UserName) : '鍖垮悕鐜╁' );//瀵硅处鍙疯繘琛屾ā绯婂鐞�
                    }

                    //鏁版嵁娓叉煋
                    var str;
                    var arrMsg = [];
                    $.each(_BackData, function(i, item) {
                        var photo = item.UserPhoto || 'defaultHeadImg.png'; //娌″姞杞藉ご鍍忔椂锛岄粯璁ゆ樉绀虹殑澶村儚
                        var name = item.Nickname ? item.Nickname : item.fuzzyUserName;       //濡傛灉鏈夋樀绉板氨鏄剧ず鏄电О锛屾病鏈夋樀绉板氨鏄剧ず璐﹀彿
                        item.Nickname = item.Nickname || '鏄电О鏈缃�';
                        item.UserName = item.UserName || '鏃�';
                        str = '<li data-id = "' +item.UserId+ '">\
                                <img src="'+_Path.Host.img + _Path.path.photos + photo + '">\
                                <p>'+name+' 鍦�'+item.LotteryName+'<br>鍠滀腑<span>锟�'+item.Bonus+'</span>\
                                </p>\
                            </li>';
                        arrMsg.push(str);
                    });
                    BonusList = arrMsg;
                    func(); //鎵ц鍥炶皟鍑芥暟
                }
            }
        });
    }

    /** [renderCarousel description]鏂版暟鎹棤鐥曞彇浠ｆ棫鐨勮疆鎾暟鎹�
    *   @param  {[num]} visible [鍙鍖哄煙鐨勬樉绀烘潯鏁癩
    *   @param  {[num]} arr [娓叉煋鏁扮粍]
    **/
    function renderCarousel(visible,arr){
        var total = arr.length;
        var hasRendered = 0;
        return function(index){
            if(hasRendered < total){
                //濡傛灉杩樻病鍔犺浇瀹�
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