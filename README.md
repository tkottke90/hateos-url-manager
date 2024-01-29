# javscript-hateos-router

NodeJS utility for managing path segments and the creation of HATEOAS links.

---
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

> HATEOAS is a constraint of the REST application architecture that distinguishes it from other network application architectures. With HATEOAS, a client interacts with a network application whose application servers provide information dynamically through hypermedia. A REST client needs little to no prior knowledge about how to interact with an application or server beyond a generic understanding of hypermedia. - Wikipedia

