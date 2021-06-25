const mongoose = require("mongoose");

const articlesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    likes: [String],
    saves: [String],
    comments: [{
        comment: String,
        from: String
    }]
}, {
    collection: "articles"
})

module.exports = mongoose.model("Articles", articlesSchema);