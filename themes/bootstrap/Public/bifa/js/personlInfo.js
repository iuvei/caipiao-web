var d = {
  Year: 0,
  Month: 0,
  Date: 0
}
var now = new Date();
var theYear = now.getFullYear();
var UserInfo = {
  UserName: 0,
  NickName: 0,
  UserTitle: 0,
  UserGrade: 0,
  UserMobile: 0,
  UserMail: 0,
  UserSex: 0,
  UserQQ: 0,
  FaceUrl: 0,
  GradeGrow: 0,
  BirthDay: 0,
  GradeList: [],
  PhotoList: [],
  GradeGrowList: []
}
var photoHTML = "";
//棣栧睆娓叉煋
getRenData(['UserName', 'UserTitle', 'UserNickName', 'UserGrade', 'UserMobile', 'UserMail', 'UserPhoto', 'UserSex', 'UserQQ', 'UserBirthDay', 'UserGradeGrow', 'GradeList', 'DefaultPhotoList'], function(renderData) {
  var hasGrade="";
  if (renderData.UserName) {
    $('#userName').text(renderData.UserName);
    $('#userName2').text(renderData.UserName);
  }
  // 鏄电О
  if (renderData.UserNickName) {
    $('input[name="NickName"]').val(renderData.UserNickName).prop("disabled", "disabled");
    delete _DomObj.Input.NickName;
  }
  // QQ鍙�
  if (renderData.UserQQ) {
    $('input[name="QQ"]').val(renderData.UserQQ);
  }
  // 澶村儚
  if (renderData.UserPhoto) {
    $('.headImg').attr({
      "src": _Path.Host.img + _Path.path.photos + renderData.UserPhoto,
      "data-url": renderData.UserPhoto
    });
  }
  // 鎵嬫満鍙�
  if (renderData.UserMobile) {
    $('input[name="Mobile"]').val(renderData.UserMobile).next().text("淇敼").attr("href", "verifyMobile.html?Q=ResetMobile");
    // $("#changeMobile");
  }
  // 閭
  if (renderData.UserMail) {
    $('input[name="Mail"]').val(renderData.UserMail).next().text("淇敼").attr("href", "verifyMail.html?Q=ResetMail");
  }
  // 澶磋
  if (renderData.UserTitle) {
    $('#UserTitle').text(renderData.UserTitle);
    $('#UserTitle2').text(renderData.UserTitle);
  }
  // 绛夌骇
  if (renderData.UserGrade) {
    _PublicRenData.UserGrade=renderData.UserGrade;
    var isVal;
    switch(renderData.UserGrade){
      case "-1":
        isVal = "娴嬭瘯";
        break;
      case "0":
        isVal = "榛戝悕鍗�";
        break;
      case "10":
        isVal = "浠ｇ悊";
        break;
      default:
        isVal="VIP"+renderData.UserGrade;
    }
    $('#UserGrade').text(isVal);
    $('#UserGrade2').text(isVal);
  }
  // 鎬у埆
  if (renderData.UserSex) {
    $("label[val=" + renderData.UserSex + "]").click();
  }
  // 鐢熸棩
  if (renderData.UserBirthDay) {
    var isBirthDay = renderData.UserBirthDay.split("-");
    var isYear = parseInt(isBirthDay[0]);
    UserInfo.BirthDay = renderData.UserBirthDay;
    if (isYear != 1) {
      $(".diyselect").each(function(i, obj) {
        $(obj).find("div:eq(0)").text(parseInt(isBirthDay[i]));
        $(obj).find("input:eq(0)").val(parseInt(isBirthDay[i]));
      });
      d = {
        Year: isBirthDay[0],
        Month: isBirthDay[1],
        Date: isBirthDay[2]
      }
    } else {
      UserInfo.BirthDay = 0;
      d = {
        Year: 0,
        Month: 0,
        Date: 0
      }
    }
  }
  // 绛夌骇鏈哄埗
  if (renderData.GradeList) {
    _PublicRenData.GradeList=renderData.GradeList;
    console.log(_PublicRenData.GradeList);
    var dohtmlNext = ['<tr>\
                        <th>绛夌骇</th>\
                        <th>澶磋</th>\
                        <th>鎴愰暱绉垎</th>\
                        <th>鏅嬬骇濂栧姳(鍏�)</th>\
                        <th>璺崇骇濂栧姳(鍏�)</th>\
                    </tr>'];
    $.each(renderData.GradeList,function(i, obj) {
      dohtmlNext.push('<tr>\
          <td>VIP' + obj.Grade + '</td>\
          <td>' + obj.GradeName + '</td>\
          <td>' + obj.GradeGrow + '</td>\
          <td>' + obj.Bonus + '</td>\
          <td>' + obj.JumpBonus + '</td>\
      </tr>');
      UserInfo.GradeGrowList.push(obj.GradeGrow);
    });
    $("#Gradelist").html(dohtmlNext.join(''));
  }
console.log(renderData.UserGradeGrow);

  if (renderData.UserGradeGrow||renderData.UserGradeGrow=="0") {
    _PublicRenData.UserGradeGrow=renderData.UserGradeGrow;
  }
  if (_PublicRenData.UserGradeGrow&&_PublicRenData.GradeList&&_PublicRenData.UserGrade) {
    var hasGradeGrow = _PublicRenData.UserGradeGrow*1,
      UserGradeGrow2=$("#UserGradeGrow2"),
      UserGradeGrow=$("#UserGradeGrow"),
      GradeStatr=$('#GradeStatr'),
      GradeEnd=$('#GradeEnd'),
      GradeUp=$("#GradeUp"),
      progress=$("#progress");
    // hasGradeGrow=250;//娴嬭瘯璁剧疆涓�250鍒�
    if(hasGradeGrow<_PublicRenData.GradeList[8].GradeGrow){
      for (var i = _PublicRenData.GradeList.length - 1; i >= 0; i--) {
        if(hasGradeGrow>=_PublicRenData.GradeList[i].GradeGrow){
          hasGrade = i+1;
          break;
        }
      }
      var listIndexA = _PublicRenData.GradeList[hasGrade - 1].GradeGrow,
        listIndexB = _PublicRenData.GradeList[hasGrade].GradeGrow,
        NextGrow = listIndexB - hasGradeGrow,
        AllNum = listIndexB - listIndexA,
        PerNum = (hasGradeGrow-listIndexA) / AllNum * 100,
        isShowNum=NextGrow;
      if (/^[1-9]$/.test(renderData.UserGrade)) {
        UserGradeGrow2.text(hasGradeGrow + "鍒�");
        UserGradeGrow.html(parseInt(PerNum) + "%");
        GradeStatr.html("VIP" + hasGrade);
        GradeEnd.html("VIP" + (hasGrade + 1));
        GradeUp.html("<span style='color:#f14241'>"+hasGradeGrow+"</span>/"+listIndexB+"  璺濈涓嬩竴绾ц繕瑕�" + isShowNum + "鍒�");
        progress.css("width", PerNum + "%");
      } else {
        UserGradeGrow2.text("0鍒�");
        UserGradeGrow.html("0%");
        GradeStatr.html("");
        GradeEnd.html("");
        GradeUp.text("");
        progress.css("width", "0%");
      }
    }else{
        UserGradeGrow2.text(hasGradeGrow+"鍒�");
        UserGradeGrow.html("100%");
        GradeStatr.html("VIP8");
        GradeEnd.html("VIP9");
        GradeUp.text("");
        progress.css("width", "100%");
    }
  }
  // 澶村儚鍒楄〃娓叉煋
  if (renderData.DefaultPhotoList) {
    var hasPhotoList=renderData.DefaultPhotoList
    var photoHead = '';
    var photoInner = '';
    var photoFoot = '';
    photoHead = '<div class="headImgList">\
            <div class="headImgListTitle">\
                淇敼澶村儚 <a class="layui-layer-ico layui-layer-close" href="javascript:;"></a>\
            </div>\
            <div class="headImgContent">';
    $(hasPhotoList).each(function(i, Obj) {
      photoInner += ' <a href="javascript:;" title="' + Obj.ImageName + '" data-url="' + Obj.ImageUrl + '"><img class="headImg" src="' + _Path.Host.img + _Path.path.photos + Obj.ImageUrl + '" alt="' + Obj.ImageName + '"></a>';
    });
    photoFoot = '</div>\
            <div class="headImgView">\
                <h5>棰勮</h5>\
                <p>100x100</p>\
                <img src="' + _Path.Host.img + _Path.path.photos + hasPhotoList[0].ImageUrl + '" alt="">\
                <h5 style="color: #53a8f1;" class="theName">' + hasPhotoList[0].ImageName + '</h5>\
                <div class="button">\
                    <a class="submitBtn" id="PhotoEdit" href="javascript:layer.closeAll(\'page\');">淇濆瓨澶村儚</a>\
                    <a class="submitBtn cancel" href="javascript:layer.closeAll(\'page\');">鍙栨秷</a>\
                </div>\
            </div>\
            </div>';
    photoHTML = photoHead + photoInner + photoFoot;
  }
});
// 澶村儚鍒楄〃
function showHeadImg() {
  var t = layer.open({
    type: 1,
    title: false,
    closeBtn: 0,
    shadeClose: true,
    skin: 'yourclass',
    area: ['558', '395px'],
    content: photoHTML
  });
  //$(".headImgContent").length
  var isimg = $(".headImg").eq(0).data("url");
  $(".headImgContent a").each(function(i, Obj) {
    var isimgurl = $(Obj).data("url");
    if (isimgurl == isimg) {
      $(Obj).click();
    }
  })
};

