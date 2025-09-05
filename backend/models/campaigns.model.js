const db = require('../utils/db');

const selectAllCampaigns = (restaurantId) => {
    return db.query(`
        SELECT c.id, c.name, c.subject, c.message, c.campaign_type, c.sent_at, c.created_at,
               COUNT(cr.diner_id) as recipient_count
        FROM campaigns c
        LEFT JOIN campaign_recipients cr ON c.id = cr.campaign_id
        WHERE c.restaurant_id = $1
        GROUP BY c.id, c.name, c.subject, c.message, c.campaign_type, c.sent_at, c.created_at
        ORDER BY c.created_at DESC
    `, [restaurantId])
    .then((result) => {
        return result.rows
    })
}

const selectCampaignById = (campaignId) => {
    return db.query(`
        SELECT c.id, c.name, c.subject, c.message, c.campaign_type, c.sent_at, c.created_at,
               r.name as restaurant_name, r.email as restaurant_email
        FROM campaigns c
        JOIN restaurants r ON c.restaurant_id = r.id
        WHERE c.id = $1
    `, [campaignId])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Campaign not found' })
        }
        return result.rows[0]
    })
}

const insertCampaign = (restaurantId, name, subject, message, campaignType) => {
    return db.query(`
        INSERT INTO campaigns (restaurant_id, name, subject, message, campaign_type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [restaurantId, name, subject, message, campaignType])
    .then((result) => {
        return result.rows[0]
    })
}

const updateCampaignById = (campaignId, name, subject, message, campaignType) => {
    return db.query(`
        UPDATE campaigns 
        SET name = $1, subject = $2, message = $3, campaign_type = $4
        WHERE id = $5
        RETURNING *
    `, [name, subject, message, campaignType, campaignId])
    .then((result) => {
        return result.rows[0]
    })
}

const deleteCampaignById = (campaignId) => {
    return db.query(`
        DELETE FROM campaigns WHERE id = $1
    `, [campaignId])
}

const addUserToCampaignById = (campaignId, userId) => {
    return db.query(`
        INSERT INTO campaign_recipients (campaign_id, diner_id)
        VALUES ($1, $2)
        ON CONFLICT (campaign_id, diner_id) DO NOTHING
        RETURNING *
    `, [campaignId, userId])
    .then((result) => {
        return result.rows[0]
    })
}

const removeUserFromCampaignById = (campaignId, userId) => {
    return db.query(`
        DELETE FROM campaign_recipients 
        WHERE campaign_id = $1 AND diner_id = $2
    `, [campaignId, userId])
}

const selectCampaignRecipients = (campaignId) => {
    return db.query(`
        SELECT d.id, d.first_name, d.last_name, d.email, d.phone, d.city, d.state,
               cr.sent_at, cr.status
        FROM campaign_recipients cr
        JOIN diners d ON cr.diner_id = d.id
        WHERE cr.campaign_id = $1
        ORDER BY d.last_name, d.first_name
    `, [campaignId])
    .then((result) => {
        return result.rows
    })
}

const selectUserCampaigns = (userId) => {
    return db.query(`
        SELECT c.id, c.name, c.subject, c.message, c.campaign_type, c.sent_at,
               r.name as restaurant_name, cr.sent_at as received_at, cr.status
        FROM campaign_recipients cr
        JOIN campaigns c ON cr.campaign_id = c.id
        JOIN restaurants r ON c.restaurant_id = r.id
        WHERE cr.diner_id = $1
        ORDER BY cr.sent_at DESC
    `, [userId])
    .then((result) => {
        return result.rows
    })
}

const checkCampaignExists = (campaignId) => {
    return db.query(`
        SELECT id FROM campaigns WHERE id = $1
    `, [campaignId])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Campaign not found' })
        }
    })
}

const checkUserExists = (userId) => {
    return db.query(`
        SELECT id FROM diners WHERE id = $1
    `, [userId])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'User not found' })
        }
    })
}

module.exports = {
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
}
