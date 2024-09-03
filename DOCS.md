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

## GET /api/bulletins
This endpoint retrieves a list of all bulletins.

```
Method: GET
Path: /api/bulletins
Query Parameters: 
- Page: The current page number. Default is 1
- Limit: The maximum number of items to return per page. Default is 10
```

Example Requests
```
GET /api/bulletins
GET /api/bulletins?page=2
GET /api/bulletins?page=2&limit=15
```

Success Response

- **Status:** 200 OK

Sample Success Response

```json
[
  {
      "id": 50,
      "category_id": 14,
      "title": "Stella aeneus amor.",
      "content": "Culpa aperte subiungo.",
      "author": "Rafael Kozey",
      "created_at": "2024-09-01T12:26:00.485Z",
      "updated_at": "2024-09-01T12:26:00.485Z",
      "deleted_at": null,
      "pdfAttachments": [
         {
               "id": 26,
               "bulletin_id": 50,
               "file_path": "/usr/share/mug_upbeat.avi",
               "created_at": "2024-09-01T12:26:00.577Z",
               "updated_at": "2024-09-01T12:26:00.577Z",
               "deleted_at": null
         }
      ],
      "category": {
         "id": 14,
         "name": "Tools",
         "description": "Cubitum aveho.",
         "created_at": "2024-09-01T12:26:00.423Z",
         "updated_at": "2024-09-01T12:26:00.423Z",
         "deleted_at": null
      }
   },
]
```