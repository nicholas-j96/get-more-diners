const campaignsRouter = require("express").Router();
const { 
    getAllCampaigns, 
    getCampaignById, 
    createCampaign, 
    updateCampaign,
    deleteCampaign,
    addUserToCampaign,
    removeUserFromCampaign,
    getCampaignRecipients,
    getUserCampaigns
} = require("../controllers/campaigns.controller");

// Campaigns routes
campaignsRouter
    .route("/")
    .get(getAllCampaigns)
    .post(createCampaign)

campaignsRouter
    .route("/:campaign_id")
    .get(getCampaignById)
    .patch(updateCampaign)
    .delete(deleteCampaign)

campaignsRouter
    .route("/:campaign_id/recipients")
    .get(getCampaignRecipients)

campaignsRouter
    .route("/:campaign_id/users/:user_id")
    .post(addUserToCampaign)
    .delete(removeUserFromCampaign)

campaignsRouter
    .route("/user/:user_id")
    .get(getUserCampaigns)

module.exports = campaignsRouter;
