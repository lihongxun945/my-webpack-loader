var babel = require("babel-core")

module.exports = function (source, inputSourceMap) {
  var babelOptions = {
    presets: ['env'],
    inputSourceMap: inputSourceMap,
    filename: this.request.split('!')[1].split('/').pop(),
    sourceMaps: true
  }
  var result = babel.transform(source, babelOptions)
  console.log(result.code)
  this.callback(null, result.code, result.map)
}
