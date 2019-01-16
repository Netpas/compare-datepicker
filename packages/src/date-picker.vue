<template>
  <div class="cus-calender-wrapper" :class="{is_compare_show:is_compare}">
    <div class="cus-show-calender">
      <div class="cus-origin-date" @click="calender_show=true">
        <input type="text" v-model="origin_Date[0]" @keyup.enter="cusChooseDate(0)" id="cusOriginStartDate" ref="origin_start_Date" @focus="getFocus(0)" autocomplete="off"/>
        <i>{{divider}}</i>
        <input type="text" v-model="origin_Date[1]" @keyup.enter="cusChooseDate(1)" id="cusOriginEndDate" ref="origin_end_Date" @focus="getFocus(1)"  autocomplete="off"/>
      </div>
      <div class="cus-compare-date" v-if="is_compare" @click="calender_show=true">
        <span v-if="is_compare">对比</span>
        <input type="text" v-model="compare_Date[0]" id="cusCompareStartDate" ref="compare_start_Date" readonly/>
        <i>{{divider}}</i>
        <input type="text" v-model="compare_Date[1]" id="cusCompareEndDate" ref="compare_end_Date" readonly/>
      </div>
    </div>
    <div class="cus-panel-modal" :class="{is_calender_show:calender_show}" @click="calender_show=false">
    </div>
    <div class="cus-calender-panel cus-clearFix" :class="{is_calender_show:calender_show,is_calender_show_right:is_calender_show_right}">
      <div class="cus-clearFix">
        <div class="cus-calender-panel-header">
          <h4 class="cus-clearFix">选择时间范围
            <span @click="cusQuickyShow=!cusQuickyShow;">自定义
              <i @click.native="cusQuickyShow=!cusQuickyShow;" :class="{'cus-triangle-top':cusQuickyShow,'cus-triangle-bottom':!cusQuickyShow}"></i>
            </span>
          </h4>
          <cusDateQuicky :cusQuickyShow="cusQuickyShow" :OriginQuicky="OriginQuicky" :is_compare="is_compare" :CompareQuicky="CompareQuicky" @cusSetQuickDate="cusSetQuickDate" @cusGetSelectDate="cusGetSelectDate"></cusDateQuicky>
        </div>
        <div class="cus-panel-origin-body cus-clearFix" @click="cusQuickyShow=false;">
          <cusCalender
                  :weekName="weekName"
                  :cusTitle="cusCalenderTitle"
                  :cusCalender="cusDisplayCalender"
                  :is_active="is_origin_active"
                  :is_start_active="is_start_active"
                  :is_end_active="is_end_active"
                  :cusScrollTable="cusOriginScrollTable"
                  :cusCalenderID="cusOriginCalenderID"
                  @cusSrcollTab="cusOriginSrcollTab"
                  @cusClickTime="cusClickOriginTime"></cusCalender>
        </div>
        <div class="cus-panel-compare-body cus-clearFix" v-if="is_compare" @click="cusQuickyShow=false;">
          <cusCalender
                  :weekName="weekName"
                  :cusTitle="cusComCalenderTitle"
                  :cusCalender="cusComDisplayCalender"
                  :is_active="is_compare_active"
                  :is_start_active="is_com_start_active"
                  :is_end_active="is_com_end_active"
                  :cusScrollTable="cusCompareScrollTable"
                  :cusCalenderID="cusCompareCalenderID"
                  @cusSrcollTab="cusCompareSrcollTab"></cusCalender>
        </div>
        <div class="cus-panel-footer cus-clearFix" @click="cusQuickyShow=false;">
          <button v-if="cusCompareShow" @click="cusChangeCompare"><span v-if="!is_compare">对比其他时间</span><span v-else>取消对比</span></button>
          <button @click="cusApplyDate">应用</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import {cusDrawCalender} from '../utils/drawCalender'
    import {cusGetStamp,cusParseTime} from '../utils/timeProcessing'
    import {cusCalender,cusDateQuicky} from './component/index'
    export default {
        name: 'compareDatePicker',
        components:{cusCalender,cusDateQuicky},
        mounted(){
            this.cusReloadCalender(cusParseTime(new Date(),'{y}'),cusParseTime(new Date(),'{m}'));
            this.cusReloadComCalender(cusParseTime(new Date(),'{y}'),cusParseTime(new Date(),'{m}'));
        },
        data(){
            return{
                cusCalenderTitle:'',
                cusDisplayCalender:[],
                cusComCalenderTitle:'',
                cusComDisplayCalender:[],
                is_compare:false,
                origin_Date:[cusParseTime(Number(this.originDate[0])),cusParseTime(Number(this.originDate[1]))],
                is_origin_active:{},
                is_compare_active:{},
                is_start_active:{},
                is_com_start_active:{},
                is_end_active:[],
                is_com_end_active:[],
                cusOriginCalenderID:[],
                cusCompareCalenderID:[],
                cusOriginScrollTable:'cusOriginScrollTable',
                cusCompareScrollTable:'cusCompareScrollTable',
                compare_Date:this.compareDate,
                cusChooseCompareData:'last_time_period',
                start_cycle:0,
                calender_show:false,
                cusQuickyShow:false,
                is_calender_show_right:false,
                CompareQuicky:[
                    {
                        label:'对比上一个时间段',
                        value:'last_time_period',
                        onClick(pick){
                            pick.$emit('cusGetSelectDate','last_time_period');
                        }
                    },{
                        label:'对比一周前',
                        value:'last_week_ago',
                        onClick(pick){
                            pick.$emit('cusGetSelectDate','last_week_ago');
                        }
                    },{
                        label:'对比30天前',
                        value:'last_month_ago',
                        onClick(pick){
                            pick.$emit('cusGetSelectDate','last_month_ago');
                        }
                    },{
                        label:'对比三个月前',
                        value:'three_months_ago',
                        onClick(pick){
                            pick.$emit('cusGetSelectDate','three_months_ago');
                        }
                    },{
                        label:'对比半年前',
                        value:'half_a_year_ago',
                        onClick(pick){
                            pick.$emit('cusGetSelectDate','half_a_year_ago');
                        }
                    },{
                        label:'对比一年前',
                        value:'a_year_ago',
                        onClick(pick){
                            pick.$emit('cusGetSelectDate','a_year_ago');
                        }
                    }
                ]
            }
        },
        watch:{
            originDate:{
                handler: function(newer, older){
                    this.origin_Date=[cusParseTime(Number(newer[0])),cusParseTime(Number(newer[1]))];
                    this.cusSelectedTime();
                },
                deep:true
            },
            compareDate:{
                handler: function(newer, older){
                    this.compare_Date=[cusParseTime(Number(newer[0])),cusParseTime(Number(newer[1]))];
                },
                deep:true
            },
            start_cycle(m){
                if(m==1){
                    this.$refs.origin_end_Date.focus();
                }else{
                    this.$refs.origin_start_Date.focus();
                }
            },
            calender_show(m){
                if(m){
                    if(document.getElementsByClassName('cus-calender-wrapper')){
                        let tempdiv=document.getElementsByClassName('cus-calender-wrapper')[0];
                        let bodyWidth=document.documentElement.clientWidth||document.body.offsetWidth;
                        let divWidth=tempdiv.offsetWidth;
                        if(bodyWidth-tempdiv.offsetLeft-divWidth<300){
                            this.is_calender_show_right=true;
                        }
                    }
                    this.cusPageScroll('origin',this.originDate[1],this.cusOriginCalenderID,this.cusOriginScrollTable)
                }
            },
        },
        props:{
            divider:{
                type:String,
                default:'/'
            },
            cusCompareShow:{
                type:Boolean,
                default:true
            },
            OriginQuicky:{
                type:Array,
                default:function(){
                    return [
                        {
                            label:'过去7天',
                            callback(picker) {
                                picker.$emit('cusSetQuickDate',[new Date(new Date().setHours(0,0,0,0)).getTime()-8*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()-24*60*60*1000])
                            }
                        },
                        {
                            label:'过去14天',
                            callback(picker) {
                                picker.$emit('cusSetQuickDate',[new Date(new Date().setHours(0,0,0,0)).getTime()-15*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()-24*60*60*1000])
                            }
                        },
                        {
                            label:'过去28天',
                            callback(picker) {
                                picker.$emit('cusSetQuickDate',[new Date(new Date().setHours(0,0,0,0)).getTime()-29*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()-24*60*60*1000])
                            }
                        },
                        {
                            label:'过去30天',
                            callback(picker) {
                                picker.$emit('cusSetQuickDate',[new Date(new Date().setHours(0,0,0,0)).getTime()-31*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()-24*60*60*1000])
                            }
                        },
                        {
                            label:'今天',
                            callback(picker) {
                                picker.$emit('cusSetQuickDate',[new Date().getTime(),new Date().getTime()]);
                            }
                        },
                        {
                            label:'昨天',
                            callback(picker) {
                                picker.$emit('cusSetQuickDate',[new Date(new Date().setHours(0,0,0,0)).getTime()-24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()-24*60*60*1000])
                            }
                        }
                    ]
                }
            },
            compareDate:{
                type:Array,
                default:function(){
                    return []
                }
            },
            originDate:{
                type:Array,
                default:function(){
                    return [new Date(new Date().setHours(0,0,0,0)).getTime() - 7*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()]
                }
            },
            weekName:{
                type:Array,
                default:function(){
                    return ["日","一","二","三","四","五","六"]
                }
            }
        },
        methods:{
            cusApplyDate(){
                this.calender_show=false;
                this.$emit('change');
            },
            cusOriginSrcollTab(){
                if(document.getElementById(this.cusOriginScrollTable).scrollTop<=10){
                    this.cusReloadCalender(cusParseTime(new Date(),'{y}'),cusParseTime(new Date(),'{m}'),true);
                }
            },
            cusCompareSrcollTab($top){
                if(document.getElementById(this.cusCompareScrollTable).scrollTop<=10){
                    this.cusReloadComCalender(cusParseTime(new Date(),'{y}'),cusParseTime(new Date(),'{m}'),true);
                }
            },
            cusChooseDate(num){
                if(String(this.origin_Date[num]).replace(/[^0-9]/ig,"").length==8){
                    this.origin_Date[num]=String(this.origin_Date[num]).replace(/[^0-9]/ig,"");
                    this.origin_Date[num]=this.origin_Date[num].slice(0,4)+'-'+this.origin_Date[num].slice(4,6)+'-'+this.origin_Date[num].slice(6,8);
                }else{
                    let str=this.origin_Date[num];
                    for(let i=0;i< str.length;i++){
                        if(isNaN(str[i])){
                            let temp= str[i];
                            str=str.replace(temp,'-');
                        }
                    }
                    this.origin_Date[num]=str;
                    if(this.origin_Date[num][this.origin_Date[num].length-1]=='-'){
                        this.origin_Date[num]=this.origin_Date[num].slice(0,this.origin_Date[num].length);
                    }
                }
                if(cusGetStamp(new Date(this.origin_Date[num]))>cusGetStamp(new Date())){
                    this.origin_Date[num]=cusParseTime(Number(this.originDate[num]),'{y}-{m}-{d}');
                    return false;
                }
                this.setOriginDate(cusGetStamp(this.origin_Date[num]),num);
                this.start_cycle=num++;
                if(this.start_cycle>=2){
                    this.start_cycle=0;
                }

            },
            cusSetQuickDate(date){
                this.cusQuickyShow=false;
                if(String(date)){
                    date=String(date).split(',');
                }
                this.setOriginDate([Number(date[0]),Number(date[1])]);
            },
            cusClickOriginTime(type,date,notAllow){
                if(type=='normal'&&!notAllow){
                    if(this.start_cycle>=2){
                        this.start_cycle=0;
                    }
                    this.setOriginDate(date,this.start_cycle,true);
                    this.cusSelectedTime();
                }
            },
            cusSelectedTime(){
                this.is_origin_active={};
                this.is_compare_active={};
                this.is_start_active={};
                this.is_com_start_active={};
                this.is_end_active={};
                this.is_com_end_active={};
                for(let i=0;i<this.cusDisplayCalender.length;i++) {
                    let tempCalender=this.cusDisplayCalender[i];
                    for(let j=0;j<tempCalender.length;j++){
                        let tempDate = cusGetStamp(tempCalender[j].format);
                        if (cusParseTime(Number(tempDate),'{y}{m}{d}') == cusParseTime(Number(this.originDate[0]),'{y}{m}{d}')) {
                            this.is_start_active[tempCalender[j].format] = true;
                        }
                        if (cusParseTime(Number(tempDate),'{y}{m}{d}') == cusParseTime(Number(this.originDate[1]),'{y}{m}{d}')) {
                            this.is_end_active[tempCalender[j].format] = true;
                        }
                        if (cusParseTime(Number(tempDate),'{y}{m}{d}') >= cusParseTime(Number(this.originDate[0]),'{y}{m}{d}') && cusParseTime(Number(tempDate),'{y}{m}{d}') <= cusParseTime(Number(this.originDate[1]),'{y}{m}{d}') && tempCalender[j].type == 'normal') {
                            this.is_origin_active[tempCalender[j].format] = true;
                        }
                    }
                }
                if (this.is_compare&&this.compareDate&&this.compareDate[0] && this.compareDate[1]) {
                    for(let i=0;i<this.cusComDisplayCalender.length;i++) {
                        let tempCalender=this.cusComDisplayCalender[i];
                        for(let j=0;j<tempCalender.length;j++){
                            let tempDate = cusGetStamp(tempCalender[j].format);
                            if (cusParseTime(Number(tempDate),'{y}{m}{d}') == cusParseTime(Number(this.compareDate[0]),'{y}{m}{d}')) {
                                this.is_com_start_active[tempCalender[j].format] = true;
                            }
                            if (cusParseTime(Number(tempDate),'{y}{m}{d}') == cusParseTime(Number(this.compareDate[1]),'{y}{m}{d}')) {
                                this.is_com_end_active[tempCalender[j].format] = true;
                            }
                            if (cusParseTime(Number(tempDate),'{y}{m}{d}') >= cusParseTime(Number(this.compareDate[0]),'{y}{m}{d}') && (cusParseTime(Number(tempDate),'{y}{m}{d}') <= cusParseTime(Number(this.compareDate[1]),'{y}{m}{d}')) && tempCalender[j].type == 'normal') {
                                this.is_compare_active[tempCalender[j].format] = true;
                            }
                        }
                    }
                }
            },
            cusPageScroll(str,date,$topid=[],$scrollid){
                let tempNum=0;
                this.$nextTick(() => {
                    for(let i=0;i<$topid.length;i++){
                        if($topid[i].split('-')[1]<10){
                            $topid[i]=$topid[i].split('-')[0]+'-0'+Number($topid[i].split('-')[1]);
                        }
                        if(str+cusParseTime(Number(date),'{y}-{m}')==$topid[i]){
                            tempNum=i;
                            break;
                        }
                    }
                    if(document.getElementById($topid[tempNum])){
                        let tempTableTop=document.getElementById($topid[tempNum]).offsetTop;
                        let tempTable=document.getElementById($scrollid).getElementsByTagName('table')[tempNum];
                        let tempSpan=tempTable.getElementsByTagName('span');
                        let temp=0;
                        for(let i=0;i<tempSpan.length;i++){
                            if(cusParseTime(Number(date),'{y}-{m}-{d}')==tempSpan[i].getAttribute('date-formate')){
                                temp=i;
                                break
                            }
                        }
                        document.getElementById($scrollid).scrollTop=tempTableTop+((parseInt(temp/7)-1)*30);
                    }
                });
            },
            cusChangeCompare(){
                this.is_compare=!this.is_compare;
                if(this.is_compare){
                    this.cusGetSelectDate(this.cusChooseCompareData);
                }else{
                    this.cusSelectedTime();
                }
            },
            getFocus(num){
                this.start_cycle=num;
            },
            cusGetSelectDate(str=''){
                this.cusQuickyShow=false;
                this.cusChooseCompareData=str;
                switch (str){
                    case 'last_time_period':
                        this.setCompareDate([2*this.originDate[0]-this.originDate[1]-24*60*60*1000,this.originDate[0]-24*60*60*1000]);
                        break;
                    case 'last_week_ago':
                        this.setCompareDate([this.originDate[0]-7*24*60*60*1000,this.originDate[1]-7*24*60*60*1000]);
                        break;
                    case 'last_month_ago':
                        this.setCompareDate([this.originDate[0]-30*24*60*60*1000,this.originDate[1]-30*24*60*60*1000]);
                        break;
                    case 'three_months_ago':
                        this.setCompareDate([this.originDate[0]-90*24*60*60*1000,this.originDate[1]-90*24*60*60*1000]);
                        break;
                    case 'half_a_year_ago':
                        this.setCompareDate([this.originDate[0]-180*24*60*60*1000,this.originDate[1]-180*24*60*60*1000]);
                        break;
                    case 'a_year_ago':
                        this.setCompareDate([this.originDate[0]-365*24*60*60*1000,this.originDate[1]-365*24*60*60*1000]);
                        break;
                }
            },
            setOriginDate(){
                let temp=false;
                if(arguments.length>=2){
                    let num=arguments[1],tempdate=arguments[0];
                    if(num==1&&cusGetStamp(tempdate)==this.originDate[0]){
                        this.originDate.splice(1,1,cusGetStamp(tempdate));
                    }else {
                        this.originDate.splice(num,1,cusGetStamp(tempdate));
                    }
                    if(num==1){
                        temp=true;
                    }
                    if(this.originDate[1]<this.originDate[0]){
                        this.originDate.reverse();
                    }else {
                        this.start_cycle++;
                    }
                }else{
                    let tempdate=arguments[0];
                    this.originDate.splice(0,2,cusGetStamp(tempdate[0]),cusGetStamp(tempdate[1]));
                    temp=true;
                }
                if(this.is_compare){
                    this.cusGetSelectDate(this.cusChooseCompareData);
                }
                if(!arguments[2]){
                    if(temp){
                        this.cusPageScroll('origin',this.originDate[1],this.cusOriginCalenderID,this.cusOriginScrollTable);
                    }else{
                        this.cusPageScroll('origin',this.originDate[0],this.cusOriginCalenderID,this.cusOriginScrollTable)
                    }
                }
            },
            setCompareDate(){
                let tempdate=arguments[0];
                this.compareDate.splice(0,2,cusGetStamp(tempdate[0]),cusGetStamp(tempdate[1]));
                this.cusPageScroll('compare',this.compareDate[1],this.cusCompareCalenderID,this.cusCompareScrollTable);
                this.cusSelectedTime();
            },
            cusReloadCalender(y,m,is_true){
                let tempObj=cusDrawCalender(y,m,(this.cusDisplayCalender.length+12));
                this.cusDisplayCalender=tempObj.cusDisplayCalender;
                this.cusCalenderTitle=tempObj.cusCalenderTitle;
                for(let i=0;i<tempObj.cusCalenderID.length;i++){
                    this.cusOriginCalenderID[i]='origin'+tempObj.cusCalenderID[i];
                }
                if(is_true){
                    this.$nextTick(() => {
                        document.getElementById(this.cusOriginScrollTable).scrollTop=24*220;
                    });
                }
                this.cusSelectedTime();
            },
            cusReloadComCalender(y,m,is_true){
                let tempObj=cusDrawCalender(y,m,(this.cusDisplayCalender.length+12));
                this.cusComDisplayCalender=tempObj.cusDisplayCalender;
                this.cusComCalenderTitle=tempObj.cusCalenderTitle;
                for(let i=0;i<tempObj.cusCalenderID.length;i++){
                    this.cusCompareCalenderID[i]='compare'+tempObj.cusCalenderID[i];
                }
                if(is_true){
                    this.$nextTick(() => {
                        document.getElementById(this.cusCompareScrollTable).scrollTop=24*220;
                    });
                }
                this.cusSelectedTime();
            }
        }
    }
</script>
<style lang="scss">
  @import "./customer.scss";

</style>