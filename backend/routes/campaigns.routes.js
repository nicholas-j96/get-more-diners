const campaignsRouter = require("express").Router();
const { 
    getAllCampaigns, 
    getCampaignById, 
    createCampaign, 
    updateCampaign,
    deleteCampaign,
    addDinerToCampaign,
    removeDinerFromCampaign,
    getCampaignRecipients,
    getDinerCampaigns
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
    .route("/:campaign_id/diners/:diner_id")
    .post(addDinerToCampaign)
    .delete(removeDinerFromCampaign)

campaignsRouter
    .route("/diner/:diner_id")
    .get(getDinerCampaigns)

module.exports = campaignsRouter;
