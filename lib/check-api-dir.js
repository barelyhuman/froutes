module.exports = (dirs) => {
    const exists = dirs.find((item) => item === 'api')
    const valid = exists ? true : false
    return { valid, path: exists }
}
