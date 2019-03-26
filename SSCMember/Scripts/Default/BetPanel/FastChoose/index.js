/// <reference path="../../_references.js" />
define(function (require, exports, module) {
    function $(id) {
        return document.getElementById(id);
    }

    function testClassID7(number) {
        number = '' + number;
        if (/^\dXX\d$/i.test(number) || /^XX\d\d$/i.test(number)) {
            return number.substr(0, 1) + 'X' + number.substr(1);
        }
        return '';
    }
    var
        $$ = jQuery,
        global;
    var __ss = {
        __selectnumbertotal: 0,
        __selectnumber: [],
        __fuhao: 'X',
        __classid: 1,
        __curType: '二定位',
        __setchecked: function (n) {
            return ($(n).checked ? 1 : 0);
        },
        __logString: '',
        __setselectlogs: function () {
            //暂时保留  lyj  2015/08/15
            var str = '<b style="color:red">' + __ss.__curType + '&nbsp;&nbsp;</b>',
                baseTarget = '<b style="color:red">',
                baseTarget1 = '</b>',
                value,
                temp = '',
                temp1 = '',
                element,
                textElement = $$('#s2 td'),
                wei = { 1: '千', 2: '百', 3: '十', 4: '个' },
                chong = { 1: '双重:', 2: '双双重:', 3: '三重:', 4: '四重:' },
                xiongdi = { 1: '二兄弟:', 2: '三兄弟:', 3: '四兄弟:' };
            //定位
            if ($("s3").style.display != 'none') {
                if (this.__setchecked("__dingwei_chu")) {
                    temp += baseTarget + '除,' + baseTarget1;
                }
                else if (this.__setchecked("__dingwei_qu")) {
                    temp += baseTarget + '取,' + baseTarget1;
                }
                for (var i = 1; i <= 4; i++) {
                    value = $$.trim($('__dingwei_' + i).value);
                    if (value !== '') {
                        temp += '<b>' + $$(textElement[i - 1]).text() + '</b>=' + baseTarget + value + baseTarget1 + ',';
                    }
                }
                if (temp) {
                    temp = '<b>定位置:&nbsp;&nbsp;</b>' + temp;
                }
                str += temp;
                temp = '';
            }
            //合分
            if ($("s5").style.display != 'none') {
                if (this.__setchecked("__hefen_chu")) {
                    temp += baseTarget + '除,' + baseTarget1;
                }
                else if (this.__setchecked("__hefen_qu")) {
                    temp += baseTarget + '取,' + baseTarget1;
                }
                for (var i = 1; i <= 4; i++) {
                    for (var j = 1; j <= 4; j++) {
                        if (this.__setchecked("__hefenzhide_w_" + j + i)) {
                            temp1 += wei[j]
                        }
                        if (j === 4) {
                            if (temp1) {
                                temp1 = '<b>&nbsp;&nbsp;' + i + '.' + temp1 + '&nbsp;&nbsp;</b>';
                                temp1 += '=' + baseTarget + $("__hefenzhide_" + i).value + baseTarget1
                            }
                        }
                    }
                    temp += temp1;
                    temp1 = '';
                }
                if (temp) {
                    temp = '<b>&nbsp;&nbsp;合分:&nbsp;&nbsp;</b>' + temp;
                }
                str += temp;
                temp = '';
                temp1 = '';
            }
            //不定位合分
            if ($("s6").style.display != 'none') {
                value = $("__bdwhefen").value;
                if (value) {
                    if (this.__setchecked("__bdwhefen_1")) {
                        temp += '<b>' + '两合数=' + '</b>';
                    }
                    else if (this.__setchecked("__bdwhefen_2")) {
                        temp += '<b>' + '三合数=' + '</b>';
                    }
                    temp = '<b>&nbsp;&nbsp;不定位和分:&nbsp;&nbsp;</b>' + temp + baseTarget + value + baseTarget1;
                }
                str += temp;
                temp = '';
            }
            //值范围
            if ($("zfw1").style.display != 'none' && this.__classid == 3) {
                temp += $("__zhifanwei_start").value;
                temp1 += $("__zhifanwei_end").value;
                //!temp ? (temp = temp1) : (temp1 = temp);
                if (temp || temp1) {
                    str += '<b>&nbsp;&nbsp;值范围=</b>' + baseTarget + temp + baseTarget1 + '至' + baseTarget + temp1 + baseTarget1;
                }
                temp = '';
                temp1 = '';
            }
            //全转 上奖 排除
            if (this.__classid <= 3) {
                element = $("__quandao");
                if (element.style.display != 'none') {
                    if (element.value) {
                        str += '<b>&nbsp;&nbsp;全转:&nbsp;&nbsp;</b>' + baseTarget + element.value + baseTarget1;
                    }
                };
                element = $("__shangjiang");
                if (element.style.display != 'none') {
                    if (element.value) {
                        str += '<b>&nbsp;&nbsp;上奖:&nbsp;&nbsp;</b>' + baseTarget + element.value + baseTarget1;
                    }
                };
                element = $("__paichu");
                if (element.style.display != 'none') {
                    if (element.value) {
                        str += '<b>&nbsp;&nbsp;排除:&nbsp;&nbsp;</b>' + baseTarget + element.value + baseTarget1;
                    }
                };
            }
            //乘号位置
            if (this.__classid <= 2) {
                if ($("ch1").style.display != 'none') {
                    for (var i = 1; i <= 4; i++) {
                        if (this.__setchecked("__chenghao_" + i)) {
                            temp += $$(textElement[i - 1]).text() + ',';
                        }
                    }
                }
                if (temp) {
                    temp = '<b>&nbsp;&nbsp;乘号位置:&nbsp;&nbsp;' + temp + '</b>';
                }
                str += temp;
                temp = '';
            }
            //复式
            if ($("han" + this.__classid).style.display != 'none') {
                if (this.__setchecked("__chu_" + this.__classid)) {
                    temp += baseTarget + '除' + baseTarget1 + ',';
                }
                else if (this.__setchecked("__qu_" + this.__classid)) {
                    temp += baseTarget + '取' + baseTarget1 + ',';
                }
                value = $("__han_" + this.__classid).value;
                if (value) {
                    temp += '<b>&nbsp;&nbsp;' + this.__curType + '含=</b>' + baseTarget + value + baseTarget1;
                }
                value = $("__fushi_" + this.__classid).value;
                if (value) {
                    temp += '<b>&nbsp;&nbsp;' + this.__curType + '复式=</b>' + baseTarget + value + baseTarget1;
                }
                if (temp) {
                    temp = '<b>&nbsp;&nbsp;复式:&nbsp;&nbsp;</b>' + temp;
                }
                str += temp;
                temp = '';
            }
            //重
            for (var i = 1; i <= 4; i++) {
                if ($("s8").style.display != 'none' && $("ss" + i).style.display != 'none') {
                    if (this.__setchecked("__chu_chong_" + i)) {
                        temp += baseTarget + '除' + baseTarget1;
                    }
                    else if (this.__setchecked("__qu_chong_" + i)) {
                        temp += baseTarget + '取' + baseTarget1;
                    }
                    if (temp) {
                        temp = '<b>&nbsp;&nbsp;' + chong[i] + '&nbsp;&nbsp;</b>' + temp;
                    }
                    str += temp;
                    temp = '';
                }
            }
            //兄弟
            i = 0;
            for (var j = 5; j <= 7; j++) {
                i++;
                if ($("s9").style.display != 'none' && $("ss" + j).style.display != 'none') {
                    if (this.__setchecked("__chu_xiongdi_" + i)) {
                        temp += baseTarget + '除' + baseTarget1;
                    }
                    else if (this.__setchecked("__qu_xiongdi_" + i)) {
                        temp += baseTarget + '取' + baseTarget1;
                    }
                    if (temp) {
                        temp = '<b>&nbsp;&nbsp;' + xiongdi[i] + '&nbsp;&nbsp;</b>' + temp;
                    }
                }
                str += temp;
                temp = '';
            }
            //对数
            if ($("s10").style.display != 'none') {
                if (this.__setchecked("__chu_duishu")) {
                    temp += baseTarget + '除' + baseTarget1 + ',';
                }
                else if (this.__setchecked("__qu_duishu")) {
                    temp += baseTarget + '取' + baseTarget1 + ',';
                }
                if (temp) {
                    temp = '<b>&nbsp;&nbsp;对数:&nbsp;&nbsp;</b>' + temp;
                }
                for (var i = 1; i <= 3; i++) {
                    temp += $("__duishu_" + i).value ? $("__duishu_" + i).value + ',' : '';
                }
                str += temp;
                temp = '';
            }
            //单
            if ($("dan1").style.display != 'none') {
                if (this.__setchecked("__dan_chu")) {
                    temp += baseTarget + '除' + baseTarget1 + ',';
                }
                else if (this.__setchecked("__dan_qu")) {
                    temp += baseTarget + '取' + baseTarget1 + ',';
                }
                for (var i = 1; i <= 4; i++) {
                    if (this.__classid == 4 && i <= 2) continue;
                    if (this.__classid == 5 && i <= 1) continue;
                    if (this.__setchecked("__dan_" + i)) {
                        temp += $$(textElement[i - 1]).text();
                    }
                }
                if (temp) {
                    temp = '<b>&nbsp;&nbsp;单:&nbsp;&nbsp;' + temp + '</b>';
                }
                str += temp;
                temp = '';
            }
            //双
            if ($("shuang1").style.display != 'none') {
                if (this.__setchecked("__shuang_chu")) {
                    temp += baseTarget + '除' + baseTarget1 + ',';
                }
                else if (this.__setchecked("__shuang_qu")) {
                    temp += baseTarget + '取' + baseTarget1 + ',';
                }

                for (var i = 1; i <= 4; i++) {
                    if (this.__classid == 4 && i <= 2) continue;
                    if (this.__classid == 5 && i <= 1) continue;
                    if (this.__setchecked("__shuang_" + i)) {
                        temp += $$(textElement[i - 1]).text();
                    }
                }
                if (temp) {
                    temp = '<b>&nbsp;&nbsp;双:&nbsp;&nbsp;' + temp + '</b>';
                }
                str += temp;
                temp = '';
            }
            if ($("s12").style.display != 'none') {
                if (this.__classid > 3) {
                    if (this.__setchecked("__peishu_chu2")) {
                        temp += baseTarget + '除' + baseTarget1 + ',';
                    }
                    else {
                        temp += baseTarget + '取' + baseTarget1 + ',';
                    }
                } else {
                    if (this.__setchecked("__peishu_chu")) {
                        temp += baseTarget + '除' + baseTarget1 + ',';
                    }
                    else {
                        temp += baseTarget + '取' + baseTarget1 + ',';
                    }
                }
                for (var i = 1; i <= 4; i++) {
                    temp += $("__peishu_" + i).value + ",";
                }
                if (temp) {
                    temp = '<b>&nbsp;&nbsp;配数:&nbsp;&nbsp;' + temp + '</b>';
                }
                //固定位置
                //str += this.__setchecked("__gd1") + ",";
                //str += this.__setchecked("__gd2") + ",";
                //str += this.__setchecked("__gd3") + ",";
                //str += this.__setchecked("__gd4") + ",";

            }
            str += $$.trim(temp).replace(/,*(<\/b>)$/g, '$1');
            temp = '';
            //console.log(str);
            return str;
        },
        __numberdata: [],
        __dingweizhi_data: function (num) { //选择定位。把数据归0
            var returnv = '-1';
            if ((this.__classid == 1 || this.__classid == 2 || this.__classid == 7) && this.__chenghaoarray[num] == true) {
                returnv = "0";
            } else if (this.__classid == 4 && num < 2) {
                returnv = "0";
            } else if (this.__classid == 5) {
                if (num == 0) returnv = "0";
            }
            return returnv;
        },
        __result: '',
        __dingweizhi: function () {
            var d1 = new Date();
            this.__guding_array = [];
            //if(this.__return_fushi()){//二定现复式
            ////	return this.__result;
            //}
            this.__int_dingwei_num();//初始化定位号码
            if (this.__changyong()) {//
                return this.__result;
            } else if (this.__set_peishu()) {//配数
                return this.__result;
            } else if (this.__return_quandao()) {//全倒
                return this.__result;
            }


            this.__selectnumbertotal = 0;
            var data = [], numberdata = [], val, result = '', classdingwei, numberstr, quandao, reg = "", regs = "", tmp, __result = '', allnum = 0;

            for (i = 0; i < this.__dingweiarray.length; i++) {
                if (this.__dingweiarray[i] != '') allnum++;
                val = this.__dingweiarray[i] ? this.__dingweiarray[i] : (parseInt(this.__dingweiarray[i], 10));
                data[i] = "0123456789";
                data[i] = this.__dingwei_chu || this.__henfushi_chu ? (data[i]) : (new RegExp(val).test(data[i]) ? "" + val : data[i]);
                //data[i] = this.__dingwei_chu ? (val >= 0 ? data[i].replace(val, "") : data[i]) : (new RegExp(val).test(data[i]) ? "" + val : data[i]);
                if (this.__fushi != '') {
                    //data[i]=this.__henfushi_chu ? data[i].replace(this.__fushi, "") :this.__fushi;//
                    data[i] = this.__henfushi_chu ? data[i] : this.__fushi;//
                }
                classdingwei = this.__dingweizhi_data(i);
                if (classdingwei != '-1') {

                    if (val >= 0) d = ""; else
                        data[i] = classdingwei;
                }

                data[i] = data[i].split("");

            }
            //alert(data)
            if ((this.__classid == 1 || this.__classid == 7) && allnum >= 3) return this.__result = '';
            else if (this.__classid == 2 && allnum >= 4) return this.__result = '';
            if (this.__check_er_san_all_dingwei()) {//二字和三字定位。
                return this.__result;
            }


            var r = false, a_s = 0, b_s = 0, c_s = 0, d_s = 0, int_i = 0, brbr = '', nnnn = 0;
            for (var a = a_s; a < data[0].length; a++) {
                for (var b = b_s; b < data[1].length; b++) {
                    for (var c = c_s; c < data[2].length; c++) {
                        for (var d = d_s; d < data[3].length; d++) {
                            this.__numberdata[0] = data[0][a];
                            this.__numberdata[1] = data[1][b];
                            this.__numberdata[2] = data[2][c];
                            this.__numberdata[3] = data[3][d];
                            tmp = data[0][a] + data[1][b] + data[2][c] + data[3][d];
                            if (this.__classid == 6) {//四字现
                                if (this.__numberdata[0] > this.__numberdata[1]) continue;
                                if (this.__numberdata[1] > this.__numberdata[2]) continue;
                                if (this.__numberdata[2] > this.__numberdata[3]) continue;
                            } else if (this.__classid == 5) {//三字现
                                this.__numberdata[0] = '';
                                if (this.__numberdata[1] > this.__numberdata[2]) continue;
                                if (this.__numberdata[2] > this.__numberdata[3]) continue;
                            } else if (this.__classid == 4) { //二字现
                                this.__numberdata[0] = '';
                                this.__numberdata[1] = '';
                                if (this.__numberdata[2] > this.__numberdata[3]) continue;
                            }

                            if (this.__check_sanziding() && this.__check_hefen() && this.__check_zhifanwei() && this.__check_hanfushi() && this.__check_chong()) {
                                numberstr = this.__numberdata[0] + this.__numberdata[1] + this.__numberdata[2] + this.__numberdata[3];
                                if (this.__check_dingwei_reg(numberstr) && this.__check_dan_reg(numberstr) && this.__check_xiongdi_reg(numberstr) &&
                                    this.__check_duishu_reg(numberstr) && this.__check_paichu_reg(numberstr) && this.__check__bdwhefen_reg(numberstr) && this.__check_hanfushi_reg(numberstr)) {
                                    this.__result += this.__number_html(numberstr);
                                    //brbr=(int_i==8?"<br>":"　　");
                                    //this.__result += numberstr+brbr;
                                    this.__selectnumber[this.__selectnumbertotal] = numberstr;
                                    this.__selectnumbertotal++;
                                    //int_i=int_i+1;if(int_i==8)int_i=0;
                                }
                            }
                            nnnn++;
                        }
                    }
                }
            }

            var d2 = new Date();
            //alert(d2.getTime()-d1.getTime())
            //return getdata;
            return this.__result;
        },
        __number_html: function (numberstr) {
            if (this.__classid == 7) {
                var str = testClassID7(numberstr);
                if (str) {
                    return '<li>' + str + '</li>';
                }
                return '';
            }
            else {
                return '<li>' + numberstr + '</li>';
            }
        },
        __check_quandao: function (str) { //全倒
            if (str.length < 2) {
                return new Array(str);
            } else if (str.length == 2) {
                var newArray = new Array();
                newArray[0] = str.charAt(0) + str.charAt(1);
                newArray[1] = str.charAt(1) + str.charAt(0);
                return newArray;
            } else {
                var Char = str.charAt(0);
                var str = str.slice(1);
                var arr = this.__check_quandao(str);
                var newArray = new Array();
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j <= arr[i].length; j++) {
                        var sliceStr = arr[i];
                        sliceStr = sliceStr.slice(0, j) + Char + sliceStr.slice(j);
                        newArray[i * (arr[i].length + 1) + j] = sliceStr;
                    }
                }
                return newArray;
            }
        },
        __set_unique: function (arr) {//配数全转返回号码
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        },
        __set_peishuchuarr: function () {//获取全部数组
            var pschuarr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            var pschu = []; var n = 0;
            if (this.__classid == 3 && this.__arr_guding != '') {//固定
                for (i1 = 0; i1 < 10; i1++) {
                    for (i2 = 0; i2 < 10; i2++) {
                        for (i3 = 0; i3 < 10; i3++) {
                            for (i4 = 0; i4 < 10; i4++) {
                                pschu[n] = pschuarr[i1] + "" + pschuarr[i2] + "" + pschuarr[i3] + "" + pschuarr[i4];
                                n++;
                            }
                        }
                    }
                }
            } else if (this.__classid == 1 || this.__classid == 4 || this.__classid == 7) {
                for (i1 = 0; i1 < 10; i1++) {
                    for (i2 = i1; i2 < 10; i2++) {
                        pschu[n] = pschuarr[i1] + "" + pschuarr[i2];
                        n++;
                    }
                }
            } else if (this.__classid == 2 || this.__classid == 5) {
                for (i1 = 0; i1 < 10; i1++) {
                    for (i2 = i1; i2 < 10; i2++) {
                        for (i3 = i2; i3 < 10; i3++) {
                            pschu[n] = pschuarr[i1] + "" + pschuarr[i2] + "" + pschuarr[i3];
                            n++;
                        }
                    }
                }
            } else if (this.__classid == 3 || this.__classid == 6) {
                for (i1 = 0; i1 < 10; i1++) {
                    for (i2 = i1; i2 < 10; i2++) {
                        for (i3 = i2; i3 < 10; i3++) {
                            for (i4 = i3; i4 < 10; i4++) {
                                pschu[n] = pschuarr[i1] + "" + pschuarr[i2] + "" + pschuarr[i3] + "" + pschuarr[i4];
                                n++;
                            }
                        }
                    }
                }
            }
            return pschu;
        },
        __set_trim: function (s) {//去掉空格
            s = s.replace(/\s/g, "");
            return s.replace(/(^\s*)|(\s*$)/g, "");
        },
        __set_peishu: function () {//配数全转返回号码
            this.__peishu = [];
            var psmorenarr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            if ($("__peishu_qu").checked == false && $("__peishu_chu").checked == false && $("__peishu_qu2").checked == false && $("__peishu_chu2").checked == false) { return 0; }
            this.__get_peishu_guding();
            var ps1 = $("__peishu_1").value;
            var ps2 = $("__peishu_2").value;
            var ps3 = $("__peishu_3").value;
            var ps4 = $("__peishu_4").value;
            ps1 = this.__set_trim(ps1);
            ps2 = this.__set_trim(ps2);
            ps3 = this.__set_trim(ps3);
            ps4 = this.__set_trim(ps4);

            var num = 0;
            var n_arr = ps1arr = ps2arr = ps3arr = ps4arr = [];
            if (ps1 != '') ps1arr = ps1.split("");
            if (ps2 != '') ps2arr = ps2.split("");
            if (ps3 != '') ps3arr = ps3.split("");
            if (ps4 != '') ps4arr = ps4.split("");
            var guding = [];
            if (this.__classid == 1 || this.__classid == 4 || this.__classid == 7) {
                if (ps1arr != '' && ps2arr == '') {
                    ps2arr = psmorenarr;
                } else if (ps1arr == '' && ps2arr != '') {
                    ps1arr = psmorenarr;
                }
                if (ps1arr != '' && ps2arr != '') {
                    for (i1 in ps1arr) {
                        for (i2 in ps2arr) {
                            n_arr[num] = ps1arr[i1] + "" + ps2arr[i2];
                            n_arr[num] = this.__str_sort(n_arr[num]);
                            num++;
                        }
                    }
                }
            } else if (this.__classid == 2 || this.__classid == 5) {
                if (ps1arr != '' || ps2arr != '' || ps3arr != '') {
                    ps1arr = ps1arr != '' ? ps1arr : psmorenarr;
                    ps2arr = ps2arr != '' ? ps2arr : psmorenarr;
                    ps3arr = ps3arr != '' ? ps3arr : psmorenarr;
                }
                if (ps1arr != '' && ps2arr != '' && ps3arr != '') {
                    for (i1 in ps1arr) {
                        for (i2 in ps2arr) {
                            for (i3 in ps3arr) {
                                n_arr[num] = ps1arr[i1] + "" + ps2arr[i2] + "" + ps3arr[i3];
                                n_arr[num] = this.__str_sort(n_arr[num]);
                                num++;
                            }
                        }
                    }
                }
            } else if (this.__classid == 3 || this.__classid == 6) {
                if (ps1arr != '' || ps2arr != '' || ps3arr != '' || ps4arr != '') {
                    ps1arr = ps1arr != '' ? ps1arr : psmorenarr;
                    ps2arr = ps2arr != '' ? ps2arr : psmorenarr;
                    ps3arr = ps3arr != '' ? ps3arr : psmorenarr;
                    ps4arr = ps4arr != '' ? ps4arr : psmorenarr;
                }
                if (ps1arr != '' && ps2arr != '' && ps3arr != '' && ps4arr != '') {
                    for (i1 in ps1arr) {
                        for (i2 in ps2arr) {
                            for (i3 in ps3arr) {
                                for (i4 in ps4arr) {
                                    if (this.__arr_guding != '') {
                                        n_arr[num] = [];
                                        n_arr[num][0] = $("__gd1").checked ? "x" : ps1arr[i1];
                                        n_arr[num][1] = $("__gd2").checked ? "x" : ps2arr[i2];
                                        n_arr[num][2] = $("__gd3").checked ? "x" : ps3arr[i3];
                                        n_arr[num][3] = $("__gd4").checked ? "x" : ps4arr[i4];

                                        guding = n_arr;
                                    } else {
                                        n_arr[num] = ps1arr[i1] + "" + ps2arr[i2] + "" + ps3arr[i3] + "" + ps4arr[i4];
                                        n_arr[num] = this.__str_sort(n_arr[num]);

                                    }
                                    num++;
                                }
                            }
                        }
                    }
                }

            }

            var getnumber = false;
            if (n_arr != '') {
                var set_arr = [];
                if (this.__classid == 3 && this.__arr_guding != '') {
                    guding = this.__set_unique(guding);
                    n_arr = this.__get_peishu_number(guding);
                    n_arr = this.__set_unique(n_arr);
                } else {
                    n_arr = this.__set_unique(n_arr);
                }
                if ($("__peishu_chu").checked || $("__peishu_chu2").checked) {
                    var n = 0; var stat = 0;
                    var pschu = []; pschu = this.__set_peishuchuarr();
                    for (i in pschu) {
                        stat = 0;
                        for (ii in n_arr) {
                            if (n_arr[ii] == pschu[i]) { stat = 1; break; }
                        }
                        if (stat == 0) {
                            set_arr[n] = pschu[i];
                            //set_arr[n]=this.__str_sort(set_arr[n]);
                            n++;
                        }
                    }
                } else {
                    set_arr = n_arr;
                }
                //set_arr = this.__set_unique(set_arr);//去掉重复
                if (this.__classid == 3 && this.__arr_guding != '') {//固定
                    this.__guding_array = set_arr;
                    getnumber = this.__return_quandao();
                } else if (this.__classid > 3 && this.__classid != 7) {
                    for (i in set_arr) {
                        numberstr = set_arr[i];
                        this.__result += this.__number_html(numberstr);
                        this.__selectnumber[this.__selectnumbertotal] = numberstr;
                        this.__selectnumbertotal++;
                    }
                    if (this.__selectnumbertotal > 0) getnumber = true;
                } else {
                    for (i in set_arr) {
                        this.__peishu = set_arr[i];
                        getnumber = this.__return_quandao();
                    }
                }
            }
            return getnumber;
        },
        __get_peishu_number: function (arr) {//固定
            var getnum = []; var gnum = 0;
            for (ii in arr) {
                var g = arr[ii][0] + arr[ii][1] + arr[ii][2] + arr[ii][3];
                var n = this.__peishu_quandao(g);
                n = this.__set_unique(n);
                var _guding = this.__arr_guding;
                for (iii in n) {
                    var num = n[iii];
                    numarr = num.split("");
                    var str = []; var getstr = '';
                    stat = 1;

                    for (j in _guding) {
                        if (_guding[j] != '' && numarr[j - 1] != 'x') stat = 0;
                    }
                    if (stat == 0) continue;
                    var jj = 0;
                    var newarr = [];
                    for (j in _guding) {
                        jj = j - 1;
                        gdstr = _guding[j];
                        numarr[jj] = gdstr;
                    }
                    a = numarr[0].split("");
                    b = numarr[1].split("");
                    c = numarr[2].split("");
                    d = numarr[3].split("");
                    var jjj = 0;
                    for (i1 = 0; i1 < a.length; i1++) {
                        for (i2 = 0; i2 < b.length; i2++) {
                            for (i3 = 0; i3 < c.length; i3++) {
                                for (i4 = 0; i4 < d.length; i4++) {
                                    newarr[jjj] = a[i1] + "" + b[i2] + "" + c[i3] + "" + d[i4]; jjj++;
                                }
                            }
                        }
                    }

                    if (newarr != '') {
                        getnum = getnum.concat(newarr)
                        //getnum[gnum]=getstr;gnum++;
                    }


                }

            }
            return getnum;
        },
        __peishu_quandao: function (str) { //全倒
            if (str.length < 2) {
                return new Array(str);
            } else if (str.length == 2) {
                var newArray = new Array();
                newArray[0] = str.charAt(0) + str.charAt(1);
                newArray[1] = str.charAt(1) + str.charAt(0);
                return newArray;
            } else {
                var Char = str.charAt(0);
                var str = str.slice(1);
                var arr = this.__peishu_quandao(str);
                var newArray = new Array();
                var s = '';
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j <= arr[i].length; j++) {
                        var sliceStr = arr[i];
                        sliceStr = sliceStr.slice(0, j) + Char + sliceStr.slice(j);
                        newArray[i * (arr[i].length + 1) + j] = sliceStr;
                    }
                }
                return newArray;
            }
        },
        __get_peishu_guding: function () {//固定
            this.__arr_guding = [];
            if (this.__classid == 3 && ($("__peishu_qu").checked == true || $("__peishu_chu").checked == true)) {
                var dy = "0123456789";

                for (i = 1; i <= 4; i++) {
                    var n = $("__peishu_" + i).value + "";
                    n = this.__set_trim(n);
                    if ($("__gd" + i).checked) {
                        n = n != '' ? n : dy;
                        this.__arr_guding[i] = n;
                    }
                }

                //alert(this.__arr_guding)
            }
            return this.__arr_guding;
        },
        __str_sort: function (arr) {
            var get_arr = [];
            get_arr = arr.split("");
            get_arr.sort();
            arr = get_arr.join("");
            return arr;
        },
        __quandao: '',
        __shangjiang: '',
        __return_quandao: function () {//全倒认证所有条件返回号码
            var wei = 4;
            var arr = new Array(), numarr = new Array(), returnv = false;
            this.__quandao = this.__peishu != '' ? this.__peishu : $("__quandao").value;
            //this.__quandao = $("__quandao").value;
            //this.__guding_array!=''||this.__quandao!='' || (this.__shangjiang!='' && this.__dingwei_exits==false)
            //this.__quandao != '' || (this.__shangjiang != '' && this.__dingwei_exits == false)
            if (this.__guding_array != '' || this.__quandao != '' || (this.__shangjiang != '' && this.__dingwei_exits == false)) {
                var __qdorsj = this.__quandao != '' ? this.__quandao : this.__shangjiang;

                //this.__int_dingwei_num();//初始化定位号码

                if (this.__classid == 1 || this.__classid == 7) {
                    arr = this.__show_erzidingwei(__qdorsj);//二字定位
                } else if (this.__guding_array != '') {
                    arr = this.__guding_array;
                } else {
                    if (this.__classid == 2) {
                        //三字定
                        if (__qdorsj.length <= 2) {
                            this.__result = '';
                            return true;
                        }
                    }

                    arr = this.__check_zuhe(__qdorsj, wei);
                    if (arr == null) {
                        return true;
                        this.__result = "";
                    }
                    //if(this.__classid==3&&this.__shangjiang!=''){

                    //}else
                    if (this.__classid != 3) arr = this.__check_weizhi(arr);
                    else arr = this.__check_zuhe_remove(arr);

                    if (arr != '') arr.sort();
                    for (i = 0; i < arr.length; i++) {
                        numarr = arr[i].split("");
                        this.__numberdata[0] = numarr[0];
                        this.__numberdata[1] = numarr[1];
                        this.__numberdata[2] = numarr[2] ? numarr[2] : '';
                        this.__numberdata[3] = numarr[3] ? numarr[3] : '';
                        if (this.__check_hefen() && this.__check_zhifanwei() && this.__check_hanfushi() && this.__check_chong()) {
                            numberstr = this.__numberdata[0] + this.__numberdata[1] + this.__numberdata[2] + this.__numberdata[3];
                            if (this.__check_chenghao_reg(numberstr) && this.__check_paichu_reg(numberstr) && this.__check_dingwei_reg(numberstr)
                                && this.__check_dan_reg(numberstr) && this.__check_xiongdi_reg(numberstr) && this.__check_duishu_reg(numberstr) && this.__check__bdwhefen_reg(numberstr)) {

                                this.__result += this.__number_html(numberstr);
                                this.__selectnumber[this.__selectnumbertotal] = numberstr;
                                this.__selectnumbertotal++;
                            }
                        }
                    }
                }
                returnv = true;
            }
            return returnv;
        },
        __check_setweizhi: function (str, num, index, obj) { //填写号码，二字定和三字定全倒X号计算
            if (str.length < num) return null;
            var arr = new Array();
            if (!obj) obj = new Object();
            var ii = 0;
            for (var i = (index || 0); i < str.length + 1; i++) {
                ii = (i == 0 ? 0 : i);
                if (str.slice(i, i + 1) == this.__fuhao) continue;
                var newStr = str.slice(0, i) + this.__fuhao + str.slice(ii);

                if (num > 1) {
                    arr = arr.concat(getArray(newStr, num - 1, i + 1, obj));
                } else {
                    //var newStr1 = newStr.split("").sort().join("");
                    var newStr1 = newStr;

                    if (!eval("obj['" + newStr1 + "']")) {
                        arr[arr.length] = newStr;
                        eval("obj['" + newStr1 + "']='" + newStr1 + "';");
                    }
                }
            }
            return arr;


        },
        __check_weizhi: function (a) {//再二定位和三定位从新获得
            var num = 0, wei = 4;
            if (this.__classid == 1 || this.__classid == 7) {
                num = 2;
            } else if (this.__classid == 2) {
                num = 0;
            } else {
                arr = a;
            }
            //if(num>0){
            var arr = new Array(), arrrz = new Array(), obj = new Object(), arr_remove = new Array(), str, chenghao_reg = '';
            arr_remove = this.__check_zuhe_remove(a);

            for (j = 0; j < arr_remove.length; j++) {
                str = arr_remove[j];
                //arrrz = this.__check_setweizhi(str,num);
                arrrz = arrrz.concat(this.__check_setweizhi("" + arr_remove[j] + "", num));
                /*for(var i=0;i<arrrz.length;i++){
                 arr[arr.length] = this.__check_zuhe(arrrz[i],wei);//
                 }*/
            }
            //document.write("<hr>11"+arrrz+"<br>");
            //}
            //arr = this.__check_zuhe_remove(arrrz);
            return arrrz;
        },
        __dingwei_exits: false,
        __dingwei_reg: '',
        __dingweitotal: 0,
        __int_dingwei_num: function () {
            var num, arrnum = '', comm = '';
            this.__shangjiang = $("__shangjiang").value;

            this.__dingwei_exits = false;
            var data = '0123456789', getdata = '';
            this.__dingweitotal = 0;

            for (i = 0; i < this.__dingweiarray.length; i++) {
                if (this.__dingweiarray[i] != '') {
                    num = this.__dingweiarray[i];
                    arrnum = '', arrfuhao = '', getdata = '';
                    var comm = '', gnum = '';

                    if (num.length > 1) {
                        for (j = 0; j < num.length; j++) {
                            gnum = num.slice(j, j + 1);
                            arrnum += comm + gnum;
                            arrfuhao = '0-9';
                            comm = "|";
                        }
                        /*if(this.__dingwei_chu){
                         var comm2='',arrfuhao='';
                         getdata = getdata.split("");
                         for (h=0;h<getdata.length; h++){
                         arrfuhao+=getdata[h];
                         comm="|";
                         }
                         }*/
                    } else {
                        arrnum = num;
                        arrfuhao = '0-9';
                    }
                    this.__dingwei_reg += '[' + arrnum + ']';
                    //alert(this.__dingwei_chu+"="+this.__dingwei_reg)
                    this.__dingwei_chu_reg += '[' + arrfuhao + ']';
                    this.__dingwei_exits = true;
                    this.__dingweitotal++;
                } else {
                    //this.__dingwei_reg += '[0-9'+this.__fuhao+']';
                    //var arrnum2='',comm2='',gnum2='';

                    if (this.__shangjiang != '') {
                        data = this.__shangjiang;
                    }
                    if ((this.__classid == 1 || this.__classid == 7) && data.length == 1 || this.__classid == 2 && data.length <= 2 || this.__classid == 3 && data.length <= 3) {

                        this.__dingwei_exits = true;
                        this.__dingwei_reg += '[0-9' + this.__fuhao + ']';
                    } else {
                        this.__dingwei_reg += '[' + data + this.__fuhao + ']';
                    }
                    //this.__dingwei_reg += '['+data+this.__fuhao+']';
                    this.__dingwei_chu_reg += '[0-9' + this.__fuhao + ']';
                    //
                }
            }
            //this.__dingwei_reg = '(2X)*(3X)';

            //alert(this.__dingwei_reg)
            this.__dingwei_reg = new RegExp(this.__dingwei_reg);
            this.__dingwei_chu_reg = new RegExp(this.__dingwei_chu_reg);
        },
        __check_dingwei_reg: function (n) {
            if (this.__dingwei_exits == false || this.__classid > 3 && this.__classid != 7) return true;
            //&&this.__dingwei_chu_reg.test(n)
            /*if(n=='9393'){
                alert(this.__dingwei_reg+"="+this.__dingwei_chu_reg.test(n));
            }*/
            var nn = n;
            var shangjiangreturn = true;
            if (this.__shangjiang != '') {
                data = this.__shangjiang;
                var geshu = this.__dingweiarray_num;
                /*if(this.__dingweiarray!=''){
                    for (i=0;i<this.__dingweiarray.length; i++)
                    {
                        var number=this.__dingweiarray[i];
                        if(number!=''){
                            geshu++;
                        }
                    }
                }*/
                if (this.__classid == 1 || this.__classid == 7) { //四字定号码重复排除，在对比 2017/3/11
                    var digwei = this.__dingweiarray;
                    var dwnum = 2 - this.__dingweiarray_num;

                    var datanum = 0;
                    nvar = n.split("");
                    var zhongfu = ""; var tempStr = '';
                    var setData1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//定义号码在数组中0,1,2,3,4,5,6,7,8,9
                    var setData2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//定义号码在数组中0,1,2,3,4,5,6,7,8,9
                    for (j = 0; j < nvar.length; j++) {
                        setData1[nvar[j]]++;
                        var dw = true;
                        if (digwei[j].indexOf(nvar[j]) != -1) dw = false;
                        if (tempStr != nvar[j] && dw) {
                            zhongfu += nvar[j] + "";
                            tempStr = nvar[j];
                        } else {
                            continue;
                        }
                    }
                    data = data.split("");
                    for (j = 0; j < data.length; j++) {
                        setData2[data[j]]++;
                        if (zhongfu.indexOf(data[j]) != -1) { datanum++; }
                    }
                    var setData2true = true;//如果填写上奖有重复的话 计算
                    for (j = 0; j < setData2.length; j++) {
                        if (setData2[j] > 1 && setData1[j] < setData2[j]) setData2true = false;

                    }
                    //(data.length<=datanum||datanum==4)&&
                    if ((dwnum == datanum || data.length <= datanum) && setData2true) shangjiangreturn = true; else shangjiangreturn = false;
                } else if ((this.__classid == 1 || this.__classid == 7) && data.length == 1 || this.__classid == 2) {
                    //document.writeln(n)
                    if (data.length >= 1) {
                        var gnum2 = '', arrnum2 = '', comm2 = '', num = 0, dnum = 0;
                        var datanum = data.length;
                        if (geshu > 0 && this.__dingweiarray != '') {
                            if (this.__classid == 2 && geshu > 1) datanum = 1;
                            else if (this.__classid == 2 && datanum >= 3) datanum = 2;
                            else if (geshu > 0) datanum = data.length;
                            for (iii = 0; iii < this.__dingweiarray.length; iii++) {
                                var number = this.__dingweiarray[iii];
                                if (number != '') {
                                    valarr = number.split("");
                                    nvar = n.split("");
                                    var a_n = 0;
                                    for (a = 0; a < valarr.length; a++) {
                                        if (data.indexOf(valarr[a]) != -1) {
                                            dnum++;
                                            num++;
                                            datanum++;
                                            nvar[iii] = '|';
                                            //alert(n+'='+nvar+'='+i+'='+num+'='+datanum);
                                            //n=n.replace(""+valarr[a]+"","");
                                        }
                                    }
                                    n = nvar.join('');
                                }
                            }
                        }
                        var setnum = '';
                        var setdata = data + '';
                        for (j = 0; j < data.length; j++) {
                            gnum2 = data.slice(j, j + 1);
                            reg = "/" + gnum2 + "/g"; reg = eval(reg);
                            len1 = setdata.match(reg);
                            if (setnum == gnum2) continue;
                            var lennum = len1 != null && len1 != '' ? len1.length : 0;
                            if (lennum > 1) {
                                len2 = n.match(reg);
                                var lennum2 = len2 != null && len2 != '' ? len2.length : 0;
                                if (lennum <= lennum2) {
                                    num = num + lennum;
                                    setnum = gnum2;
                                }

                            } else if (n.indexOf(gnum2) != -1) { num++; }
                        }
                        //alert(n+'='+gnum2+'='+num+'='+datanum)
                        //if(data.length==n.split(data).length)return true;else return false;
                        if (datanum == num) shangjiangreturn = true; else shangjiangreturn = false;
                        //if(dnum>0)return shangjiangreturn;
                    }
                } else if (this.__classid == 2 && data.length >= 3 && geshu == 1) { //三字定重复排除
                    var cf = [];
                    valarr = nn.split("");
                    for (j = 0; j < valarr.length; j++) {
                        gnum2 = nn.split(valarr[j]).length - 1;
                        if (gnum2 > 1) shangjiangreturn = false;
                    }
                } else if (this.__classid == 3) { //四字定号码重复排除，在对比
                    var digwei = this.__dingweiarray;
                    var dwnum = 4 - this.__dingweiarray_num;

                    var datanum = 0;
                    nvar = n.split("");
                    var zhongfu = ""; var tempStr = '';
                    var setData1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//定义号码在数组中0,1,2,3,4,5,6,7,8,9
                    var setData2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//定义号码在数组中0,1,2,3,4,5,6,7,8,9
                    for (j = 0; j < nvar.length; j++) {
                        setData1[nvar[j]]++;
                        var dw = true;
                        if (digwei[j].indexOf(nvar[j]) != -1) dw = false;
                        if (tempStr != nvar[j] && dw) {
                            zhongfu += nvar[j] + "";
                            tempStr = nvar[j];
                        } else {
                            continue;
                        }
                    }
                    data = data.split("");
                    for (j = 0; j < data.length; j++) {
                        setData2[data[j]]++;
                        if (zhongfu.indexOf(data[j]) != -1) { datanum++; }
                    }
                    var setData2true = true;//如果填写上奖有重复的话 计算
                    for (j = 0; j < setData2.length; j++) {
                        if (setData2[j] > 1 && setData1[j] < setData2[j]) setData2true = false;

                    }
                    //(data.length<=datanum||datanum==4)&&
                    if ((dwnum == datanum || data.length <= datanum || datanum == 4) && setData2true) shangjiangreturn = true; else shangjiangreturn = false;
                }

            }

            return ((this.__dingwei_chu) ? (!this.__dingwei_reg.test(nn) && this.__dingwei_chu_reg.test(nn) && shangjiangreturn) : this.__dingwei_reg.test(nn) && shangjiangreturn);

        },
        __check_zuhe: function (str, n, num) { //组合
            if (this.__classid == 3) {
                if (str.length < n) {
                    return null;
                } else if (str.length == n) {
                    return this.__check_quandao(str);
                }
            }
            if (str.length < n) {
                //return null;
                //}else if(str.length==n){
                return this.__check_quandao(str);
            } else {
                var newArray = new Array();
                var len = str.length - 1;
                len = Math.min(typeof (num) != 'undefined' ? num : len, len);
                for (var i = len; i >= 0; i--) {
                    newArray = newArray.concat(this.__check_zuhe(str.substr(0, i) + str.substr(i + 1), n, i - 1));

                }
                return newArray;
            }
        },
        __check_zuhe_remove: function (arr) { //组合移除
            var obj = new Object();
            var newArray = new Array();
            for (var i = 0; i < arr.length; i++) {
                if (!eval("obj['" + arr[i] + "']")) {
                    eval("obj['" + arr[i] + "']='" + arr[i] + "'");
                }
            }
            for (var i in obj) {
                newArray[newArray.length] = obj[i];
            }
            return newArray;
        },
        __dingwei_chu: false,
        __dingweiarray: new Array(3),
        __int_dingwei: function () {
            this.__dingweiarray_num = 0;
            this.__dingwei_chu = (this.__classid <= 3 || this.__classid === 7 ? $("__dingwei_chu").checked : false);
            for (var i = 1; i <= 4; i++) {
                this.__dingweiarray[(i - 1)] = (this.__classid <= 3 || this.__classid === 7 ? $("__dingwei_" + i).value : '');
                if (this.__dingweiarray[(i - 1)] != '') this.__dingweiarray_num++;
            }
        },
        __chenghaoarray: [],
        __chenghao: false,
        __int_chenghao: function () {//乘号位置
            var checkeds, getche = false;
            for (var i = 0; i < 4; i++) {
                checkeds = $("__chenghao_" + (i + 1)).checked;
                if (checkeds == true) getche = true;
                this.__chenghaoarray[i] = checkeds;
            }
            this.__chenghao = false;
            if (getche == false) {
                this.__chenghao = true;
                if (this.__classid == 1) {
                    this.__chenghaoarray[2] = true;
                    this.__chenghaoarray[3] = true;
                } else if (this.__classid == 2) {
                    this.__chenghaoarray[3] = true;
                }
                //else if(this.__classid == 7){
                //    this.__chenghaoarray[0] = true;
                //    this.__chenghaoarray[1] = true;
                //}
            }
            else {
                if (this.__classid == 7)
                    this.__chenghaoarray[1] = true;
            }
        },
        __int: function () {
            this.__destruct();
            this.__int_dingwei();
            this.__int_hefen();
            this.__int_chenghao();
            this.__int_hanfushi();
            this.__int_chong();
            this.__int_paichu();
            this.__int_danshuang();
            this.__int_xiongdi();
            this.__int_duishu();
            this.__int_zhifanwei();
            this.__int_bdwhefen();
        },
        __destruct: function () {
            this.__result = '';
            this.__chenghaoarray = new Array();
            this.__dingweiarray = new Array(3);
            this.__dingwei_chu = new Array();
            this.__hefen_zhi = new Array(4);
            this.__hefen_chu = false;
            this.__hefen_value = false;
            this.__dingwei_chu = false;

            this.__selectnumbertotal = 0;
            this.__selectnumber = new Array();
            this.__han = '';
            this.__fushi = '';
            this.__henfushi_chu = '';

            this.__chu_chong = '';
            this.__qu_chong = '';
            this.__chongchecked = false;
            this.__quandao = '';
            this.__shangjiang = '';
            this.__paichu = '';
            this.__chenghao_reg = '';
            this.__paichu = '';
            this.__paichu_reg = '';
            this.__dingwei_exits = false;
            this.__dingwei_reg = ''
            this.__dingwei_chu_reg = ''
            this.__dan_chu = false;
            this.__shuang_chu = false;
            this.__dan_qu = false;
            this.__shuang_qu = false;
            this.__dan_reg = '';
            this.__dan_reg2 = '';
            this.__danshuang_reg = '';

            this.__shuang_reg = '';
            this.__shuang_reg2 = '';
            this.__dan_start = false;
            this.__shuang_start = false;
            this.__chu_duishu = false;
            this.__duishu_1 = '';
            this.__duishu_2 = '';
            this.__duishu_3 = '';
            this.__duishu_reg = '';
            this.__duishu_stat = '';
            this.__zhifanwei_start = '';
            this.__zhifanwei_end = '';
            this.__bdwhefen_1 = false;
            this.__bdwhefen_2 = false;
            this.__bdwhefen = '';
            this.__bdwhefenstat = false;


        },
        __hefen_weizhi: new Array(),
        __hefen_zhi: new Array(4),
        __hefen_chu: false,
        __hefen_value: false,
        __int_hefen: function () {
            //合分
            this.__hefen_chu = $("__hefen_chu").checked;
            var che, value;
            for (var i = 0; i < 4; i++) {
                this.__hefen_weizhi[i] = new Array();
                value = $('__hefenzhide_' + (i + 1)).value;
                if (value != '') {
                    for (var j = 0; j < 4; j++) {
                        che = $("__hefenzhide_w_" + (j + 1) + "" + (i + 1)).checked;
                        this.__hefen_weizhi[i][j] = (che ? j : '-1');
                    }
                    this.__hefen_zhi[i] = value;
                    this.__hefen_value = true;
                } else {
                    this.__hefen_zhi[i] = '';
                }

            }


        },
        __check_hefen: function () { //合分
            if (this.__hefen_value == false) return true;
            var hefenvalue, a, b, c, d, total, getcheck, returnvalue = true, t, testshow = '', statarr = [], statcount = 0;
            for (var i = 0; i < 4; i++) {
                hefenvalue = this.__hefen_zhi[i];
                if (hefenvalue != '') {
                    statcount = statcount + 1;
                    total = '';
                    t = '';
                    for (var j = 0; j < 4; j++) {
                        getcheck = this.__hefen_weizhi[i][j];
                        if (getcheck != '-1') {
                            if (!this.__hefen_chu && this.__numberdata[j] == this.__fuhao) {
                                return false; break;
                            } else {
                                total = Math.floor(total) + Math.floor(this.__numberdata[j]);
                            }
                            //}else if(this.__hefen_chu&&this.__numberdata[j]!=this.__fuhao){
                            //return false;break;
                        }
                    }
                    //document.write(this.__numberdata+"=="+total+"="+this.__numberdata[2]+"="+this.__numberdata[3]+"<br>");

                    total = total + "";
                    if (total.length > 0) {
                        t = total.substr(total.length - 1, 1);

                    }
                    var hefenarr = hefenvalue.split("");
                    if (hefenarr.length > 1) {
                        var stat = 0;
                        for (var h = 0; h < hefenarr.length; h++) {
                            if (t != '' && hefenarr[h] == t) {
                                //returnvalue = true;
                                statarr[statarr.length] = 1;
                                stat = 1;
                                break;
                            }
                        }
                        if (stat == 0) { returnvalue = false; break; }
                    } else {
                        if (t != '' && hefenvalue == t) {
                            //returnvalue = true;
                            statarr[statarr.length] = 1;
                        } else {
                            returnvalue = false; break;
                        }
                    }
                }
            }
            returnvalue = statcount > 0 && statcount == statarr.length ? true : false;
            //if(returnvalue==false)return returnvalue;
            if (this.__hefen_chu) {
                if (returnvalue)
                    returnvalue = false;
                else returnvalue = true;

            }
            return returnvalue;
        },
        __bdwhefen_1: false,
        __bdwhefen_2: false,
        __bdwhefen: '',
        __bdwhefenstat: false,
        __int_bdwhefen: function () {
            this.__bdwhefen_1 = $("__bdwhefen_1").checked;
            this.__bdwhefen_2 = $("__bdwhefen_2").checked;
            this.__bdwhefen = $("__bdwhefen").value;
            if (this.__bdwhefen_1 || this.__bdwhefen_2) this.__bdwhefenstat = true;
        },
        __check__bdwhefen_reg: function (n) {
            if (this.__bdwhefenstat == false || this.__bdwhefen == '') return true;
            var returnv = false;
            var arr = n.split("");

            var all, a, b, c, t = '', tongji = 0;
            var stat = this.__bdwhefen_1 ? 1 : 2;
            var hefenv = this.__bdwhefen == '' ? 0 : this.__bdwhefen;
            if (hefenv != '') var hefenvarr = hefenv.split("");
            if (stat == 1) {

                for (var i = 0; i < arr.length; i++) {
                    for (var j = (i + 1); j < arr.length; j++) {
                        a = arr[i];
                        b = arr[j];
                        all = Math.floor(a) + Math.floor(b);
                        all = all + "";
                        t = '';
                        if (all.length > 0) {
                            t = all.substr(all.length - 1, 1);
                        }
                        for (var h = 0; h < hefenvarr.length; h++) {
                            if (t != '' && t == hefenvarr[h]) {
                                returnv = true;
                                tongji++;
                                break;
                            }
                        }
                        if (tongji > 0) break;
                    }
                    if (tongji > 0) break;
                }
            } else {
                for (var i = 0; i < arr.length; i++) {
                    var num = (i == 1 ? 1 : 2);
                    var c = (i == 1 ? 1 : 0);

                    for (var j = (i + num); j < arr.length; j++) {
                        a = arr[(i - c)];
                        b = arr[(i + 1)];
                        c = arr[(j + c)];
                        all = Math.floor(a) + Math.floor(b) + Math.floor(c);
                        all = all + "";
                        t = '';
                        if (all.length > 0) {
                            t = all.substr(all.length - 1, 1);
                        }
                        for (var h = 0; h < hefenvarr.length; h++) {
                            if (t != '' && t == hefenvarr[h]) {
                                returnv = true;
                                tongji++;
                                break;
                            }
                        }
                        c = 0;
                        if (tongji > 0) break;
                    }
                    if (tongji > 0) break;
                }
            }
            return returnv;
        },
        __check_er_san_all_dingwei: function () {
            //独立的二字和三字定位，千百十个位没有填写或填写的时候使用
            if ((this.__classid != 1 && this.__classid != 2 && this.__classid != 7) || !this.__chenghao || this.__fushi != '') return false;
            if (this.__shangjiang != '') {
                if ((this.__classid == 1 || this.__classid == 7) && this.__dingweitotal >= 2) {
                    this.__result = '';
                    return true;
                }
                if (this.__classid == 2 && this.__dingweitotal >= 3) {
                    this.__result = '';
                    return true;
                }
            }

            var data = [];
            for (i = 0; i < this.__dingweiarray.length; i++) {
                val = this.__dingweiarray[i] ? this.__dingweiarray[i] : (parseInt(this.__dingweiarray[i], 10));
                data[i] = "0123456789";
                //data[i] = this.__dingwei_chu && val ? "" + val : (new RegExp(val).test(data[i]) ? "" + val : data[i]);
                if (this.__dingweiarray[i]) {
                    valarr = val.split("");
                    getvalarr = valarr.sort();
                    val = getvalarr.join('');
                }
                data[i] = this.__dingwei_chu ? (data[i]) : (new RegExp(val).test(data[i]) ? "" + val : data[i]);
                data[i] = data[i].split("");
            }

            var a_s = 0, b_s = 0, c_s = 0, d_s = 0, start = 0, n, m;
            var save = [], flag = [0, 0, 0, 0], count = 0, nMax = 0, isMove = false;
            space = false;
            nMax = (this.__classid == 1 || this.__classid == 7) ? 2 : 1;

            for (n = flag.length - 1; n >= 0; n--) {
                if (data[n].length == 10 && count < nMax) {
                    flag[n]++;
                    count++;
                } else {
                    flag[n] = data[n].length == 10 ? 0 : -1;
                }
            }

            for (var i = 0; i <= 5; i++) {
                for (n = flag.length - 1; n >= 0; n--) {
                    if (flag[n] == 1) {
                        save[n] = data[n];
                        data[n] = ["" + this.__fuhao + ""];
                    }
                }
                var nnnn = 0;
                for (var a = a_s; a < data[0].length; a++) {
                    for (var b = b_s; b < data[1].length; b++) {
                        for (var c = c_s; c < data[2].length; c++) {
                            for (var d = d_s; d < data[3].length; d++) {

                                this.__numberdata[0] = data[0][a];
                                this.__numberdata[1] = data[1][b];
                                this.__numberdata[2] = data[2][c];
                                this.__numberdata[3] = data[3][d];
                                if (this.__check_hefen() && this.__check_zhifanwei() && this.__check_hanfushi() && this.__check_chong()) {
                                    numberstr = this.__numberdata[0] + this.__numberdata[1] + this.__numberdata[2] + this.__numberdata[3];
                                    if (this.__check_dingwei_reg(numberstr) && this.__check_dan_reg(numberstr) && this.__check_xiongdi_reg(numberstr) &&
                                        this.__check_duishu_reg(numberstr) && this.__check_paichu_reg(numberstr) && this.__check__bdwhefen_reg(numberstr)
                                        && this.__check_hanfushi_reg(numberstr)) {
                                        this.__result += this.__number_html(numberstr);
                                        ;
                                        this.__selectnumber[this.__selectnumbertotal] = numberstr;
                                        this.__selectnumbertotal++;
                                    }
                                }
                                nnnn++;
                            }
                        }
                    }
                }
                for (var n = flag.length - 1; n >= 0; n--) {
                    if (flag[n] == 1) {
                        data[n] = save[n];
                    }
                }
                isMove = false;
                count = 0;
                for (n = flag.length - 1; n > 0; n--) {
                    if (flag[n] == 1) {
                        count++;
                        for (m = n - 1; m >= 0; m--) {
                            if (flag[m] == 0) {
                                flag[n] = 0;
                                flag[m] = 1;
                                isMove = true;
                                if (count == nMax) {
                                    count = 0;
                                    for (k = 0; k <= m; k++) {
                                        if (flag[k] == 1) count++;
                                    }
                                    for (m = flag.length - 1; m > n; m--) {
                                        if (data[m].length == 10 && count < nMax) {
                                            flag[m] = 1;
                                            count++;
                                        } else {
                                            flag[m] = data[m].length == 10 ? 0 : -1;
                                        }
                                    }
                                }
                                break;
                            } else if (flag[m] == 1) {
                                break;
                            }
                        }
                    }
                    if (isMove) {
                        break;
                    }
                }
                if (!isMove) {
                    break;
                }

            }
            return true;
        },
        __check_sanzidingss: 0,
        __check_sanziding: function () {

            //二字定和三字定位三字现和二字现

            if (this.__classid != 1 && this.__classid != 2 && this.__classid != 7) return true;
            var returnvalue = false, j = 0, a, b, c, d, numberstr = '', start = false;
            if (this.__classid == 1 || this.__classid == 2 || this.__classid == 7) {
                a = this.__numberdata[0];
                b = this.__numberdata[1];
                c = this.__numberdata[2];
                d = this.__numberdata[3];
                if (this.__chenghao) {

                    num = this.__classid == 1 || this.__classid == 7 ? 5 : 3;
                    for (i = 0; i <= num; i++) {
                        if (this.__classid == 1 || this.__classid == 7) {
                            if (i == 0) {
                                this.__numberdata[0] = a;
                                this.__numberdata[1] = b;
                                this.__numberdata[2] = this.__fuhao;
                                this.__numberdata[3] = this.__fuhao;
                            } else if (i == 1) {
                                this.__numberdata[0] = a;
                                this.__numberdata[1] = this.__fuhao;
                                this.__numberdata[2] = b;
                                this.__numberdata[3] = this.__fuhao;
                            } else if (i == 2) {
                                this.__numberdata[0] = a;
                                this.__numberdata[1] = this.__fuhao;
                                this.__numberdata[2] = this.__fuhao;
                                this.__numberdata[3] = b;
                            } else if (i == 3) {
                                this.__numberdata[0] = this.__fuhao;
                                this.__numberdata[1] = a;
                                this.__numberdata[2] = b;
                                this.__numberdata[3] = this.__fuhao;
                            } else if (i == 4) {
                                this.__numberdata[0] = this.__fuhao;
                                this.__numberdata[1] = a;
                                this.__numberdata[2] = this.__fuhao;
                                this.__numberdata[3] = b;
                            } else if (i == 5) {
                                this.__numberdata[0] = this.__fuhao;
                                this.__numberdata[1] = this.__fuhao;
                                this.__numberdata[2] = a;
                                this.__numberdata[3] = b;
                            }
                        } else {
                            if (i == 0) {
                                this.__numberdata[0] = a;
                                this.__numberdata[1] = b;
                                this.__numberdata[2] = c;
                                this.__numberdata[3] = this.__fuhao;
                            } else if (i == 1) {
                                this.__numberdata[0] = a;
                                this.__numberdata[1] = b;
                                this.__numberdata[2] = this.__fuhao;
                                this.__numberdata[3] = c;
                            } else if (i == 2) {
                                this.__numberdata[0] = a;
                                this.__numberdata[1] = this.__fuhao;
                                this.__numberdata[2] = b;
                                this.__numberdata[3] = c;
                            } else if (i == 3) {
                                this.__numberdata[0] = this.__fuhao;
                                this.__numberdata[1] = a;
                                this.__numberdata[2] = b;
                                this.__numberdata[3] = c;
                            }
                        }


                        numberstr = this.__numberdata[0] + this.__numberdata[1] + this.__numberdata[2] + this.__numberdata[3];
                        //alert(numberstr)
                        if (this.__check_hefen() && this.__check_zhifanwei() && this.__check_hanfushi() && this.__check_chong()) {
                            if (this.__check_dan_reg(numberstr) && this.__check_xiongdi_reg(numberstr)
                                && this.__check_duishu_reg(numberstr) && this.__check_dingwei_reg(numberstr)
                                && this.__check_paichu_reg(numberstr) && this.__check__bdwhefen_reg(numberstr)
                                && this.__check_hanfushi_reg(numberstr)) { //值范围和含复式和重数
                                this.__result += this.__number_html(numberstr);
                                ;
                                this.__selectnumber[this.__selectnumbertotal] = numberstr;
                                this.__selectnumbertotal++;
                            }
                        }
                    }
                    returnvalue = false;

                } else if (!this.__chenghao) {

                    for (i = 0; i < 4; i++) {
                        if (this.__chenghaoarray[i] == true) {
                            this.__numberdata[i] = this.__fuhao;
                            if ((this.__classid == 1 || this.__classid == 7) && j == 1) {
                                break;
                            } else if (this.__classid == 2) {
                                break;
                            }
                            j++;
                        }
                    }
                    returnvalue = true;
                }

            } else if (this.__classid == 4) {
                this.__numberdata[0] = "";
                this.__numberdata[1] = "";
                returnvalue = true;
            } else if (this.__classid == 5) {
                this.__numberdata[0] = "";
                returnvalue = true;
            } else {
                returnvalue = true;
            }
            return returnvalue;
        },
        __zhifanwei_start: '',
        __zhifanwei_end: '',
        __keyup_zhifanwei: function () {
            return;
            this.__zhifanwei_start = $('__zhifanwei_start').value;
            this.__zhifanwei_end = $('__zhifanwei_end').value;
            for (i = 1; i <= 4; i++) {
                $('__chu_chong_' + i).checked = false;
                $('__qu_chong_' + i).checked = false;
                this.__chongchecked = false;
            }
            if (this.__zhifanwei_start != '' || this.__zhifanwei_end != '') {
                $("s8").style.display = "none";
            } else {
                $("s8").style.display = "";
            }

        },
        __int_zhifanwei: function () {
            this.__zhifanwei_start = $('__zhifanwei_start').value;
            this.__zhifanwei_end = $('__zhifanwei_end').value;

        },
        __check_zhifanwei: function () {
            //值范围
            if (this.__zhifanwei_start == '' && this.__zhifanwei_end == '' || this.__classid != 3) return true;

            var returnvalue = false, a, b, c, d, total, htotal, s, e;
            var __zhifanwei_start = this.__zhifanwei_start;
            var __zhifanwei_end = this.__zhifanwei_end;
            if (__zhifanwei_start != '' || __zhifanwei_end != '') {
                a = this.__numberdata[0];
                b = this.__numberdata[1];
                c = this.__numberdata[2];
                d = this.__numberdata[3];
                total = (a || a == 0 ? a - 0 : 0) + (b || b == 0 ? b - 0 : 0) + (c || c == 0 ? c - 0 : 0) + (d || d == 0 ? d - 0 : 0);
                //total = ""+total;
                htotal = total;
                //htotal = total.substring(total.length-1,total.length);
                //s = total.substring(__zhifanwei_start.length-1,__zhifanwei_start.length);
                //e = total.substring(total__zhifanwei_endlength-1,__zhifanwei_end.length);
                //alert(a + "" + b+ "" + c+ "" + d +" = "+ total+" "+ htotal)
                if (__zhifanwei_start && __zhifanwei_end) {
                    if (__zhifanwei_start <= htotal && __zhifanwei_end >= htotal) returnvalue = true;
                } else if (__zhifanwei_start > 0) {
                    if (__zhifanwei_start == htotal) returnvalue = true;
                } else if (__zhifanwei_end > 0) {
                    if (__zhifanwei_end == htotal) returnvalue = true;
                }
            } else {
                returnvalue = true;
            }
            return returnvalue;

        },
        __han: '',
        __fushi: '',
        __fushistr: '',
        __henfushi_chu: '',
        __henfushi_qu: false,
        __int_hanfushi: function () {
            //含复式
            this.__han = $("__han_" + this.__classid).value;
            this.__fushi = $("__fushi_" + this.__classid).value;
            this.__henfushi_chu = $("__chu_" + this.__classid).checked;
            this.__henfushi_qu = $("__qu_" + this.__classid).checked;

            if (this.__fushi != '') {
                var comm = '', fushi = '', fushiarr = [];
                var fushiarr = this.__fushi.split("");
                for (i = 0; i < fushiarr.length; i++) {

                    if (this.__classid == 1 || this.__classid == 4 || this.__classid == 7) {
                        fushi += comm + fushiarr[i] + "" + fushiarr[i];
                    } else if (this.__classid == 2 || this.__classid == 5) {
                        fushi += comm + fushiarr[i] + "" + fushiarr[i] + "" + fushiarr[i];
                    } else if (this.__classid == 3 || this.__classid == 6) {
                        fushi += comm + fushiarr[i] + "" + fushiarr[i] + "" + fushiarr[i] + "" + fushiarr[i];
                    }
                    comm = '|';
                }
                this.__fushistr = fushi;

            }

        },
        __nnnum: 0,
        __check_hanfushi_reg: function (n) {
            if (this.__chongcheckedchu) return true;
            if (this.__fushi == '' || this.__henfushi_qu == this.__henfushi_chu) return true;//
            else if (this.__henfushi_qu == true) return true;//复数取不要进入
            var returnv = true;
            var reg = '';
            reg = new RegExp("^[" + new String(n).replace(/[\-\\\]]/g, "\\$&") + "]+$");
            var arr = [], str = '';
            str = this.__fushi + "|" + this.__fushistr;

            var arr = str.split("|");
            var ii = 0;
            for (var i = 0; i < arr.length; i++) {
                if (reg.test(arr[i])) { ii = ii + 1; }//得到相同数量
            }
            getnumbernum = ii;
            //if(ii==1){
            nn = new String(n);
            var reg = /(\d).*\1/;
            var res = [], t = [], tnum = 0;
            while (reg.test(nn)) {
                var $1 = RegExp.$1;
                t = nn.match(new RegExp($1, "g")).join("");
                //res.push(t + "---------" + t.length + "位");
                tnum++;
                nn = nn.split($1).join("");
            }
            if (t.length > 0) {
                var gettnum = t.length;
                if (tnum > 1) gettnum = gettnum + 1;
                if (gettnum >= 2) {
                    ii = ii + gettnum - 1;
                } else
                    ii = ii + gettnum;
            }
            //}

            var iival = 0;
            if (this.__classid == 1 || this.__classid == 4 || this.__classid == 7) iival = 2;
            else if (this.__classid == 2 || this.__classid == 5) iival = 3;
            else if (this.__classid == 3 || this.__classid == 6) iival = 4;

            if (this.__chongcheckedchu == false && this.__henfushi_chu == true) { //只有打钩复数除的时候
                if (getnumbernum >= iival) ii = iival;
            }
            //$("testshow").innerHTML=$("testshow").innerHTML+this.__chongcheckedchu+"="+this.__henfushi_chu+"="+n+"=<br>";
            if (ii == iival) returnv = true; else returnv = false;
            //if(n=='1313' ){alert(ii); alert("有重数\n"+ gettnum + res.join("\n"));this.__nnnum=1;}
            if (this.__han == '' && this.__henfushi_chu) {
                return !returnv;
            } else if (this.__henfushi_chu && returnv) {
                return !returnv;
            }

            return returnv;
        },
        __check_hanfushi: function () { //所有含
            if (this.__han == '') return true;
            var fushi = '', returnv = false, num = 0;
            fushi = this.__fushi;
            if (this.__han != '') {
                /*if(this.__classid==2||this.__classid==3){
                    han = this.__han.split("");
                    for(j=0;j<han.length;j++){
                        for(var i=0;i<4;i++){
                            if(this.__numberdata[i]==han[j]){num++;break;}
                        }
                    }
                    if(num==han.length)returnv = true;
                }else{
                    for(var i=0;i<4;i++){
                        if(this.__numberdata[i]==this.__han){returnv = true;break;}
                    }
                }*/
                han = this.__han.split("");
                var gnumber = '';
                for (var i = 0; i < 4; i++) {
                    gnumber = gnumber + "" + this.__numberdata[i];
                }
                for (j = 0; j < han.length; j++) {
                    if (this.__henfushi_chu) {
                        if (gnumber.indexOf(han[j]) == -1) { num++; }
                    } else {
                        if (gnumber.indexOf(han[j]) != -1) { returnv = true; break; }
                    }
                }

                if (this.__henfushi_chu && num == han.length) {
                    returnv = true;//除
                }
            } else {
                returnv = true;
            }
            return returnv;
        },
        __chu_chong: '',
        __qu_chong: '',
        __chongchecked: false,
        __int_chong: function () {//重数初始化
            this.__chongcheckedchu = false;
            for (i = 1; i <= 4; i++) {
                eval("__ss.__chu_chong_" + i + " = $('__chu_chong_" + i + "').checked;");
                eval("__ss.__qu_chong_" + i + " = $('__qu_chong_" + i + "').checked;");
                //this.__qu_chong = $("__qu_chong_"+i).checked;
                if (this.__chongchecked == false && (eval("__ss.__chu_chong_" + i + "") || eval("__ss.__qu_chong_" + i + ""))) { this.__chongchecked = true; }
                if (this.__chongcheckedchu == false && $("__chu_chong_" + i).checked) { this.__chongcheckedchu = true; }
                //alert($("__chu_chong_"+i).checked+"=="+i+"=="+this.__chongcheckedchu)
            }
            this.__chong_arr_1 = "11|22|33|44|55|66|77|88|99|00".split("|");

        },
        __check_chong: function () {

            if (this.__chongchecked == false) return true;
            var a, b, c, d, returnv_1 = false, returnv_2 = false, returnv_3 = false, returnv_4 = false;
            a = this.__numberdata[0];
            b = this.__numberdata[1];
            c = this.__numberdata[2];
            d = this.__numberdata[3];


            var n = a + "" + b + "" + c + "" + d;
            n = new String(n);
            var reg = /(\d).*\1/;
            var res = [], t = 0, gt;

            while (reg.test(n)) {
                var $1 = RegExp.$1;
                var t = n.match(new RegExp($1, "g")).join("");
                res.push(t);
                n = n.split($1).join("");
            }
            gt = t.length;
            if (__ss.__qu_chong_1) { //双重
                if (gt >= 2) returnv_1 = true;
            }
            if (__ss.__chu_chong_1) {
                if (gt >= 2) returnv_1 = true;
                returnv_1 = !returnv_1;
            }
            if (__ss.__qu_chong_2) { //双双重
                if (res.length == 2 || gt == 4) returnv_2 = true;
            }
            if (__ss.__chu_chong_2) {
                if (res.length != 2 && gt != 4) returnv_2 = true;
            }
            if (__ss.__qu_chong_3) { //三重
                if (gt >= 3) returnv_3 = true;
            }
            if (__ss.__chu_chong_3) {
                if (gt >= 3) returnv_3 = true;
                returnv_3 = !returnv_3;
            }
            if (__ss.__qu_chong_4) { //四重
                if (gt == 4) returnv_4 = true;
            }
            if (__ss.__chu_chong_4) {
                if (gt == 4) returnv_4 = true;
                returnv_4 = !returnv_4;
            }
            /*else{
             returnv_4 = true;
             }*/
            var r = false;

            if (this.__classid == 1 || this.__classid == 4 || this.__classid == 7) {
                r = returnv_1;
            } else if (this.__classid == 2 || this.__classid == 5) {
                if (__ss.__qu_chong_1 && __ss.__qu_chong_3) {
                    r = returnv_1 || returnv_3;
                } else if (__ss.__chu_chong_1 && __ss.__chu_chong_3) {

                    r = returnv_1;
                } else if (__ss.__qu_chong_1 && __ss.__chu_chong_3 || __ss.__chu_chong_1 && __ss.__qu_chong_3) {
                    r = returnv_1 && returnv_3;
                } else if (__ss.__qu_chong_1 || __ss.__chu_chong_1) {
                    r = returnv_1;
                } else if (__ss.__qu_chong_3 || __ss.__chu_chong_3) {
                    r = returnv_3;
                }
            } else if (this.__classid == 3 || this.__classid == 6) {
                if ((__ss.__qu_chong_1 && __ss.__qu_chong_2 && __ss.__qu_chong_3 && __ss.__qu_chong_4) || (__ss.__chu_chong_1 && __ss.__chu_chong_2 && __ss.__chu_chong_3 && __ss.__chu_chong_4)) {
                    r = returnv_1;
                } else if (__ss.__qu_chong_1 && __ss.__chu_chong_2 && __ss.__chu_chong_3 && __ss.__chu_chong_4 || __ss.__chu_chong_1 && __ss.__qu_chong_2 && __ss.__qu_chong_3 && __ss.__qu_chong_4) {
                    r = returnv_1 && returnv_2 && returnv_3 && returnv_4;
                } else if (__ss.__qu_chong_1 && __ss.__qu_chong_2 && __ss.__qu_chong_3) {
                    r = returnv_1 || returnv_2 || returnv_3;
                } else if (__ss.__chu_chong_1 && __ss.__chu_chong_2 && __ss.__chu_chong_3) {
                    r = returnv_1;
                } else if (__ss.__qu_chong_1 && __ss.__qu_chong_3 && __ss.__qu_chong_4) {
                    r = returnv_1;
                } else if (__ss.__qu_chong_1 && __ss.__chu_chong_2 && __ss.__chu_chong_3 || __ss.__chu_chong_1 && __ss.__qu_chong_2 && __ss.__qu_chong_3) {
                    r = returnv_1 && returnv_2 && returnv_3;
                } else if (__ss.__qu_chong_1 && __ss.__qu_chong_2 || __ss.__chu_chong_1 && __ss.__chu_chong_2) {
                    //r = returnv_1 || returnv_2;
                    r = returnv_1;
                } else if (__ss.__qu_chong_1 && __ss.__chu_chong_2 || __ss.__chu_chong_1 && __ss.__qu_chong_2) {
                    r = returnv_1 && returnv_2;
                } else if (__ss.__qu_chong_1 && __ss.__qu_chong_3) {
                    r = returnv_1;
                } else if (__ss.__chu_chong_1 && __ss.__chu_chong_3) {
                    //r = returnv_1 || returnv_3;
                    r = returnv_1 && returnv_3;
                } else if (__ss.__qu_chong_1 && __ss.__chu_chong_3 || __ss.__chu_chong_1 && __ss.__qu_chong_3) {
                    r = returnv_1 && returnv_3;
                } else if (__ss.__qu_chong_1 && __ss.__qu_chong_4 || __ss.__chu_chong_1 && __ss.__chu_chong_4) {
                    //r = returnv_1 || returnv_4;
                    r = returnv_1 && returnv_4;
                } else if (__ss.__qu_chong_1 && __ss.__chu_chong_4 || __ss.__chu_chong_1 && __ss.__qu_chong_4) {
                    r = returnv_1 && returnv_4;
                } else if (__ss.__qu_chong_2 && __ss.__qu_chong_3 || __ss.__chu_chong_2 && __ss.__chu_chong_3) {
                    r = returnv_2 && returnv_3;
                } else if (__ss.__qu_chong_2 && __ss.__chu_chong_3 || __ss.__chu_chong_2 && __ss.__qu_chong_3) {
                    r = returnv_2 && returnv_3;
                } else if (__ss.__qu_chong_2 && __ss.__qu_chong_4 || __ss.__chu_chong_2 && __ss.__chu_chong_4) {
                    r = returnv_2 && returnv_4;
                } else if (__ss.__qu_chong_2 && __ss.__chu_chong_4 || __ss.__chu_chong_2 && __ss.__qu_chong_4) {
                    r = returnv_2 && returnv_4;
                } else if (__ss.__qu_chong_3 && __ss.__qu_chong_4) {
                    r = returnv_3;
                } else if (__ss.__chu_chong_3 && __ss.__chu_chong_4) {
                    r = returnv_3 && returnv_4;
                } else if (__ss.__qu_chong_3 && __ss.__chu_chong_4 || __ss.__chu_chong_3 && __ss.__qu_chong_4) {
                    r = returnv_3 && returnv_4;
                } else if (__ss.__qu_chong_1 || __ss.__chu_chong_1) {
                    r = returnv_1;
                } else if (__ss.__qu_chong_2 || __ss.__chu_chong_2) {
                    r = returnv_2;
                } else if (__ss.__qu_chong_3 || __ss.__chu_chong_3) {
                    r = returnv_3;
                } else if (__ss.__qu_chong_4 || __ss.__chu_chong_4) {
                    r = returnv_4;
                }
            }
            return r;
            //r = returnv_1 && returnv_2 && returnv_3 && returnv_4 ;
            //return r;
        },
        __check_chenghao_reg: function (n) {//4位号码过滤二定位
            if (this.__chenghao) return true;
            if (this.__classid > 2 && this.__classid != 7) return false;
            return this.__chenghao_reg.test(n);
        },
        __int_paichu: function (n) {//排除
            var arr = [], str = "";
            this.__paichu = $("__paichu").value;
            arr = this.__paichu.split("");
            var comm = "";
            for (i = 0; i < arr.length; i++) {
                str += comm + arr[i];
                comm = "|";
            }
            this.__paichu_reg = new RegExp("(" + str + ")");
        },
        __check_paichu_reg: function (n) {//4位号码过滤排除
            if (this.__paichu == '') return true;
            return !this.__paichu_reg.test(n);
        },
        __xiongdi_stat: 0,
        __int_xiongdi: function () {//兄弟初始化
            var i_s = 1;
            for (i = 1; i <= 3; i++) {
                eval("__ss.__chu_xiongdi_" + i + " = ''");
            }
            if (this.__classid == 1 || this.__classid == 4 || this.__classid == 7) i_s = 1;
            else if (this.__classid == 2 || this.__classid == 5) i_s = 2;
            else if (this.__classid == 3 || this.__classid == 6) i_s = 3;
            this.__xiongdi_stat = false;
            for (i = 1; i <= i_s; i++) {
                eval("__ss.__chu_xiongdi_" + i + " = $('__chu_xiongdi_" + i + "').checked;");
                eval("__ss.__qu_xiongdi_" + i + " = $('__qu_xiongdi_" + i + "').checked;");
                if (eval("__ss.__chu_xiongdi_" + i + "") || eval("__ss.__qu_xiongdi_" + i + "")) {
                    this.__xiongdi_stat = true;
                }
                //this.__qu_chong = $("__qu_chong_"+i).checked;
            }
            this.__xiongdi_arr_1 = "12|23|34|45|56|67|78|89|90|01".split("|");
            this.__xiongdi_arr_2 = "123|234|345|456|567|678|789|890|901|012".split("|");
            this.__xiongdi_arr_3 = "1234|2345|3456|4567|5678|6789|7890|8901|9012|0123".split("|");

        },
        __xiongdi_reg_1: function (n) {
            var returnv = false;
            var reg = new RegExp("^[" + new String(n).replace(/[\-\\\]]/g, "\\$&") + "]+$");
            for (var i = 0; i < this.__xiongdi_arr_1.length; i++) {
                if (reg.test(this.__xiongdi_arr_1[i])) {
                    returnv = true;
                    break;
                }
            }
            return returnv;
        },
        __xiongdi_reg_2: function (n) {
            var returnv = false;
            var reg = new RegExp("^[" + new String(n).replace(/[\-\\\]]/g, "\\$&") + "]+$");
            for (var i = 0; i < this.__xiongdi_arr_2.length; i++) {
                if (reg.test(this.__xiongdi_arr_2[i])) {
                    returnv = true;
                    break;
                }
            }
            return returnv;
        },
        __xiongdi_reg_3: function (n) {
            var returnv = false;
            var reg = new RegExp("^[" + new String(n).replace(/[\-\\\]]/g, "\\$&") + "]+$");
            for (var i = 0; i < this.__xiongdi_arr_3.length; i++) {
                if (reg.test(this.__xiongdi_arr_3[i])) {
                    returnv = true;
                    break;
                }
            }
            return returnv;
        },
        __check_xiongdi_reg: function (n) {
            var returnv = false;
            if (this.__xiongdi_stat == false) return true;
            var returnv_1 = false, returnv_2 = false, returnv_3 = false;
            if (__ss.__qu_xiongdi_1) {
                returnv_1 = this.__xiongdi_reg_1(n);
            } else if (__ss.__chu_xiongdi_1) {
                returnv_1 = !this.__xiongdi_reg_1(n);
            }
            if (__ss.__qu_xiongdi_2) {
                returnv_2 = this.__xiongdi_reg_2(n);
            } else if (__ss.__chu_xiongdi_2) {
                returnv_2 = !this.__xiongdi_reg_2(n);
            }
            if (__ss.__qu_xiongdi_3) {
                returnv_3 = this.__xiongdi_reg_3(n);
            } else if (__ss.__chu_xiongdi_3) {
                returnv_3 = !this.__xiongdi_reg_3(n);
            }
            if (this.__classid == 1 || this.__classid == 4 || this.__classid == 7) {
                r = returnv_1;
            } else {
                if (__ss.__qu_xiongdi_1 && __ss.__qu_xiongdi_2 && __ss.__qu_xiongdi_3 || __ss.__chu_xiongdi_1 && __ss.__chu_xiongdi_2 && __ss.__chu_xiongdi_3) {
                    r = returnv_1;
                } else if (__ss.__qu_xiongdi_1 && __ss.__chu_xiongdi_2 && __ss.__chu_xiongdi_3 || __ss.__chu_xiongdi_1 && __ss.__qu_xiongdi_2 && __ss.__qu_xiongdi_3) {
                    r = returnv_1 && returnv_2 && returnv_3;
                } else if (__ss.__qu_xiongdi_1 && __ss.__qu_xiongdi_2) {
                    r = returnv_1;
                } else if (__ss.__chu_xiongdi_1 && __ss.__chu_xiongdi_2) {
                    r = returnv_1 && returnv_2;//edit 2010-5 returnv_1 || returnv_2
                } else if (__ss.__qu_xiongdi_1 && __ss.__chu_xiongdi_2 || __ss.__chu_xiongdi_1 && __ss.__qu_xiongdi_2) {
                    r = returnv_1 && returnv_2;
                } else if (__ss.__qu_xiongdi_1 && __ss.__qu_xiongdi_3) {
                    r = returnv_1;
                } else if (__ss.__chu_xiongdi_1 && __ss.__chu_xiongdi_3) {
                    r = returnv_1 && returnv_3;//edit 2010-5
                } else if (__ss.__qu_xiongdi_1 && __ss.__chu_xiongdi_3 || __ss.__chu_xiongdi_1 && __ss.__qu_xiongdi_3) {
                    r = returnv_1 && returnv_3;
                } else if (__ss.__qu_xiongdi_2 && __ss.__qu_xiongdi_3) {
                    r = returnv_2;
                } else if (__ss.__chu_xiongdi_2 && __ss.__chu_xiongdi_3) {

                    //r = returnv_2 || returnv_3;
                    r = returnv_2 && returnv_3;
                } else if (__ss.__qu_xiongdi_2 && __ss.__chu_xiongdi_3 || __ss.__chu_xiongdi_2 && __ss.__qu_xiongdi_3) {
                    r = returnv_2 && returnv_3;
                } else if (__ss.__qu_xiongdi_1 || __ss.__chu_xiongdi_1) {
                    r = returnv_1;
                } else if (__ss.__qu_xiongdi_2 || __ss.__chu_xiongdi_2) {
                    r = returnv_2;
                } else if (__ss.__qu_xiongdi_3 || __ss.__chu_xiongdi_3) {
                    r = returnv_3;
                }
            }
            return r;
        },
        __chu_duishu: false,
        __duishu_1: '',
        __duishu_2: '',
        __duishu_3: '',
        __duishu_reg: '',
        __duishu_stat: '',
        __int_duishu: function () {//对数
            var arr = new Array(), getval, getstr = '', comm = '', g = '', duishu = false;
            this.__chu_duishu = $("__chu_duishu").checked;
            this.__qu_duishu = $("__qu_duishu").checked;
            this.__duishu_1 = $("__duishu_1").value;
            this.__duishu_2 = $("__duishu_2").value;
            this.__duishu_3 = $("__duishu_3").value;
            arr[0] = "05";
            arr[1] = "16";
            arr[2] = "27";
            arr[3] = "38";
            arr[4] = "49";
            if (this.__duishu_1 != '' || this.__duishu_2 != '' || this.__duishu_3 != '') {
                arr = new Array();
                duishu = true;

            }
            if (this.__chu_duishu || this.__qu_duishu || duishu) this.__duishu_stat = true; else return;
            if (this.__duishu_1 != '') arr[arr.length] = this.__duishu_1;
            if (this.__duishu_2 != '') arr[arr.length] = this.__duishu_2;
            if (this.__duishu_3 != '') arr[arr.length] = this.__duishu_3;
            for (i = 0; i < arr.length; i++) {
                getval = arr[i];
                g = getval.split("");
                getstr += comm + "(" + g[0] + "[^" + g[1] + "]*" + g[1] + "|" + g[1] + "[^" + g[0] + "]*" + g[0] + ")";
                comm = '|';
            }
            this.__duishu_reg = new RegExp(getstr);
            if (this.__qu_duishu) {

            }

        },
        __check_duishu_reg: function (n) { //对数认证
            if (!this.__duishu_stat) return true;
            return (this.__chu_duishu ? !this.__duishu_reg.test(n) : this.__duishu_reg.test(n));
        },
        __dan_chu: false,
        __shuang_chu: false,
        __dan_qu: false,
        __shuang_qu: false,
        __dan_reg: '',
        __dan_reg2: '',
        __danshuang_reg: '',
        __dan_start: false,
        __shuang_start: false,
        __shuang_reg: '',
        __ds_num1: 0,
        __ds_num2: 0,
        __int_danshuang: function () {//单数和双数初始化
            var d_checkeds, s_checkeds, i_s = 0, d_s = 0, s_s = 0, all_ds = 0;
            this.__dan_chu = $('__dan_chu').checked;
            this.__shuang_chu = $('__shuang_chu').checked;
            this.__dan_qu = $('__dan_qu').checked;
            this.__shuang_qu = $('__shuang_qu').checked;
            var checkeds, getche = false;
            if (this.__classid == 4) i_s = 3; else if (this.__classid == 5) i_s = 2; else i_s = 1;

            for (var i = i_s; i <= 4; i++) {
                d_checkeds = $("__dan_" + (i)).checked;
                s_checkeds = $("__shuang_" + (i)).checked;
                if (d_checkeds == true) {
                    this.__dan_start = true;
                    this.__dan_reg += '[13579]';
                    this.__dan_reg2 += '[0-9' + this.__fuhao + ']';

                    d_s = d_s + 1;
                    this.__ds_num1 = d_s;
                } else {
                    this.__dan_reg += '[0-9' + this.__fuhao + ']';
                    this.__dan_reg2 += '[0-9' + this.__fuhao + ']';
                }
                if (s_checkeds == true) {
                    this.__shuang_start = true;
                    this.__shuang_reg += '[02468]';
                    this.__shuang_reg2 += '[0-9' + this.__fuhao + ']';
                    s_s = s_s + 1;
                    this.__ds_num2 = s_s;
                } else {
                    this.__shuang_reg += '[0-9' + this.__fuhao + ']';
                    this.__shuang_reg2 += '[0-9' + this.__fuhao + ']';
                }
                if (d_checkeds == true || s_checkeds == true) this.__danshuang_reg += '[0-9]'; else this.__danshuang_reg += '[0-9' + this.__fuhao + ']';
                if (d_checkeds && s_checkeds) all_ds = 1;
            }

            if ((this.__dan_chu && this.__shuang_chu) || (this.__dan_qu && this.__shuang_qu)) {
                if (this.__classid == 4) {
                    if (d_s != 2) this.__dan_reg = '([13579][0-9' + this.__fuhao + ']|[0-9' + this.__fuhao + '][13579])';
                    if (s_s != 2) this.__shuang_reg = '([02468][0-9' + this.__fuhao + ']|[0-9' + this.__fuhao + '][02468])';
                }
            }
            this.__dan_reg = new RegExp(this.__dan_reg, "i");
            this.__dan_reg2 = new RegExp(this.__dan_reg2, "i");
            this.__shuang_reg = new RegExp(this.__shuang_reg, "i");
            this.__shuang_reg2 = new RegExp(this.__shuang_reg2, "i");
            this.__danshuang_reg = new RegExp(this.__danshuang_reg, "i");

        },
        __check_dan_reg: function (n) {//认证单数 .认证双数
            if (!this.__dan_start && !this.__shuang_start) return true;
            var dan = true, shuang = true;
            if (this.__dan_start)
                dan = this.__dan_chu ? !this.__dan_reg.test(n) && this.__dan_reg2.test(n) : this.__dan_reg.test(n);
            if (this.__shuang_start)
                shuang = this.__shuang_chu ? !this.__shuang_reg.test(n) && this.__shuang_reg2.test(n) : this.__shuang_reg.test(n);

            if ((this.__classid == 1 || this.__classid == 2 || this.__classid == 7) && ((!this.__dan_chu && this.__shuang_chu) || (this.__dan_chu && !this.__shuang_chu))) {
                return ((dan && shuang) && this.__danshuang_reg.test(n));
            } else if ((this.__dan_chu && this.__shuang_chu)) {
                if (this.__classid == 1 || this.__classid == 2 || this.__classid == 7) {
                    if (this.__ds_num1 == 1 && this.__ds_num2 == 1 || (this.__classid == 2 && this.__ds_num1 > 0 && this.__ds_num2 > 0 && this.__ds_num1 < 3 && this.__ds_num2 < 3)) {
                        return ((dan || shuang) && this.__danshuang_reg.test(n));
                    } else {
                        return ((dan && shuang) && this.__danshuang_reg.test(n));
                    }
                } else if ((this.__classid == 3 || this.__classid == 4 || this.__classid == 5 || this.__classid == 6) && this.__ds_num1 > 1 && this.__ds_num2 > 1) {
                    return (dan && shuang);

                } else {
                    return (dan || shuang ? true : false);

                }
            } else {
                if (this.__dan_qu && this.__shuang_qu && this.__ds_num1 > 1 && this.__ds_num2 > 1) {
                    return (dan || shuang);
                } else {
                    return (dan && shuang);
                }
            }

        },
        __totals: 0,
        alltotals: 0,
        ___daochu: function (n) {
            var newn = '', getarr = [], data = [], a_s = 0, b_s = 0, arr = [];
            if (!obj) var obj = new Object();
            n = n.split("");
            n = n.sort(function (a, b) {
                return a - b;
            });
            n = n.join("");
            for (var i = 0; i < 2; i++) {
                data[i] = n;
                data[i] = data[i].split("");
            }
            for (var a = a_s; a < data[0].length; a++) {
                for (var b = b_s; b < data[1].length; b++) {
                    newn = data[0][a] + data[1][b] + "";
                    if (data[0][a] == data[1][b]) {
                        if (this.__check_shong(newn, n) == false) {
                            continue;
                        }//可以启动全部
                    }
                    if (this.__classid == 4) {
                        if (data[0][a] > data[1][b]) {
                            continue;
                        }
                    }
                    if (!eval("obj['" + newn + "']")) {
                        getarr[getarr.length] = newn;
                        eval("obj['" + newn + "']='" + newn + "';");
                    }
                }
            }
            return getarr;
        },
        __check_shong: function (newn, n) {
            if (typeof (n) == 'undefined') return;
            if (n.indexOf(newn) != -1) return true; else return false;
        },
        __get_daochu: function (n, indexs) {
            var fuhao = {
                0: { 0: 0, 1: 0, 2: 1, 3: 1 },
                1: { 0: 0, 1: 1, 2: 0, 3: 1 },
                2: { 0: 0, 1: 1, 2: 1, 3: 0 },
                3: { 0: 1, 1: 0, 2: 0, 3: 1 },
                4: { 0: 1, 1: 0, 2: 1, 3: 0 },
                5: { 0: 1, 1: 1, 2: 0, 3: 0 }
            };
            fuhao = fuhao[indexs];
            //if (this.__classid == 7) {
            //    fuhao = { 0: 1, 1: 1, 2: 0, 3: 0 };
            //}
            var newn = '', j = 0;
            for (var i in fuhao) {
                if (fuhao[i] == 1) {
                    newn += 'X';
                } else {
                    newn += n.slice(j, j + 1);
                    j++;
                }
            }
            return newn;
        },
        __getnew: [],
        __show_daochu: function (arr, num) {
            var newn = [], newn = '';

            for (var i = 0; i < arr.length; i++) {
                newn = this.__get_daochu(arr[i], num);
                numarr = newn.split("");
                this.__numberdata[0] = numarr[0];
                this.__numberdata[1] = numarr[1];
                this.__numberdata[2] = numarr[2] ? numarr[2] : '';
                this.__numberdata[3] = numarr[3] ? numarr[3] : '';
                if (this.__check_hefen() && this.__check_zhifanwei() && this.__check_hanfushi() && this.__check_chong()) {
                    numberstr = this.__numberdata[0] + this.__numberdata[1] + this.__numberdata[2] + this.__numberdata[3];
                    if (this.__check_chenghao_reg(numberstr) && this.__check_paichu_reg(numberstr) && this.__check_dingwei_reg(numberstr)
                        && this.__check_dan_reg(numberstr) && this.__check_xiongdi_reg(numberstr) && this.__check_duishu_reg(numberstr) && this.__check__bdwhefen_reg(numberstr)) {

                        this.__getnew[this.__getnew.length] = numberstr;
                    }
                }

            }
            if (num < 5) {
                num = num + 1;
                newn = newn.concat(this.__show_daochu(arr, num));

            }
            return newn;
        },
        __show_erzidingwei: function (n) {
            var getarr = [];
            this.__getnew = [];
            getarr = this.__show_daochu(this.___daochu(n), 0);
            //}
            if (this.__getnew != '') this.__getnew.sort();
            this.__getnew = this.__check_zuhe_remove(this.__getnew);
            for (var i = 0; i < this.__getnew.length; i++) {
                numberstr = this.__getnew[i];
                this.__result += this.__number_html(numberstr);
                ;
                this.__selectnumber[this.__selectnumbertotal] = numberstr;
                this.__selectnumbertotal++;
            }
            return getarr;
        },
        __get_dingweizhi: function () {
            var val = '';
            for (i = 0; i < this.__dingweiarray.length; i++) {
                if (this.__dingweiarray[i])
                    val += this.__dingweiarray[i];

            }
            valarr = val.split("");
            return valarr;
        },
        __chenghao_reg: '',
        __alert: function () {
            var num = 0;
            if (this.__classid == 1 || this.__classid == 2 || this.__classid == 7) {
                for (var i = 0; i < 4; i++) {
                    if (this.__chenghaoarray[i] == true) {
                        this.__chenghao_reg += this.__fuhao;
                        num++;
                    } else {
                        this.__chenghao_reg += '\\d';
                    }
                }
                this.__chenghao_reg = new RegExp(this.__chenghao_reg);

                if ((this.__classid == 1 || this.__classid == 7) && num > 0 && num != 2) {
                    //alert("请选中正确的乘号位置！");
                    Utils.tip("请选中正确的乘号位置！", false, true ? function () {

                    } : null);
                    return false;
                }
                else if (this.__classid == 2 && num > 0 && num != 1) {
                    //alert("请选中正确的乘号位置！");
                    Utils.tip("请选中正确的乘号位置", false, true ? function () {

                    } : null);
                    return false;
                }
            }
            return true;
        },
        __changyong: function () {
            if ($("__changyong").checked) {
                var arr = _changyongnumber.split(',');
                for (i = 0; i < arr.length; i++) {
                    numberstr = arr[i];
                    if (numberstr != '') {
                        this.__result += this.__number_html(numberstr);
                        this.__selectnumber[this.__selectnumbertotal] = numberstr;
                        this.__selectnumbertotal++;
                    }

                }
                return this.__result;
            } else return '';

        },
        __create: function () {
            /*if (this.__isempty()) {
                var d = dialog({
                    title: '操作提示',
                    content: '请选择生成条件'
                });
                d.showModal();
                return;
            }*/

            this.__int();
            __ss.isInit = true;
            if (this.__alert() == false) return;
            var shownumber = '';
            shownumber = this.__dingweizhi();
            //生成之前先清空数组
            for (var i in this.__group) {
                __ss.__group[i] = [];
            }

            if (this.__classid == 7) {
                var list = [];
                var lens = this.__selectnumber.length;
                for (var i = 0; i < lens; i++) {
                    var number = testClassID7(this.__selectnumber[i]);
                    if (number)
                        list.push(number);
                }
                this.__selectnumber = list;
                this.__selectnumbertotal = list.length;
            }
            if (this.__classid === 1 || this.__classid == 7 || this.__classid === 2 || this.__classid3) {
                //后台线程生成组合
                setTimeout($$.proxy(function () {
                    for (var i = this.__selectnumber.length; i--;) {
                        for (var single in this.__groupPattern) {
                            this.__groupPattern[single][0].test(this.__selectnumber[i]) && this.__group[this.__groupPattern[single][1]].push(this.__selectnumber[i]);
                        }
                    }
                }, this), 0);
            }
            return this.__innerHTML(shownumber);
        },
        __getHTML: function (total, snumber) {
            var row = Math.floor(total / 8);
            var rownum = total % 8;
            var html = '';
            var idx = 0;
            html = ('<table cellspacing="0" cellpadding="0" class=showselectnumber border="0";"><tbody>');
            for (var i = 0; i < row; i++) {
                html += ("<tr><td >" + snumber[idx] + "</td>");
                idx++;
                html += ("<td>" + snumber[idx] + "</td>");
                idx++;
                html += ("<td>" + snumber[idx] + "</td>");
                idx++;
                html += ("<td>" + snumber[idx] + "</td>");
                idx++;
                html += ("<td>" + snumber[idx] + "</td>");
                idx++;
                html += ("<td>" + snumber[idx] + "</td>");
                idx++;
                html += ("<td>" + snumber[idx] + "</td>");
                idx++;
                html += ("<td>" + snumber[idx] + "</td>");
                idx++;
            }
            if (rownum > 0) {
                html += ("<tr>");
                for (var i = 0; i < rownum; i++) {
                    if (snumber[idx]) {
                        html += ("<td>" + snumber[idx] + "</td>");
                        idx++;
                    }
                }
                html += ("</tr>");
            }
            html += ("</tbody></table>");
            return html;
        },
        __innerHTML: function (shownumber) {
            if (shownumber == '') shownumber = '没有这样的号码。';
            var html = this.__getHTML(__ss.__selectnumbertotal, __ss.__selectnumber);
            return html;
        },
        __showmeun: function (num) {
            for (var i = 1; i <= 7; i++) {
                $('han' + i).style.display = "none";
                if (this._soonset['sidingwei'] == 0 && i == 3) {
                    continue;
                }
                $('soonclass' + i).disabled = false;
            }
            global.checkedVal(['3']);
            switch (num) {
                case 1:
                    $('s13').style.display = 'none';
                    $('s12').style.display = 'none';
                    $('ps3').style.display = 'none';
                    $('ps4').style.display = 'none';
                    break;
                case 2:
                    $('s13').style.display = 'none';
                    $('s12').style.display = 'none';
                    $('ps3').style.display = '';
                    $('ps4').style.display = 'none';
                    break;
                case 3:
                    $('s13').style.display = 'none';
                    $('s12').style.display = 'none';
                    $('ps3').style.display = '';
                    $('ps4').style.display = '';
                    break;
                case 4:
                    $('s13').style.display = '';
                    $('s12').style.display = '';
                    $('ps3').style.display = 'none';
                    $('ps4').style.display = 'none';
                    break;
                case 5:
                    $('s13').style.display = '';
                    $('s12').style.display = '';
                    $('ps3').style.display = '';
                    $('ps4').style.display = 'none';
                    break;
                case 6:
                    $('s13').style.display = '';
                    $('s12').style.display = '';
                    $('ps3').style.display = '';
                    $('ps4').style.display = '';
                    break;
                case 7:
                    $('s13').style.display = 'none';
                    $('s12').style.display = 'none';
                    $('ps3').style.display = 'none';
                    $('ps4').style.display = 'none';
                    break;
            }
            $('soonclass' + num).disabled = true;
            $('han' + num).style.display = "";
            if ($('changyong')) {
                $('changyong').style.display = "none";
                if (num == 3) $('changyong').style.display = "";
            }
            this.__classid = num;
            this.__shows();
        },
        __shows: function () {
            $$("#s2 td:eq(0)").text('千');
            $$("#s2 td:lt(2)").css("display", "");
            $$("#s3 td:lt(2)").css("display", "");
            $$("#s2 td:gt(2)").attr("colspan", "1");
            $$("#s3 td:gt(2)").attr("colspan", "1");
            $$("#s5 td:eq(2)").attr("colspan", "1");
            //$$("#s2 td:gt(1)").removeAttr("colspan");
            //$$("#s3 td:gt(1)").removeAttr("colspan");
            //$$("#s5 td:lt(2)").removeAttr("colspan");
            $$("#s5 td span.classID7").css("display", "none");
            $$("#s5 td input.classID7").css("display", "");
            $$("#s5 td").css("display", "");
            $$("#ch2 span.classID7").css('display', 'none');
            $$("#ch2 input.classID7").css('display', '');
            for (var i = 1; i <= 11; i++) {
                $("s" + i).style.display = "";
            }
            for (var i = 1; i <= 10; i++) {
                $("ss" + i).style.display = "";
            }
            for (var i = 1; i <= 2; i++) {
                $("bd" + i).style.display = "";
                $("ch" + i).style.display = "";

            }
            for (var i = 1; i <= 4; i++) {
                $("dsd" + i).style.display = "";
                $("dss" + i).style.display = "";
            }
            $("zfw1").style.display = "";
            if (this.__classid == 1 || this.__classid == 7) {
                $("ss2").style.display = "none";
                $("ss3").style.display = "none";
                $("ss6").style.display = "none";
                $("ss4").style.display = "none";
                $("ss7").style.display = "none";
                $("bd2").style.display = "none";
                $("zfw1").style.display = "none";

            } else if (this.__classid == 2) {
                $("ss2").style.display = "none";
                $("ss4").style.display = "none";
                $("ss7").style.display = "none";
                $("zfw1").style.display = "none";
            } else if (this.__classid == 3) {
                $("ch1").style.display = "none";
                $("ch2").style.display = "none";

            } else if (this.__classid == 4) {
                for (var i = 1; i <= 11; i++) {
                    if (i != 6 && i != 8 && i != 9 && i != 10 && i != 11)
                        $("s" + i).style.display = "none";
                }
                for (var i = 2; i <= 7; i++) {
                    if (i != 5)
                        $("ss" + i).style.display = "none";
                }
                $("zfw1").style.display = "none";
                $("bd2").style.display = "none";
                for (var i = 1; i <= 2; i++) {
                    $("dsd" + i).style.display = "none";
                    $("dss" + i).style.display = "none";
                }
            } else if (this.__classid == 5 || this.__classid == 6) {
                for (var i = 1; i <= 11; i++) {
                    if (i != 6 && i != 8 && i != 9 && i != 10 && i != 11)
                        $("s" + i).style.display = "none";

                }
                for (var i = 2; i <= 7; i++) {
                    if (i != 3 && i != 5 && i != 6)
                        $("ss" + i).style.display = "none";
                }
                $("zfw1").style.display = "none";

                if (this.__classid == 6) {
                    $("ss4").style.display = "";
                    $("ss7").style.display = "";
                } else {
                    for (var i = 1; i <= 1; i++) {
                        $("dsd" + i).style.display = "none";
                        $("dss" + i).style.display = "none";
                    }
                }
            }
            var stat = 0, s_1 = 0, s_2 = 0;
            for (var i in this._soonset) {
                stat = this._soonset[i];
                if (stat == 0) {
                    if (i == 's_weizhi') for (var i = 1; i <= 3; i++) {
                        $("s" + i).style.display = "none";
                    }
                    else if (i == 's_hefen') {
                        for (var i = 4; i <= 5; i++) {
                            $("s" + i).style.display = "none";
                        }
                    }//合分
                    else if (i == 's_bdwhefen') {
                        $("bdwhefen1").style.display = "none";
                        s_1++;
                    }//不定位合分
                    else if (i == 'zhifenwei') {
                        $("zfw1").style.display = "none";
                        s_1++;
                    }//值范围
                    else if (i == 'quandao') {
                        $("quandao").style.display = "none";
                        s_2++;
                    }//全倒
                    else if (i == 'paichu') {
                        $("paichu").style.display = "none";
                        s_2++;
                    }//排除
                    else if (i == 'chenghao') {
                        for (var i = 1; i <= 2; i++) {
                            $("ch" + i).style.display = "none";
                        }
                        s_2++;
                    }//乘号位置
                    else if (i == 'fushi') {
                        for (var i = 1; i <= 5; i++) {
                            $("han" + i).style.display = "none";
                        }
                    }//复式
                    else if (i == 'shong1') {
                        $("ss1").style.display = "none";
                    }//双重
                    else if (i == 'shong2') {
                        $("ss2").style.display = "none";
                    }
                    else if (i == 'shong3') {
                        $("ss3").style.display = "none";
                    }
                    else if (i == 'shong4') {
                        $("ss4").style.display = "none";
                    }
                    else if (i == 'xiongdi1') {
                        $("ss5").style.display = "none";
                    }//兄弟
                    else if (i == 'xiongdi2') {
                        $("ss6").style.display = "none";
                    }
                    else if (i == 'xiongdi3') {
                        $("ss7").style.display = "none";
                    }
                    else if (i == 'duishu') {
                        $("s10").style.display = "none";
                    }//对数
                    else if (i == 'dan') {
                        $("dan1").style.display = "none";
                    }//单
                    else if (i == 'shuang') {
                        $("shuang1").style.display = "none";
                    }//双
                    else if (i == 'shangjiang') {
                        $("shangjiang").style.display = "none";
                    }//上奖

                    if (s_1 == 2) $("s6").style.display = "none";
                    if (s_2 == 3) $("s7").style.display = "none";
                }
            }
            $("__quandao").value = "";
            $("__shangjiang").value = "";
            $("__paichu").value = "";
            for (var i = 1; i <= 4; i++) {
                $("__chenghao_" + i).checked = false;
            }
            if (this.__classid === 7) {
                //$("__chenghao_" + 1).checked = true;
                //$("__chenghao_" + 2).checked = true;
                //$("s4").style.display = "none";
                //$("s5").style.display = "none";
                //$("ch1").style.display = "none";
                //$("ch2").style.display = "none";
                $$("#ch2 span.classID7").css('display', '');
                $$("#ch2 input.classID7").css('display', 'none');
                $$("#s2 td:lt(2)").css("display", "none");
                $$("#s2 td:eq(0)").text('首');//万改为首
                $$("#s2 td:eq(2)").text('四');//拾改四 
                $$("#s2 td:eq(3)").text('尾');//个改为尾
                $$("#s2 td:eq(0)").css("display", "");
                $$("#s3 td:eq(1)").css("display", "none");
                $$("#s2 td:gt(2)").attr("colspan", "2");
                $$("#s3 td:gt(2)").attr("colspan", "2");
                $$("#s3 td:eq(0)").css("display", "");


                $$("#s5 td:eq(2)").attr("colspan", "2");
                $$("#s5 td span.classID7").css("display", "");
                $$("#s5 td input.classID7").css("display", "none");
                $$("#s5 td:gt(2)").css("display", "none");

            }
        },
        _soonset: {
            's_weizhi': 1,
            's_hefen': 1,
            's_bdwhefen': 1,
            'zhifenwei': 1,
            'quandao': 1,
            'paichu': 1,
            'chenghao': 1,
            'fushi': 1,
            'shong1': 1,
            'shong2': 1,
            'shong3': 1,
            'shong4': 1,
            'xiongdi1': 1,
            'xiongdi2': 1,
            'xiongdi3': 1,
            'duishu': 1,
            'dan': 1,
            'shuang': 1,
            'shangjiang': 1,
            'sidingwei': 1
        }
        ,
        __groupPattern: {
            'OOXX': [/\d{2}XX/i, 'B2'],
            'OXOX': [/\dX\dx/i, 'B3'],
            'OXXO': [/\dXX\d/i, 'B4'],
            'XOXO': [/X\dX\d/i, 'B5'],
            'XOOX': [/X\d{2}X/i, 'B6'],
            'XXOO': [/^XX\d{2}/i, 'B7'],
            'OOOX': [/\d{3}X/i, 'B9'],
            'OOXO': [/\d{2}X\d/i, 'B10'],
            'OXOO': [/\dX\d{2}/i, 'B11'],
            'XOOO': [/X\d{3}/i, 'B12'],
            'OOOO': [/^\d{4}$/i, 'B13'],
            'OO': [/^\d{2}$/i, 'B14'],
            'OOO': [/^\d{3}$/i, 'B15'],
            'XXXOO': [/^XXX\d{2}$/i, 'B17'],
            'OXXXO': [/^\dXXX\d$/i, 'B18']
        },
        __group: {
            'B2': [],
            'B3': [],
            'B4': [],
            'B5': [],
            'B6': [],
            'B7': [],
            'B9': [],
            'B10': [],
            'B11': [],
            'B12': [],
            'B13': [],
            'B14': [],
            'B15': [],
            'B16': [],
            'B17': [],
            'B18': []
        },
        isInit: true
    },
        reset = function () {
            $$('#reset').trigger('click');
            $$('#__selectnumbertotal').html(0);
            //if (__ss.__classid === 7) {
            //    $("__chenghao_" + 1).checked = true;
            //    $("__chenghao_" + 2).checked = true;
            //}
        };
    exports.viewmodel = function () {
        var self = this,
            credit = $$('#DefaultCredit');
        global = self;
        __ss.__classid = 1;
        this.amount = ko.observable().extend({ limit: { range: [0], fix: 1 } })
        this.flag = ko.observable('1');
        this.thiNum = ko.observable(0);
        this.render = function () {
            var content = $$('#content');
            if (content.find('td').length !== 0) {
                if (confirm('上次生成的数据还没有下注完成,确定要重新生成吗？')) {
                    this.flag('2');
                    setTimeout(function () {
                        content.html(__ss.__create());
                        $$('#__selectnumbertotal').html(__ss.__selectnumbertotal);
                        self.thiNum(__ss.__selectnumbertotal);

                        __ss.__logString = __ss.__setselectlogs();
                        //self.amount(0);
                    }, 50);
                }
            }
            else {
                content.html(__ss.__create());
                $$('#__selectnumbertotal').html(__ss.__selectnumbertotal);
                self.amount.notifySubscribers(self.amount());
                __ss.__logString = __ss.__setselectlogs();
            }
        };
        this.calcAmount = ko.pureComputed(function () {
            if (this.amount() == undefined) {
                return 0;
            } else if (this.flag() == '2') {
                this.flag('1');
                return ((this.amount() - 0) * this.thiNum()).toFixed(1) - 0;
            } else {
                return (this.amount() * __ss.__selectnumber.length).toFixed(1) - 0;
            }

        }, self);
        /*Tao键和回车时；查询统计所有金额并提交下注信息*/
        this.disableEnterFastChoose = function (data, event) {
            var keyCodeval = event.keyCode - 0;
            //keyCodeval=9 Tab键；keyCodeval==13回车键
            if (keyCodeval == 13) {
                this.submit();
            }
            return true;
        }
        this.checkedVal = ko.observableArray(['2']);
        this.__showdis = function (v, e) {
            if ($(e.target.id).checked) {
                this.checkedVal([]);
                this.checkedVal.push($(e.target.id).value + '');
            }
            //this.__showpeishu(e.target.id);
            this.__showpeishu($$($$('#' + e.target.id).siblings('input'))[0].id);
            return true;
        }
        this.__showpeishu = function (oo) {
            if (oo == '__dingwei_qu' || oo == '__dingwei_chu') {
                $('__peishu_qu').checked = false;
                $('__peishu_chu').checked = false;
                $('s2').style.display = "";
                $('s3').style.display = "";
                $('s12').style.display = "none";
            } else if (oo == '__peishu_qu' || oo == "__peishu_chu") {
                $('__dingwei_qu').checked = false;
                $('__dingwei_chu').checked = false;
                $('s2').style.display = "none";
                $('s3').style.display = "none";
                $('s12').style.display = "";
            }
        }
        this.isSubmitting = false; /// 是否正在提交注单中
        this.submit = function () {
            if (this.isSubmitting) return;
            var confUsedCredit = document.getElementById("DefaultCredit").innerHTML;
            //(credit.html() - 0 < this.calcAmount())
            var confCalcAmount = confUsedCredit - 0 - this.calcAmount();
            var confirmTip = "现在可用“" + confUsedCredit + "”，下注后可用应是“" + confCalcAmount + "”。" + "\n\r";
            confirmTip += "下注完成后请在会员信息里再次核对已用信用用度！" + "\n\r";
            confirmTip += "如果（已用）信用度不相符。" + "\n\r";
            confirmTip += "请先进入（快选）检查是否有发送中断号码。" + "\n\r";
            confirmTip += "如果有，请输入金额继续下注。" + "\n\r";
            confirmTip += "如果没有，请检查是否有（目前停押号码）。" + "\n\r";
            confirmTip += "请认真检查。";
            if (confirm(confirmTip)) {
                var status = Utils.Cookie.get('PeriodsStatus');
                if (__ss.__selectnumbertotal <= 0) {
                    //alert('没有可下注的号码');
                    Utils.tip("没有可下注的号码!", false, true ? function () {

                    } : null);
                    __ss.isInit = false;
                } else if (self.amount() == "" || self.amount() == undefined) {
                    Utils.tip("金额不能为空!", false, true ? function () {

                    } : null);
                    return;
                }
                else if (credit.html() - 0 < this.calcAmount()) {
                    //alert('当前信用余额不足');
                    // __ss.isInit = false
                    Utils.tip("当前信用余额不足!", false, true ? function () {

                    } : null);
                    return;
                }
                else if (status == null || status !== '1') {
                    // alert('当前没有开盘的期数,不可下注');
                    Utils.tip("当前没有开盘的期数,不可下注!", false, true ? function () {

                    } : null);
                    __ss.isInit = false;
                }
                //else if (__ss.__selectnumber.length > 1000) {
                //    alert('每笔注单不能超过1000注');
                //    __ss.isInit = false;
                //}
                else {
                    //先分组再提交
                    if (__ss.isInit) {
                        var data;
                        switch (__ss.__classid) {
                            case 3:
                                __ss.__group['B13'] = __ss.__group['B13'].concat(__ss.__selectnumber);
                                break;
                            case 4:
                                __ss.__group['B14'] = __ss.__group['B14'].concat(__ss.__selectnumber);
                                break;
                            case 5:
                                __ss.__group['B15'] = __ss.__group['B15'].concat(__ss.__selectnumber);
                                break;
                            case 6:
                                __ss.__group['B16'] = __ss.__group['B16'].concat(__ss.__selectnumber);
                                break;
                        }
                    }
                    data = __ss.__group;
                    var d = dialog({
                        title: '请稍后......',
                        content: '正在处理数据,请稍后。。。',
                        cancel: function () { return false },
                        cancelValue: '正在提交中..'
                    });
                    d.showModal();
                    $$('.ui-dialog-grid .ui-dialog-button button').attr('disabled', true);
                    var logs = '金额：' + self.amount() + '，笔数：' + __ss.__selectnumbertotal + ', ' + __ss.__logString;

                    this.isSubmitting = true;
                    $$.ajax({
                        url: "/index.php/Portal/FastChoose/SetFastBeatItem",
                        type: "post",
                        data: {
                            Data: JSON.stringify(data),
                            AmountCount: self.calcAmount(),
                            Amount: self.amount(),
                            LogContent: escape(logs), //'快选下注规则'
                            _: +new Date
                        },
                        success: function (data) {
                            d.close().remove();

                            //
                            //Utils.tip(data.info, data.status, data.status ? function () {

                            //} : null);

                            __ss.isInit = false;
                            if (!data.status && data.info.indexOf("重新登录") > -1) {
                                if (window.confirm(data.info)) {
                                    window.location.href = "/index.php/portal/index/login";
                                    return;
                                }
                            }
                            if (data.status) {//framework._extend.calcCredit(self.calcAmount());
                                /*刷新左边已用和可用金额:拿成功返回的最新额度*/
                                document.getElementById("DefaultCredit").innerHTML = parseFloat(data.CmdObject.Credit).toFixed(4) - 0;//总信用额度
                                //document.getElementById("UsedCredit").innerHTML = parseFloat(data.CmdObject.UsedCredit).toFixed(4) - 0;//已用额度
                                //document.getElementById("RemainingUndrawn").innerHTML = (data.CmdObject.Credit - data.CmdObject.UsedCredit).toFixed(4) - 0;
                                //parseFloat(data.CmdObject.Credit).toFixed(4) - 0 - parseFloat(data.CmdObject.UsedCredit).toFixed(4) - 0;
                                Utils.sound.play();
                                framework._extend.getBetInfoForLeftInfo();
                                reset();
                            }
                            else {
                                // Utils.tip(data.info, data.status);
                                Utils.tip(data.info, data.status, true ? function () {

                                } : null);
                                if (data.info.indexOf("无效期数数据") > -1) {
                                    if (framework.periods && $$.isFunction(framework.periods.main)) {
                                        framework.periods.main();
                                    }
                                }
                            }
                            if (data.isStopNum - 0 == 55) {//StopBetItem = 55表示是押停号码
                                /*刷新左边已用和可用金额:拿成功返回的最新额度*/
                                document.getElementById("DefaultCredit").innerHTML = parseFloat(data.CmdObject.Credit).toFixed(4) - 0;//总信用额度
                                //document.getElementById("UsedCredit").innerHTML = parseFloat(data.CmdObject.UsedCredit).toFixed(4) - 0;//已用额度
                                //document.getElementById("RemainingUndrawn").innerHTML = (data.CmdObject.Credit - data.CmdObject.UsedCredit).toFixed(4) - 0;
                                framework._extend.getBetInfoForLeftInfo();
                                Utils.tip(data.info, data.status, data.status ? function () {

                                } : null);
                                framework.view("/index.php/portal/FastBeat/Index", "BetPanel/FastBeat/Index");
                            }
                        },
                        complete: function () {
                            self.isSubmitting = false;
                        }
                    });
                }
            } else {
                this.isSubmitting = false;
            }
        };
        this.getAmount = function () {
            document.getElementById("amount").select();
        };
    };
    exports.done = function () {
        var panel = $$('#select-table span[data-checked=true]'),
            inputs = $$('#select-table input[type=text]');
        if (inputs[0].oninput !== undefined) {
            inputs.on('input', function (event) {
                // console.log("input");
                var target = event.target,
                    result = '';
                if (target.id === '__zhifanwei_start' || target.id === '__zhifanwei_end' || target.id === '__peishu_1' || target.id === '__peishu_2' || target.id === '__peishu_3' || target.id === '__peishu_4') {
                    if (!(/^[0-9]*$/.test(target.value))) {
                        target.value = target.value.replace(target.value.substr(-1), '');
                    }
                    return;
                };
                target.value.replace(/\d/g, function (mate) {
                    var first = mate[0];//第一个始终是匹配到的内容
                    if (target.id !== '__quandao' && target.id !== '__shangjiang') {
                        result.indexOf(first) === -1 && (result += first);
                    }
                    else {
                        result += first;
                    }
                });
                target.value = result;
            });
        }
        else {
            inputs.on('keydown', function (event) {
                // console.log("keydown");
                var
                    keyCode = event.keyCode,
                    target = $$(event.target),
                    value = target.val(),
                    code = '';
                switch (keyCode) {
                    case 96:
                        code = 0;
                        break;
                    case 97:
                        code = 1;
                        break;
                    case 98:
                        code = 2;
                        break;
                    case 99:
                        code = 3;
                        break;
                    case 100:
                        code = 4;
                        break;
                    case 101:
                        code = 5;
                        break;
                    case 102:
                        code = 6;
                        break;
                    case 103:
                        code = 7;
                        break;
                    case 104:
                        code = 8;
                        break;
                    case 105:
                        code = 9;
                        break;
                    default:
                        code = String.fromCharCode(keyCode);
                        break;
                }
                if (target.attr("id") !== '__quandao' && target.attr("id") !== '__shangjiang' && value.indexOf(code) !== -1) {
                    return false;
                }
                if ((keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105) && keyCode !== 8 && keyCode !== 116 && keyCode !== 9) {
                    return false;
                }
            });
        }

        panel.on('click', function (event) {
            var currentID,
                checkbox = $$(this).find(':checked'),
                currentTarget = event.target;
            checkbox.each(function () {
                if (currentTarget === this) {
                    if (currentTarget.checked) {
                        if (currentID) {
                            currentTarget.checked = false;
                        }
                        else {
                            currentID = currentTarget.id;
                            currentTarget.checked = true;
                        }
                    }
                }
                else {
                    this.checked = false;
                }
            });
        });
        var allType = $$('#select-type input'),
            current = $$(allType[0]);
        allType.off("click").on('click', function () {
            if (current[0] === this) return;
            current.removeClass('btn-bg');
            current = $$(this);
            current.addClass('btn-bg');
            __ss.__curType = current.val();
            var data = current.data('select');
            __ss.__classid = current.data('type') - 0;
            __ss.__showmeun(__ss.__classid);
            reset();
        });
        $$('#reset').off("click").on('click', function () {
            var table = $$('#content table');
            var av = global.amount();
            table.css({ display: 'none' });
            setTimeout(function () {
                table.remove();
                //if (__ss.__classid === 7) {
                //    $("__chenghao_" + 1).checked = true;
                //    $("__chenghao_" + 2).checked = true;
                //}
            }, 0);
            global.amount("");
            $$('#__selectnumbertotal').text(0);
            __ss.__selectnumber = [];//__ss.__selectnumber
            __ss.__selectnumbertotal = 0;
            __ss.__selectnumber.length = 0;
        });
    };
});