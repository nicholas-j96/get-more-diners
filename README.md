# Get More Diners

A comprehensive restaurant marketing platform that helps restaurants create, manage, and track marketing campaigns to reach potential diners based on their preferences, location, and demographics. Features AI-powered campaign generation, modern dark theme UI, and comprehensive campaign analytics.

## 🚀 Current Features

### **Core Functionality**
- **Restaurant Authentication**: Secure registration, login, and account management
- **Diner Management**: Comprehensive search and filtering by name, seniority, city, state, and dining interests
- **Campaign Management**: Create, update, delete, and send marketing campaigns
- **Campaign Analytics**: Track open rates, click rates, and message performance
- **Message History**: View detailed history of all sent campaigns with analytics
- **Account Settings**: Update profile information, change passwords, and account deletion

### **AI-Powered Features**
- **AI Campaign Assistant**: Natural language campaign generation using Google Gemini API
- **Smart Content Creation**: Auto-fill campaign fields based on natural language descriptions
- **Campaign Optimization**: AI-suggested improvements for better engagement

### **User Interface**
- **Modern Dark Theme**: Professional gunmetal grey and orange accent color scheme
- **Responsive Design**: Optimized for desktop and mobile devices
- **Interactive Components**: Hover effects, transitions, and smooth animations
- **Custom CSS**: Tailwind-free implementation with component-based styling

### **Dashboard & Analytics**
- **Campaign Statistics**: Real-time metrics for sent messages and active campaigns
- **Performance Tracking**: Open rates, click rates, and engagement metrics
- **Campaign History**: Detailed view of all past campaigns and their performance
- **Recipient Management**: Add/remove diners from campaign lists

## 🛠 Tech Stack

### **Backend**
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with optimized indexes
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: Google Gemini API for campaign generation
- **Development**: Nodemon for hot reloading

### **Frontend**
- **Framework**: React 18 with React Router
- **Styling**: Custom CSS with CSS Custom Properties
- **Icons**: Lucide React icon library
- **HTTP Client**: Axios for API communication
- **Development**: React Scripts with hot reloading

### **Database**
- **Primary DB**: PostgreSQL
- **Tables**: restaurants, diners, campaigns, campaign_recipients, message_history
- **Features**: Optimized queries, proper indexing, relationship management

## 📁 Project Structure

```
get-more-diners/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js      # Authentication & account management
│   │   ├── campaigns.controller.js # Campaign CRUD & analytics
│   │   ├── diners.controller.js    # Diner search & filtering
│   │   └── ai.controller.js        # AI campaign generation
│   ├── models/
│   │   ├── auth.model.js           # Restaurant data models
│   │   ├── campaigns.model.js      # Campaign & analytics models
│   │   └── diners.model.js         # Diner data models
│   ├── routes/
│   │   ├── auth.routes.js          # Authentication endpoints
│   │   ├── campaigns.routes.js     # Campaign management endpoints
│   │   ├── diners.routes.js        # Diner management endpoints
│   │   └── ai.routes.js            # AI generation endpoints
│   ├── middleware/
│   │   └── auth.middleware.js      # JWT authentication middleware
│   ├── errors/                     # Custom error handling
│   ├── utils/
│   │   └── db.js                   # Database connection utilities
│   ├── app.js                      # Express app configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js           # Navigation header
│   │   │   └── AIAssistModal.js    # AI campaign assistant modal
│   │   ├── pages/
│   │   │   ├── LandingPage.js      # Marketing landing page
│   │   │   ├── Login.js            # Restaurant login
│   │   │   ├── Signup.js           # Restaurant registration
│   │   │   ├── Dashboard.js        # Main dashboard
│   │   │   ├── Users.js            # Diner management
│   │   │   ├── Campaigns.js        # Campaign management
│   │   │   └── AccountSettings.js  # Account management
│   │   ├── utils/
│   │   │   └── api.js              # API client configuration
│   │   └── *.css                   # Component-specific stylesheets
│   └── package.json
├── database/
│   └── schema.sql                  # Database schema definition
├── start.sh                        # Convenience startup script
├── AI_SETUP.md                     # AI API setup instructions
└── README.md
```

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register a new restaurant
- `POST /api/auth/login` - Login restaurant
- `GET /api/auth/profile` - Get restaurant profile
- `PATCH /api/auth/profile` - Update restaurant profile
- `DELETE /api/auth/account` - Delete restaurant account

