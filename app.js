var express = require("express");
var app = express();
var session = require("express-session");
var passport = require('passport');
var path = require("path");
var MongoClient = require('mongodb').MongoClient;
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('express-flash');
var db;

initialize(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, '/views')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method')); // for delete and put requests

app.get("/", function(req, res){
    res.render('pages/index.ejs');
});

app.get("/cart", function(req, res){
    res.render('pages/cart.ejs');
});

app.get("/review", function(req, res){
    res.render('pages/review.ejs');
});

app.get("/login", function(req, res){
    res.render('pages/login.ejs');
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

app.get("/register", checkNotAuthenticated, function(req, res)
{
    res.render('pages/register.ejs', {message: null});
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('pages/login.ejs')
});

app.post("/login", checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

app.post("/register", (req, res) =>{
    var email = req.body.email;
    var password = req.body.password;

    db.collection('User').find({"Email": email}).toArray(function(err, user){
        if (err) { console.log(err); }
        else {
            var userFound = user[0];
            if(userFound){
                res.render('pages/register.ejs', {message: 'User with this email already exists.'});
            }else{
                db.collection('User').insertOne({
                    Email: email,
                    Password: password
                });
                res.redirect('/login');
            }
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

app.delete('/logout', function(req, res){
    req.logOut()
    res.redirect('/login')
});

var dbConnection = MongoClient.connect("mongodb+srv://test1:test1@cluster0-jdush.azure.mongodb.net/test",{ useNewUrlParser: true, useUnifiedTopology: true  }, function (err, client) {

    db = client.db("Test1");
    if(err) 
        return console.log(err);
    else 
        console.log('connected to database');

    // Server
    app.listen(3000, "localhost", function(){
        console.log("Listening on port 3000...")
    });

});

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login');
    }
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }else{
        next();
    }
}

function initialize(passport){
    const authenticateUser = (email, password, done) => {

            db.collection('User').find({"Email": email}).toArray(function(err, user){
                if (err) { console.log(err); }
                else {
                    var userFound = user[0];

                    if(userFound == null){
                        return done(null, false, {message: 'No user found with that email.'})
                    }
        
                    if(password.localeCompare(userFound.Password) == 0){ //equal
                        return done(null, user)
                    }else{
                        return done(null, false, {message: 'Password incorrect'})
                    }
                };
            });
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))
}
