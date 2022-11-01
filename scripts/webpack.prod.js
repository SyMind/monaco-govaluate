const { merge } = require('webpack-merge')
const webpackConf = require('./webpack.base')

module.exports = function () {
	return merge(webpackConf, {
		mode: 'production',
		devtool: 'source-map'
	})
}
