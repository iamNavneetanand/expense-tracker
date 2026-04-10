const mongoose = require("mongoose");

const UPITransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    upiId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "UPI Payment",
    },
    method: {
      type: String,
      default: "UPI",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    category: {
      type: String,
      default: "other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UPITransaction", UPITransactionSchema);