let app = new Vue({
	el: '#app',
	data: {
		books: [
			{bookName: '数据结构', data: '2017-1-1', price: 89.00, count: 1},
			{bookName: '计算机网络', data: '2014-2-1', price: 110.00, count: 1},
			{bookName: '操作系统', data: '2000-5-1', price: 49.00, count: 1},
			{bookName: '软件工程', data: '2006-1-2', price: 140.00, count: 1}
		]
	},
	methods: {
		increment(index) {
			if (this.books[index].count < 10) {
				this.books[index].count++;
			}

		},
		decrement(index) {
			if (this.books[index].count > 1) {
				this.books[index].count--;
			}

		},
		remove(index) {
			this.books.splice(index, 1);
		}
	},
	computed: {
		totalPrice(){
			let totalPrice = 0;
			for (let i = 0; i < this.books.length; i++) {
				totalPrice += this.books[i].price * this.books[i].count;
			}
			return '￥'+totalPrice+'.00';
		}
	}
});