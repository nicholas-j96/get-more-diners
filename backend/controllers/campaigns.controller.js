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
    checkDinerExists,
    updateCampaignStatusAndSentAt,
    recordUniqueDinersForRestaurant,
    incrementMessagesSentCounter,
    updateCampaignRecipientsStatus,
    recordMessageHistory,
    getMessageHistory,
    getMessageDetail,
    getDashboardStats
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
    
    console.log('Creating campaign for restaurant_id:', restaurantId);
    console.log('Campaign data:', { name, subject, message, campaign_type });
    
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

/**
 * MOCK EMAIL FUNCTIONALITY - PRODUCTION WARNING
 * 
 * ⚠️  CRITICAL: This function contains mock email functionality and MUST be updated 
 *     before production deployment to actually send real emails/SMS messages.
 * 
 * Current mock behavior:
 * 1. Updates campaign status to 'active'
 * 2. Records unique diners in restaurant's diner database
 * 3. Increments messages_sent_this_month counter
 * 4. Updates campaign_recipients status to 'sent'
 * 
 * Required for production:
 * - Integrate with real email service (SendGrid, AWS SES, etc.)
 * - Integrate with real SMS service (Twilio, AWS SNS, etc.)
 * - Add proper error handling for failed sends
 * - Add retry logic for failed deliveries
 * - Add unsubscribe functionality
 * - Add delivery tracking and analytics
 * - Add rate limiting to prevent spam
 * - Add compliance with CAN-SPAM Act and GDPR
 */
const sendEmails = (req, res, next) => {
    const { campaign_id } = req.params
    const restaurantId = req.user.id
    
    console.log(`🚀 MOCK EMAIL SEND: Starting email send for campaign ${campaign_id} by restaurant ${restaurantId}`);
    
    return checkCampaignExists(campaign_id)
    .then(() => {
        // Get campaign details and recipients
        return Promise.all([
            selectCampaignById(campaign_id),
            selectCampaignRecipients(campaign_id)
        ])
    })
    .then(([campaign, recipients]) => {
        console.log(`📧 MOCK EMAIL SEND: Campaign "${campaign.name}" has ${recipients.length} recipients`);
        
        // TODO: PRODUCTION - Replace this mock with actual email/SMS sending
        // Example integration points:
        // - Email: SendGrid, AWS SES, Mailgun
        // - SMS: Twilio, AWS SNS, MessageBird
        
        // Mock email sending process
        const mockEmailResults = recipients.map(recipient => {
            console.log(`📬 MOCK EMAIL SEND: Sending ${campaign.campaign_type} to ${recipient.email || recipient.phone}`);
            return {
                diner_id: recipient.id, // Fixed: use recipient.id instead of recipient.diner_id
                status: 'sent', // Mock successful send
                sent_at: new Date()
            };
        });
        
        // Update campaign status to 'active' and set sent_at timestamp
        return updateCampaignStatusAndSentAt(campaign_id, 'active', new Date())
        .then(() => {
            // Record unique diners in restaurant's diner database
            return recordUniqueDinersForRestaurant(restaurantId, recipients)
        })
        .then(() => {
            // Increment messages_sent_this_month counter
            return incrementMessagesSentCounter(restaurantId)
        })
        .then(() => {
            // Record message in history FIRST
            return recordMessageHistory(campaign_id, campaign.subject, recipients.length)
        })
        .then(() => {
            // Update campaign_recipients status to 'sent' ONLY after successful history recording
            return updateCampaignRecipientsStatus(campaign_id, mockEmailResults)
        })
        .then(() => {
            console.log(`✅ MOCK EMAIL SEND: Successfully "sent" ${recipients.length} ${campaign.campaign_type} messages`);
            
            res.status(200).send({
                message: `Successfully sent ${recipients.length} ${campaign.campaign_type} messages`,
                campaign_id: campaign_id,
                recipients_sent: recipients.length,
                campaign_status: 'active',
                sent_at: new Date(),
                warning: 'This is mock functionality - real email/SMS sending must be implemented before production'
            });
        });
    })
    .catch(next)
}

const getDashboardStatsController = (req, res, next) => {
    const restaurantId = req.user.id
    return getDashboardStats(restaurantId)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getMessageHistoryController = (req, res, next) => {
    const { campaign_id } = req.params
    return checkCampaignExists(campaign_id)
    .then(() => {
        return getMessageHistory(campaign_id)
    })
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

const getMessageDetailController = (req, res, next) => {
    const { message_id } = req.params
    return getMessageDetail(message_id)
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
    getDinerCampaigns,
    sendEmails,
    getDashboardStatsController,
    getMessageHistoryController,
    getMessageDetailController
}
