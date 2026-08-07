# SkillForge Academy - Docker Setup Guide

This guide will help you run SkillForge Academy locally using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- Git installed
- At least 8GB RAM available
- At least 20GB disk space available

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/skillforge-academy.git
cd skillforge-academy
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cd docker
cp .env.example .env
```

Edit the `.env` file and update the following **required** variables:

```env
# Database (default values work for local development)
DATABASE_URL=postgresql://postgres:password@postgres:5432/skillforge?schema=public

# JWT (generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters

# Application
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Optional Variables** (for full functionality):
- Google OAuth credentials
- Razorpay payment keys
- LiveKit credentials
- Cloudflare R2 credentials
- Bunny Stream API key
- Resend API key

### 3. Start All Services

```bash
cd skillforge-academy
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- Backend API (port 3001)
- Frontend (port 3000)
- Nginx reverse proxy (port 80)

### 4. Initialize Database

Once services are running, initialize the database:

```bash
# Run database migrations
docker-compose exec backend npx prisma migrate dev

# Generate Prisma client
docker-compose exec backend npx prisma generate

# Seed the database with test data
docker-compose exec backend npx prisma db seed
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Nginx (Production-like)**: http://localhost

## Test Accounts

After seeding, you can use these test accounts:

**Admin:**
- Email: admin@skillforge.com
- Password: admin123

**Instructor:**
- Email: instructor@skillforge.com
- Password: instructor123

**Student:**
- Email: student@skillforge.com
- Password: student123

## Common Commands

### View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

### Rebuild Services

```bash
docker-compose build
docker-compose up -d
```

### Restart Specific Service

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Access Database Directly

```bash
docker-compose exec postgres psql -U postgres -d skillforge
```

### Access Redis CLI

```bash
docker-compose exec redis redis-cli
```

## Development Mode

For development, you can run services individually:

### Backend Only

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### Frontend Only

```bash
cd frontend
npm install
npm run dev
```

### Database Only

```bash
docker-compose up postgres redis
```

## Troubleshooting

### Port Already in Use

If you get port conflicts, modify the ports in `docker-compose.yml`:

```yaml
services:
  postgres:
    ports:
      - "5433:5432"  # Change to 5433
  backend:
    ports:
      - "3002:3001"  # Change to 3002
  frontend:
    ports:
      - "3001:3000"  # Change to 3001
```

### Database Connection Issues

```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma db seed
```

### Container Won't Start

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs backend

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Permission Issues (Linux/Mac)

```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## Production Deployment

For production deployment:

1. **Update Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong JWT secrets
   - Configure production database
   - Add actual API keys

2. **Build and Deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Configure SSL**
   - Add SSL certificates to `docker/ssl/`
   - Update nginx.conf for HTTPS

4. **Set Up Domain**
   - Configure DNS to point to your server
   - Update FRONTEND_URL with your domain

## Monitoring

### Check Service Health

```bash
# Check if services are running
docker-compose ps

# Check resource usage
docker stats
```

### Database Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres skillforge > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres skillforge < backup.sql
```

## Updating the Application

When you make changes to the code:

```bash
# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Or rebuild specific service
docker-compose build backend
docker-compose up -d backend
```

## Security Notes

1. **Never commit** `.env` files to version control
2. **Use strong secrets** for production
3. **Enable SSL** for production
4. **Keep dependencies updated**
5. **Use firewall rules** to restrict access

## Performance Optimization

For better performance:

1. **Increase Docker Resources** (Docker Desktop settings)
   - RAM: 4GB minimum, 8GB recommended
   - CPUs: 2 minimum, 4 recommended

2. **Enable Docker BuildKit**
   ```bash
   export DOCKER_BUILDKIT=1
   ```

3. **Use Multi-stage Builds** (already configured in Dockerfiles)

4. **Enable Caching** (Redis is included)

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify Docker Desktop is running
3. Check port availability
4. Review environment variables
5. Check documentation: https://docs.skillforge.com

## Next Steps

After successful setup:

1. Access the frontend at http://localhost:3000
2. Log in with test accounts
3. Explore the dashboards
4. Test course enrollment
5. Review API documentation at http://localhost:3001/api/docs

---

**Happy Learning! 🚀**
