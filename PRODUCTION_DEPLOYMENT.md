# Production Environment Setup Guide for DFS Manager Portal

## 🏭 Production Environment Variables

### Required Supabase Configuration
```bash
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Application Configuration
```bash
VITE_APP_NAME="DFS Manager Portal"
VITE_APP_VERSION="1.0.0"
VITE_APP_ENVIRONMENT="production"
VITE_APP_URL=https://your-domain.com
```

### Security Configuration
```bash
VITE_ENABLE_DEVELOPMENT_TOOLS=false
VITE_LOG_LEVEL="error"
VITE_ENABLE_ANALYTICS=true
```

## 🚀 Deployment Platforms

### 1. Netlify Deployment (Recommended)

#### Quick Deploy Button
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Dream-Frame-Service/dfsportal)

#### Manual Setup
1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Build Settings**:
   - Build command: `npm run build:prod`
   - Publish directory: `dist`
   - Node version: `18`

3. **Environment Variables** (in Netlify dashboard):
   ```
   VITE_SUPABASE_URL=your-production-url
   VITE_SUPABASE_ANON_KEY=your-production-key
   ```

#### Features:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Branch previews
- ✅ Form handling
- ✅ Split testing

### 2. Vercel Deployment

#### Quick Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/Dream-Frame-Service/dfsportal)

#### Manual Setup
1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**: `vercel --prod`
3. **Set Environment Variables** in Vercel dashboard

#### Features:
- ✅ Edge Functions
- ✅ Automatic scaling
- ✅ Analytics
- ✅ Performance monitoring

### 3. Docker Deployment

#### Production Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Deploy Commands
```bash
# Build image
docker build -t dfs-manager-portal .

# Run container
docker run -p 80:80 dfs-manager-portal

# Or use docker-compose
docker-compose up -d
```

## 🔒 Security Checklist

### Pre-Deployment Security
- [ ] Update all dependencies: `npm audit fix`
- [ ] Enable RLS (Row Level Security) in Supabase
- [ ] Configure CORS policies
- [ ] Set up proper authentication rules
- [ ] Enable SSL/HTTPS
- [ ] Configure CSP headers
- [ ] Set up rate limiting

### Environment Security
- [ ] Use separate Supabase projects for staging/production
- [ ] Rotate API keys regularly
- [ ] Enable 2FA for all accounts
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategies

## 📊 Monitoring & Analytics

### Performance Monitoring
```bash
# Add these environment variables for monitoring
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
```

### Health Checks
- Database connectivity
- API response times
- Error rates
- User authentication flows

## 🔄 CI/CD Pipeline

### Automated Testing
- Unit tests
- Integration tests
- E2E tests
- Performance tests
- Security scans

### Deployment Stages
1. **Development** → `main` branch → Netlify preview
2. **Staging** → `staging` branch → Staging environment
3. **Production** → `production` branch → Production environment

## 📝 Production Checklist

### Before Going Live
- [ ] Set up production Supabase project
- [ ] Configure production environment variables
- [ ] Set up domain and SSL certificate
- [ ] Configure CDN and caching
- [ ] Set up monitoring and logging
- [ ] Create backup strategies
- [ ] Test all critical user flows
- [ ] Performance testing
- [ ] Security assessment
- [ ] Documentation updates

### Post-Deployment
- [ ] Monitor application performance
- [ ] Set up alerting
- [ ] Monitor error rates
- [ ] User feedback collection
- [ ] Regular security updates
- [ ] Database maintenance
- [ ] Performance optimization

## 🆘 Troubleshooting

### Common Issues
1. **Build Failures**: Check environment variables
2. **404 Errors**: Verify routing configuration
3. **Database Connection**: Check Supabase credentials
4. **Performance Issues**: Enable caching and CDN

### Support Resources
- [Deployment Documentation](./DEPLOYMENT.md)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [GitHub Issues](https://github.com/Dream-Frame-Service/dfsportal/issues)
