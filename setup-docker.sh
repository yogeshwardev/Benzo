#!/bin/bash

# SkillForge Academy Docker Setup Script

echo "🚀 Setting up SkillForge Academy with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create docker env file if it doesn't exist
if [ ! -f "docker/.env" ]; then
    echo "📝 Creating docker environment file..."
    cp docker/.env.example docker/.env
    echo "⚠️  Please edit docker/.env and configure your environment variables before proceeding."
    echo "    Especially the JWT_SECRET and JWT_REFRESH_SECRET"
    read -p "Press Enter after configuring docker/.env..."
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Initialize database
echo "🗄️  Initializing database..."
docker-compose exec -T backend npx prisma migrate dev
docker-compose exec -T backend npx prisma generate
docker-compose exec -T backend npx prisma db seed

echo "✅ Setup complete!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   API Docs: http://localhost:3001/api/docs"
echo ""
echo "👤 Test Accounts:"
echo "   Admin: admin@skillforge.com / admin123"
echo "   Instructor: instructor@skillforge.com / instructor123"
echo "   Student: student@skillforge.com / student123"
echo ""
echo "📝 View logs with: docker-compose logs -f"
echo "🛑 Stop services with: docker-compose down"
