const db = require('../utils/db');

const selectAllDiners = (sortBy = 'created_at', order = 'desc', limit = 10, page = 1, city = null, state = null, interests = null, seniority = null) => {
    const offset = (page - 1) * limit
    const validSortColumns = ['first_name', 'last_name', 'seniority', 'city', 'state', 'created_at']
    const validOrderValues = ['asc', 'desc']
    
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at'
    const orderDirection = validOrderValues.includes(order.toLowerCase()) ? order.toUpperCase() : 'DESC'
    
    let query = `
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE 1=1
    `
    const params = []
    let paramCount = 0
    
    if (city) {
        paramCount++
        query += ` AND city ILIKE $${paramCount}`
        params.push(`%${city}%`)
    }
    
    if (state) {
        paramCount++
        query += ` AND state ILIKE $${paramCount}`
        params.push(`%${state}%`)
    }
    
    if (interests) {
        paramCount++
        query += ` AND $${paramCount} = ANY(dining_interests)`
        params.push(interests)
    }
    
    if (seniority) {
        paramCount++
        query += ` AND seniority = $${paramCount}`
        params.push(seniority)
    }
    
    query += ` ORDER BY ${sortColumn} ${orderDirection}`
    
    paramCount++
    query += ` LIMIT $${paramCount}`
    params.push(limit)
    
    paramCount++
    query += ` OFFSET $${paramCount}`
    params.push(offset)
    
    return db.query(query, params)
    .then((result) => {
        return result.rows
    })
}

const selectDinerById = (id) => {
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE id = $1
    `, [id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Diner not found' })
        }
        return result.rows[0]
    })
}

const searchDinersByQuery = (searchTerm, filters = {}) => {
    let query = `
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE 1=1
    `
    const params = []
    let paramCount = 0
    
    if (searchTerm) {
        paramCount++
        query += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`
        params.push(`%${searchTerm}%`)
    }
    
    if (filters.city) {
        paramCount++
        query += ` AND city ILIKE $${paramCount}`
        params.push(`%${filters.city}%`)
    }
    
    if (filters.state) {
        paramCount++
        query += ` AND state ILIKE $${paramCount}`
        params.push(`%${filters.state}%`)
    }
    
    if (filters.interests) {
        paramCount++
        query += ` AND $${paramCount} = ANY(dining_interests)`
        params.push(filters.interests)
    }
    
    if (filters.seniority) {
        paramCount++
        query += ` AND seniority = $${paramCount}`
        params.push(filters.seniority)
    }
    
    query += ` ORDER BY first_name, last_name`
    
    return db.query(query, params)
    .then((result) => {
        return result.rows
    })
}

const selectDinersBySeniority = (seniority) => {
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE seniority = $1
    `, [seniority])
    .then((result) => {
        return result.rows
    })
}

const selectDinersByCity = (city) => {
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE city ILIKE $1
    `, [`%${city}%`])
    .then((result) => {
        return result.rows
    })
}

const selectDinersByState = (state) => {
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE state ILIKE $1
    `, [`%${state}%`])
    .then((result) => {
        return result.rows
    })
}

const selectDinersByDiningInterests = (interests) => {
    return db.query(`
        SELECT id, first_name, last_name, seniority, city, state, address, dining_interests, phone, email, created_at
        FROM diners 
        WHERE $1 = ANY(dining_interests)
    `, [interests])
    .then((result) => {
        return result.rows
    })
}

const checkDinerExists = (dinerId) => {
    return db.query(`
        SELECT id FROM diners WHERE id = $1
    `, [dinerId])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Diner not found' })
        }
    })
}

module.exports = {
    selectAllDiners,
    selectDinerById,
    searchDinersByQuery,
    selectDinersBySeniority,
    selectDinersByCity,
    selectDinersByState,
    selectDinersByDiningInterests,
    checkDinerExists
}
