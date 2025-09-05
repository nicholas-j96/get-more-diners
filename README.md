# Get More Diners

A restaurant marketing platform that helps restaurants create and manage campaigns to reach potential diners based on their preferences, location, and demographics.

## Features

- **Diner Management**: Search and filter diners by name, seniority, city, state, and dining interests
- **Campaign Management**: Create, update, and delete marketing campaigns
- **Campaign Lists**: Add diners to campaign lists for targeted marketing
- **Communication Tracking**: Track what communications each diner has received
- **Authentication**: Secure restaurant registration and login system

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React, Tailwind CSS
- **Authentication**: JWT tokens
- **Database**: PostgreSQL with optimized indexes

## Project Structure

```
get-more-diners/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── diners.controller.js
│   │   └── campaigns.controller.js
│   ├── models/
│   │   ├── auth.model.js
│   │   ├── diners.model.js
│   │   └── campaigns.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── diners.routes.js
│   │   └── campaigns.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── errors/
│   │   ├── auth.errors.js
│   │   ├── diners.errors.js
│   │   └── campaigns.errors.js
│   ├── utils/
│   │   └── db.js
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new restaurant
- `POST /api/auth/login` - Login restaurant
- `POST /api/auth/logout` - Logout restaurant
- `GET /api/auth/profile` - Get restaurant profile
- `PATCH /api/auth/profile` - Update restaurant profile

### Diners
- `GET /api/diners` - Get all diners with pagination, sorting, and filtering
- `GET /api/diners/search` - Search diners with advanced filters
- `GET /api/diners/:id` - Get diner by ID
- `GET /api/diners/city/:city` - Get diners by city
- `GET /api/diners/state/:state` - Get diners by state
- `GET /api/diners/seniority/:seniority` - Get diners by seniority
- `GET /api/diners/interests/:interest` - Get diners by dining interests

### Campaigns
- `GET /api/campaigns` - Get all campaigns for authenticated restaurant
- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns/:campaign_id` - Get campaign by ID
- `PATCH /api/campaigns/:campaign_id` - Update campaign
- `DELETE /api/campaigns/:campaign_id` - Delete campaign
- `GET /api/campaigns/:campaign_id/recipients` - Get campaign recipients
- `POST /api/campaigns/:campaign_id/diners/:diner_id` - Add diner to campaign
- `DELETE /api/campaigns/:campaign_id/diners/:diner_id` - Remove diner from campaign
- `GET /api/campaigns/diner/:diner_id` - Get campaigns for a specific diner

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. Set up PostgreSQL database:
   ```bash
   # Create database
   createdb get_more_diners
   
   # Run schema
   psql get_more_diners < ../database/schema.sql
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Database Schema

The application uses three main tables:

- **restaurants**: Stores restaurant information and authentication data
- **diners**: Stores diner information including preferences and contact details
- **campaigns**: Stores marketing campaign information
- **campaign_recipients**: Junction table linking campaigns to diners

## Key Features Implementation

### Diner Search and Filtering
The API supports comprehensive filtering of diners by:
- Name (partial matching)
- Seniority level
- City and state
- Dining interests (using PostgreSQL arrays)
- Advanced search with multiple filters

### Campaign Management
- Create campaigns with email or SMS types
- Add/remove diners from campaign lists
- Track campaign recipients and their status
- View communication history per diner

### Authentication
- JWT-based authentication for restaurants
- Password hashing with bcrypt
- Protected routes for campaign management

## Future Enhancements

- Email/SMS service integration
- AI-powered message generation
- Campaign analytics and reporting
- Bulk import of diner data
- Advanced filtering and search capabilities
