<?php if (!defined('THINK_PATH')) exit();?>
<div class="table-out">
    <table class="tablecommon" cellpadding="0" width="100%" cellspacing="0" border="0">
        <tr class="title-left">
            <td class="model top-form">
                <input type="button" class="change-btn" id="transform" data-temp="1" name="" data-bind="click:change" value="模式 2" />&#12288;类别&#12288;
                <a href="#" class="red" data-bind="click:ChangeItem.bind($data,2)">口口XX</a>&#12288;
                <a href="#" data-bind="click:ChangeItem.bind($data,3)">口X口X</a>&#12288;
                <a href="#" data-bind="click:ChangeItem.bind($data,4)">口XX口</a>&#12288;
                <a href="#" data-bind="click:ChangeItem.bind($data,5)">X口X口</a>&#12288;
                <a href="#" data-bind="click:ChangeItem.bind($data,6)">X口口X</a>&#12288;
                <a href="#" data-bind="click:ChangeItem.bind($data,7)">XX口口</a> &#12288;
                <a href="#" data-bind="click:ChangeItem.bind($data,17)">XXX口口(4，5位)</a> &#12288;
                <a href="#" data-bind="click:ChangeItem.bind($data,18)">口XXX口(1，5位)</a> &#12288;
                <span>笔数：</span><span data-bind="text:Count() ">0</span>
                <span>总金额：</span><span data-bind="text:AllMoney()">0</span>
            </td>
        </tr>
        <tr>
            <td data-bind="template:modelTpl"></td>
        </tr>
    </table>
</div>