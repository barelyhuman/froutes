module.exports = (dirs) => {
	const exists = dirs.find((item) => item === 'api')
	const valid = Boolean(exists)
	return {valid, path: exists}
}
