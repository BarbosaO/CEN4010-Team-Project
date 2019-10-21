var express = require("express");
var app = express();
var session = require("express-session");
var passport = require('passport');
var path = require("path");
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('express-flash');
var ObjectId = require('mongodb').ObjectID;
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



//ROUTES
app.get("/", (req, res) => {
    if(req.isAuthenticated()){
        res.render('pages/index.ejs', {user: req.user});
    }else{
        res.render('pages/index.ejs');
    }
});

//LOGIN AND REGISTER
//WE DONT WANT AUTHENTICATED USERS TO GO TO THE REGISTER OR LOG IN PAGE SO CHECKNOTAUTHENTICATED
app.get("/register", checkNotAuthenticated, function(req, res){
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
    var nickname = req.body.nickname;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var creditCard = req.body.creditCard;

    db.collection('User').find({"Email": email}).toArray(function(err, user){
        if (err) { console.log(err); }
        else{
            var emailFound = user[0];
            if(emailFound){
                res.render('pages/register.ejs', {message: 'User with this email already exists.'});
            }else{
                // insert user profile into the database
                db.collection('User').insertOne({
                    Nickname: nickname,
                    First_Name: firstname,
                    Last_Name: lastname,
                    Email: email,
                    Password: password,
                    Credit_Card: creditCard
                });
                res.redirect('/login');
            }
        };
    });
});

//SHOPPING CART
app.get('/cart', checkAuthenticated, function(req, res){
    db.collection('carts').find({User:req.user[0].email}).toArray(function(err, books)
    {
        if (err) { console.log(err); }
        else{   
            res.render("pages/cart.ejs", {cart: books, user: req.user[0].email});
        }
    });  
});

//TODO
app.post('/add1', checkAuthenticated, (req,res) => {
    var id = req.body.id;
    var new_qty = req.body.new_qty;

    //insert 
    db.collection('carts').update({_id: id}, {$set: {qty: new_qty}});

    res.render('pages/cart.ejs');
});

app.delete('/deleteCart', checkAuthenticated, (req,res) => {
    var id = req.body.id;
    
    try{
        db.collection('carts').deleteOne({"_id": ObjectId(id)});
    }catch(e){
        console.log(e);
    }
    
    res.redirect('/cart');
});

//BOOK LIST
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
	//Declare success
	console.log("Called find()");
 });

//REVIEWS
app.get("/review", checkAuthenticated, function(req, res){
    res.render('pages/review.ejs', {email: req.user[0].Email, user: req.user});
});

app.get('/reviewsList', checkAuthenticated, function(req, res){
    db.collection('Reviews').find({}).toArray(function(err, reviews){
        if (err) { console.log(err); }
        else {
            //console.log(reviews);
            res.render("pages/reviewsList.ejs", {reviews: reviews, user: req.user});  
        };
    });
});

app.post('/submitReview', checkAuthenticated, (req,res) => {
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


//PASSPORT FUNCTIONS
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

//SERVER AND DATABASE 
var dbConnection = MongoClient.connect("mongodb+srv://test1:test1@cluster0-jdush.azure.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true  }, function (err, client) {

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
