var path = require('path')
var loaderUtils = require('loader-utils')

module.exports = function (source) {}

/**
 * style loader will insert css into DOM
 */
module.exports.pitch = function (request) {
  var result = [
    'var content=require(' + loaderUtils.stringifyRequest(this, '!!' + request) + ')',
    'require(' + loaderUtils.stringifyRequest(this, '!' + path.join(__dirname, "add-style.js")) + ')(content)',
    'if(content.locals) module.exports = content.locals'
  ]
  return result.join(';')
}
