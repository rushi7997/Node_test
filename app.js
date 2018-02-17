var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override');
var app = express();
var crypto = require('crypto');
var session = require('express-session');
var Pool = require('pg').Pool;
var path = require('path');
var articles = require('./article'),
    Comments = require('./comments');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({
    secret:'someRandomSecretValue',
    cookie:{maxAge: 1000 * 60 * 60 * 24 * 30}
}));

// mongoose.connect('mongodb://localhost/test_rest_api');
mongoose.connect('mongodb://rushi:password@ds239638.mlab.com:39638/test_node_rest',function(err, res){
    if(err){
        console.log('Error connecting To The Data Base!!!');
    }else{
        console.log('Successfully connected to the data base');
    }
});

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

app.get('/home-page', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input, 'salt', 100000, 512, 'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}

app.post('/create-user', function (req, res) {
    
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password,salt);
    // pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
    //   if(err){
    //         res.status(500).send(err,toString());
    //     } else {
    //         res.send('User created successfully'+username);
    //     }
    // }); Do required changes in mongoDB
});

app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    // pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err,result){
    //   if(err){
    //         res.status(500).send(err.toString());
    //     } else {
    //         if(result.rows.length === 0){
    //             res.send(403).send('username/password invalid');
    //         }else{
    //             var dbString = result.rows[0].password;
    //             var salt = dbString.split('$')[2];
    //             var hashedPassword = hash(password,salt);
    //             if(hashedPassword == dbString){
    //                 req.session.auth = {userId: result.rows[0].id};
    //                 res.send('Creditials correct');    
    //             }else{
    //                 res.send(403).send('username/password invalid');
    //             }
    //         }
    //     }
    // }); do Changes in Mongo DB and Database
});

app.get('/check-login',function(req,res){
    if(req.session && req.session.auth && req.session.auth.userId){
        res.send('you are logged in '+ req.session.auth.userId.toString());
    }else{
        res.send('you are not logged in ');
    }
});

app.get('/logout',function(req,res){
    delete req.session.auth;
    res.send('You are Logout');
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
