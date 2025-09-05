const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development'

require('dotenv').config({path: `${__dirname}/.env.${ENV}`})

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("No PGDATABASE configured")
} else { 
    console.log(`Connected to ${process.env.PGDATABASE || 'production database'}`)
}

const config = {};
if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
} else {
    // Development/test configuration
    config.user = process.env.DB_USER || 'postgres';
    config.host = process.env.DB_HOST || 'localhost';
    config.database = process.env.DB_NAME || 'get_more_diners';
    config.password = process.env.DB_PASSWORD || 'password';
    config.port = process.env.DB_PORT || 5432;
}

const db = new Pool(config);

const query = (text, params) => {
    return db.query(text, params);
};

module.exports = {
    query,
    pool: db
};
