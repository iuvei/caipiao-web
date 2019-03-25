 $(document).on('click','.iconfont',function(){
    $(this).parent().parent().parent().next().stop().slideToggle();
 })
 
 $('.menuIcon').click(function(){
   $('.menu').stop().slideToggle();
 });



  var winheight=$(window).height();
  var shefheight=$('.middle').height();
  var minheigth=(shefheight>=winheight)?shefheight:winheight;
  //$('.middle').css('height',minheigth);
  
//确认付款图片上传browse 
//  var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
//    browse_button : 'browse',
//    url : '/index.php/portal/home/upload',
//    flash_swf_url : 'js/Moxie.swf',
//    silverlight_xap_url : 'js/Moxie.xap',
//    filters: {
//      mime_types : [ //只允许上传图片文件
//        { title : "图片文件", extensions : "jpg,gif,png" }
//      ]
//    }
//  });
//  uploader.init(); //初始化

  //绑定文件添加进队列事件
//  uploader.bind('FilesAdded',function(uploader,files){
//    for(var i = 0, len = files.length; i<len; i++){
//      var file_name = files[i].name; //文件名
//      //构造html来更新UI
//      var html = '<li id="file-' + files[i].id +'"><input hidden value="'+file_name+'" class="file-name"></li>';
//      $(html).appendTo('#file-list');
//      !function(i){
//        previewImage(files[i],function(imgsrc){
//          $('#file-'+files[i].id).append('<p><img src="'+ imgsrc +'" /></p>');
//        })
//        }(i);
//    }
//  });
//  
// 初始化Web Uploader
//var BASE_URL = '__TMPL__Public/assets/webuploader/';
//var uploader = WebUploader.create({
//    // 选完文件后，是否自动上传。
//    auto: true,
//    // swf文件路径
//    swf: BASE_URL + 'Uploader.swf',
//    // 文件接收服务端。
//    server: '/index.php/portal/home/upload',
//    // 选择文件的按钮。可选。
//    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
//    pick: '#browse',
//    // 只允许选择图片文件。
//    accept: {
//        title: 'Images',
//        extensions: 'gif,jpg,jpeg,bmp,png',
//        mimeTypes: 'image/*'
//    }
//});
//// 文件上传成功，给item添加成功class, 用样式标记上传成功。
//uploader.on( 'uploadSuccess', function( file,response ) {
////    $( '#'+file.id ).addClass('upload-state-done');
//    console.log(response);
//});

  
  //绑定文件添加进队列事件
//  uploader.bind('FilesAdded',function(uploader,files){
//      uploader.start();
//  });
//  uploader.bind('FileUploaded',function(uploader,file,responseObject){
////      console.log(JSON.parse(responseObject.response));
//      var img=JSON.parse(responseObject.response);
//      //构造html来更新UI
//      $('.img-name').val(img.name);
//      $('.file-li').html('<p><img src="'+ img.name +'" /></p>');
//  });

  //plupload中为我们提供了mOxie对象
  //有关mOxie的介绍和说明请看：https://github.com/moxiecode/moxie/wiki/API
  //如果你不想了解那么多的话，那就照抄本示例的代码来得到预览的图片吧
//  function previewImage(file,callback){//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
//    if(!file || !/image\//.test(file.type)) return; //确保文件是图片
//    if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
//      var fr = new mOxie.FileReader();
//      fr.onload = function(){
//        callback(fr.result);
//        fr.destroy();
//        fr = null;
//      }
//      fr.readAsDataURL(file.getSource());
//    }else{
//      var preloader = new mOxie.Image();
//      preloader.onload = function() {
//        preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
//        var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
//        callback && callback(imgsrc); //callback传入的参数为预览图片的url
//        preloader.destroy();
//        preloader = null;
//      };
//      preloader.load( file.getSource() );
//    } 
//  }



//收货图片上传browse 
//  var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
//    browse_button : 'browse1',
//    url : '/index.php/portal/home/upload',
//    flash_swf_url : 'js/Moxie.swf',
//    silverlight_xap_url : 'js/Moxie.xap',
//    filters: {
//      mime_types : [ //只允许上传图片文件
//        { title : "图片文件", extensions : "jpg,gif,png" }
//      ]
//    }
//  });
//  uploader.init(); //初始化
//  
// //绑定文件添加进队列事件
//  uploader.bind('FilesAdded',function(uploader,files){
//      uploader.start();
//  });
//  uploader.bind('FileUploaded',function(uploader,file,responseObject){
////      console.log(JSON.parse(responseObject.response));
//      var img=JSON.parse(responseObject.response);
//      //构造html来更新UI
//      $('.img-name').val(img.name);
//      $('.file-li').html('<p><img src="'+ img.name +'" /></p>');
//  });

//  //绑定文件添加进队列事件
//  uploader.bind('FilesAdded',function(uploader,files){
//    for(var i = 0, len = files.length; i<len; i++){
//      var file_name = files[i].name; //文件名
//      //构造html来更新UI
//      var html = '<li id="file-' + files[i].id +'"><input hidden value="'+file_name+'" class="file-name"></li>';
//      $(html).appendTo('#file-list1');
//      !function(i){
//        previewImage(files[i],function(imgsrc){
//          $('#file-'+files[i].id).append('<p><img src="'+ imgsrc +'" /></p>');
//        })
//        }(i);
//    }
//  });

  //plupload中为我们提供了mOxie对象
  //有关mOxie的介绍和说明请看：https://github.com/moxiecode/moxie/wiki/API
  //如果你不想了解那么多的话，那就照抄本示例的代码来得到预览的图片吧
//  function previewImage(file,callback){//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
//    if(!file || !/image\//.test(file.type)) return; //确保文件是图片
//    if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
//      var fr = new mOxie.FileReader();
//      fr.onload = function(){
//        callback(fr.result);
//        fr.destroy();
//        fr = null;
//      }
//      fr.readAsDataURL(file.getSource());
//    }else{
//      var preloader = new mOxie.Image();
//      preloader.onload = function() {
//        preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
//        var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
//        callback && callback(imgsrc); //callback传入的参数为预览图片的url
//        preloader.destroy();
//        preloader = null;
//      };
//      preloader.load( file.getSource() );
//    } 
//  }
