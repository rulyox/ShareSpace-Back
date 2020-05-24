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
  "result": "number",
  "message": "string"
}
```

* Result Code
```
101 : OK
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
  "post": "string[]"
}
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
