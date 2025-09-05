const { 
    selectAllDiners, 
    selectDinerById, 
    selectDinersBySeniority, 
    selectDinersByCity, 
    selectDinersByState, 
    selectDinersByDiningInterests,
    searchDinersByQuery,
    checkDinerExists,
    selectSeniorityOptions
} = require('../models/diners.model');
const { checkValidParams } = require('../errors/diners.errors')

const getAllDiners = (req, res, next) => {
    const sortBy = req.query.sort_by
    const order = req.query.order
    const limit = req.query.limit || 100 // Increase default limit for searches
    const page = req.query.p || 1
    const city = req.query.city
    const state = req.query.state
    const interests = req.query.interests
    const seniority = req.query.seniority
    
    return checkValidParams(req.query)
    .then(() => {return selectAllDiners(sortBy, order, limit, page, city, state, interests, seniority).then((data) => {
        res.status(200).send(data)
        console.log(data)
    })
    })
    .catch(next)
}

const getDinerById = (req, res, next) => {
    const { id } = req.params
    return selectDinerById(id)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const searchDiners = (req, res, next) => {
    const { q, filters } = req.query
    return searchDinersByQuery(q, filters)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getDinersBySeniority = (req, res, next) => {
    const { seniority } = req.params
    return selectDinersBySeniority(seniority)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getDinersByCity = (req, res, next) => {
    const { city } = req.params
    return selectDinersByCity(city)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getDinersByState = (req, res, next) => {
    const { state } = req.params
    return selectDinersByState(state)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getDinersByInterests = (req, res, next) => {
    const { interest } = req.params
    return selectDinersByDiningInterests(interest)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getSeniorityOptions = (req, res, next) => {
    return selectSeniorityOptions()
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

module.exports = {
    getAllDiners,
    getDinerById,
    searchDiners,
    getDinersBySeniority,
    getDinersByCity,
    getDinersByState,
    getDinersByInterests,
    getSeniorityOptions
}
