<?php if (!defined('THINK_PATH')) exit();?>
<div id="append_parent"></div>
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
                <select data-bind="value:categoryGradeAgent" id="agentGrade">
                    <option value="0">公司</option>
                    <option value="1">代理</option>
                    <option value="2">会员</option>
                </select>
                状态:
                <select data-bind="value:Status">
                <option value="-1">全部</option>
                <option value="0">启用</option>
                <option value="1">锁住</option>
                <option value="2">禁用</option>
                </select>

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
                                        可用额度：<label id="DefaultCredit"></label>  &nbsp;&nbsp;&nbsp;&nbsp;
                                        
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <table width="100%" id="AgentTable" border="0" cellpadding="0" cellspacing="0" class="tableborder" style="table-layout: fixed;">
                    <form method="post" name="datamembers" action="index(1).html"></form>

                    <tbody>
                        <tr align="center" class="header">

                            <td width="30">序号</td>
                            <td width="8%">所属上级</td>
                            <td width="10%">账　　号</td>
                            <td width="8%">直属会员</td>
                            <td width="8%">昵　　称</td>
                            <td width="19%" id="TDRatio">拦货占成上限(%)</td>
                            <td width="8%">信用额度</td>
                            <td width="8%">状态</td>
                            <td width="8%">IP</td>
                            <td width="*">操作</td>
                        </tr>
                    <tbody data-bind="foreach:list">
                        <tr class="hov">
                            <td data-bind="text:$index() + 1"></td>
                            <td class="altbg1">
                             <label data-bind="text:ParentName"></label>
                            </td>
                            <td class="altbg1">
                               
                                <!--ko if:DownlineCount-0<=0&&IsEndLevel==false-->
                                <label data-bind="text:LoginName+'('+LevelName+')'">0</label>
                                <!--/ko-->
                                <!--ko if:DownlineCount-0>0||IsEndLevel==true-->
                                <a href="#" id="HrefLginName" data-bind="click:$parent.SubordinateList"><label style="cursor:pointer;color:blue;" data-bind="text:LoginName+'('+LevelName+')'"></label></a>
                                <!--/ko-->
                                
                                 <label id="MemberLoginName" data-bind="text:LoginName"></label>
                                <label id="labMember" style="color:blue;"> (会员)</label>
                            </td>
                            <td class="altbg1">
                                <!--ko if:MemCount-0<=0-->
                                <label>0</label>
                                <!--/ko-->
                                <!--ko if:MemCount-0>0-->
                                <a href="#" data-bind="click:$parent.GetAgentMemCount"><label style="cursor:pointer;color:blue;" data-bind="text:MemCount"></label></a>
                                <!--/ko-->
                            </td>
                            <td data-bind="text:NickName"></td>
                            <td id="AgnRatio">
                                
                                <label data-bind="text:ParentLevelName+'(占)'+ParentRatio+'/'" /><label data-bind="text:BaseRatio-0" />
                                <label data-bind="text:LevelName+'(占)'+AgentRatio+'/'" /><label data-bind="text:BaseRatio-0" />

                            </td>
                            <td data-bind="text:DefaultCredit-0"></td>
                            <td class="altbg1">
                                <label id="CompanyStatus" data-bind="text:CompanyStatus==1?'启用':CompanyStatus==2?'锁住':CompanyStatus==3?'禁用':'删除'"></label>
                                <label id="MemberStatus" data-bind="text:MemberStatus==1?'启用':MemberStatus==2?'锁住':MemberStatus==3?'禁用':'删除'"></label>
                            </td>
                            <td data-bind="text:LastLoginIP"></td>
                            <td id="AgentHandle">
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.AddSubordinate,visible:!IsEndLevel">新增代理</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.AddAgentDirectMember">新增会员</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.edit">编辑</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.changepwdSubordinate">修改密码</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.SttingsQuota">设置限额</a>
                                
                                <a href="#" style="cursor: pointer; color: blue;" data-bind="click:$parent.gotoMonthReport">月报表</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.gotoLog">日志</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.LimitStoreLog">拦货金额日志</a>
                            </td>
                            <td id="MemberHandle">
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.MemberEdit">编辑</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.MemberChangepwdSubordinate">修改密码</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.MemberSttingsQuota">设置限额</a>
                                <a href="#" style="cursor: pointer; color: #FF6600;" data-bind="click:$parent.MemberDelete">删除</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                

    </tbody>
</table>
<br>

<center><input class="button" type="submit" value="返 回" data-bind="click:back,visible:isBack"></center>

<div style="display:none" id="COMPANY-CHANGEPWD-Subordinate">
    <form>
        <div class="form-group" style="margin-bottom:5px;">
            <label>&nbsp;&nbsp;&nbsp;&nbsp;新密码：</label>
            <input type="password" class="form-control" style="width:155px;" name="pwd" placeholder="8-15位字母和数字"> <span style="color:red">(8-15位字符和数字)</span>
        </div>
        <div style="height:30px;"></div>
        <div class="form-group">
            <label>重复密码：</label>
            <input type="password" class="form-control" style="width:155px;" name="repwd" placeholder="8-15位字母和数字"> <span style="color:red">(8-15位字符和数字)</span>
        </div>
    </form>
</div>