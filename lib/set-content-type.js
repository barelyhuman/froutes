module.exports = (response, type) => {
	let _type = type

	const cases = {
		json: 'application/json',
		buffer: 'application/octet-stream',
		text: 'text/html',
	}

	if (!cases[type]) {
		_type = cases.text
	}

	response.setHeader('Content-Type', _type)
}
