<template>
  <div id="app">
    <cus-date-picker :originDate="originDate"></cus-date-picker>
  </div>
</template>

<script>
  export default {
      name: 'app',
      data(){
          return{
              originDate:[new Date(new Date().setHours(0,0,0,0)).getTime() - 7*24*60*60*1000,new Date(new Date().setHours(0,0,0,0)).getTime()],
          }
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
