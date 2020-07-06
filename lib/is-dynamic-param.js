const paramRegexExt = /^\[(\w+)\].js$/
const paramRegex = /^\[(\w+)\]$/

module.exports = (pathParam) => {
    if (paramRegex.test(pathParam)) {
        return {
            valid: true,
            regex: paramRegex,
        }
    }

    if (paramRegexExt.test(pathParam)) {
        return { valid: true, regex: paramRegexExt }
    }

    return { valid: false }
}
