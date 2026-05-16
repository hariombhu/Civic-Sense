# UrbanTrace MongoDB Setup & Configuration Guide

## Overview
UrbanTrace is a Django-based civic issue reporting platform using **MongoDB** as the primary database. This guide walks you through the setup process.

---

## Prerequisites

- **Python 3.10+**
- **MongoDB Community Edition** (installed locally)
- **MongoDB Compass** (optional, for GUI management)
- **pip** (Python package manager)

---

## 1. MongoDB Installation

### Windows
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer and follow prompts
3. MongoDB will run as a service on `mongodb://localhost:27017` by default
4. Verify: Open MongoDB Compass and check if you can connect to `localhost:27017`

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

---

## 2. Project Setup

### Step 1: Clone & Navigate
```bash
cd capstone-2-project-urban-Trace-main/capstone-2-project-urban-Trace-main
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Environment Configuration (Optional)

Create a `.env` file in the project root for email configuration:
```env
# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=Your Name <your-email@gmail.com>
REPORT_RECIPIENT_EMAIL=admin-email@gmail.com

# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
```

### Step 5: Create Superuser
```bash
python manage.py createsuperuser
# Follow the prompts to create an admin user
```

### Step 6: Run Development Server
```bash
python manage.py runserver
```

Server will run at: `http://localhost:8000`

---

## 3. MongoDB Database Configuration

### Database Connection
The project is configured to use MongoDB with these settings:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_backend',
        'NAME': 'urbantrace_db',
        'HOST': 'mongodb://localhost:27017',
        'CONNECT': True,
        'TZ_AWARE': True,
    }
}
```

### Verify Connection
Run this to test the connection:
```bash
python manage.py shell
>>> from django.db import connections
>>> connections['default'].ensure_connection()
# If successful, no errors will be raised
```

---

## 4. Database Models

### User Model
```
Fields:
- id (ObjectId)
- username (String, unique)
- email (String, unique)
- first_name, last_name (String)
- role (String: citizen, authority, admin)
- is_active, is_staff, is_superuser (Boolean)
- date_joined (DateTime)
```

### Issue Model
```
Fields:
- id (ObjectId)
- title (String)
- description (Text)
- image (ImageField)
- latitude, longitude (Float)
- address (String)
- category (String: road, sanitation, electricity, water, other)
- status (String: pending, in_progress, resolved, closed)
- created_by (Reference to User, optional)
- assigned_to (Reference to User, optional)
- created_at, updated_at, resolved_at (DateTime)
```

### Notification Model
```
Fields:
- id (ObjectId)
- user (Reference to User)
- notification_type (String: issue, assignment, system)
- message (Text)
- is_read (Boolean)
- created_at (DateTime)
```

---

## 5. API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/me/` - Get current user (requires auth)
- `POST /api/auth/logout/` - Logout (frontend should clear tokens)

### Issues
- `GET /api/issues/` - List all issues (filters: status, category)
- `POST /api/issues/` - Create new issue
- `GET /api/issues/{id}/` - Get issue details
- `PUT /api/issues/{id}/` - Update issue
- `POST /api/issues/{id}/assign/` - Assign to authority
- `POST /api/issues/{id}/update_status/` - Update status

### Dashboard
- `GET /api/stats/` - Get issue statistics
- `GET /api/notifications/` - Get user notifications
- `POST /api/notifications/` - Mark notification as read

### Tokens
- `POST /api/token/` - Obtain JWT tokens
- `POST /api/token/refresh/` - Refresh access token

---

## 6. Admin Interface

Access Django admin panel at: `http://localhost:8000/admin/`

Login with your superuser credentials.

---

## 7. MongoDB Compass (GUI Management)

1. Download from: https://www.mongodb.com/products/tools/compass
2. Open and connect to `mongodb://localhost:27017`
3. You'll see the `urbantrace_db` database
4. Collections will be created automatically:
   - `accounts_user`
   - `issues_issue`
   - `dashboard_notification`

---

## 8. Email Configuration

### Development (Console Output)
By default, emails are printed to the console.

### Production (Gmail SMTP)
1. Enable 2-factor authentication on Gmail
2. Generate an app-specific password
3. Add to `.env`:
   ```env
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   REPORT_RECIPIENT_EMAIL=admin@example.com
   ```

---

## 9. Common Commands

```bash
# Run development server
python manage.py runserver

# Open Django shell
python manage.py shell

# Create migrations (if models change)
python manage.py makemigrations

# View data in MongoDB
python manage.py shell
>>> from issues.models import Issue
>>> Issue.objects.all()

# Delete all data from a collection
python manage.py shell
>>> Issue.objects.all().delete()

# Create a test issue
python manage.py shell
>>> from issues.models import Issue
>>> Issue.objects.create(
...     title="Test Issue",
...     description="Test description",
...     latitude=31.5204,
...     longitude=74.3587,
...     category="road"
... )
```

---

## 10. Frontend Setup

Navigate to the frontend folder:
```bash
cd Urban-Trace-frontend-fixed/fixed_frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 11. Troubleshooting

### MongoDB Connection Error
```
Error: Connection refused
```
**Solution**: Ensure MongoDB service is running
```bash
# Windows (Services)
# Check if "MongoDB Server" service is running

# macOS
brew services restart mongodb-community

# Linux
sudo systemctl restart mongod
```

### Permission Denied
```
Error: User does not have permission to access database
```
**Solution**: Remove auth requirements from MongoDB (for development):
- Restart MongoDB without `--auth` flag
- Or create a user and update connection string

### Port 8000 Already in Use
```bash
python manage.py runserver 8001  # Use different port
```

### CORS Issues with Frontend
Ensure `CORS_ALLOW_ALL_ORIGINS = True` in `settings.py` (already configured)

---

## 12. Project Structure

```
capstone-2-project-urban-Trace-main/
├── config/
│   ├── settings.py          # Django settings (MongoDB config)
│   ├── mongo_apps.py        # MongoDB app configs
│   ├── urls.py              # URL routing
│   └── asgi.py, wsgi.py
├── accounts/
│   ├── models.py            # User model
│   ├── views.py             # Auth endpoints
│   ├── serializers.py       # Auth serializers
│   └── urls.py
├── issues/
│   ├── models.py            # Issue model
│   ├── views.py             # Issue endpoints
│   ├── serializers.py       # Issue serializers
│   ├── email_utils.py       # Email notifications
│   └── consumers.py         # WebSocket consumers
├── dashboard/
│   ├── models.py            # Notification model
│   ├── views.py             # Stats & notifications
│   └── urls.py
├── manage.py                # Django CLI
└── requirements.txt         # Python dependencies
```

---

## 13. Technology Stack

| Component      | Technology |
|----------------|-----------|
| Backend        | Django 5.2 |
| Database       | MongoDB |
| ORM            | django-mongodb-backend |
| REST API       | Django REST Framework |
| Authentication | JWT (Simple JWT) |
| Real-time      | Django Channels |
| Email          | SMTP |
| Frontend       | React + Vite + TypeScript |

---

## 14. Performance Optimization Tips

1. **Indexing**: MongoDB collections have indexes on frequently queried fields
2. **Pagination**: API responses are paginated (20 items per page)
3. **Caching**: Consider adding Redis for session management
4. **Async Tasks**: Use Celery for email sending in production

---

## Support & Documentation

- Django: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- MongoDB: https://docs.mongodb.com/
- django-mongodb-backend: https://nesdis.github.io/django-mongodb-backend/

---

**Last Updated**: 2026-05-14
