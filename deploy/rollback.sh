#!/bin/bash

# Rollback Script
# This script rolls back to the previous deployment

set -e

# Configuration
DEPLOY_DIR=~/skillforge
ROLLBACK_TAG=$DEPLOY_DIR/.rollback_tag

echo "🔄 Starting rollback..."

# Check if rollback state exists
if [ ! -f "$ROLLBACK_TAG" ]; then
    echo "❌ No rollback state found. Cannot rollback automatically."
    echo "Manual rollback instructions:"
    echo "1. Check git history: git log --oneline"
    echo "2. Checkout previous commit: git checkout <commit-hash>"
    echo "3. Run deploy: ./deploy/deploy.sh"
    exit 1
fi

# Get previous commit
PREVIOUS_COMMIT=$(cat $ROLLBACK_TAG)
echo "📦 Rolling back to commit: $PREVIOUS_COMMIT"

# Stop containers
echo "⏹️  Stopping containers..."
cd $DEPLOY_DIR
docker-compose down

# Checkout previous commit
echo "🔙 Checking out previous commit..."
git checkout $PREVIOUS_COMMIT

# Rebuild and deploy
echo "🔨 Rebuilding and deploying..."
./deploy/deploy.sh

# Verify rollback
echo "🏥 Verifying rollback..."
sleep 30

if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend rollback successful"
else
    echo "❌ Backend rollback failed"
    exit 1
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend rollback successful"
else
    echo "❌ Frontend rollback failed"
    exit 1
fi

echo "🎉 Rollback completed successfully!"
