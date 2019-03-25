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
//首屏渲染
getRenData(['UserName', 'UserTitle', 'UserNickName', 'UserGrade', 'UserMobile', 'UserMail', 'UserPhoto', 'UserSex', 'UserQQ', 'UserBirthDay', 'UserGradeGrow', 'GradeList', 'DefaultPhotoList'], function(renderData) {
  var hasGrade="";
  if (renderData.UserName) {
    $('#userName').text(renderData.UserName);
    $('#userName2').text(renderData.UserName);
  }
  // 昵称
  if (renderData.UserNickName) {
    $('input[name="NickName"]').val(renderData.UserNickName).prop("disabled", "disabled");
    delete _DomObj.Input.NickName;
  }
  // QQ号
  if (renderData.UserQQ) {
    $('input[name="QQ"]').val(renderData.UserQQ);
  }
  // 头像
  if (renderData.UserPhoto) {
    $('.headImg').attr({
      "src": _Path.Host.img + _Path.path.photos + renderData.UserPhoto,
      "data-url": renderData.UserPhoto
    });
  }
  // 手机号
  if (renderData.UserMobile) {
    $('input[name="Mobile"]').val(renderData.UserMobile).next().text("修改").attr("href", "verifyMobile.html?Q=ResetMobile");
    // $("#changeMobile");
  }
  // 邮箱
  if (renderData.UserMail) {
    $('input[name="Mail"]').val(renderData.UserMail).next().text("修改").attr("href", "verifyMail.html?Q=ResetMail");
  }
  // 头衔
  if (renderData.UserTitle) {
    $('#UserTitle').text(renderData.UserTitle);
    $('#UserTitle2').text(renderData.UserTitle);
  }
  // 等级
  if (renderData.UserGrade) {
    _PublicRenData.UserGrade=renderData.UserGrade;
    var isVal;
    switch(renderData.UserGrade){
      case "-1":
        isVal = "测试";
        break;
      case "0":
        isVal = "黑名单";
        break;
      case "10":
        isVal = "代理";
        break;
      default:
        isVal="VIP"+renderData.UserGrade;
    }
    $('#UserGrade').text(isVal);
    $('#UserGrade2').text(isVal);
  }
  // 性别
  if (renderData.UserSex) {
    $("label[val=" + renderData.UserSex + "]").click();
  }
  // 生日
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
  // 等级机制
  if (renderData.GradeList) {
    _PublicRenData.GradeList=renderData.GradeList;
    console.log(_PublicRenData.GradeList);
    var dohtmlNext = ['<tr>\
                        <th>等级</th>\
                        <th>头衔</th>\
                        <th>成长积分</th>\
                        <th>晋级奖励(元)</th>\
                        <th>跳级奖励(元)</th>\
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
    // hasGradeGrow=250;//测试设置为250分
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
        UserGradeGrow2.text(hasGradeGrow + "分");
        UserGradeGrow.html(parseInt(PerNum) + "%");
        GradeStatr.html("VIP" + hasGrade);
        GradeEnd.html("VIP" + (hasGrade + 1));
        GradeUp.html("<span style='color:#f14241'>"+hasGradeGrow+"</span>/"+listIndexB+"  距离下一级还要" + isShowNum + "分");
        progress.css("width", PerNum + "%");
      } else {
        UserGradeGrow2.text("0分");
        UserGradeGrow.html("0%");
        GradeStatr.html("");
        GradeEnd.html("");
        GradeUp.text("");
        progress.css("width", "0%");
      }
    }else{
        UserGradeGrow2.text(hasGradeGrow+"分");
        UserGradeGrow.html("100%");
        GradeStatr.html("VIP8");
        GradeEnd.html("VIP9");
        GradeUp.text("");
        progress.css("width", "100%");
    }
  }
  // 头像列表渲染
  if (renderData.DefaultPhotoList) {
    var hasPhotoList=renderData.DefaultPhotoList
    var photoHead = '';
    var photoInner = '';
    var photoFoot = '';
    photoHead = '<div class="headImgList">\
            <div class="headImgListTitle">\
                修改头像 <a class="layui-layer-ico layui-layer-close" href="javascript:;"></a>\
            </div>\
            <div class="headImgContent">';
    $(hasPhotoList).each(function(i, Obj) {
      photoInner += ' <a href="javascript:;" title="' + Obj.ImageName + '" data-url="' + Obj.ImageUrl + '"><img class="headImg" src="' + _Path.Host.img + _Path.path.photos + Obj.ImageUrl + '" alt="' + Obj.ImageName + '"></a>';
    });
    photoFoot = '</div>\
            <div class="headImgView">\
                <h5>预览</h5>\
                <p>100x100</p>\
                <img src="' + _Path.Host.img + _Path.path.photos + hasPhotoList[0].ImageUrl + '" alt="">\
                <h5 style="color: #53a8f1;" class="theName">' + hasPhotoList[0].ImageName + '</h5>\
                <div class="button">\
                    <a class="submitBtn" id="PhotoEdit" href="javascript:layer.closeAll(\'page\');">保存头像</a>\
                    <a class="submitBtn cancel" href="javascript:layer.closeAll(\'page\');">取消</a>\
                </div>\
            </div>\
            </div>';
    photoHTML = photoHead + photoInner + photoFoot;
  }
});
// 头像列表
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

