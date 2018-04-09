'use strict'

const webpack = require('webpack');
const base = require('./webpack.base.js');
const merge = require('webpack-merge')
module.exports = merge(base, {
  devtool: 'source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    // new webpack.HotModuleReplacementPlugin() // webpack-dev-server 有 --hot 的时候会自动加这个插件
  ]
})
