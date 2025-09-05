const dinersRouter = require("express").Router();
const { 
    getAllDiners, 
    getDinerById, 
    getDinersByCity, 
    getDinersByState, 
    getDinersBySeniority, 
    getDinersByInterests,
    searchDiners 
} = require("../controllers/diners.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Apply authentication middleware to all routes
dinersRouter.use(authenticateToken);

// Main diners routes
dinersRouter
    .route("/")
    .get(getAllDiners); // GET /api/diners?city=Boston&state=MA&interests=Fine Dining&seniority=Director

dinersRouter
    .route("/search")
    .get(searchDiners); // GET /api/diners/search?q=searchTerm&filters[city]=Boston

dinersRouter
    .route("/:id")
    .get(getDinerById); // GET /api/diners/123

// Specific filter routes (if you prefer separate endpoints)
dinersRouter
    .route("/city/:city")
    .get(getDinersByCity); // GET /api/diners/city/Boston

dinersRouter
    .route("/state/:state") 
    .get(getDinersByState); // GET /api/diners/state/Massachusetts

dinersRouter
    .route("/seniority/:seniority")
    .get(getDinersBySeniority); // GET /api/diners/seniority/Director

dinersRouter
    .route("/interests/:interest")
    .get(getDinersByInterests); // GET /api/diners/interests/Fine%20Dining

module.exports = dinersRouter;
