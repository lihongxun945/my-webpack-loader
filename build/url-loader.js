var loaderUtils = require('loader-utils')
var mime = require("mime")

module.exports = function(content) {

	// 获取 options 配置，上面已经讲过了就不在重复
  var options =  loaderUtils.getOptions(this) || {};
  // Options `dataUrlLimit` is backward compatibility with first loader versions
	// limit 参数，只有文件大小小于这个数值的时候我们才进行base64编码，否则将直接调用 file-loader
  var limit = options.limit || (this.options && this.options.url && this.options.url.dataUrlLimit);

  if(limit) {
    limit = parseInt(limit, 10);
  }

  var mimetype = options.mimetype || options.minetype || mime.lookup(this.resourcePath);

  // No limits or limit more than content length
  if(!limit || content.length < limit) {
    if(typeof content === "string") {
      content = new Buffer(content);
    }

		// 直接返回 base64 编码的内容
    return "module.exports = " + JSON.stringify("data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64"));
  }

	// 超过了文件大小限制，那么我们将直接调用 file-loader 来加载
  var fallback = options.fallback || "file-loader";
  var fallbackLoader = require(fallback);

  return fallbackLoader.call(this, content);
}

// 一定别忘了这个，因为默认情况下 webpack 会把文件内容当做UTF8字符串处理，而我们的文件是二进制的，当做UTF8会导致图片格式错误。
// 因此我们需要指定webpack用 raw-loader 来加载文件的内容，而不是当做 UTF8 字符串传给我们
// 参见： https://webpack.github.io/docs/loaders.html#raw-loader
module.exports.raw = true
