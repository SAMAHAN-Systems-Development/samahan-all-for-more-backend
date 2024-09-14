## POST /api/locations/:id

Sample Request:

```
DELETE /api/locations/3000
```

Sample Success Response:

**200 OK**

```JSON
{
  "message": "Location deleted successfully"
}
```

Error Response:

**404 Bad Request (Location does not exist)**

```JSON
{
    "message": [
        "Location with id 3000 does not exist."
    ],
    "error": "Bad Request",
    "statusCode": 400
}

```

**400 Bad Request (Location has existing events)**

```JSON
{
    "message": [
        "Location with id 3000 cannot be removed because it has existing events"
    ],
    "error": "Bad Request",
    "statusCode": 400
}

```
