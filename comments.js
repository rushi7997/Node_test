var mongoose = require('mongoose');

var Comments = new mongoose.Schema({
    comment: String,
    comment_Author: String,
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("comment", Comments);
