@echo off
REM SkillForge Academy Local Startup Script

echo 🚀 Starting SkillForge Academy locally...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Start Docker services (PostgreSQL and Redis)
echo 🐳 Starting Docker services (PostgreSQL and Redis)...
docker-compose -f docker/docker-compose-dev.yml up -d
if %errorlevel% neq 0 (
    echo ❌ Failed to start Docker services
    pause
    exit /b 1
)
echo ✅ Docker services started
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

REM Create backend .env file
if not exist ".env" (
    echo 📝 Creating backend .env file...
    (
        echo DATABASE_URL=postgresql://postgres:password@localhost:5432/skillforge?schema=public
        echo REDIS_HOST=localhost
        echo REDIS_PORT=6380
        echo JWT_SECRET=skillforge-super-secret-jwt-key-2024-local-development-32chars
        echo JWT_REFRESH_SECRET=skillforge-super-secret-refresh-key-2024-local-development-32chars
        echo PORT=3001
        echo NODE_ENV=development
        echo FRONTEND_URL=http://localhost:3000
    ) > .env
    echo ✅ Backend .env file created
)

REM Initialize database
echo 🗄️  Initializing database...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)
call npx prisma migrate dev
if %errorlevel% neq 0 (
    echo ❌ Failed to run migrations
    pause
    exit /b 1
)
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)
echo ✅ Database initialized
echo.

REM Start backend
echo 🔧 Starting backend...
start "SkillForge Backend" cmd /k "npm run start:dev"
echo ✅ Backend starting on http://localhost:3001
echo.

REM Go back to root directory
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

REM Create frontend .env file
if not exist ".env.local" (
    echo 📝 Creating frontend .env.local file...
    echo NEXT_PUBLIC_API_URL=http://localhost:3001/api > .env.local
    echo ✅ Frontend .env.local file created
)

REM Start frontend
echo 🎨 Starting frontend...
start "SkillForge Frontend" cmd /k "npm run dev"
echo ✅ Frontend starting on http://localhost:3000
echo.

echo.
echo ========================================================
echo 🎉 SkillForge Academy is starting up!
echo ========================================================
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    API Docs: http://localhost:3001/api/docs
echo.
echo 👤 Test Accounts:
echo    Admin:      admin@skillforge.com / admin123
echo    Instructor: instructor@skillforge.com / instructor123
echo    Student:    student@skillforge.com / student123
echo.
echo 📝 Terminal windows have been opened for:
echo    - Backend (npm run start:dev)
echo    - Frontend (npm run dev)
echo.
echo 🛑 To stop: Close the terminal windows and run:
echo    docker-compose -f docker/docker-compose-dev.yml down
echo.
echo ========================================================
echo.

pause
