# 🏙️ UrbanTrace — Civic Issue Reporting Platform

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![Django](https://img.shields.io/badge/django-5.2-darkgreen)
![React](https://img.shields.io/badge/react-18+-61DAFB?logo=react&logoColor=white)

## 📋 Overview

**UrbanTrace** is a comprehensive civic issue reporting platform that empowers citizens to report urban infrastructure problems (potholes, water leaks, broken lights, sanitation issues) through an intuitive map-based interface. Authorities receive real-time notifications and can efficiently track and resolve these issues.

### Key Features
✅ **Interactive Map-based Reporting** — Citizens pin locations directly on a map  
✅ **Anonymous Submissions** — No login required to report an issue  
✅ **Real-time Email Alerts** — Authorities instantly notified of new reports  
✅ **WebSocket Updates** — Live status updates across all connected users  
✅ **JWT Authentication** — Secure token-based user sessions  
✅ **MongoDB Database** — NoSQL persistence for scalability  
✅ **Responsive Design** — Works on desktop, tablet, and mobile  
✅ **Role-based Access** — Citizen, Authority, and Admin roles  

---

## 🏗️ Architecture

### Backend Stack
- **Framework:** Django 5.2 + Django REST Framework
- **Database:** MongoDB (via django-mongodb-backend)
- **Authentication:** JWT (Simple JWT)
- **Real-time:** Django Channels + WebSockets
- **Email:** SMTP (Gmail)
- **Server:** Gunicorn (production)

### Frontend Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Map Library:** Leaflet
- **State Management:** React Context/Hooks
- **HTTP Client:** Axios

---

## 📂 Project Structure

```
capstone-2-project-urban-Trace-main/
│
├── Backend (Django)
│   ├── config/
│   │   ├── settings.py          ← MongoDB configuration
│   │   ├── mongo_apps.py        ← MongoDB app configs
│   │   ├── mongo_utils.py       ← MongoDB utilities
│   │   ├── urls.py              ← API routing
│   │   ├── asgi.py              ← WebSocket support
│   │   └── wsgi.py
│   │
│   ├── accounts/
│   │   ├── models.py            ← User model (citizen, authority, admin)
│   │   ├── views.py             ← Authentication endpoints
│   │   ├── serializers.py       ← JWT token handling
│   │   ├── permissions.py       ← Role-based permissions
│   │   ├── urls.py
│   │   └── admin.py             ← User management
│   │
│   ├── issues/
│   │   ├── models.py            ← Issue model
│   │   ├── views.py             ← CRUD operations + assignment
│   │   ├── serializers.py       ← Data validation
│   │   ├── consumers.py         ← WebSocket events
│   │   ├── email_utils.py       ← Email notifications
│   │   ├── urls.py              ← Issue endpoints
│   │   ├── admin.py             ← Issue management
│   │   └── migrations/
│   │
│   ├── dashboard/
│   │   ├── models.py            ← Notification model
│   │   ├── views.py             ← Stats & notifications
│   │   ├── urls.py
│   │   └── admin.py
│   │
│   ├── manage.py
│   ├── requirements.txt          ← Python dependencies
│   ├── MONGODB_SETUP.md          ← Setup guide
│   ├── API_DOCUMENTATION.md      ← Endpoint reference
│   └── .env.example              ← Environment template
│
└── Frontend (React + Vite)
    ├── fixed_frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── layout/
    │   │   │   │   └── AppLayout.tsx
    │   │   │   ├── map/
    │   │   │   │   └── IssueMap.tsx      ← Leaflet map component
    │   │   │   └── shared/
    │   │   │       └── IssueTable.tsx
    │   │   │
    │   │   ├── features/
    │   │   │   ├── citizen/
    │   │   │   │   ├── CitizenPortal.tsx
    │   │   │   │   └── IssueReportForm.tsx
    │   │   │   ├── authority/
    │   │   │   │   └── AuthorityDashboard.tsx
    │   │   │   ├── dashboard/
    │   │   │   │   └── Dashboard.tsx
    │   │   │   └── landing/
    │   │   │       └── LandingPage.tsx
    │   │   │
    │   │   ├── service/
    │   │   │   └── api.ts                ← API integration
    │   │   │
    │   │   ├── types/
    │   │   │   ├── issue.ts
    │   │   │   ├── user.ts
    │   │   │   └── fleet.ts
    │   │   │
    │   │   ├── data/
    │   │   │   ├── mockIssues.ts
    │   │   │   └── mockUsers.ts
    │   │   │
    │   │   ├── App.tsx
    │   │   ├── main.tsx
    │   │   └── styles.css
    │   │
    │   ├── package.json
    │   ├── vite.config.ts
    │   ├── tsconfig.json
    │   └── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+**
- **Node.js 16+** (for frontend)
- **MongoDB** (running locally on port 27017)
- **MongoDB Compass** (optional, for GUI)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd capstone-2-project-urban-Trace-main

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create superuser (admin account)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Server runs at: `http://localhost:8000`  
Admin panel: `http://localhost:8000/admin/`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd Urban-Trace-frontend-fixed/fixed_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📡 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register/          Register new user
POST   /api/auth/login/             Login user
GET    /api/auth/me/                Get current user
POST   /api/token/                  Get JWT tokens
POST   /api/token/refresh/          Refresh access token
```

### Issue Endpoints
```
GET    /api/issues/                 List all issues (paginated, filterable)
POST   /api/issues/                 Create new issue
GET    /api/issues/{id}/            Get issue details
PUT    /api/issues/{id}/            Update issue
POST   /api/issues/{id}/assign/     Assign to authority
POST   /api/issues/{id}/update_status/  Update status
```

### Dashboard Endpoints
```
GET    /api/stats/                  Get issue statistics
GET    /api/notifications/          Get user notifications
POST   /api/notifications/          Mark notification as read
```

📚 **Full API Documentation:** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🗄️ Database Models

### User Model
```python
User(
    id: ObjectId,
    username: String (unique),
    email: String (unique),
    password: String (hashed),
    role: String [citizen | authority | admin],
    first_name: String,
    last_name: String,
    date_joined: DateTime,
    is_active: Boolean
)
```

### Issue Model
```python
Issue(
    id: ObjectId,
    title: String,
    description: String,
    image: ImageField,
    latitude: Float,
    longitude: Float,
    address: String,
    category: String [road | sanitation | electricity | water | other],
    status: String [pending | in_progress | resolved | closed],
    created_by: Reference(User),
    assigned_to: Reference(User),
    created_at: DateTime,
    updated_at: DateTime,
    resolved_at: DateTime
)
```

### Notification Model
```python
Notification(
    id: ObjectId,
    user: Reference(User),
    notification_type: String [issue | assignment | system],
    message: String,
    is_read: Boolean,
    created_at: DateTime
)
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow
1. User registers or logs in
2. Backend returns `access` and `refresh` tokens
3. Client includes `access` token in Authorization header
4. Token expires in 24 hours (configurable)
5. Use `refresh` token to obtain new `access` token

### Role-Based Access Control
- **Citizen**: Can report issues, view own issues, receive updates
- **Authority**: Can view all issues, assign to themselves, update status
- **Admin**: Can manage all entities, modify system settings

---

## ⚙️ Configuration

### Environment Variables
Create a `.env` file (see `.env.example`):

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key

# MongoDB
MONGODB_HOST=mongodb://localhost:27017
MONGODB_NAME=urbantrace_db

# Email (Gmail SMTP)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
REPORT_RECIPIENT_EMAIL=admin@example.com

# Frontend
FRONTEND_URL=http://localhost:5173
```

### MongoDB Connection
```python
DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_backend',
        'NAME': 'urbantrace_db',
        'HOST': 'mongodb://localhost:27017',
    }
}
```

---

## 📧 Email Configuration

### Development (Console Output)
Emails are printed to console by default.

### Production (Gmail SMTP)
1. Enable 2-factor authentication on Gmail
2. Generate an [app-specific password](https://support.google.com/accounts/answer/185833)
3. Add credentials to `.env`

---

## 🔗 WebSocket Real-Time Updates

Connected clients receive instant updates when:
- New issue is reported
- Issue status changes
- Issue is assigned to someone

**WebSocket Endpoint:** `ws://localhost:8000/ws/issues/`

