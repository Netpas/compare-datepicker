cusDatePicker
Vue - based date picker plug-in

1.Install：
npm install compare-date-picker@ --save

2.Import
global
main.js
```
import compareDatePicker from 'compare-date-picker'
Vue.use(compareDatePicker)
```

part
```
import compareDatePicker from 'compare-date-picker'
components:{
    compareDatePicker
}
```

3.Use

<template>
  <cusDatePicker :originDate="" :compareDate=""></cusDatePicker>
</template>

1.Shortcuts

The default includes today, yesterday, the past 7 days, the past 14 days, the past 28 days, and the past 30 days, and you can
customize the shortcut.

props | type |event |describe
--|--|--|--|
 OriginQuicky|Array|cusSetQuickDate|Custom shortcut, the default shortcut will be overwritten

```
example：
 [
    {
        label:'the past 7 days',
        callback(picker) {
            picker.$emit('cusSetQuickDate',[new Date(new Date().setHours(0,0,0,0)).getTime()-8*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()-24*60*60*1000])
        }
    }
 ]
```

1.Customize date range

Select the date range according to the location of the click date


2.Whether to display a comparison date

props | type |default |describe
 --|--|--|--|
 cusCompareShow|boolean| true| Whether to display a comparable function
 is_compared | boolean | false | Whether to open the comparison period

You need to select for comparison, and then you can select the shortcut date range comparison

is_compared==true&&shortcut，The default comparison time is selected to compare the range of the previous time period

3.props

props | type |default |describe
 --|--|--|--|
 originDate|Array| [new Date(new Date().setHours(0,0,0,0)).getTime() - 7*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()]| It means start time and end time of the comparison ,can be set
 compareDate | Array | [] | It means start time and end time of the comparison ,cannot be set
 divider | Stirng | / | The dividing line between a start date and an end date
 weekName | Array | ["日","一","二","三","四","五","六"] |The first must be Sunday and can be changed to other week display

4.event

event | type  |describe
 --|--|--|--|
change| function|Select the function to execute after the date is completed