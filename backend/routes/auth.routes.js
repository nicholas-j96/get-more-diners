const authRouter = require("express").Router();
const { 
    registerRestaurant, 
    loginRestaurant, 
    logoutRestaurant,
    getRestaurantProfile,
    updateRestaurantProfile,
    updateAccountSettings,
    deleteAccount
} = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Authentication routes
authRouter
    .route("/register")
    .post(registerRestaurant)

authRouter
    .route("/login")
    .post(loginRestaurant)

authRouter
    .route("/logout")
    .post(logoutRestaurant)

authRouter
    .route("/profile")
    .get(authenticateToken, getRestaurantProfile)
    .patch(authenticateToken, updateAccountSettings)

// Account management routes
authRouter
    .route("/account")
    .delete(authenticateToken, deleteAccount)

module.exports = authRouter;
