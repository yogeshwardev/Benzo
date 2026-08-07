# SkillForge Academy

A modern, production-ready Learning Management System (LMS) built with Next.js 15, NestJS, and PostgreSQL.

## 🚀 Features

- **Authentication**: JWT-based auth with Google OAuth integration
- **Role-Based Access**: Student, Instructor, and Admin roles
- **Course Management**: Create, manage, and publish courses with modules and lessons
- **Video Streaming**: Secure video hosting with Bunny Stream integration
- **Live Classes**: Real-time interactive classes using LiveKit
- **Assignments & Quizzes**: Comprehensive assessment system
- **Payment Integration**: Razorpay for secure payments
- **Coupon System**: Create and manage discount coupons
- **Referral Program**: Earn credits through referrals
- **Wallet System**: Manage and use wallet credits
- **Certificates**: Auto-generated verified certificates
- **Notifications**: Email and in-app notifications
- **Analytics**: Comprehensive dashboards for all roles
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Query
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache**: Redis
- **Authentication**: JWT + Passport
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Video Streaming**: Bunny Stream
- **Live Classes**: LiveKit
- **Email**: Resend
- **Payments**: Razorpay

### DevOps
- **Containerization**: Docker
- **Reverse Proxy**: Nginx
- **Process Management**: PM2

## 📁 Project Structure

```
skillforge-academy/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   └── prisma/        # Prisma client
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── Dockerfile
├── frontend/               # Next.js App
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   └── hooks/         # Custom hooks
│   └── Dockerfile
├── shared/                 # Shared types
│   └── src/
│       └── index.ts       # TypeScript types
├── docker/                 # Docker configurations
│   ├── docker-compose.yml
│   └── nginx.conf
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/skillforge-academy.git
cd skillforge-academy
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install shared dependencies
cd ../shared
npm install
```

3. **Environment Setup**

Create `.env` files in both backend and frontend directories:

**Backend `.env`**:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillforge?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=skillforge-uploads
BUNNY_API_KEY=your-bunny-api-key
RESEND_API_KEY=your-resend-api-key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Database Setup**

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

5. **Run the application**

```bash
# Run both frontend and backend
npm run dev

# Or run separately
cd backend && npm run start:dev
cd frontend && npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 API Documentation

API documentation is available via Swagger UI at `/api/docs` when running the backend.

## 🔐 Security Features

- Argon2 password hashing
- JWT authentication with refresh tokens
- Rate limiting
- CSRF protection
- XSS protection
- SQL injection prevention
- Secure file upload validation
- Role-based access control

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📧 Support

For support, email support@skillforge.com or join our Discord community.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [NestJS](https://nestjs.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
