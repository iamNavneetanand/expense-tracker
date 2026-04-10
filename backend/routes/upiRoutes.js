const express = require("express");
const { logUPI, confirmUPI, getUPITransactions } = require("../controllers/upiController");

const router = express.Router();

router.post("/upi-log", logUPI);
router.post("/upi-success", confirmUPI);
router.get("/upi-transactions", getUPITransactions);

module.exports = router;