import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFound from '@/views/404'

import local from '@/utils/local'
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
router.beforeEach((to, from, next) => {
  // 如果你访问的不是登录页面，且又没有登录，跳转到登录页面。
  const user = local.getUser()
  if (to.path !== '/login' && !user) return next('/login')
  next()
})
export default router
