var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override');
var app = express();

mongoose.connect('mongodb://localhost/node_test');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride('_method'));

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
//index route
app.get('/articles', function (req, res) {
    Test.find({}, function (err, article) {
        if (err) {
            console.log("Error!!!");
        } else {
            res.render('index', { article: article });
        }
    });
});
//new route
app.get('/articles/new',function(req, res){
    res.render('new');
});
//create route
app.post('/articles',function(req, res){
    Test.create(req.body.article,function(err,newArticle){
        if(err){
            console.log("ERROR");
        }else{
            res.redirect('/articles');
        }
    })  
});
//show route
app.get('/articles/:id',function(req, res){
    Test.findById(req.params.id,function(err, foundArticle){
        if(err){
            console.log('Error');
        }else{
            res.render('show',{article : foundArticle});
        }
    });
});
//edit route
app.get('/articles/:id/edit',function(req, res){
    Test.findById(req.params.id,function(err, foundArticle) {
        if(err){
            console.log('error');
        }else{
            res.render('edit',{article : foundArticle});
        }        
    });
});
//update route
app.put('/articles/:id',function(req, res){
    Test.findByIdAndUpdate(req.params.id,req.body.article,function(err, updatedArticle) {
        if(err){
            console.log('Error!');
        } else{
            res.redirect('/articles/'+req.params.id);
        }       
    });
});
//delete route
app.delete('/articles/:id',function(req, res){
    Test.findByIdAndRemove(req.params.id,function(err){
        if (err) {
            console.log('error');
        } else {
            res.redirect('/articles');
        }
    });
});

app.listen(3000,function(){
    console.log('server is started at port 3000!!!');
});