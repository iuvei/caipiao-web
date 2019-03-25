<?php if (!defined('THINK_PATH')) exit();?><link rel="stylesheet" type="text/css" href="/SSCMember/Content/Themes/SSkin/BetList/Index.css?20160401654" />
<body>
    <div class="table-out" id="BETLIST-TPL">
        <table class="tablecommon table-bd" cellpadding="0" width="100%" cellspacing="0" border="0">
            <tr class="title-left">
                <td colspan="8">搜索</td>
            </tr>
            <tr class="search">
                <td width="60">查号码</td>
                <td width="60"><input type="text" id="BetNumber" data-bind="textinput:BetNumber"></td>
                <td width="60"><label>现&nbsp;<input type="checkbox" id="IsShow" style="width:15px;" data-bind="checked:IsShow"></label></td>
                <td width="100">列出&#12288;<select id="QueryStatus" data-bind="value:QueryStatus"><option value="0">金额</option><option value="1">赔率</option><option value="2">退码</option></select>  </td>
                <td width="60"><input type="text" id="BeginNum" data-bind="textinput:BeginNum"></td>
                <td width="80">至&nbsp;<input type="text" id="EndNum" data-bind="textinput:EndNum"></td>
                <td width="120">
                    分类
                    <select id="BetTypeID" data-bind="value:BetTypeID">
                        <option value="0">全部</option>
                        <option value="19">一定位</option>
                        <option value="20">口XXX</option>
                        <option value="21">X口XX</option>
                        <option value="22">XX口X</option>
                        <option value="23">XXX口</option>
                        <option value="24">XXXX口</option>
                        <option value="1">二定位</option>
                        <option value="2">口口XX</option>
                        <option value="3">口X口X</option>
                        <option value="4">口XX口</option>
                        <option value="5">X口X口</option>
                        <option value="6">X口口X</option>
                        <option value="7">XX口口</option>
                        <option value="17">四五二定位</option>
                        <option value="18">口XXX口</option>
                        <option value="8">三定位</option>
                        <option value="9">口口口X</option>
                        <option value="10">口口X口</option>
                        <option value="11">口X口口</option>
                        <option value="12">X口口口</option>
                        <option value="13">四定位</option>
                        <option value="14">二字现</option>
                        <option value="15">三字现</option>
                        <option value="16">四字现</option>
                     
                    </select>
                </td>
                <td width="*">
                    <button type="submit" data-bind="click:ClickSubmit">提交</button>&#12288;
                    <button type="button" data-bind="click:Print">打&nbsp;印</button>&#12288;
                    <button type="submit" data-bind="click:ClickIsWin">中奖明细</button>&#12288;
                    <button type="button" data-bind="click:BackYards">退码</button>&#12288;
                    <button type="button" data-bind="click:BackBetHistory,visible:IsHistoryList">返回历史账单</button>
                </td>
            </tr>
        </table>
        <br />

        <!--print startBetList-->
        <table class="tablecommon" cellpadding="0" width="100%" cellspacing="0" border="0">
            <thead>
                <tr class="title">
                    <td colspan="11"><label id="BetListTitle"></label> </td>
                </tr>
                <tr class="tr-e">

                    <td>彩种</td>
                    <td>注单编号</td>
                    <td>下单时间</td>
                    <td>号码</td>
                    <td>金额</td>
                    <td>赔率</td>
                    <td>中奖</td>
                    <td>回水</td>
                    <td>盈亏</td>
                    <td>状态</td>
                    <td class="no-print"><label data-bind="visible:IsSingleBack">全选&nbsp;<input type="checkbox" data-bind="checked:checkeAll,disable:IsOpening" /></label></td>
                </tr>
            </thead>
            <tbody data-bind="foreach:list">
                <tr data-bind="css:(BetStatus-0)==1?'hover3':(IsHotNum)?'yellowIsHotNum':'hover'">
                    <td>圣地彩</td>
                    <td data-bind="text:LsBetIds"></td>
                    <td>
                        <label data-bind="text:BetDt"></label>
                        <div style="color:red;" data-bind="visible:$parent.BetStatusShow(BetStatus)">
                            退
                            <label data-bind="text:UpdateDt"></label>
                        </div>
                    </td>
                    <td>
                        <label data-bind="text:BetNumber,css:BetStatus-0!==1?'hover4':'hover'"></label>
                        <label data-bind="visible:$parent.BetTypeShow(BetTypeID)" style="font-weight: bold;color:red; ">现</label>
                    </td>
                    <td data-bind="text:BetAmount-0"></td>
                    <td data-bind="text:Odds-0"></td>
                    <td data-bind="text:WinLoss-0"></td>
                    <td data-bind="text:Backwater"></td> 
                    <td data-bind="text:ProfitAndLoss"></td> 
                    <td data-bind="text:$parent.BetStatusType(BetStatus)"></td>
                    <td class="no-print">
                        <!--ko if:typeof $data.checked ==='undefined'-->
                        --
                        <!--/ko-->
                        <!--ko if:!!$data.checked-->
                        <input type="checkbox" data-bind="checked:checked" />
                        <!--/ko-->
                    </td>

                </tr>

            </tbody>

            <tbody data-bind="if:list().length===0">
                <tr class="bet" id="IsHidden">
                    <td colspan="11">还没有内容</td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="tr-e">
                    <td colspan="2">合计</td>
                    <td><label id="BetListCount"></label></td>
                    <td>&#12288;</td>
                    <td><label id="BetListSum"></label></td>
                    <td></td>
                    <td><label id="BetListWinLoss"></label></td>
                    <td><label id="BetListBackwater"></label></td>
                    <td><label id="BetListBackComm"></label></td>
                    <td>&#12288;</td>
                </tr>
            </tfoot>
        </table>
        <!--print endBetList-->

        <br />
        <div class="footer fanye"><button type="button" data-bind="click:BackYards,disable:IsOpening">退码</button>&#12288;</div>
        <br />
        <div class="footer fanye" data-bind="page:currentPage"></div>

        

    </div>
</body>