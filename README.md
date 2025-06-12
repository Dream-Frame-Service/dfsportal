# DFS Manager Portal

A comprehensive management portal for Dream Frame Service operations.

## Features

- **Vendor Management**: Complete vendor database and relationship management
- **License Tracking**: Automated license monitoring and renewal alerts
- **Delivery Management**: Real-time delivery tracking and optimization
- **Inventory Control**: Advanced inventory management with alerts
- **HR Management**: Employee scheduling and performance tracking
- **Admin Dashboard**: Comprehensive analytics and system monitoring
- **S3 Storage**: Secure file storage and management
- **User Authentication**: Secure login with role-based access control

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel
- **State Management**: TanStack Query
- **Form Management**: React Hook Form + Zod validation

## Production Deployment

This application is deployed on Vercel with automatic deployments from the main branch.

### Environment Variables

Required environment variables are configured in Vercel's dashboard:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build:prod

# Type checking
npm run type-check

# Linting
npm run lint
```

## License

Copyright © 2024 Dream Frame Service. All rights reserved.
