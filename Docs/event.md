# API

## POST /api/events

Request:

```
method: POST
name: string, required
description: string, required
registration_link: string, required
start_time: string, required
end_time: string, required
location_id: int, required
thumbnail: image/jpeg, image/png, image/gif, required
poster_images: image/jpeg, image/png, image/gif, optional
```

Sample Request:

```json
{
  "name": "Palaro 2024",
  "description": "A grand event featuring sports competitions between different schools.",
  "registration_link": "https://example.com/register",
  "start_time": "2028-10-15T09:00:00Z",
  "end_time": "2028-10-15T17:00:00Z",
  "location_id": 3,
  "thumbnail": image/jpeg,
  "poster_images": image/jpeg[]
}
```

Sample Success Response:

**201 Created**

```json
{
  "message": "Event created successfully"
}
```

Sample Error Responses:

**400 Bad Request (event end time is earlier than start time)**

```json
{
  "message": ["Start time must be earlier than end_time"],
  "error": "Bad Request",
  "statusCode": "400"
}
```

**400 Bad Request (invalid poster image upload file type)**

```json
{
  "message": "Invalid file type: application/pdf. Only JPEG, PNG, and GIF are allowed.",
  "error": "Bad Request",
  "statusCode": "400"
}
```

**409 Conflict (event in the same location at the same time already exists)**

```json
{
  "statusCode": 409,
  "message": "An event is already scheduled at this location at the same time"
}
```

**400 Bad Request (uploaded more than one thumbnail)**

```json
{
  "message": "Only one thumbnail is allowed",
  "error": "Bad Request",
  "statusCode": 400
}
```

## PUT /api/events/{id}

Request:

```
method: PUT
name: string, optional
description: string, optional
registration_link: string, optional
start_time: string, optional
end_time: string, optional
location_id: int, optional
thumbnail: image/jpeg, image/png, image/gif, required
poster_images: image/jpeg, image/png, image/gif, optional
delete_poster_ids: int[], optional
```

Sample Request:

```json
{
  "name": "Palaro 2025",
  "location_id": 9,
  "poster_images": image/jpeg[],
  "delete_poster_ids": [51, 52]
}
```

Sample Success Response:

**200 OK**

```json
{
  "message": "Event updated successfully",
  "data": {
    "id": 51,
    "location_id": 9,
    "name": "Palaro 2025",
    "description": "A grand event featuring sports competitions between different schools.",
    "registration_link": "https://example.com/register",
    "start_time": "2028-10-15T09:00:00Z",
    "end_time": "2028-10-15T17:00:00Z",
    "created_at": "2024-09-27T13:22:50.349Z",
    "updated_at": "2024-09-27T14:54:43.924Z",
    "deleted_at": null,
    "thumbnail": "http://127.0.0.1:54321/storage/v1/object/public/posterImages/01-10-2024-20-20-03-thumbnail1.png"
  },
  "updatedPosters": [
    {
      {
        "id": 51,
        "event_id": 51,
        "image_url": "http://127.0.0.1:54321/storage/v1/object/public/posterImages/01-10-2024-20-20-03-image1.png",
        "created_at": "2024-10-01T12:20:03.009Z",
        "updated_at": "2024-10-01T12:20:03.009Z",
        "deleted_at": null
      },
      {
        "id": 52,
        "event_id": 51,
        "image_url": "http://127.0.0.1:54321/storage/v1/object/public/posterImages/01-10-2024-20-20-03-image2.png",
        "created_at": "2024-10-01T12:41:32.733Z",
        "updated_at": "2024-10-01T12:41:32.733Z",
        "deleted_at": null
      }
    }
  ]
}
```

Sample Error Responses:

**400 Bad Request (event end time is earlier than start time)**

```json
{
  "message": ["Start time must be earlier than end_time"],
  "error": "Bad Request",
  "statusCode": "400"
}
```

**400 Bad Request (invalid poster image upload file type)**

```json
{
  "message": "Invalid file type: application/pdf. Only JPEG, PNG, and GIF are allowed.",
  "error": "Bad Request",
  "statusCode": "400"
}
```

**409 Conflict (event in the same location at the same time already exists)**

```json
{
  "statusCode": 409,
  "message": "An event is already scheduled at this location at the same time"
}
```

**400 Bad Request (some delete_poster_ids are invalid or do not belong to event being updated)**

```json
{
  "statusCode": 400,
  "message": "Some poster IDs are invalid or do not belong to this event"
}
```

**404 Not Found (provided event id does not exist in the database)**

```json
{
  "statusCode": 404,
  "message": "Event with id 100 not found"
}
```

