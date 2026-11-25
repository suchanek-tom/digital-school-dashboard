# API Documentation

Base URL: `/api/v1`

Unless noted otherwise, protected endpoints require:

```http
Authorization: Bearer <access_token>
```

## Authentication endpoints

### POST `/api/v1/auth/register`

Registers a new user.

**Authentication:** Public

**Request body:**

```json
{
  "username": "jane",
  "email": "jane@example.com",
  "password": "secure-password"
}
```

**Success response:** `201 Created`

```text
registration successful
```

**Possible errors:** `409 Conflict` if the email or username already exists, and `400 Bad Request` if the email or required fields are invalid.

---

### POST `/api/v1/auth/authenticate`

Authenticates a user and returns an access token. A `refreshToken` HTTP-only cookie is set in the response.

**Authentication:** Public

**Request body:**

```json
{
  "email": "jane@example.com",
  "password": "secure-password"
}
```

**Success response:** `200 OK`

```json
{
  "access_token": "<access_token>"
}
```

**Response cookie:**

```text
Set-Cookie: refreshToken=<refresh_token>; Path=/api/v1/auth/refresh; HttpOnly; Secure; SameSite=Strict
```

**Possible errors:** `401 Unauthorized` for invalid credentials.

---

### POST `/api/v1/auth/refresh`

Rotates the refresh token and returns a new access token. The refresh token must be present as the `refreshToken` cookie. The request must also include the bearer access token header.

**Authentication:** Required

**Required header:**

```http
Authorization: Bearer <access_token>
```

**Required cookie:**

```text
refreshToken=<refresh_token>
```

**Success response:** `200 OK`

```json
{
  "access_token": "<new_access_token>"
}
```

A new `refreshToken` cookie is returned.

**Possible errors:** `400 Bad Request` if the refresh cookie is used on another endpoint or is missing in the wrong flow, and `401 Unauthorized` if either token is invalid or their subjects do not match.

---

### GET `/api/v1/auth/validateToken`

Checks that the request reaches the authenticated endpoint successfully.

**Authentication:** Required

**Required header:**

```http
Authorization: Bearer <access_token>
```

**Success response:** `200 OK`

```text
valid
```

**Possible errors:** `401 Unauthorized` if the access token or bearer header is missing or invalid.

---

### POST `/api/v1/auth/logout`

Revokes all valid refresh tokens for the authenticated user and clears the server-side security context.

**Authentication:** Required

**Required header:**

```http
Authorization: Bearer <access_token>
```

**Request body:** None

**Success response:** `200 OK`

```text
logout successful
```

**Possible errors:** `401 Unauthorized` for missing or invalid authentication.

---

## Authentication headers and cookies

The access token is sent through the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

The refresh token is not returned in the JSON response. It is stored in an HTTP-only cookie named `refreshToken` and is scoped to the refresh endpoint.

The following endpoints do not require authentication:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/authenticate`

All other application endpoints require authentication.

## Error response

Most handled errors use the following JSON structure:

```json
{
  "status": 400,
  "message": "Error description",
  "timestamp": "2026-11-21T19:43:08.011",
  "path": "/api/v1/auth/register"
}
```

## Device pairing endpoints

### POST `/api/v1/devices/pair/init`

Called by a display device (TV) to start pairing. Creates a pairing request with status `PENDING` and a 6-character code (letters `A–Z` and digits `0–9`). The device shows this code on screen.

**Authentication:** Public

**Request body:** None

**Success response:** `200 OK`

```json
{
  "code": "X7K9P2",
  "expiresInMinutes": 5
}
```

| Field              | Type    | Description                                                                                              |
| ------------------ | ------- | -------------------------------------------------------------------------------------------------------- |
| `code`             | string  | 6-character pairing code                                                                                 |
| `expiresInMinutes` | integer | Code lifetime in minutes, derived from the `PAIRING_CODE_EXPIRATION` setting (configured in seconds)     |

---

### POST `/api/v1/devices/pair/confirm`

Called by the admin panel to confirm a code shown on a device. The code must exist, still be valid and be in status `PENDING`. The status is changed to `DELIVERING` atomically, so a code can be confirmed only once, and a new paired device is created.

**Authentication:** Required

**Required header:**

```http
Authorization: Bearer <access_token>
```

**Request body:**

```json
{
  "code": "X7K9P2"
}
```

The code is case-insensitive and must be exactly 6 characters.

**Success response:** `202 Accepted`

```json
{
  "uid": "b3f1c2a4-8d7e-4c55-9a0b-1e2f3a4b5c6d"
}
```

`uid` is the UUID of the newly created paired device.

**Possible errors:** `400 Bad Request` if the code is blank or not 6 characters long, or does not exist, has expired or has already been used. `401 Unauthorized` for missing or invalid authentication.

---
