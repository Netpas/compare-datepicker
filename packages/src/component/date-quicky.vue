<template>
  <div class="cus-quicky-key cus-clearFix" :class="{'cus-quicky-key-show':cusQuickyShow}">
    <ul>
      <li v-for="(item,index) in OriginQuicky" @click="handleRangePick(item)" v-bind:key="index">{{item.label}}</li>
    </ul>
    <ul v-if="is_compare">
      <li v-for="(item,index) in CompareQuicky" @click="handleComparePick(item)" v-bind:key="index">{{item.label}}</li>
    </ul>
  </div>
</template>
<script>
    export default {
        name: 'cus-quick',
        props:['cusQuickyShow','OriginQuicky','CompareQuicky','is_compare'],
        methods:{
            handleRangePick(picker){
                if(picker.callback){
                    picker.callback(this);
                }
            },
            handleComparePick(picker){
                if(picker.onClick){
                    picker.onClick(this);
                }
            },
        }
    }
</script>
<style lang="scss" scoped>

</style>