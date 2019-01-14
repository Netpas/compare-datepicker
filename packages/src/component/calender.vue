<template>
  <div>
    <div class="cus-panel-container-header cus-clearFix">
        <span v-for="value in weekName" v-bind:key="value" class="cus-calender-header">
          {{value}}
        </span>
    </div>
    <hr>
    <div class="cus-scroll-table cus-clearFix" @scroll="cusSrcollTab" :id="cusScrollTable">
      <div class="cus-table-location">
        <table class="cus-calender-table" v-for="(vals,k) in cusCalender" v-bind:key="k" :id="cusCalenderID[k]">
          <caption class="cus-calender-title">{{cusTitle[k]}}</caption>
          <tr v-for="key in [0,1,2,3,4,5,6]">
            <td v-for="(item,index) in vals" v-bind:key="index" v-if="7*key<=index&&index<7*(key+1)">
            <span class="cus-calender-body"
                  v-bind:key="index"
                  :class="{normal:item.classname,
                  'cus-not-click-true':item.notAllow,
                  'cus-calender_including':is_active[item.format],
                  'cus-calender_active':is_active[item.format]&&(is_start_active[item.format]||is_end_active[item.format]),
                  'cus-start':is_start_active[item.format],
                  'cus-end':is_end_active[item.format]
                  }"
                  :date-formate="item.format"
                  :type="item.type"
                  @click="cusClickTime(item.type,item.format,item.notAllow)"
                  :not-allow="item.disabled">
            <i>{{item.cont}}</i></span>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <hr>
  </div>
</template>
<script>
    export default {
        name: 'calender',
        props:['cusCalender','cusTitle','is_year_disabled','is_month_disabled','is_active','is_start_active','is_end_active','cusScrollTable','cusCalenderID'],
        data(){
            return{
                weekName:["日","一","二","三","四","五","六"],
            }
        },
        methods:{
            cusClickTime(type,date,isallow){
                this.$emit('cusClickTime',type,date,isallow)
            },
            cusSrcollTab(){
                this.$emit('cusSrcollTab');
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>