var path = require('path')
var loaderUtils = require('loader-utils')

module.exports = function (source) {}

/**
 * style loader will insert css into DOM
 */
module.exports.pitch = function (request) {
  var result = [
    'var content=require(' + loaderUtils.stringifyRequest(this, '!!' + request) + ');',
    'var style = require(' + loaderUtils.stringifyRequest(this, '!' + path.join(__dirname, "add-style.js")) + ')(content);',
    'if (module.hot) {',
    '  if (!content.locals) {', // 未启用 css modules， 则可以直接更新 style内容即可。如果启用了，因为还需要父组件更新，所以这里就不作处理，直接冒泡到父组件处理（style-loader被父组件重新调用了一次）
		'		module.hot.accept(' + loaderUtils.stringifyRequest(this, '!!' + request) + ', function() {',
    '     style.innerHTML = require(' + loaderUtils.stringifyRequest(this, '!!' + request) + ');',
    '   })',
    '  }',
    '  module.hot.dispose(function () { console.log(style);style.remove() })',
    '}',
    'if(content.locals) module.exports = content.locals'
  ]
  return result.join(';')
}
