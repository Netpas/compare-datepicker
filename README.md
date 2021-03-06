DatePicker
基于Vue的时间选择器插件

1.安装：
npm install compare-date-picker --save

2.引入
全局引入main.js
```
import compareDatePicker from 'compare-date-picker'
import 'compare-date-picker/dist/compareDatePicker.css'
Vue.use(compareDatePicker)
```

部分引入
```
import compareDatePicker from 'compare-date-picker'
import 'compare-date-picker/dist/compareDatePicker.css'
components:{
    compareDatePicker
}
```

3.使用

<template>
  <cusDatePicker></cusDatePicker>
</template>

1.快捷键

默认包含今天，昨天，过去7天，过去14天，过去28天，过去30天，可以自定义选择快捷键

参数 | 类型 |事件 |描述
--|--|--|--|
 OriginQuicky|Array|cusSetQuickDate|自定义快捷键，默认的快捷键会被覆盖

```
用法示例：
 [
    {
        label:'过去7天',
        callback(picker) {
            picker.$emit('cusSetQuickDate',[new Date(new Date().setHours(0,0,0,0)).getTime()-8*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()-24*60*60*1000])
        }
    }
 ]
```
1.新增功能：可设置不可选区间

参数 | 类型 |默认值 |描述
 --|--|--|--|
 disabledDate|Array| [,new Date().getTime()]| 意味着大于今天的日期为不可选日期

 参数为长度是2的数组，表示最小值以及最大值，小与最小值的以及大于最大值的为不可选，如果不需要设置最小值，第一位为空，如果不需要设置最大值，第二位为空

1.自定义时间范围

根据点击日期的位置，智能判断选择时间范围


2.是否显示对比日期

参数 | 类型 |默认值 |描述
 --|--|--|--|
 cusCompareShow|boolean| true| 是否显示可对比功能

需要选择进行对比，然后可以选择快捷键时间范围对比

3.涉及到的参数

参数 | 类型 |默认值 |描述
 --|--|--|--|
 originDate|Array| [new Date(new Date().setHours(0,0,0,0)).getTime() - 7*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()]| 原始开始时间和结束时间，可设置
 compareDate | Array | [] | 对比的开始时间和结束时间，不可设置
 divider | Stirng | / | 开始日期和结束日期分界线
 weekName | Array | ["日","一","二","三","四","五","六"] |第一位必须是周日，可以修改为其他星期显示形式

4.事件

事件 | 类型  |描述
 --|--|--|
change| function|选择日期完成之后执行的函数