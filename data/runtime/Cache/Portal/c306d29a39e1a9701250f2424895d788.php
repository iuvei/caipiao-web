<?php if (!defined('THINK_PATH')) exit();?><style>
    .header .split-line {
        margin: 0 2.5px;
    }

    .header a {
        font-weight: 700;
        color: yellow;
        cursor: pointer;
    }

    .header a.all {
        color: red;
    }

    .line{
        display:inline-block;
    }
</style>
<table border="0" cellpadding="0" cellspacing="0" class="tableborder" width="100%" style="table-layout: auto;">
    <tbody>
        <tr class="header">
            <td colspan="12">
                日报表
                
            </td>
            
            
            
            
        </tr>

        <tr class="reportTop">
            <td rowspan="2" data-bind="text:nextLeveName"></td>

            

            <td colspan="3" class="reportmember">会员</td>

            <!--ko if:!isDirecet()-->
            <!--ko if:!lastAgent()-->
            <td width="20%" data-bind="text:nextLevel" colspan="2" class="reportLevel"></td>
            <!--/ko-->
            <!--/ko-->

            <td colspan="4" data-bind="text:current,css:isMember()?'reportLevel':'reportNow',attr:{colspan:isMember()?7:4}"></td>

            <!--ko if:!isMember()-->
            <td colspan="2" class="reportLevel" data-bind="text:upper"></td>
            <!--/ko-->
        </tr>
        <tr class="reportTop">
            

            <td class="reportmember">笔数</td>
            <td class="reportmember">总投</td>
            <td class="reportmember">盈亏</td>

            <!--ko if:!isDirecet()-->
            <!--ko if:!lastAgent()-->
            <td class="reportLevel">总投</td>
            <td class="reportLevel">盈亏</td>
            <!--/ko-->
            <!--/ko-->
            <!--ko if:!isMember()-->
            <td class="reportNow">占成金额</td>
            <td class="reportNow">占成盈亏</td>
            <td class="reportNow_z">赚水</td>
            <td class="reportNow_z">总盈亏</td>
            <!--/ko-->
            <td class="reportLevel" data-bind="attr:{colspan:isMember()&&5}">总投</td>
            <td class="reportLevel">盈亏</td>

        </tr>



        <!--ko foreach:list-->
        <tr class="hover">

            <td>
                <font color="#0000FF"><b data-bind="text:'['+($index()+1)+']'"></b></font>
                

                <div data-bind="if:!$parent.isLook()" class="line">
                    <p data-bind="text:LoginName==null?'直属会员':LoginName+'('+ NickName+')'"></p>
                </div>
                 
                <div data-bind="if:$parent.isLook()"  class="line">
                    <a style="cursor:pointer" data-bind="text:LoginName==null?'直属会员':LoginName+'('+ NickName+')',click:$parent.next.bind($parent)"></a>
                </div>
            </td>
            


            <td class="reportmember" data-bind="text:MemberBetCount"></td>
            <td class="reportmember" data-bind="text:Utils.rounding(MemBetAmt)"></td>
            <td class="reportmember report_1" data-bind="text:Utils.rounding(MemWL)"></td>

            <!--ko if:!$parent.isDirecet()-->
            <!--ko if:!$parent.lastAgent()-->
            <td class="reportLevel" data-bind="text:Utils.rounding(DownLineBetAmt)"></td>
            <td class="reportLevel report_1" data-bind="text:Utils.rounding(DownLineWL)"></td>
            <!--/ko-->
            <!--/ko-->
            <!--ko if:!$parent.isMember()-->
            <td class="reportNow" data-bind="text:Utils.rounding(SelfBetAmt)"></td>
            <td class="reportNow" data-bind="text:Utils.rounding(SelfWL)"></td>
            <td class="reportNow_z " data-bind="text:Utils.rounding(SelfComm)"></td>
            <td class="reportNow_z" data-bind="text:Utils.rounding(SelfWLTotal)"></td>
            <!--/ko-->
            <td class="reportLevel" data-bind="text:Utils.rounding(UperBetAmt),attr:{colspan:$parent.isMember()&&5}"></td>
            <td class="reportLevel" data-bind="text:Utils.rounding(UperWL)"></td>
        </tr>
        <!--/ko-->

        <tr class="reportFooter">

            <td><font color="#0000FF"><b>合计</b></font></td>

            

            <td data-bind="text:total.memberBetTotal"></td>
            <td data-bind="text:total.memberBetAmtTotal"></td>
            <td data-bind="text:total.memWLTotal"></td>

            <!--ko if:!isDirecet()-->
            <!--ko if:!lastAgent()-->
            <td data-bind="text:total.downLineBetTotal"></td>
            <td data-bind="text:total.downLineWLTotal"></td>
            <!--/ko-->
            <!--/ko-->
            <!--ko if:!isMember()-->
            <td data-bind="text:total.selfBetAmtTotal"></td>
            <td data-bind="text:total.selfWLTotal"></td>
            <td data-bind="text:total.makeWaterTotal"></td>
            <td data-bind="text:total.selfCommTotal"></td>
            <!--/ko-->
            <td data-bind="text:total.uperBetAmtTotal, attr:{colspan:isMember()&&5}"></td>
            <td data-bind="text:total.uperWLTotal"></td>

        </tr>

    </tbody>
</table>
<center><!--ko if:isBack --><input class="button" type="submit" value="返 回" data-bind="click:goBack"><!--/ko--></center>