const authRouter = require("express").Router();
const { 
    registerRestaurant, 
    loginRestaurant, 
    logoutRestaurant,
    getRestaurantProfile,
    updateRestaurantProfile
} = require("../controllers/auth.controller");

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
    .get(getRestaurantProfile)
    .patch(updateRestaurantProfile)

module.exports = authRouter;
