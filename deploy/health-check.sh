#!/bin/bash

# Health Check Script
# This script checks the health of all services

set -e

echo "🏥 Running health checks..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check service health
check_service() {
    local service_name=$1
    local health_url=$2
    
    if curl -f $health_url > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $service_name is healthy"
        return 0
    else
        echo -e "${RED}❌${NC} $service_name is unhealthy"
        return 1
    fi
}

# Check backend
check_service "Backend" "http://localhost:3001/api/health"

# Check frontend
check_service "Frontend" "http://localhost:3000"

# Check database
if docker exec skillforge-postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Database is healthy"
else
    echo -e "${RED}❌${NC} Database is unhealthy"
fi

# Check Redis
if docker exec skillforge-redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Redis is healthy"
else
    echo -e "${RED}❌${NC} Redis is unhealthy"
fi

# Check Nginx
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅${NC} Nginx is running"
else
    echo -e "${RED}❌${NC} Nginx is not running"
fi

# Check disk space
echo ""
echo "💾 Disk Space:"
df -h | grep -E "^/dev/sd|^Filesystem"

# Check memory
echo ""
echo "🧠 Memory Usage:"
free -h

# Check CPU
echo ""
echo "⚡ CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1%/"

# Check Docker containers
echo ""
echo "🐳 Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🏥 Health check completed"
