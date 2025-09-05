# Get More Diners

A restaurant marketing platform that helps restaurants create and manage campaigns to reach potential diners based on their preferences, location, and demographics.

## Features

- **User Management**: Search and filter diners by name, seniority, city, state, and dining interests
- **Campaign Management**: Create, update, and delete marketing campaigns
- **Campaign Lists**: Add users to campaign lists for targeted marketing
- **Communication Tracking**: Track what communications each user has received
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
│   │   ├── users.controller.js
│   │   └── campaigns.controller.js
│   ├── models/
│   │   ├── auth.model.js
│   │   ├── users.model.js
│   │   └── campaigns.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   └── campaigns.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── errors/
│   │   ├── auth.errors.js
│   │   ├── users.errors.js
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

### Users (Diners)
- `GET /api/users` - Get all users with pagination and sorting
- `GET /api/users/name/:name` - Get users by name
- `GET /api/users/seniority/:seniority` - Get users by seniority
- `GET /api/users/city/:city` - Get users by city
- `GET /api/users/state/:state` - Get users by state
- `GET /api/users/interests/:interests` - Get users by dining interests

### Campaigns
- `GET /api/campaigns` - Get all campaigns for authenticated restaurant
- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns/:campaign_id` - Get campaign by ID
- `PATCH /api/campaigns/:campaign_id` - Update campaign
- `DELETE /api/campaigns/:campaign_id` - Delete campaign
- `GET /api/campaigns/:campaign_id/recipients` - Get campaign recipients
- `POST /api/campaigns/:campaign_id/users/:user_id` - Add user to campaign
- `DELETE /api/campaigns/:campaign_id/users/:user_id` - Remove user from campaign
- `GET /api/campaigns/user/:user_id` - Get campaigns for a specific user

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

### User Search and Filtering
The API supports comprehensive filtering of diners by:
- Name (partial matching)
- Seniority level
- City and state
- Dining interests (using PostgreSQL arrays)

### Campaign Management
- Create campaigns with email or SMS types
- Add/remove users from campaign lists
- Track campaign recipients and their status
- View communication history per user

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
