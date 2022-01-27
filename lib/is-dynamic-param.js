const parameterRegexExt = /^\[(\w+)].js$/
const parameterRegex = /^\[(\w+)]$/

module.exports = (pathParameter) => {
	if (parameterRegex.test(pathParameter)) {
		return {
			valid: true,
			regex: parameterRegex,
		}
	}

	if (parameterRegexExt.test(pathParameter)) {
		return {valid: true, regex: parameterRegexExt}
	}

	return {valid: false}
}
