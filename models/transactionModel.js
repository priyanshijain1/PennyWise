const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    amount: {
        type: String,
        required: [true, "Amount is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    reference: {
        type: String,
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    date: {
        type: String,
        required: [true, "Date is required"]
    },
}, {
    timestamps: true
});