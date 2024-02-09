# Design Document

This document outlines the goals for the project and the direction I was going towards when I started.

## Justification

APIs stand at the backbone of any multi-app toolchains.  What I have found as part of my software engineering journey is that half of my job is finding existing tools and combining them with other tools to create a new application.  Thus embodying the "DRY" methodology.  

To this end I have found the APIs that use a _discoverability model_ to be the most effective in supporting this technique of application design is the Hypermedia as the engine of application state (HATEOAS) model.  

I started implementing this model by hand in my REST APIs and found one challenge was that my code was no longer DRY.  As part of the HATEOAS model you create a `link` parameter on your response objects which provide details on how to make other API calls:

```sh
# Request
GET /accounts/12345 HTTP/1.1
Host: bank.example.com

# Response
HTTP/1.1 200 OK

{
    "account": {
        "account_number": 12345,
        "balance": {
            "currency": "usd",
            "value": 100.00
        },
        "links": {
            "deposits": "/accounts/12345/deposits",
            "withdrawals": "/accounts/12345/withdrawals",
            "transfers": "/accounts/12345/transfers",
            "close-requests": "/accounts/12345/close-requests"
        }
    }
}
```

In my implementation using ExpressJS, I found myself having to setup the controllers and then separately maintain the links:

```ts
// Controller
import express from 'express';

const app = express();

app.get('/posts', postHandler);
app.get('/posts/:postId', postGetHandler);
app.get('/posts/:postId/comments', postGetCommentsHandler);
```

When returning a value from these endpoints I would construct a DTO for each _Post_ using a `toDTO` method:

```ts
// Data Access Object (DAO)

toDTO(post: PostEntity): PostDTO {
  return ({
    id: post.id,
    name: post.name,
    text: post.text,
    links: {
      comments: `/posts/${post.id}/comments`
    }
  })
}
```

The challenge in this technique is that both the controller path AND the HATEOAS link must be maintained separately since one is a string and one is a dynamic template literal.

I did not like this approach as it exposed the opportunity to for additional human mistakes when the API endpoint changed and the associated HATEOAS links were missed.

---
## Hypermedia As The Engine Of Application State (HATEOAS)

> HATEOAS is a constraint of the REST application architecture that distinguishes it from other network application architectures. With HATEOAS, a client interacts with a network application whose application servers provide information dynamically through hypermedia. A REST client needs little to no prior knowledge about how to interact with an application or server beyond a generic understanding of hypermedia. - [Wikipedia](https://en.wikipedia.org/wiki/HATEOAS)

---
## Proposed Solution

As I thought about this problem more and discussed it with my colleagues, I began to wonder if I could a utility for managing these paths instead of needing to do so manually. In one case someone shared with me a solution of building a URL Builder which is what I am emulating here. 

To this end this NPM module will The goals of builder are:

1. Build a simplified interface for creating and maintaining route strings
2. Build a simplified interface allows for the construction of URLs (including parameters) based on the input route string
3. Build a composable system which allowed full URLs to be constructed instead of needing to maintain multiple instances of the same pattern

### Goal Examples

A simplified interface looks to turn the need for constructing multiple URLs for similar routes into a chain of routes:

```ts
// Traditional Controller
import { Router } from 'express'

const controller = new Router();

controller.get('/', findHandler);
controller.post('/', createHandler)
controller.get('/:id', findByIdHandler)
controller.get('/:id/posts/:postId', getUserPostHandler)
controller.get('/:id/posts/:postId/json', getUserPostJSONHandler)
```

Instead we create a single route for each of the shared posts and reuse them:

```ts
// New Controller | user.controller.ts
import { Router } from 'express'
import { createRoute } from 'javascript-hateos-routes';

createRoute('USERS', '/users')

const controller = new Router();

// Path: /
controller.get('/', findHandler);

// Path: /
controller.post('/', createHandler);

// Path: /:userId
controller.get(createRoute('USERS_ID', '/:userId').path, findByIdHandler);

// Path: /:userId/posts
controller.get(createRoute('USER_POSTS', '/posts', 'USERS_ID').path, getUserPostHandler);

// Path: /:userId/posts/:postId
controller.get(createRoute('POSTS_ID', '/posts/:postId', 'USERS_ID').path, getUserPostHandler);

// Path: /:userId/posts/:postId/json
controller.get(createRoute('POSTS_JSON', '/json', 'POSTS_ID').path, getUserPostJSONHandler);

export controller;
```

This can then be imported normally into a app:

```ts
import express from 'express'
import UserController from './user.controller.ts'
import { getRoute } from 'javascript-hateos-routes';

const USERS_ROUTE = getRoute('USERS');

const app = express();

app.use(USERS_ROUTE.path, UserController);

export app;
```

With the routes defined, we can then re-use them to not only generate the controller path strings but also HATEOS links in our response objects:


```ts
import { getRoute } from 'javascript-hateos-routes';

const USER_WITH_ID = getRoute('USERS_ID');
const USER_POSTS = getRoute('USER_POSTS');

userDTO(user: User): UserDTO {
  return ({
    id: user.id,
    displayName: user.displayName

    links: {
      self: USER_WITH_ID.url({ userId: user.id })
      posts: USER_POSTS.url({ userId: user.id })
    }

    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
}

/*
DTO Result:
  {
    id: 1,
    displayName: 'John Smith'
    createdAt: '2024-02-08T17:01:58.295Z'
    updatedAt: '2024-02-08T17:01:58.295Z'
    links: {
      self: '
    }
  }
*/
```

Importantly, the simplification of the `links` is the end goal of this project.  With this system even if the underlying API changes, developers would not have to update every DTO or link generation _unless_ the parameters changed.