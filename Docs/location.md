## POST /api/location

Request:

```
method: POST
name: string, required
address: string, required
```

Sample Request:

```json
{
    "name": "Quinton Hollow",
    "address": "20394 Bramble Close",
}
```

Sample Success Response:

**201 Created**

```json
{
   "message": "Successfully created a location"
}
```

Sample Error Responses:

**400 Bad Request (name is empty)**

```json
{
    "message": [
        "name should not be empty",
        "name must be a string"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

**409 Conflict (name already exists)**
```json
{
    "statusCode": 409,
    "message": "Location name 'Quinton Hollow' is already taken"
}
```

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
