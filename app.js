var express = require("express");
var app = express();
var path = require("path");
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://aagui:pw@cluster0-jdush.azure.mongodb.net/test";
//npm install request - for making http calls
//var request = require("request");

app.use(express.static(path.join(__dirname, '/views')));
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
app.get("/", function(req, res){
    res.render('pages/index.ejs');
});

// Server
app.timeout = 0;
app.listen(3000, "localhost", function(){
    console.log("Listening on port 3000...")
})

MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) 
{
	assert.equal(null, err);
	console.log("Successfully connected to server");
	var db = client.db('Test1');
	// Find some documents in our collection
	// Right now set to select books with Author: "John Doe" for testing
	app.get('/booksList', function(req, res){
		db.collection('Test').find({}).toArray(function(err, docs) {
			// Print the documents returned
			//docs.forEach(function(doc) {
			//console.log(doc.Title);
			res.render("pages/bookList.ejs", {docs: docs});
			//});
		// Close the DB
			client.close();
		});
	});
	// Declare success
	console.log("Called find()");
 });
 