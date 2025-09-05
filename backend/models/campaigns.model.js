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

const addDinerToCampaignById = (campaignId, dinerId) => {
    return db.query(`
        INSERT INTO campaign_recipients (campaign_id, diner_id)
        VALUES ($1, $2)
        ON CONFLICT (campaign_id, diner_id) DO NOTHING
        RETURNING *
    `, [campaignId, dinerId])
    .then((result) => {
        return result.rows[0]
    })
}

const removeDinerFromCampaignById = (campaignId, dinerId) => {
    return db.query(`
        DELETE FROM campaign_recipients 
        WHERE campaign_id = $1 AND diner_id = $2
    `, [campaignId, dinerId])
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

const selectDinerCampaigns = (dinerId) => {
    return db.query(`
        SELECT c.id, c.name, c.subject, c.message, c.campaign_type, c.sent_at,
               r.name as restaurant_name, cr.sent_at as received_at, cr.status
        FROM campaign_recipients cr
        JOIN campaigns c ON cr.campaign_id = c.id
        JOIN restaurants r ON c.restaurant_id = r.id
        WHERE cr.diner_id = $1
        ORDER BY cr.sent_at DESC
    `, [dinerId])
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

const checkDinerExists = (dinerId) => {
    return db.query(`
        SELECT id FROM diners WHERE id = $1
    `, [dinerId])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Diner not found' })
        }
    })
}

/**
 * Updates campaign status and sent_at timestamp
 */
const updateCampaignStatusAndSentAt = (campaignId, status, sentAt) => {
    return db.query(`
        UPDATE campaigns 
        SET status = $1, sent_at = $2
        WHERE id = $3
        RETURNING *
    `, [status, sentAt, campaignId])
    .then((result) => {
        return result.rows[0]
    })
}

/**
 * Records unique diners in restaurant's diner database
 * Only adds diners that weren't already associated with this restaurant
 */
const recordUniqueDinersForRestaurant = (restaurantId, recipients) => {
    // For now, we'll just log this action since diners are global
    // In a real system, you might want to track restaurant-specific diner relationships
    console.log(`📝 MOCK: Recording ${recipients.length} unique diners for restaurant ${restaurantId}`);
    
    // TODO: PRODUCTION - Implement actual diner-restaurant relationship tracking
    // This could involve:
    // - Creating a restaurant_diners table
    // - Tracking when diners were first contacted by each restaurant
    // - Maintaining opt-in/opt-out preferences per restaurant
    
    return Promise.resolve({
        message: `Mock: Recorded ${recipients.length} diners for restaurant`,
        diners_recorded: recipients.length
    });
}

/**
 * Increments the messages_sent_this_month counter for the restaurant
 */
const incrementMessagesSentCounter = (restaurantId) => {
    return db.query(`
        UPDATE restaurants 
        SET messages_sent_this_month = messages_sent_this_month + 1
        WHERE id = $1
        RETURNING messages_sent_this_month
    `, [restaurantId])
    .then((result) => {
        console.log(`📊 MOCK: Incremented messages counter for restaurant ${restaurantId}. New count: ${result.rows[0].messages_sent_this_month}`);
        return result.rows[0]
    })
}

/**
 * Updates campaign_recipients status to 'sent' and sets sent_at timestamp
 */
const updateCampaignRecipientsStatus = (campaignId, emailResults) => {
    const dinerIds = emailResults.map(result => result.diner_id);
    const sentAt = new Date();
    
    return db.query(`
        UPDATE campaign_recipients 
        SET status = 'sent', sent_at = $1
        WHERE campaign_id = $2 AND diner_id = ANY($3)
        RETURNING *
    `, [sentAt, campaignId, dinerIds])
    .then((result) => {
        console.log(`📬 MOCK: Updated ${result.rows.length} campaign recipients to 'sent' status`);
        return result.rows
    })
}

module.exports = {
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
    updateCampaignRecipientsStatus
}
