<?php if (!defined('THINK_PATH')) exit();?><table width="100%" border="0" cellpadding="0" cellspacing="0" >
    <tbody>
        <tr class="header"><td style="border-top: 1px solid #5b5a48;" colspan="5">操作日志</td></tr>
        <tr class="altbg2">
            <td width="90">被操作账号 </td>
            <td width="100"><input type="text" maxlength="16" data-bind="textinput:UserName"   style="width:90px;height:20px;line-height:20px;padding-left:5px;"></td>
            <td width="*"><input class="button" type="submit" data-bind="click:GetData" value="提 交"></td>
        </tr>

    </tbody>
</table>
<form method="post" action="http://fw5.b789b.com/index.php?action=settings&action=basic">
    <input type="hidden" name="formhash" value="d167814a">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tableborder">
        <tbody>
            <tr class="header">
            <td width="8%">操作账号</td>
            <td width="14%">被操作账号</td>
            <td width="60%">操作内容</td>
            <td width="10%">操作时间</td>
            <td width="8%">操作IP</td>
            </tr>
            
        </tbody>
        <tbody data-bind="foreach:list">
            <tr>
                <td data-bind="text:LoginName"></td>
                <td data-bind="text:UpdateLoginName"></td>
                <td data-bind="html:Describe"></td> 
                <td data-bind="text:CreateDt"></td>
                <td data-bind="text:OperateIP"></td>
            </tr>
           
        </tbody>
    </table>
    <center>

        &nbsp; &nbsp; &nbsp; &nbsp;
        <input class="button" type="button" name="button" value="返 回" data-bind="click:back,visible:isNewSubordinateClick()" />
    </center>
</form>