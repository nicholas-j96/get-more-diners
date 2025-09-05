const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
    selectRestaurantByEmail, 
    insertRestaurant, 
    selectRestaurantById,
    updateRestaurantById
} = require('../models/auth.model');
const { checkRestaurantValid, checkEmailExists } = require('../errors/auth.errors')

const registerRestaurant = async (req, res, next) => {
    const { name, email, password, city, state } = req.body
    try {
        await checkRestaurantValid(req.body)
        await checkEmailExists(email)
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const restaurant = await insertRestaurant(name, email, hashedPassword, city, state)
        
        const token = jwt.sign(
            { id: restaurant.id, email: restaurant.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        
        res.status(201).send({ restaurant, token })
    } catch (error) {
        next(error)
    }
}

const loginRestaurant = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const restaurant = await selectRestaurantByEmail(email)
        
        if (!restaurant) {
            return res.status(401).send({ message: 'Invalid credentials' })
        }
        
        const isValidPassword = await bcrypt.compare(password, restaurant.password_hash)
        
        if (!isValidPassword) {
            return res.status(401).send({ message: 'Invalid credentials' })
        }
        
        const token = jwt.sign(
            { id: restaurant.id, email: restaurant.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        
        res.status(200).send({ restaurant, token })
    } catch (error) {
        next(error)
    }
}

const logoutRestaurant = (req, res, next) => {
    // For JWT tokens, logout is handled client-side by removing the token
    res.status(200).send({ message: 'Logged out successfully' })
}

const getRestaurantProfile = (req, res, next) => {
    const restaurantId = req.user.id
    return selectRestaurantById(restaurantId)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const updateRestaurantProfile = (req, res, next) => {
    const restaurantId = req.user.id
    const { name, city, state } = req.body
    return updateRestaurantById(restaurantId, name, city, state)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

module.exports = {
    registerRestaurant,
    loginRestaurant,
    logoutRestaurant,
    getRestaurantProfile,
    updateRestaurantProfile
}
