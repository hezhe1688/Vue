import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect: 'home'   //配置默认进入首页
	},
	{
		path: '/home',
		component: () => import('../views/Home.vue'),  //懒加载方式，打包之后懒加载
		// children: [
		// 	{
		// 		path: '/',
		// 		redirect: 'homeNews'
		// 	},
		// 	{
		// 		path: 'homeMsg',  //不允许添加斜杆
		// 		component: () => import('../views/HomeMsg.vue')
		// 	},
		// 	{
		// 		path: 'homeNews',
		// 		component: () => import('../views/HomeNews.vue')
		// 	}
		// ]
	},
	{
		path: '/about',
		component: () => import('../views/About.vue')
	},
	{
		path: '/user/:userId',
		component: () => import('../views/User.vue')
	},
	{
		path: '/profile',
		component: () => import('../views/Profile.vue')
	}

]

const router = new VueRouter({
	mode: 'history',   //取消默认采用的哈希值
	base: process.env.BASE_URL,
	routes,

})

export default router