### **Diner Management**
- `GET /api/diners` - Get all diners with pagination, sorting, and filtering
- `GET /api/diners/search` - Advanced diner search with multiple filters
- `GET /api/diners/seniority-options` - Get available seniority levels
- `POST /api/diners` - Add new diner to database

### **Campaign Management**
- `GET /api/campaigns` - Get all campaigns for authenticated restaurant
- `POST /api/campaigns` - Create a new campaign
- `PATCH /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `GET /api/campaigns/:id/recipients` - Get campaign recipients
- `POST /api/campaigns/:id/recipients` - Add diners to campaign
- `POST /api/campaigns/:id/send` - Send campaign to recipients
- `GET /api/campaigns/:id/message-history` - Get campaign message history
- `GET /api/campaigns/message/:id` - Get detailed message analytics

### **AI Features**
- `POST /api/ai/campaign/generate` - Generate campaign content using AI

### **Dashboard Analytics**
- `GET /api/campaigns/dashboard/stats` - Get dashboard statistics

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/nicholas-j96/get-more-diners.git
cd get-more-diners
```

### **2. Database Setup**

#### **Option A: Local PostgreSQL (Development)**
```bash
# Install PostgreSQL locally
# Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib
# macOS: brew install postgresql
# Windows: Download from postgresql.org

# Create local database
createdb get_more_diners_dev

# Run database schema
psql get_more_diners_dev < database/schema.sql

# Optional: Seed with sample data
cd backend && node run-seed.js
```

#### **Option B: Supabase (Production/Cloud)**
```bash
# 1. Create Supabase project
# Visit https://supabase.com and create a new project

# 2. Get connection details
# Go to Settings > Database > Connection string
# Copy the connection string (it looks like):
# postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# 3. Run schema on Supabase
# Use Supabase SQL Editor or psql:
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" < database/schema.sql

# 4. Configure environment variables (see Backend Setup below)
```

#### **Option C: Other Cloud Providers**
- **Railway**: `railway add postgresql` then connect via provided URL
- **Neon**: Create database at neon.tech and use connection string
- **PlanetScale**: Use MySQL-compatible connection (requires schema migration)
- **AWS RDS**: Create PostgreSQL instance and use connection details

#### **Database Configuration**
The application uses these environment variables for database connection:
```bash
DB_HOST=localhost          # Database host (or cloud provider URL)
DB_PORT=5432              # Database port (usually 5432 for PostgreSQL)
DB_NAME=get_more_diners_dev # Database name
DB_USER=postgres          # Database username
DB_PASSWORD=your_password # Database password
DB_SSL=false              # SSL connection (set to true for cloud databases)
```

### **3. Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration:

# Server Configuration
PORT=3000
JWT_SECRET=your_jwt_secret_here

# Database Configuration (choose one):

# For Local PostgreSQL:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=get_more_diners_dev
DB_USER=postgres
DB_PASSWORD=your_local_password
DB_SSL=false

# For Supabase:
DB_HOST=db.[project-ref].supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_SSL=true

# For Railway/Neon (use full connection string):
DATABASE_URL=postgresql://user:password@host:port/database

# Optional: AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Start development server
npm run dev
```

### **4. Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
echo "PORT=3001" > .env
echo "REACT_APP_API_URL=http://localhost:3000/api" >> .env

# Start development server
npm start
```

### **5. Quick Start Script**
```bash
# Make startup script executable
chmod +x start.sh

# Start both backend and frontend
./start.sh
```

### **6. Access Application**
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **Default Login**: Use the registration form to create a new restaurant account

## 🤖 AI Setup (Optional)

To enable AI-powered campaign generation:

1. **Get Google Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Configure Backend**:
   ```bash
   cd backend
   echo "GEMINI_API_KEY=your_api_key_here" >> .env
   ```

3. **Restart Backend**:
   ```bash
   npm run dev
   ```

See `AI_SETUP.md` for detailed instructions.

## 🎨 Design System

