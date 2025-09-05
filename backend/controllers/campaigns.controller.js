const { 
    selectAllCampaigns, 
    selectCampaignById, 
    insertCampaign, 
    updateCampaignById,
    deleteCampaignById,
    addDinerToCampaignById,
    removeDinerFromCampaignById,
    selectCampaignRecipients,
    selectDinerCampaigns,
    checkCampaignExists,
    checkDinerExists
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

const addDinerToCampaign = (req, res, next) => {
    const { campaign_id, diner_id } = req.params
    return Promise.all([
        checkCampaignExists(campaign_id),
        checkDinerExists(diner_id)
    ])
    .then(() => {
        return addDinerToCampaignById(campaign_id, diner_id)
    })
    .then((data) => {
        res.status(201).send(data)
    })
    .catch(next)
}

const removeDinerFromCampaign = (req, res, next) => {
    const { campaign_id, diner_id } = req.params
    return Promise.all([
        checkCampaignExists(campaign_id),
        checkDinerExists(diner_id)
    ])
    .then(() => {
        return removeDinerFromCampaignById(campaign_id, diner_id)
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

const addDinersToCampaign = (req, res, next) => {
    const { campaign_id } = req.params
    const { dinerIds } = req.body
    
    if (!dinerIds || !Array.isArray(dinerIds) || dinerIds.length === 0) {
        return res.status(400).send({ message: 'dinerIds array is required and must not be empty' })
    }
    
    return checkCampaignExists(campaign_id)
    .then(() => {
        // Check that all diners exist
        const dinerChecks = dinerIds.map(dinerId => checkDinerExists(dinerId))
        return Promise.all(dinerChecks)
    })
    .then(() => {
        // Add all diners to campaign
        const addPromises = dinerIds.map(dinerId => addDinerToCampaignById(campaign_id, dinerId))
        return Promise.all(addPromises)
    })
    .then((results) => {
        const addedCount = results.filter(result => result).length
        res.status(201).send({ 
            message: `Successfully added ${addedCount} diners to campaign`,
            addedCount,
            totalRequested: dinerIds.length
        })
    })
    .catch(next)
}

const getDinerCampaigns = (req, res, next) => {
    const { diner_id } = req.params
    return checkDinerExists(diner_id)
    .then(() => {
        return selectDinerCampaigns(diner_id)
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
    addDinerToCampaign,
    addDinersToCampaign,
    removeDinerFromCampaign,
    getCampaignRecipients,
    getDinerCampaigns
}
