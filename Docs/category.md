# API

## GET /api/categories


Success Response:

- **Status:** 200 OK
- **Description:** A list of categories.

Sample Success Response

```json
[
  {
    "id": 1,
    "name": "Technology",
    "description": "Articles and updates related to technology."
  },
  {
    "id": 2,
    "name": "Health",
    "description": "Information and tips on maintaining good health."
  }
]
```

## POST /api/category

Request:

```
method: POST
name: string, required
description: string, required
```

Sample Request:

```json
{
   "name": "Memorandum",
   "description": "Official notices and communications from SAMAHAN, covering updates, announcements, and directives for the student body."
}
```

Success Response:

```json
status: 201 Created
message: string
```

Sample Success Response:

**201 Created**

```json
{
   "message": "Category successfully created"
}
```

Error Response:

```
status: 400 Bad Request
message: array[string]
error: string
statusCode: int
```

Sample Error Response:

**400 Bad Request**

```json
{
   "message": [
      "name should not be empty"
   ],
   "error": "Bad Request",
   "statusCode": 400
}
```

## PUT /api/category/{id}

Request:

```
method: PUT
name: string, required
description: string, optional, must not be empty if provided
```

Sample Request:

```json
{
   "name": "Memorandum",
}
```

Success Response:

```json
status: 200 OK
id: int
name: string
description: string
```

Sample Success Response:

**200 OK**

```json
{
   "id": 1,
   "name": "Memorandum",
   "description": "Official notices and communications from SAMAHAN, covering updates, announcements, and directives for the student body."
}
```

Error Response:

```json
status: 400 Bad Request, 404 Not Found
message: string | array[string]
error: string
statusCode: int
```

Sample Error Response:

**404 Not Found**

```json
{
   "message": "Category with id 31 not found",
   "error": "Not Found",
   "statusCode": 404
}
```

## DELETE /api/category/{id}

Sample Request:

```json
DELETE /api/category/28
```

Sample Success Response:

**200 OK**

```json
{
  "message": "Category successfully deleted"
}
```

Error Response:

**400 Bad Request**

```json
{
  "message": "Category in use, cannot delete",
  "statusCode": 400
}
```

**404 Not Found**

```json
{
   "message": "Category with id 28 not found",
   "error": "Not Found",
   "statusCode": 404
}
```