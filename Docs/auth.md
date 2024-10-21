
## POST /api/auth/login

Request:

```json
{
    "email": "ivan@gmail.com",
    "password": "secretPassword"
}
```

Sample Success Response:

**200 OK**

```json
{
  "email": "ivan@gmail.com",
  "x-access-token": "your_access_token"
}
```

Sample Error Responses:

**400 Bad Request (email is empty)**

```json
{
  "message": ["email should not be empty", "email must be a string"],
  "error": "Bad Request",
  "statusCode": 400
}
```

**401 Unauthorized (invalid credentials)**

```json
{
  "statusCode": 401,
  "message": "Invalid email or password"
}
```

## GET /api/auth/user

Sample Success Response:

**200 OK**
```json
{
    "id": "62f18022-fe0a-45af-8197-3c02b7246201",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "ivan@gmail.com",
    "email_confirmed_at": "2024-10-14T00:32:14.515267Z",
    "phone": "",
    "confirmed_at": "2024-10-14T00:32:14.515267Z",
    "last_sign_in_at": "2024-10-21T15:08:54.218049Z",
    "app_metadata": {
        "provider": "email",
        "providers": [
            "email"
        ]
    },
    "user_metadata": {},
    "identities": [
        {
            "identity_id": "1f51e10e-5ba3-485b-96a0-134f0d7de7f4",
            "id": "62f18022-fe0a-45af-8197-3c02b7246201",
            "user_id": "62f18022-fe0a-45af-8197-3c02b7246201",
            "identity_data": {
                "email": "ivan@gmail.com",
                "email_verified": false,
                "phone_verified": false,
                "sub": "62f18022-fe0a-45af-8197-3c02b7246201"
            },
            "provider": "email",
            "last_sign_in_at": "2024-10-14T00:32:14.510231Z",
            "created_at": "2024-10-14T00:32:14.510296Z",
            "updated_at": "2024-10-14T00:32:14.510296Z",
            "email": "ivan@gmail.com"
        }
    ],
    "created_at": "2024-10-14T00:32:14.492878Z",
    "updated_at": "2024-10-21T15:08:54.238249Z"
}
```