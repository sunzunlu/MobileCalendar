/**
 * 作者: 孙尊路
 * 创建时间: 2017-07-14 13:26:47
 * 版本: [1.0, 2017/7/14]
 * 版权: 江苏国泰新点软件有限公司
 * 说明： 常用工具js
 */
window.innerCalendarUtil = window.innerCalendarUtil || (function (exports) {

    /**
     * 产生一个 唯一uuid，默认为32位的随机字符串，8-4-4-4-12 格式
     * @param {Object} options 配置参数
     * len 默认为32位，最大不能超过36，最小不能小于4
     * radix 随机的基数，如果小于等于10代表只用纯数字，最大为62，最小为2，默认为62
     * type 类别，默认为default代表 8-4-4-4-12的模式，如果为 noline代表不会有连线
     * @return {String} 返回一个随机性的唯一uuid
     */
    exports.uuid = function (options) {
        options = options || {};

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
            uuid = [],
            i;
        var radix = options.radix || chars.length;
        var len = options.len || 32;
        var type = options.type || 'default';

        len = Math.min(len, 36);
        len = Math.max(len, 4);
        radix = Math.min(radix, 62);
        radix = Math.max(radix, 2);

        if(len) {
            for(i = 0; i < len; i++) {
                uuid[i] = chars[0 | Math.random() * radix];
            }

            if(type === 'default') {
                len > 23 && (uuid[23] = '-');
                len > 18 && (uuid[18] = '-');
                len > 13 && (uuid[13] = '-');
                len > 8 && (uuid[8] = '-');
            }
        }

        return uuid.join('');
    };

    var class2type = {};

    exports.noop = function () {};

    exports.isFunction = function (value) {
        return exports.type(value) === 'function';
    };
    exports.isPlainObject = function (obj) {
        return exports.isObject(obj) && !exports.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
    };
    exports.isArray = Array.isArray ||
        function (object) {
            return object instanceof Array;
        };

    /**
     * isWindow(需考虑obj为undefined的情况)
     * @param {Object} obj 需要判断的对象
     * @return {Boolean} 返回true或false
     */
    exports.isWindow = function (obj) {
        return obj && obj === window;
    };
    exports.isObject = function (obj) {
        return exports.type(obj) === 'object';
    };
    exports.type = function (obj) {
        return(obj === null || obj === undefined) ? String(obj) : class2type[{}.toString.call(obj)] || 'object';
    };
    /**
     * each遍历操作
     * @param {Object} elements 元素
     * @param {Function} callback 回调
     * @param {Function} hasOwnProperty 过滤函数
     * @returns {global} 返回调用的上下文
     */
    exports.each = function (elements, callback, hasOwnProperty) {
        if(!elements) {
            return this;
        }
        if(typeof elements.length === 'number') {
            [].every.call(elements, function (el, idx) {
                return callback.call(el, idx, el) !== false;
            });
        } else {
            for(var key in elements) {
                if(hasOwnProperty) {
                    if(elements.hasOwnProperty(key)) {
                        if(callback.call(elements[key], key, elements[key]) === false) {
                            return elements;
                        }
                    }
                } else {
                    if(callback.call(elements[key], key, elements[key]) === false) {
                        return elements;
                    }
                }
            }
        }

        return this;
    };

    /**
     * extend 合并多个对象，可以递归合并
     * @param {type} deep 是否递归合并
     * @param {type} target 最终返回的就是target
     * @param {type} source 从左到又，优先级依次提高，最右侧的是最后覆盖的
     * @returns {Object} 最终的合并对象
     */
    exports.extend = function () {
        var args = [].slice.call(arguments);

        // 目标
        var target = args[0] || {},
            // 默认source从1开始
            index = 1,
            len = args.length,
            // 默认非深复制
            deep = false;

        if(typeof target === 'boolean') {
            // 如果开启了深复制
            deep = target;
            target = args[index] || {};
            index++;
        }

        if(!exports.isObject(target)) {
            // 确保拓展的一定是object
            target = {};
        }

        for(; index < len; index++) {
            // source的拓展
            var source = args[index];

            if(source && exports.isObject(source)) {
                for(var name in source) {
                    if(!Object.prototype.hasOwnProperty.call(source, name)) {
                        // 防止原型上的数据
                        continue;
                    }

                    var src = target[name];
                    var copy = source[name];
                    var clone,
                        copyIsArray;

                    if(target === copy) {
                        // 防止环形引用
                        continue;
                    }

                    // 这里必须用isPlainObject,只有同样是普通的object才会复制继承，如果是FormData之流的，会走后面的覆盖路线
                    if(deep && copy && (exports.isPlainObject(copy) || (copyIsArray = exports.isArray(copy)))) {
                        if(copyIsArray) {
                            copyIsArray = false;
                            clone = src && exports.isArray(src) ? src : [];
                        } else {
                            clone = src && exports.isPlainObject(src) ? src : {};
                        }

                        target[name] = exports.extend(deep, clone, copy);
                    } else if(copy !== undefined) {
                        // 如果不是普通的object，直接覆盖，例如FormData之类的会覆盖
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    exports.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function (i, name) {
        class2type['[object ' + name + ']'] = name.toLowerCase();
    });

    /**
     * 选择这段代码用到的太多了，因此抽取封装出来
     * @param {Object} element dom元素或者selector
     * @return {HTMLElement} 返回对应的dom
     */
    exports.selector = function (element) {
        if(typeof element === 'string') {
            element = document.querySelector(element);
        }

        return element;
    };

    /**
     * 设置一个Util对象下的命名空间
     * @param {String} namespace 命名空间
     * @param {Object} obj 需要赋值的目标对象
     * @return {Object} 返回目标对象
     */
    exports.namespace = function (namespace, obj) {
        var parent = window.Util;

        if(!namespace) {
            return parent;
        }

        var namespaceArr = namespace.split('.'),
            len = namespaceArr.length;

        for(var i = 0; i < len - 1; i++) {
            var tmp = namespaceArr[i];

            // 不存在的话要重新创建对象
            parent[tmp] = parent[tmp] || {};
            // parent要向下一级
            parent = parent[tmp];
        }
        parent[namespaceArr[len - 1]] = obj;

        return parent[namespaceArr[len - 1]];
    };

    /**
     * 获取这个模块下对应命名空间的对象
     * 如果不存在，则返回null，这个api只要是供内部获取接口数据时调用
     * @param {Object} module 模块
     * @param {Array} namespace 命名空间
     * @return {Object} 返回目标对象
     */
    exports.getNameSpaceObj = function (module, namespace) {
        if(!namespace) {
            return null;
        }
        var namespaceArr = namespace.split('.'),
            len = namespaceArr.length;

        for(var i = 0; i < len; i++) {
            module && (module = module[namespaceArr[i]]);
        }

        return module;
    };

    /**
     * 将string字符串转为html对象,默认创一个div填充
     * 因为很常用，所以单独提取出来了
     * @param {String} strHtml 目标字符串
     * @return {HTMLElement} 返回处理好后的html对象,如果字符串非法,返回null
     */
    exports.parseHtml = function (strHtml) {
        if(!strHtml || typeof (strHtml) !== 'string') {
            return null;
        }
        // 创一个灵活的div
        var i,
            a = document.createElement('div');
        var b = document.createDocumentFragment();

        a.innerHTML = strHtml;
        while((i = a.firstChild)) {
            b.appendChild(i);
        }

        return b;
    };

    /**
     * 图片的base64字符串转Blob
     * @param {String} urlData 完整的base64字符串
     * @return {Blob} 转换后的Blob对象，可用于表单文件上传
     */
    exports.base64ToBlob = function (urlData) {
        var arr = urlData.split(',');
        var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
        // 去掉url的头，并转化为byte
        var bytes = window.atob(arr[1]);
        // 处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
        var ia = new Uint8Array(ab);

        for(var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }

        return new Blob([ab], {
            type: mime
        });
    };

    /**
     * 通过传入key值,得到页面key的初始化传值
     * 实际情况是获取 window.location.href 中的参数的值
     * @param {String} key 键名
     * @return {String} 键值
     */
    exports.getExtraDataByKey = function (key) {
        if(!key) {
            return null;
        }
        // 获取url中的参数值
        var getUrlParamsValue = function (url, paramName) {
            var paraString = url.substring(url.indexOf('?') + 1, url.length).split('&');
            var paraObj = {};
            var i,
                j;

            for(i = 0;
                (j = paraString[i]); i++) {
                paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length);
            }
            var returnValue = paraObj[paramName.toLowerCase()];

            // 需要解码浏览器编码
            returnValue = decodeURIComponent(returnValue);
            if(typeof (returnValue) === 'undefined') {
                return undefined;
            } else {
                return returnValue;
            }
        };
        var value = getUrlParamsValue(window.location.href, key);

        if(value === 'undefined') {
            value = null;
        }

        return value;
    };

    // 避免提示警告
    var Console = console;

    exports.log = function () {
        // 方便后续控制
        Console.log.apply(this, arguments);
    };

    exports.warn = function () {
        Console.warn.apply(this, arguments);
    };

    exports.error = function () {
        Console.error.apply(this, arguments);
    };

    return exports;
})({});
/**
 * 作者: 孙尊路
 * 创建时间: 2017-07-14 13:26:47
 * 版本: [1.0, 2017/7/14]
 * 版权: 江苏国泰新点软件有限公司
 * 描述：日历组件基类
 * 实现方案：自定义日历组件+swiper插件的完美结合。
 * 更新日志：
 * (1)修复了农历显示不正确、不对应的问题
 * (2)增加了外部刷新的方法
 * (3)整体优化日程的解耦合情形
 * (4)优化实例化日期，增加时间戳
 */

(function () {
    "use strict";

    /**
     * 全局生效默认设置
     * 默认设置可以最大程度的减小调用时的代码
     */
    var defaultOptions = {
        // 默认日历组件容器
        container: "#calendar",
        // swiper滑动容器
        swiper: ".swiper-container",
        // 默认显示农历
        isLunar: true,
        // 默认开启水平方向切换月份
        isSwipeH: true,
        // 默认开启垂直方向切换月份
        isSwipeV: true,
        // 滑动回调
        swipeCallback: noop,
        // 上一月节点
        pre: ".pre",
        // 上一月回调
        preCallback: noop,
        // 下一月节点
        next: ".next",
        // 下一月回调
        nextCallback: noop,
        // 点击回调
        onItemClick: noop,
        // 自定义输入模板
        template: noop,
        // 业务数据绑定
        dataRequest: noop,
        // 是否开启调试
        isDebug: false
    };

    function noop() {}

    /**
     * 日历的构造函数
     * @param {Object} options 配置参数，和init以及_initData的一致
     * @constructor
     */
    function Calendar(options) {

        options = innerCalendarUtil.extend({}, defaultOptions, options);
        if(!this._selector(options.container)) {
            // 抛异常
            throw new Error("传入的日历组件容器Selector #id不存在或者为空，请仔细检查！");
            return;
        }
        this.container = this._selector(options.container);

        this._initData(options);
    }

    Calendar.prototype = {
        /**
         * 初始化数据单独提取，方便refreshData使用
         * @param {Object} options 配置参数
         */
        _initData: function (options) {
            var self = this;
            this.options = options;

            // 创建日历DOM结构体
            this.CreateDOMFactory(function () {
                // 程序入口
                self._initParams();
            });
        },
        _initParams: function () {
            var self = this;
            self.nowYear = self.DateObj().getFullYear();
            self.nowMonth = self.tod(self.DateObj().getMonth() + 1);
            self.nowDay = self.tod(self.DateObj().getDate());
            // 当前日期
            self.currentDate = self.nowYear + "-" + self.nowMonth + "-" + self.nowDay;

            // 定义全局变量 计算农历
            self.CalendarData = new Array(100);
            self.madd = new Array(12);
            self.tgString = "甲乙丙丁戊己庚辛壬癸";
            self.dzString = "子丑寅卯辰巳午未申酉戌亥";
            self.numString = "一二三四五六七八九十";
            self.monString = "正二三四五六七八九十冬腊";
            self.weekString = "日一二三四五六";
            self.sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
            self.cYear, self.cMonth, self.cDay, self.TheDate;
            self.CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
            self.madd[0] = 0;
            self.madd[1] = 31;
            self.madd[2] = 59;
            self.madd[3] = 90;
            self.madd[4] = 120;
            self.madd[5] = 151;
            self.madd[6] = 181;
            self.madd[7] = 212;
            self.madd[8] = 243;
            self.madd[9] = 273;
            self.madd[10] = 304;
            self.madd[11] = 334;

            // 生成日历
            self.initEntry();

        },
        /**
         * 初始化日历
         */
        initEntry: function (op) {
            var self = this;
            var options = innerCalendarUtil.extend({
                year: "",
                month: "",
                day: ""
            }, op);
            //console.log("合并后："+JSON.stringify(options));
            // 获取前一个月份
            if(!options.year) {
                options.year = self.DateObj().getFullYear(); //默认不传为"当前年"
            } else {
                options.year = op.year;
            }
            if(!options.month) {
                options.month = self.tod(self.DateObj().getMonth() + 1); //默认不传为"当前月"
            } else {
                options.month = op.month;
            }

            var preYear = options.year;
            var m = options.month;
            var preMonth = parseInt(m) - parseInt(1);

            if(preMonth == 0) {
                preYear = options.year - 1;
                preMonth = 12;
            }
            preMonth = self.tom(preMonth);
            var preDay = self.tod("01");
            //if(self.options.isDebug) {
            if(self.options.isDebug) {
                console.log("(前)初始化年月日：" + preYear + "-" + preMonth + "-" + preDay);

            }

            // 生成上一个月份的日历
            var outputs = [];
            self.refreshData({
                year: preYear,
                month: preMonth,
                day: preDay
            }, function (output) {
                outputs.push({
                    templ: output
                });

                // 初始化默认当前日期
                var curYear = options.year || self.DateObj().getFullYear();
                var curMonth = options.month || self.tod(self.DateObj().getMonth() + 1);
                var curDay = options.day || self.tod(self.DateObj().getDate());
                //alert("默认对不对："+curYear+"-"+curMonth+"-"+curDay);
                self.curYear = options.year || self.DateObj().getFullYear();
                self.curMonth = options.month || self.tod(self.DateObj().getMonth() + 1);
                self.curDay = options.day || self.tod(self.DateObj().getDate());
                if(self.options.isDebug) {
                    console.log("(中)初始化年月日：" + curYear + "-" + curMonth + "-" + curDay);
                }

                // 生成本月份的日历
                self.refreshData({
                    year: curYear,
                    month: curMonth,
                    day: curDay
                }, function (output1) {
                    outputs.push({
                        templ: output1
                    });
                    // 渲染日历模板
                    var templ = self.SLIDER_ITEM_CONTAINER;

                    var html = "";
                    for(var i = 0; i < outputs.length; i++) {
                        html += Mustache.render(templ, outputs[i]);
                    }
                    document.querySelector(".swiper-wrapper").innerHTML = html;
                    // 初始化swiper监听
                    self._addEvent();
                });
            });
        },
        /**
         * 刷新日历，传入日期格式须：2017-07-01 或2017-12-09
         */
        //refreshData: function(year, month, day, activeSlideNode) {
        refreshData: function (dateObj, callback) {
            var self = this;

            self.nowYear = parseInt(dateObj.year);
            self.nowMonth = self.tom(dateObj.month);
            self.nowDay = self.tod(dateObj.day);

            // 获取星期
            var tmptmp = new Date(Date.parse(self.nowYear + '/' + self.nowMonth + '/01'));
            var nowXingQiJi = tmptmp.getDay();
            //console.log("星期"+nowXingQiJi);

            nowXingQiJi = parseInt(nowXingQiJi);
            if(nowXingQiJi == 0) {
                nowXingQiJi = 7;
            }
            // 根据年份、月份 计算月份中的天数（比如：28、29、30、31等）
            var dayCount = self._judgeDaysByYearMonth(self.nowYear, self.nowMonth);
            // 总天数
            self.dayCount = dayCount;
            // 保留老的存储方式
            var fileInfo = {};
            // 新的存储方式
            var tmpInfo = [];

            var preDayCount = self._judgeDaysByYearMonth(self.nowYear, parseInt(self.nowMonth - 1));
            //console.log("前一月总天数：" + preDayCount);
            preDayCount = parseInt(preDayCount);

            // 头部日期计算
            for(var i = 1; i < nowXingQiJi + 1; i++) {
                var preMonthDay = preDayCount - nowXingQiJi + i;
                var tmpName = 'day' + i;
                var lunar = 'lunar' + i;
                //日、农历、完整日期
                var y = parseInt(self.nowYear);
                var m = parseInt(self.nowMonth);
                m = -1 + m;
                if(m == 0) {
                    m = 12
                    y = parseInt(self.nowYear - 1)
                }
                fileInfo[tmpName] = preMonthDay;
                fileInfo[lunar] = self._getLunar(preMonthDay, m, y);
                //  console.log("农历：" + fileInfo[lunar]);
                //存储前一个月数据
                //console.log(self.nowYear + "-" + self.tom(parseInt(self.nowMonth - 1)) + "-" + self.tod(preMonthDay));
                tmpInfo.push({
                    day: preMonthDay, //日
                    lunar: self._getLunar(preMonthDay, m, y), //农历
                    date: y + "-" + self.tom(m) + "-" + self.tod(preMonthDay), //完整日期
                    isforbid: "0", //前一个月和后一个月不可点击
                    tip: 'prev',
                });
                //console.log("年份：" + self.nowYear);
                //console.log("上个月的数据：\n" + JSON.stringify(tmpInfo)+"\n");
            }
            var daonale = 0;

            if(dayCount == '28') {
                daonale = 28 + nowXingQiJi;
                for(var index = nowXingQiJi + 1, indexindex = 1; index < (28 + nowXingQiJi + 1); index++, indexindex++) {
                    var tmpName = 'day' + index;
                    var lunar = 'lunar' + index;
                    fileInfo[tmpName] = indexindex;
                    fileInfo[lunar] = self._getLunar(indexindex);
                    //存储当前月数据
                    tmpInfo.push({
                        day: indexindex, //日
                        lunar: self._getLunar(indexindex), //农历
                        date: self.nowYear + "-" + self.tom(self.nowMonth) + "-" + self.tod(indexindex), //完整日期
                        isforbid: "1" //当前月可点击
                    });
                    //  console.log(self.tom(parseInt(self.nowMonth)) + "月份：" + self.tod(indexindex));

                }
            }
            if(dayCount == '29') {
                daonale = 29 + nowXingQiJi;
                for(var index = nowXingQiJi + 1, indexindex = 1; index < (29 + nowXingQiJi + 1); index++, indexindex++) {
                    var tmpName = 'day' + index;
                    var lunar = 'lunar' + index;
                    fileInfo[tmpName] = indexindex;
                    fileInfo[lunar] = self._getLunar(indexindex);
                    //存储当前月数据
                    tmpInfo.push({
                        day: indexindex, //日
                        lunar: self._getLunar(indexindex), //农历
                        date: self.nowYear + "-" + self.tom(self.nowMonth) + "-" + self.tod(indexindex), //完整日期
                        isforbid: "1" //当前月可点击
                    });
                    //console.log(self.tom(parseInt(self.nowMonth)) + "月份：" + self.tod(indexindex));

                }
            }
            if(dayCount == '30') {
                daonale = 30 + nowXingQiJi;
                for(var index = nowXingQiJi + 1, indexindex = 1; index < (30 + nowXingQiJi + 1); index++, indexindex++) {
                    var tmpName = 'day' + index;
                    var lunar = 'lunar' + index;
                    fileInfo[tmpName] = indexindex;
                    fileInfo[lunar] = self._getLunar(indexindex);
                    //存储当前月数据
                    tmpInfo.push({
                        day: indexindex, //日
                        lunar: self._getLunar(indexindex), //农历
                        date: self.nowYear + "-" + self.tom(self.nowMonth) + "-" + self.tod(indexindex), //完整日期
                        isforbid: "1" //当前月可点击
                    });
                    //console.log(self.tom(parseInt(self.nowMonth)) + "月份：" + self.tod(indexindex));
                }
            }
            if(dayCount == '31') {
                daonale = 31 + nowXingQiJi;
                for(var index = nowXingQiJi + 1, indexindex = 1; index < (31 + nowXingQiJi + 1); index++, indexindex++) {
                    var tmpName = 'day' + index;
                    var lunar = 'lunar' + index;
                    fileInfo[tmpName] = indexindex;
                    fileInfo[lunar] = self._getLunar(indexindex);
                    //存储当前月数据
                    tmpInfo.push({
                        day: indexindex, //日
                        lunar: self._getLunar(indexindex), //农历
                        date: self.nowYear + "-" + self.tom(self.nowMonth) + "-" + self.tod(indexindex), //完整日期
                        isforbid: "1" //当前月可点击
                    });
                    //console.log(self.tom(parseInt(self.nowMonth)) + "月份：" + self.tod(indexindex));
                }
            }
            // 尾部日期计算
            for(var index2 = daonale + 1, index3 = 1; index2 <= 42; index2++, index3++) {
                var tmpName = 'day' + index2;
                var lunar = 'lunar' + index2;
                //日、农历、完整日期
                var y2 = parseInt(self.nowYear);
                var m2 = parseInt(self.nowMonth) + parseInt(1);
                if(m2 == 13) {
                    m2 = 1;
                    y2 = parseInt(self.nowYear) + parseInt(1)
                }
                fileInfo[tmpName] = index3;
                fileInfo[lunar] = self._getLunar(index3, m2, y2);
                //存储当前月数据
                tmpInfo.push({
                    day: index3, //日
                    lunar: self._getLunar(index3, m2, y2), //农历
                    date: y2 + "-" + self.tom(m2) + "-" + self.tod(index3), //完整日期
                    isforbid: "0", //前一月和后一月不可点击
                    tip: 'next',
                });
                //console.log("后面一个月的数据：\n" + JSON.stringify(tmpInfo) + "\n");
                //console.log(self.tom(parseInt(self.nowMonth) + parseInt(1)) + "月份：" + self.tod(index3));
            }
            if(self.options.isDebug) {
                console.log("*********日历格式********:\n" + JSON.stringify(tmpInfo) + "\n");
            }
            //this._render(fileInfo, tmpInfo, dateObj.activeSlideNode);
            this._render({
                fileInfo: fileInfo,
                tmpInfo: tmpInfo,
                activeSlideNode: dateObj.activeSlideNode,
            }, callback);
        },

        /**
         * 视图的渲染和数据分离，采用内部的数据
         */
        //_render: function(fileInfo, tmpInfo, activeSlideNode) {
        _render: function (dataObj, callback) {
            var self = this;
            //console.log("XXXX" + JSON.stringify(dataObj.fileInfo));
            // 渲染之前，业务ajax请求，显示日历上日程标记
            var dateStr = self.nowYear + "-" + self.nowMonth + "-";

            // 必须设置延迟300ms,否则滑动有偏差
            setTimeout(function () {
                self.options.dataRequest(dateStr, function (data) {
                    var res = data || [];
                    //和业务绑定
                    if(self.options.isDebug) {
                        console.log("*********业务数据：********:\n" + JSON.stringify(res) + "\n");
                    }
                    for(var j = 0; j < res.length; j++) {
                        for(var i = 0; i < dataObj.tmpInfo.length; i++) {
                            if(res[j].date == dataObj.tmpInfo[i].date) {
                                dataObj.tmpInfo[i].isSelected = "1";
                            }
                        }
                    }
                    //完全支持自定义外部传入模板
                    var html = self.getThemeHtml(dataObj);

                    if(self.options.isDebug) {
                        console.log("*********日历模板********:\n" + html + "\n");
                    }
                    if(typeof (callback) == "function") {
                        callback && callback(html, dataObj.tmpInfo);
                    }

                    return;
                }, self);
            }, 100);
        },
        /**
         * 获取主题模板
         */
        getThemeHtml: function (dataObj) {
            var self = this;
            // 模板集合
            var html = "";
            // 模板项
            var template = "";
            // 当前日期
            var curr = self.currentDate;

            for(var i = 0, len = dataObj.tmpInfo.length; i < len; i++) {
                // 如果传入模板为空，则默认日历主题模板
                var value = dataObj.tmpInfo[i];
                var templData = self.options.template(value, curr);
                if(!templData) {
                    //console.log("=======默认日历主题模板=======");
                    // =======默认日历主题模板=======
                    // 上一月和下一月不可点击模板
                    if(value.date == curr) {
                        //今天
                        if(value.isSelected) {
                            template = '<div class="em-calendar-item em-calendar-active  isforbid{{isforbid}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">今天</p><span class="dot dot-type1"></span></div>';
                        } else {
                            template = '<div class="em-calendar-item em-calendar-active  isforbid{{isforbid}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">今天</p></div>';
                        }
                    } else {
                        if(value.isSelected) {
                            // 个性化和业务贴近
                            template = '<div class="em-calendar-item  isforbid{{isforbid}} tip{{tip}}" date="{{date}}" ><span class="day">{{day}}</span><p class="lunar">{{lunar}}</p><span class="dot dot-type1"></span></div>';
                        } else {
                            template = '<div class="em-calendar-item  isforbid{{isforbid}} tip{{tip}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">{{lunar}}</p></div>';
                        }
                    }
                    html += Mustache.render(template, value);
                } else {
                    // console.log("=======自定义传入=======");
                    // =======自定义传入=======
                    html += Mustache.render(templData, value);
                }
            }

            return html;
        },
        /**
         * 创建DOM元素工厂，将样式固定结构存储起来，外部可通过样式修改
         */
        CreateDOMFactory: function (callback) {
            var self = this;
            // 头部样式
            self.HEADER_BAR = '<div class="em-calendar-container"><div class="em-week">\
							<span class="em-red">日</span>\
							<span>一</span>\
							<span>二</span>\
							<span>三</span>\
							<span>四</span>\
							<span>五</span>\
							<span class="em-red">六</span>\
						</div>';

            self.HEADER = '<div class="swiper-container">\
							<div class="swiper-wrapper">';

            // 底部样式
            self.FOOTER = '</div>\
							</div>\
							</div>';

            // 日历面板容器样式
            self.SLIDER_ITEM_CONTAINER = '<div class="swiper-slide">\
									<div class="em-calendar-content">\
									<div class="em-calendar-wrapper">{{{templ}}}</div>\
								</div></div>';

            var output = self.HEADER_BAR + self.HEADER + self.FOOTER;
            self.container.innerHTML = output;

            // 执行回调
            callback && callback();
        },
        /*
         * JSON数组去重
         * @param: [array] json Array
         * @param: [string] 唯一的key名，根据此键名进行去重
         */
        uniqueArray: function (array, key) {
            var result = [array[0]];
            for(var i = 1; i < array.length; i++) {
                var item = array[i];
                var repeat = false;
                for(var j = 0; j < result.length; j++) {
                    if(item[key] == result[j][key]) {
                        repeat = true;
                        break;
                    }
                }
                if(!repeat) {
                    result.push(item);
                }
            }
            return result;

        },
        /**
         * 增加事件，包括
         * 日历点击的监听
         * 日历左滑、右滑切换，等等
         */
        _addEvent: function () {
            var self = this;
            var onItemClick = self.options.onItemClick;
            var swipeCallback = self.options.swipeCallback;
            var preCallback = self.options.preCallback;
            var nextCallback = self.options.nextCallback;

            // 记录上一月和上一年的索引
            var preMonthIndex = parseInt(self.curMonth) - parseInt(2);;
            var preYearIndex = self.curYear;
            // 记录下一月和下一年的索引
            var nextMonthIndex = parseInt(self.curMonth);
            var nextYearIndex = self.DateObj().getFullYear();
            var nextYear = self.curYear;
            var nextMonth;

            var count = 0;
            var currYearIndex = self.curYear;
            var currMonthIndex = parseInt(self.curMonth);
            var currDayIndex = self.curDay;
            // 创建swiper 组件对象
            self.mySwiper = new Swiper('.swiper-container', {
                loop: false,
                initialSlide: 1,
                speed: 150,
                prevButton: self.options.pre,
                nextButton: self.options.next,
                // 增加监听点击事件
                onClick: function (swiper, e) {
                    // console.log(e.target.innerHTML);
                    // 日期灰色部分不启用
                    var _this = e.target.parentNode;
                    // 日期输出值
                    var dateStr = _this.getAttribute('date');
                    // 农历输出值
                    if(_this.querySelector('.lunar')) {
                        var lunarStr = _this.querySelector('.lunar').innerText.trim();
                    } else {
                        var lunarStr = "已签";
                    }
                    // 可点击区域
                    if(!_this.classList.contains('isforbid0')) {
                        if(_this.getAttribute("date")) {
                            _this.classList.add('em-calendar-active');
                            self.sibling(_this, function (el) {
                                el.classList.remove('em-calendar-active');
                            });
                        }
                    } else {
                        // 不可点击区域
                        if(_this.classList.contains('tipprev')) {
                            // 前进
                            self.slidePrev().then(function () {
                                // 给特定日期新增点击激活样式
                                self.addActiveStyleFordate(dateStr);
                            });
                        } else if(_this.classList.contains('tipnext')) {
                            // 后退
                            self.slideNext().then(function () {
                                // 给特定日期新增点击激活样式
                                self.addActiveStyleFordate(dateStr);
                            });

                        }
                    }
                    // 点击回调
                    onItemClick && onItemClick({
                        date: dateStr, //日期
                        lunar: lunarStr //农历
                    });
                },
                /**
                 * @description 月份递增
                 * @param {Object} swiper swiper对象
                 */
                onSlideNextStart: function (swiper) {
                    count++;
                    if(count == "1") {
                        //alert("等于1，并不能代表是当前月");
                        //alert("传过来的是"+self.nowYear+self.nowMonth);
                        currDayIndex = self.curDay;
                        currMonthIndex = parseInt(self.curMonth);
                    } else {
                        currMonthIndex = currMonthIndex + 1;
                        currDayIndex = "01";

                    }
                    if(currMonthIndex == "13") {
                        currYearIndex = parseInt(currYearIndex) + parseInt(1);
                        currMonthIndex = 1;
                    }
                    // 开启调试模式
                    if(self.options.isDebug) {
                        console.log("currMonthIndex：" + currMonthIndex);
                        console.log("currYearIndex：" + currYearIndex);
                        console.log(">>>>>>" + self.nowYear + "-" + self.nowMonth + "-" + self.nowDay);
                    }
                    //alert("向后回调"+">>>>>>" + currYearIndex + "-" + currMonthIndex + "-" + self.nowDay);
                    //回调
                    swipeCallback && swipeCallback({
                        year: currYearIndex,
                        month: self.tom(currMonthIndex),
                        day: currDayIndex,
                        date: currYearIndex + "-" + self.tom(currMonthIndex) + "-" + currDayIndex,
                        dayCount: self.dayCount
                    });
                    /**
                     * @description 后加
                     */
                    nextMonthIndex += parseInt(1);
                    if(nextMonthIndex == 13) {
                        nextYear = nextYearIndex + 1;
                        nextMonthIndex = 1;
                    }
                    nextMonth = self.tom(nextMonthIndex);

                    if(self.options.isDebug) {
                        console.log("(后)初始化年月日：" + nextYear + "-" + nextMonth + "-" + "01");
                    }

                    self.refreshData({
                        year: nextYear,
                        month: nextMonth,
                        day: "01"
                    }, function (output1) {
                        var outputs = [];
                        outputs.push({
                            templ: output1
                        });
                        // 渲染日历模板
                        var templ = self.SLIDER_ITEM_CONTAINER;
                        var html = "";
                        for(var i = 0; i < outputs.length; i++) {
                            html += Mustache.render(templ, outputs[i]);
                        }
                        swiper.appendSlide(html);
                    });
                    // 如果往后滑动时后一个月非当前月，重新渲染1号样式
                    if(self.tom(currMonthIndex) !== self.curMonth) {
                        var chooseDom = document.querySelector('.swiper-slide-active .em-calendar-active')
                        if(chooseDom) {
                            chooseDom.classList.remove('em-calendar-active')
                        }
                        document.querySelector('.swiper-slide-active .isforbid1').classList.add('em-calendar-active')

                    }

                },
                /**
                 * @description 月份递减
                 * @param {Object} swiper swiper对象
                 */
                onSlidePrevStart: function (swiper) {
                    count--;
                    if(count == "1") {
                        currDayIndex = self.curDay;
                        currMonthIndex = parseInt(self.curMonth);
                    } else {
                        currMonthIndex = parseInt(currMonthIndex) - parseInt(1);
                        currDayIndex = "01";

                    }

                    if(currMonthIndex == 0) {
                        currYearIndex = parseInt(currYearIndex) - parseInt(1);
                        currMonthIndex = 12;
                    }
                    // 开启调试模式
                    if(self.options.isDebug) {
                        console.log("currMonthIndex：" + currMonthIndex);
                        console.log("currYearIndex：" + currYearIndex);
                        console.log("当前" + self.nowYear + "-" + self.nowMonth + "月份");
                    }

                    // 点击回调
                    swipeCallback && swipeCallback({
                        year: currYearIndex,
                        month: self.tom(currMonthIndex),
                        day: currDayIndex,
                        date: currYearIndex + "-" + self.tom(currMonthIndex) + "-" + currDayIndex,
                        dayCount: self.dayCount
                    });

                    if(preMonthIndex == 0) {
                        preYearIndex--;
                        preMonthIndex = 12;
                    }
                    var preMonth = self.tom(preMonthIndex);
                    //console.log("前加：" + preYearIndex + "-" + preMonth + "-" + "01");
                    //ejs.ui.toast("前加：" + preYearIndex + "-" + preMonth + "-" + preDay);

                    preMonthIndex--;
                    // 刷新日历

                    self.refreshData({
                        year: preYearIndex,
                        month: preMonth,
                        day: "01"
                    }, function (output1) {

                        var outputs = [];
                        outputs.push({
                            templ: output1
                        });
                        // 渲染日历模板
                        var templ = self.SLIDER_ITEM_CONTAINER;
                        var html = "";
                        for(var i = 0; i < outputs.length; i++) {
                            html += Mustache.render(templ, outputs[i]);
                        }
                        swiper.prependSlide(html);
                    });

                    // 如果往前滑动时前一个月非当前月，重新渲染1号样式
                    if(self.tom(currMonthIndex) !== self.curMonth) {
                        var chooseDom = document.querySelector('.swiper-slide-active .em-calendar-active')
                        if(chooseDom) {
                            chooseDom.classList.remove('em-calendar-active')
                        }
                        document.querySelector('.swiper-slide-active .isforbid1').classList.add('em-calendar-active')

                    }
                }
            });

            // 回到今天
            if(self._selector(self.options.backToToday)) {
                self._selector(self.options.backToToday).addEventListener("touchstart", function () {
                    // 外部执行回调
                    var curYear = self.DateObj().getFullYear();
                    var curMonth = self.tod(self.DateObj().getMonth() + 1);
                    var curDay = self.tod(self.DateObj().getDate());
                    // 刷新
                    self.refresh();

                });
            }
        },
        /**
         * @description 给特定日期新增选中激活样式
         * @param {Object} dateStr 点击后的日期 ,例如：“2018-08-20”
         */
        addActiveStyleFordate: function (dateStr) {
            var self = this;
            // 给前后月的点击日期加选中标记
            var clickactives = document.querySelector('.swiper-slide-active').querySelectorAll('.em-calendar-item');
            for(var i = 0; i < clickactives.length; i++) {
                if(clickactives[i].getAttribute("date") == dateStr) {
                    clickactives[i].classList.add('em-calendar-active');
                    self.sibling(clickactives[i], function (el) {
                        el.classList.remove('em-calendar-active');
                    });
                }
            }
        },
        /**
         * 向前滑动
         */
        slidePrev: function (options) {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.mySwiper.slidePrev();
                return resolve(options);
            });
        },

        /**
         * 向后滑动
         */
        slideNext: function (options) {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.mySwiper.slideNext();
                return resolve(options);
            });
        },
        /**
         * 外部刷新
         */
        refresh: function (options) {
            var self = this;
            // 销毁
            self.destroySwiper();
            // 创建
            self.initEntry(options);

        },
        /**
         * 销毁swiper
         */
        destroySwiper: function () {
            var self = this;
            // 销毁
            self.mySwiper.destroy(true);
        },

        /**
         * 获取当前农历
         * @param {Object} currentday
         * @param {Object} month
         * @return {String} 
         */
        _getLunar: function (currentday, month, year) {
            var self = this;
            // 中间需默认当前年和当前月，两头需要传年和月
            var yy = year || self.nowYear;
            var mm = month || self.nowMonth;
            var dd = currentday;
            return this._getLunarDay(yy, mm, dd);
        },
        /**
         * 根据年月计算当月的天数
         * @param {Object} y
         * @param {Object} m
         */
        _judgeDaysByYearMonth: function (y, m) {
            var self = this;
            if(y == undefined || y == null) {
                throw "=====获取当前月份天数时，缺少y参数，未定义！=======";
            }
            if(m == undefined || m == null) {
                throw "=====获取当前月份天数时，缺少m参数，未定义！=======";
            }
            var y = parseInt(y);
            var m = parseInt(m);
            if(m == 0) {
                y--;
                m = 12;
            }
            if(m == 2) {
                if((y % 4 == 0 && y % 100 != 0) || (y % 400 == 0)) {
                    return '29';
                } else {
                    return '28';
                }
            } else {
                if(self._inArray(m, [1, 3, 5, 7, 8, 10, 12])) {
                    return '31';
                } else {
                    return '30';
                }
            }

        },

        /**
         * 进行一次全局验证，验证输入的合法性
         * 这个验证是强制性的
         */
        _validate: function () {
            var flag = true;
            if(!this.options.container) {
                flag = false;
            }
            return flag;
        },
        _selector: function (el) {
            // 减少耦合
            return document.querySelector(el);
        },
        /**
         *  判断元素在数组中是否存在
         * @param {Object} str 数字或者字符串元素
         * @param {Object} arr 有效数组
         */
        _inArray: function (str, arr) {
            // 不是数组则抛出异常 
            if(!Array.isArray(arr)) {
                throw "arguments is not Array";
            }
            // 遍历是否在数组中 
            for(var i = 0, k = arr.length; i < k; i++) {
                if(str == arr[i]) {
                    return true;
                }
            }
            // 如果不在数组中就会返回false 
            return false;
        },
        // 遍历查找同级元素
        _sibling: function (elem, forCB) {
            var r = [];
            var n = elem.parentNode.firstChild;
            for(; n; n = n.nextSibling) {
                if(n.nodeType === 1 && n !== elem) {
                    if(forCB && typeof (forCB) == "function") {
                        forCB(n);
                    }
                }
            }
        },
        _getBit: function (m, n) {
            var self = this;
            // 农历转换 
            return(m >> n) & 1;
        },
        _e2c: function () {
            var self = this;
            self.TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
            var total, m, n, k;
            var isEnd = false;
            var tmp = self.TheDate.getYear();
            if(tmp < 1900) {
                tmp += 1900;
            }
            total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + self.madd[self.TheDate.getMonth()] + self.TheDate.getDate() - 38;

            if(self.TheDate.getYear() % 4 == 0 && self.TheDate.getMonth() > 1) {
                total++;
            }
            for(m = 0;; m++) {
                k = (self.CalendarData[m] < 0xfff) ? 11 : 12;
                for(n = k; n >= 0; n--) {
                    if(total <= 29 + self._getBit(self.CalendarData[m], n)) {
                        isEnd = true;
                        break;
                    }
                    total = total - 29 - self._getBit(self.CalendarData[m], n);
                }
                if(isEnd) break;
            }
            self.cYear = 1921 + m;
            self.cMonth = k - n + 1;
            self.cDay = total;
            if(k == 12) {
                if(self.cMonth == Math.floor(self.CalendarData[m] / 0x10000) + 1) {
                    self.cMonth = 1 - self.cMonth;
                }
                if(self.cMonth > Math.floor(self.CalendarData[m] / 0x10000) + 1) {
                    self.cMonth--;
                }
            }

        },

        _getcDateString: function () {
            var self = this;
            var tmp = "";
            /*显示农历年：（ 如：甲午(马)年 ）*/
            if(self.cMonth < 1) {
                // tmp += "(闰)";
                // tmp += self.monString.charAt(-self.cMonth - 1);
            } else {
                // tmp += self.monString.charAt(self.cMonth - 1);
            }
            //tmp += "月";
            tmp += (self.cDay < 11) ? "初" : ((self.cDay < 20) ? "十" : ((self.cDay < 30) ? "廿" : "三十"));
            if(self.cDay % 10 != 0 || self.cDay == 10) {
                tmp += self.numString.charAt((self.cDay - 1) % 10);
            }
            return tmp;

        },
        _getLunarDay: function (solarYear, solarMonth, solarDay) {
            var self = this;
            //solarYear = solarYear<1900?(1900+solarYear):solarYear; 
            if(solarYear < 1921 || solarYear > 2080) {
                return "";
            } else {
                solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
                self._e2c(solarYear, solarMonth, solarDay);
                return self._getcDateString();
            }

        },
        /**
         * 将1,2,3,4,5格式化01,02,03,04,05
         * @param {Object} m 月份转换
         */
        tom: function (m) {
            if(parseInt(m) > 9) {
                m = "" + parseInt(m);
            } else {
                m = "0" + parseInt(m);
            }
            return m;
        },
        /**
         * 将1,2,3,4,5格式化01,02,03,04,05
         * @param {Object} 日转换
         */
        tod: function (d) {
            if(parseInt(d) > 9) {
                d = "" + parseInt(d);
            } else {
                d = "0" + parseInt(d);
            }
            return d;
        },
        /**
         * 获取小时、分钟、秒    例如：18:09:00
         * @param {Object} format hh:mm 输出00:00  hh:mm:ss 输出00:00:00
         */
        getTime: function (format) {
            var self = this;
            var hh = self.DateObj().getHours();
            var mm = self.DateObj().getMinutes();
            var ss = self.DateObj().getSeconds();
            var timeStr = "";
            if("hh:mm" == format) {
                timeStr += hh + ":" + mm;
            } else if("hh:mm:ss" == format) {
                timeStr += hh + ":" + mm + ":" + ss;
            }
            return timeStr;
        },
        /**
         * 获取对象
         */
        DateObj: function (dateStr) {
            var dateObj;
            if(!dateStr) {
                //throw("请输入合法日期格式！"+str);
                dateObj = new Date();
            } else {
                // 注意：须先把时间戳(122891289)转成字符串然后进行查找
                var index = dateStr.toString().indexOf('-');
                if(index == "-1") {
                    // 解析时间戳
                    dateObj = new Date(dateStr);
                } else {
                    // 解析正常格式时间戳，切记不要直接传  new Date 2017-09-09 19:00:00，
                    dateObj = new Date(dateStr.replace(/-/g, '/'));
                }
            }
            return dateObj;
        },
        /**
         * @description 获取某个元素的所有兄弟节点;这里还是建议使用库来实现 ，喜欢深究的可以参考下面代码（原理类似Zepto,jquery 的silbling()方法）。
         * @param {Object} elem  选中的当前节点
         * @param {Function} forCB  遍历回调每个兄弟节点
         * 用法如下：
         */
        sibling: function (elem, forCB) {
            var r = [];
            var n = elem.parentNode.firstChild;
            for(; n; n = n.nextSibling) {
                if(n.nodeType === 1 && n !== elem) {
                    if(forCB && typeof (forCB) == "function") {
                        forCB(n);
                    }
                }
            }
        },

    };

    window.Calendar = Calendar;
})();