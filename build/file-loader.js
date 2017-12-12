var loaderUtils = require('loader-utils')

module.exports = function (content) {

  // 获取options，就是 webpack 中对 file-loader 的配置，比如这里我们配置的是 `name=[name]_[hash].[ext]`
  // 获取到的就是这样一个k-v 对象 { name: "[name]_[hash].[ext]" }
  const options = loaderUtils.getOptions(this) || {};

  // 这是 loaderUtils 的一个方法，可以根据 name 配置和 content 内容 生成一个文件名。为什么需要 文件内容呢？这是为了保证当文件内容没有发生变化的时候，名字中的 [hash] 字段也不会变。可以理解为用文件的内容作了一个hash
  let url = loaderUtils.interpolateName(this, options.name, {
    content
  })

  this.emitFile(url, content) // 告诉webpack，我要创建一个文件，文件名和内容，这样webpack就会帮你在 dist 目录下创建一个对应的文件

  // 这里要用到一个变量，就是 __webpack_public_path__ ，这是一个由webpack提供的全局变量，是public的根路径
  // 参见：https://webpack.js.org/guides/public-path/#on-the-fly
  // 这里要注意一点：这个返回的字符串是一段JS，显然，他是在浏览器中运行的
  // 举个栗子：
  // css源码这样写： background-image: url('a.png')
  // 编译后变成: background-image: require('xxxxxx.png')
  // 这里的 require 语句返回的结果，就是下面的 exports 的字符串，也就是图片的路径
  return 'module.exports = __webpack_public_path__ + '+ JSON.stringify(url)
}

// 一定别忘了这个，因为默认情况下 webpack 会把文件内容当做UTF8字符串处理，而我们的文件是二进制的，当做UTF8会导致图片格式错误。
// 因此我们需要指定webpack用 raw-loader 来加载文件的内容，而不是当做 UTF8 字符串传给我们
// 参见： https://webpack.github.io/docs/loaders.html#raw-loader
module.exports.raw = true
