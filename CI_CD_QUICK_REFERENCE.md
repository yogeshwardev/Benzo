# CI/CD Pipeline - Quick Reference

## What Was Created

### GitHub Actions Workflows (5 files)
1. **`.github/workflows/ci.yml`** - Continuous Integration
   - Lint, type check, build, test, security scan
   - Runs on every push and PR

2. **`.github/workflows/deploy.yml`** - Automated Deployment
   - Deploys to EC2 on main branch push
   - Health checks and automatic rollback

3. **`.github/workflows/release.yml`** - Release Management
   - Creates GitHub releases on tags
   - Builds and pushes Docker images

4. **`.github/workflows/security.yml`** - Security Scanning
   - Weekly dependency scans
   - CodeQL analysis
   - Container vulnerability scanning

5. **`.github/workflows/database.yml`** - Database Management
   - Manual database operations
   - Backup, restore, migrate, rollback

### Docker Improvements (4 files)
1. **`backend/Dockerfile`** - Enhanced with health checks, non-root user
2. **`frontend/Dockerfile`** - Enhanced with health checks, non-root user
3. **`backend/.dockerignore`** - Optimized build context
4. **`frontend/.dockerignore`** - Optimized build context

### Docker Compose (1 file)
1. **`docker-compose.prod.yml`** - Production-ready configuration
   - Health checks for all services
   - Restart policies
   - Volume management
   - Network isolation

### Nginx Configuration (1 file)
1. **`docker/nginx/nginx.conf`** - Production Nginx config
   - HTTP/2, SSL, Gzip
   - Security headers
   - Rate limiting
   - WebSocket support

### Deployment Scripts (8 files)
1. **`deploy/setup-server.sh`** - Initial server setup
2. **`deploy/deploy.sh`** - Automated deployment with rollback
3. **`deploy/setup-ssl.sh`** - SSL certificate setup
4. **`deploy/backup.sh`** - Database backup automation
5. **`deploy/health-check.sh`** - System health monitoring
6. **`deploy/rollback.sh`** - Manual rollback script
7. **`deploy/install-service.sh`** - Systemd service installation
8. **`deploy/.env.production`** - Environment template

### Documentation (5 files)
1. **`DEPLOYMENT.md`** - Complete deployment guide
2. **`GITHUB_SECRETS.md`** - Required secrets documentation
3. **`deploy/CI_CD_FLOW.md`** - CI/CD flow diagrams
4. **`deploy/ARCHITECTURE.md`** - Production architecture diagrams
5. **`deploy/LAUNCH_CHECKLIST.md`** - Production launch checklist

### Backend Health Endpoint (2 files)
1. **`backend/src/modules/health/health.controller.ts`** - Health check endpoint
2. **`backend/src/modules/health/health.module.ts`** - Health module
3. **`backend/src/app.module.ts`** - Updated to include health module

## Quick Start

### 1. Setup GitHub Secrets
Required secrets (see `GITHUB_SECRETS.md`):
- AWS_HOST, AWS_USER, AWS_SSH_KEY
- DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
- RESEND_API_KEY, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
- R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY

### 2. Setup EC2 Server
```bash
# SSH into EC2
ssh ubuntu@your-ec2-ip

# Clone repository
git clone https://github.com/yourusername/skillforge-academy.git
cd skillforge-academy

# Run setup script
chmod +x deploy/setup-server.sh
./deploy/setup-server.sh

# Configure environment
nano .env
# Add all your secrets

# Setup SSL (optional)
chmod +x deploy/setup-ssl.sh
./deploy/setup-ssl.sh your-domain.com admin@your-domain.com

# Deploy
chmod +x deploy/deploy.sh
./deploy/deploy.sh

# Setup auto-restart
chmod +x deploy/install-service.sh
./deploy/install-service.sh
```

### 3. Enable Auto-Deployment
Push to `main` branch - everything else is automatic!

## Key Features

