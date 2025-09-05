const db = require('../utils/db');

const selectAllUsers = (sortBy = 'created_at', order = 'desc', limit = 10, page = 1) => {
    const offset = (page - 1) * limit
    const validSortColumns = ['first_name', 'last_name', 'seniority', 'city', 'state', 'created_at']
    const validOrderValues = ['asc', 'desc']
    
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at'
    const orderDirection = validOrderValues.includes(order.toLowerCase()) ? order.toUpperCase() : 'DESC'
    
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        ORDER BY ${sortColumn} ${orderDirection}
        LIMIT $1 OFFSET $2
    `, [limit, offset])
    .then((result) => {
        return result.rows
    })
}

const selectUserByName = (name) => {
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE first_name ILIKE $1 OR last_name ILIKE $1
    `, [`%${name}%`])
    .then((result) => {
        return result.rows
    })
}

const selectUsersBySeniority = (seniority) => {
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE seniority = $1
    `, [seniority])
    .then((result) => {
        return result.rows
    })
}

const selectUsersByCity = (city) => {
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE city ILIKE $1
    `, [`%${city}%`])
    .then((result) => {
        return result.rows
    })
}

const selectUsersByState = (state) => {
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE state ILIKE $1
    `, [`%${state}%`])
    .then((result) => {
        return result.rows
    })
}

const selectUsersByDiningInterests = (interests) => {
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE $1 = ANY(dining_interests)
    `, [interests])
    .then((result) => {
        return result.rows
    })
}

const checkUserExists = (userId) => {
    return db.query(`
        SELECT id FROM diners WHERE id = $1
    `, [userId])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'User not found' })
        }
    })
}

module.exports = {
    selectAllUsers,
    selectUserByName,
    selectUsersBySeniority,
    selectUsersByCity,
    selectUsersByState,
    selectUsersByDiningInterests,
    checkUserExists
}
