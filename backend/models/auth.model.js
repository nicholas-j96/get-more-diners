const db = require('../utils/db');

const selectRestaurantByEmail = (email) => {
    return db.query(`
        SELECT id, name, email, password_hash, city, state, created_at
        FROM restaurants 
        WHERE email = $1
    `, [email])
    .then((result) => {
        return result.rows[0]
    })
}

const insertRestaurant = (name, email, passwordHash, city, state) => {
    return db.query(`
        INSERT INTO restaurants (name, email, password_hash, city, state)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, city, state, created_at
    `, [name, email, passwordHash, city, state])
    .then((result) => {
        return result.rows[0]
    })
}

const selectRestaurantById = (restaurantId) => {
    return db.query(`
        SELECT id, name, email, city, state, created_at
        FROM restaurants 
        WHERE id = $1
    `, [restaurantId])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Restaurant not found' })
        }
        return result.rows[0]
    })
}

const updateRestaurantById = (restaurantId, name, city, state) => {
    return db.query(`
        UPDATE restaurants 
        SET name = $1, city = $2, state = $3
        WHERE id = $4
        RETURNING id, name, email, city, state, created_at
    `, [name, city, state, restaurantId])
    .then((result) => {
        return result.rows[0]
    })
}

const checkEmailExists = (email) => {
    return db.query(`
        SELECT email FROM restaurants WHERE email = $1
    `, [email])
    .then((result) => {
        if (result.rows.length > 0) {
            return Promise.reject({ status: 400, message: 'Email already exists' })
        }
    })
}

module.exports = {
    selectRestaurantByEmail,
    insertRestaurant,
    selectRestaurantById,
    updateRestaurantById,
    checkEmailExists
}
