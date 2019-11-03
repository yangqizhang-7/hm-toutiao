import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router'
import axios from '@/api'
// 导入上传图片的css样式
import '@/styles/index.less'
// 全局的插件引入
import plugin from '@/components'
Vue.use(plugin)
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
