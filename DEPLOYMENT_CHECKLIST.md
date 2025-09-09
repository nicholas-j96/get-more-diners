# Render Deployment Checklist

## Pre-Deployment ✅
- [x] Frontend builds successfully (`npm run build:frontend`)
- [x] Backend has health check endpoint (`/api/health`)
- [x] Environment variables configured
- [x] Database connection supports production URLs
- [x] CORS configured for production domains
- [x] Production build scripts created

## Database Setup
- [ ] Create PostgreSQL database (Render/Supabase/Railway)
- [ ] Run database schema (`database/schema.sql`)
- [ ] Set DATABASE_URL environment variable
- [ ] Test database connection

## Backend Deployment
- [ ] Create Render Web Service
- [ ] Set build command: `cd backend && npm install`
- [ ] Set start command: `cd backend && npm start`
- [ ] Configure environment variables:
  - [ ] NODE_ENV=production
  - [ ] PORT=10000
  - [ ] DATABASE_URL=postgresql://...
  - [ ] JWT_SECRET=secure-random-string
  - [ ] EMAIL_SERVICE_API_KEY (optional)
  - [ ] SMS_SERVICE_API_KEY (optional)
  - [ ] GOOGLE_AI_API_KEY (optional)
- [ ] Deploy and test health endpoint
- [ ] Note backend URL (e.g., https://get-more-diners-backend.onrender.com)

## Frontend Deployment
- [ ] Create Render Static Site
- [ ] Set build command: `cd frontend && npm install && npm run build`
- [ ] Set publish directory: `frontend/build`
- [ ] Configure environment variables:
  - [ ] REACT_APP_API_URL=https://your-backend.onrender.com/api
- [ ] Deploy and test frontend
- [ ] Note frontend URL (e.g., https://get-more-diners-frontend.onrender.com)

## Testing
- [ ] Test backend health endpoint
- [ ] Test frontend loads correctly
- [ ] Test user registration/login
- [ ] Test campaign creation
- [ ] Test diner search
- [ ] Test message sending (mock)

## Security
- [ ] Generate secure JWT secret
- [ ] Use HTTPS URLs
- [ ] Verify CORS settings
- [ ] Check environment variables are not exposed

## Monitoring
- [ ] Check Render service logs
- [ ] Monitor database connections
- [ ] Set up error alerts
- [ ] Test service restart behavior

## Post-Deployment
- [ ] Update documentation with live URLs
- [ ] Test all major features
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificates
- [ ] Set up monitoring/alerting

## Rollback Plan
- [ ] Keep previous deployment URLs
- [ ] Document rollback procedure
- [ ] Test rollback process
- [ ] Have backup database ready
