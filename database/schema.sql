-- Database schema for Get More Diners application

-- Restaurants table
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    state VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diners table
CREATE TABLE diners (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    seniority VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    address TEXT,
    dining_interests TEXT[], -- PostgreSQL array for multiple interests
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns table
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT,
    campaign_type VARCHAR(20) CHECK (campaign_type IN ('email', 'sms')),
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign recipients (many-to-many relationship)
CREATE TABLE campaign_recipients (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    diner_id INTEGER REFERENCES diners(id) ON DELETE CASCADE,
    sent_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    UNIQUE(campaign_id, diner_id)
);

-- Indexes for better performance
CREATE INDEX idx_diners_city ON diners(city);
CREATE INDEX idx_diners_state ON diners(state);
CREATE INDEX idx_diners_seniority ON diners(seniority);
CREATE INDEX idx_diners_interests ON diners USING GIN(dining_interests);
CREATE INDEX idx_campaigns_restaurant ON campaigns(restaurant_id);
CREATE INDEX idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
CREATE INDEX idx_campaign_recipients_diner ON campaign_recipients(diner_id);