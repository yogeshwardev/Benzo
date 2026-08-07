# SkillForge Academy - Local Setup Guide

## 🚀 Quick Start (Recommended for Development)

Since Docker is having dependency issues, here's the fastest way to run the application locally:

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 15+ installed and running
- Git installed

### Step 1: Start Database

Docker is already running PostgreSQL and Redis for you:
```bash
# Check if services are running
docker-compose -f docker/docker-compose-dev.yml ps
```

**Database Details:**
- Host: localhost
- Port: 5432
- User: postgres
- Password: password
- Database: skillforge

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Backend Environment

Create `backend/.env` with:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillforge?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6380
JWT_SECRET=skillforge-super-secret-jwt-key-2024-local-development-32chars
JWT_REFRESH_SECRET=skillforge-super-secret-refresh-key-2024-local-development-32chars
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 4: Initialize Database

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### Step 5: Start Backend

```bash
cd backend
npm run start:dev
```

Backend will be available at: http://localhost:3001

### Step 6: Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### Step 7: Configure Frontend Environment

Create `frontend/.env.local` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 8: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:3000

## 🎯 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

## 🔑 Test Accounts

- **Admin**: admin@skillforge.com / admin123
- **Instructor**: instructor@skillforge.com / instructor123
- **Student**: student@skillforge.com / student123

## 🛠️ Docker Services Status

Currently Running:
- ✅ PostgreSQL (port 5432)
- ✅ Redis (port 6380)

To stop Docker services:
```bash
docker-compose -f docker/docker-compose-dev.yml down
```

## 📝 Troubleshooting

### Backend Issues

If backend won't start:
```bash
cd backend
# Clean install
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npm run start:dev
```

### Frontend Issues

If frontend won't start:
```bash
cd frontend
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose -f docker/docker-compose-dev.yml ps

# Restart PostgreSQL
docker-compose -f docker/docker-compose-dev.yml restart postgres
```

## 🎨 What's Included

The application includes:

### Frontend (Next.js 15)
- Modern landing page
- Student dashboard
- Instructor dashboard
- Admin dashboard
- Course pages
- Authentication pages
- Profile management
- Dark mode support
- Responsive design

### Backend (NestJS)
- Complete REST API
- JWT authentication
- Course management
- Payment integration
- Live class support
- Certificate generation
- Referral system
- Wallet management
- Analytics dashboard

### Database (PostgreSQL)
- 20+ tables
- Complete schema
- Seed data with test accounts
- 7 pre-configured courses

## 🚀 Next Steps

Once running:

1. **Test Authentication**: Login with test accounts
2. **Explore Dashboards**: Visit different role dashboards
3. **Test Course Flow**: Browse courses and enroll
4. **Check API Docs**: http://localhost:3001/api/docs
5. **Review Database**: Connect to PostgreSQL to inspect data

## 📚 Additional Resources

- [Frontend Documentation](../frontend/README.md)
- [Backend Documentation](../backend/README.md)
- [API Documentation](http://localhost:3001/api/docs)
- [Main README](../README.md)

---

**Enjoy exploring SkillForge Academy! 🎓**
