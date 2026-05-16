# UrbanTrace API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**Endpoint:** `POST /auth/register/`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "role": "citizen"  // Optional: citizen (default), authority, admin
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "citizen"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### 1.2 Login User
**Endpoint:** `POST /auth/login/`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "citizen"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### 1.3 Get Current User
**Endpoint:** `GET /auth/me/`
**Auth:** Required ✅

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "citizen",
  "date_joined": "2026-05-14T10:30:00Z"
}
```

---

### 1.4 Logout
**Endpoint:** `POST /auth/logout/`
**Auth:** Required ✅

**Success Response (200):**
```json
{
  "message": "Logout successful. Please delete your token."
}
```

---

## 2. Issue Endpoints

### 2.1 List All Issues
**Endpoint:** `GET /issues/`
**Auth:** Optional

**Query Parameters:**
- `status`: Filter by status (pending, in_progress, resolved, closed)
- `category`: Filter by category (road, sanitation, electricity, water, other)
- `assigned_to`: Filter by assigned authority ID
- `search`: Search in title and description
- `ordering`: Sort by field (e.g., -created_at, status)
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)

**Example Request:**
```
GET /issues/?status=pending&category=road&page=1
```

**Success Response (200):**
```json
{
  "count": 42,
  "next": "http://localhost:8000/api/issues/?page=2",
  "previous": null,
  "results": [
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Pothole on Main Street",
      "description": "Large pothole on Main Street near the junction",
      "image": "https://example.com/media/issues/2026/05/14/image.jpg",
      "latitude": 31.5204,
      "longitude": 74.3587,
      "address": "Main Street, Lahore",
      "category": "road",
      "status": "pending",
      "created_by": {
        "id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com",
        "role": "citizen"
      },
      "assigned_to": null,
      "created_at": "2026-05-14T10:30:00Z",
      "updated_at": "2026-05-14T10:30:00Z",
      "resolved_at": null
    }
  ]
}
```

---

### 2.2 Get Issue Details
**Endpoint:** `GET /issues/{id}/`
**Auth:** Optional

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "title": "Pothole on Main Street",
  "description": "Large pothole on Main Street near the junction",
  "image": "https://example.com/media/issues/2026/05/14/image.jpg",
  "latitude": 31.5204,
  "longitude": 74.3587,
  "address": "Main Street, Lahore",
  "category": "road",
  "status": "pending",
  "created_by": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "citizen"
  },
  "assigned_to": null,
  "created_at": "2026-05-14T10:30:00Z",
  "updated_at": "2026-05-14T10:30:00Z",
  "resolved_at": null
}
```

---

### 2.3 Create Issue
**Endpoint:** `POST /issues/`
**Auth:** Optional (anonymous submissions allowed)
**Content-Type:** multipart/form-data

**Request Body:**
```json
{
  "title": "Broken Street Light",
  "description": "Street light is broken at the corner",
  "latitude": 31.5204,
  "longitude": 74.3587,
  "address": "DHA Phase 5, Lahore",
  "category": "electricity",
  "image": <image_file>
}
```

**Success Response (201):**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "title": "Broken Street Light",
  "description": "Street light is broken at the corner",
  "image": "https://example.com/media/issues/2026/05/14/image.jpg",
  "latitude": 31.5204,
  "longitude": 74.3587,
  "address": "DHA Phase 5, Lahore",
  "category": "electricity",
  "status": "pending",
  "created_by": null,
  "assigned_to": null,
  "created_at": "2026-05-14T10:35:00Z",
  "updated_at": "2026-05-14T10:35:00Z",
  "resolved_at": null
}
```

---

### 2.4 Update Issue
**Endpoint:** `PUT /issues/{id}/`
**Auth:** Required ✅ (Creator or Assigned Authority)

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in_progress",
  "latitude": 31.5204,
  "longitude": 74.3587,
  "address": "Updated Address",
  "category": "electricity"
}
```

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in_progress",
  ...
}
```

---

### 2.5 Assign Issue to Authority
**Endpoint:** `POST /issues/{id}/assign/`
**Auth:** Required ✅ (Admin or Authority)

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439015"
}
```

**Success Response (200):**
```json
{
  "message": "Issue assigned successfully",
  "assigned_to": "authority_username"
}
```

