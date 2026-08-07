#!/bin/bash

# Database Backup Script
# This script creates automated database backups

set -e

# Configuration
BACKUP_DIR=~/skillforge/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

echo "💾 Creating database backup..."

# Create backup
docker exec skillforge-postgres pg_dump -U postgres skillforge > $BACKUP_DIR/backup_${TIMESTAMP}.sql

# Compress backup
gzip $BACKUP_DIR/backup_${TIMESTAMP}.sql

echo "✅ Backup created: backup_${TIMESTAMP}.sql.gz"

# Cleanup old backups
echo "🧹 Cleaning up backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Backup statistics
BACKUP_COUNT=$(find $BACKUP_DIR -name "backup_*.sql.gz" | wc -l)
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)

echo "📊 Backup statistics:"
echo "   Total backups: $BACKUP_COUNT"
echo "   Total size: $TOTAL_SIZE"
