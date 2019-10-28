import VueRouter from 'vue-router'
import Vue from 'vue'

import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'

import NotFound from '@/views/404'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 登录
    { path: '/login', component: Login },
    // 主页
    {
      path: '/home',
      component: Home,
      // 二级路由
      children: [{ path: '/', component: Welcome }]
    },
    // 404
    { path: '*', component: NotFound }
  ]
})

export default router
