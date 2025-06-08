# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application for production
RUN npm run build:prod

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add security headers and optimizations
RUN echo "add_header X-Frame-Options DENY;" >> /etc/nginx/conf.d/security.conf && \
    echo "add_header X-Content-Type-Options nosniff;" >> /etc/nginx/conf.d/security.conf && \
    echo "add_header X-XSS-Protection '1; mode=block';" >> /etc/nginx/conf.d/security.conf && \
    echo "add_header Referrer-Policy 'strict-origin-when-cross-origin';" >> /etc/nginx/conf.d/security.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]