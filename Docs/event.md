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
posters: poster[], optional
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
  "posters": [
    {
      "image_url": "https://example.com/poster1.jpg",
      "description": "Main Event Poster"
    },
    {
      "image_url": "https://example.com/poster2.jpg",
      "description": "Secondary Event Poster"
    }
  ]
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

**409 Conflict (event in the same location at the same time already exists)**

```json
{
  "statusCode": 409,
  "message": "An event is already scheduled at this location at the same time"
}
```
