const fs = require('fs').promises
const path = require('path')
const { createRouteParser } = require('./create-route-parser')

let mainRouterTree = {}
let processingDir

module.exports = async (directory) => {
    try {
        processingDir = directory
        await processDirectory(directory, '.')
        return mainRouterTree
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function processDirectory(currPath, dir) {
    try {
        const pathToCheck = path.join(currPath, dir)
        const pathStat = await fs.stat(pathToCheck)
        if (pathStat.isDirectory() && dir !== '.DS_Store') {
            const dirContent = await fs.readdir(pathToCheck)
            const treeMods = dirContent.map(async (fileRecord) => {
                if (fileRecord === '.DS_Store') {
                    return
                }
                const nextPathToCheck = path.join(pathToCheck, fileRecord)
                const nextFile = await fs.stat(nextPathToCheck)

                if (nextFile.isDirectory()) {
                    await processDirectory(pathToCheck, fileRecord)
                } else if (nextFile.isFile()) {
                    processFile(fileRecord, pathToCheck)
                }
                return Promise.resolve()
            })

            await Promise.all(treeMods)
        } else if (pathStat.isFile() && dir !== '.DS_Store') {
            processFile(dir, currPath)
        }
    } catch (err) {
        console.error(err)
        throw err
    }
}

function processFile(file, filePath) {
    const _basePath = processingDir
    const ignoredPath = filePath.replace(_basePath, '')

    const paramRegex = /^\[(\w+)\].js$/
    if (paramRegex.test(file)) {
        const noExt = file.replace('.js', '')
        mainRouterTree[`${ignoredPath}/${noExt}`] = {
            handler: requireHandler(`${filePath}/${file}`),
            parser: createRouteParser(`${ignoredPath}/${noExt}`),
        }
    } else if (file === 'index.js') {
        if (!ignoredPath) {
            mainRouterTree[`/`] = {
                handler: requireHandler(`${filePath}/index.js`),
                parser: createRouteParser(`${ignoredPath}`),
            }
        } else {
            mainRouterTree[`${ignoredPath}`] = {
                handler: requireHandler(`${filePath}/index.js`),
                parser: createRouteParser(`${ignoredPath}`),
            }
        }
    } else {
        const noExt = file.replace('.js', '')
        mainRouterTree[`${ignoredPath}/${noExt}`] = {
            handler: requireHandler(`${filePath}/${file}`),
            parser: createRouteParser(`${ignoredPath}/${noExt}`),
        }
    }
}

function requireHandler(path) {
    const handler = require(path)
    return handler.default || handler
}