//鎻掍欢鍒濆鍖�
fill($('.diyselect[name="Year"] div'), theYear - 70, theYear);
fill($('.diyselect[name="Month"] div'), 12, 1);
fill($('.diyselect[name="Date"] div'), 31, 1);

_FomatConfig.NickName = {
  Name: "鏄电О",
  ErrMsg: "璇蜂娇鐢ㄤ簲浣嶄互鍐呯殑姹夊瓧",
  Reg: /^[\u4e00-\u9fa5]{0,5}$/
}
_FomatConfig.QQ = {
  Name: "QQ鍙�",
  ErrMsg: "QQ鍙蜂负5-12浣嶆暟瀛�",
  Reg: /^\d{5,12}$/
}
$('input').addInputCheck();
$('[type=radiobox]').inputbox();
$('[type=selectbox]').inputbox({
  width: 73,
  height: 30
});



//褰撲笅鎷夋鐨勫€兼敼鍙樻椂
function selectBoxChange($dom) {
  var parentName = $dom.closest('.diyselect').attr('name');
  d[parentName] = $dom.attr('value');
  if (new Date(Date.parse(d.Month + '/' + d.Date + '/' + d.Year)).getDate() == d.Date) {
    showMsg($('.diyselect[name="Date"]'), true, '')
    UserInfo.BirthDay = d.Year + "-" + d.Month + "-" + d.Date;
  } else {
    UserInfo.BirthDay = 0;
    showMsg($('.diyselect[name="Date"]'), false, '鏃ユ湡鏍煎紡閿欒')
  }
}


