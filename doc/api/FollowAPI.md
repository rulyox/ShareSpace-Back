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
  "user": "string[]"
}
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
  "user": "string[]"
}
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
  "following": "boolean"
}
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
  "result": "boolean"
}
```
