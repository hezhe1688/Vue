//使用ES6引入js文件
import {add, mul} from "./js/mathUtils";

let sum = add(10, 20);
console.log(sum);

let mul1 = mul(20, 30);
console.log(mul1);

//依赖css文件
require('./css/css.css');

//依赖Vue
import Vue from 'vue'
import App from './vue/App.vue'

new Vue({
	el: '#app',
	template: '<App/>',
	components: {
		App
	}
});