---

### 2.6 Update Issue Status
**Endpoint:** `POST /issues/{id}/update_status/`
**Auth:** Required ✅ (Creator or Assigned Authority)

**Request Body:**
```json
{
  "status": "resolved"  // pending, in_progress, resolved, closed
}
```

**Success Response (200):**
```json
{
  "message": "Status updated successfully",
  "new_status": "resolved"
}
```

---

## 3. Dashboard Endpoints

### 3.1 Get Statistics
**Endpoint:** `GET /stats/`
**Auth:** Optional

**Success Response (200):**
```json
{
  "total": 42,
  "pending": 15,
  "in_progress": 8,
  "resolved": 18,
  "closed": 1
}
```

---

### 3.2 Get User Notifications
**Endpoint:** `GET /notifications/`
**Auth:** Required ✅

**Success Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439020",
    "type": "issue",
    "message": "Issue #507f1f77bcf86cd799439012 status updated from pending to in_progress",
    "created_at": "2026-05-14T10:40:00Z"
  },
  {
    "id": "507f1f77bcf86cd799439021",
    "type": "assignment",
    "message": "Issue #507f1f77bcf86cd799439013 - Broken Street Light has been assigned to you",
    "created_at": "2026-05-14T10:35:00Z"
  }
]
```

---

### 3.3 Mark Notification as Read
**Endpoint:** `POST /notifications/`
**Auth:** Required ✅

**Request Body (Single):**
```json
{
  "notification_id": "507f1f77bcf86cd799439020"
}
```

**Request Body (Mark All):**
```json
{
  "mark_all": true
}
```

**Success Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

---

## 4. Token Endpoints

### 4.1 Obtain JWT Tokens
**Endpoint:** `POST /token/`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### 4.2 Refresh Access Token
**Endpoint:** `POST /token/refresh/`

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Success Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 5. Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid data",
  "details": {
    "field_name": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## 6. Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Success, no response body |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## 7. Rate Limiting

Currently, no rate limiting is implemented. For production, implement:
- Django Ratelimit or
- Django REST Framework throttling

---

## 8. Pagination

Default: 20 items per page

**Query Parameters:**
```
GET /issues/?page=1&page_size=50
```

**Response:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/issues/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## 9. Filtering & Search

### Filter by Status
```
GET /issues/?status=pending
```

### Filter by Category
```
GET /issues/?category=road
```

### Search
```
GET /issues/?search=pothole
```

### Ordering
```
GET /issues/?ordering=-created_at  # Descending
GET /issues/?ordering=status       # Ascending
```

---

## 10. File Upload

**Endpoint:** `POST /issues/`

**Requirements:**
- Field: `image`
- Max Size: 5MB (configurable)
- Formats: JPEG, PNG, GIF, WebP

**Example (cURL):**
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -F "title=Broken Light" \
  -F "description=Light is broken" \
  -F "latitude=31.5204" \
  -F "longitude=74.3587" \
  -F "category=electricity" \
  -F "image=@/path/to/image.jpg" \
  http://localhost:8000/api/issues/
```

---

## 11. WebSocket Events (Real-time Updates)

**Endpoint:** `ws://localhost:8000/ws/issues/`

**Receive Event:**
```json
{
  "type": "send_issue_update",
  "id": "507f1f77bcf86cd799439012",
  "status": "in_progress",
  "title": "Pothole on Main Street",
  "updated_at": "2026-05-14T10:40:00Z"
}
```

---

## 12. Example Workflows

### Workflow 1: Report an Issue
```
1. POST /issues/ → Create issue
2. Issue email sent to admin
3. WebSocket broadcast to all users
```

### Workflow 2: Assign and Track
```
1. POST /issues/{id}/assign/ → Assign to authority
2. Authority gets notification
3. Authority updates status: POST /issues/{id}/update_status/
4. Reporter gets notification
5. WebSocket broadcast to all users
```

### Workflow 3: User Registration & Login
```
1. POST /auth/register/ → Create account
2. POST /auth/login/ → Get JWT tokens
3. Use access token in Authorization header
4. POST /token/refresh/ → Get new access token when expired
```

---

## 13. Environment Variables

See `.env.example` for all available configurations.

---

**Last Updated:** 2026-05-14
**Version:** 1.0
