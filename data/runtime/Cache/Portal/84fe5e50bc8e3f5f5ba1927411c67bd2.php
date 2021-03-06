<?php if (!defined('THINK_PATH')) exit();?>
    <div class="table-out">
        <form  data-bind="submit:sub">
            <table class="tablecommon password-table table-bd" cellpadding="0" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr class="title-left">
                    <td colspan="2">账户修改密码</td>
                </tr>
                <tr>
                    <td width="100">原  密  码:</td>
                    <td><input type="password" id="oldpassword" placeholder="长度为8-15位" style="width:250px;" /> </td>
                </tr>
                <tr>
                    <td width="100">新  密  码:</td>
                    <td>
                        <input type="password" id="newpassword" placeholder="长度为8-15位" style="width:250px;" />
                        <span class="n-red">
                            &nbsp;
                            <font style="font-size:12px;" color="red" id="newpssword-Tip">(新密码不能跟账号和原密码相同)</font> 
                        </span>
                    </td>
                </tr>
                <tr>
                    <td width="100">确认新密码:</td>
                    <td>
                        <input type="password" id="newpassword2" placeholder="长度为8-15位" style="width:250px;" />
                        <span class="n-red">
                            &nbsp;
                            <font style="font-size:12px;" color="red" id="pssword-Tip">(确认密码与密码必须保持一致)</font> 
                        </span>
                    </td>
                </tr>
                <tr class="n-red">
                    <td colspan="2">系统禁止使用如：a12345 、ab1234 、abc123 、a1b2c3 、aaa111 、123qwe 等过于简单的密码。</td>
                </tr>
            </table><br />
            <div style="text-align:center;width:100px;margin:0 auto;">
                <button type="submit" class="button" name="editsubmit" id="editsubmit" value="true">提 交</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
        </form>
        <script type="text/javascript">
            $(function () {
                $('#editsubmit').on('click', function () {
                    var newpsswordTip = $('#newpssword-Tip'),
                        psswordTip = $('#pssword-Tip'),
                        oldpassword = $('#oldpassword'),
                        newpassword = $('#newpassword'),
                        newpassword2 = $('#newpassword2');
                    newpassword.on('input propertychange', function () {
                        if (this.value.length > 15) {
                            setTimeout(function () {
                                newpasswordTip.html('(密码长度不能超过15位)');
                            }, 0);
                            return;
                        }
                        newpasswordTip.html('(新密码不能跟账号和原密码相同)');
                    });
                    newpassword2.on('input propertychange', function () {
                        if (this.value.length > 15) {
                            setTimeout(function () {
                                psswordTip.html('(确认密码长度不能超过15位)');
                            }, 0);
                            return;
                        }
                        psswordTip.html('(确认密码与密码必须保持一致)');
                    });
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
                        url: "/ChangePassword/ModifyMemberPasswordBySelf",
                        type: "post",
                        cache: false,
                        data: {
                            oldpassword: oldpassword.value, password: newpassword.value, password1: newpassword2.value
                        },
                        success: function (json) {
                            if (json.status == true) {
                                alert("密码修改成功,请重新登录！");
                                window.location.href = "/home/index";
                            } else {
                                alert(json.info);
                                return false;
                            }
                        }
                    });
                });
            });
        </script>
    </div>