const db = require("./connection");
const format = require("pg-format");

const seed = ({ dinersData, restaurantsData, campaignsData }) => {
    return db.query(`DROP TABLE IF EXISTS campaign_recipients;`)
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS campaigns;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS diners;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS restaurants;`)
    })
    .then(() => {
        return db.query(`
            CREATE TABLE restaurants (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                city VARCHAR(255),
                state VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)
    })
    .then(() => {
        return db.query(`
            CREATE TABLE diners (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                seniority VARCHAR(255),
                city VARCHAR(255) NOT NULL,
                state VARCHAR(255) NOT NULL,
                address TEXT,
                dining_interests TEXT[],
                phone VARCHAR(20),
                email VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)
    })
    .then(() => {
        return db.query(`
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
        `)
    })
    .then(() => {
        return db.query(`
            CREATE TABLE campaign_recipients (
                id SERIAL PRIMARY KEY,
                campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
                diner_id INTEGER REFERENCES diners(id) ON DELETE CASCADE,
                sent_at TIMESTAMP,
                status VARCHAR(20) DEFAULT 'pending',
                UNIQUE(campaign_id, diner_id)
            );
        `)
    })
    .then(() => {
        // Create message_history table
        return db.query(`
            CREATE TABLE message_history (
                id SERIAL PRIMARY KEY,
                campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                recipient_count INTEGER NOT NULL,
                open_rate DECIMAL(5,2) DEFAULT 0.0,
                click_rate DECIMAL(5,2) DEFAULT 0.0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)
    })
    .then(() => {
        // Create indexes for better performance
        return db.query(`
            CREATE INDEX idx_diners_city ON diners(city);
            CREATE INDEX idx_diners_state ON diners(state);
            CREATE INDEX idx_diners_seniority ON diners(seniority);
            CREATE INDEX idx_diners_interests ON diners USING GIN(dining_interests);
            CREATE INDEX idx_campaigns_restaurant ON campaigns(restaurant_id);
            CREATE INDEX idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
            CREATE INDEX idx_campaign_recipients_diner ON campaign_recipients(diner_id);
            CREATE INDEX idx_message_history_campaign ON message_history(campaign_id);
            CREATE INDEX idx_message_history_sent_at ON message_history(sent_at);
        `)
    })
    .then(() => {
        // Insert restaurants
        const formattedRestaurantData = restaurantsData.map((restaurant) => {
            return [
                restaurant.name,
                restaurant.email,
                restaurant.password_hash,
                restaurant.city,
                restaurant.state
            ]
        })
        const insertRestaurantQuery = format(
            `INSERT INTO restaurants(name, email, password_hash, city, state) VALUES %L`,
            formattedRestaurantData
        );
        return db.query(insertRestaurantQuery)
    })
    .then(() => {
        // Insert diners one by one to avoid format issues
        console.log("Inserting diners data...");
        const insertPromises = dinersData.map((diner) => {
            return db.query(
                `INSERT INTO diners(first_name, last_name, seniority, city, state, address, dining_interests, phone, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    diner.first_name,
                    diner.last_name,
                    diner.seniority,
                    diner.city,
                    diner.state,
                    diner.address,
                    diner.dining_interests,
                    diner.phone,
                    diner.email
                ]
            );
        });
        return Promise.all(insertPromises);
    })
    .then(() => {
        // Insert campaigns
        const formattedCampaignData = campaignsData.map((campaign) => {
            return [
                campaign.restaurant_id,
                campaign.name,
                campaign.subject,
                campaign.message,
                campaign.campaign_type
            ]
        })
        const insertCampaignQuery = format(
            `INSERT INTO campaigns(restaurant_id, name, subject, message, campaign_type) VALUES %L`,
            formattedCampaignData
        );
        return db.query(insertCampaignQuery)
    })
    .then(() => {
        console.log("Seeding complete! ✅");
        console.log(`- ${restaurantsData.length} restaurants created`);
        console.log(`- ${dinersData.length} diners created`);
        console.log(`- ${campaignsData.length} campaigns created`);
    })
    .catch((error) => {
        console.error("Seeding failed:", error);
        throw error;
    });
};

module.exports = seed;
