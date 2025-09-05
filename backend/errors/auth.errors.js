const checkRestaurantValid = (body) => {
    const { name, email, password, city, state } = body
    
    if (!name || name.trim().length === 0) {
        return Promise.reject({ status: 400, message: 'Restaurant name is required' })
    }
    
    if (!email || !isValidEmail(email)) {
        return Promise.reject({ status: 400, message: 'Valid email is required' })
    }
    
    if (!password || password.length < 6) {
        return Promise.reject({ status: 400, message: 'Password must be at least 6 characters' })
    }
    
    if (!city || city.trim().length === 0) {
        return Promise.reject({ status: 400, message: 'City is required' })
    }
    
    if (!state || state.trim().length === 0) {
        return Promise.reject({ status: 400, message: 'State is required' })
    }
    
    return Promise.resolve()
}

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
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
    checkRestaurantValid,
    checkEmailExists
}
