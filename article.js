var mongoose = require('mongoose');

var articles = new mongoose.Schema({
    title: String,
    author: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }],
    created: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("article", articles);