---

## 🧪 Testing

### Manual Testing
```bash
# 1. Register a user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "password_confirm": "TestPass123!"
  }'

# 2. Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'

# 3. Create an issue
curl -X POST http://localhost:8000/api/issues/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Broken Light" \
  -F "description=Street light is broken" \
  -F "latitude=31.5204" \
  -F "longitude=74.3587" \
  -F "category=electricity"
```

---

## 📋 Common Commands

```bash
# Database
python manage.py createsuperuser        # Create admin user
python manage.py migrate                # Apply migrations (if any)

# Data
python manage.py shell                  # Interactive Python shell
python manage.py dumpdata > data.json   # Export data
python manage.py loaddata data.json     # Import data

# Development
python manage.py runserver              # Start dev server
python manage.py runserver 8001         # Use different port

# Testing
python manage.py test                   # Run tests
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: Connection refused
```
**Solution:** Ensure MongoDB is running
```bash
# Windows
# Check Services → MongoDB Server is running

# macOS
brew services restart mongodb-community

# Linux
sudo systemctl restart mongod
```

### Port 8000 Already in Use
```bash
# Use different port
python manage.py runserver 8001

# Or kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### CORS Errors
Ensure `CORS_ALLOW_ALL_ORIGINS = True` in `settings.py` (already configured)

---

## 📈 Performance Optimization

- **Indexing:** MongoDB collections have indexes on frequently queried fields
- **Pagination:** API returns 20 items per page
- **Caching:** Consider adding Redis for sessions
- **Async Tasks:** Use Celery for email in production

---

## 🚢 Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in settings
- [ ] Update `SECRET_KEY` to a strong random value
- [ ] Configure email credentials
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS for your domain
- [ ] Use Gunicorn/uWSGI for server
- [ ] Set up proper MongoDB authentication
- [ ] Enable database backups
- [ ] Configure error tracking (Sentry)
- [ ] Set up CI/CD pipeline

---

## 📚 Documentation Files

- [MONGODB_SETUP.md](MONGODB_SETUP.md) — Complete MongoDB setup guide
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) — Full API endpoint reference
- [Django Docs](https://docs.djangoproject.com/) — Official Django documentation
- [MongoDB Docs](https://docs.mongodb.com/) — MongoDB official documentation

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see LICENSE file for details.

---

## 👥 Team

- **Backend:** Django REST Framework + MongoDB
- **Frontend:** React + TypeScript + Leaflet Map
- **Database:** MongoDB NoSQL
- **DevOps:** Docker (optional), Gunicorn

---

## 📞 Support

For issues, questions, or suggestions:
1. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Review [MONGODB_SETUP.md](MONGODB_SETUP.md)
3. Open an issue in the repository
4. Contact the development team

---

**Last Updated:** May 14, 2026  
**Version:** 2.0 (MongoDB Integrated)


| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Map | Leaflet.js |
| Backend | Django 5, Django REST Framework |
| Database | SQLite (development) |
| Real-time | Django Channels (WebSocket) |
| Email | Django SMTP via Gmail |
| CORS | django-cors-headers |

---

## 🔧 What Was Fixed & Built

### Backend Fixes

**1. Anonymous Issue Submission (`issues/models.py`)**
The `created_by` field previously required a logged-in user, causing every public submission to fail with a database error. It was made optional (`null=True, blank=True`) so citizens can report issues without any account.

**2. Serializer Read-Only Fields (`issues/serializers.py`)**
Fields like `id`, `created_at`, `created_by`, `status`, and `assigned_to` are now marked as `read_only`. This prevents accidental overwriting of server-managed data from incoming form submissions.

**3. View Logic & Router Fix (`issues/views.py`)**
The `IssueViewSet` was missing a class-level `queryset` attribute, which caused Django REST Framework's router to crash with an `AssertionError` on startup. A proper `queryset` was added alongside `get_queryset()` for runtime filtering. The `perform_create` method was also fixed to not require a user.

**4. Notification Crash Fix (`issues/views.py`)**
The `update` method tried to create a `Notification` object even when `created_by` was `None` (anonymous submission), which caused a database integrity error. It now checks for a user before creating the notification.

**5. WebSocket Resilience (`issues/views.py`)**
WebSocket broadcast in the `update` method is now wrapped in a `try/except` block so that the response is not broken if the channel layer is unavailable.

**6. CORS & Allowed Hosts (`config/settings.py`)**
`ALLOWED_HOSTS` was an empty list, blocking all requests in development. `localhost` and `127.0.0.1` were added. `CORS_ALLOW_ALL_ORIGINS = True` was set to allow the frontend dev server to communicate freely.

**7. Dashboard Anonymous User Fix (`dashboard/views.py`)**
`NotificationView` assumed `request.user` was always authenticated. With authentication disabled, this caused a crash. It now returns an empty list for unauthenticated requests.

**8. Admin Registration (`issues/admin.py`, `dashboard/admin.py`)**
`Issue` and `Notification` models were not registered in Django Admin. Both are now registered with useful list displays and filters.

**9. New Migration (`issues/migrations/0002_fix_created_by_nullable.py`)**
A new migration was added to apply the `created_by` nullable change to existing databases without data loss.

**10. Email Alert System (`issues/email_utils.py`)**
A new `email_utils.py` module was created. Every time an issue is submitted, a professionally formatted plain-text email is sent to the authority inbox, containing the issue title, category, description, GPS coordinates, and a direct Google Maps link. Email failures are logged but do not block the submission response.

---

### Frontend Fixes

**1. Field Name Mismatch (`src/types/issue.ts`)**
The `Issue` TypeScript type used `lat` and `lng`, but the Django backend returns `latitude` and `longitude`. The type was corrected to match the backend response, with optional `lat`/`lng` aliases retained for backward compatibility with mock data.

**2. Mock Data Updated (`src/data/mockIssues.ts`)**
All mock issue entries used `lat`/`lng` (old format) and string IDs like `"UT-1001"`. These were updated to use `latitude`/`longitude` and numeric IDs to match the real backend schema.

**3. Map Compatibility Fix (`src/components/map/IssueMap.tsx`)**
`IssueMap` used `issue.lat` and `issue.lng` directly, which would silently return `undefined` for real backend data, causing pins to not appear on the map. Helper functions `getIssueLat()` and `getIssueLng()` were added to read `latitude`/`longitude` with a `lat`/`lng` fallback. Invalid `0,0` coordinates are now filtered out before rendering. The popup text was also updated to gracefully handle missing `locationLabel`.

**4. Complete API Service (`src/service/api.ts`)**
The original file only had `getIssues()`. The full API service was built out with:
- `createIssue(formData)` — POST new report with FormData (supports image uploads)
- `updateIssueStatus(id, status)` — PATCH for authority status updates
- `deleteIssue(id)` — DELETE endpoint
- `getDashboardStats()` — GET stats summary

**5. Form Submission Wired to Backend (`src/features/citizen/IssueReportForm.tsx`)**
The form was not connected to any API. It now builds a `FormData` object from the form fields and calls `createIssue()`. Loading state, success confirmation, and error messages from the API are all handled and displayed to the user.

**6. Live Data in Citizen Portal (`src/features/citizen/CitizenPortal.tsx`)**
`CitizenPortal` was using static mock data. It now calls `getIssues()` on mount to load real reports from the backend. A refresh button allows reloading without a page reload. New submissions are added to the list immediately (optimistic update) so the user sees their report on the map right away.

---

## 🚀 Running the Project

### Prerequisites

- Python 3.10+
- Node.js 18+
- pip
- npm

---

### Step 1 — Backend Setup

```bash
# 1. Navigate to the backend folder
cd urbantrace-backend

