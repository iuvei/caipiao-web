<?php if (!defined('THINK_PATH')) exit();?><!-- 减去请求 -->
<style type="text/css">
    .kuaixuan.container{
        margin-left:0
    }
    div.container {
        overflow: hidden;
    }

    .number {
        font: 28px Arial, Helvetica, sans-serif;
        color: #000;
        font-weight: bold;
        width: 80px;
        line-height:34px;
    }

    .number_w {
        color: #000;
        font: 14px Arial, Helvetica, sans-serif;
        padding: 0px 2px;
        margin: 0px;
        /*for Mozilla*/
        height: 42px !important;
        line-height: 20px !important;
        /*for IE7*/
        > height: 42px !important;
        > line-height: 20px !important;
        > padding: 0px !important;
        /*for IE*/
        height: 41px;
        line-height: 19px;
    }

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
    }

    .search input {
        width: 50px;
        vertical-align: middle;
        text-align: left;
    }

    .search select {
        /*height:20px;*/
        border: 1px solid #006699;
        color: #006699;
    }

    .search td {
        text-align: left;
    }

    .footer {
        width: 100%;
        text-align: center;
    }

    .bet td {
        background: #FFFFC4;
        border: 1px solid #F6D3BC;
        border-left: none;
        border-top: none;
        text-align: center;
        color: red;
    }

    .yellowIsHotNum td {
        background-color: yellow;
        border: 1px solid #F6D3BC;
        border-left: none;
        border-top: none;
        text-align: center;
        line-height: 30px;
        padding: 0;
    }
</style>

