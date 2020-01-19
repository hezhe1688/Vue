import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/Home.vue'
import about from '../views/About'
import user from '../views/User'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'home'   //配置默认进入首页
  },
  {
    path: '/home',
    component: home
  },
  {
    path: '/about',
    component: about
  },
  {
    path: '/user/:userId',
    component: user
  }
]

const router = new VueRouter({
  mode: 'history',   //取消默认采用的哈希值
  base: process.env.BASE_URL,
  routes,

})

export default router
