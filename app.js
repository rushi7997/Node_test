var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongo       = require("mongoose"),
    articles    = require('./article'),
    Comments    = require('./comments');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

mongo.connect('mongodb://localhost/test_rest_api');

port = process.env.PORT || 3000;
app.listen(port, process.env.IP, () => {
    console.log("The process is started at port no:: " + port);
});

//index route
app.get("/", (req, res) => {
    articles.find({}, (err, article) => {
        if (err) {
            console.log("Error Home : ")
            return res.status(500).send("Error Performing Index Route!");
        }
        else {
            res.status(200).json(article)
        }
    });
});
//new route
app.get("/articles/new", (req, res) => {
    res.status(200).send("OK");
    // res.send('new');
})
//create route
app.post("/articles/", (req, res) => {
    articles.create(req.body, (err, article) => {
        if (err) {
            console.log("error in new post : ");
            return res.status(500).send("Error Performing Create Route!");
        } else {
            console.log(article);
            res.status(201).json(article);
        }
    })
})
//show route
app.get("/articles/:id", (req, res) => {
    articles.findById(req.params.id).populate("comments").exec((err, article) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error Performing show Route!");
        } else {
            res.status(200).json({ article: article }) //see
        }
    })
})
//new comment route
app.post("/articles/:id/newComment", (req, res) => {
    Comments.create(req.body, (err, comment) => {
        if (err) {
            return res.status(500).send("Error Performing new comment 1 Route!");
        } else {
            articles.findById(req.params.id, (err, article) => {
                console.log(article);
                article.comments.push(comment);
                article.save((err, new_comments) => {
                    if (err) {
                        console.log("err in post commentNew")
                        return res.status(500).send("Error Performing new comment 2 Route!");
                    } else {
                        console.log(new_comments);
                        res.status(201).json(article);
                    }
                })
            })
        }
    })
})
//edit route
app.get("/articles/:id/edit", (req, res) => {
    articles.findById(req.params.id, (err, article) => {
        if (err) {
            console.log("error in update get :");
            return res.status(500).send("Error Performing edit Route!");
        } else {
            res.status(200).send("OK").json(article)
        }
    })
})

//update route
app.put("/articles/:id", (req, res) => {
    articles.findByIdAndUpdate(req.params.id, req.body, (err, updated_article) => {
        if (err)
            return res.status(500).send("Error Performing update Route!");
        else {
            res.status(201).json({
                response: 'a PUT request for EDITING article',
                articleId: req.params.id,
                body: req.body,
            });
        }
    })
})
//delete route
app.delete("/articles/:id", (req, res) => {
    articles.findByIdAndRemove(req.params.id, (err, r) => {
        if (err) {
            console.log("error in del :")
            res.status(500).send("Error Performing delete Route!")
        }
        else {
            res.status(204).json('Successfully Deleted');
        }
    })
})