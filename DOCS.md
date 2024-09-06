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

## POST /api/category

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

## PUT /api/category/{id}

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

## POST /api/bulletins

Request:

```
method: POST
category_id: int, required
title: string, required
content: string, required
author: string, required
pdf_attachemnts: application/pdf[], optional
```


**201 Created**

Happens when either pdf is provided or not.

Request
```
{
   category_id: 1,
   title: "something",
   content: "some content here",
   author: "John",
   pdf_attachments: application/pdf[]
}
```
Response
```
{
  "statusCode": 201,
  "message": "Bulletin created successfully"
}
```

Error Response:

**400 Bad Request**

Specific message appears on which field is mising

Request
```
<!-- This is formdata -->

[Object: nul]{
   category_id: null,
   title: null,
   content: null,
   author: null,
   pdf_attachments: [actual_attachments]
}
```
Response
```JSON
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
## PUT /api/bulletins/:id

Request:

```
method: PUT
category_id: int, required
title: string, required
content: string, required
author: string, required
pdf_attachemnts: [application/pdf], optional
```

Sample Request:

**200 OK**

```
{
   category_id: 1,
   title: "new title",
   content: "new content here",
   author: "John",
   pdf_attachments: [application/pdf]
}
```

Response
```
{
  "statusCode": 200,
  "message": "Bulletin updated successfully",
  "data": {
    "id": 2,
    "category_id": 1,
    "title": "new title",
    "content": "new content here",
    "author": "John",
    "created_at": "2024-09-01T01:30:23.844Z",
    "updated_at": "2024-09-06T07:23:26.471Z",
    "deleted_at": null,
    "attachments": []
  }
}
```

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
Params are not numbers !
```
{
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request",
    "statusCode": 400
}
```
**404 Not Found**

Params are either not in database or isDeleted 
```
{
    "message": "Bulletin with ID 100 does not exists or has been deleted",
    "error": "Not Found",
    "statusCode": 404
}
```
