import Vue from 'vue'
import App from './App.vue'
import '@grapecity/wyn-report-viewer';
import '@grapecity/wyn-report-designer';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
