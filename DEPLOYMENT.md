# SkillForge Academy - CI/CD Pipeline Documentation

## Overview

This document describes the complete enterprise-grade CI/CD pipeline for SkillForge Academy, designed for automated, secure, and zero-downtime deployments to AWS EC2.

## Architecture

```
GitHub Actions → Build & Test → Security Scan → Deploy to EC2 → Health Check → Rollback on Failure
```

## Components

### 1. GitHub Actions Workflows

#### CI Pipeline (`.github/workflows/ci.yml`)
- **Trigger**: Push to main/develop/staging, Pull requests
- **Stages**:
  - Lint & Type Check
  - Unit Tests
  - Build Applications
  - Security Scan
- **Artifacts**: Backend dist, Frontend .next

#### Deploy Pipeline (`.github/workflows/deploy.yml`)
- **Trigger**: Push to main branch, Manual dispatch
- **Process**:
  - Download build artifacts
  - SSH into EC2
  - Deploy files
  - Restart containers
  - Health check
  - Automatic rollback on failure

#### Release Pipeline (`.github/workflows/release.yml`)
- **Trigger**: Git tags (v*)
- **Process**:
  - Create GitHub release
  - Build Docker images
  - Push to Docker Hub

#### Security Pipeline (`.github/workflows/security.yml`)
- **Trigger**: Weekly cron, Manual dispatch
- **Scans**:
  - Dependency vulnerabilities (npm audit)
  - CodeQL analysis
  - Container security (Trivy)

#### Database Pipeline (`.github/workflows/database.yml`)
- **Trigger**: Manual dispatch
- **Actions**:
  - Backup database
  - Restore from backup
  - Run migrations
  - Rollback migrations

### 2. Docker Configuration

#### Backend Dockerfile Improvements
- Non-root user for security
- Health checks
- Smaller final image
- Production dependencies only

#### Frontend Dockerfile Improvements
- Non-root user for security
- Health checks
- Proper build caching
- Production dependencies only

#### Docker Compose Production
- Health checks for all services
- Restart policies
- Volume management
- Network isolation
- Proper dependencies

### 3. Nginx Configuration

#### Production Features
- HTTP to HTTPS redirect
- HTTP/2 support
- Gzip compression
- Security headers
- Rate limiting
- WebSocket support
- Static file caching
- Large file upload support (100MB)

### 4. EC2 Deployment Scripts

#### setup-server.sh
- Install Docker & Docker Compose
- Install Nginx
- Install Node.js
- Install Certbot (SSL)
- Configure firewall
- Create deployment directory
- Generate .env template

#### deploy.sh
- Save rollback state
- Build applications
- Database backup before migration
- Run migrations with rollback
- Deploy containers
- Health checks
- Automatic rollback on failure

#### setup-ssl.sh
- Obtain Let's Encrypt SSL certificates
- Configure auto-renewal
- Setup SSL certificates for Nginx

#### backup.sh
- Automated database backups
- Compress backups
- Cleanup old backups (30-day retention)
- Backup statistics

#### health-check.sh
- Check all services health
- Monitor system resources
- Check Docker containers
- Generate health report

#### skillforge.service
- Systemd service for auto-restart
- Manages Docker Compose
- Auto-start on boot

## Required GitHub Secrets

### AWS Secrets
- `AWS_HOST` - EC2 instance IP or domain
- `AWS_USER` - SSH username (e.g., ubuntu)
- `AWS_SSH_KEY` - Private SSH key

### Application Secrets
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection string
- `JWT_SECRET` - JWT secret key
- `JWT_REFRESH_SECRET` - JWT refresh secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret
- `RESEND_API_KEY` - Resend API key
- `LIVEKIT_API_KEY` - LiveKit API key
- `LIVEKIT_API_SECRET` - LiveKit API secret
- `R2_ACCESS_KEY_ID` - Cloudflare R2 access key
- `R2_SECRET_ACCESS_KEY` - Cloudflare R2 secret key

### Optional Secrets
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password
- `SNYK_TOKEN` - Snyk security scanner token

## Deployment Process

### Initial Setup

1. **Clone repository to EC2**
   ```bash
   git clone https://github.com/yourusername/skillforge-academy.git
   cd skillforge-academy
   ```

2. **Run setup script**
   ```bash
   chmod +x deploy/setup-server.sh
   ./deploy/setup-server.sh
   ```

