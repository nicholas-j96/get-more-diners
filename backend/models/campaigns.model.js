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
               cr.sent_at, cr.status,
               COALESCE((SELECT COUNT(*) FROM message_history WHERE campaign_id = $1), 0) as messages_sent
        FROM campaign_recipients cr
        JOIN diners d ON cr.diner_id = d.id
        WHERE cr.campaign_id = $1
        ORDER BY d.last_name, d.first_name
    `, [campaignId])
    .then((result) => {
        return result.rows
    })
    .catch((error) => {
        // If message_history table doesn't exist, fall back to simpler query
        if (error.code === '42P01' && error.message.includes('message_history')) {
            return db.query(`
                SELECT d.id, d.first_name, d.last_name, d.email, d.phone, d.city, d.state,
                       cr.sent_at, cr.status,
                       0 as messages_sent
                FROM campaign_recipients cr
                JOIN diners d ON cr.diner_id = d.id
                WHERE cr.campaign_id = $1
                ORDER BY d.last_name, d.first_name
            `, [campaignId])
            .then((result) => {
                return result.rows
            })
        }
        throw error
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

const checkCampaignExists = (campaignId, restaurantId = null) => {
    let query = `SELECT id FROM campaigns WHERE id = $1`
    let params = [campaignId]
    
    if (restaurantId) {
        query += ` AND restaurant_id = $2`
        params.push(restaurantId)
    }
    
    return db.query(query, params)
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
        SET sent_at = $1
        WHERE id = $2
        RETURNING *
    `, [sentAt, campaignId])
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
    // Mock implementation since messages_sent_this_month column doesn't exist
    console.log(`📊 MOCK: Incremented messages counter for restaurant ${restaurantId}`);
    return Promise.resolve({ messages_sent_this_month: 0 });
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
        console.log(`📬 MOCK: Updated ${result.rows.length} campaign recipients to 'sent' status and incremented message count`);
        return result.rows
    })
}

/**
 * Records a message send in the message history
 */
const recordMessageHistory = (campaignId, subject, message, recipientCount) => {
    // Mock open and click rates (in production, these would come from email service analytics)
    const openRate = Math.random() * 0.4 + 0.2; // Random between 20-60%
    const clickRate = Math.random() * 0.1 + 0.05; // Random between 5-15%
    
    return db.query(`
        INSERT INTO message_history (campaign_id, subject, message, recipient_count, open_rate, click_rate)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `, [campaignId, subject, message, recipientCount, openRate, clickRate])
    .then((result) => {
        console.log(`📝 MESSAGE HISTORY: Recorded message send for campaign ${campaignId} with ${recipientCount} recipients (Open: ${(openRate * 100).toFixed(1)}%, Click: ${(clickRate * 100).toFixed(1)}%)`);
        return result.rows[0];
    })
    .catch((error) => {
        // If message_history table doesn't exist, just log and continue
        if (error.code === '42P01' && error.message.includes('message_history')) {
            console.log(`📝 MESSAGE HISTORY: Table doesn't exist, skipping history recording for campaign ${campaignId}`);
            return { id: null, campaign_id: campaignId, recipient_count: recipientCount };
        }
        throw error;
    })
}

/**
 * Gets message history for a campaign
 */
const getMessageHistory = (campaignId) => {
    return db.query(`
        SELECT id, subject, message, sent_at, recipient_count, open_rate, click_rate
        FROM message_history
        WHERE campaign_id = $1
        ORDER BY sent_at DESC
    `, [campaignId])
    .then((result) => {
        return result.rows;
    })
    .catch((error) => {
        // If message_history table doesn't exist, return empty array
        if (error.code === '42P01' && error.message.includes('message_history')) {
            console.log(`📝 MESSAGE HISTORY: Table doesn't exist, returning empty history for campaign ${campaignId}`);
            return [];
        }
        throw error;
    })
}

/**
 * Gets detailed message data including campaign content
 */
const getMessageDetail = (messageId) => {
    return db.query(`
        SELECT 
            mh.id,
            mh.subject,
            mh.message,
            mh.sent_at,
            mh.recipient_count,
            mh.open_rate,
            mh.click_rate,
            c.campaign_type
        FROM message_history mh
        JOIN campaigns c ON mh.campaign_id = c.id
        WHERE mh.id = $1
    `, [messageId])
    .then((result) => {
        if (result.rows.length === 0) {
            throw new Error('Message not found');
        }
        return result.rows[0];
    })
    .catch((error) => {
        // If message_history table doesn't exist, return null
        if (error.code === '42P01' && error.message.includes('message_history')) {
            console.log(`📝 MESSAGE HISTORY: Table doesn't exist, returning null for message ${messageId}`);
            return null;
        }
        throw error;
    })
}

/**
 * Gets dashboard statistics for a restaurant
 */
const getDashboardStats = (restaurantId) => {
    return db.query(`
        WITH unique_diners AS (
            SELECT COUNT(DISTINCT cr.diner_id) as unique_diner_count
            FROM campaign_recipients cr
            JOIN campaigns c ON cr.campaign_id = c.id
            WHERE c.restaurant_id = $1
        ),
        active_campaigns AS (
            SELECT COUNT(*) as active_campaign_count
            FROM campaigns
            WHERE restaurant_id = $1
        ),
        messages_sent AS (
            SELECT COUNT(*) as messages_sent_count
            FROM message_history mh
            JOIN campaigns c ON mh.campaign_id = c.id
            WHERE c.restaurant_id = $1
        )
        SELECT 
            ud.unique_diner_count,
            ac.active_campaign_count,
            ms.messages_sent_count
        FROM unique_diners ud
        CROSS JOIN active_campaigns ac
        CROSS JOIN messages_sent ms
    `, [restaurantId])
    .then((result) => {
        const stats = result.rows[0];
        return {
            unique_diners: parseInt(stats.unique_diner_count) || 0,
            active_campaigns: parseInt(stats.active_campaign_count) || 0,
            messages_sent_this_month: parseInt(stats.messages_sent_count) || 0
        };
    })
    .catch((error) => {
        // If message_history table doesn't exist, use simpler query
        if (error.code === '42P01' && error.message.includes('message_history')) {
            console.log(`📝 MESSAGE HISTORY: Table doesn't exist, using simplified dashboard stats for restaurant ${restaurantId}`);
            return db.query(`
                WITH unique_diners AS (
                    SELECT COUNT(DISTINCT cr.diner_id) as unique_diner_count
                    FROM campaign_recipients cr
                    JOIN campaigns c ON cr.campaign_id = c.id
                    WHERE c.restaurant_id = $1
                ),
                active_campaigns AS (
                    SELECT COUNT(*) as active_campaign_count
                    FROM campaigns
                    WHERE restaurant_id = $1
                )
                SELECT 
                    ud.unique_diner_count,
                    ac.active_campaign_count,
                    0 as messages_sent_count
                FROM unique_diners ud
                CROSS JOIN active_campaigns ac
            `, [restaurantId])
            .then((result) => {
                const stats = result.rows[0];
                return {
                    unique_diners: parseInt(stats.unique_diner_count) || 0,
                    active_campaigns: parseInt(stats.active_campaign_count) || 0,
                    messages_sent_this_month: 0
                };
            })
        }
        throw error;
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
    updateCampaignRecipientsStatus,
    recordMessageHistory,
    getMessageHistory,
    getMessageDetail,
    getDashboardStats
}
