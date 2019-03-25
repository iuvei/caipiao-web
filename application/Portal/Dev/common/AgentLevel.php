<?php
/**
 * 代理级别
 */

Class AgentLevel {

    /**
     * 获取等级map
     */
    public static function getMap($level = 0) {
        static $map;
        if (empty($map)) {
            $all = Devdb::selectAll("SELECT level, title FROM jz_agent_level WHERE 1 ORDER BY level ASC");
            foreach ($all as $row) {
                $map[$row['level']] = $row['title'];
            }
        }
        return !empty($level) ? $map[$level] : $map;
    }
}