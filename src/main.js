import People from './people'
import p from './p.jsx'
import styles from './style.css'

console.log(p)	// test jsx

const lily = new People('Lily')
lily.sayName()

const d = document.createElement('div')
d.className = styles.avatar // css modules enabled!
document.body.appendChild(d)

const d2 = document.createElement('div')
d2.className = styles.avatar2 // css modules enabled!
document.body.appendChild(d2)

