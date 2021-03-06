import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
	{
		path: '/main',
		component: () => import('../views/Main.vue'),
		children: [
			{
				path: '/home',
				component: () => import('../views/Home/Home.vue'),
			},
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
			{
				path: '/feedback',
				component: () => import('../views/system_management/Feedback.vue')
			},
			{
				path: '/user',
				component: () => import('../views/access_control/User.vue')
			},
			{
				path: '/role',
				component: () => import('../views/access_control/Role.vue')
			},
			{
				path: '/permission',
				component: () => import('../views/access_control/Permission.vue')
			},
			{
				path: '/swagger',
				component: () => import('../views/system_monitoring/Swagger.vue')
			},
			{
				path: '/druid',
				component: () => import('../views/system_monitoring/Druid.vue')
			},
			{
				path: '/logs',
				component: () => import('../views/log_management/Logs.vue')
			},
			{
				path: '/server',
				component: () => import('../views/operations_management/Server.vue')
			},
		]
	},
]

const router = new VueRouter({
	mode: 'history',
	routes
})

export default router
