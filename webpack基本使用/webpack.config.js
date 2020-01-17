const path = require('path');

module.exports = {
	//配置js
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: 'dist/'  //任何带url的都会加上这个文件目录
	},
	module: {
		rules: [
			//配置css
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			//配置图片
			{
				test: /\.(png|jpg|gif|jpeg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: 'img/[name].[hash:8].[ext]'  //在dist中生成一个img文件夹，图片名由源名字.8位哈希值.后缀
						}
					},
				]
			},
			//配置es6转es5
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['es2015']
					}
				}
			},

		]
	},
	//整合Vue
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	}
};