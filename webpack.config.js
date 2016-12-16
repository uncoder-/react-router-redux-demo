var path = require('path');
var webpack = require('webpack');

// 变量
var ENV = process.env.NODE_ENV || 'development';
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
	entry: {
		app:'./src/app.js'
	},
	output: {
		path: BUILD_PATH,
		publicPath:'dist',
		filename: '[name].js'
	},
	module: {
		loaders: [
			{
				test: /\.css$/, 
				loaders: ['style', 'css'], // 文件使用 style-loader、css-loader来编译处理
			}, 
			{
				test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,//图片文件使用 url-loader 来处理，小于40000字节的直接转为base64
				loader: 'url-loader?limit=10192'
			},
			{
				test: /\.(eot|ttf|svg)/,loader : 'file?prefix=font/'
			},
			{
				test: /\.woff/,loader : 'file?prefix=font/&limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.(js|jsx)$/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'react','stage-0']
				},
				exclude: /node_modules/,
			}
		]
	},
	resolve:{
		extensions:['','.js','.json']  //自动扩展文件后缀名，意味着require模块可以省略不写后缀名
	},
	devServer: {
		colors: true,
		hot: true,  //热加载模式
		inline: true, //inline模式(将webpack-dev-sever的客户端入口添加到包(bundle)中)
		port : 8888
	},
	plugins: [
		new webpack.NoErrorsPlugin(), //用来跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误
		new webpack.HotModuleReplacementPlugin() //全局开启代码热替换
	]
}