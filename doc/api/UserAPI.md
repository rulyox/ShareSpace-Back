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
  "code": "number",
  "message": "string",
  "result": "json"
}
```

* Response JSON Result
```json
{
  "token": "string"
}
```

* Response Code
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
  "code": "number",
  "message": "string",
  "result": "json"
}
```

* Response JSON Result
```json
{
  "access": "string",
  "email": "string",
  "name": "string"
}
```

* Response Code
```
101 : OK
201 : User does not exist
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
  "code": "number",
  "message": "string"
}
```

* Response Code
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
  "code": "number",
  "message": "string",
  "result": "json"
}
```

* Response JSON Result
```json
{
  "name": "string",
  "image": "string"
}
```

* Response Code
```
101 : OK
201 : User does not exist
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

* Response Code
```
101 : OK
201 : User does not exist
202 : No profile image
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
  "code": "number",
  "message": "string"
}
```

* Response Code
```
101 : OK
```
