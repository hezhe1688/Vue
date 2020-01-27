import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		component: () => import('../views/Main.vue'),
		children: [
			{
				path: '/consumer',
				component: () => import('../views/system_management/Consumer.vue'),
			},
			{
				path: '/order',
				component: () => import('../views/system_management/Order.vue')
			}
		]
	},
]

const router = new VueRouter({
	mode: 'history',
	routes
})

export default router
