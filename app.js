var express = require("express");
var app = express();
var path = require("path");

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