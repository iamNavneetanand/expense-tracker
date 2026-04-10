const express = require("express");
const { logUPI, confirmUPI, getUPITransactions } = require("../controllers/upiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upi-log", protect, logUPI);
router.post("/upi-success", protect, confirmUPI);
router.get("/upi-transactions", protect, getUPITransactions);

module.exports = router;