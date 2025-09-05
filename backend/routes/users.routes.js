const usersRouter = require("express").Router();
const { 
    getAllUsers, 
    getUserByName, 
    getUserBySeniority, 
    getUserByCity, 
    getUserByState, 
    getUserByDiningInterests 
} = require("../controllers/users.controller");

// Users routes
usersRouter
    .route("/")
    .get(getAllUsers)

usersRouter
    .route("/name/:name")
    .get(getUserByName)

usersRouter
    .route("/seniority/:seniority")
    .get(getUserBySeniority)

usersRouter
    .route("/city/:city")
    .get(getUserByCity)

usersRouter
    .route("/state/:state")
    .get(getUserByState)

usersRouter
    .route("/interests/:interests")
    .get(getUserByDiningInterests)

module.exports = usersRouter;
