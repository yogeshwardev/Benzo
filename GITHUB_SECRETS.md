# Required GitHub Secrets for SkillForge Academy Deployment

## AWS Secrets

### AWS Credentials
- **AWS_HOST**: EC2 instance IP address (e.g., `32.198.122.128`)
- **AWS_USER**: SSH username for EC2 (usually `ubuntu`)
- **AWS_SSH_KEY**: Private SSH key for EC2 instance (the private key file content)

## Application Secrets

### Database
- **DATABASE_URL**: PostgreSQL connection string
  ```
  postgresql://postgres:YOUR_PASSWORD@localhost:5432/skillforge?schema=public
  ```
- **DIRECT_URL**: Direct PostgreSQL connection for migrations
  ```
  postgresql://postgres:YOUR_PASSWORD@localhost:5432/skillforge?schema=public
  ```

### Authentication
- **JWT_SECRET**: Secret key for JWT token generation (generate with: `openssl rand -base64 32`)
- **JWT_REFRESH_SECRET**: Secret key for refresh tokens (generate with: `openssl rand -base64 32`)

### Google OAuth
- **GOOGLE_CLIENT_ID**: Google OAuth 2.0 Client ID from Google Cloud Console
- **GOOGLE_CLIENT_SECRET**: Google OAuth 2.0 Client Secret from Google Cloud Console
- **Note**: Set callback URL to `https://benzo.co.in/api/auth/google/callback` in Google Console

### Payment Gateway
- **RAZORPAY_KEY_ID**: Razorpay Key ID from Razorpay Dashboard
- **RAZORPAY_KEY_SECRET**: Razorpay Key Secret from Razorpay Dashboard
- **RAZORPAY_WEBHOOK_SECRET**: Razorpay Webhook Secret for payment verification

### Live Classes
- **LIVEKIT_API_KEY**: LiveKit API Key from LiveKit Cloud Console
- **LIVEKIT_API_SECRET**: LiveKit API Secret from LiveKit Cloud Console
- **LIVEKIT_URL**: LiveKit server URL (e.g., `wss://your-livekit-server`)

### File Storage
- **R2_ACCESS_KEY_ID**: Cloudflare R2 Access Key ID
- **R2_SECRET_ACCESS_KEY**: Cloudflare R2 Secret Access Key
- **R2_BUCKET_NAME**: Cloudflare R2 bucket name (e.g., `skillforge-uploads`)
- **R2_ENDPOINT**: Cloudflare R2 endpoint URL (e.g., `https://your-account-id.r2.cloudflarestorage.com`)

### Email Service
- **RESEND_API_KEY**: Resend API key from Resend Dashboard
- **RESEND_FROM_EMAIL**: From email address (e.g., `noreply@skillforge.com`)

### Video Streaming
- **BUNNY_API_KEY**: Bunny CDN API Key from Bunny.net Dashboard
- **BUNNY_LIBRARY_ID**: Bunny Stream Library ID from Bunny.net Dashboard

## Optional Secrets

### Docker Registry
- **DOCKER_USERNAME**: Docker Hub username (if pushing images)
- **DOCKER_PASSWORD**: Docker Hub password (if pushing images)

### Security Scanning
- **SNYK_TOKEN**: Snyk API token for advanced security scanning

## Environment Variables (not secrets)

These should be set in the `.env` file on the server:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=skillforge

REDIS_HOST=redis
REDIS_PORT=6379

JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback

PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
DOMAIN=your-domain.com

THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

## Secret Generation Commands

### Generate random secrets
```bash
# JWT Secret
openssl rand -base64 32

# Random string for passwords
openssl rand -base64 24
```

## Setup Instructions

### 1. Generate SSH Key
```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

### 2. Add SSH Key to EC2
- Copy public key to EC2 `~/.ssh/authorized_keys`
- Or use AWS EC2 Key Pairs

### 3. Add Secrets to GitHub
- Go to Repository → Settings → Secrets and variables → Actions
- Click "New repository secret"
- Add each secret from the list above

### 4. Configure Environment Variables
- SSH into EC2
- Edit `~/skillforge/.env`
- Add all required environment variables
- Save and restart services

## Security Best Practices

1. **Never commit secrets to repository**
2. **Use strong, unique passwords**
3. **Rotate secrets regularly**
4. **Use different secrets for different environments**
5. **Limit GitHub Actions permissions**
6. **Enable branch protection rules**
7. **Use GitHub Dependabot for dependency updates**
8. **Enable two-factor authentication**

## Secret Rotation

### Database Password
```bash
# On EC2
docker exec skillforge-postgres psql -U postgres
ALTER USER postgres WITH PASSWORD 'new_password';
# Update .env file
# Restart containers
```

### JWT Secrets
1. Generate new secrets
2. Update GitHub Secrets
3. Update .env file on server
4. Redeploy application

### API Keys
1. Generate new keys from respective services
2. Update GitHub Secrets
3. Update .env file on server
4. Redeploy application
