# Get More Diners - Render Deployment Guide

## Overview
This guide will help you deploy your Get More Diners application to Render, including both the backend API and frontend.

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- PostgreSQL database (Render PostgreSQL or external)

## Step 1: Database Setup

### Option A: Render PostgreSQL (Recommended)
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Choose "Free" plan
4. Name: `get-more-diners-db`
5. Note the connection details

### Option B: External Database
- Supabase (free tier)
- Railway PostgreSQL
- AWS RDS
- Any PostgreSQL provider

## Step 2: Backend Deployment

1. **Create Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**
   - **Name**: `get-more-diners-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

3. **Environment Variables**
   Set these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://username:password@host:port/database
   JWT_SECRET=your-super-secure-jwt-secret-here
   EMAIL_SERVICE_API_KEY=your-email-api-key
   SMS_SERVICE_API_KEY=your-sms-api-key
   GOOGLE_AI_API_KEY=your-google-ai-key
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://get-more-diners-backend.onrender.com`)

## Step 3: Frontend Deployment

1. **Create Static Site**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**
   - **Name**: `get-more-diners-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://get-more-diners-backend.onrender.com/api
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note the site URL (e.g., `https://get-more-diners-frontend.onrender.com`)

## Step 4: Database Setup

1. **Run Database Schema**
   ```sql
   -- Copy contents from database/schema.sql
   -- Run in your PostgreSQL database
   ```

2. **Seed Initial Data** (Optional)
   ```bash
   # In Render backend service shell
   cd backend
   npm run seed:prod
   ```

## Step 5: Testing

1. **Test Backend API**
   ```bash
   curl https://get-more-diners-backend.onrender.com/api/health
   ```

2. **Test Frontend**
   - Visit your frontend URL
   - Try logging in with test credentials
   - Test campaign creation and management

## Step 6: Custom Domain (Optional)

1. **Add Custom Domain**
   - In Render dashboard, go to your service
   - Click "Settings" → "Custom Domains"
   - Add your domain
   - Update DNS records as instructed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Check build logs in Render dashboard

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database credentials
   - Ensure database is accessible from Render

3. **Frontend API Issues**
   - Verify REACT_APP_API_URL is correct
   - Check CORS settings in backend
   - Ensure backend is running

4. **Environment Variables**
   - Double-check all required variables are set
   - Ensure no typos in variable names
   - Restart services after changing variables

## Security Considerations

1. **JWT Secret**
   - Use a strong, random secret
   - Don't commit secrets to git
   - Rotate secrets periodically

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access

3. **API Security**
   - Enable CORS properly
   - Use HTTPS in production
   - Implement rate limiting

## Monitoring

1. **Render Dashboard**
   - Monitor service health
   - Check logs for errors
   - Monitor resource usage

2. **Database Monitoring**
   - Monitor connection count
   - Check query performance
   - Set up alerts

## Scaling

1. **Free Tier Limits**
   - Services sleep after 15 minutes of inactivity
   - Limited CPU and memory
   - Database has connection limits

2. **Upgrading**
   - Consider paid plans for production
   - Add more resources as needed
   - Implement caching strategies

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Project Issues: Create GitHub issues for bugs

---

## Quick Start Commands

```bash
# Test production build locally
npm run build:prod

# Check environment variables
echo $DATABASE_URL
echo $JWT_SECRET

# Test API endpoints
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```
