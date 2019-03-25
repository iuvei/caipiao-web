<?php if (!defined('THINK_PATH')) exit();?><!--加上form标签只是用来复位所有内容,上传由AJAX完成-->
<style type="text/css">
    .soonselect_w {
        font: 14px Arial, Helvetica, sans-serif;
        color: #000;
        width: 86px;
    }

    div.container {
        overflow: hidden;
    }
    .table-border.table-border_w tr.w50 td{
        width: 50%;
    }
    .dev-fastchoose-type {
        position: absolute;
        left: 0;
        width: 100px;
        height: 407px;
    }
    .dev-fastchoose-type.table-border td {
        padding: 0;
        text-align:center;
        vertical-align: middle;
    }
    .dev-fastchoose-type.table-border td .item {
        margin-bottom: 25px;
    }
</style>
<div class="table-out">
    <div style="background: green">
            <!-- <iframe src="/i/eg_landscape.jpg"></iframe> -->
        </div>
    <div id="choose_left_part" style="position: absolute; top: 0; bottom: 0; left: 0; overflow: auto;width:40%;display: none;">
        <table class="tablecommon" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr class="title">
                <td>生成号码框</td>
            </tr>
            <tr class="one">
                <td>
                    <div id="content" style="height:auto;min-height:280px;overflow:hidden;">
                    </div>
                </td>
            </tr>
        </table><br />
        <table class="tablecommon" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr class="title-left">
                <td colspan="5">发送框</td>
            </tr>
            <tr class="inputW">
                <td width="30">金额</td>
                <td width="15%"><input data-bind="textinput:amount,click:getAmount,event:{keyup:disableEnterFastChoose}" id="amount" type="text" /></td>
                <td width="10"><input class="btn" type="button" value="下注" data-bind="click:submit" /></td>
                <td>
                    笔数:&nbsp;<span id="__selectnumbertotal"></span><br />
                    金额:&nbsp;<span data-bind="text:calcAmount">0</span>
                </td>
            </tr>
        </table>
    </div>

    <form action="/" method="post">
        <div style="position: absolute; top: 0; bottom: 0; left:40%; overflow: scroll;width:60%;padding-left: 100px;">
            <table class="table-border dev-fastchoose-type" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #F6D3BC; border-left: 1px solid #F6D3BC;">
                <tr class="inputW" align="center" id="select-type">
                    <td>
                        <div class="item"><input class="btn btn-bg" id="soonclass1" data-select="erziding" data-type="1" type="button" value="二字定" /></div>
                        <div class="item"><input class="btn" id="soonclass2" type="button" data-select="sanziding" data-type="2" value="三字定" /></div>
                        <div class="item"><input class="btn" id="soonclass3" type="button" data-select="siziding" data-type="3" value="四字定" /></div>
                        <div class="item"><input class="btn" id="soonclass4" type="button" data-select="erzixian" data-type="4" value="二字现" /></div>
                        <div class="item"><input class="btn" id="soonclass5" type="button" data-select="sanzixian" data-type="5" value="三字现" /></div>
                        <div class="item"><input class="btn" id="soonclass6" type="button" data-select="sizixian" data-type="6" value="四字现" /></div>
                        <div class="item"><input class="btn" id="soonclass7" type="button" data-select="siwuerding" data-type="7" value="头尾四五定" /></div>
                    </td>
                </tr>
            </table>
            <table class="tablecommon" width="100%" cellspacing="0" cellpadding="0" border="0" style="min-height: 407px;">
                <tr>
                    <td class="tablecommon_td">
                        <!--二字定 -->
                        <table class="table-border table-border_w" id="select-table" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-left: 1px solid #F6D3BC;">
                            <tr class="tr-e w50" id="s1">
                                <td align="center" colspan="2">
                                    <span class="dark-red">定位置&nbsp;</span>
                                    <span data-checked="true">
                                        <input type="checkbox" name="__dingwei" id="__dingwei_chu" data-bind="click:__showdis,checked:checkedVal" value="1" />&nbsp;除&nbsp;
                                        <input checked type="checkbox" name="__dingwei" id="__dingwei_qu" data-bind="click:__showdis,checked:checkedVal" value="2" />&nbsp;取
                                    </span>
                                </td>
                                <td colspan="2">
                                    <span class="dark-red">配数全转&nbsp;</span>
                                    <input type="checkbox" name="__peishu_chu" id="__peishu_chu" data-bind="click:__showdis,checked:checkedVal" value="3">除
                                    <input type="checkbox" name="__peishu_qu" id="__peishu_qu" data-bind="click:__showdis,checked:checkedVal" value="4">取
                                </td>
                            </tr>
                            <tr id="s2" align="center" class="inputW">
                                <td>仟</td>
                                <td>佰</td>
                                <td>拾</td>
                                <td>个</td>
                            </tr>
                            <tr id="s3" align="center" class="inputW">
                                <td><input id="__dingwei_1" type="text" /></td>
                                <td><input id="__dingwei_2" type="text" /></td>
                                <td><input id="__dingwei_3" type="text" /></td>
                                <td><input id="__dingwei_4" type="text" /></td>
                            </tr>
                            <tr id="s13" class="soon_head center" style="display:none;">
                                <td colspan="4" style="text-align:center;">
                                    <span class="dark-red">配数&nbsp;</span>
                                    <input type="checkbox" name="__peishu_chu2" id="__peishu_chu2" data-bind="click:__showdis,checked:checkedVal" value="3">除
                                    <input type="checkbox" name="__peishu_qu2" id="__peishu_qu2" checked="" data-bind="click:__showdis,checked:checkedVal" value="4">取
                                </td>
                            </tr>
                            <tr id="s12" class="center" style="display: none;">
                                <td colspan="4" style="text-align:center;">
                                    <span id="ps1"><input type="text" name="__peishu_1" id="__peishu_1" class="soonselect_w soonselect_w74" maxlength="10"></span>
                                    <span id="ps2"> 配,<input type="text" name="__peishu_2" id="__peishu_2" class="soonselect_w soonselect_w74" maxlength="10"></span>
                                    <span id="ps3" style="display:none;"> 配,<input type="text" name="__peishu_3" id="__peishu_3" class="soonselect_w soonselect_w74" maxlength="10"></span>
                                    <span id="ps4" style="display:none;"> 配,<input type="text" name="__peishu_4" id="__peishu_4" class="soonselect_w soonselect_w74" maxlength="10"></span>
                                </td>
                            </tr>
                            <tr id="s4" class="tr-e">
                                <td align="center" colspan="4">
                                    <span class="dark-red">合&#12288;分&nbsp;</span>
                                    <span data-checked="true">
                                        <input type="checkbox" name="__hefen" id="__hefen_chu" />&nbsp;除&nbsp;
                                        <input name="__hefen" type="checkbox" id="__hefen_qu" checked />&nbsp;取
                                    </span>
                                </td>
                            </tr>
                            <tr id="s5" align="center" class="center">
                                <td>
                                    1.&nbsp;
                                    <input type="checkbox" id="__hefenzhide_w_11" />
                                    <span class="classID7" style="display:none;">X</span>
                                    <span class="classID7" style="display:none;">X</span>
                                    <input class="classID7" type="checkbox" id="__hefenzhide_w_21" />
                                    <input type="checkbox" id="__hefenzhide_w_31" />
                                    <input type="checkbox" id="__hefenzhide_w_41" />
                                    <div style="margin-top:3px"><input class="inputW" type="text" id="__hefenzhide_1" /></div>
                                </td>
                                <td>
                                    2.&nbsp;
                                    <input id="__hefenzhide_w_12" type="checkbox" />
                                    <span class="classID7" style="display:none;">X</span>
                                    <span class="classID7" style="display:none;">X</span>
                                    <input class="classID7" id="__hefenzhide_w_22" type="checkbox" />
                                    <input id="__hefenzhide_w_32" type="checkbox" />
                                    <input id="__hefenzhide_w_42" type="checkbox" />
                                    <div style="margin-top:3px"><input id="__hefenzhide_2" class="inputW" type="text" /></div>
                                </td>
                                <td>
                                    3.&nbsp;
                                    <input id="__hefenzhide_w_13" type="checkbox" />
                                    <span class="classID7" style="display:none;">X</span>
                                    <span class="classID7" style="display:none;">X</span>
                                    <input class="classID7" id="__hefenzhide_w_23" type="checkbox" />
                                    <input id="__hefenzhide_w_33" type="checkbox" />
                                    <input id="__hefenzhide_w_43" type="checkbox" />
                                    <div style="margin-top:3px"><input class="inputW" type="text" id="__hefenzhide_3" /></div>
                                </td>
                                <td>
                                    4.&nbsp;
                                    <input id="__hefenzhide_w_14" type="checkbox" />
                                    <input id="__hefenzhide_w_24" type="checkbox" />
                                    <input id="__hefenzhide_w_34" type="checkbox" />
                                    <input id="__hefenzhide_w_44" type="checkbox" />
                                    <div style="margin-top:3px"><input class="inputW" type="text" id="__hefenzhide_4" /></div>
                                </td>
                            </tr>
                            <tr id="s6">
                                <td colspan="2">
                                    <span class="dark-red" id="bd1">&nbsp;&nbsp;不定位合分<input type="checkbox" id="__bdwhefen_1" />两数合</span>
                                    <span class="dark-red" id="bd2" style="display:none"><input type="checkbox" id="__bdwhefen_2">三合数<br /></span>
                                    <input class="inputW" id="__bdwhefen" type="text" />
                                </td>
                                <td colspan="2">
                                    <span id="zfw1" style="display:none">
                                        <span class="dark-red">
                                            &nbsp;&nbsp;值范围
                                        </span>从<input type="text" id="__zhifanwei_start" class="inputW inputW_start" maxlength="8">值&nbsp;至&nbsp;<input type="text" class="inputW inputW_start" id="__zhifanwei_end" maxlength="8">值
                                    </span>
                                </td>
                            </tr>
                            <tr id="s7">
                                <td colspan="4">
                                    <span id="quandao">
                                        <span class="dark-red">全转</span>
                                        <input class="inputW inputW_w" id="__quandao" type="text" />
                                    </span>
                                    <span id="shangjiang">
                                        <span class="dark-red">上奖</span>
                                        <input class="inputW inputW_w" id="__shangjiang" type="text" />
                                    </span>
                                    <span id="paichu">
                                        <span class="dark-red">排除</span>
                                        <input class="inputW inputW_w" id="__paichu" type="text" />
                                    </span>
                                    <span id="ch1">
                                        <span class="dark-red">乘号位置</span>&nbsp;<input type="checkbox" id="__chenghao_1" />
                                    </span>
                                    <span id="ch2">
                                        <span class="classID7" style="display:none;">X</span>
                                        <span class="classID7" style="display:none;">X</span>
                                        <input class="classID7" type="checkbox" id="__chenghao_2" />
                                        <input type="checkbox" id="__chenghao_3" />
                                        <input type="checkbox" id="__chenghao_4" />
                                    </span>
                                    <span id="changyong" style="display:none">
                                        <input type="checkbox" id="__changyong" style="display:none">
                                    </span>
                                    <span id="psgdstr" style="display: none;">
                                        <span class="dark-red">固定位置</span>
                                        <input type="checkbox" name="__gd1" id="__gd1">
                                        <input type="checkbox" name="__gd2" id="__gd2">
                                        <input type="checkbox" name="__gd3" id="__gd3">
                                        <input type="checkbox" name="__gd4" id="__gd4">
                                    </span>
                                </td>
                            </tr>
                            <tr id="han1">
                                <td colspan="4">
                                    <span data-checked="true">
                                        <input type="checkbox" id="__chu_1" />&nbsp;除
                                        <input type="checkbox" id="__qu_1" />&nbsp;取
                                    </span>
                                    二字定<span class="dark-red">含</span>
                                    <input class="inputW" id="__han_1" type="text" />二字定<span class="dark-red">复式</span><input class="inputW" id="__fushi_1" type="text" />
                                </td>
                            </tr>
                            <tr id="han2" style="display:none">
                                <td colspan="4">
                                    <span data-checked="true">
                                        <input type="checkbox" id="__chu_2" />&nbsp;除
                                        <input type="checkbox" id="__qu_2" />&nbsp;取
                                    </span>
                                    三字定 <span class="dark-red">含</span>
                                    <input class="inputW" id="__han_2" type="text" />三字定<span class="dark-red">复式</span><input class="inputW" id="__fushi_2" type="text" />
                                </td>
                            </tr>
                            <tr id="han3" style="display:none">
                                <td colspan="4">
                                    <input type="checkbox" id="__chu_3">除
                                    <input type="checkbox" id="__qu_3">取&nbsp;四字定<span class="dark-red">含</span>&nbsp;
                                    <input type="text" class="inputW" id="__han_3" maxlength="10">&nbsp;四字定<span class="dark-red">复式</span>
                                    <input type="text" class="inputW" id="__fushi_3" maxlength="10">
                                </td>
                            </tr>
                            <tr id="han4" style="display:none">
                                <td colspan="4">
                                    <span data-checked="true">
                                        <input type="checkbox" id="__chu_4">&nbsp;除
                                        <input type="checkbox" id="__qu_4">&nbsp;取
                                    </span>
                                    二字现<span class="dark-red">含</span>
                                    <input type="text" id="__han_4" class="inputW" maxlength="1">&nbsp;二字现<span class="dark-red">复式</span>
                                    <input type="text" id="__fushi_4" class="inputW" maxlength="10">
                                </td>
                            </tr>
                            <tr id="han5" style="display: none;">
                                <td colspan="4">
                                    <span data-checked="true">
                                        <input type="checkbox" id="__chu_5">&nbsp;除
                                        <input type="checkbox" id="__qu_5">&nbsp;取
                                    </span>
                                    三字现<span class="dark-red">含</span>&nbsp;
                                    <input type="text" id="__han_5" class="inputW" maxlength="1">&nbsp;三字现<span class="dark-red">复式</span>
                                    <input type="text" id="__fushi_5" class="inputW" maxlength="10">
                                </td>
                            </tr>
                            <tr id="han6" style="display: none;">
                                <td colspan="4">
                                    <span data-checked="true">
                                        <input type="checkbox" id="__chu_6">&nbsp;除
                                        <input type="checkbox" id="__qu_6">&nbsp;取
                                    </span>
                                    四字现<span class="dark-red">含</span>&nbsp;<input type="text" id="__han_6" class="inputW" maxlength="1">&nbsp;四字现<span class="dark-red">复式</span>
                                    <input type="text" id="__fushi_6" class="inputW" maxlength="10">
                                </td>
                            </tr>
                            <tr id="han7" style="display:none;">
                                <td colspan="4">
                                    <span data-checked="true">
                                        <input type="checkbox" id="__chu_7" />&nbsp;除
                                        <input type="checkbox" id="__qu_7" />&nbsp;取
                                    </span>
                                    四五二定位<span class="dark-red">含</span>
                                    <input class="inputW" id="__han_7" type="text" />四五二定位<span class="dark-red">复式</span><input class="inputW" id="__fushi_7" type="text" />
                                </td>
                            </tr>

                            <tr id="s8">
                                <td colspan="4">
                                    <span data-checked="true" id="ss1">
                                        <input type="checkbox" id="__chu_chong_1" />&nbsp;除
                                        <input type="checkbox" id="__qu_chong_1" />&nbsp;取(<span class="dark-red">双重</span>)
                                    </span>
                                    <span data-checked="true" id="ss2" style="display: none;">
                                        <input type="checkbox" id="__chu_chong_2">除
                                        <input type="checkbox" id="__qu_chong_2">&nbsp;取<span class="dark-red">(双双重)</span>
                                    </span>
                                    <span data-checked="true" id="ss3" style="display: none;">
                                        <input type="checkbox" id="__chu_chong_3">除
                                        <input type="checkbox" id="__qu_chong_3">&nbsp;取<span class="dark-red">(三重)</span>
                                    </span>
                                    <span data-checked="true" id="ss4" style="display: none;">
                                        <input type="checkbox" id="__chu_chong_4">除
                                        <input type="checkbox" id="__qu_chong_4">取<span class="dark-red">(四重)</span>
                                    </span>
                                </td>
                            </tr>
                            <tr id="s9">
                                <td colspan="4">
                                    <span data-checked="true" id="ss5">
                                        <input type="checkbox" id="__chu_xiongdi_1" />&nbsp;除
                                        <input type="checkbox" id="__qu_xiongdi_1" />&nbsp;取(<span class="dark-red">二兄弟</span>)
                                    </span>
                                    <span data-checked="true" id="ss6" style="display:none">
                                        <input type="checkbox" id="__chu_xiongdi_2" />&nbsp;除
                                        <input type="checkbox" id="__qu_xiongdi_2" />&nbsp;取(<span class="dark-red">三兄弟</span>)
                                    </span>
                                    <span data-checked="true" id="ss7" style="display:none">
                                        <input type="checkbox" id="__chu_xiongdi_3">除
                                        <input type="checkbox" id="__qu_xiongdi_3">取(<span class="dark-red">四兄弟</span>)
                                    </span>
                                </td>
                            </tr>
                            <tr id="s10">
                                <td colspan="4">
                                    <span data-checked="true" id="ss8">
                                        <input type="checkbox" id="__chu_duishu" />&nbsp;除
                                        <input type="checkbox" id="__qu_duishu" />&nbsp;取(<span class="dark-red">对数</span>)
                                    </span>
                                    <input class="inputW" type="text" id="__duishu_1" maxlength="2" />
                                    <input class="inputW" type="text" id="__duishu_2" maxlength="2" />
                                    <input class="inputW" type="text" id="__duishu_3" maxlength="2" />
                                </td>
                            </tr>
                            <tr id="s11">
                                <td colspan="4">
                                    <span id="dan1">
                                        <span id="ss9">
                                            <span data-checked="true" id="ss9">
                                                <input type="checkbox" id="__dan_chu" />&nbsp;除
                                                <input type="checkbox" id="__dan_qu" />&nbsp;取(<span class="dark-red">单</span>)
                                            </span>
                                        </span>

                                        <span id="dsd1">&#12288;<input type="checkbox" id="__dan_1" /></span>
                                        <span id="dsd2"><input type="checkbox" id="__dan_2" /></span>
                                        <span id="dsd3"><input type="checkbox" id="__dan_3" /></span>
                                        <span id="dsd4"><input type="checkbox" id="__dan_4" />&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;</span>
                                    </span>
                                    <span id="shuang1">
                                        <span data-checked="true" id="ss10">
                                            <input type="checkbox" id="__shuang_chu" />&nbsp;除
                                            <input type="checkbox" id="__shuang_qu" />&nbsp;取(<span class="dark-red">双</span>)
                                        </span>
                                        <span id="dss1">&#12288;<input type="checkbox" id="__shuang_1" /></span>
                                        <span id="dss2"><input type="checkbox" id="__shuang_2" /></span>
                                        <span id="dss3"><input type="checkbox" id="__shuang_3" /></span>
                                        <span id="dss4"><input type="checkbox" id="__shuang_4" /></span>
                                    </span>
                                </td>
                            </tr>
                        </table>
                        <!-- 按钮 -->
                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td align="center" colspan="4">
                                    <input class="btn" type="button" value="生成" data-bind="click:render" />
                                    <input class="btn" type="reset" value="复位" id="reset" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>

    </form>
</div>