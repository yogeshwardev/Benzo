# CI/CD Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                                │
│                         (skillforge-academy)                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────────┐
                    │    Push to main branch     │
                    └──────────────────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────────┐
                    │   GitHub Actions Trigger     │
                    └──────────────────────────────┘
                                 │
                    ┌────────────────────────┴────────────────────────┐
                    │                                           │
                    ▼                                           ▼
        ┌───────────────────┐                    ┌───────────────────┐
        │   CI Pipeline     │                    │ Security Scan     │
        │                   │                    │                   │
        │ ✓ Checkout       │                    │ ✅ Dependency    │
        │ ✓ Cache npm      │                    │   Audit           │
        │ ✓ Lint           │                    │ ✅ CodeQL Scan    │
        │ ✓ Type Check     │                    │ ✅ Container Scan  │
        │ ✓ Unit Tests     │                    │                   │
        │ ✓ Build          │                    │                   │
        │ ✓ Security Scan  │                    │                   │
        └───────────┬───────┘                    └───────────┬───────┘
                    │                                           │
                    └───────────────────┬───────────────────────┘
                                        │
                                        ▼
                    ┌──────────────────────────────┐
                    │   Build Stage (Success)     │
                    │                             │
                    │ ✅ Upload Artifacts         │
                    │   - backend-dist           │
                    │   - frontend-dist           │
                    └───────────────────┬──────────┘
                                        │
                                        ▼
                    ┌──────────────────────────────┐
                    │   Deploy Pipeline           │
                    │                             │
                    │ ✅ Download Artifacts        │
                    │ ✅ Configure SSH            │
                    │ ✅ Deploy to EC2           │
                    │   - Copy files             │
                    │   - Build containers       │
                    │   - Restart services      │
                    │ ✅ Run Migrations          │
                    │ ✅ Health Check           │
                    └───────────┬──────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
        ┌───────────────────┐   ┌───────────────────┐
        │ Health Check Pass  │   │ Health Check Fail │
        │                   │   │                   │
        ▼                   │   ▼                   ▼
┌───────────────────┐   │   ┌───────────────────┐
│ Deployment Success │   │   │ Automatic Rollback│
│                   │   │   │                   │
│ ✅ Update Tag      │   │   │ ⏪️  Previous commit │
│ ✅ Send Notif      │   │   │ 🔄 Re-deploy       │
│ ✅ Cleanup        │   │   │ ✅ Health Check     │
└───────────────────┘   │   └───────────────────┘
                         │
                         ▼
                ┌──────────────────────┐
                │   Production Ready    │
                └──────────────────────┘
```

## Release Process (Tag-based)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   Git Tag (v1.0.0)                                        │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────────┐
                    │   Release Pipeline         │
                    │                             │
                    │ ✅ Create GitHub Release    │
                    │ ✅ Generate Changelog     │
                    │ ✅ Build Docker Images    │
                    │ ✅ Push to Docker Hub     │
                    └──────────────────────────────┘
```

## Database Management Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              Manual Trigger via GitHub Actions                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────────┐
                    │   Database Management       │
                    │                             │
                    │ 1. Backup                  │
                    │    ├── pg_dump            │
                    │    ├── Compress           │
                    │    └── Store               │
                    │                             │
                    │ 2. Restore                 │
                    │    ├── Select backup       │
                    │    ├── psql restore        │
                    │    └── Verify             │
                    │                             │
                    │ 3. Migrate                 │
                    │    ├── Backup database   │
                    │    ├── Prisma deploy      │
                    │    └── Verify             │
                    │                             │
                    │ 4. Rollback                │
                    │    ├── Prisma resolve     │
                    │    └── Restore backup     │
                    └──────────────────────────────┘
```
