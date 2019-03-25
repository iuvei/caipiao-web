<?php
/**
 * 报表计算器
 */

Class ReportCalculator {
    static $agent_map = [];
    static $user_map = [];

    public static function generateFsxxForBet($bet, $amount = 0) {
        $calculate_data = self::calculateReportBaseData($bet, $amount);
        // deb($calculate_data);
        extract($calculate_data);
        // 结果
        $final = [];
        $agent_path_list = get_array_unique_id_list(explode('-', $bet['agentpath']));
        if (isset($agent_path_list[4])) {
            $final[$agent_path_list[4]] = $代理赚水金额;
        }
        if (isset($agent_path_list[3])) {
            $final[$agent_path_list[3]] = $总代赚水金额;
        }
        if (isset($agent_path_list[2])) {
            $final[$agent_path_list[2]] = $股东赚水金额;
        }
        // deb($final);
        return enjson($final);
    }

    public static function generateLhxxForBet($bet, $amount = 0, $is_win = false, $odds = 0) {
        $agent_path_list = get_array_unique_id_list(explode('-', $bet['agentpath']));
        $calculate_data = self::calculateReportBaseData($bet, $amount, $is_win, $odds);
        // deb($calculate_data);
        extract($calculate_data);
        $final = [
            $agent_path_list[4] => ['money' => $代理占成金额, 'win' => $代理占成盈亏金额],
            $agent_path_list[3] => ['money' => $总代占成金额, 'win' => $总代占成盈亏金额],
            $agent_path_list[2] => ['money' => $股东占成金额, 'win' => $股东占成盈亏金额],
            $agent_path_list[1] => ['money' => $总监占成金额, 'win' => $总监占成盈亏金额],
            $agent_path_list[0] => ['money' => $公司占成金额, 'win' => $公司占成盈亏金额],
        ];
        foreach ($final as $key => $value) {
            if ($key == '') {
                unset($final[$key]);
            }
        }
        // deb($final);
        return enjson($final);
    }

    public static function getAgentRealCommisionRate($agent, $user, $bet) {
        // 没数据返回0
        if (empty($agent) || empty($user)) {
            return 0;
        }
        $commission_data = self::getRealCommisionData($agent, $user, $bet);
        $commission = $commission_data['sjCommission'];
        // if ($commission < 0) {
        //     Logger::write('ReportCalculator2', 'INVALID', enjson([$agent['id'], $user['id'], $bet['id'], $commission]));
        // }
        $final = fix_decimal((float)$commission, 4);
        return $final;
    }

    /**
     * 获取拦货上限，和占成有关
     */
    public static function getAgentRealCommisionMax($agent, $user, $bet) {
        // 没数据返回0
        if (empty($agent) || empty($user)) {
            return 0;
        }
        $play_type_id = self::getBetPlayedTypeId($agent, $user, $bet);
        $commission_data = dejson($agent['commission'])[$play_type_id];
        $limit = $commission_data['MaxLimitStore'];
        $final = fix_decimal($limit, 4);
        return $final;
    }

    /**
     * 获取真实commision配置
     */
    private static function getRealCommisionData($agent, $user, $bet) {
        $play_type_id = self::getBetPlayedTypeId($agent, $user, $bet);
        // 计算
        $agent_path_list = get_array_unique_id_list(explode('-', $user['agentpath']));
        if (end($agent_path_list) == $agent['id']) {
            // 如果是最细的一级管理
            $commission_data = dejson($user['commission'])[$play_type_id];
        } else {
            $child_id = 0;
            foreach ($agent_path_list as $index => $agent_id) {
                if ($agent_id == $agent['id']) {
                    $child_id = $agent_path_list[$index + 1];
                    break;
                }
            }
            $agent_child = self::getAgent($child_id);
            // deb($agent_child);
            $commission_data = dejson($agent_child['commission'])[$play_type_id];
        }
        // deb($commission_data);
        return $commission_data;
    }

    /**
     * 获取玩法map
     */
    public static function getPlayCommisionMap($bet_type_id = 0) {
        static $map;
        if (empty($map)) {
            $all = Devdb::selectAll("SELECT betTypeId, Commission FROM jz_played WHERE 1");
            foreach ($all as $row) {
                $map[$row['betTypeId']] = $row['Commission'];
            }
        }
        return $bet_type_id > 0 ? $map[$bet_type_id] : $map;
    }


    private static function getBetPlayedTypeId($agent, $user, $bet) {
        static $map_play_type = array();
        if (empty($map_play_type)) {
            $list = M('played')->field('id, bettypeid')->select();
            foreach ($list as $key => $one) {
                $map_play_type[$one['id']] = $one['bettypeid'];
            }
        }
        $commission = 0;
        if ($bet['playedid'] == 0) {
            $bet['playedid'] = (int)Devdb::val("SELECT playedId FROM jz_userbet{$user['id']} WHERE BetInfoID='{$bet['betinfoid']}'");
        }
        $play_type_id = $map_play_type[$bet['playedid']];
        return $play_type_id;
    }

    public static function getAgentRealOccupyRate($agent, $user) {
        if (empty($agent) || empty($user)) {
            return 0;
        }
        $agent_path_list = get_array_unique_id_list(explode('-', $user['agentpath']));
        // deb($agent_path_list);
        if (end($agent_path_list) == $agent['id']) {
            // 如果是最细的一级管理
            $ratio = $user['ratio'];
        } else {
            $child_id = 0;
            foreach ($agent_path_list as $index => $agent_id) {
                if ($agent_id == $agent['id']) {
                    $child_id = $agent_path_list[$index + 1];
                    break;
                }
            }
            $agent_child = self::getAgent($child_id);
            // deb($agent_child);
            $ratio = $agent_child['pratio'];
        }
        $final = fix_decimal($ratio / 100);
        $final = min($final, 1);
        return $final;
    }

    /**
     * 从缓存中取agent，没有就查数据库
     */
    private static function getAgent($agent_id) {
        if (!isset(self::$agent_map[$agent_id])) {
            self::$agent_map[$agent_id] = M('agent')->find($agent_id);
        }
        return self::$agent_map[$agent_id];
    }

    /**
     * 从缓存中取user，没有就查数据库
     */
    private static function getUser($user_id) {
        if (!isset(self::$user_map[$user_id])) {
            self::$user_map[$user_id] = M('user')->find($user_id);
        }
        return self::$user_map[$user_id];
    }

    public static function calculateReportBaseData($bet, $amount = 0, $is_win = false, $odds = 0) {
        // 基础数据
        $agent_path_list = get_array_unique_id_list(explode('-', $bet['agentpath']));
        // deb($agent_path_list);
        $agent4 = self::getAgent($agent_path_list[4] ?: 0);// 代理
        $agent3 = self::getAgent($agent_path_list[3] ?: 0);// 总代
        $agent2 = self::getAgent($agent_path_list[2] ?: 0);// 股东
        $agent1 = self::getAgent($agent_path_list[1] ?: 0);// 总监
        $agent0 = self::getAgent($agent_path_list[0] ?: 0);// 公司
        $bet_user = self::getUser($bet['uid']);

        // 占成
        $代理占成比例 = self::getAgentRealOccupyRate($agent4, $bet_user);
        $总代占成比例 = self::getAgentRealOccupyRate($agent3, $bet_user);
        $股东占成比例 = self::getAgentRealOccupyRate($agent2, $bet_user);
        $总监占成比例 = self::getAgentRealOccupyRate($agent1, $bet_user);
        $公司占成比例 = fix_decimal(1 - $代理占成比例 - $总代占成比例 - $股东占成比例 - $总监占成比例);
        // deb([$代理占成比例, $总代占成比例, $股东占成比例, $总监占成比例, $公司占成比例]);

        // 取下一个人的上级赚水
        $代理赚水比例 = self::getAgentRealCommisionRate($agent4, $bet_user, $bet);
        $总代赚水比例 = self::getAgentRealCommisionRate($agent3, $bet_user, $bet);
        $股东赚水比例 = self::getAgentRealCommisionRate($agent2, $bet_user, $bet);
        $总监赚水比例 = 0;
        $公司赚水比例 = 0;
        // deb([$代理赚水比例, $总代赚水比例, $股东赚水比例, $总监赚水比例, $公司赚水比例]);

        // 取各级别拦货上限
        $代理拦货上限 = self::getAgentRealCommisionMax($agent4, $bet_user, $bet);
        $总代拦货上限 = self::getAgentRealCommisionMax($agent3, $bet_user, $bet);
        $股东拦货上限 = self::getAgentRealCommisionMax($agent2, $bet_user, $bet);
        $总监拦货上限 = self::getAgentRealCommisionMax($agent1, $bet_user, $bet);
        $公司拦货上限 = self::getAgentRealCommisionMax($agent0, $bet_user, $bet);
        // print_r(compact('代理拦货上限', '总代拦货上限', '股东拦货上限', '总监拦货上限', '公司拦货上限'));

        $会员投注金额 = $amount ?: $bet['betamount'];
        $会员投注赔率 = $odds ?: $bet['odds'];
        $注单数量 = isset($bet['count']) ? (int)$bet['count'] : 1;


        if ($is_win === false) {
            // 输
            //代理计算
            $代理直算占成金额 = $会员投注金额 * $代理占成比例;
            $代理占成金额 = min($代理直算占成金额, $代理拦货上限 * $注单数量);
            $代理占成盈亏金额 = $代理占成金额;
            $代理赚水金额 = ($会员投注金额 - $代理占成金额) * $代理赚水比例;
            $代理总盈亏金额 = $代理占成盈亏金额 + $代理赚水金额;

            //总代理计算
            $总代直算占成金额 = $会员投注金额 * $总代占成比例;
            $总代占成金额 = min($总代直算占成金额, $总代拦货上限 * $注单数量);
            $总代占成盈亏金额 = $总代占成金额 - ($总代占成金额 * $代理赚水比例);
            $总代赚水金额 = ($会员投注金额 - $代理占成金额 - $总代占成金额) * $总代赚水比例;
            $总代总盈亏金额 = $总代占成盈亏金额 + $总代赚水金额;

            //股东计算
            $股东直算占成金额 = $会员投注金额 * $股东占成比例;
            $股东占成金额 = min($股东直算占成金额, $股东拦货上限 * $注单数量);
            $股东占成盈亏金额 = $股东占成金额 - ($股东占成金额 * ($总代赚水比例 + $代理赚水比例));
            $股东赚水金额 = ($会员投注金额 - $代理占成金额 - $总代占成金额 - $股东占成金额) * $股东赚水比例;
            $股东总盈亏金额 = $股东占成盈亏金额 + $股东赚水金额;

            //总监计算
            $总监直算占成金额 = $会员投注金额 * $总监占成比例;
            $总监占成金额 = min($总监直算占成金额, $总监拦货上限 * $注单数量);
            $总监占成盈亏金额 = $总监占成金额 - ($总监占成金额 * ($股东赚水比例 + $总代赚水比例 + $代理赚水比例));
            $总监赚水金额 = ($会员投注金额 - $代理占成金额 - $总代占成金额 - $股东占成金额 - $总监占成金额) * $总监赚水比例;
            $总监总盈亏金额 = $总监占成盈亏金额 + $总监赚水金额;

            //公司计算
            $公司直算占成金额 = $会员投注金额 * $公司占成比例;
            $公司占成金额 = min($公司直算占成金额, $公司拦货上限 * $注单数量);
            $公司占成盈亏金额 = $公司占成金额 - ($公司占成金额 * ($总监赚水比例 + $股东赚水比例 + $总代赚水比例 + $代理赚水比例));
            $公司赚水金额 = ($会员投注金额 - $代理占成金额 - $总代占成金额 - $股东占成金额 - $总监占成金额 - $公司占成金额) * $公司赚水比例;
            $公司总盈亏金额 = $公司占成盈亏金额 + $公司赚水金额;
        } else {
            //赢
            //代理计算
            $代理占成金额 = $会员投注金额 * $代理占成比例;
            $代理占成盈亏金额 = $代理占成金额 - ($代理占成金额 * $会员投注赔率);
            $代理赚水金额 = ($会员投注金额 - $代理占成金额) * $代理赚水比例;
            $代理总盈亏金额 = $代理占成盈亏金额 + $代理赚水金额;

            //总代理计算
            $总代占成金额 = $会员投注金额 * $总代占成比例;
            $总代占成盈亏金额 = $总代占成金额-($总代占成金额 * $会员投注赔率)-($代理占成金额 * $代理赚水比例);
            $总代赚水金额 = ($会员投注金额 - $代理占成金额 - $总代占成金额) * $总代赚水比例;
            $总代总盈亏金额 = $总代占成盈亏金额 + $总代赚水金额;

            //股东计算
            $股东占成金额 = $会员投注金额 * $股东占成比例;
            $股东占成盈亏金额 = $股东占成金额 - ($股东占成金额 * $会员投注赔率)- $股东占成金额 *($总代赚水比例 + $代理赚水比例);
            $股东赚水金额 = ($会员投注金额 - $代理占成金额 - $总代占成金额 - $股东占成金额) * $股东赚水比例;
            $股东总盈亏金额 = $股东占成盈亏金额 + $股东赚水金额;

            //总监计算
            $总监占成金额 = $会员投注金额 * $总监占成比例;
            $总监占成盈亏金额 = $总监占成金额-($总监占成金额 * $会员投注赔率) -$总监占成金额 * ($股东赚水比例 + $总代赚水比例 + $代理赚水比例);
            $总监赚水金额 = ($会员投注金额 - $代理占成金额 - $总代占成金额 - $股东占成金额 - $总监占成金额) * $总监赚水比例;
            $总监总盈亏金额 = $总监占成盈亏金额 + $总监赚水金额;

            //公司计算
            $公司占成金额 = $会员投注金额 * $公司占成比例;
            $公司占成盈亏金额 = $公司占成金额 -($公司占成金额 * $会员投注赔率) - $公司占成金额 * ($总监赚水比例 + $股东赚水比例 + $总代赚水比例 + $代理赚水比例);
            $公司赚水金额 = ($会员投注金额 - $代理占成金额 - $总代占成金额 - $股东占成金额 - $总监占成金额 - $公司占成金额) * $公司赚水比例;
            $公司总盈亏金额 = $公司占成盈亏金额 + $公司赚水金额;
        }

        $final = compact(
            '代理占成比例',
            '总代占成比例',
            '股东占成比例',
            '总监占成比例',
            '公司占成比例',
            '代理拦货上限',
            '总代拦货上限',
            '股东拦货上限',
            '总监拦货上限',
            '公司拦货上限',
            '代理赚水比例',
            '总代赚水比例',
            '股东赚水比例',
            '总监赚水比例',
            '公司赚水比例',
            '会员投注金额',
            '代理占成金额',
            '代理占成盈亏金额',
            '代理赚水金额',
            '代理总盈亏金额',
            '总代占成金额',
            '总代占成盈亏金额',
            '总代赚水金额',
            '总代总盈亏金额',
            '股东占成金额',
            '股东占成盈亏金额',
            '股东赚水金额',
            '股东总盈亏金额',
            '总监占成金额',
            '总监占成盈亏金额',
            '总监赚水金额',
            '总监总盈亏金额',
            '公司占成金额',
            '公司占成盈亏金额',
            '公司赚水金额',
            '公司总盈亏金额'
        );
        $final = fix_decimal($final, 4);
        // echo 'bet_id: ' . $bet['id'] . ', agent_id: ' . $agent2['id'] . ', 股东拦货上限: ' . $股东拦货上限 . ', 注单数量: ' . $注单数量 . ', 股东直算占成金额: ' . $股东直算占成金额 . ', 股东占成金额: ' . $股东占成金额 . PHP_EOL;
        // if ($代理赚水金额 < 0 || $总代赚水金额 < 0 || $股东赚水金额 < 0) {
        //     Logger::write('ReportCalculator', 'INVALID_REPORT_DATA', enjson([$bet['id'], $bet['uid'], $final]));
        // }
        return $final;
    }


}