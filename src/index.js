import main from './main'

let m = main

m()

if (module.hot) {
  module.hot.accept('./main.js', function() {
    m.dispose()
    m = require('./main.js')
    m()
  })
}
