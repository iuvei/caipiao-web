<?php if (!defined('THINK_PATH')) exit();?><div class="pager_wrap">
    <div class="add-top">&#12288;
        查询
    </div>
    <div class="pager_tool" style="background:#fff">
        <input type="hidden" value="<?php echo date('Y/m/d',strtotime('-2 day')); ?>" id="ServerDateA" />
        <input type="hidden" value="<?php echo date('Y/m/d'); ?>" id="ServerDateB" />
        起始时间： <input type="text" id="staDt" name="staDt" onfocus="WdatePicker({ readOnly: true, maxDate: '%y-%M-%d', dateFmt: 'yyyy/MM/dd' })" data-bind="textinput: StartDate" />
        结束时间：<input type="text" id="endDt" name="endDt" onfocus="WdatePicker({ maxDate: '%y-%M-%d', readOnly: true, dateFmt: 'yyyy/MM/dd' })" data-bind="textinput: EndDate" />
        <input type="button" class="btn sve_btn" data-bind="click:DataCheck" value="查询" />
    </div>
    <div>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tableborder">
            <tr align="center" class="header">
                <td width="10%">期号</td>
                <td width="10%">开奖时间</td>
                <td width="10%">仟</td>
                <td width="10%">佰</td>
                <td width="10%">拾</td>
                <td width="10%">个</td>
                <td width="10%">球5</td>
                
                <td width="10%">更新时间</td>
            </tr>
            
            
            <tbody data-bind="foreach:list">
                <tr align="center" class="hover">
                    <td class="altbg2" data-bind="text:PeriodsNumber"></td>
                    <td class="altbg2" data-bind="text:DrawDt"></td>
                    <td class="altbg2"><div class="periodImg periodImg_1" data-bind="text:Numberlist[0]"></div></td>
                    <td class="altbg2"><div class="periodImg periodImg_1" data-bind="text:Numberlist[1]"></div></td>
                    <td class="altbg2"><div class="periodImg periodImg_1" data-bind="text:Numberlist[2]"></div></td>
                    <td class="altbg2"><div class="periodImg periodImg_1" data-bind="text:Numberlist[3]"></div></td>
                    <td class="reportmember"><div class="periodImg periodImg_3" data-bind="text:Numberlist[4]"></div></td>
                    
                    <td class="altbg2" data-bind="text:CreateDt">2014-12-14 20:34</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div style="text-align:center">
        
    </div>
</div>
<div class="handle">
    <div class="footer fanye" data-bind="page:currentPage"></div> 
</div>