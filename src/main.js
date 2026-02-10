import Vue from 'vue'
import App from './App.vue'
import './plugins/element'
import Fragment from 'vue-fragment'
import PortalVue from 'portal-vue'

Vue.use(PortalVue)

Vue.use(Fragment.Plugin)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
