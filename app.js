var express = require("express"),
    bodyParser = require("body-parser"),
    mongo = require("mongoose"),
    methodOverride = require("method-override");

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));

//mongo.connect("mongodb://localhost/blog");
mongo.connect(process.env.DB);

var blogSchema = new mongo.Schema({
    title: String,
    author: String,
    article: String,
    comments: [{
        type: mongo.Schema.Types.ObjectId,
        ref: "comment"
    }],
    created: {
        type: Date,
        default: Date.now
    }
})
var blogs = mongo.model("blog", blogSchema);

var commentsSchema = new mongo.Schema({
    description: String,
    name: String,
    created: {
        type: Date,
        default: Date.now
    }
})
var comments = mongo.model("comment", commentsSchema);



app.listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("Start...");
})



app.get("/", (req, res) => {
    blogs.find({}, (err, blogs) => {
        if (err) {
            console.log("Error Home : ")
            return res.status(500).send("Internal server error");
        }
        else {
            res.status(200).json(blogs)
        }
    });
});

app.get("/new", (req, res) => {
    res.status(200).send("OK");
})

app.post("/new", (req, res) => {
    blogs.create(req.body, (err, blog) => {
        if (err) {
            console.log("error in new post : ");
            return res.status(500).send("Internal server error");
        } else {
            console.log(blog);
            res.status(201).json(blog);

        }
    })
})

app.get("/show/:id", (req, res) => {
    blogs.findById(req.params.id).populate("comments").exec((err, blogwithComments) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal server error");
        } else {
            res.status(200).json({ blog: blogwithComments })
        }
    })
})

app.post("/show/:id/commentNew", (req, res) => {
    comments.create(req.body, (err, comment) => {
        if (err) {
            return res.status(500).send("Internal server error");
        } else {
            blogs.findById(req.params.id, (err, blog) => {
                console.log(blog);
                blog.comments.push(comment);
                blog.save((err, arrayComments) => {
                    if (err) {
                        console.log("err in post commentNew")
                        return res.status(500).send("Internal server error");
                    } else {
                        console.log(arrayComments);
                        res.status(201).json(blog);
                    }
                })
            })
        }
    })
})

app.get("/show/:id/update", (req, res) => {
    blogs.findById(req.params.id, (err, blog) => {
        if (err) {
            console.log("error in update get :");
            return res.status(500).send("Internal server error");
        } else {
            res.status(200).send("OK").json(blog)
        }
    })
})
app.put("/show/:id/update", (req, res) => {
    blogs.findByIdAndUpdate(req.params.id, req.body, (err, upBlog) => {
        if (err)
            return res.status(500).send("Internal server error");
        else {
            res.status(201).json({
                response: 'a PUT request for EDITING blog',
                blogId: req.params.id,
                body: req.body,
            });
        }
    })
})

app.delete("/show/:id", (req, res) => {
    blogs.findByIdAndRemove(req.params.id, (err, r) => {
        if (err) {
            console.log("error in del :")
            res.status(500).send("intrnal server erroer")
        }
        else {
            res.status(204).send("NO CONTENT");
        }
    })
})