**400 Bad Request (uploaded more than one thumbnail)**

```json
{
  "message": "Only one thumbnail is allowed",
  "error": "Bad Request",
  "statusCode": 400
}
```

## GET /api/events

This endpoint retrieves a list of all events.

```
Method: GET
Path: /api/events
Query Parameters:
- Page (optional): The current page number. Default is 1.
- Limit (optional): The maximum number of items to return per page. Default is 10.
- Search (optional): A string to search event names or descriptions.
- Status (optional): The event status (Ongoing, Past, Upcoming)
```

Example Requests

```
GET /api/events
GET /api/events?page=2
GET /api/events?page=2&limit=15
GET /api/events?status=Upcoming
```

Success Response

- **Status:** 200 OK

Sample Success Response

```json
{
  "data": [
    {
      "id": 46,
      "location_id": 10,
      "name": "trans sodalitas coniuratio",
      "description": "Debilito delinquo delectus cicuta crux decretum sub cubo. Claro tepidus tego animus caritas maxime asporto adulatio. Suscipio stips cuppedia.",
      "registration_link": "https://spiffy-snakebite.name/",
      "start_time": "2025-08-26T23:01:48.899Z",
      "end_time": "2025-09-09T08:32:19.811Z",
      "created_at": "2024-09-20T00:50:26.353Z",
      "updated_at": "2024-09-20T00:50:26.353Z",
      "deleted_at": null,
      "thumbnail": "http://127.0.0.1:54321/storage/v1/object/public/posterImages/01-10-2024-20-20-03-thumbnail1.png",
      "posters": [
        {
          "id": 4,
          "event_id": 38,
          "image_url": "https://loremflickr.com/640/480?lock=761323797348352",
          "created_at": "2024-10-07T02:13:42.973Z",
          "updated_at": "2024-10-07T02:13:42.973Z",
          "deleted_at": null
        },
        {
          "id": 7,
          "event_id": 38,
          "image_url": "https://picsum.photos/seed/FQZ3dNSm/640/480",
          "created_at": "2024-10-07T02:13:42.974Z",
          "updated_at": "2024-10-07T02:13:42.974Z",
          "deleted_at": null
        }
      ]
      "location": {
        "id": 10,
        "name": "Ervin Valleys",
        "address": "62356 Braulio Court",
        "created_at": "2024-09-20T00:50:26.341Z",
        "updated_at": "2024-09-20T00:50:26.341Z"
      }
    }
  ],
  "totalEvents": 48,
  "currentPage": 1,
  "totalPages": 5
}
```

## DELETE /api/events/{id}

Sample Request:

```json
DELETE /api/events/28
```

Sample Success Response:

**200 OK**

```json
{
  "message": "Event with id 28 and its posters deleted successfully"
}
```

Error Response:

**404 Not Found**

```json
{
  "message": "Event with id 28 not found"
}
```

## GET /api/events/{id}

This endpoint retrieves a specific event by its unique ID.

**Request:**

```json
{
  "message": "Event retrieved successfully",
  "data": {
    "id": 1,
    "location_id": 3,
    "name": "Palaro 2024",
    "description": "A grand event featuring sports competitions between different schools.",
    "registration_link": "https://example.com/register",
    "start_time": "2028-10-15T09:00:00Z",
    "end_time": "2028-10-15T17:00:00Z",
    "created_at": "2024-09-27T13:22:50.349Z",
    "updated_at": "2024-09-27T14:54:43.924Z",
    "deleted_at": null,
    "thumbnail": "http://127.0.0.1:54321/storage/v1/object/public/posterImages/01-10-2024-20-20-03-thumbnail1.png",
    "posters": [
      {
        "id": 51,
        "event_id": 1,
        "image_url": "http://127.0.0.1:54321/storage/v1/object/public/posterImages/01-10-2024-20-20-03-image1.png",
        "created_at": "2024-10-01T12:20:03.009Z",
        "updated_at": "2024-10-01T12:20:03.009Z",
        "deleted_at": null
      }
    ],
    "location": {
      "id": 3,
      "name": "Main Gym",
      "address": "123 School Lane",
      "created_at": "2024-09-20T00:50:26.341Z",
      "updated_at": "2024-09-20T00:50:26.341Z"
    }
  }
}
```

**Sample Error Responses:**

**404 Not Found (provided event id does not exist in the database)**

```json
{
  "statusCode": 404,
  "message": "Event with id 100 not found"
}
```

**400 Bad Request (invalid id type)**

```json
{
  "statusCode": 400,
  "message": "Invalid ID type: ID must be a number"
}
```
