const { 
    selectAllCampaigns, 
    selectCampaignById, 
    insertCampaign, 
    updateCampaignById,
    deleteCampaignById,
    addUserToCampaignById,
    removeUserFromCampaignById,
    selectCampaignRecipients,
    selectUserCampaigns,
    checkCampaignExists,
    checkUserExists
} = require('../models/campaigns.model');
const { checkValidParams, checkCampaignValid } = require('../errors/campaigns.errors')

const getAllCampaigns = (req, res, next) => {
    const restaurantId = req.user.id
    return selectAllCampaigns(restaurantId)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getCampaignById = (req, res, next) => {
    const { campaign_id } = req.params
    return checkCampaignExists(campaign_id)
    .then(() => {
        return selectCampaignById(campaign_id)
    })
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const createCampaign = (req, res, next) => {
    const restaurantId = req.user.id
    const { name, subject, message, campaign_type } = req.body
    return checkCampaignValid(req.body)
    .then(() => {
        return insertCampaign(restaurantId, name, subject, message, campaign_type)
    })
    .then((data) => {
        res.status(201).send(data)
    })
    .catch(next)
}

const updateCampaign = (req, res, next) => {
    const { campaign_id } = req.params
    const { name, subject, message, campaign_type } = req.body
    return checkCampaignExists(campaign_id)
    .then(() => {
        return updateCampaignById(campaign_id, name, subject, message, campaign_type)
    })
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const deleteCampaign = (req, res, next) => {
    const { campaign_id } = req.params
    return checkCampaignExists(campaign_id)
    .then(() => {
        return deleteCampaignById(campaign_id)
    })
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}

const addUserToCampaign = (req, res, next) => {
    const { campaign_id, user_id } = req.params
    return Promise.all([
        checkCampaignExists(campaign_id),
        checkUserExists(user_id)
    ])
    .then(() => {
        return addUserToCampaignById(campaign_id, user_id)
    })
    .then((data) => {
        res.status(201).send(data)
    })
    .catch(next)
}

const removeUserFromCampaign = (req, res, next) => {
    const { campaign_id, user_id } = req.params
    return Promise.all([
        checkCampaignExists(campaign_id),
        checkUserExists(user_id)
    ])
    .then(() => {
        return removeUserFromCampaignById(campaign_id, user_id)
    })
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}

const getCampaignRecipients = (req, res, next) => {
    const { campaign_id } = req.params
    return checkCampaignExists(campaign_id)
    .then(() => {
        return selectCampaignRecipients(campaign_id)
    })
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getUserCampaigns = (req, res, next) => {
    const { user_id } = req.params
    return checkUserExists(user_id)
    .then(() => {
        return selectUserCampaigns(user_id)
    })
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

module.exports = {
    getAllCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    addUserToCampaign,
    removeUserFromCampaign,
    getCampaignRecipients,
    getUserCampaigns
}
