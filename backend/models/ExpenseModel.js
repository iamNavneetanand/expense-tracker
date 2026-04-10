const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    paymentMethod: {
        type: String,
        default: "cash"
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        default: "expense"
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);