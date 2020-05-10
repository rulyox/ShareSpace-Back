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

Login using token.

* Request Header
```
token : string
```

* Response JSON
```json
{
  "access": "string",
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

### GET /user/data/:access

Get user data.

* Request Param
```
access : string
```

* Response JSON
```json
{
  "name": "string",
  "image": "string"
}
```

### GET /user/image/:access

Get profile image.

* Request Param
```
access : string
```

Response
```
image file
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
  "result": "number",
  "message": "string"
}
```

* Result Code
```
101 : OK
```

### GET /post/data/:access

Get post data.

* Request Header
```
token : string
```
  
* Request Param
```
access : string
```

* Response JSON
```json
{
  "result": "number",
  "message": "string",
  "data": {
    "user": "string",
    "name": "string",
    "profile": "string",
    "text": "string",
    "image": "string[]"
  }
}
```

* Result Code
```
101 : OK
201 : Post does not exist
```

### GET /post/preview/:access

Get post preview.

* Request Header
```
token : string
```
  
* Request Param
```
access : string
```

* Response JSON
```json
{
  "result": "number",
  "message": "string",
  "data": {
    "user": "string",
    "name": "string",
    "profile": "string",
    "text": "string",
    "image": "string"
  }
}
```

* Result Code
```
101 : OK
201 : Post does not exist
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
{
  "post": "string[]"
}
```

### GET /post/user/:access

Get post list by user.

* Request Header
```
token : string
```

* Request Param
```
access : string
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
  "list": "string[]"
}
```

* Result Code
```
101 : OK
201 : Wrong range
```

### GET /post/image/:access/:image

Get image file.

Request Header
```
token : string
```

Request Param
```
access : string
image: string
```

Response
```
image file
```
