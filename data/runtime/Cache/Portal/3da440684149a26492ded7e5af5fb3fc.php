<?php if (!defined('THINK_PATH')) exit();?>
<form data-bind="submit:sub" method="post">
    <table class="tableborder" width="100%" cellspacing="0" cellpadding="0" border="0">

        <tr class="header" align="center">
            <td width="*"></td>
            <td width="12%">类别</td>
            <td width="12%">最小下注</td>
            <td width="38%">拦货金额</td>
            <td width="12%">赔率上限</td>
            <td width="12%">单注上限</td>
            <td width="12%">单项上限</td>
        </tr>
        <tbody id="SHOW" data-bind="foreach:list">
            <tr name="Store" class="hover" data-bind="id:classid">
                <td class="altbg2" width="13"></td>
                <td class="altbg2" data-bind="text:BetTypeName" width="*">口口口X</td>
                <td class="altbg2" data-bind="text:MinLimitBetAmount" width="12%">0.1</td>
                <td class="altbg2" width="24%">
                    <label data-bind="visible:!hidden">￥</label>
                    <input type="text" class="widthN" maxlength="8" name="MaxLimitStore" data-bind="textinput:MaxLimitStore,visible:!hidden" onkeyup="value=value.replace(/[^\d]/g,'')">
                    <label data-bind="visible:!hidden" class="red">(上限不能超过10000000)</label>
                </td>
                
                <td>
                    <label class="LimitOdds" style="width:auto;" data-bind="text:$parent['join'](LimitOdds1,LimitOdds2,LimitOdds3,LimitOdds4)" title="赔率上限"></label>
                </td>
                <td class="altbg2" data-bind="text:MaxLimitSigleBet" width="12%">200</td>
                <td class="altbg2" data-bind="text:MaxLimitItemBet" width="12%">5000</td>
            </tr>
        </tbody>
        <tr>
            <td class="altbg2" colspan="7" style="text-align:center">

                <input type="submit" value="修改" class="button" />
            </td>
        </tr>
    </table>
</form>