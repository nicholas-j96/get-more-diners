# Database Seeding System

This project includes a comprehensive database seeding system that supports both development and production environments.

## Environment Setup

### Development Environment
- Uses local PostgreSQL database
- Seeds with test data from Google Sheet
- Environment file: `.env.development`

### Production Environment  
- Uses Supabase connection string
- No seeding (uses existing production data)
- Environment file: `.env.production`

## Database Structure

The seeding system creates the following tables:
- `restaurants` - Restaurant owners (users of the platform)
- `diners` - Potential customers (100 test records)
- `campaigns` - Marketing campaigns
- `campaign_recipients` - Links campaigns to diners

## Usage

### Install Dependencies
```bash
npm install
```

### Development Seeding
```bash
# Create development database
createdb get_more_diners_dev

# Seed with test data
npm run seed:dev
```

### Production Setup
```bash
# Update .env.production with your Supabase connection string
# No seeding needed - uses existing production data
npm start
```

## Test Data

The development environment includes:
- **10 diners** from Google Sheet with realistic data
- **3 sample restaurants** for testing
- **3 sample campaigns** for testing
- All necessary indexes for performance

## Environment Variables

### Development (.env.development)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=get_more_diners_dev
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=dev-super-secret-jwt-key-for-development-only
NODE_ENV=development
```

### Production (.env.production)
```
DATABASE_URL=your-supabase-connection-string-here
JWT_SECRET=your-super-secure-production-jwt-secret
NODE_ENV=production
```

## Scripts

- `npm run seed` - Seed database (uses current NODE_ENV)
- `npm run seed:dev` - Force development seeding
- `npm run seed:prod` - Force production seeding
- `npm run dev` - Start development server
- `npm start` - Start production server

## Data Sources

The test data is extracted from the Google Sheet:
https://docs.google.com/spreadsheets/d/1dG5eQWpmBP7xEy_ku0zZ94dklbFTy9tq6-eANQwyMVI/edit?gid=818208861#gid=818208861

This includes 100 diners with:
- Names, seniority levels, locations
- Dining interests (Fine Dining, Pubs, Coffee Shops, Take Out)
- Contact information
- Realistic addresses across the US
