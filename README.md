# Routex

A minimal file tree based api router for building rest api's with node.

### Motivation

I'm one of the many people who use [Next.js(Vercel)](https://github.com/vercel/next.js) and while the whole framework is great, I'm a huge fan of the API routes mechanism and thought I'd implement my own version of it so I can continue having seperate backend and frontend code while having the ease of writing api routes also, wanted to learn how this stuff works. (I'm curious like that).

### Roadmap (as of now)

-   [x] Start of simple with something that can handle static routes.
-   [x] Add simple CLI tool to be used with it
-   [ ] Add Dynamic paths and parameter parsing.
-   [ ] Add minimal request and response helpers.
-   [ ] Add more features to CLI (reloading, watchers, etc, etc)

That's all I want the `routex` to do for now.

### Warning

This library is still in active development and is bound to have bugs , kindly make sure you use it only for testing and not for production as of now.

### Current Limitations

-   A very limited cli, no hot reload, no file watcher, it literally just runs a simple processor for reading the file system as of now.

-   Only dynamic files are supported, not dynamic folders so you can't possible create a folder structure for a route like `/api/user/:id/posts`. But you can create routes like `/api/user/:id` and `/api/user/posts/:id`. (Ahead on the roadmap)

-   Since the lib uses the native node HTTP right now, you are limited to it's request and response functions.

### Usage

Any file inside the folder `api` is mapped to `/api/*` and will be treated as an API endpoint and all HTTP requests will be passed to this file. GET, POST, PUT, DELETE

```sh
# for global install to avoid installing the devDependencies
npm i -g barelyhuman/routex --only=prod
# for local install to avoid installing the devDependencies
npm i barelyhuman/routex --only=prod
```

Then go ahead and create directories and files under the `api` folder as mentioned or check the `examples` folder for reference.

Example file tree:

```
- api
  - me.js // this compiles to <host>:<port>/api/me
  - [id].js; // this compile to <host>:<port>/api/<dynamicParameterId>
```

Example `me.js` that only handles `GET` requests:

```
module.exports = (req, res) => {
  if(req.method === 'GET'){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Hello World!');
    res.end();
    return;
  }

  res.statusCode = 404;
  res.end();
  return;
};


```

Example `[id].js` that handles the dynamic path param:

`GET|POST|DELETE /api/1`

```
module.exports = (req, res) => {
    res.write('path param ' + JSON.stringify(req.params)) // {"id":1};
    res.end();
};

```

Then run routex on the root folder of the project, this folder should contain the `api` folder

```sh
# If installed globally
routex
# If installed locally
npx routex

```

### Rules

-   No copying of code from Next.js
-   Don't use micro, setup and parse node http from scratch
-   Avoid 3rd party npm modules as much as possible