# 2. Create a virtual environment
python -m venv .venv

# 3. Activate it
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

# 4. Install dependencies
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt channels django-filter pillow

# 5. Apply database migrations
python manage.py migrate

# 6. (Optional) Create an admin account to access /admin
python manage.py createsuperuser

# 7. Start the backend server
python manage.py runserver
```

Backend will be live at: **http://127.0.0.1:8000**

---

### Step 2 — Email Configuration

Open `config/settings.py` and fill in your Gmail details at the bottom of the file:

```python
EMAIL_HOST_USER = 'your_gmail@gmail.com'
EMAIL_HOST_PASSWORD = 'xxxx xxxx xxxx xxxx'   # Gmail App Password (16 digits)
DEFAULT_FROM_EMAIL = 'UrbanTrace Alerts <your_gmail@gmail.com>'
REPORT_RECIPIENT_EMAIL = 'authority@example.com'  # Where alerts will be sent
```

**How to get a Gmail App Password:**
1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** if not already on
3. Go back to Security → **App Passwords**
4. Select App: **Mail**, Device: **Other** → give it a name like `UrbanTrace`
5. Copy the 16-character password and paste it above

---

### Step 3 — Frontend Setup

```bash
# 1. Navigate to the frontend folder
cd Urban-Trace-main

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Frontend will be live at: **http://localhost:5173**

