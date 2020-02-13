import echarts from 'echarts'

const install = function (Vue) {
	Object.defineProperties(Vue.prototype, {
		$chart: {
			get() {
				return {
					//画一条简单的线
					line1: function (id) {
						this.chart = echarts.init(document.getElementById(id));
						this.chart.clear();

						const option = {
							legend: {},
							tooltip: {
								trigger: 'axis',
								showContent: false
							},
							dataset: {
								source: [
									['product', '2019/12', '2020/1', '2020/2', '2020/3', '2020/4', '2020/5'],
									['生活电器', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
									['电脑办公', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
									['图书音像', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
									['男装', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1],
									['女装', 23.2, 45.1, 58.2, 65.4, 39.7, 55.9]
								]
							},
							xAxis: {type: 'category'},
							yAxis: {gridIndex: 0},
							grid: {top: '55%'},
							series: [
								{type: 'line', smooth: true, seriesLayoutBy: 'row'},
								{type: 'line', smooth: true, seriesLayoutBy: 'row'},
								{type: 'line', smooth: true, seriesLayoutBy: 'row'},
								{type: 'line', smooth: true, seriesLayoutBy: 'row'},
								{type: 'line', smooth: true, seriesLayoutBy: 'row'},
								{
									type: 'pie',
									id: 'pie',
									radius: '30%',
									center: ['50%', '25%'],
									label: {
										formatter: '{b}: {@2019/12} ({d}%)'
									},
									encode: {
										itemName: 'product',
										value: '2019/12',
										tooltip: '2019/12'
									}
								}
							]
						};

						this.chart.on('updateAxisPointer', function (event) {
							var xAxisInfo = event.axesInfo[0];
							if (xAxisInfo) {
								var dimension = xAxisInfo.value + 1;
								myChart.setOption({
									series: {
										id: 'pie',
										label: {
											formatter: '{b}: {@[' + dimension + ']} ({d}%)'
										},
										encode: {
											value: dimension,
											tooltip: dimension
										}
									}
								});
							}
						});
						this.chart.setOption(option);
					},
					line2: function (id) {
						this.chart = echarts.init(document.getElementById(id));
						this.chart.clear();

						const option = {
							title: {
								left: 'left',
								top: 'bottom'
							},
							tooltip: {
								trigger: 'item',
								formatter: '{a} <br/>{b} : {c}%'
							},
							toolbox: {
								show: true,
								orient: 'vertical',
								top: 'center',
								feature: {
									dataView: {readOnly: false},
									restore: {},
									saveAsImage: {}
								}
							},
							legend: {
								orient: 'vertical',
								left: 'left',
								data: ['生活电器', '电脑办公', '图书音像', '母婴玩具', '男装', '女装']
							},

							series: [
								{
									name: '漏斗图',
									type: 'funnel',
									width: '40%',
									height: '45%',
									left: '5%',
									top: '50%',
									funnelAlign: 'right',

									center: ['25%', '25%'],  // for pie

									data: [
										{value: 60, name: '男装'},
										{value: 60, name: '女装'},
										{value: 30, name: '母婴玩具'},
										{value: 10, name: '图书音像'},
										{value: 80, name: '电脑办公'},
										{value: 100, name: '生活电器'}
									]
								},
								{
									name: '金字塔',
									type: 'funnel',
									width: '40%',
									height: '45%',
									left: '5%',
									top: '5%',
									sort: 'ascending',
									funnelAlign: 'right',
									center: ['25%', '75%'],  // for pie
									data: [
										{value: 60, name: '男装'},
										{value: 60, name: '女装'},
										{value: 30, name: '母婴玩具'},
										{value: 10, name: '图书音像'},
										{value: 80, name: '电脑办公'},
										{value: 100, name: '生活电器'}
									]
								},
								{
									name: '漏斗图',
									type: 'funnel',
									width: '40%',
									height: '45%',
									left: '55%',
									top: '5%',
									funnelAlign: 'left',

									center: ['75%', '25%'],  // for pie

									data: [
										{value: 60, name: '男装'},
										{value: 60, name: '女装'},
										{value: 30, name: '母婴玩具'},
										{value: 10, name: '图书音像'},
										{value: 80, name: '电脑办公'},
										{value: 100, name: '生活电器'}
									]
								},
								{
									name: '金字塔',
									type: 'funnel',
									width: '40%',
									height: '45%',
									left: '55%',
									top: '50%',
									sort: 'ascending',
									funnelAlign: 'left',

									center: ['75%', '75%'],  // for pie

									data: [
										{value: 60, name: '男装'},
										{value: 60, name: '女装'},
										{value: 30, name: '母婴玩具'},
										{value: 10, name: '图书音像'},
										{value: 80, name: '电脑办公'},
										{value: 100, name: '生活电器'}
									]
								}
							]
						};
						this.chart.setOption(option);
					},
				}
			}
		}
	})
}

export default {
	install
}
