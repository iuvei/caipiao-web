<?php if (!defined('THINK_PATH')) exit();?>
<div class="pager_tool" style="background:#fff">
   
</div>
<div class="table-out"> 
    <table class="tablecommon" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr class="title">
            <td colspan="9">开奖号码</td>
        </tr>
        <tr class="search">
            <td>
            起始时间：
            <input type="text" id="staDt" name="staDt" style="width:100px;" onfocus="WdatePicker({ readOnly: true, maxDate: '%y-%M-%d', dateFmt: 'yyyy/MM/dd' })" data-bind="textinput: StartDate" /></td>

            <td> 
                结束时间：
                <input type="text" id="endDt" name="endDt" style="width:100px;" onfocus="WdatePicker({ maxDate: '%y-%M-%d', readOnly: true, dateFmt: 'yyyy/MM/dd' })" data-bind="textinput: EndDate" />
                
            </td>
            <td width="*">
                <button type="submit" data-bind="click:DataCheck">查询</button>&#12288;

            </td>
            <td colspan="7">
                <input type="hidden" value="<?php echo date('Y/m/d',strtotime('-2 day')); ?>" id="ServerDateA" />
                <input type="hidden" value="<?php echo date('Y/m/d'); ?>" id="ServerDateB" />
            </td>
        </tr>
        <tr class="tr-e">
            <td width="10%">开奖时间</td>
            <td width="10%">期号</td>
            <td width="10%">仟</td>
            <td width="10%">佰</td>
            <td width="10%">拾</td>
            <td width="10%">个</td>
            <td width="10%">球5</td>
            

        </tr>
        <tbody data-bind="foreach:list">
            <tr class="t-tr hover">
                <td data-bind="text:DrawDt">--</td>
                <td data-bind="text:PeriodsNumber">15085</td>
                <td class="period period-1"><span data-bind="text:ResultNumber[0]"></span></td>
                <td class="period period-1"><span data-bind="text:ResultNumber[1]"></span></td>
                <td class="period period-1"><span data-bind="text:ResultNumber[2]"></span></td>
                <td class="period period-1"><span data-bind="text:ResultNumber[3]"></span></td>
                <td class="period period-3"><span data-bind="text:ResultNumber[4]"></span></td>
             
            </tr>
        </tbody>
    </table>
</div>
<div class="handle"  style="width:100%;text-align:center;padding:10px 0;">
    <div class="footer fanye" data-bind="page:currentPage"></div>
</div>