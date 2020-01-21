import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/user',
		component: () => import('../views/User.vue'),
	},
	{
		path: '/adduser',
		component: () => import('../views/AddUser.vue')
	}

]

const router = new VueRouter({
	mode: 'history',
	routes
})

export default router
