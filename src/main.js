import People from './people'
// import p from './p.jsx'
import styles from './style.css'

let d, d2
function main() {

  const lily = new People('Lily')
  lily.sayName()

  d = document.createElement('div')
  d.className = styles.avatar // css modules enabled!
  document.body.appendChild(d)

  d2 = document.createElement('div')
  d2.className = styles.avatar2 // css modules enabled!
  document.body.appendChild(d2)
}

main.dispose = function () {
  console.log('dispose')
  d.remove()
  d2.remove()
}

module.exports = main
