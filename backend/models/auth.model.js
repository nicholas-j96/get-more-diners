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
        SELECT id, name, email, password_hash, city, state, created_at
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

const updateRestaurantById = (restaurantId, name, city, state, email = null, passwordHash = null) => {
    let query = 'UPDATE restaurants SET name = $1, city = $2, state = $3'
    let params = [name, city, state]
    let paramIndex = 4

    if (email) {
        query += `, email = $${paramIndex}`
        params.push(email)
        paramIndex++
    }

    if (passwordHash) {
        query += `, password_hash = $${paramIndex}`
        params.push(passwordHash)
        paramIndex++
    }

    // Add the WHERE clause with the restaurant ID
    query += ` WHERE id = $${paramIndex} RETURNING id, name, email, city, state, created_at`
    params.push(restaurantId)

    return db.query(query, params)
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

const deleteRestaurantById = (restaurantId) => {
    return db.query(`
        DELETE FROM restaurants WHERE id = $1
    `, [restaurantId])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, message: 'Restaurant not found' })
        }
        return { message: 'Restaurant deleted successfully' }
    })
}

module.exports = {
    selectRestaurantByEmail,
    insertRestaurant,
    selectRestaurantById,
    updateRestaurantById,
    checkEmailExists,
    deleteRestaurantById
}
