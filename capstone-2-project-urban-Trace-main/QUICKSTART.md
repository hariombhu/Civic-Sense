# 🚀 UrbanTrace Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Start MongoDB
```bash
# Make sure MongoDB is running
# Windows: Check Services → MongoDB Server is running
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify
mongo --eval "db.adminCommand('ping')"  # Should return: { ok: 1 }
```

### Step 2: Backend Setup
```bash
# Navigate to project
cd capstone-2-project-urban-Trace-main

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
# Server: http://localhost:8000
# Admin:  http://localhost:8000/admin/
```

### Step 3: Frontend Setup (Optional)
```bash
cd Urban-Trace-frontend-fixed/fixed_frontend
npm install
npm run dev
# Frontend: http://localhost:5173
```

---

## 📡 Test the API

### 1. Register User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "password_confirm": "TestPass123!",
    "role": "citizen"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'

# Copy the "access" token from response
```

### 3. Create Issue
```bash
# Replace TOKEN with your access token from login
curl -X POST http://localhost:8000/api/issues/ \
  -H "Authorization: Bearer TOKEN" \
  -F "title=Test Pothole" \
  -F "description=Large pothole on Main Street" \
  -F "latitude=31.5204" \
  -F "longitude=74.3587" \
  -F "category=road"
```

### 4. Get Statistics
```bash
curl http://localhost:8000/api/stats/
```

---

## 🔧 Common Commands

```bash
# Django shell
python manage.py shell

# Create test data
python manage.py shell
>>> from issues.models import Issue
>>> Issue.objects.create(title="Test", description="Test", latitude=31.5, longitude=74.3)

# View MongoDB data
# 1. Open MongoDB Compass
# 2. Connect to: mongodb://localhost:27017
# 3. View "urbantrace_db" database
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview & architecture |
| [MONGODB_SETUP.md](MONGODB_SETUP.md) | MongoDB installation & configuration |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference with examples |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | What was changed & why |
| [.env.example](.env.example) | Environment variables template |

---

## 🗺️ Key Endpoints

### Authentication
- `POST /api/auth/register/` - Register
- `POST /api/auth/login/` - Login
- `GET /api/auth/me/` - Current user

### Issues
- `GET /api/issues/` - List all
- `POST /api/issues/` - Create
- `GET /api/issues/{id}/` - Details
- `PUT /api/issues/{id}/` - Update
- `POST /api/issues/{id}/assign/` - Assign to authority

### Dashboard
- `GET /api/stats/` - Statistics
- `GET /api/notifications/` - My notifications

---

## 🗄️ Database

**Connection String:** `mongodb://localhost:27017/urbantrace_db`

**Collections:**
- `accounts_user` - User accounts
- `issues_issue` - Issues
- `dashboard_notification` - Notifications

**GUI:** MongoDB Compass (connect to localhost:27017)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB not connecting | Ensure MongoDB service is running |
| Port 8000 in use | Run `python manage.py runserver 8001` |
| CORS errors | Already configured in settings.py |
| Token expired | Use refresh token endpoint |
| Permission denied | Check user role and authentication |

---

## 📧 Email Setup

### Development (Default)
Emails printed to console.

### Production
1. Enable 2FA on Gmail
2. Generate [app-specific password](https://support.google.com/accounts/answer/185833)
3. Add to `.env`:
```env
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=app-password
REPORT_RECIPIENT_EMAIL=admin@example.com
```

---

## 🔐 User Roles

| Role | Can Do |
|------|--------|
| **Citizen** | Report issues, view own issues |
| **Authority** | View all issues, assign, update status |
| **Admin** | Manage all users and system |

---

## 📊 User Journey

```
1. Citizen goes to frontend
2. Maps interactive location
3. Fills issue form (no login needed)
4. Submits → Email sent to admin
5. Admin logs in & assigns issue
6. Authority receives notification
7. Authority updates status
8. Citizen gets notification
9. Issue marked resolved
```

---

## ⚙️ Configuration

Create `.env` file:
```env
DEBUG=True
SECRET_KEY=your-secret-key
MONGODB_HOST=mongodb://localhost:27017
MONGODB_NAME=urbantrace_db
```

See `.env.example` for all options.

---

## 🎯 What to Test

- [ ] User registration
- [ ] User login & token
- [ ] Create issue (anonymous)
- [ ] View issues (filtered)
- [ ] Assign issue
- [ ] Update status
- [ ] Get notifications
- [ ] View statistics

---

## 📞 Need Help?

1. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Review [MONGODB_SETUP.md](MONGODB_SETUP.md)
3. Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
4. Test with Postman or cURL
5. Check Django admin panel

---

## 🎉 You're Ready!

```
✅ MongoDB configured
✅ Backend running
✅ API endpoints ready
✅ Authentication working
✅ Documentation complete
```

**Start building! 🚀**

---

**Quick Links:**
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin/
- API Docs: See API_DOCUMENTATION.md
- MongoDB GUI: MongoDB Compass

**Last Updated:** May 14, 2026
