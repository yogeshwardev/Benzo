# 🚀 Quick Start Guide - SkillForge Academy

## Fastest Way to Run (Windows)

1. **Open PowerShell or Command Prompt** in the `skillforge-academy` directory

2. **Run the setup script:**
   ```bash
   setup-docker.bat
   ```

3. **Wait for setup to complete** (takes 5-10 minutes)

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - API Docs: http://localhost:3001/api/docs

## Fastest Way to Run (Mac/Linux)

1. **Open Terminal** in the `skillforge-academy` directory

2. **Make the script executable:**
   ```bash
   chmod +x setup-docker.sh
   ```

3. **Run the setup script:**
   ```bash
   ./setup-docker.sh
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - API Docs: http://localhost:3001/api/docs

## Manual Setup (All Platforms)

### Step 1: Configure Environment

```bash
cd docker
cp .env.example .env
```

Edit `.env` and set at minimum:
```env
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
```

### Step 2: Start Services

```bash
cd ..
docker-compose up -d
```

### Step 3: Initialize Database

```bash
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma generate
docker-compose exec backend npx prisma db seed
```

### Step 4: Access Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

## Test Accounts

- **Admin**: admin@skillforge.com / admin123
- **Instructor**: instructor@skillforge.com / instructor123
- **Student**: student@skillforge.com / student123

## Common Issues

### Port Already in Use?

Edit `docker/docker-compose.yml` and change ports:
```yaml
ports:
  - "3001:3001"  # Change to "3002:3001"
```

### Database Connection Error?

```bash
docker-compose down -v
docker-compose up -d
# Then re-run database initialization
```

### Can't Access Services?

```bash
# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f
```

## Stop Services

```bash
docker-compose down
```

## View Logs

```bash
docker-compose logs -f
```

## Complete Documentation

For detailed setup instructions, see [DOCKER_SETUP.md](DOCKER_SETUP.md)

---

**Need Help?** Check the main [README.md](README.md) or open an issue on GitHub.
