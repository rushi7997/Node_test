var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();

mongoose.connect('mongodb://localhost/node_test');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended : true}));

var testSchema = new mongoose.Schema({
    title : String,
    author : String,
    article : String,
    created : {
        type: Date,
        default: Date.now
    }
});
var Test = mongoose.model('Test', testSchema);

// Test.create({
//     title: 'article 1',
//     author : 'author 1',
//     article : 'This is the article for author 1 named article 1'
// });

app.get('/',function(req, res){
    res.redirect('/articles');
});

app.get('/articles', function (req, res) {
    Test.find({}, function (err, article) {
        if (err) {
            console.log("Error!!!");
        } else {
            res.render('index', { article: article });
        }
    });
});

app.get('/articles/new',function(req, res){
    res.render('new');
});

app.post('/articles',function(req, res){
    Test.create(req.body.article,function(err,newArticle){
        if(err){
            console.log("ERROR");
        }else{
            res.redirect('/articles');
        }
    })
});


app.listen(3000,function(){
    console.log('server is started at port 3000!!!');
});