var express = require("express");
var app = express();
var path = require("path");
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
var db;

//npm install request - for making http calls
//var request = require("request");

app.use(express.static(path.join(__dirname, '/views')));
app.use(bodyParser.urlencoded({extended: true}))

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render('pages/index.ejs');
});

app.get("/review", function(req, res){
    res.render('pages/review.ejs');
});

app.get('/reviewsList', function(req, res){
    db.collection('Reviews').find({}).toArray(function(err, reviews){
        if (err) { console.log(err); }
        else {
            //console.log(reviews);
            res.render("pages/reviewsList.ejs", {reviews: reviews});  
        };
    });
});

app.post('/submitReview', (req,res) => {
    var comment = req.body.comment;
    var rating = req.body.rating;
    var date = req.body.date;
    var anonymous = false;

    console.log(date);

    if (req.body.anonymous == 'on'){
        anonymous = true;
    }

    //insert 
    db.collection('Reviews').insertOne({
        BookId: "d8a9e774a8e050c38420630",
        UserId: 1,
        Date: date,
        Rating: rating,
        Comment: comment,
        Anonymous: anonymous
    });

    res.render('pages/review.ejs');
});

var dbConnection = MongoClient.connect("mongodb+srv://test1:test1@cluster0-jdush.azure.mongodb.net/test", function (err, client) {

    db = client.db("Test1");
    if(err) 
        return console.log(err);
    else 
        console.log('connected to database');

    // Server
    app.listen(3001, "localhost", function(){
        console.log("Listening on port 3001...")
    });

});