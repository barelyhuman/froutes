# Route

A simple file tree based api router for node based application.

### Motivation

I'm one of the many people who use [Next.js(Vercel)](https:github.com/vercel/next.js) and while the whole framework is great, I really like the API routes mechanism and thought I'd implement my own to avoid having to bundle the whole monolith. Thus, reducing the size of the overall application. And also to learn how this stuff works. (I'm curious like that).

### Roadmap (as of now)

-   [x] Start of simple with something that can handle static routes.
-   [ ] Add CLI tool to be used with it
-   [ ] Add Dynamic paths and parameter parsing.
-   [ ] Add extensive middleware support
-   [ ] Ability to compile each api file with all it's requirements

That's all I want the route to do for now.

### Rules

-   No copying from Next.js
-   Don't use micro, setup and parse node http from scratch
-   Avoid 3rd party npm modules as much as possible
