# Production Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              Internet / Users                                        │
└────────────────────────────────────────┬────────────────────────────────────────────┘
                                         │
                                         ▼
                            ┌────────────────────────────────┐
                            │      Cloudflare CDN (DNS)      │
                            │      (SSL Termination)        │
                            └────────────────────────────────┘
                                         │
                                         ▼
                            ┌────────────────────────────────┐
                            │      AWS EC2 Ubuntu          │
                            │      - Nginx (Reverse Proxy)│
                            │      - Docker Compose       │
                            └────────────────────────────────┘
                                         │
                    ┌────────────────┴────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌───────────────────────┐       ┌───────────────────────┐
        │    Nginx (Port 80/443)  │       │   Docker Compose      │
        │                     │       │                       │
        │ - HTTP → HTTPS       │       │ - Service Management  │
        │ - SSL/TLS            │       │ - Network Isolation   │
        │ - HTTP/2             │       │ - Volume Management   │
        │ - Gzip Compression   │       │ - Health Checks      │
        │ - Rate Limiting      │       │ - Auto Restart        │
        │ - Security Headers   │       │                       │
        └───────────────────────┘       └───────────────────────┘
                    │                                   │
        ┌────────────────┴────────────────┐
        │                                   │
        ▼                                   ▼
┌───────────────────┐       ┌───────────────────────┐
│   Frontend (3000)    │       │   Backend (3001)        │
│   Next.js 15         │       │   NestJS                │
│   React 19           │       │   PostgreSQL            │
│   TypeScript         │       │   Redis                 │
│                     │       │                       │
│ - Public Pages      │       │ - API Endpoints        │
│ - Authentication    │       │ - Business Logic      │
│ - Dashboard        │       │ - Auth Middleware     │
│ - Course Player    │       │ - Rate Limiting        │
└───────────────────┘       │ - Security Middleware  │
                                │ - WebSocket            │
                    ┌───────────┴────────────────┐
                    │                           │
                    ▼                           ▼
        ┌───────────────────┐       ┌───────────────────────┐
        │  PostgreSQL 15      │       │      Redis 7            │
        │                     │       │                       │
        │ - User Data         │       │ - Session Cache        │
        │ - Course Data       │       │ - Rate Limit Store     │
        │ - Enrollment Data   │       │ - Cache Layer          │
        │ - Order Data        │       │                       │
        │ - Indexes            │       │                       │
        │ - Backups           │       │                       │
        └───────────────────┘       └───────────────────────┘
                    │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌──────────────────────────────┐
                    │  External Services            │
                    │                             │
                    │ - Cloudflare R2 (Storage)  │
                    │ - Bunny Stream (Video)      │
                    │ - Razorpay (Payments)       │
                    │ - LiveKit (Live Classes)    │
                    │ - Resend (Email)            │
                    │ - Google OAuth             │
                    └──────────────────────────────┘
```

## Data Flow

```
User Request
    ↓
Cloudflare CDN (SSL Termination)
    ↓
AWS EC2 Nginx (Reverse Proxy)
    ↓
    Frontend Container (Next.js)
    ↓
Backend API (NestJS)
    ↓
PostgreSQL (Database)
    ↓
Redis (Cache)
    ↓
External Services (R2, Bunny, Razorpay, etc.)
```

## Security Layers

```
1. Cloudflare CDN (DDoS Protection, WAF)
2. Nginx (Rate Limiting, Security Headers)
3. Docker (Container Isolation)
4. NestJS (Auth Middleware, Rate Limiting)
5. PostgreSQL (Row-Level Security)
6. Application-Level (Input Sanitization, XSS Protection)
```

## Backup Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Backup Strategy                                                │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                    ┌────────────────┴────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌───────────────────┐       ┌───────────────────────┐
        │   Database Backups   │       │   Application Backups  │
        │                     │       │                       │
        │ - Daily automated  │       │ - Git History         │
        │ - Weekly full      │       │ - Docker Images       │
        │ - 30-day retention │       │ - Environment Vars     │
        │ - Compressed       │       │ - Configuration Files  │
        │ - Stored locally    │       │                       │
        └───────────────────┘       └───────────────────────┘
```

## Monitoring Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Monitoring & Logging                                           │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                    ┌────────────────┴────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌───────────────────┐       ┌───────────────────────┐
        │  Health Checks      │       │   Logging             │
        │                     │       │                       │
        │ - Container Health  │       │ - Application Logs     │
        │ - API Endpoints     │       │ - Nginx Access Logs   │
        │ - Database Status   │       │ - Docker Logs         │
        │ - Redis Status      │       │ - Error Logs         │
        │                     │       │ - 30-day Retention    │
        └───────────────────┘       └───────────────────────┘
                    │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌──────────────────────────────┐
                    │   System Monitoring          │
                    │                             │
                    │ - CPU Usage                 │
                    │ - Memory Usage              │
                    │ - Disk Space                │
                    │ - Network I/O                │
                    │ - Container Resource Usage  │
                    └──────────────────────────────┘
```

## Deployment Infrastructure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Deployment Infrastructure                                      │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                    ┌────────────────┴────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌───────────────────┐       ┌───────────────────────┐
        │   GitHub Actions     │       │   AWS EC2 Ubuntu       │
        │                     │       │                       │
        │ - CI Pipeline      │       │ - Docker              │
        │ - Deploy Pipeline   │       │ - Docker Compose       │
        │ - Release Pipeline  │       │ - Nginx               │
        │ - Security Scan     │       │ - Certbot (SSL)        │
        │ - Database Backup   │       │ - Systemd Services    │
        │                     │       │ - UFW Firewall         │
        │ - Secrets Mgmt     │       │ - Cron Jobs            │
        └───────────────────┘       └───────────────────────┘
                    │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌──────────────────────────────┐
                    │   CI/CD Automation        │
                    │                             │
                    │ ✅ Auto-deploy on push   │
                    │ ✅ Auto-rollback on fail│
                    │ ✅ Auto-backup database  │
                    │ ✅ Auto-renew SSL       │
                    │ ✅ Auto-restart services│
                    └──────────────────────────────┘
```
