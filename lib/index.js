const fastn = require('./services/fastn')

const app = fastn('div', 'hello')

app.render()

document.body.appendChild(app.element)
