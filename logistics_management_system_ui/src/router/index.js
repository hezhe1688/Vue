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
			},
			{
				path: '/product',
				component: () => import('../views/system_management/Product.vue')
			},
			{
				path: '/warehouse',
				component: () => import('../views/system_management/Warehouse.vue')
			},
			{
				path: '/deliveryStaff',
				component: () => import('../views/system_management/DeliveryStaff.vue')
			},
			{
				path: '/automobile',
				component: () => import('../views/system_management/Automobile.vue')
			},
		]
	},
]

const router = new VueRouter({
	mode: 'history',
	routes
})

export default router
