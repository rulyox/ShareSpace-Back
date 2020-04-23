# Web API

Uses REST API.

## /user

### POST /user/token

Check login and create token.

* Request Body JSON
```json
{
  "email": "string", 
  "pw": "string"
}
```

* Response JSON
```json
{
  "result": "number",
  "message": "string",
  "token": "string"
}
```

* Result Code
```
101 : OK
201 : Wrong email or password
```

### GET /user

Login.

* Request Header
```
token : string
```

* Response JSON
```json
{
  "id": "number",
  "email": "string",
  "name": "string"
}
```

### POST /user

Sign up.

* Request Body JSON
```json
{
  "email": "string",
  "pw": "string",
  "name": "string"
}
```

* Response JSON
```json
{
  "result": "number",
  "message": "string"
}
```

* Result Code
```
101 : OK
201 : Email exists
```

### POST /user/image

Add profile image.

* Request Header
```
token : string
```

* Request Form
```
files
```

* Response JSON
```json
{
  "result": "boolean"
}
```

### GET /user/data/:id

Get user data.

* Request Param
```
id : number
```

* Response JSON
```json
{
  "name": "string"
}
```

## /post

### POST /post

Write new post.

* Request Header
```
token : string
```

* Request Form
```
text : string
files
```

* Response JSON
```json
{
  "postId": "number"
}
```

### GET /post/user/:id

Get post list by user.

* Request Header
```
token : string
```

* Request Param
```
id : number
```

* Request Query
```
start : number (starts from 0)
count : number
```

* Response JSON
```json
{
  "result": "number",
  "message": "string",
  "total": "number",
  "list": "number[]"
}
```

* Result Code
```
101 : OK
201 : Wrong range
```

### GET /post/data/:id

Get post data.

* Request Header
```
token : string
```
  
* Request Param
```
id : number
```
  
* Response JSON
```json
{
  "result": "number",
  "message": "string",
  "data": "{user: number, name: string, text: string, image: string[]}"
}
```

* Result Code
```
101 : OK
201 : Post does not exist
```

### GET /post/image/:post/:image

Get image file.

Request Header
```
token : string
```

Request Param
```
post : number
image: string
```

Response
```
image file
```

### GET /post/feed

Get feed.

* Request Header
```
token : string
```

* Request Query
```
start : number (starts from 0)
count : number
```

* Response JSON
```json
[
  {
    "author": "number",
    "post": "string"
  }
]
```
