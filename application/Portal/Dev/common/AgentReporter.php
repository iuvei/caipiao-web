<?php
/**
 * 代理行为上报
 */

Class AgentReporter {

    /**
     * 上报一次
     */
    public static function report($agent_id, $page_name) {
        $time = mt(6);
        Devdb::query("UPDATE jz_agent SET report_page_name='{$page_name}', report_time='{$time}' WHERE id='{$agent_id}'");
    }

    /**
     * 获取新事件
     * @param  int $ago_seconds 指定秒数前
     */
    public static function getNewEventList($ago_seconds = 3) {
        $ago_time = mt(6) - (int)$ago_seconds;
        return Devdb::selectAll("SELECT id, user_login, nickname, report_page_name, report_time FROM jz_agent WHERE report_time>='{$ago_time}'");
    }

    /**
     * 获取代理标签
     */
    public static function getAgentTagByAgid($agent_key, $current_agent) {
        if (empty($agent_key)) {
            return '';
        }
        if (is_numeric($agent_key) && (int)$agent_key == $agent_key) {
            $cond = "a.id='{$agent_key}'";
        } else {
            $cond = "a.user_login='{$agent_key}'";
        }
        if ($agent_key != $current_agent['id'] && $agent_key != $current_agent['user_login']) {
            $sql = "SELECT a.user_login, al.title AS agent_title FROM jz_agent a LEFT JOIN jz_agent_level al ON a.AgentLevel=al.level WHERE {$cond}";
            header('X-DEBUG-REPORT-USER-TAG: ' . $sql);
            $row = Devdb::row($sql);
            return ' - ' . $row['user_login'] . '(' . $row['agent_title'] . ')';
        }
        return '';
    }

    /**
     * 获取用户标签
     */
    public static function getUserTagByAgid($user_key) {
        if (empty($user_key)) {
            return '';
        }
        return ' - ' . $user_key . '(会员)';
    }

    /**
     * 获取页码标签
     */
    public static function getPageTag($page) {
        if (empty($page)) {
            return '';
        }
        return ' - 第' . $page . '页';
    }

    /**
     * 获取期数标签
     */
    public static function getPeriodsTag($periods) {
        if (empty($periods)) {
            return '';
        }
        return ' - ' . $periods . '期';
    }
}