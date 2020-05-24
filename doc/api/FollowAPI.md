# Follow API

## GET /follow/ing/:access

Get user's following list.

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
  "user": "string[]"
}
```

* Response Code
```
101 : OK
201 : User does not exist
```

## GET /follow/er/:access

Get user's follower list.

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
  "user": "string[]"
}
```

* Response Code
```
101 : OK
201 : User does not exist
```

## GET /follow/check/:follower/:following

Check if following.

* Request Param
```
follower : string
following : string
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
  "following": "boolean"
}
```

* Response Code
```
101 : OK
201 : User does not exist
```

## POST /follow

Follow other user.

* Request Header
```
token : string
```

* Request Body JSON
```json
{
  "type": "boolean",
  "access": "string"
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
201 : User does not exist
```
