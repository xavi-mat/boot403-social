# SocialMongo

Exercise for [The Bridge](https://thebridge.tech).

https://classroom.google.com/u/0/c/NDgwNDYwMTI2OTAz/a/NTMxNTc5MDgwMjgw/details

> * Build an API for a social network with users, posts and comments.
> * Users can create/update/delete posts
> * Users can comment posts
> * Users can like/unlike posts and comments
> * Users can follow/unfollow other users

### Author

[Xavimat @xavi-mat](@xavi-mat)

### Technologies and dependencies
* JavaScript
* Nodejs
* express
* MongoDB
* Mongoose
* multer
* bcryptjs
* jsonwebtoken
* nodemailer
* Atlas

### Repository
You can fork or clone the code from:
```
https://github.com/xavi-mat/boot403-social
```

### Usage
There are three main blocks of endpoints: `/users`, `/posts`, and `/comments`.

|method|endpoint|role|use|done|
|------|--------|----|---|----|
|POST|`/users`|anyone|Register a new user|[x]|
|POST|`/users/login`|anyone|Login with credentials|[x]|
|GET|`/users`|user|Get own user's data|[x]|
|GET|`/users/confirm/:emailToken`|anyone|Confirm email|[x]|
|GET|`/users/search`|anyone|Search by username|[x]|
|GET|`/users/id/:_id`|user|Get user data by Id|[x]|
|PUT|`/users`|user|Update own information|[x]|
|PUT|`/users/follow/:_id`|user|Follow user by Id|[x]|
|DELETE|`/users/logout`|user|Logout|[x]|
|DELETE|`/users/follow/:_id`|user|Stop following user by Id|[x]|
|POST|`/posts`|user|Create a post|[x]|
|GET|`/posts/id/:_id`|anyone|Get a post by Id|[x]|
|GET|`/posts/search`|anyone|Search a post by title|[x]|
|GET|`/posts`|anyone|Get all posts|[x]|
|PUT|`/posts/like/id/:_id`|user|Like a post by Id|[x]|
|PUT|`/posts/id/:_id`|author|Update own posts by Id|[x]|
|DELETE|`/posts/id/:_id`|author|Delete own post by Id|[x]|
|DELETE|`/posts/like/id/:_id`|user|Stop liking a post by Id|[x]|
|POST|`/comments`|user|Create a comment to a post|[x]|
|GET|`/comments/id/:_id`|anyone|Get a comment by Id|[x]|
|PUT|`/comments/id/:_id`|author|Update own comment by Id|[x]|
|PUT|`/comments/like/:_id`|user|Like a comment by Id|[x]|
|DELETE|`/comments/id/:_id`|author|Delete own comment by Id|[x]|
|DELETE|`/comments/like/:_id`|user|Stop liking a comment by Id|[x]|
|DELETE|`/users/clean-all`|admin|Empty database and seed it randomly|[x]|

See detailed examples of requests and responses in:
https://documenter.getpostman.com/view/11287519/Uz5FLcd7