const fs = require('fs').promises
const path = require('path')
const basePath = require('./base-path')

let mainRouterTree = {}

module.exports = async (directory) => {
    try {
        const routeTree = {}
        let currentPointer = routeTree
        await processDirectory(directory, '.', currentPointer)
        console.log({ mainRouterTree: JSON.stringify(mainRouterTree) })
        return routeTree
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function processDirectory(currPath, dir, pointer) {
    try {
        const pathToCheck = path.join(currPath, dir)
        const pathStat = await fs.stat(pathToCheck)
        if (pathStat.isDirectory()) {
            const dirContent = await fs.readdir(pathToCheck)
            const treeMods = dirContent.map(async (fileRecord) => {
                const nextPathToCheck = path.join(pathToCheck, fileRecord)
                const nextFile = await fs.stat(nextPathToCheck)
                const nextPointer =
                    pointer[dir] ||
                    (pointer[dir] = {
                        type: 'dir',
                    })
                const paramRegex = /^\[(\w+)\]$/
                if (paramRegex.test(dir)) {
                    const matchingParams = dir.match(paramRegex)
                    const param = matchingParams[1]
                    pointer[dir].params = [param]
                }

                if (nextFile.isDirectory()) {
                    await processDirectory(pathToCheck, fileRecord, nextPointer)
                } else if (nextFile.isFile()) {
                    processFile(fileRecord, nextPointer, pathToCheck)
                }
                return Promise.resolve()
            })

            await Promise.all(treeMods)
        } else if (pathStat.isFile()) {
            processFile(dir, pointer, currPath)
        }
    } catch (err) {
        console.error(err)
        throw err
    }
}

function processFile(file, pointer, filePath) {
    const _basePath = basePath()
    const ignoredPath = filePath.replace(_basePath, '')

    const paramRegex = /^\[(\w+)\].js$/
    if (paramRegex.test(file)) {
        const matchingParams = file.match(paramRegex)
        const param = matchingParams[1]
        const noExt = file.replace('.js', '')
        const valuesInsertion = {
            type: 'file',
            params: [param],
            index: require(`${filePath}/${file}`),
        }
        mainRouterTree[`${ignoredPath}/${noExt}`] = file
        pointer[noExt] = valuesInsertion
    } else if (file === 'index.js') {
        pointer.type = 'dir'
        pointer.index = require(`${filePath}/index.js`)
        mainRouterTree[`${ignoredPath}`] = 'index.js'
    } else {
        const noExt = file.replace('.js', '')
        const valuesInsertion = {
            type: 'file',
            index: require(`${filePath}/${file}`),
        }
        mainRouterTree[`${ignoredPath}/${noExt}`] = file
        pointer[noExt] = valuesInsertion
    }
}
