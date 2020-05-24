# User API

## POST /user/token

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
201 : Wrong email
202 : Wrong password
```

## GET /user

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

## POST /user

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

## GET /user/data/:access

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

## GET /user/image/:access

Get profile image.

* Request Param
```
access : string
```

Response
```
image file
```

## POST /user/image

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
