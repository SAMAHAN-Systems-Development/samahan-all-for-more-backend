# API

## GET /api/events
This endpoint retrieves a list of all events.

```
Method: GET
Path: /api/events
Query Parameters:
- Page: The current page number. Default is 1
- Limit: The maximum number of items to return per page. Default is 10
```

Example Requests
```
GET /api/events
GET /api/events?page=2
GET /api/events?page=2&limit=15
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
            "location": {
                "id": 10,
                "name": "Ervin Valleys",
                "address": "62356 Braulio Court",
                "created_at": "2024-09-20T00:50:26.341Z",
                "updated_at": "2024-09-20T00:50:26.341Z"
            }
        },
    ],
    "totalEvents": 48,
    "currentPage": 1,
    "totalPages": 5
}
```