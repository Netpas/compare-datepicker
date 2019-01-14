cusDatePicker
基于Vue的时间选择器插件

1.安装：


2.引入
全局引入main.js
```
import compareDatePicker from 'compareDatePicker'
Vue.use(compareDatePicker)
```

部分引入
```
import compareDatePicker from 'compareDatePicker'
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

1.自定义时间范围

根据点击日期的位置，智能判断选择时间范围


2.是否显示对比日期

参数 | 类型 |默认值 |描述
 --|--|--|--|
 cusCompareShow|boolean| true| 是否显示可对比功能
 is_compared | boolean | false | 是否打开对比时间段

需要选择进行对比，然后可以选择快捷键时间范围对比

is_compared==true&&选择快捷键，默认对比时选择对比时间对比上一个时间段范围

3.涉及到的参数

参数 | 类型 |默认值 |描述
 --|--|--|--|
 originDate|Array| [new Date(new Date().setHours(0,0,0,0)).getTime() - 7*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()]| 原始开始时间和结束时间，可设置
 compareDate | Array | [] | 对比的开始时间和结束时间，不可设置