//插件初始化
fill($('.diyselect[name="Year"] div'), theYear - 70, theYear);
fill($('.diyselect[name="Month"] div'), 12, 1);
fill($('.diyselect[name="Date"] div'), 31, 1);

_FomatConfig.NickName = {
  Name: "昵称",
  ErrMsg: "请使用五位以内的汉字",
  Reg: /^[\u4e00-\u9fa5]{0,5}$/
}
_FomatConfig.QQ = {
  Name: "QQ号",
  ErrMsg: "QQ号为5-12位数字",
  Reg: /^\d{5,12}$/
}
$('input').addInputCheck();
$('[type=radiobox]').inputbox();
$('[type=selectbox]').inputbox({
  width: 73,
  height: 30
});



//当下拉框的值改变时
function selectBoxChange($dom) {
  var parentName = $dom.closest('.diyselect').attr('name');
  d[parentName] = $dom.attr('value');
  if (new Date(Date.parse(d.Month + '/' + d.Date + '/' + d.Year)).getDate() == d.Date) {
    showMsg($('.diyselect[name="Date"]'), true, '')
    UserInfo.BirthDay = d.Year + "-" + d.Month + "-" + d.Date;
  } else {
    UserInfo.BirthDay = 0;
    showMsg($('.diyselect[name="Date"]'), false, '日期格式错误')
  }
}


//提交前检验
var ajaxData0 = {
  Action:"UpdatePersonInfo"
};
$(".submitBtn").on("click", function() {
  //判断所有输入框
  var ajaxData = _DomObj.returnAjaxData(ajaxData0)[0],
      isErr=$(".verifyWrong").length;
  UserInfo.UserSex = $('input[name=Sex]:checked').val();
  if($('input[name=NickName]').is(':disabled')){
    delete ajaxData.NickName;
  }
  if (!UserInfo.BirthDay) {
    layer.msgWarn("请设置生日");
    return false;
  }
  if(isErr)return false;
  //传输ajax
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

//填充年月日
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
//头像列表选择
// 临时图片
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
  //判断所有输入框
  var ajaxPhotoData1 = _DomObj.getAjaxData(ajaxPhotoData);
  var err = ajaxPhotoData1[1];
  if (err) {
    layer.msgWarn(err.tipMsg[err.isErr]);
    return;
  }
  console.log(photoUrl);
  if (!photoUrl) {
    // layer.msgWarn("请选择头像");
    return;
  }
  //传输ajax
  ajaxPhotoData = ajaxPhotoData1[0];
  ajaxPhotoData['UserPhoto'] = photoUrl;
  $.ajax({
    load: true,
    data: ajaxPhotoData,
    success: function(data) {
      if (data.Code == 1) {
        // 保存头像
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



// 标签切换
var istab = $("#newTab").find("a"),
  taoLi = $(".tapli");
istab.on("click", function() {
  if (this.className.search('curr') > -1) {
    return;
  }
  istab.toggleClass('curr');
  taoLi.toggle();
})