### **Color Palette**
- **Primary**: Orange (#f97316) - Call-to-action buttons, highlights
- **Secondary**: Gunmetal Grey (#2d3748) - Backgrounds, cards
- **Success**: Green (#10b981) - Success states, positive actions
- **Text**: Light grey (#f7fafc) - Primary text on dark backgrounds
- **Accent**: Dark gunmetal (#1a202c) - Borders, secondary elements

### **Typography**
- **Font Family**: System fonts (Inter, -apple-system, BlinkMacSystemFont)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Responsive Sizing**: Fluid typography with CSS custom properties

### **Components**
- **Buttons**: Rounded corners, hover effects, consistent padding
- **Cards**: Subtle shadows, rounded corners, proper spacing
- **Modals**: Dark overlays, centered content, smooth animations
- **Forms**: Clean inputs, validation states, accessible labels

## 📊 Database Schema

### **Core Tables**
- **restaurants**: Restaurant accounts and authentication
- **diners**: Customer information and preferences
- **campaigns**: Marketing campaign data
- **campaign_recipients**: Campaign-to-diner relationships
- **message_history**: Sent message tracking and analytics

### **Key Features**
- **Optimized Indexes**: Fast queries on common search patterns
- **Relationship Integrity**: Foreign key constraints
- **Data Validation**: Proper data types and constraints
- **Analytics Support**: Structured data for performance tracking

### **Production Database Considerations**

#### **Supabase Setup (Recommended)**
```bash
# 1. Create Supabase project
# Visit https://supabase.com/dashboard

# 2. Configure Row Level Security (RLS)
# Enable RLS on all tables for multi-tenant security:
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_history ENABLE ROW LEVEL SECURITY;

# 3. Create RLS policies (example for restaurants table)
CREATE POLICY "Restaurants can only see their own data" ON restaurants
  FOR ALL USING (auth.uid()::text = id::text);

# 4. Set up database backups
# Supabase provides automatic backups, but consider additional backup strategies

# 5. Configure connection pooling
# Use Supabase's built-in connection pooling for production workloads
```

#### **Database Migration Strategy**
```bash
# For production deployments, use migration scripts:

# 1. Create migration file
mkdir -p backend/migrations
touch backend/migrations/001_initial_schema.sql

# 2. Copy schema.sql to migration file
cp database/schema.sql backend/migrations/001_initial_schema.sql

# 3. Run migrations in production
psql $DATABASE_URL < backend/migrations/001_initial_schema.sql
```

#### **Environment-Specific Configuration**
```bash
# Development (.env.development)
DB_HOST=localhost
DB_SSL=false
NODE_ENV=development

# Production (.env.production)
DB_HOST=db.[project-ref].supabase.co
DB_SSL=true
NODE_ENV=production
DB_POOL_SIZE=20
DB_IDLE_TIMEOUT=30000
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Sensitive data protection

## 🚧 Future Roadmap

### **Phase 1: Enhanced Analytics**
- **Individual Diner History**: Track complete interaction history per diner
- **Geographic Data Visualization**: Maps showing diner distribution and campaign reach
- **Advanced Reporting**: Detailed analytics dashboard with charts and insights

### **Phase 2: AI Improvements**
- **Enhanced AI Message Generation**: More sophisticated content creation
- **A/B Testing**: AI-powered campaign variant testing
- **Personalization Engine**: Dynamic content based on diner preferences
- **Sentiment Analysis**: Analyze diner responses and feedback

### **Phase 3: Business Features**
- **Payment Integrations**: Stripe/PayPal integration for premium features
- **Account Verification**: Email/SMS verification for restaurant accounts
- **Multi-location Support**: Manage multiple restaurant locations
- **Team Management**: Multi-user access with role-based permissions

### **Phase 4: Security & Compliance**
- **Security Audit**: Comprehensive security review of all components
- **PostgreSQL Security Hardening**: Database security best practices
- **GDPR Compliance**: Data protection and privacy controls
- **Penetration Testing**: Third-party security assessment

### **Phase 5: Advanced Features**
- **Email/SMS Service Integration**: Real message delivery
- **Campaign Automation**: Scheduled and triggered campaigns
- **Customer Segmentation**: Advanced diner categorization
- **API Rate Limiting**: Production-ready API protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@getmorediners.com or create an issue in the GitHub repository.

---

**Built with ❤️ for restaurants who want to get more diners through smart marketing.**