<div class="table-out">
    <div style="margin-left: 5px;">

        <div class="no-print con-out" style="width: 60%">

            <!--ko if:periodsStatus()-->
            <table class="tablecommon table-border" width="98%" cellspacing="0" cellpadding="0" border="0">
                <tr class="title">
                    <td colspan="7">下注框<input type="hidden" value="2017/12/01 01:23:20" id="ServerDateTM" /></td>
                </tr>
                <tr class="tr-e">
                    <td>彩种</td>
                    <td>注单编号</td>
                    <td>号码</td>
                    <td>赔率</td>
                    <td>金额</td>
                    <td>状态</td>
                    <td>
                        <label data-bind="visible:IsSingleBack">全选&nbsp;<input type="checkbox" data-bind="checked:checkeAll" /></label>
                        <input type="button" data-bind="click:BackYards" value="退码" />
                    </td>
                </tr>
                <tbody data-bind="foreach:list">
                    <tr data-bind="css:(BetStatus-0)==1?'hover3':(IsHotNum)?'yellowIsHotNum':'hover'">
                        <td data-bind="text:Odds==='--'?'--':'圣地彩'"></td>
                        
                        <td data-bind="text:PeriodsNumber==='--'?'--':(''+PeriodsNumber+BetInfoID)"></td>
                        <td>
                            <label data-bind="text:BetNumber,css:BetStatus-0!==1?'hover4':'hover'" style="font-weight: bold;" />&nbsp;
                            <label data-bind="visible:$parent.BetTypeShow(BetTypeID)" style="color: red; font-weight: bold;">现</label>
                        </td>
                        <td data-bind="text:Odds==='--'?Odds:Odds-0" style="font-weight: bold;"></td>
                        <td data-bind="text:BetAmount==='--'?BetAmount:BetAmount-0" style="color: red; font-weight: bold;"></td>
                        <td data-bind="text:$parent.BetStatusType(BetStatus)"></td>
                        <td width="90">
                            <!--ko if:typeof $data.checked ==='undefined'-->
                            --
                            <!--/ko-->
                            <!--ko if:!!$data.checked-->
                            <input type="checkbox" data-bind="checked:checked" />
                            <!--/ko-->
                        </td>
                    </tr>
                </tbody>

            </table><br />
            <table class="tablecommon table-bd" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr class="title-left" data-bind="click:changed">
                    <td colspan="7">
                        <label><input type="checkbox" id="QZCheckbox" data-bind="checked: quanZhuang, enable: currentType()< 2" />全转</label>&#12288;&#12288;
                        <label><input data-bind="checked:currentType, value:1" type="radio" name="FourType" id="FourDisplayCheckbox" />四字现</label>&nbsp;
                        <label><input data-bind="checked:currentType, value:2" type="radio" name="FourType" id="XXXCheckbox" />XXX囗囗(4，5位)</label>&nbsp;
                        <label><input data-bind="checked:currentType, value:3" type="radio" name="FourType" id="OXXXOCheckbox" />囗XXX囗(1，5位)</label>&nbsp;
                        <label><input data-bind="checked:currentType, value:0" type="radio" name="FourType" id="NoneCheckbox" />无</label>
                        <!-- <label><input data-bind="checked:currentType, value:-1" type="radio" name="FourType" id="oneFixCheckbox" />一定</label> -->
                    </td>
                </tr>
                <tr>
                    <td width="45" class="number_web" style="font: 20px Arial, Helvetica, sans-serif;">号码</td>
                    <td width="100"><input type="text" id="NumberFastBeat" class="number" data-bind="textinput:number,event:{keyup:disableEnter,blur:getIsEnter}, attr:{maxlength:5}" style="width:100px" maxlength="4"></td>
                    <td width="15" class="number_web" style="font: 20px Arial, Helvetica, sans-serif;"><strong data-bind="if:sizixian()||sanzixian()||erzixian()" id="IsShowFastBeat" style="color:red;font-size:18px;">现&#12288;</strong></td>
                    <td width="45" class="number_web" style="font: 20px Arial, Helvetica, sans-serif;">金额</td>
                    <td width="90"><input type="text" id="SumFastBeat" class="number" data-bind="textInput:amount,click:getAmount,event:{keyup:disableEnterAmount}" maxlength="8"></td>
                    <td width="90">
                        <input type="button" value="确认下注" id="confirm" data-bind="click:ConfirmTheBet" class="button">
                    </td>
                    <td width="*" style="font-size:16px;font-weight: bold;">
                        <div data-bind="visible:isShowOdds">
                            <b>赔率</b>:
                            <font color="#0000FF" data-bind="text:odds"></font>&nbsp;&nbsp;
                            <b>可下</b>:
                            <font color="red" data-bind="text:maxLimitItemBet"></font>
                        </div>

                    </td>
                </tr>
                

            </table>
            <!--/ko-->
            <!--ko if:!periodsStatus()-->
            <table class="tablecommon table-bd" cellspacing="0" cellpadding="0" border="0" width="99%" style="margin-left:13px;margin-top:3px;">
                <tbody>
                    <tr class="title">
                        <td>提示</td>
                    </tr>
                    <tr class="one">
                        <td>
                            <div id="content" style="font-size:36px;text-align:center;height:200px;line-height:200px;">
                                当前没有开盘
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--/ko-->
        </div>
        <!-- <div class="rightside2"></div> -->
        <!-- <div class="rightside">
            <table class="tablecommon table-border no-print" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr class="title">
                    <td>开奖号码</td>
                </tr>
                <tr>
                    <td style="padding:0;">
                        <div class="overFlow" style="padding-top:0;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="*width:95%;">
                                <tr class="tr-e">
                                    <td width="30%">期号</td>
                                    <td width="40%">号码</td>
                                </tr>

                                <tbody data-bind="foreach:TopEightList">
                                    <tr class="txtCen"> 
                                        <td data-bind="text:c_t"></td>
                                        <td>
                                            <h2 style='color: red'data-bind="text:c_r"></h2>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>

            </table>

            <br />


            <table class="tablecommon table-border print" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr class="title">
                    <td colspan="2">
                        目前压停号码
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <select style="padding-left:0px;" id="periodsnumber" data-bind="options:periodslist,optionsText:'PeriodsNumber',optionsValue:'PeriodsNumber',value:PeriodsNumber"></select>
                    </td>
                </tr>
                <tr>
                    <td style="padding:0;">
                        <div class="overFlow" id="stopnumber" style="padding-top:0;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="*width:95%;">
                                <tr class="tr-e">
                                    <td width="30%">号码</td>
                                    <td width="40%">金额</td>
                                    <td width="30%" class="no-print"><label>全选&nbsp;<input type="checkbox" id="allchecked" data-bind="checked:CkeckinputValue" /></label></td>
                                </tr>
                                <tbody data-bind="foreach:stopnumberList">
                                    <tr class="txtCen">
                                        <td>
                                            <label data-bind="text:BetNumber" />&nbsp;
                                            <label data-bind="text:BetTypeID-0>=14&&BetTypeID-0<=16?'现':''" style="color: red; font-weight: bold"></label>
                                        </td>
                                        <td data-bind="text:BetAmount"></td>
                                        <td align="center" class="no-print"><input data-bind="checked:checkedstop" type="checkbox" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="b-font">
                        笔数：<span data-bind="text:CountStopNumber">0</span>&#12288;&#12288;&#12288;&#12288;
                        总金额：<span data-bind="text:CountStopMoney">0</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">&#12288;</td>
                </tr>
            </table>
            <div style="height:0;width:100%;overflow:hidden;display:none" title="打印押停号码">
                <table class="tablecommon table-border" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr class="title">
                        <td colspan="2">目前压停号码</td>
                    </tr>
                    <tr class="tr-e">
                        <td width="50%">号码</td>
                        <td width="50%">金额</td>
                    </tr>
                    <tbody data-bind="foreach:stopnumberList">
                        <tr>
                            <td>
                                <label data-bind="text:BetNumber" />&nbsp;
                                <label data-bind="text:BetTypeID-0>=14?'现':''" style="color: red; font-weight: bold"></label>
                            </td>
                            <td data-bind="text:BetAmount"></td>
                        </tr>
                    </tbody>
                    <tr>
                        <td class="b-font" colspan="2">
                            笔数：<span data-bind="text:CountStopNumber">0</span>
                            总金额：<span data-bind="text:CountStopMoney">0</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">&#12288;</td>
                    </tr>
                </table>

            </div>
            <br />
            <table width="100%" cellspacing="0" cellpadding="0" border="0" class="no-print">
                <tr>
                    <td align="center"><button data-bind="click:Print" type="button">打印</button>&#12288;<button type="button" data-bind="click:deleteStopNumber">删除</button></td>
                </tr>
            </table><br />
            
        </div> -->
    </div>
</div>