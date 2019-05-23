<template>
  <div id="app">
    <compareDatePicker :originDate="date_range" @change="getDate()" :disabledDate="disabledDate"></compareDatePicker>
  </div>
</template>

<script>
  export default {
      name: 'app',
      data(){
          return{
              date_range:[new Date(new Date().setHours(0, 0, 0, 0)).getTime() - (30*24 * 60 * 60 * 1000), new Date(new Date().setHours(0, 0, 0, 0)).getTime()],
              disabledDate:[,new Date().getTime()]
          }
      },
      methods:{
          getDate(){
              console.log(this.date_range)
          },
      }
  }
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
