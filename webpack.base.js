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
    app: './src/index.js'
  },
  output: {
    path: dist,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  resolveLoader: {
    alias: {
      "babel-loader": resolve('./build/babel-loader'),
      "style-loader": resolve('./build/style-loader'),
      "css-loader": resolve('./build/css-loader'),
      "file-loader": resolve('./build/file-loader'),
      "url-loader": resolve('./build/url-loader')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules'
      },
      {
        test: /\.jpe?g$/,
        loader: 'url-loader'
      },
      {
        test: /\.png$/,
        loader: 'file-loader?name=[name]_[hash].[ext]'
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
