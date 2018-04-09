/**
 * 作者： 孙尊路
 * 创建时间： 2018/04/07 13:27:09
 * 版本： [1.0, 2018/04/07]
 * 描述： 通用日期类处理函数
 * 方法：
 * （1）DateUtil.DateObj(); 实例化日期
 * （2）DateUtil.getDate(); 获取日期，返回格式 （yyyy-mm-dd）（年月日）
 * （3）DateUtil.getTime();获取时间，例如：hh:mm 输出00:00  hh:mm:ss 输出00:00:00
 * （4）DateUtil.getNextHour();获取下一个小时
 * （5）DateUtil.tod("09"); 月份日期两位数显示，例如："9"->"09"
 */

"use strict";

(function(exports) {
	var DateUtil = {
		/**
		 * 获取对象
		 */
		DateObj: function(dateStr) {
			var dateObj;
			if(!dateStr) {
				//throw("请输入合法日期格式！"+str);
				dateObj = new Date();
			} else {
				//不要直接传  new Date 2017-09-09 19:00:00，
				dateObj = new Date(dateStr.replace(/-/g, '/'));
			}
			return dateObj;
		},
		/**
		 * 获取日期
		 * format 返回格式 （yyyy-mm-dd）（年月日）
		 * 例如：输出 2017-09-09 （yyyy-mm-dd）   2017年08月09日（年月日）
		 */
		getDate: function(str, format) {
			var dateStr = '';

			// 初始化当前日期
			var yyyy = this.DateObj(str).getFullYear();
			var mm = this.DateObj(str).getMonth() + 1;
			var dd = this.DateObj(str).getDate();
			if("yyyy-mm-dd" == format) {
				dateStr += yyyy + "-" + this.tod(mm) + "-" + this.tod(dd);
			} else if("年月日" == format) {
				dateStr += yyyy + "年" + this.tod(mm) + "月" + this.tod(dd) + "日";
			}
			return dateStr;
		},
		/**
		 * 获取小时、分钟、秒    例如：18:09:00
		 * @param {Object} format  hh:mm  mm:ss  hh:mm:ss
		 * 例如：hh:mm 输出00:00  hh:mm:ss 输出00:00:00
		 */
		getTime: function(dateStr, format) {
			var timeStr = "";

			var hh = this.DateObj(dateStr).getHours();
			var mm = this.DateObj(dateStr).getMinutes();
			var ss = this.DateObj(dateStr).getSeconds();

			if("hh:mm" == format) {
				timeStr += this.tod(hh) + ":" + this.tod(mm);
			} else if("mm:ss" == format) {
				timeStr += this.tod(mm) + ":" + this.tod(ss);
			} else if("hh:mm:ss" == format) {
				timeStr += this.tod(hh) + ":" + this.tod(mm) + ":" + this.tod(ss);
			}
			return timeStr;
		},
		/**
		 * 获取当前下一个小时
		 */
		getNextHour: function(dateStr) {
			var tm = Date.parse(this.DateObj(dateStr)) + (1 * 3600 * 1000);
			console.log(new Date(parseInt(tm)));
			var pre = this.getDate(parseInt(tm), "年月日");
			var next = this.getTime(parseInt(tm), "hh:mm");
			return pre + " " + next;
		},
		/**
		 * 将1,2,3,4,5格式化01,02,03,04,05
		 * @param {Object} m 月份 d日 转换
		 */
		tod: function(str) {
			if(parseInt(str) > 9) {
				str = "" + parseInt(str);
			} else {
				str = "0" + parseInt(str);
			}
			return str;
		}

	};

	exports.DateUtil = DateUtil;

})(this);
