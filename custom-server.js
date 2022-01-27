const http = require('http')
const path = require('path')
const process = require('process')
const app = require('./dist/index.js')

const PORT = process.env.PORT || 3000

app({
	basePath: path.join(process.cwd(), 'example'),
}).then((appHandler) => {
	http
		.createServer((request, response) => {
			appHandler(request, response)
		})
		.listen(PORT, () => {
			console.log('Listening on, ' + PORT)
		})
})
