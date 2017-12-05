'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


function resolve (dir) {
  return path.join(__dirname, './', dir)
}

const dist = resolve('dist')

module.exports = {
  context: path.resolve(__dirname, './'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: dist,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js'],
  },
  devtool: 'eval-source-map',
  resolveLoader: {
    alias: {
      "babel-loader": resolve('./build/babel-loader.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
}
