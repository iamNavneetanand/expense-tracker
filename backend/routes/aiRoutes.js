const express = require("express");
const { getSpendingInsights, suggestCategory, listModels } = require("../controllers/aiController");

const router = express.Router();

router.post("/ai-insights", getSpendingInsights);
router.post("/ai-category", suggestCategory);

module.exports = router;