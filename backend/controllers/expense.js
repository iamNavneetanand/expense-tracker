const Expense = require("../models/ExpenseModel");

exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date, paymentMethod } = req.body;
    const userId = req.user._id;

    const expense = new Expense({
        userId,
        title,
        amount,
        category,
        description,
        date,
        paymentMethod
    });

    try {
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        if (amount <= 0 || typeof amount !== "number") {
            return res.status(400).json({ message: "Amount must be a positive number!" });
        }
        await expense.save();
        res.status(200).json({ message: "Expense Added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    try {
        await Expense.findOneAndDelete({ _id: id, userId });
        res.status(200).json({ message: "Expense Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};