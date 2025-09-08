const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
    selectRestaurantByEmail, 
    insertRestaurant, 
    selectRestaurantById,
    updateRestaurantById,
    deleteRestaurantById
} = require('../models/auth.model');
const { checkRestaurantValid, checkEmailExists } = require('../errors/auth.errors')

const registerRestaurant = async (req, res, next) => {
    const { name, email, password, city, state } = req.body
    
    console.log('Register request received:', { name, email, city, state });
    
    try {
        await checkRestaurantValid(req.body)
        await checkEmailExists(email)
        
        console.log('Validation passed, creating restaurant...');
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const restaurant = await insertRestaurant(name, email, hashedPassword, city, state)
        
        console.log('Restaurant created:', restaurant);
        
        const token = jwt.sign(
            { id: restaurant.id, email: restaurant.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        
        console.log('Token created for restaurant ID:', restaurant.id);
        
        res.status(201).send({ restaurant, token })
    } catch (error) {
        console.error('Registration error:', error);
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

const updateAccountSettings = async (req, res, next) => {
    const restaurantId = req.user.id
    const { name, email, currentPassword, newPassword } = req.body
    
    try {
        // Get current restaurant data
        const restaurant = await selectRestaurantById(restaurantId)
        if (!restaurant) {
            return res.status(404).send({ message: 'Restaurant not found' })
        }

        // Check if email is being changed and if it already exists
        if (email && email !== restaurant.email) {
            const existingRestaurant = await selectRestaurantByEmail(email)
            if (existingRestaurant) {
                return res.status(400).send({ message: 'Email already exists' })
            }
        }

        // If password is being changed, verify current password
        if (currentPassword && newPassword) {
            const isValidPassword = await bcrypt.compare(currentPassword, restaurant.password_hash)
            if (!isValidPassword) {
                return res.status(400).send({ message: 'Current password is incorrect' })
            }
        }

        // Prepare update data
        const updateData = {
            name: name || restaurant.name,
            email: email || restaurant.email,
            city: restaurant.city,
            state: restaurant.state
        }

        // Hash new password if provided
        if (newPassword) {
            updateData.password_hash = await bcrypt.hash(newPassword, 10)
        }

        // Update restaurant
        const updatedRestaurant = await updateRestaurantById(
            restaurantId, 
            updateData.name, 
            updateData.city, 
            updateData.state,
            updateData.email,
            updateData.password_hash
        )

        res.status(200).send({
            message: 'Account updated successfully',
            restaurant: {
                id: updatedRestaurant.id,
                name: updatedRestaurant.name,
                email: updatedRestaurant.email,
                city: updatedRestaurant.city,
                state: updatedRestaurant.state,
                created_at: updatedRestaurant.created_at
            }
        })
    } catch (error) {
        console.error('Update account error:', error)
        next(error)
    }
}

const deleteAccount = async (req, res, next) => {
    const restaurantId = req.user.id
    
    try {
        // Get restaurant data to verify it exists
        const restaurant = await selectRestaurantById(restaurantId)
        if (!restaurant) {
            return res.status(404).send({ message: 'Restaurant not found' })
        }

        // Delete restaurant (this will cascade delete related data)
        await deleteRestaurantById(restaurantId)
        
        res.status(200).send({ message: 'Account deleted successfully' })
    } catch (error) {
        console.error('Delete account error:', error)
        next(error)
    }
}

module.exports = {
    registerRestaurant,
    loginRestaurant,
    logoutRestaurant,
    getRestaurantProfile,
    updateRestaurantProfile,
    updateAccountSettings,
    deleteAccount
}
