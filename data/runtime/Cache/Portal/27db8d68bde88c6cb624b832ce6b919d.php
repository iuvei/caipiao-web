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
             -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
     }
    
 </style>
<table height="80%" cellspacing="1" cellpadding="0" width="98%" align="center" bgcolor="#666666" border="0" id="ruletable">
    <form method="GET" action="/?frames=yes"></form>

    <tbody>
        <tr>
            <td valign="center" bgcolor="#ccccd4" height="18">
                <p align="center" style="font-size: 16px; line-height: 30px; font-weight: bold;">线上投注协议 </p>
            </td>
        </tr>
        <tr>
            <td valign="top" bgcolor="#ffffff">
                <table cellspacing="0" cellpadding="5" width="98%" align="center" border="0">
                    <tbody>
                        <tr>
                            <td height="300" valign="top">
                                致会员<br><br>


                                1.当您在下注之后，请等待下注后的成功状态信息。

                                <br><br>2.为了避免出现争议，<font color="red"><b>您必须在下注之后检查 “ 下注状况 ”。</b></font>

                                <br><br>3.任何的投诉必须在开奖之前提出，<font color="red"><b>本公司不会受理任何开奖之后的投诉。</b></font>

                                <br><br>4.所有投注项目，公布赔率时出现的任何打字错误或非故意人为失误，本公司保留改正错误和按正确赔率结算投注的权力。

                                <br><br>5.开奖后的投注，将被视为“ 无效 ”。所有赔率将不定时浮动，<font color="red"><b>派彩时的赔率将以确认投注时之赔率为准。</b></font>

                                <br><br>6.敬告有意与本公司博彩之客户，应注意您所在的国家或居住地可能规定网络博彩不合法，若此情况属实，本公司将不接受任何客户因违反当地博彩或赌博法令所引起之任何责任。

                                <br><br>7.倘若发生遭黑客入侵破坏行为或不可抗拒之灾害导致系统故障或资料损坏，资料丢失等情况，我们将以本公司线上交易之后备资料为最后处理依据；为确保各方真实利益，请各会员交易后打印资料，本公司才接受投诉及处理。

                                <br><br>8.为避免纠纷，各会员在交易之后，务必进入下注明细检查，若发生任何异常，<font color="red"><b>请立即与代理商联系查证，</b></font>否则交易会员必须同意，一切交易历史将以本公司资料库中资料为准，不得异议。


                                <br><br>9.如本公司机房遇天灾，停电或不可抗力之因素,导致无法运作时,得中止所有未开奖前之投注,在本公司中止下注前,会员所有投注仍属有效,不得要求取消或延迟交收,以及不得有任何异议。

                                <br><br>10.如发生临时性、突发性等特殊情况,本公司有权作出相对应之决定,不得异议。

                                <br><br><font color="red"><b>11.结帐时，如发现信用额度和报表数据有冲突，以报表数据为最终结帐依据。</b></font>

                                <br><br>12.本公司所有投注皆含本金,请认真了解规则说明。


                                <table width="100%" border="0" cellspacing="0" cellpadding="5">
                                    <tbody>
                                        <tr>
                                            <td width="5%" valign="top" align="center"></td>
                                            <td width="95%"></td>
                                        </tr>
                                    </tbody>
                                </table>
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
                                            <td width="47%" height="21" align="middle">
                                                <strong>
                                                    了解以及同意以上列名的协议
                                                </strong>
                                            </td>
                                            <td width="53%" align="left">
                                                <input onclick="gotoHome()" type="button" class="button" value="不同意" name="Submit">
                                                &nbsp;&nbsp;
                                                <input onclick="gotoMain()" type="button" value="同意" autofocus="autofocus" id="Submit2" name="Submit2" class="button">

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
             gotoMain();
         }
     };
     function gotoMain() {
         location.href = "/index.php/Home/Main"; 
     }
     function gotoHome()
     {
         location.href = "/index.php/Index/login";
     }
 </script>