3. **Configure environment variables**
   ```bash
   nano .env
   # Update all required values
   ```

4. **Setup SSL (optional)**
   ```bash
   chmod +x deploy/setup-ssl.sh
   ./deploy/setup-ssl.sh your-domain.com admin@your-domain.com
   ```

5. **Deploy application**
   ```bash
   chmod +x deploy/deploy.sh
   ./deploy/deploy.sh
   ```

6. **Setup systemd service**
   ```bash
   sudo cp deploy/skillforge.service /etc/systemd/system/
   sudo systemctl enable skillforge
   sudo systemctl start skillforge
   ```

### Automated Deployment

Every push to `main` branch triggers:
1. CI pipeline runs tests and builds
2. Security scan runs
3. Deploy pipeline deploys to EC2
4. Health checks verify deployment
5. Automatic rollback if deployment fails

### Manual Deployment

```bash
# Trigger deploy workflow manually
# Go to GitHub Actions → Deploy to Production → Run workflow
```

## Monitoring

### Health Checks

Run health check script:
```bash
./deploy/health-check.sh
```

### Logs

View application logs:
```bash
docker logs -f skillforge-backend
docker logs -f skillforge-frontend
docker logs -f skillforge-nginx
```

### System Resources

Monitor CPU, memory, disk:
```bash
./deploy/health-check.sh
```

## Backup Strategy

### Database Backups

Automated daily backups:
```bash
# Add to crontab
0 2 * * * cd ~/skillforge && ./deploy/backup.sh
```

### Manual Backup

```bash
./deploy/backup.sh
```

### Restore from Backup

```bash
# Use database workflow
# GitHub Actions → Database Management → restore
# Specify backup file name
```

## Rollback Procedure

### Automatic Rollback

Deploy pipeline automatically rolls back if:
- Health check fails
- Migration fails
- Container restart fails

### Manual Rollback

```bash
cd ~/skillforge
git checkout <previous-commit>
./deploy/deploy.sh
```

## SSL Certificate Management

### Auto-renewal

Certificates are automatically renewed by Certbot cron job.

### Manual Renewal

```bash
sudo certbot renew
sudo systemctl reload nginx
```

## Security Features

1. **Non-root Docker containers**
2. **Secrets management via GitHub Secrets**
3. **Security scanning in CI/CD**
4. **SSL/TLS encryption**
5. **Security headers in Nginx**
6. **Rate limiting**
7. **Container health checks**
8. **Automatic backups**
9. **Rollback capability**

## Performance Optimizations

1. **Docker layer caching**
2. **npm caching in CI/CD**
3. **Gzip compression**
4. **Static file caching**
5. **HTTP/2 support**
6. **Connection pooling in Nginx**
7. **Keep-alive connections**

## Troubleshooting

### Container won't start

```bash
docker logs skillforge-backend
docker logs skillforge-frontend
```

### Database connection issues

```bash
docker logs skillforge-postgres
docker exec skillforge-postgres psql -U postgres skillforge
```

### SSL issues

```bash
sudo certbot certificates
sudo nginx -t
sudo systemctl reload nginx
```

## Scaling Considerations

### Horizontal Scaling

To scale horizontally:
1. Add load balancer
2. Deploy multiple instances
3. Use shared database and Redis
4. Configure session affinity

### Vertical Scaling

To scale vertically:
1. Upgrade EC2 instance type
2. Increase Docker resource limits
3. Optimize database queries
4. Add Redis caching

## Disaster Recovery

### Backup Locations

- Database backups: `~/skillforge/backups/`
- Application backups: Git history
- Configuration: `.env` files

### Recovery Steps

1. Restore database from backup
2. Deploy previous commit
3. Restore environment variables
4. Restart services
5. Verify health checks

## Maintenance

### Regular Tasks

- Weekly: Security scan
- Daily: Database backup
- Monthly: Review logs
- Quarterly: Update dependencies

### Updates

- Application: Push to main branch
- System: `sudo apt-get update && sudo apt-get upgrade`
- Docker: Follow Docker updates
- Dependencies: Update package.json and deploy

## Support

For deployment issues:
1. Check logs: `./deploy/health-check.sh`
2. Review GitHub Actions logs
3. Check container status: `docker ps`
4. Verify environment variables
5. Review firewall rules
