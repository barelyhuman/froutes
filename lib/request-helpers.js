const {Buffer} = require('buffer')
const setContentType = require('./set-content-type.js')

exports.status = (response) => {
	return (code) => {
		if (typeof code !== 'number') {
			throw new TypeError('Status Code should be a number')
		}

		response.statusCode = code
	}
}

exports.send = (response) => {
	return (body) => {
		let _body = body
		if (Buffer.isBuffer(body)) {
			setContentType(response, 'buffer')
		} else if (typeof body === 'string') {
			setContentType(response, 'text')
		} else if (
			typeof body === 'object' ||
			typeof body === 'boolean' ||
			typeof body === 'number'
		) {
			if (_body === null) {
				_body = ''
			}

			_body = JSON.stringify(_body)
			setContentType(response, 'json')
		}

		response.headerSent = true
		response.write(_body)
		response.end()
	}
}
