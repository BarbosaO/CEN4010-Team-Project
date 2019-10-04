var express = require("express");
var app = express();
var path = require("path");
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

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

app.post('/submitReview', (req,res) => {
    var comment = req.body.comment;
    var rating = req.body.rating;
    var anonymous = false;
    
    if (req.body.anonymous == 'on'){
        anonymous = true;
    }

    res.redirect('/review');
});

// Server
app.listen(3000, "localhost", function(){
    console.log("Listening on port 3000...")
})

MongoClient.connect("mongodb+srv://test1:test1@cluster0-jdush.azure.mongodb.net/test", function (err, client) {
   
    if(err) throw err;
    else console.log('connected to database');

    const db = client.db("Test1");

    // db.collection('Reviews').insertOne({
    //     BookId: "d8a9e774a8e050c38420630",
    //     UserId: 1,
    //     Rating: 5,
    //     Comment: "I love this book!",
    //     Anonymous: false
    // });

    //db.close();
});