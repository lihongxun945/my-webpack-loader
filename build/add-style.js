module.exports = function (content) {
  var style = document.createElement("style")
  style.innerText = content
  document.head.appendChild(style)
}
