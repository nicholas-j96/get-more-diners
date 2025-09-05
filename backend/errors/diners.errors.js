const checkValidParams = (query) => {
    const validSortColumns = ['first_name', 'last_name', 'seniority', 'city', 'state', 'created_at']
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

module.exports = {
    checkValidParams
}