//鎻愪氦鍓嶆楠�
var ajaxData0 = {
  Action:"UpdatePersonInfo"
};
$(".submitBtn").on("click", function() {
  //鍒ゆ柇鎵€鏈夎緭鍏ユ
  var ajaxData = _DomObj.returnAjaxData(ajaxData0)[0],
      isErr=$(".verifyWrong").length;
  UserInfo.UserSex = $('input[name=Sex]:checked').val();
  if($('input[name=NickName]').is(':disabled')){
    delete ajaxData.NickName;
  }
  if (!UserInfo.BirthDay) {
    layer.msgWarn("璇疯缃敓鏃�");
    return false;
  }
  if(isErr)return false;
  //浼犺緭ajax
  // ajaxData=ajaxData1[0];
  ajaxData.Sex = UserInfo.UserSex;
  ajaxData.Birthday = UserInfo.BirthDay;
  console.log(ajaxData)
  $.ajax({
    load: true,
    data: ajaxData,
    success: function(data) {
      if (data.Code == 1) {
        refreshData(['UserNickName','UserSex','UserBirthDay'],function(){
          layer.url(data.StrCode, '/personalInfo.html');
        });
      } else {
        layer.msgWarn(data.StrCode);
      }
    }
  })
});

//濉厖骞存湀鏃�
function fill($dom, beginNum, endNum) {
  var fn = "push";
  if (beginNum > endNum) {
    beginNum = beginNum ^ endNum;
    endNum = endNum ^ beginNum;
    beginNum = beginNum ^ endNum;
    fn = "unshift";
  }
  var arr = [];
  for (var i = endNum; i >= beginNum; i--) {
    arr[fn]('<a href="javascript:;" value="' + i + '" >' + i + '</a>')
  }
  $dom.append(arr.join(''));
}
//澶村儚鍒楄〃閫夋嫨
// 涓存椂鍥剧墖
var photoUrl = "";
var imgUrlData = "";
var ajaxPhotoData = {
  Action: "UpdateUserPhoto"
};
$("body").on("click", ".headImgContent a", function() {
  var Obj = $(this);
  var ImgName = Obj.attr("title");
  var ImgUrl = Obj.find("img").attr("src");
  var ImgData = Obj.data("url");
  photoUrl = ImgData;
  imgUrlData = ImgUrl;
  Obj.parent().next().find("img").attr("src", ImgUrl);
  Obj.parent().next().find(".theName").text(ImgName);
  Obj.addClass("curr").siblings("a").removeClass("curr");
}).off("click", "#PhotoEdit").on("click", "#PhotoEdit", function() {
  //鍒ゆ柇鎵€鏈夎緭鍏ユ
  var ajaxPhotoData1 = _DomObj.getAjaxData(ajaxPhotoData);
  var err = ajaxPhotoData1[1];
  if (err) {
    layer.msgWarn(err.tipMsg[err.isErr]);
    return;
  }
  console.log(photoUrl);
  if (!photoUrl) {
    // layer.msgWarn("璇烽€夋嫨澶村儚");
    return;
  }
  //浼犺緭ajax
  ajaxPhotoData = ajaxPhotoData1[0];
  ajaxPhotoData['UserPhoto'] = photoUrl;
  $.ajax({
    load: true,
    data: ajaxPhotoData,
    success: function(data) {
      if (data.Code == 1) {
        // 淇濆瓨澶村儚
        $('.headImg').attr('src', imgUrlData).data('url', photoUrl);
        $('._personalInfo img').attr('src',imgUrlData);
        refreshData(['UserPhoto'],function(){
          layer.alert(data.StrCode);
        });
      } else {
        layer.msgWarn(data.StrCode);
      }
    }
  })
});



// 鏍囩鍒囨崲
var istab = $("#newTab").find("a"),
  taoLi = $(".tapli");
istab.on("click", function() {
  if (this.className.search('curr') > -1) {
    return;
  }
  istab.toggleClass('curr');
  taoLi.toggle();
})