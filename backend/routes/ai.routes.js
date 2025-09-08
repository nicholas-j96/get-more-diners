const aiRouter = require("express").Router();
const { generateCampaignContent } = require("../controllers/ai.controller");

// AI routes
aiRouter
    .route("/campaign/generate")
    .post(generateCampaignContent);

module.exports = aiRouter;
