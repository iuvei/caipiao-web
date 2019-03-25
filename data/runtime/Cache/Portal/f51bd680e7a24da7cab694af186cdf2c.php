<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" /> 
    <title>Index</title>
</head>
<body>

    <div class="table-out">
        <table class="table-border tablecommon" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-left: 2px;">
            <tr class="title">
                <td colspan="10" class="model">
                    <span>赔率变动表</span>
                    <a href="#" data-bind="click:GetBetType.bind(1,{num:1,type:'FixTwo'})" class="red"> 二定位</a>&nbsp;&nbsp;&nbsp;&nbsp
                    <a href="#" data-bind="click:GetBetType.bind(8,{num:8,type:'FixThree'})">三定位</a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="#" data-bind="click:GetBetType.bind(13,{num:13,type:'FixFour'})">四定位</a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="#" data-bind="click:GetBetType.bind(14,{num:14,type:'DisplayTwo'})">二字现</a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="#" data-bind="click:GetBetType.bind(15,{num:15,type:'DisplayThree'})">三字现</a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="#" data-bind="click:GetBetType.bind(16,{num:16,type:'DisplayFour'})">四字现</a>&nbsp;&nbsp;&nbsp;&nbsp;

                </td>
            </tr>           
            <tbody data-bind="foreach:list">                
                <tr class="hover">
                    <td class="blue" colspan="10" data-bind="text:$parent.getBetType(BetType)"></td>
                </tr>
                <tr>
                    <td style="background: #eeeeee;">号码</td>
                    <td style="background: #eeeeee;">赔率</td>
                    <td style="background:#FFFFC4;">号码</td>
                    <td style="background:#FFFFC4;">赔率</td>
                    <td style="background: #eeeeee;">号码</td>
                    <td style="background: #eeeeee;">赔率</td>
                    <td style="background:#FFFFC4;">号码</td>
                    <td style="background:#FFFFC4;">赔率</td>
                    <td style="background: #eeeeee;">号码</td>
                    <td style="background: #eeeeee;">赔率</td>
                </tr>
                <!--ko foreach:$data.LsSetting-->
                <tr data-bind="foreach:$data">
                    <td data-bind="text:BetItem,style:{background:$index()%2!==0&&$index()!==0?'#FFFFC4':''}">0000</td>
                    <td data-bind="text:Odds1,style:{background:$index()%2!==0&&$index()!==0?'#FFFFC4':''}">0000</td>
                </tr>
                <!--/ko-->
            </tbody>
           
        </table>
    </div>
</body>
</html>