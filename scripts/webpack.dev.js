const { merge } = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpackConf = require('./webpack.base')

module.exports = function () {
	return merge(webpackConf, {
		mode: 'development',
		devServer: {
			hot: true,
			port: 8080
		},
		// plugins: [
		// 	new BundleAnalyzerPlugin({
		// 		analyzerPort: 3001
		// 	})
		// ].filter(Boolean)
	})
}
