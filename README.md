---
title: 移动日历组件
date: 2018-04-08 19:16:59
tags: 移动日历组件
categories: 移动日历
copyright: true

---
# <font color="#F68736" face="微软雅黑">移动日历组件</font>

文档维护者：`sunzl`

## 适用场景

- 该组件目前仅适用于移动端H5页面展示，后期高级用法中会讲述到如何基于日历基类实现自定义模板传入。（即：开发者只需要传入自己的模板即可实现出自己的优美的日历出来。） `本篇主要是带大家入门日历组件的使用，该文档后面会持续优化更新。若有不足，请大家多多指教，作者会及时更正！`


## 实例展示
![](http://app.epoint.com.cn/test/H5/epointmobileWiKi/assets/005/20180408-1d1fec76.gif)  


- [日历示例演示，支持滑动屏幕左右切换等效果](http://app.epoint.com.cn/test/H5/Attaches/%E6%97%A5%E5%8E%86%E7%BB%84%E4%BB%B6/calendar_showcase/calendar_showcase.html) ` 注：按F12可在浏览器预览`

- 示例demo源代码(H5)：[点击此处进行下载](https://github.com/sunzunlu/MobileCalendar)


## 典型项目应用案例

- 【移动OA类】 我的日程
- 【招投标类】 开标日程

## 依赖资源

- `libs/calendar_base.js` 日历组件基类js库
- `libs/calendar_base.css` 日历组件基类css库，根据业务需求，可以任意个性化，从而达到设计视觉效果

## 配置和使用方法

__DOM结构__

一个`div`即可

```html
<div id="calendar"></div>
```

__初始化__

以下代码是最简单的用法，更多复杂用法请参考`calendar_showcase`[源码下载](http://app.epoint.com.cn/test/H5/Attaches/日历组件/calendar_showcase.zip)

```js
var calendar = new Calendar({
    // 日历容器
    container: "#calendar",
    // 点击日期事件
    onItemClick: function(item) {
        var defaultDate = item.date;
    }
});
```

__参数说明__

| 参数 | 参数类型  | 说明  |
| :------------- |:-------------:|:-------------|
| container | string或HTMLElement | `必选` Calendar容器的css选择器，例如“#calendar”。默认为`#calendar` |
| pre |   string或HTMLElement  | `可选` 前一个月按钮的css选择器或HTML元素。默认`.pre`  |
| next |  string或HTMLElement  | `可选`后一个月按钮的css选择器或HTML元素。默认`.next`  |
| backToToday | string或HTMLElement | `可选` 返回今天按钮的css选择器或HTML元素。默认`.backToToday`  |
| dataRequest | Function | `可选` 回调函数，绑定业务数据。例如：某天有日程，则会在对应日期上标识出一个小红点或者其他标识，默认传入数据格式：data=`[{"date":"2018-04-18"},{"date":"2018-04-17"},{"date":"2018-04-16"}]`  |
| onItemClick | Function | `必选` 回调函数，当你点击或轻触某日期 300ms后执行。回调日期结果：`2018-04-07` |
| swipeCallback | Function | `可选` 回调函数，滑块释放时如果触发slider向后(左、上)切换则执行  |
| template | Function或String | `可选`，元素渲染的模板，可以是一个模板字符串，也可以是一个函数，为函数时，确保返回模板字符串，默认组件内置模板 |
| isDebug | Boolean | `可选`是否开启调试模式，默认`false` |


# API

生成的`calendar`对象可以调用如下API

```js
var calendar = new Calendar(...);
```

### refresh()

会销毁清空日历容器中的数据重新进行渲染。默认传入参数为空，刷新当前月份的日历数据。

```js
calendar.refresh();
```

同时也可以手动传入某个日期渲染日历数据，例如：渲染出`2020-08-08`的日历如下：

```js
calendar.refresh({
    year: "2020",
    month: "08",
    day: "08"
});
```
__参数说明__

| 参数 | 参数类型  | 说明  |
| :------------- |:-------------:|:-------------|
| {} | object | `必选` 日期对象必须传入以下格式：{year:"2018",month:"04",day:"08"}  |


### refreshData()

会获取整个月的日历数据（`6 * 7 = 42`方格的日期），可根据该API自行个性化开发自己的日历组件，例如：
```js
calendar.refreshData({
    year: "2018",
    month: "04",
    day: "08"
},
function(output, data) {
    console.log("==某个月的日历渲染数据：==" + JSON.stringify(data));
    console.log("==组件自带模板==" + output);
});

```
`输出日历数据格式：`
```js
[{"day":25,"lunar":"初九","date":"2018-03-25","isforbid":"0"}]
```

`输出内置组件模板格式：`
```html
<div class="em-calendar-item  isforbid0"date="2018-03-25"><span class="day">25</span><p class="lunar">初九</p></div>
```

## 资料
- [参考](https://sunzunlu.github.io/2018/04/08/20180408-%E7%A7%BB%E5%8A%A8%E7%AB%AFH5%E6%97%A5%E5%8E%86%E7%BB%84%E4%BB%B6/) 
