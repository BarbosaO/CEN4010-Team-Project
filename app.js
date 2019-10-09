var express = require("express");
var app = express();
var path = require("path");
var MongoClient = require('mongodb').MongoClient;

//npm install request - for making http calls
//var request = require("request");

app.use(express.static(path.join(__dirname, '/views')));
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
app.get("/", function(req, res){
    res.render('pages/index.ejs');
});

// Server
app.listen(3000, "localhost", function(){
    console.log("Listening on port 3000...")
})

MongoClient.connect("mongodb+srv://test1:test1@cluster0-jdush.azure.mongodb.net/test", function (err, db) {
   
     if(err) throw err;
     else console.log('connected to database');

     //Write databse Insert/Update/Query code here..
                
});