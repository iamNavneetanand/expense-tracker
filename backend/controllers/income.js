const IncomeSchema = require("../models/IncomeModel");

exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;
    const userId = req.user._id;

    const income = new IncomeSchema({
        userId,
        title,
        amount: Number(amount), // ✅ convert to number
        category,
        description,
        date
    });

    try {
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (Number(amount) <= 0) { // ✅ fixed check
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }
        await income.save();
        res.status(200).json({ message: 'Income Added' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getIncomes = async (req, res) => {
    const userId = req.user._id;
    try {
        const incomes = await IncomeSchema.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    try {
        await IncomeSchema.findOneAndDelete({ _id: id, userId });
        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};