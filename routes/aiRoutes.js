const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getInsights, askQuestion } = require("../controllers/aiController");

const router = express.Router();

router.post("/insights", protect, getInsights);
router.post("/query", protect, askQuestion);

module.exports = router;