import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router'
import axios from '@/api'
import MyBread from '@/components/my-bread'

// 封装好的面包屑  全局组件
Vue.component('my-bread', MyBread)

Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
