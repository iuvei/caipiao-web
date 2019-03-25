<?php if (!defined('THINK_PATH')) exit();?>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title></title>
    <script src="/SSCMember/scripts/jquery-1.8.2.js"></script>

    

    <link rel="stylesheet" type="text/css" href="/SSCMember/Content/Themes/SSkin/Home/Common.css?20160406398745611" name="oid" />
    <style>
        .title-left td {
            border-left: none;
            padding: 0;
            padding-left: 5px;
            text-align: left;
            color: #fff;
            font-weight: bold;
            background: url(../../../../Images/Default/Main/bg_list_left.gif) repeat-x;
            height: 30px;
            line-height: 30px;
            border-bottom: 1px solid #640000;
        }
        td.altbg1, .altbg1 td {
            background: #F1F5F8;
            text-decoration: none;
            text-align: left;
        }
    </style>
</head>
<body leftmargin="10" topmargin="10" onkeydown="keyLogin();">
    <div id="append_parent"></div>
    <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tablecommon table-border">
                        <tbody>
                            <tr class="title-left">
                                <td colspan="2">帐户修改密码 </td>
                            </tr>
                            <tr>
                                <td class="altbg1">旧密码:</td>
                                <td class="altbg2">
                                    <input type="password" name="oldpassword" id="oldpassword" size="25" tabindex="2" />
                                    <font style="font-size:12px;color:#ff0000"> (密码的长度必须在8-15位之间,并且包含字母和数字)</font>
                                </td>
                            </tr>
                            <tr>
                                <td class="altbg1">新密码:</td>
                                <td class="altbg2">
                                    <input type="password" name="newpassword" id="newpassword" size="25" tabindex="2" />
                                    <font style="font-size:12px;color:#ff0000" id="newpssword-Tip"> (密码的长度必须在8-15位之间,并且包含字母和数字)</font>
                                </td>
                            </tr>
                            <tr>
                                <td class="altbg1">确认新密码:</td>
                                <td>
                                    <input type="password" name="newpassword2" id="newpassword2" size="25" tabindex="3" />
                                    <font style="font-size:12px;color:#ff0000" id="pssword-Tip"> (确认密码与密码必须保持一致)</font>
                                </td>
                            </tr>
                        </tbody>
                    </table>    <br />
                    <center>
                        <button type="button" class="button" name="editsubmit" id="editsubmit" value="true">提 交</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </center>
                    <script language="JavaScript">
                        function keyLogin() {
                            if (event.keyCode == 13)
                                //按Enter键的键值为13
                                document.getElementById("editsubmit").click();
                            //调用登录按钮的登录事件
                        }
                    </script>
                    
                    <script>
                        $(function () {
                           
                            var
                               oldpassword = $('#oldpassword'),
                               newpassword = $('#newpassword'),
                               newpassword2 = $('#newpassword2');
                            $('#editsubmit').on('click', function () {
                                var changePwd = {
                                    oldPwd: { EmptyMsg: '请输入旧密码', value: oldpassword.val() },
                                    newPwd: { EmptyMsg: '请输入新密码', value: newpassword.val() },
                                    reNewPwd: { EmptyMsg: '请输入确认密码', value: newpassword2.val() }
                                },
                                single;
                                for (var i in changePwd) {
                                    single = changePwd[i];
                                    if ($.trim(single['value']) === '') {
                                        alert(single.EmptyMsg);
                                        return;
                                    }
                                    else if (i === 'newPwd') {
                                        if (single.value == "a12345" || single.value == "ab1234" || single.value == "abc123" || single.value == "a1b2c3" || single.value == "aaa111" || single.value == "123qwe") {
                                            alert("密码过于简单,请重新输入!"); return;//系统禁止使用如：a12345 、ab1234 、abc123 、a1b2c3 、aaa111 、123qwe 等过于简单的密码
                                        }
                                        else if (!/(\d+[a-z]+)|([a-z]+\d+)/i.test(single.value)) {
                                            alert("新密码必须包含字母和数字"); return;
                                        }
                                        else if (!/^[\da-z]{8,15}$/i.test(single.value)) {
                                            alert("新密码的长度必须在8-15位之间,并且包含字母和数字"); return;
                                        }
                                    }
                                }
                                if (changePwd.newPwd.value !== changePwd.reNewPwd.value) {
                                    alert('两次输入的密码不相同');
                                    return;
                                }
                                $.ajax({
                                    url: "/index.php/portal/home/EditPassword2",
                                    type: "post",
                                    cache: false,
                                    data: {
                                        oldpassword: oldpassword.val(), password: newpassword.val(), password1: newpassword2.val()
                                    },
                                    success: function (json) {
                                        if (json.status == true) {
                                            alert("密码修改成功,请重新登录！");
                                            window.location.href = "/?hy=1";
                                        } else {
                                            alert(json.info);
                                            var
                                            oldpassword = $('#oldpassword').val(''),
                                            newpassword = $('#newpassword').val(''),
                                            newpassword2 = $('#newpassword2').val('');
                                            return false;
                                        }
                                    }
                                });
                            });
                        });
                    </script>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>