const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts'],
		alias: {},
		fallback: { fs: false }
	},
	entry: {
		app: path.resolve(__dirname, '../web/app.js'),
        'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js'
	},
	module: {
		rules: [
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false
				}
			},
			{
				test: /\.(js|jsx|tsx|ts)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(jpg|png|gif|eot|woff|svg|ttf|woff2|gif|appcache|webp)(\?|$)/,
				type: 'asset/resource'
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: path.resolve(__dirname, '../web/index.html')
		})
	]
}
