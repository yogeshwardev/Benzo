#!/bin/bash

# SkillForge Academy Deployment Script
# This script handles the deployment process with rollback capability

set -e

# Configuration
DEPLOY_DIR=~/skillforge
BACKUP_DIR=$DEPLOY_DIR/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ROLLBACK_TAG=$DEPLOY_DIR/.rollback_tag

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Error handling
trap 'log_error "Deployment failed! Rolling back..."; rollback' ERR

# Rollback function
rollback() {
    log_warning "Initiating rollback..."
    
    if [ -f "$ROLLBACK_TAG" ]; then
        git checkout $(cat $ROLLBACK_TAG)
        log_info "Restored previous version"
    fi
    
    cd $DEPLOY_DIR
    docker-compose down
    docker-compose up -d
    
    log_info "Rollback completed"
    exit 1
}

# Save current state for rollback
save_rollback_state() {
    git rev-parse HEAD > $ROLLBACK_TAG
    log_info "Saved rollback state: $(cat $ROLLBACK_TAG)"
}

# Main deployment
deploy() {
    log_info "🚀 Starting deployment..."
    
    # Save rollback state
    save_rollback_state
    
    # Create backup directory
    mkdir -p $BACKUP_DIR
    
    # Backup current running containers
    log_info "📦 Creating backup..."
    cd $DEPLOY_DIR
    docker-compose config > docker-compose.backup.yml
    
    # Pull latest code
    log_info "📥 Pulling latest code..."
    git pull origin main
    
    # Build backend
    log_info "🔨 Building backend..."
    cd backend
    npm ci
    npm run build
    npx prisma generate
    
    # Build frontend
    log_info "🔨 Building frontend..."
    cd ../frontend
    npm ci
    npm run build
    
    # Database backup before migration
    log_info "💾 Creating database backup..."
    cd $DEPLOY_DIR
    docker exec skillforge-postgres pg_dump -U postgres skillforge > $BACKUP_DIR/backup_${TIMESTAMP}.sql
    
    # Run migrations
    log_info "🔄 Running database migrations..."
    cd backend
    npx prisma migrate deploy || {
        log_error "Migration failed! Restoring database backup..."
        docker exec -i skillforge-postgres psql -U postgres skillforge < $BACKUP_DIR/backup_${TIMESTAMP}.sql
        exit 1
    }
    
    # Build Docker images
    log_info "🐳 Building Docker images..."
    cd $DEPLOY_DIR
    docker-compose build
    
    # Stop containers
    log_info "⏹️  Stopping containers..."
    docker-compose down
    
    # Start containers
    log_info "▶️  Starting containers..."
    docker-compose up -d
    
    # Wait for containers to be healthy
    log_info "⏳ Waiting for containers to be healthy..."
    sleep 30
    
    # Health check
    log_info "🏥 Running health checks..."
    
    # Check backend
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        log_info "✅ Backend is healthy"
    else
        log_error "❌ Backend health check failed"
        rollback
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_info "✅ Frontend is healthy"
    else
        log_error "❌ Frontend health check failed"
        rollback
    fi
    
    # Cleanup old backups (keep last 7 days)
    log_info "🧹 Cleaning old backups..."
    find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
    
    # Remove rollback tag on success
    rm -f $ROLLBACK_TAG
    
    log_info "🎉 Deployment completed successfully!"
}

# Main
deploy
