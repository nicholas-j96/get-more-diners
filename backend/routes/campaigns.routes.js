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
    getDinerCampaigns,
    addDinersToCampaign
} = require("../controllers/campaigns.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Apply authentication middleware to all routes
campaignsRouter.use(authenticateToken);

// Campaigns routes
campaignsRouter
    .route("/")
    .get(getAllCampaigns)      // GET /api/campaigns - get all campaigns for logged-in restaurant
    .post(createCampaign)      // POST /api/campaigns - create new campaign

campaignsRouter
    .route("/:campaign_id")
    .get(getCampaignById)     // GET /api/campaigns/123
    .patch(updateCampaign)    // PATCH /api/campaigns/123 - update campaign
    .delete(deleteCampaign)   // DELETE /api/campaigns/123

campaignsRouter
    .route("/:campaign_id/recipients")
    .get(getCampaignRecipients)  // GET /api/campaigns/123/recipients
    .post(addDinersToCampaign);  // POST /api/campaigns/123/recipients { dinerIds: [1,2,3] }

campaignsRouter
    .route("/:campaign_id/diners/:diner_id")
    .post(addDinerToCampaign)     // POST /api/campaigns/123/diners/456 - add single diner
    .delete(removeDinerFromCampaign) // DELETE /api/campaigns/123/diners/456

campaignsRouter
    .route("/diner/:diner_id")
    .get(getDinerCampaigns)   // GET /api/campaigns/diner/456 - get campaigns for specific diner

module.exports = campaignsRouter;
