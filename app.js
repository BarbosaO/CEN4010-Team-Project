var express = require("express");
var app = express();
var path = require("path");
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://aagui:pw@cluster0-jdush.azure.mongodb.net/test";
var db;
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

//Connecting to database
MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) 
{
	//Verify connection
	assert.equal(null, err);
	//Declare success
	console.log("Successfully connected to server");
	db = client.db('Test1');

});

//This line sets up url for this section .../booksList
app.get('/booksList', function(req, res){
	//This ling below gets all items in the Test collection, can filter it with input in the find({*filter elements*}) part
	db.collection('Test').find({Author: "John Doe"}).toArray(function(err, docs) {
		//Print the documents returned on console in this commented 3 line part
			//docs.forEach(function(doc) {
			//console.log(doc.Title);
			//});
		//Next line sends the list of items from collection accessed to the render
		res.render("pages/bookList.ejs", {docs: docs});
	});
});
/*
app.post('/booksListSort', function(req, res){
	var genre = req.body.book_genre;

	db.collection("Test").find({Genre: genre}).toArray(function(err, docs){
		res.render("pages/bookList.ejs", {docs: docs});
	});
});
*/
 