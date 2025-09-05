const checkValidParams = (query) => {
    const validSortColumns = ['name', 'created_at', 'sent_at']
    const validOrderValues = ['asc', 'desc']
    
    if (query.sort_by && !validSortColumns.includes(query.sort_by)) {
        return Promise.reject({ status: 400, message: 'Invalid sort_by parameter' })
    }
    
    if (query.order && !validOrderValues.includes(query.order.toLowerCase())) {
        return Promise.reject({ status: 400, message: 'Invalid order parameter' })
    }
    
    if (query.limit && (isNaN(query.limit) || query.limit < 1 || query.limit > 100)) {
        return Promise.reject({ status: 400, message: 'Invalid limit parameter' })
    }
    
    if (query.p && (isNaN(query.p) || query.p < 1)) {
        return Promise.reject({ status: 400, message: 'Invalid page parameter' })
    }
    
    return Promise.resolve()
}

const checkCampaignValid = (body) => {
    const { name, subject, message, campaign_type } = body
    const validCampaignTypes = ['email', 'sms']
    
    if (!name || name.trim().length === 0) {
        return Promise.reject({ status: 400, message: 'Campaign name is required' })
    }
    
    if (!subject || subject.trim().length === 0) {
        return Promise.reject({ status: 400, message: 'Campaign subject is required' })
    }
    
    if (!message || message.trim().length === 0) {
        return Promise.reject({ status: 400, message: 'Campaign message is required' })
    }
    
    if (!campaign_type || !validCampaignTypes.includes(campaign_type)) {
        return Promise.reject({ status: 400, message: 'Campaign type must be email or sms' })
    }
    
    return Promise.resolve()
}

module.exports = {
    checkValidParams,
    checkCampaignValid
}
