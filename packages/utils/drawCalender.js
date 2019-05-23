import {cusGetStamp,cusParseTime} from "./timeProcessing";

export function cusDrawCalender(year,month,num=72){
    let cusCalenderTitle=[],cusCalenderBody=[];
    let prevDate =[];
    let cusCalenderID =[];
    for(let i=0;i<=num;i++){
        let str='';
        if(prevDate.length==2){
            str=parseInt(prevDate[1])-1<1?(parseInt(prevDate[0])-1)+'-'+12:prevDate[0]+'-'+(parseInt(prevDate[1])-1);
        }else{
            str=year+'-'+month;
        }
        prevDate=str.split('-');
        cusCalenderID.unshift(String(prevDate[0])+'-'+String(prevDate[1]));
        cusCalenderTitle.unshift(prevDate[0]+'年'+prevDate[1]+'月');
        cusCalenderBody.unshift(cusDisplayCalender(prevDate[0],prevDate[1]));
    }
    return {
        cusDisplayCalender:cusCalenderBody,
        cusCalenderTitle:cusCalenderTitle,
        cusCalenderID:cusCalenderID
    }
};

function cusDisplayCalender(year,month){
    //画日历
    let temp_interval=0,calender_day=[];
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        temp_interval = 1;
    }
    let hasDays = [31, 28+temp_interval, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    //获取当月第一天是星期几
    let $first_day =  new Date(year, (month-1), 1).getDay();
    //获取当月最后一天是星期几
    let $last_day = 6 - (new Date(year, (month), 0).getDay());
    if($first_day>0){
        for(let i=0;i<$first_day;i++){
            let obj={
                type:'disabled',
                classname:false,
                cont:'',
                format: year+'-'+month,
                notAllow:true
            };
            calender_day.push(obj)
        }
    }
    for (let i = 0; i < hasDays[month-1]; i++) {
        let obj = {
            type: "normal",
            classname:true,
            cont: i + 1,
            notAllow:false
        };
        let tempDate = year+'-'+month+'-'+(i+1);
        tempDate=tempDate.replace(/-/g, "/");
        tempDate = new Date(tempDate);
        tempDate = cusParseTime(tempDate, '{y}-{m}-{d}');
        obj.format=tempDate;
        calender_day.push(obj);
    }
    if($last_day>0){
        for(let i=0;i<$last_day;i++){
            let obj={
                type:'disabled',
                classname:false,
                cont:'',
                format: year+'-'+month,
                notAllow:true
            };
            calender_day.push(obj)
        }
    }
    if(calender_day.length<42){
        for(let i=0;i<42-calender_day.length;i++){
            let obj={
                type:'disabled',
                classname:false,
                cont:'',
                format: year+'-'+month,
                notAllow:true
            };
            calender_day.push(obj)
        }
    }
    return calender_day
};

function isDisabledTime(time) {
    return new Date(time).getTime()>new Date().getTime();
}
