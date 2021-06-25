const mongoose = require("mongoose");

const plansSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    nominal: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    isDone: {
        type: Number,
        required: true
    }
}, {
    collection: "plans"
})

module.exports = mongoose.model("Plans", plansSchema);