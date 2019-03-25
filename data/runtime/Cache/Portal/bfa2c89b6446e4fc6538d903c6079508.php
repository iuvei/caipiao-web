<?php if (!defined('THINK_PATH')) exit();?>

 <style>
     .button {
         padding: 0px;
         color: #000;
         /*for Mozilla*/
         height: 42px !important;
         line-height: 43px !important;
         /*for IE7*/
         /*> height: 42px !important;
         > line-height: 40px !important;*/
         /*for IE*/
         height: 41px;
         line-height: 42px;
         width: 60px;
         font: 14px Arial, Helvetica, sans-serif;
         font-weight: bold;
     }
 </style>
<table height="80%" cellspacing="1" cellpadding="0" width="98%" align="center" bgcolor="#666666" border="0" id="ruletable">
    <form method="GET" action="/"></form>
    <tbody>
        <tr>
            <td valign="center" bgcolor="#ccccd4" height="18">
                <p align="center" style="font-size: 16px; line-height: 30px; font-weight: bold;">免责声明</p>
            </td>
        </tr>
        <tr>
            <td valign="top" bgcolor="#ffffff">
                <table cellspacing="0" cellpadding="5" width="98%" align="center" border="0">
                    <tbody>
                        <tr>
                            <td height="300" valign="top">
                                致用户<br><br>


                                <font color="red"><b>1.用户明确同意本系统的使用由用户个人承担风险。</b></font>

                                <br><br>2.本系统不作任何类型的担保，不担保服务一定能满足用户的要求，也不担保服务不会受中断，对服务的及时性，安全性，出错发生都不作担保。
                                <br><br>用户理解并接受，任何通过本系统服务取得的信息资料的可靠性取决于用户自己，<font color="red"><b>用户自己承担所有风险和责任。</b></font>

                                <br><br>3.本声明的最终解释权归本系统所有。
                                <br>
                                <br>
                                <br>特别提醒：本公司如果输入开奖结果错误，有权利更正开奖结果，最终以官方最后公布结果来结账，不得异议。
                                <br>
                                <br>特别提醒：为了避免出现争议，请各会员到第二天早上才开始兑奖。不要当天晚上知道结果后，马上就兑奖给客人，出现当天晚上兑奖造成的损失，会员自负，不得异议。
                                <br>
                                <br>
                                <br>

                            </td>
                        </tr>
                        <tr>
                            <td>
                                <pre></pre>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" bgcolor="#ffffff" height="21">
                                <table cellspacing="0" cellpadding="0" width="69%" align="center" border="0">
                                    <tbody>
                                        <tr>
                                            <td width="47%" height="21" align="middle"><strong></strong> </td>
                                            <td width="53%" align="left">
                                                <input onclick="gotoHome()" type="button" class="button" value="不同意" name="Submit">
                                                &nbsp;&nbsp;
                                                <input onclick="gotoMain()" type="button" value="同意" id="Submit2" autofocus="autofocus" name="Submit2" class="button">
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
 <script type="text/javascript">
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0]; 
        if (e && e.keyCode == 13) { // enter 键 
            gotoMain()
        }
    };
     function gotoMain() {
         location.href = "/index.php/portal/agent/main"; 
     }
     function gotoHome()
     {
         location.href = "/index.php/portal/index/agent";
     }
 </script>