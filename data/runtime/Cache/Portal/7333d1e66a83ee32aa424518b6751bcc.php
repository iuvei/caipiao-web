<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <link rel="stylesheet" type="text/css" href="/SSCMember/Content/Themes/Default/Home/Common.css?20160406325" /> 
    <link rel="stylesheet" type="text/css" href="/SSCMember/Content/Themes/Default/Home/Index.css?201688880817" name="oid" />
    <title>Index</title>
    <script src="/SSCMember/Scripts/Lib/jquery-1.11.1.min.js"></script>
    <script src="/SSCMember/Scripts/Default/InportTxt/index.js"></script>
</head>
<body>

    <div class="table-out">
        <table class="tablecommon tablecommon1 break" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-left: 2px;">
            <tr class="title">
                <td colspan="3">text导入</td>
            </tr>
            <tr class="t-left">
                <form action="/index.php/Portal/Home/InportTxt" method="post" enctype="multipart/form-data">
                    <td width="15%" style="text-align:center">文件路径</td>
                    <td width="30%"><input type="file" name="file" accept=".txt" /></td>
                    <td width="*"><button type="submit">提交</button></td>
                </form>
            </tr>
            <tr class="t-left">
                <td colspan="3"><span class="b-font">格式A：</span>号码，号码，号码&#12288;<span class="b-font">格式B：</span>号码=金额，号码=金额，号码=金额<span class="n-red">(逗号也可以用空格代表)</span><span class="b-font">&#12288;四字现格式：</span>例如1234现=a1234</td>
            </tr>
            <tr class="t-left">
                <td colspan="3"><span class="b-font">说明：</span>由于各会员使用的（txt文件）的格式不一样，如果不符合网站上要求的格式，有可能导入到网站（没有下注之前）的号码内容和自己（txt文件）里号码内容不一致，操作时请认真检查，如果出现内容不一致，请不要下注。</td>
            </tr>

        </table><br />
         <table class="tablecommon table-border-center" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-left:5px;">
            <tr class="title">
                <td colspan="12">文件明细</td>
            </tr>
            
            <tr <?php if($fs != 1): ?>style="display: none"<?php endif; ?>>
                <td style="padding:0;">
                    <table style="width:100%"  cellspacing="0" cellpadding="0" border="0">
                        <tr class="tr-e">
                            <td width="8.3%">号码</td>
                            <td width="8.3%" style="background:#FFFFC4;">号码</td>
                            <td width="8.3%">号码</td>
                            <td width="8.3%" style="background:#FFFFC4;">号码</td>
                            <td width="8.3%">号码</td>
                            <td width="8.3%" style="background:#FFFFC4;">号码</td>
                            <td width="8.3%">号码</td>
                            <td width="8.3%" style="background:#FFFFC4;">号码</td>
                            <td width="8.3%">号码</td>
                            <td width="8.3%" style="background:#FFFFC4;">号码</td>
                            <td width="8.3%">号码</td>
                            <td width="8.3%" style="background:#FFFFC4;">号码</td>
                        </tr>
                        <?php if($fs==1){ for($i=0;$i<ceil(count($bet)/12)*12;$i++){ if($i%12==0){ echo "<tr>"; } echo "<td>"; if($bet[$i]){ echo $bet[$i]; } else{ echo '--'; } echo "</td>"; if($i%12==11){ echo "</tr>"; } } } ?>
                        
    


                        <tr class="b-font tr-e">
                            <td align="center">合计笔数</td>
                            <td align="center" colspan="2" title="<?php echo count($bet); ?>"><?php echo count($bet); ?></td>
                            <td align="center">合计金额</td>
                            <td align="center" colspan="2" id="CountMoney">0</td>
                            <td align="center" colspan="6">&#12288;</td>
                        </tr>
                        <tr class="input-w">
                            <td colspan="6" align="right"><span style="font-size:16px;vertical-align:middle;">金额&nbsp;</span><input id="Money" maxlength="7" style="width:80px;height:25px;font-size:15px;font-weight:bold;" type="text" /></td>
                            <td colspan="6"><input class="btn" type="button" id="Betzero" value="下注"/></td>
                        </tr>
                    </table>
                </td>
            </tr>


            
            <tr <?php if($fs != 2): ?>style="display: none"<?php endif; ?>>
                <td style="padding:0;">
                    <table style="width:100%" cellspacing="0" cellpadding="0" border="0">
                        <tr align="center" class="tr-e">
                            <td width="8.3%">号码</td>
                            <td width="8.3%">金额</td>
                            <td width="8.3%" style="background:#FFFFC4;">号码</td>
                            <td width="8.3%" style="background:#FFFFC4;">金额</td>
                            <td width="8.3%">号码</td>
                            <td width="8.3%">金额</td>
                            <td width="8.3%" style="background:#FFFFC4;">号码</td>
                            <td width="8.3%" style="background:#FFFFC4;">金额</td>
                            <td width="8.3%">号码</td>
                            <td width="8.3%">金额</td>
                            <td width="8.3%">号码</td>
                            <td width="8.3%">金额</td>
                        </tr>
                        

                        <?php $hjmoney=0; if($fs==2){ for($i=0;$i<ceil(count($bet)/6)*6;$i++){ if($i%12==0){ echo "<tr>"; } echo "<td>"; if($bet[$i]){ echo $bet[$i]['xx']; } else{ echo '--'; } echo "</td>"; echo "<td>"; if($bet[$i]){ $hjmoney=$hjmoney+$bet[$i]['money']; echo $bet[$i]['money']; } else{ echo '--'; } echo "</td>"; if($i%12==11){ echo "</tr>"; } } } ?>

                        <tr class="b-font tr-e">
                            <td align="center">合计笔数</td>
                            <td align="center" colspan="2" id="Allcount" title="<?php echo count($bet); ?>"><?php echo count($bet); ?></td>
                            <td align="center">合计金额</td>
                            <td align="center" colspan="2"><span><?php echo $hjmoney; ?></span></td>
                            <td align="center" colspan="6">&#12288;</td>
                        </tr>
                        <tr class="input-w">
                            <td colspan="12" style="text-align: center;"><input class="btn" type="button" id="Betone" value="下注" /></td>
                        </tr>
                    </table>
                </td>
            </tr>

            
            
        </table>
    </div>
</body>
</html>