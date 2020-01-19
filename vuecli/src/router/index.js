import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/Home.vue'
import about from '../views/About'
Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    component: home
  },
  {
    path: '/about',
    component: about
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
