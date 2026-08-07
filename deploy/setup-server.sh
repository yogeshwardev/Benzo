#!/bin/bash

# SkillForge Academy EC2 Deployment Script
# This script sets up the server and prepares it for deployment

set -e

echo "🚀 Starting SkillForge Academy EC2 Setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "Docker installed successfully"
else
    echo "Docker already installed"
fi

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully"
else
    echo "Docker Compose already installed"
fi

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt-get install nginx -y

# Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Certbot for SSL
echo "🔒 Installing Certbot..."
sudo apt-get install certbot python3-certbot-nginx -y

# Configure firewall
echo "🛡️ Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw --force enable

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p ~/skillforge
cd ~/skillforge

# Create .env file template
echo "🔧 Creating environment file template..."
cat > .env << EOF
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CHANGE_THIS_PASSWORD
POSTGRES_DB=skillforge

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=CHANGE_THIS_JWT_SECRET
JWT_REFRESH_SECRET=CHANGE_THIS_REFRESH_SECRET
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# LiveKit
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
LIVEKIT_URL=wss://your-livekit-server

# Cloudflare R2
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=skillforge-uploads
R2_ENDPOINT=https://your-r2-endpoint

# Bunny Stream
BUNNY_API_KEY=your-bunny-api-key
BUNNY_LIBRARY_ID=your-bunny-library-id

# Resend
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@your-domain.com

# Application
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
DOMAIN=your-domain.com

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
EOF

echo "✅ Setup completed successfully!"
echo "📝 Please update the .env file with your actual values"
echo "🔄 Then run: ./deploy.sh"
