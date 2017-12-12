var postcss = require("postcss");
var loaderUtils = require("loader-utils");
var Tokenizer = require("css-selector-tokenizer");
var icssUtils = require('icss-utils');
var localByDefault = require("postcss-modules-local-by-default");
var modulesScope = require("postcss-modules-scope");

var parserPlugin = postcss.plugin("css-loader-parser", function(options) {
	return function(css) {
		var importItems = []; // 存储 import 依赖
		var urlItems = []; // 存储 url 依赖

    // 遍历所有的 import 规则，然后存储到 importItems 中
    css.walkAtRules(/^import$/i, function(rule) {
      var values = Tokenizer.parseValues(rule.params);
      var url = values.nodes[0].nodes[0];
      if(url && url.type === "url") {
        url = url.url;
      } else if(url && url.type === "string") {
        url = url.value;
      }
      importItems.push({
        url: url
      });
    });

		function processNode(item) {
			switch (item.type) {
				case "value":
					item.nodes.forEach(processNode);
					break;
				case "nested-item":
					item.nodes.forEach(processNode);
					break;
				case "url":
          // 如果是一个url依赖，那么需要：
          // 1. 把它替换成一个占位符
          // 2. 把它对应的url存在 urlItems 中
          // 这样下一步我们就可以从 urlItems 中取出url 替换掉占位符
					if (loaderUtils.isUrlRequest(item.url)) {
						var url = item.url;
						item.url = "___CSS_LOADER_URL___" + urlItems.length + "___";
						urlItems.push({
							url: url
						});
					}
					break;
			}
		}

    var icss = icssUtils.extractICSS(css);
    exports = icss.icssExports; // 这就是css名字被编译后的映射表

		css.walkDecls(function(decl) {
			var values = Tokenizer.parseValues(decl.value);
			values.nodes.forEach(function(value) {
				value.nodes.forEach(processNode);
			});
			decl.value = Tokenizer.stringifyValues(values);
		});

		options.importItems = importItems;
		options.urlItems = urlItems;
		options.exports = exports;
	};
})

module.exports = function (inputSource) {
  if(this.cacheable) this.cacheable()
  var callback = this.async()
  var options = {
    mode: 'local'
  }
  var pipeline = postcss([
    localByDefault({mode: options.mode}), // localByDefault 会把所有的 class 都编译成 :local(class) 形式
    modulesScope(), // modulesScope 会把 :local(class) 编译成 一个hash的类名，和上面的结合起来就可以实现 css modules
    parserPlugin(options)
  ])


  pipeline.process(inputSource).then(function (result) {
    
    // 处理import
		var alreadyImported = {};
		// 这里开始处理 importItems 中记录的依赖，比如 对 `global.css` 的依赖
		var importJs = options.importItems.filter(function(imp) {
			// 因为很可能同一个模块会被多次依赖，所以要去重一下。
      if(alreadyImported[imp.url]) return false;
      alreadyImported[imp.url] = true;
			return true;
		}).map(function(imp) {
      // 对于新的依赖，就在这里处理, 加载远程资源的这里我们就不处理了。直接把所有的 import 都替换成 require
      return "exports.i(require(" + loaderUtils.stringifyRequest(this, imp.url) + "))";
		}, this);

    // 省略 sourcemap
    var cssAsString = JSON.stringify(result.css)

    // 处理 url
    var URLREG_G =  /___CSS_LOADER_URL___(\d+)___/g
    var URLREG =  /___CSS_LOADER_URL___(\d+)___/
    // 正则式匹配所有的占位符，然后取出其中的id，根据id在 urlItems 中找到对应的url，然后替换即可。
    cssAsString = cssAsString.replace(URLREG_G, function(item) {
      var match = URLREG.exec(item)
      if (!match) return item;
      const url = options.urlItems[+match[1]].url

      return '" + require("' + url + '") + "';
    })
    
		var moduleJs = "exports.push([module.id, " + cssAsString + ", \"\"]);";

    // 我们的最终结果 包括这几部分:
    // 1. 引入 css-base，这个模块定义了 exports 默认的行为，包括 toString 和 i
    // 2. 所有的 import 依赖
    // 3. 导出自身
    // 4. locals
    callback(null, [
      'exports = module.exports = require(' +
      loaderUtils.stringifyRequest(this, require.resolve("./css-base.js")) +
      ")();\n",
      importJs.join(''),
      moduleJs,
      'exports.locals =' + JSON.stringify(options.exports)
    ].join(';'))
  })
}
