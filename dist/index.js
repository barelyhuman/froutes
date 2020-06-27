#!/usr/bin/env node
module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(964);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 22:
/***/ (function(module, __unusedexports, __webpack_require__) {

const basePath = __webpack_require__(973);
const path = __webpack_require__(622);
const parseUrl = __webpack_require__(304);
const { send, status } = __webpack_require__(876);

module.exports = async (availableRoutes, req, res) => {
    try {
        const parsedRouteUrl = parseUrl(req.url);
        let handlerPath = '';
        let currentPointer = availableRoutes;

        // Attach Helpers
        res.send = send(res);
        res.status = status(res);
        //

        parsedRouteUrl.forEach((item) => {
            let matchingKey;
            if (!currentPointer[item]) {
                matchingKey = Object.keys(currentPointer).find(
                    (key) =>
                        currentPointer[key].params &&
                        currentPointer[key].params.length > 0
                );

                if (matchingKey) {
                    currentPointer = currentPointer[matchingKey];
                    const key = matchingKey.replace(/[\[\]]/g, '');
                    req.params = {
                        ...req.params,
                        [key]: item,
                    };
                } else {
                    currentPointer = null;
                    return;
                }
            } else {
                currentPointer = currentPointer[item];
            }

            if (currentPointer) {
                if (currentPointer.type === 'file') {
                    handlerPath += currentPointer.index;
                } else {
                    if (matchingKey) {
                        handlerPath += matchingKey + '/';
                    } else {
                        handlerPath += item + '/';
                    }
                }
            }
        });

        if (!currentPointer || !currentPointer.type) {
            res.statusCode = 404;
            res.end();
            return;
        }

        if (currentPointer.type === 'dir') {
            if (currentPointer.index) {
                handlerPath += currentPointer.index;
            } else {
                res.statusCode = 404;
                res.end();
                return;
            }
        }

        let _handlerPath = path.join(basePath(), handlerPath);

        req.query = parsedRouteUrl.query;

        const handler = require(_handlerPath);

        return handler(req, res);
    } catch (err) {
        console.error(err);
        res.statusCode(500);
        res.end();
        throw err;
    }
};


/***/ }),

/***/ 66:
/***/ (function(module) {

module.exports = (dirs) => {
    const exists = dirs.find((item) => item === 'api');
    const valid = exists ? true : false;
    return { valid, path: exists };
};


/***/ }),

/***/ 104:
/***/ (function(module, __unusedexports, __webpack_require__) {

const basePath = __webpack_require__(973);
const fs = __webpack_require__(747);
const path = __webpack_require__(622);

module.exports = async () => {
    try {
        const creationPath = path.join(basePath(), '.route');
        const exists = await new Promise((resolve, reject) => {
            fs.stat(creationPath, (err, stat) => {
                if (
                    (err && err.code === 'ENOENT') ||
                    (err && err.code === 'ENOTDIR')
                ) {
                    resolve(false);
                }
                return resolve(true);
            });
        });

        if (exists) {
            return creationPath;
        } else {
            await new Promise((resolve, reject) => {
                fs.mkdir(creationPath, (err, done) => {
                    if (err) reject(err);
                    resolve(done);
                });
            });
        }

        return creationPath;
    } catch (err) {
        console.error(err);
        throw err;
    }
};


/***/ }),

/***/ 116:
/***/ (function(module, __unusedexports, __webpack_require__) {

const basePath = __webpack_require__(973);
const fs = __webpack_require__(747);
const path = __webpack_require__(622);
const checkApiDir = __webpack_require__(66);
const processDirectories = __webpack_require__(239);

module.exports = () => {
    fs.readdir(basePath(), function (err, dirs) {
        if (err) throw err;
        const apiDirExists = checkApiDir(dirs);
        if (!apiDirExists.valid) {
            throw new Error('cannot find an `api` directory');
        }
        const processingPath = path.join(basePath());
        return processDirectories(processingPath);
    });
};


/***/ }),

