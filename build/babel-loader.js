var babel = require("babel-core")

/**
 * call babel-core to transform js code, and return the transformed code
 */
module.exports = function (source, inputSourceMap) {
  var babelOptions = {
    presets: ['env'],
    plugins: ["transform-react-jsx"],
    inputSourceMap: inputSourceMap,
    filename: this.request.split('!')[1].split('/').pop(),
    sourceMaps: true
  }
  var result = babel.transform(source, babelOptions)
  this.callback(null, result.code, result.map)
}
