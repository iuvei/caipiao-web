<?php if (!defined('THINK_PATH')) exit();?><form method="post" name="companyform" action="http://fw5.b789b.com/index.php?action=reportclass&zizhanghao="></form>
<input type="hidden" name="formhash" value="d167814a">
<table border="0" cellpadding="0" cellspacing="0" class="tableborder" width="100%">
    <thead>
        <tr class="header">

            <td colspan="7" class="query-periods">
                期数分类账&nbsp;&nbsp;
                期号
                <select id="PeriodsNumber" data-bind="options:periodsNumber,optionsValue:'PeriodsNumber',optionsText:'PeriodsNumber',value:PeriodsNumber"class="query-period" ></select>
            </td>
        </tr>

        <tr class="reportTop">
            <td style="width:15%"></td>
            <td style="width:15%">类别</td>
            <td style="width:14%">笔数</td>
            <td style="width:14%">下注金额</td>
            <td style="width:14%">回水</td>
            <td style="width:14%">中奖</td>
            <td style="width:14%">盈亏</td>
        </tr>
    </thead>

    <tbody>
        <!--ko if: list().length > 0-->
        <!--ko foreach:{data:list}-->
            <tr>
                <td data-bind="text:LoginName">
                </td>
                <td style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.ClickShowDetails, css:IsShowDetails()?'add-gif':'reduce-gif'">实货合计</td>
                <td data-bind="text:TotalBetCount"></td>
                <td data-bind="text:Math.ceil(TotalBetAmount)"></td>
                <td data-bind="text:Math.ceil(TotalBackComm)"></td>
                <td data-bind="text:Math.ceil(TotalWinAmt)"></td>
                <td data-bind="text:Math.ceil(TotalWinLoss)"></td>
            </tr>
            <!--ko foreach:TypeList-->
            <tr data-bind="visible:$parent.IsShowDetails">
                <td>&nbsp;</td>
                <td data-bind="text:GroupName"></td>
                <td data-bind="text:BetCount"></td>
                <td data-bind="text:Math.ceil(BetAmount)"></td>
                <td data-bind="text:Math.ceil(BackComm)"></td>
                <td data-bind="text:Math.ceil(WinAmt)"></td>
                <td data-bind="text:Math.ceil(WinLoss)"></td>
            </tr>
                <!-- ko if:Children.length>1 -->
                <!-- ko foreach:Children -->
                <tr class="reportNow_z hover" data-bind="visible:$parents[1].IsShowDetails">
                    <td style="background: #fff;">&nbsp;</td>
                    <td data-bind="text:TypeName"></td>
                    <td data-bind="text:BetCount"></td>
                    <td data-bind="text:Math.ceil(BetAmount)"></td>
                    <td data-bind="text:Math.ceil(BackComm)"></td>
                    <td data-bind="text:Math.ceil(WinAmt)"></td>
                    <td data-bind="text:Math.ceil(WinLoss)"></td>
                </tr>
                <!-- /ko -->
                <!--/ko-->
            <!--/ko-->
        <!--/ko-->
        <!--/ko-->
    </tbody>
</table>
<br>