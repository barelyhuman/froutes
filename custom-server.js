const app = require('./dist/index')
const http = require('http')
const path = require('path')

const PORT = process.env.PORT || 3000

app({
    basePath: path.join(process.cwd(), 'example'),
}).then((appHandler) => {
    http.createServer((req, res) => {
        appHandler(req, res)
    }).listen(PORT, () => {
        console.log('Listening on, ' + PORT)
    })
})
