# Production Deployment Checklist - DFS Manager Portal

## Pre-Deployment Verification

### 1. Authentication System ✅
- [x] Supabase connection verified
- [x] Password reset functionality tested
- [x] Admin user exists (requires password reset)
- [x] Login flow integration complete

### 2. Build System ✅
- [x] `npm run build:vercel` successful (2.39MB bundle)
- [x] Dependencies installed (`dotenv` added)
- [x] Development server tested on multiple ports

### 3. Vercel Configuration ✅
- [x] OpenAPI schema validation added
- [x] Clean URLs enabled
- [x] Security headers configured
- [x] SPA routing maintained
- [x] Serverless functions configured
- [x] Cron jobs scheduled

## Required Environment Variables for Vercel

Set these in your Vercel dashboard under Project Settings > Environment Variables:

### Supabase Configuration
```
VITE_SUPABASE_URL=https://rrfnbhwwydthugkqszmf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZm5iaHd3eWR0aHVna3Fzem1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MTk4NzgsImV4cCI6MjA1MTI5NTg3OH0.9qIR6g2UMJJZUebWQ33iNuR09yy6LWQ1xxNz7ACfb3g
```

### Cron Job Security
```
CRON_SECRET=your-secure-random-string-here
```

**Generate CRON_SECRET using:** `openssl rand -hex 32`

## Automated Cron Jobs Configured

### 1. License Expiry Check
- **Schedule**: Daily at 9:00 AM UTC (`0 9 * * *`)
- **Endpoint**: `/api/check-license-expiry`
- **Function**: Monitors license expiration dates, sends alerts 30 days before expiry

### 2. System Health Check
- **Schedule**: Every 30 minutes (`*/30 * * * *`)
- **Endpoint**: `/api/health-check`
- **Function**: Monitors database connectivity, API response times, memory usage

### 3. Daily Sales Report
- **Schedule**: Daily at 8:00 AM UTC (`0 8 * * *`)
- **Endpoint**: `/api/daily-report`
- **Function**: Generates daily sales summary, sends automated reports

### 4. Weekly Database Cleanup
- **Schedule**: Sundays at 2:00 AM UTC (`0 2 * * 0`)
- **Endpoint**: `/api/weekly-cleanup`
- **Function**: Cleans expired sessions, optimizes database performance

## Manual Testing Steps

### 1. Complete Login Flow Testing
1. Open the application in browser
2. Navigate to login page
3. Test with existing credentials or use password reset
4. Verify redirect to dashboard after successful login
5. Confirm session persistence across browser tabs

### 2. Password Reset Testing
1. Click "Forgot Password" on login page
2. Enter admin email address
3. Check email for reset link
4. Complete password reset process
5. Login with new password

## Deployment Commands

### Development Testing
```bash
npm run dev
# Server runs on http://localhost:8082 (or next available port)
```

### Production Build
```bash
npm run build:vercel
# Creates optimized production build
```

### Deploy to Vercel
```bash
vercel --prod
# OR use GitHub integration for automatic deployments
```

## Post-Deployment Verification

### 1. Application Access
- [ ] Login page loads correctly
- [ ] Authentication works as expected
- [ ] Dashboard accessible after login
- [ ] Session management functional

### 2. Cron Jobs
- [ ] Monitor Vercel Functions dashboard for cron execution
- [ ] Check function logs for any errors
- [ ] Verify automated tasks are running on schedule

### 3. Performance
- [ ] Page load times acceptable
- [ ] API responses under 2 seconds
- [ ] No console errors in browser

## Troubleshooting

### Common Issues
1. **Cron jobs not executing**: Verify `CRON_SECRET` environment variable is set
2. **Supabase connection errors**: Check environment variables are correctly set
3. **Build failures**: Ensure all dependencies are installed and TypeScript compiles

### Support Resources
- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Supabase Authentication Guide](https://supabase.com/docs/guides/auth)
- [React Router Setup](https://reactrouter.com/en/main)

## Security Notes
- All API endpoints include CORS protection
- Cron jobs require secret authentication
- Supabase handles user authentication securely
- Environment variables are encrypted in Vercel

**Status**: Ready for production deployment ✅