> Make sure the backend is running first before opening the frontend.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/issues/` | List all reported issues |
| `POST` | `/api/issues/` | Submit a new issue (FormData) |
| `GET` | `/api/issues/{id}/` | Get a single issue |
| `PATCH` | `/api/issues/{id}/` | Update issue (e.g. status change) |
| `DELETE` | `/api/issues/{id}/` | Delete an issue |
| `POST` | `/api/issues/{id}/assign/` | Assign issue to a user |
| `GET` | `/api/stats/` | Dashboard statistics |
| `GET` | `/api/notifications/` | User notifications |

### POST `/api/issues/` — Required Fields

```
title         string      Issue title
description   string      Full description of the problem
category      string      road | sanitation | electricity | water
latitude      float       GPS latitude (from map click)
longitude     float       GPS longitude (from map click)
image         file        (optional) Photo of the issue
```

---

## 📧 Email Alert Sample

When a report is submitted, an email like this is sent automatically:

```
Subject: [UrbanTrace] New Issue Reported — 🛣️ Road Damage | #1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        URBAN TRACE — CIVIC ISSUE ALERT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Issue ID     :  #1
  Title        :  Road damage near bus stop
  Category     :  🛣️ Road Damage
  Status       :  Pending Review
  Reported At  :  25 April 2026, 10:30 AM

  Description  :  Large pothole causing vehicles to swerve...

  Latitude     :  28.633324
  Longitude    :  77.218437

  View on Map  :
  https://www.google.com/maps?q=28.633324,77.218437

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Automated alert from UrbanTrace Civic Portal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🗺️ How It Works — User Flow

```
1. Citizen opens the app
         ↓
2. Clicks on the map to pin the damaged location
         ↓
3. Coordinates auto-fill in the form
         ↓
4. Fills in: Title, Description, Category
         ↓
5. Clicks "Submit Verified Report"
         ↓
6. Frontend sends POST request to /api/issues/
         ↓
7. Backend saves the issue to the database
         ↓
8. Backend sends an email alert to the authority
         ↓
9. Report appears live on the map for everyone
```

---

## 🛡️ Security Notes

- Never commit real Gmail credentials to a public repository. Move `EMAIL_HOST_PASSWORD` to an environment variable before going public:
  ```python
  import os
  EMAIL_HOST_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD')
  ```
- Set `DEBUG = False` and configure a proper `SECRET_KEY` for production.
- Replace SQLite with PostgreSQL for any production deployment.

---

## 📄 License

This project is for educational and civic use. All rights reserved to the UrbanTrace team.
