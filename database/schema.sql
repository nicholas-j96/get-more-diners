-- Database schema for Get More Diners application

-- Restaurants table
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    state VARCHAR(255),
    messages_sent_this_month INTEGER DEFAULT 0,
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
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'sent', 'cancelled')),
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
    messages_sent INTEGER DEFAULT 0,
    UNIQUE(campaign_id, diner_id)
);

-- Message history table
CREATE TABLE message_history (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recipient_count INTEGER NOT NULL,
    open_rate DECIMAL(5,2) DEFAULT 0.0,
    click_rate DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_diners_city ON diners(city);
CREATE INDEX idx_diners_state ON diners(state);
CREATE INDEX idx_diners_seniority ON diners(seniority);
CREATE INDEX idx_diners_interests ON diners USING GIN(dining_interests);
CREATE INDEX idx_campaigns_restaurant ON campaigns(restaurant_id);
CREATE INDEX idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
CREATE INDEX idx_campaign_recipients_diner ON campaign_recipients(diner_id);
CREATE INDEX idx_message_history_campaign ON message_history(campaign_id);
CREATE INDEX idx_message_history_sent_at ON message_history(sent_at);