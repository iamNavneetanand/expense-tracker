const UPITransaction = require("../models/UPITransaction");
const Expense = require("../models/ExpenseModel");

/* Step 1: Log pending payment */
exports.logUPI = async (req, res) => {
  try {
    const { amount, upiId, description } = req.body;

    const txn = new UPITransaction({
      amount,
      upiId,
      description,
      status: "pending",
    });

    await txn.save();
    res.json({ message: "UPI logged", txn });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* Step 2: Confirm payment using transaction ID */
exports.confirmUPI = async (req, res) => {
  try {
    const { id, category } = req.body;

    const txn = await UPITransaction.findByIdAndUpdate(
      id,
      { status: "success", category },
      { new: true }
    );

    if (!txn) return res.status(404).json({ message: "Transaction not found" });

   const expense = new Expense({
      title: txn.description || "UPI Payment",
      amount: txn.amount,
      category,
      description: txn.description || "UPI Payment", // ✅ added
      type: "expense",
      date: new Date(),
    });

    await expense.save();
    res.json({ message: "Payment confirmed", txn });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* Step 3: Get all UPI transactions */
exports.getUPITransactions = async (req, res) => {
  try {
    const transactions = await UPITransaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json(err);
  }
};