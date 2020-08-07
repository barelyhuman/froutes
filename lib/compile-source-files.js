const mkdirp = require('mkdirp')
const path = require('path')
const { exec } = require('child_process')

const { compilationDirectory } = require('./create-compilation-dir')

module.exports = async (directory) => {
    try {
        const routesDir = path.join(compilationDirectory, 'routes')
        mkdirp(routesDir)

        return new Promise((resolve, reject) => {
            const babel = exec(
                `npx babel ${directory} --out-dir ${routesDir}`,
                function (error, stdout, stderr) {
                    if (error) {
                        console.error(error.stack)
                        console.error('Error code: ' + error.code)
                        console.error('Signal received: ' + error.signal)
                        reject()
                    }
                    resolve()
                }
            )
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}
