let dateComponent = (function(){
    class DataModel {
        constructor(str = ''){
            this.data = str;
            this.nodes = [];
        }
        bindTo(node){
            this.nodes.push(node);
            this.update();
        }
        update(){
            const INPUT_NODE = ['INPUT','TEXTAREA'];
            let {nodes} = this;
            for(let i = 0, node; node = nodes[i++];){
                if(INPUT_NODE.includes(node.nodeName)){
                    if(node.value !== this.data){
                        node.value = this.data;
                    }
                }else{
                    node.textContent = this.data;
                }
            }
        }
        set(str){
            if(str !== this.value){
                this.data = str;
                this.update();
            }
        }
        get(){
            return this.data;
        }
    }
    let cusEvent = {
        //  触发事件的方法
        $emit (event, ...params) {
            this.eventList[event].forEach((e, index, eventList) => {
                e.callback(params);
                if (e.once) {
                    //  如果是一次性事件监听器，则移除
                    eventList.splice(index, 1)
                }
            })
        },
        //  注册事件监听器
        on (event, callback, once) {
            //  如果还没有该事件的监听器队列，则创建一个
            if (!this.eventList[event]) {
                this.eventList[event] = [];
            }
            //  新建一个事件监听器对象，并将监听器保存为 callback 属性
            let eObj = {
                callback: callback
            };
            //  如果是一次性的，就添加一个标记
            if (once) {
                eObj.once = true
            }
            //  添加到事件监听器队列中
            this.eventList[event].push(eObj)
        },
        //  注册一次性事件监听器
        once (event, callback) {
            this.on(event, callback, true);
        },
        //  移除事件监听器
        off (event, callback) {
            if (!event) {
                //  如果没有提供参数，则移除所有的事件监听器
                this.eventList = {}
            } else if (!callback) {
                //  如果只提供了事件，则移除该事件所有的监听器
                this.eventList[event] = []
            } else {
                //  如果同时提供了事件与回调，则只移除这个回调的监听器
                let index = this.eventList[event].indexOf(callback);
                this.eventList[event].splice(index, 1)
            }
        },
        //  事件列表
        eventList: {}
    };

    //默认值获取参数
    let default_Params= {
        week : 'zh', divider : '/' ,cusCompareShow : true, OriginQuicky : [],
        origin_Date : [],
        compare_Date : [] ,
        originDate : [] ,
        compareDate : [], start_cycle:0 , is_compare: false,
    } ;
    //定义需要的变量
    let cusGetStamp = function(date){
        //时间格式转为时间戳格式
        return new Date(new Date(date).setHours(0, 0, 0, 0)).getTime();
    };
    let cusParseTime = function(time, cFormat){
        //时间戳格式转为时间格式
        if (arguments.length === 0) {
            return null
        }
        const format = cFormat || '{y}-{m}-{d}';
        let date;
        if (typeof time === 'object') {
            date = time
        } else {
            if (('' + time).length === 10) time = parseInt(time) * 1000;
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        };
        const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            let value = formatObj[key]
            if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        });
        return time_str
    };
    let weekName={
        "zh":["日","一","二","三","四","五","六"],
        "en":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    };
    let gModel = {};
    let gParams = {};
    let gElem;
    //end
    function cusDate(
        cus_ele = '.cus-date',
        cus_Params = {}
    ){
        for(let key in default_Params){
            if(!cus_Params[key]){
                cus_Params[key] = default_Params[key];
            }
        }
        gParams = cus_Params;
        gElem = cus_ele;
        if(gParams.originDate.length<2){
            gParams.originDate=[cusGetStamp(new Date()) - 6 * 24 * 60 * 60 * 1000, cusGetStamp(new Date())];
        };
        gParams.origin_Date=[cusParseTime(gParams.originDate[0]),cusParseTime(gParams.originDate[1])];
        gModel = {
            origin_start_Date: new DataModel(`${gParams.origin_Date[0]}`),
            origin_end_Date: new DataModel(`${gParams.origin_Date[1]}`),
            compare_start_Date: new DataModel(`${gParams.compare_Date[0]}`),
            compare_end_Date: new DataModel(`${gParams.compare_Date[1]}`)
        };
        cusDate.prototype.init()
    }
    cusDate.prototype = {
        init(){
            this.cusCreateNeedElem();
            this.cusBindEvent();
        },
        cusCreateNeedElem(){
            let _this=this;
            let template_html = `
                <div class="cus-calender-wrapper">
                    <div class="cus-show-calender">
                        <div class="cus-origin-date">
                            <input type="text" cus-data-bind="origin_start_Date" id="cusOriginStartDate" autocomplete="off"/>
                            <i>${gParams.divider}</i>
                            <input type="text" cus-data-bind="origin_end_Date"  id="cusOriginEndDate"/>
                        </div>
                    </div>
                    <div class="cus-calender-panel cus-clearFix" style="display: none;">
                        <div class="cus-clearFix">
                            <div class="cus-quicky-key"></div>
                            <div class="cus-panel-body cus-clearFix"></div>
                            <div class="cus-panel-footer cus-clearFix"></div>
                        </div>
                    </div>
                </div> `;
            let compareShowHtml = `
                <div class="cus-compare-panel">
                    <label for="compare-panel-input-show">
                        <input type="checkbox" id="compare-panel-input-show">
                        比较日期范围
                    </label>
                </div>
            `;
            if(document.querySelector(gElem)){
                document.querySelector(gElem).innerHTML = template_html;
            };
            this.cusQuickyKey(gParams);
            let cusOriginStart = this.cusGetElemenet({id_Name:'cusOriginStartDate'});
            let cusOriginEnd = this.cusGetElemenet({id_Name:'cusOriginEndDate'});
            cusOriginStart.focus();
            gModel[cusOriginStart.getAttribute('cus-data-bind')].bindTo(cusOriginStart);
            gModel[cusOriginEnd.getAttribute('cus-data-bind')].bindTo(cusOriginEnd);
            if(gParams.cusCompareShow){
                this.cusGetElemenet({query_Selector:'.cus-panel-footer'}).innerHTML += compareShowHtml;
            };
            cusOriginStart.addEventListener('input', function(){
                gModel[this.getAttribute('cus-data-bind')].set(this.value);
            });
            cusOriginStart.addEventListener('keyup', function(e){
                if(e.keyCode=='13'){
                    _this.setOriginDate(cusOriginStart.value,0);
                }
            });
            cusOriginEnd.addEventListener('input', function(){
                gModel[this.getAttribute('cus-data-bind')].set(this.value);
            });
            cusOriginEnd.addEventListener('keyup', function(e){
                if(e.keyCode=='13'){
                    _this.setOriginDate(cusOriginEnd.value,1);
                }
            });
            cusOriginStart&&cusOriginStart.addEventListener('focus',(e)=>{
                gParams.start_cycle=0;
            });
            cusOriginEnd&&cusOriginEnd.addEventListener('focus',(e)=>{
                gParams.start_cycle=1;
            });
            this.cusDrawCalender(gParams.origin_Date[1].split('-')[0],gParams.origin_Date[1].split('-')[1]);
        },
        cusSelectedTime(){
            let cusCalenderDay = this.cusGetElemenet({class_Name:'cus-calender-body'});
            for(let i=0;i<cusCalenderDay.length;i++){
                if(!this.cusHasClass(cusCalenderDay[i],'forbid')){
                    let tempdate = cusGetStamp(cusCalenderDay[i].getAttribute('date-formate'));
                    cusCalenderDay[i].classList.remove("cus-calender_active");
                    cusCalenderDay[i].classList.remove("cus-calender_compare_active");
                    cusCalenderDay[i].classList.remove("cus-calender_including");
                    cusCalenderDay[i].classList.remove("cus-calender_compare_including");
                    cusCalenderDay[i].classList.remove("cus-start");
                    cusCalenderDay[i].classList.remove("cus-end");
                    if(tempdate==gParams.originDate[0]){
                        cusCalenderDay[i].className += ' cus-calender_active cus-start';
                    }
                    if(tempdate==gParams.originDate[1]){
                        cusCalenderDay[i].className += ' cus-calender_active cus-end';
                    }
                    if(tempdate > gParams.originDate[0] && tempdate < gParams.originDate[1]&&cusCalenderDay[i].getAttribute('type')=='normal'){
                        cusCalenderDay[i].className += ' cus-calender_including'
                    }
                    if(gParams.is_compare){
                        if(tempdate==gParams.compareDate[0]){
                            cusCalenderDay[i].className += ' cus-calender_compare_active cus-start'
                        }
                        if(tempdate==gParams.compareDate[1]){
                            cusCalenderDay[i].className += ' cus-calender_compare_active cus-end'
                        }
                        if(tempdate > gParams.compareDate[0] && tempdate < gParams.compareDate[1]){
                            cusCalenderDay[i].className += ' cus-calender_compare_including'
                        }
                    }
                };
            };
        },
        cusDisplayCalender(year,month){
            //画日历
            let temp_interval=0,calender_day=[];
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                temp_interval = 1;
            }
            let hasDays = [31, 28+temp_interval, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            //获取2年时间
            for(let i=0;i<24;i++){
                let tempArr=[];
                //获取当月第一天是星期几
                let $first_day =  new Date(year, (month-1), 1).getDay();
                //获取当月最后一天是星期几
                let $last_day = 6 - (new Date(year, (month), 0).getDay());
                if($first_day>0){
                    for(let i=0;i<$first_day;i++){
                        let obj={
                            type:'disabled',
                            classname:'forbid',
                            cont:'',
                            format: year+'-'+month
                        };
                        tempArr.push(obj)
                    }
                }
                for (let i = 0; i < hasDays[month-1]; i++) {
                    let obj = {
                        type: "normal",
                        classname:'normal',
                        cont: i + 1,
                        format:year+'-'+month+'-'+(i+1)
                    };
                    tempArr.push(obj);
                }
                if($last_day>0){
                    for(let i=0;i<$last_day;i++){
                        let obj={
                            type:'disabled',
                            classname:'forbid',
                            cont:'',
                            format: year+'-'+month
                        };
                        tempArr.push(obj)
                    }
                }
                if(tempArr.length<42){
                    for(let j=0;j<42-tempArr.length;j++){
                        let obj={
                            type:'disabled',
                            classname:'forbid',
                            cont:'',
                            format: year+'-'+month
                        };
                        tempArr.push(obj)
                    }
                }
                calender_day.unshift(tempArr);
                month--;
                if(month<1){
                    month=12;
                    year--;
                }

            }
            return calender_day
        },
        cusPageScroll(date,$topid=[],$scrollid){
            let tempNum=0;
            for(let i=0;i<$topid.length;i++){
                if($topid[i].split('-')[1]<10){
                    $topid[i]=$topid[i].split('-')[0]+'-0'+Number($topid[i].split('-')[1]);
                }
                if(cusParseTime(date,'{y}-{m}')==$topid[i]){
                    tempNum=i;
                    break;
                }
            }
            if(document.getElementById($topid[tempNum])){
                let tempTableTop=document.getElementById($topid[tempNum]).offsetTop;
                document.getElementById($scrollid).scrollTop=tempTableTop;
            }
        },
        cusDrawCalender(year,month){
            let calBody =document.createElement('div');
            let calHead = document.createElement('div');
            calHead.className='cus-panel-container-header cus-clearFix';
            calBody.className='cus-panel-container-body cus-clearFix';
            calBody.setAttribute('id','cusOriginScrollTable');
            weekName[gParams.week].forEach((item, index) => {
                let temp = `<span class="cus-calender-header">${item}</span>`
                calHead.innerHTML += temp
            });
            this.cusDisplayCalender(year,month).forEach((item, index) => {
                let tempDiv=document.createElement('div');
                tempDiv.className='cus-clearFix cus-table-show';
                item.forEach((val,key)=>{
                    if(key==0){
                        let tempTitle=document.createElement('h4');
                        tempTitle.innerHTML=cusParseTime(val.format,'{y}年{m}月');
                        tempTitle.className='cus-calender-title';
                        tempTitle.setAttribute('id',cusParseTime(val.format,'{y}-{m}'));
                        calBody.appendChild(tempTitle);
                    }
                    let temp_disabled = false;
                    if(cusGetStamp(new Date())<cusGetStamp(new Date(`${val.format}`))){
                        temp_disabled = true;
                    }
                    let tempSpan=document.createElement('span');
                    tempSpan.className='cus-calender-body '+val.classname+' cus-not-click-'+temp_disabled;
                    tempSpan.setAttribute("date-formate",val.format);
                    tempSpan.setAttribute("type",val.type);
                    tempSpan.setAttribute("not-allow",temp_disabled);
                    let tempI=document.createElement('i');
                    tempI.innerHTML=val.cont;
                    tempSpan.appendChild(tempI);
                    tempDiv.appendChild(tempSpan);
                    calBody.appendChild(tempDiv);
                });
            });
            this.cusGetElemenet({query_Selector:'.cus-panel-body'}).appendChild(calHead);
            this.cusGetElemenet({query_Selector:'.cus-panel-body'}).appendChild(calBody);
            if(this.cusGetElemenet({class_Name:'cus-calender-body'})){
                let tempCalenderDay = this.cusGetElemenet({class_Name:'cus-calender-body'});
                //自定义选择日期
                for(let i=0;i<tempCalenderDay.length;i++){
                    tempCalenderDay[i].addEventListener('click',(e)=>{
                        cusEvent.$emit('cusChooseDate',i)
                    })
                };
                this.cusSelectedTime();
            };
            this.cusTriggerEvent();
        },
        cusQuickyKey(){
            let cusQuickyUl = document.createElement('ul');
            cusQuickyUl.className = 'cus-quicky-ul-key';
            if(gParams.OriginQuicky&&gParams.OriginQuicky.length>0){
                gParams.OriginQuicky.forEach((item, index) => {
                    let temp = `<li class="cus-quicky-li-key">${item.label}</li>`
                    cusQuickyUl.innerHTML += temp
                });
                this.cusGetElemenet({query_Selector:'.cus-quicky-key'}).appendChild(cusQuickyUl);
            };
        },
        cusBindEvent(){
            cusEvent.on('compareShowcompareShow',(isCompare=false)=>{
                let _this=this;
                if(isCompare[0]){
                    let compate_date_html = `
                        <input type="text" cus-data-bind="compare_start_Date" id="cusCompareStartDate" readonly/>
                        <i>${gParams.divider}</i>
                        <input type="text" cus-data-bind="compare_end_Date" id="cusCompareEndDate" readonly/>
                    `, compate_select_html = `
                        <select name="" id="cusChooseCompareSelect">
                            <option value="last_time_period" selected>上一个时间段</option>
                            <option value="last_week_ago">一周前</option>
                            <option value="last_month_ago">一个月前</option>
                            <option value="three_months_ago">三个月前</option>
                            <option value="half_a_year_ago">半年前</option>
                            <option value="a_year_ago">一年前</option>
                        </select>`;
                    if(this.cusGetElemenet({query_Selector:'.cus-complate-date'})){
                        this.cusGetElemenet({query_Selector:'.cus-show-calender'}).removeChild(this.cusGetElemenet({query_Selector:'.cus-complate-date'}))
                    }
                    if(this.cusGetElemenet({query_Selector:'.cus-compate-select'})){
                        this.cusGetElemenet({query_Selector:'.cus-compare-panel'}).removeChild(this.cusGetElemenet({query_Selector:'.cus-compate-select'}))
                    }
                    let tempDiv = document.createElement('div');
                    tempDiv.className = 'cus-complate-date';
                    let tempSpan = document.createElement('span');
                    tempSpan.className = 'cus-compate-select';
                    tempDiv.innerHTML = compate_date_html;
                    tempSpan.innerHTML = compate_select_html;
                    this.cusGetElemenet({query_Selector:'.cus-show-calender'}).appendChild(tempDiv);
                    this.cusGetElemenet({query_Selector:'.cus-compare-panel'}).appendChild(tempSpan);
                    let compareStart = this.cusGetElemenet({query_Selector:'#cusCompareStartDate'});
                    let cusOriginStart = this.cusGetElemenet({query_Selector:'#cusOriginStartDate'});
                    let compareEnd = this.cusGetElemenet({query_Selector:'#cusCompareEndDate'});
                    let cusChooseCompareSelect = this.cusGetElemenet({query_Selector:'#cusChooseCompareSelect'});
                    let cusChooseCompareData = cusChooseCompareSelect.options[cusChooseCompareSelect.selectedIndex].value;
                    cusEvent.$emit('cusGetSelectDate',cusChooseCompareData);
                    gModel[compareStart.getAttribute('cus-data-bind')].bindTo(compareStart);
                    gModel[compareEnd.getAttribute('cus-data-bind')].bindTo(compareEnd);
                    gModel[compareStart.getAttribute('cus-data-bind')].set(gParams.compare_Date[0]);
                    gModel[compareEnd.getAttribute('cus-data-bind')].set(gParams.compare_Date[1]);
                    cusChooseCompareSelect&&cusChooseCompareSelect.addEventListener('change',(e)=>{
                        cusEvent.$emit('cusGetSelectDate',cusChooseCompareSelect.options[cusChooseCompareSelect.selectedIndex].value);
                    });
                    this.cusSelectedTime();
                }else{
                    if(this.cusGetElemenet({query_Selector:'.cus-complate-date'})){
                        this.cusGetElemenet({query_Selector:'.cus-show-calender'}).removeChild(this.cusGetElemenet({query_Selector:'.cus-complate-date'}));
                    }
                    if(this.cusGetElemenet({query_Selector:'.cus-compate-select'})){
                        this.cusGetElemenet({query_Selector:'.cus-compare-panel'}).removeChild(this.cusGetElemenet({query_Selector:'.cus-compate-select'}));
                    }
                    this.cusSelectedTime();
                }
            });
            cusEvent.on('cusGetSelectDate',(str='') =>{
                switch (str[0]){
                    case 'last_time_period':
                        this.setCompareDate([2*gParams.originDate[0]-gParams.originDate[1]-24*60*60*1000,gParams.originDate[0]-24*60*60*1000]);
                        break;
                    case 'last_week_ago':
                        this.setCompareDate([gParams.originDate[0]-7*24*60*60*1000,gParams.originDate[1]-7*24*60*60*1000]);
                        break;
                    case 'last_month_ago':
                        this.setCompareDate([gParams.originDate[0]-30*24*60*60*1000,gParams.originDate[1]-30*24*60*60*1000]);
                        break;
                    case 'three_months_ago':
                        this.setCompareDate([gParams.originDate[0]-90*24*60*60*1000,gParams.originDate[1]-90*24*60*60*1000]);
                        break;
                    case 'half_a_year_ago':
                        this.setCompareDate([gParams.originDate[0]-180*24*60*60*1000,gParams.originDate[1]-180*24*60*60*1000]);
                        break;
                    case 'a_year_ago':
                        this.setCompareDate([gParams.originDate[0]-365*24*60*60*1000,gParams.originDate[1]-365*24*60*60*1000]);
                        break;
                }
            });
            cusEvent.on('cusChooseDate', (num=0)=> {
                let cusOriginStart = this.cusGetElemenet({id_Name:'cusOriginStartDate'});
                let cusOriginEnd = this.cusGetElemenet({id_Name:'cusOriginEndDate'});
                let cusCalenderDay = this.cusGetElemenet({class_Name:'cus-calender-body'})
                if(cusCalenderDay[num].getAttribute('type')!='normal'||cusCalenderDay[num].getAttribute('not-allow')=='true'){
                    return false;
                }
                this.setOriginDate(cusCalenderDay[num].getAttribute('date-formate'),gParams.start_cycle);
                if(gParams.start_cycle==1){
                    cusOriginEnd.focus();
                }else {
                    cusOriginStart.focus();
                }
                if(gParams.start_cycle>=2){
                    gParams.start_cycle=0;
                }
            });
            cusEvent.on('cusSetQuickDate', (date = [])=>{
                if(String(date)){
                    date=String(date).split(',');
                }
                this.setOriginDate([Number(date[0]),Number(date[1])]);
            });
            cusEvent.on('cusSelectedOptions',(obj={}) =>{
                for(let i=0;i<obj[0].$select.options.length;i++){
                    if (obj[0].$select.options[i].value == obj[0].$value){
                        obj[0].$select.options[i].selected = true;
                        break;
                    }
                }
            });
        },
        cusTriggerEvent(){
            let cusShowCalender = this.cusGetElemenet({query_Selector:'.cus-show-calender'});
            let cusCalenderPanel = this.cusGetElemenet({query_Selector:'.cus-calender-panel'});
            let tempDiv=document.getElementsByClassName('cus-calender-title');
            let cusOriginCalenderID=[];
            for(let i=0;i<tempDiv.length;i++){
                cusOriginCalenderID.push(tempDiv[i].getAttribute('id'));
            }
            cusShowCalender&&cusShowCalender.addEventListener(('click'),(e)=>{
                e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
                cusCalenderPanel.style.display ='';
                this.cusPageScroll(gParams.originDate[1],cusOriginCalenderID,'cusOriginScrollTable');
            });
            cusCalenderPanel&&cusCalenderPanel.addEventListener(('click'),(e)=>{
                e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
                cusCalenderPanel.style.display = '';
            });
            //隐藏日历
            document.addEventListener(('click'),(e)=>{
                cusCalenderPanel.style.display = 'none';
            });
            if(this.cusGetElemenet({class_Name:'cus-quicky-li-key'})){
                let cusQuickyLiKey=this.cusGetElemenet({class_Name:'cus-quicky-li-key'});
                //快捷键选中日期范围
                for(let i=0;i<cusQuickyLiKey.length;i++){
                    cusQuickyLiKey[i].onclick = function() {
                        this.index = i;
                        gParams.OriginQuicky[this.index].callback(cusEvent);
                    }
                }
            }
            if(this.cusGetElemenet({id_Name:'compare-panel-input-show'})){
                //是否显示比较日期
                let tempElem = this.cusGetElemenet({id_Name:'compare-panel-input-show'});
                tempElem.addEventListener('click',(e)=>{
                    if(tempElem.checked){
                        gParams.is_compare=true;
                    }else {
                        gParams.is_compare=false;
                    }
                    cusEvent.$emit('compareShowcompareShow',gParams.is_compare);
                });
            };
        },
        cusGetElemenet(obj={id_Name:'',class_Name:'',tag_Name:'',query_Selector:''}){
            if(obj.id_Name){
                return document.getElementById(obj.id_Name);
            }else if(obj.class_Name){
                return document.getElementsByClassName(obj.class_Name);
            }else if(obj.tag_Name){
                return document.getElementsByTagName(obj.tag_Name);
            }else if(obj.query_Selector){
                return document.querySelector(obj.query_Selector)
            }
        },
        cusHasClass(elem, className){
            let classes = elem.className.split(/\s+/) ;
            for(let i= 0 ; i < classes.length ; i ++) {
                if( classes[i] === className ) {
                    return true ;
                }
            }
            return false ;
        },
        setOriginDate() {
            if(arguments.length==2){
                let num=arguments[1],tempdate=arguments[0];
                if(cusGetStamp(tempdate)==gParams.originDate[0]){
                    gParams.originDate[1]=cusGetStamp(tempdate)
                }else {
                    gParams.originDate.splice(num,1,cusGetStamp(tempdate));
                }
                if(gParams.originDate[1]<gParams.originDate[0]){
                    gParams.originDate.reverse();
                }else {
                    gParams.start_cycle++;
                }
            }else {
                let tempdate=arguments[0];
                gParams.originDate=[cusGetStamp(tempdate[0]),cusGetStamp(tempdate[1])];
                if(gParams.originDate[1]<gParams.originDate[0]){
                    gParams.originDate.reverse();
                }
            }
            gParams.origin_Date = [cusParseTime(gParams.originDate[0]),cusParseTime(gParams.originDate[1])];
            gModel.origin_start_Date.set(gParams.origin_Date[0]);
            gModel.origin_end_Date.set(gParams.origin_Date[1]);
            let cusChooseCompareSelect = this.cusGetElemenet({query_Selector:'#cusChooseCompareSelect'});
            let cusChooseCompareData;
            if(cusChooseCompareSelect){
                cusChooseCompareData = cusChooseCompareSelect.options[cusChooseCompareSelect.selectedIndex].value;
            }
            if(gParams.is_compare&&cusChooseCompareData){
                cusEvent.$emit('cusGetSelectDate',cusChooseCompareData);
            }
            this.cusSelectedTime();
        },
        setCompareDate() {
            if(arguments.length==2){
                let num=arguments[1],tempdate=arguments[0];
                if(cusGetStamp(tempdate)==gParams.compareDate[0]){
                    gParams.compareDate[1]=cusGetStamp(tempdate)
                }else {
                    gParams.compareDate.splice(num,1,cusGetStamp(tempdate));
                }
                if(gParams.compareDate[0]>gParams.compareDate[1]){
                    gParams.compareDate=gParams.compareDate.reverse();
                }else{
                    gParams.start_cycle++;
                }
            }else {
                let tempdate=arguments[0];
                gParams.compareDate=[cusGetStamp(tempdate[0]),cusGetStamp(tempdate[1])];
            }
            gParams.compare_Date = [cusParseTime(gParams.compareDate[0]),cusParseTime(gParams.compareDate[1])];
            gModel.compare_start_Date.set(gParams.compare_Date[0]);
            gModel.compare_end_Date.set(gParams.compare_Date[1]);
            this.cusSelectedTime();
        }
    };
    return {cusDate};
})();