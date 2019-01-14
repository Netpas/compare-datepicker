import Vue from 'vue'
import App from './App.vue'
import compareDatePicker from '../packages/index'

Vue.use(compareDatePicker);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