### ✅ Zero Downtime
- Blue/Green deployment strategy
- Health checks before traffic routing
- Automatic rollback on failure

### ✅ Security
- Automated security scanning
- SSL/TLS encryption
- Security headers
- Rate limiting
- Container isolation

### ✅ Monitoring
- Health checks for all services
- Resource monitoring
- Log aggregation
- Automated backups

### ✅ Rollback
- Automatic rollback on deployment failure
- Manual rollback script
- Database rollback capability
- Git-based version control

### ✅ Automation
- Auto-deploy on push
- Auto-backup database
- Auto-renew SSL
- Auto-restart services
- Auto-cleanup old backups

## Pipeline Triggers

### CI Pipeline
- Push to main, develop, staging
- Pull requests to main, develop

### Deploy Pipeline
- Push to main
- Manual workflow dispatch

### Release Pipeline
- Git tags (v*)

### Security Pipeline
- Weekly cron job
- Manual dispatch

### Database Pipeline
- Manual dispatch only

## Health Checks

### Check Application Health
```bash
# On server
./deploy/health-check.sh

# Via API
curl https://your-domain.com/api/health
curl https://your-domain.com/health
```

### Check Container Status
```bash
docker ps
docker logs skillforge-backend
docker logs skillforge-frontend
```

## Common Commands

### Manual Deployment
```bash
cd ~/skillforge
./deploy/deploy.sh
```

### Manual Rollback
```bash
cd ~/skillforge
./deploy/rollback.sh
```

### Manual Backup
```bash
cd ~/skillforge
./deploy/backup.sh
```

### View Logs
```bash
# Backend
docker logs -f skillforge-backend

# Frontend
docker logs -f skillforge-frontend

# Nginx
docker logs -f skillforge-nginx

# Database
docker logs -f skillforge-postgres
```

### Restart Services
```bash
cd ~/skillforge
docker-compose restart
```

### Rebuild Containers
```bash
cd ~/skillforge
docker-compose down
docker-compose build
docker-compose up -d
```

## Troubleshooting

### Deployment Failed
1. Check GitHub Actions logs
2. SSH into server
3. Check container logs
4. Run health check script
5. Use rollback if needed

### Health Check Failed
1. Check if containers are running: `docker ps`
2. Check container logs
3. Verify environment variables
4. Check database connection
5. Restart containers

### SSL Issues
1. Check SSL certificate: `sudo certbot certificates`
2. Test Nginx config: `sudo nginx -t`
3. Reload Nginx: `sudo systemctl reload nginx`
4. Check DNS propagation

### Database Issues
1. Check PostgreSQL logs
2. Verify database connection
3. Check migration status
4. Restore from backup if needed

## Next Steps

1. **Add all GitHub Secrets** - See `GITHUB_SECRETS.md`
2. **Setup EC2 server** - Run `deploy/setup-server.sh`
3. **Configure environment** - Update `.env` file
4. **Setup SSL** - Run `deploy/setup-ssl.sh`
5. **Deploy application** - Run `deploy/deploy.sh`
6. **Test thoroughly** - Use `LAUNCH_CHECKLIST.md`
7. **Enable monitoring** - Configure alerts
8. **Document procedures** - Update as needed

## Support Documentation

- **Deployment Guide**: `DEPLOYMENT.md`
- **GitHub Secrets**: `GITHUB_SECRETS.md`
- **CI/CD Flow**: `deploy/CI_CD_FLOW.md`
- **Architecture**: `deploy/ARCHITECTURE.md`
- **Launch Checklist**: `deploy/LAUNCH_CHECKLIST.md`

## Success Criteria

✅ Push to main triggers deployment
✅ Deployment completes without errors
✅ Health checks pass
✅ Application accessible via HTTPS
✅ All features working
✅ Automatic rollback tested
✅ Backups working
✅ Monitoring configured

---

**Note**: This CI/CD pipeline is production-ready and follows industry best practices for secure, automated deployments.
