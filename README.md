# Javascript HATEOAS Route Manager

[![Release](https://github.com/tkottke90/hateos-url-manager/actions/workflows/build.yaml/badge.svg?event=release)](https://github.com/tkottke90/hateos-url-manager/actions/workflows/build.yaml)

[![Build](https://github.com/tkottke90/hateos-url-manager/actions/workflows/build.yaml/badge.svg)](https://github.com/tkottke90/hateos-url-manager/actions/workflows/build.yaml)

NodeJS utility for managing path segments and the creation of [HATEOS](https://en.wikipedia.org/wiki/HATEOAS) links. This project is born out of the desire to make the APIs I create more _discoverable_.

- [Javascript HATEOAS Route Manager](#javascript-hateoas-route-manager)
  - [Install](#install)
  - [Usage](#usage)
  - [Path vs Full Path](#path-vs-full-path)
  - [Query \& Hash Parameters](#query--hash-parameters)

---
## Install

To install, simply install the github repository:

```bash
npm install git+ssh://git@github.com/tkottke90/javscript-hateos-router.git
```

---
## Usage

The core unit in this module is the `Route`.  Each route is defined by a path string (without a leading slash)

```ts
import { Route } from '@tkottke/javscript-hateos-routes';

const POSTS = new Route('posts');
const POST_WITH_ID = POSTS.nest(':postId')
```

The route instance primarily has 2 functions:
1. Provide a express path string for controller configuration (using the `path` property)
2. Provide a mechanism for creating fully qualified copies of those urls (using the `url()` class method)

Once you have your route instance created, you can then apply that to your controller:

```ts
import express from 'express';
import { POSTS, POST_WITH_ID } from './routes/posts'
import { getPostHandler, getPostByIDHandler } from './controllers/posts';

const app = express();

app.use(POSTS.path, getPostHandler);
app.use(POST_WITH_ID.path, getPostByIDHandler);

export app;
```

To generate a _link_ url, you can then use the `url` method to output a populated copy of that url:

```ts
import { Request, Response, NextFunction } from 'express';
import { POST_WITH_ID } from '../routes/posts'

export function getPostByIDHandler(req: Request, res: Response, next: NextFunction) {
  const post = db.post.getById();

  res.json({
    id: post.id,
    author: post.author,
    createdAt: post.createdAt
    comments: [],

    links: {
      self: POST_WITH_ID.url({ postId: post.id })
    }
  })
}
```

The `POST_WITH_ID` route has 1 defined parameter (`:postId`) which the class is able to identify from the input string (`:postId`).  This function would output the following JSON body to the caller: 

```json
{
  "id": 1,
  "author": "John Smith",
  "createdAt": "2024-02-08T17:01:58.295Z",
  "comments": [],
  "links": {
    "self": "/posts/1"
  }
}
```

---
## Path vs Full Path

One of the primary pillars of this library was the ability to compose routes.  The benefit of composition is it allows for for the avoidance of repeated path string.  The challenge that comes with this approach is that the `url` function needs _all_ the route parameters which may be defined in a parent route.

Related to this challenge there are 2 properties defined on a _Route_ related to the Route's underlying path:

**path**: The `path` property matches what is passed into the `new Route()` or `Route.nested()`. This string is exposed for use with controllers and when constructing routes it is imperative that you think about your routes from the perspective of your controller as this is what you would otherwise define as the path pattern for your controller 

**fullPath**: The `fullPath` property includes every portion of the path related to that _Route_ instance.  This would allow you to define routes at a global level without nesting.

The following example shows the route setup for User endpoints and a endpoint related to Posts related to that user:

```ts
import { Route } from '@tkottke/javscript-hateos-routes';

const USERS = new Route('users');
const USERS_WITH_ID = USERS.nested(':userId');
const USERS_POSTS = USERS.nested(':userId/posts');
```

If we inspect the _USERS\_WITH\_POSTS_ properties we will see the following:

```ts
console.log('Path: ', USERS_POSTS.path);
console.log('Full Path: ', USERS_POSTS.fullPath);

// Output
// 
// Path: /:userId/posts
// Full Path: /users/:userId/posts
```

If you are using ExpressJS and their `Router` module, you would want to use the `path` property because you would be assigning other parts of your path at the `router.use` or `app.use` level:

```ts
import { Router } from 'express';
import { USERS_WITH_ID, USERS_POSTS } from '../routes/posts'

const userController = Router();

userController.get('/', findUserHandler);
userController.get(USERS_WITH_ID.path, getUserByIdHandler);
userController.get(USERS_POSTS.path, getUsersPostsHandler);

export userController;
```

In your server setup you may then use the router with the root `USER` route definition:

```ts
import express from 'express';
import UserController from './controllers/user.controller';
import { USERS } from './routes'

const app = express();

app.use(USERS.path, UserController);

export app;
```

**Alternatively**, if you were creating a simple API where segmentation did not make sense, you could recreate the same effect by using the **fullPath** property:

```ts
import express from 'express';
import UserController from './controllers/user.controller';
import { USERS, USERS_WITH_ID, USERS_POSTS } from './routes'

const app = express();

app.get(USERS.fullPath, findUserHandler);            // /users
app.get(USERS_WITH_ID.fullPath, getUserByIdHandler); // /users/:userId
app.get(USERS_POSTS.fullPath, getUsersPostsHandler); // /users/:userId/posts

export app;
```

---
## Query & Hash Parameters

The `url` method is designed to populate a path to a resource.  This typically is done using "_path parameters_" or items in the url path itself to target a resource.  However, you may want to accommodate other urls that use search or hash parameters.  

To support this you can 

```ts
import { Request, Response, NextFunction } from 'express';
import { USERS } from '../routes/users'

export function getPostByIDHandler(req: Request, res: Response, next: NextFunction) {
  const user = db.user.getById();

  res.json({
    id: user.id,
    displayName: user.display,
    createdAt: user.createdAt

    links: {
      self: USERS.url(undefined, { query: { userId: user.id } })
    }
  })
}
```

This will produce the following output:

```json
{
  "id": 1,
  "author": "John Smith",
  "createdAt": "2024-02-08T17:01:58.295Z",

  "links": {
    "self": "/users?userId=1"
  }
}
```

Same thing if you pass the `hash` property:

```json
{
  "id": 1,
  "author": "John Smith",
  "createdAt": "2024-02-08T17:01:58.295Z",

  "links": {
    "self": "/users#profile"
  }
}
```