/***/ 168:
/***/ (function(module, __unusedexports, __webpack_require__) {

const fs = __webpack_require__(747).promises;
const path = __webpack_require__(622);

module.exports = async (directory) => {
    try {
        const routeTree = {};

        let currentPointer = routeTree;

        await processDirectory(directory, 'api', currentPointer);

        return routeTree;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function processDirectory(currPath, dir, pointer) {
    try {
        const pathToCheck = path.join(currPath, dir);
        const pathStat = await fs.stat(pathToCheck);
        if (pathStat.isDirectory()) {
            const dirContent = await fs.readdir(pathToCheck);
            const treeMods = dirContent.map(async (fileRecord) => {
                const nextPathToCheck = path.join(pathToCheck, fileRecord);
                const nextFile = await fs.stat(nextPathToCheck);
                const nextPointer =
                    pointer[dir] ||
                    (pointer[dir] = {
                        type: 'dir',
                    });
                const paramRegex = /^\[(\w+)\]$/;
                if (paramRegex.test(dir)) {
                    debugger;
                    const matchingParams = dir.match(paramRegex);
                    const param = matchingParams[1];
                    pointer[dir].params = [param];
                    debugger;
                }

                if (nextFile.isDirectory()) {
                    await processDirectory(
                        pathToCheck,
                        fileRecord,
                        nextPointer
                    );
                } else if (nextFile.isFile()) {
                    processFile(fileRecord, nextPointer);
                }
                return Promise.resolve();
            });

            await Promise.all(treeMods);
        } else if (pathStat.isFile()) {
            processFile(dir, pointer);
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

function processFile(file, pointer) {
    const paramRegex = /^\[(\w+)\].js$/;
    if (paramRegex.test(file)) {
        const matchingParams = file.match(paramRegex);
        const param = matchingParams[1];
        const noExt = file.replace('.js', '');
        const valuesInsertion = {
            type: 'file',
            params: [param],
            index: file,
        };
        pointer[noExt] = valuesInsertion;
    } else if (file === 'index.js') {
        pointer.type = 'dir';
        pointer.index = 'index.js';
    } else {
        const noExt = file.replace('.js', '');
        const valuesInsertion = {
            type: 'file',
            index: file,
        };
        pointer[noExt] = valuesInsertion;
    }
}


/***/ }),

/***/ 191:
/***/ (function(module) {

module.exports = require("querystring");

/***/ }),

/***/ 239:
/***/ (function(module, __unusedexports, __webpack_require__) {

const fs = __webpack_require__(747);
const path = __webpack_require__(622);
const createRouteDir = __webpack_require__(104);
const createAvailableRoutes = __webpack_require__(168);
const ora = __webpack_require__(256);

module.exports = async (directory) => {
    const spinner = ora('Compiling...').start();
    try {
        const availableRoutesTree = await createAvailableRoutes(directory);

        const routePath = await createRouteDir();

        await new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(routePath, 'routes.json'),
                JSON.stringify(availableRoutesTree),
                (err, done) => {
                    if (err) reject(err);
                    resolve(done);
                }
            );
        });

        setTimeout(() => {
            spinner.succeed('Compiled');
        }, 1000);
    } catch (err) {
        spinner.color = 'red';
        spinner.text = 'Failed';
        spinner.fail();
        console.error(err);
        throw err;
    }
};


/***/ }),

/***/ 256:
/***/ (function(module) {

module.exports = eval("require")("ora");


/***/ }),

/***/ 304:
/***/ (function(module, __unusedexports, __webpack_require__) {

const querystring = __webpack_require__(191);

module.exports = (url) => {
    const tokens = url.split('/').filter((item) => item);
    const query = tokens[tokens.length - 1].split('?');
    let queryParams = {};
    if (query[1]) {
        queryParams = querystring.parse(query[1]);
    }
    const paths = tokens.slice(0, tokens.length - 1).concat(query[0]);
    return {
        paths,
        query: queryParams,
    };
};


/***/ }),

/***/ 427:
/***/ (function(module) {

module.exports = (res, type) => {
    let _type = type;

    const cases = {
        json: 'application/json',
        buffer: 'application/octet-stream',
        text: 'text/html',
    };

    if (!cases[type]) {
        _type = cases.text;
    }

    res.setHeader('Content-Type', _type);
    return;
};


/***/ }),

/***/ 544:
/***/ (function(module, __unusedexports, __webpack_require__) {

const router = __webpack_require__(22);
const getAvailableRoutes = __webpack_require__(917);

module.exports = async (req, res) => {
    try {
        const availableRoutes = await getAvailableRoutes();

        return router(availableRoutes, req, res);
    } catch (err) {
        console.error(err);
        throw err;
    }
};


/***/ }),

/***/ 605:
/***/ (function(module) {

module.exports = require("http");

/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 876:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

const setContentType = __webpack_require__(427);

exports.status = (res) => {
    return (code) => {
        if (typeof code !== 'number') {
            throw new Error('Status Code should be a number');
        }
        return (res.statusCode = code);
    };
};

exports.send = (res) => {
    return (body) => {
        let _body = body;
        if (Buffer.isBuffer(body)) {
            setContentType(res, 'buffer');
        } else if (typeof body === 'string') {
            setContentType(res, 'text');
        } else if (
            typeof body === 'object' ||
            typeof body === 'boolean' ||
            typeof body === 'number'
        ) {
            if (_body === null) {
                _body = '';
            }
            _body = JSON.stringify(_body);
            setContentType(res, 'json');
        }

        res.write(_body);
        res.end();
        return;
    };
};


/***/ }),

/***/ 917:
/***/ (function(module, __unusedexports, __webpack_require__) {

const fs = __webpack_require__(747);
const createRouteDir = __webpack_require__(104);
const path = __webpack_require__(622);

module.exports = async () => {
    try {
        const routeDir = await createRouteDir();

        return new Promise((resolve, reject) => {
            fs.readFile(path.join(routeDir, 'routes.json'), (err, data) => {
                if (err) reject(err);
                resolve(JSON.parse(Buffer.from(data).toString()));
            });
        });
    } catch (err) {
        console.error(err);
        throw err;
    }
};


/***/ }),

/***/ 964:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {


const microServer = __webpack_require__(544);
const setupRoutes = __webpack_require__(116);
const http = __webpack_require__(605);
const PORT = process.env.PORT || 3000;

setupRoutes();

http.createServer((req, res) => {
    microServer(req, res);
}).listen(PORT, () => {
    console.log('> Listening on ' + PORT);
});


/***/ }),

/***/ 973:
/***/ (function(module) {

module.exports = () => {
    const currPath = `${process.cwd()}`;
    return currPath;
};


/***/ })

/******/ });