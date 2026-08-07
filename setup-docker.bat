@echo off
REM SkillForge Academy Docker Setup Script for Windows

echo 🚀 Setting up SkillForge Academy with Docker...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create docker env file if it doesn't exist
if not exist "docker\.env" (
    echo 📝 Creating docker environment file...
    copy docker\.env.example docker\.env
    echo ⚠️  Please edit docker\.env and configure your environment variables before proceeding.
    echo     Especially the JWT_SECRET and JWT_REFRESH_SECRET
    pause
)

REM Build and start services
echo 🔨 Building Docker images...
docker-compose build

echo 🚀 Starting services...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 15 /nobreak

REM Initialize database
echo 🗄️  Initializing database...
docker-compose exec -T backend npx prisma migrate dev
docker-compose exec -T backend npx prisma generate
docker-compose exec -T backend npx prisma db seed

echo ✅ Setup complete!
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001
echo    API Docs: http://localhost:3001/api/docs
echo.
echo 👤 Test Accounts:
echo    Admin: admin@skillforge.com / admin123
echo    Instructor: instructor@skillforge.com / instructor123
echo    Student: student@skillforge.com / student123
echo.
echo 📝 View logs with: docker-compose logs -f
echo 🛑 Stop services with: docker-compose down
pause
