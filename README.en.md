cusDatePicker
基于Vue的时间选择器插件

# main.js
import cusDatePicker from 'cusDatePicker'
Vue.use(cusDatePicker)
在项目中使用 cusDatePicker

<template>
  <cusDatePicker></cusDatePicker>
</template>

1.快捷键

默认包含今天，昨天，过去7天，过去14天，过去28天，过去30天，可以自定义选择快捷键
```
绑定的属性值：OriginQuicky   Array 快捷键事件为：cusSetQuickDate
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

根据点击日期的位置，智能判断选择时间范围（日期面板点击2次为一个周期，分别对应开始时间和结束时间，当结束时间小于开始时间的时候自动对掉）

选择对比时间段

```
    绑定的属性值：is_compared:true/false
    默认是false，不选择对比时间
```

需要选择进行对比，然后可以选择快捷键时间范围对比

is_compared==true&&选择快捷键，默认对比时选择对比时间对比上一个时间段范围

1.涉及到的参数
cusCompareShow 是否显示对比日期相关
is_compared  是否进行对比

原始日期段参数：originDate，Array ，[开始时间，结束时间]
对比日期段参数：CompareDate，Array ，[开始时间，结束时间]

