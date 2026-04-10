const UPITransaction = require("../models/UPITransaction");
const Expense = require("../models/ExpenseModel");

exports.logUPI = async (req, res) => {
  try {
    const { amount, upiId, description } = req.body;
    const userId = req.user._id;

    const txn = new UPITransaction({
      userId,
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

exports.confirmUPI = async (req, res) => {
  try {
    const { id, category } = req.body;
    const userId = req.user._id;

    const txn = await UPITransaction.findOneAndUpdate(
      { _id: id, userId },
      { status: "success", category },
      { new: true }
    );

    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    const expense = new Expense({
      userId,
      title: txn.description || "UPI Payment",
      amount: txn.amount,
      category,
      description: txn.description || "UPI Payment",
      type: "expense",
      date: new Date(),
    });

    await expense.save();
    res.json({ message: "Payment confirmed", txn });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getUPITransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await UPITransaction.find({ userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json(err);
  }
};