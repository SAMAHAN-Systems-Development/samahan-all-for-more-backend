## POST /api/bulletins

Request:

```
method: POST
category_id: int, required
title: string, required
content: string, required
author: string, required
published_at: DateTime, required
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
   published_at: "2031-08-15T10:00:00Z"
   pdf_attachments: application/pdf[]
}
```

Response

```JSON
{
  "statusCode": 201,
  "message": "Bulletin created successfully"
}
```

Error Response:

**400 Bad Request**

Specific message appears on which field is missing

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
deleted_attachment_ids: number[], optional
published_at: DateTime, required
pdf_attachemnts: [application/pdf], optional
```

**200 OK**

Request Payload:

HTTP: `/api/bulletins/1`

```JSON
{
   "params": {
      "id": 1
   },
   "body": {
      "category_id": 1,
      "title": "new title",
      "content": "new content here",
      "author": "John",
      "publshed_at" : "2031-08-15T10:00:00Z",
      "deleted_attachemnts_ids": [56, 74, 75]
   },
   "attachments": {
      "pdf_attachments": [application/pdf]
   }
}
```

Response

```JSON
{
  "statusCode": 200,
  "message": "Bulletin updated successfully deleted 3 and added 1",
  "data": {
    "id": 2,
    "category_id": 1,
    "title": "new title",
    "content": "new content here",
    "author": "John",
    "publshed_at" : "2031-08-15T10:00:00Z",
    "created_at": "2024-09-01T01:30:23.844Z",
    "updated_at": "2024-09-06T07:23:26.471Z",
    "deleted_at": null,
    "new_attachments": [
      {
        "id": 76,
        "bulletin_id": 1,
        "file_path": "07-09-2024-09-39-34-testfile.pdf",
        "created_at": "2024-09-07T01:39:34.853Z",
        "updated_at": "2024-09-07T01:39:34.853Z",
        "deleted_at": null
      }
    ]
  }
}
```

**400 Bad Request**

Specific message appears on which field is mising

Response:

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

Params are not numbers !

Response

```JSON
{
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request",
    "statusCode": 400
}
```

**404 Not Found**

Params are either not in database or isDeleted

```JSON
{
    "message": "Bulletin with ID 100 does not exists or has been deleted",
    "error": "Not Found",
    "statusCode": 404
}
```

**500 Internal Server Error**

Its Either the pdf attachemnt is deleted or doesnt exists

Request body:

```JSON
{
   "category_id": 1,
   "title": "new title",
   "content": "new content here",
   "author": "John",
   "deleted_attachemnts_ids": [1, 2]
}
```

Response:

```JSON
{
  "message": "Attachments with IDs 1, 2 do not exists to bulletin ID: 1",
  "error": "Internal Server Error",
  "statusCode": 500
}
```

## DELETE /api/bulletins/{id}

Sample Request:

```
DELETE /api/bulletins/3
```

Sample Success Response:

**200 OK**

```JSON
{
  "message": "Bulletin successfully deleted"
}
```

Error Response:

**400 Bad Request (Bulletin already deleted)**

```JSON
{
    "message": [
        "Bulletin with id 3 has already been deleted."
    ],
    "error": "Bad Request",
    "statusCode": 400
}

```

**400 Bad Request (Bulletin does not exist)**

```JSON
{
    "message": [
        "Bulletin with id 9000 does not exist."
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
- Type: Filter bulletins by category name (case insensitive). Optional.
- Search: Search for bulletins by title, author, or category name (case insensitive). Optional.
```

Example Requests
```
GET /api/bulletins
GET /api/bulletins?page=2
GET /api/bulletins?page=2&limit=15
GET /api/bulletins?search=Stella
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