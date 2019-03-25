<?php if (!defined('THINK_PATH')) exit();?><div id="append_parent"></div>
<table width="100%" border="0" cellpadding="0" cellspacing="0" class="tableborder table-list">
    <thead class="header">
        <tr>
            <td>级别查询</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                等级类别：
                <select data-bind="value:categoryGradeAgent" id="memberGrade">
                    <option value="0">公司</option>
                    <option value="1">代理</option>
                    <option value="2">会员</option>
                </select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    
                状态:
                <select data-bind="value:Status">
                    <option value="-1">全部</option>
                    <option value="0">启用</option>
                    <option value="1">锁住</option>
                    <option value="2">禁用</option>
                </select>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    
                账号：<input type="text" data-bind="textinput:loginName" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                昵称：<input type="text" data-bind="textinput:nickName" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                <input class="button" type="button" data-bind="click:SearchLevel" value="搜索级别" />
            </td>
        </tr>
    </tbody>
</table>
<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0">
    <tbody>
        <tr>
            <td>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tableborder" id="SubordinateNone">
                    <tbody>
                        <tr class="header">
                            <td>
                                <div style="float: left; margin-left: 0px; padding-top: 8px;">
                                    <a href="#">信息提示</a>
                                </div>
                                <div style="float:right; margin-right:4px; padding-bottom:9px">
                                    <img id="menuimg_tip" src="/SSCCompany/Content/Default/Images/menu_reduce.png" border="0" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td height="50">
                                <ul>
                                    <li>
                                        <label style="color:blue;" id="HandlersName" />：<label style="color:blue;" id="HandlersAccount" />&nbsp;&nbsp;&nbsp;&nbsp;
                                        可用额度：<label id="DefaultCredit"></label> ；&nbsp;&nbsp;&nbsp;&nbsp;
                                        
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tableborder" style="table-layout: fixed;">
                    <form method="post" name="datamembers" action="index(1).html"></form>

                    <tbody>
                        <tr align="center" class="header">

                            <td width="30">序号</td>
                            <td width="8%">所属上级</td>
                            <td width="10%">账　　号</td>
                            <td width="8%">昵　　称</td>                         
                            <td width="8%">信用额度</td> 
                            <td width="8%">状态</td> 
                            <td width="8%">IP</td>
                            <td width="*">操作</td>
                        </tr>
                    <tbody data-bind="foreach:list">
                        <tr align="center" class="hov">
                            <td data-bind="text:$index() + 1"></td> 
                            <td class="altbg1">
                             <!-- <label data-bind="text:ParentName+'('+ParentLevelName+')'"></label> -->
                             <label data-bind="text:ParentName"></label>
                            </td>
                            <td class="altbg1">
                                <label data-bind="text:LoginName"></label>
                                <label style="color:blue;"> (会员)</label>
                               
                            </td>
                            <td data-bind="text:NickName"></td> 
                            <td data-bind="text:DefaultCredit-0"></td> 
                            <td data-bind="text:MemberStatus==1?'启用':MemberStatus==2?'锁住':MemberStatus==3?'禁用':'删除'" class="altbg1"></td>
                            <td data-bind="text:LastLoginIP"></td>
                            <td>
                                
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.edit">编辑</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.changepwdSubordinate">修改密码</a>                               
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.SttingsQuota">设置限额</a>
                                
                                <a href="#" style="cursor: pointer; color: blue;" data-bind="click:$parent.gotoMonthReport">月报表</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.gotoLog">日志</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.login,text:sflogin==1?'强制登录':''"></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
          </tbody>
    </table>
<br>

 
<center><input class="button" type="submit" value="返 回" data-bind="click:back,visible:isBack"></center>

<div style="display:none" id="COMPANY-CHANGEPWD-Member">
    <form>
        <div class="form-group" style="margin-bottom:5px;">
            <label>&nbsp;&nbsp;&nbsp;&nbsp;新密码：</label>
            <input type="password" class="form-control" style="width:155px;" name="pwd" placeholder="由8-15位字母和数字组成"> <span style="color:red">(8-15位字符和数字)</span>
        </div>
        <div style="height:30px;"></div>
        <div class="form-group">
            <label>重复密码：</label>
            <input type="password" class="form-control" style="width:155px;" name="repwd" placeholder="由8-15位字母和数字组成"> <span style="color:red">(8-15位字符和数字)</span>
        </div>
    </form>
</div>