# Post API

## POST /post

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
  "code": "number",
  "message": "string"
}
```

* Response Code
```
101 : OK
```

## DELETE /post/:access

Write new post.

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
  "code": "number",
  "message": "string"
}
```

* Response Code
```
101 : OK
201 : Post does not exist
202 : No authorization
```

## GET /post/data/:access

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
  "code": "number",
  "message": "string",
  "result": "json"
}
```

* Response JSON Result
```json
{
  "user": "string",
  "name": "string",
  "profile": "string",
  "text": "string",
  "image": "string[]"
}
```

* Response Code
```
101 : OK
201 : Post does not exist
```

## GET /post/preview/:access

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
  "code": "number",
  "message": "string",
  "result": "json"
}
```

* Response JSON Result
```json
{
  "user": "string",
  "name": "string",
  "profile": "string",
  "text": "string",
  "image": "string"
}
```

* Response Code
```
101 : OK
201 : Post does not exist
```

## GET /post/feed

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
  "code": "number",
  "message": "string",
  "result": "json"
}
```

* Response JSON Result
```json
{
  "post": "string[]"
}
```

* Response Code
```
101 : OK
```

## GET /post/user/:access

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
  "code": "number",
  "message": "string",
  "result": "json"
}
```

* Response JSON Result
```json
{
  "total": "number",
  "list": "string[]"
}
```

* Response Code
```
101 : OK
201 : User does not exist
201 : Wrong range
```

## GET /post/image/:access/:image

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

* Response Code
```
101 : OK
201 : Post does not exist
202 : Image does not exist
```
