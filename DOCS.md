# Documentation Guidelines

Here is a documentation template you can modify and include in this file.

Things to note:

- When creating the documentation, think about the frontend developer who would be working on integrating your API.
- For the errors, only include the common error responses. You do not have to include the config issues and such.

**POST /api/endpoint**

Request:

```
method: POST
name: string, required
description: string, required
```

Sample Request:

```
{
   "name": "Memorandum",
   "description": "Official notices and communications from SAMAHAN, covering updates, announcements, and directives for the student body."
}
```

Success Response:

```
status: 201
message: string
```

Sample Success Response:

**201 Created**

```
{
   "message": "Category successfully created"
}
```

Error Response:

```
status: 400
message: array[string]
error: string
statusCode: int
```

Sample Error Response:

**400 Bad Request**

```
{
   "message": [
      "name should not be empty"
   ],
   "error": "Bad Request",
   "statusCode": 400
}
```

# API

## POST /api/categories

Request:

```
method: POST
name: string, required
description: string, required
```

Sample Request:

```
{
   "name": "Memorandum",
   "description": "Official notices and communications from SAMAHAN, covering updates, announcements, and directives for the student body."
}
```

Success Response:

```
status: 201 Created
message: string
```

Sample Success Response:

**201 Created**

```
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

```
{
   "message": [
      "name should not be empty"
   ],
   "error": "Bad Request",
   "statusCode": 400
}
```

## PUT /api/categories/{id}

Request:

```
method: PUT
name: string, required
description: string, optional, must not be empty if provided
```

Sample Request:

```
{
   "name": "Memorandum",
}
```

Success Response:

```
status: 200 OK
id: int
name: string
description: string
```

Sample Success Response:

**200 OK**

```
{
   "id": 1,
   "name": "Memorandum",
   "description": "Official notices and communications from SAMAHAN, covering updates, announcements, and directives for the student body."
}
```

Error Response:

```
status: 400 Bad Request, 404 Not Found
message: string | array[string]
error: string
statusCode: int
```

Sample Error Response:

**404 Not Found**

```
{
   "message": "Category with id 31 not found",
   "error": "Not Found",
   "statusCode": 404
}
```

## GET /api/categories

This endpoint retrieves a list of all categories.

Request

- **Method:** GET
- No request body or parameters are required.

Sample Request

```
GET /api/categories
```

Success Response

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

## DELETE /api/category/{id}

Sample Request:

```
DELETE /api/category/28
```

Sample Success Response:

**200 OK**

```
{
  "message": "Category successfully deleted"
}
```

Error Response:

**400 Bad Request**

```
{
  "message": "Category in use, cannot delete",
  "statusCode": 400
}
```

**404 Not Found**

```
{
   "message": "Category with id 28 not found",
   "error": "Not Found",
   "statusCode": 404
}
```

## POST /api/bulletins

Request:

```
method: POST
cathegory_id: int, required
title: string, required
content: string, required
author: string, required
pdf_attachemnt: pdf[], optional
```

Sample Request:

**201 Created**

Happens when either pdf is provided or not.

```
{
  "statusCode": 201,
  "message": "Bulletin created successfully"
}
```

Error Response:

**400 Bad Request**

Specific message appears on which field is mising

```
{
  "message": [
    "Category doesnt exists",
    "Title is required",
    "Content is required",
    "Author is required"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
