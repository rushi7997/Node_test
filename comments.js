var mongo = require('mongoose');

var Comments = new mongo.Schema({
    comment: String,
    comment_Author: String,
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongo.model("comment", Comments);
