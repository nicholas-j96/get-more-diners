const { 
    selectAllUsers, 
    selectUserByName, 
    selectUsersBySeniority, 
    selectUsersByCity, 
    selectUsersByState, 
    selectUsersByDiningInterests,
    checkUserExists 
} = require('../models/users.model');
const { checkValidParams } = require('../errors/users.errors')

const getAllUsers = (req, res, next) => {
    const sortBy = req.query.sort_by
    const order = req.query.order
    const limit = req.query.limit
    const page = req.query.p
    return checkValidParams(req.query)
    .then(() => {return selectAllUsers(sortBy, order, limit, page).then((data) => {
        res.status(200).send(data)
        console.log(data)
    })
    })
    .catch(next)
}

const getUserByName = (req, res, next) => {
    const { name } = req.params
    return selectUserByName(name)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getUserBySeniority = (req, res, next) => {
    const { seniority } = req.params
    return selectUsersBySeniority(seniority)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getUserByCity = (req, res, next) => {
    const { city } = req.params
    return selectUsersByCity(city)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getUserByState = (req, res, next) => {
    const { state } = req.params
    return selectUsersByState(state)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getUserByDiningInterests = (req, res, next) => {
    const { interests } = req.params
    return selectUsersByDiningInterests(interests)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

module.exports = {
    getAllUsers,
    getUserByName,
    getUserBySeniority,
    getUserByCity,
    getUserByState,
    getUserByDiningInterests
}
