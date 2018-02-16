var mongo = require('mongoose');

var articles = new mongo.Schema({
    title: String,
    author: String,
    description: String,
    comments: [{
        type: mongo.Schema.Types.ObjectId,
        ref: "comment"
    }],
    created: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongo.model("article", articles);