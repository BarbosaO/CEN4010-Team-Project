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
//BOOK LIST
app.get("/", (req,res) => {
    res.redirect('/bookList');
})

app.get("/bookList", checkAuthenticated2, (req, res) => {
    //This line below gets all items in the Test collection, can filter it with input in the find({*filter elements*}) part
	db.collection('Books').find({}).toArray(function(err, docs) {
		//Print the documents returned on console in this commented 3 line part
			//docs.forEach(function(doc) {
			//console.log(doc.Title);
			//});
		//Next line sends the list of items from collection accessed to the render
		res.render("pages/bookList.ejs", {docs: docs, user: req.user});
	});
	//Declare success
	//console.log("Called find()");
});

app.post("/book_filter", checkAuthenticated2,(req, res) =>{
	var genre = req.body.genre;
	var author = req.body.author;
	var title = req.body.title;
	var rating = req.body.avgReview;
	if(rating == "")
		rating = 0;
	else
		rating = parseInt(req.body.avgReview,10);
	console.log("Genre " + genre);
	console.log("Author " + author);
	console.log("Title " + title);
	console.log("Rating " + rating);

	//Sends the list of items from collection accessed to the render
	//Uses '$or' and '$and' to display all results that match one of the fields without doubling up results
	if(genre == "" && author == "" && title == "")
	{
		db.collection('Books').find().filter(	
			{AvgReview : {$gte : rating}}
		).toArray(function(err, docs){
	
			res.render("pages/bookList.ejs", {docs: docs, user: req.user});
		});
	}
	else if(genre == "" && author == "")
	{
		db.collection('Books').find().filter(
			{	$and :	
				[
					{$and : [
						{ Title : title}
					]},
					{$and : [ {AvgReview : {$gte : rating}}]}
				]
			}
		).toArray(function(err, docs){
	
			res.render("pages/bookList.ejs", {docs: docs, user: req.user});
		});
	}
	else if(genre == "" && title == "")
	{
		db.collection('Books').find().filter(
			{	$and :	
				[
					{$and : [
						{ Author : author}
					]},
					{$and : [ {AvgReview : {$gte : rating}}]}
				]
			}
		).toArray(function(err, docs){
	
			res.render("pages/bookList.ejs", {docs: docs, user: req.user});
		});
	}
	else if(author == "" && title == "")
	{
		db.collection('Books').find().filter(
			{	$and :	
				[
					{$and : [
						{ Genre : genre}
					]},
					{$and : [ {AvgReview : {$gte : rating}}]}
				]
			}
		).toArray(function(err, docs){
	
			res.render("pages/bookList.ejs", {docs: docs, user: req.user});
		});
	}
	else if(title == "")
	{
		db.collection('Books').find().filter(
			{	$and :	
				[
					{$and : [
						{ Author : author}, 
						{ Genre : genre}
					]},
					{$and : [ {AvgReview : {$gte : rating}}]}
				]
			}
		).toArray(function(err, docs){
	
			res.render("pages/bookList.ejs", {docs: docs, user: req.user});
		});
	}
		else if(genre == "")
	{
		db.collection('Books').find().filter(
			{	$and :	
				[
					{$and : [
						{ Title : title},
						{ Author : author},
					]},
					{$and : [ {AvgReview : {$gte : rating}}]}
				]
			}
		).toArray(function(err, docs){
	
			res.render("pages/bookList.ejs", {docs: docs, user: req.user});
		});
	}
		else if(author == "")
	{
		db.collection('Books').find().filter(
			{	$and :	
				[
					{$and : [
						{ Title : title},
						{ Genre : genre}
					]},
					{$and : [ {AvgReview : {$gte : rating}}]}
				]
			}
		).toArray(function(err, docs){
	
			res.render("pages/bookList.ejs", {docs: docs, user: req.user});
		});
	}
	else
	{
		db.collection('Books').find().filter(
			{	$and :	
				[
					{$and : [
						{ Title : title},
						{ Author : author}, 
						{ Genre : genre}
					]},
					{$and : [ {AvgReview : {$gte : rating}}]}
				]
			}
		).toArray(function(err, docs){
	
			res.render("pages/bookList.ejs", {docs: docs, user: req.user});
		});
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
	// login credentials
	var email = req.body.email;
	var password = req.body.password;

	// personal info
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var homeaddr = req.body.homeaddr;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var country = req.body.country;

	// nickname 
	var nickname = req.body.nickname;

	// cc info
	var creditOwner = req.body.creditOwner;
	var cvv = req.body.cvv;
	var creditCard = req.body.creditCard;
	var expDate = req.body.expDate;

	// shipping info
	// var shipaddr = req.body.shipaddr;
	// var shipcity = req.body.shipcity;
	// var shipstate = req.body.shipstate;
	// var shipzip = req.body.shipzip;
	// var shipcountry = req.body.shipcountry;

    db.collection('User').find({"Email": email}).toArray(function(err, user){
        if (err) { console.log(err); }
        else{
            var emailFound = user[0];
            if(emailFound){
                res.render('pages/register.ejs', {message: 'User with this email already exists.'});
            }else{
                // insert user profile into the database
                db.collection('User').insertOne({
					Email: email,
					Password: password,
					First_Name: firstname,
					Last_Name: lastname,
					Home_Address: homeaddr,
					Home_City: city,
					Home_State: state,
					Home_Zip: zip,
					Home_Country: country,
					Nickname: nickname,
					Credit_Owner: creditOwner,
					CVV: cvv,
					Credit_Card: creditCard,
					Exp_Date: expDate
					// Ship_Address: shipaddr,
					// Ship_City: shipcity,
					// Ship_State: state,
					// Ship_Zip: zip,
					// Ship_Country: country
                });
                res.redirect('/login');
            }
        };
    });
});

// TODO: EDIT PROFILE

// app.get('/pages/editProfile/:id', (req, res) => {    
// 	// var id = req.params.id;
// 	// var o_id = new ObjectId(id);
// 	// db.collection('User').find({_id:o_id}).toArray((err, result) => {
// 	//    if (err) return console.log(err)
// 	//    console.log(result);
// 	//    res.render('pages/editProfile.ejs',{User: result});  
// 	// });
// 	// console.log(req.params.id);

// 	const requestId = req.params.id
// 	let userInfo = user.filter(userInfo => {
// 		return userInfo.id == requestId;
// 	});

// 	if (!userInfo) {
// 		res.status(404).json({ message: 'No email found'});
// 	}

// 	response.json(userInfo[0]);
	
// });

app.get("/editProfile", checkNotAuthenticated, function(req, res){
    res.render('pages/editProfile.ejs', {message: null});
});
	
// app.post('/pages/editProfile',(req, res) => {
// // 	 db.collection('User').updateOne({ _id: ObjectId(req.body._id) }, {$set: {
// // 		username: req.body.username,
// // 		//description: req.body.description
// // 	 }
// // 	 }, function (err, result) {
// // 		  if (err) {
// // 		  console.log(err);
// // 		} else {
// // 		 console.log("Post Updated successfully");
// // 		 res.redirect('pages/editProfile.ejs');
// // 	 }
// // });

// 	const userInfo = {
// 		email: req.body.email
// 	}

// 	user.push(userInfo);
// 	res.json(userInfo)
// });

// app.post('/pages/editProfile/:id',(req, res) => {
// 	const requestId = req.params.id;

// 	let userInfo = user.filter(userInfo => {
// 		return userInfo.id == requestId;
// 	})[0];

// 	const index = user.indexOf(userInfo);

// 	const keys = Object.keys(req.body);

// 	keys.forEach(key => {
// 		userInfo[key] = req.body[key];
// 	});
// 	user[index] = userInfo;

// 	res.json(user[index]);
// });

//SHOPPING CART
app.get('/cart', checkAuthenticated, function(req, res){
    db.collection('carts').find({User:req.user[0].email}).toArray(function(err, books)
    {
        if (err) { console.log(err); }
        else{   
            res.render("pages/cart.ejs", {cart: books, user: req.user});
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

//BOOK DETAILS
app.get("/bookDetails/:id", checkAuthenticated2, function(req,res){
    bookId = req.params.id
    if(req.user){ //if user logged in
        userId = req.user[0]._id
        //db query to check if user has bought book
        db.collection('Purchased').find({book:bookId, user: userId}).toArray(function(err, reviews){
            if (err) { 
                console.log(err); 
                //user did not buy book
                //render page with no review form

                //find reviews, and send them to the page
                db.collection('Reviews').find({BookId:bookId}).toArray(function(err, reviews){
                    if (err) { console.log(err); }
                    else {
                        //console.log(reviews);
                        res.render("pages/bookDetails2.ejs", {reviews: reviews, user: req.user, bookId:bookId});  
                    };
                });
            }
            else {
                //user has bought book
                //render page with review form

                //find reviews, and send them to the page
                db.collection('Reviews').find({BookId:bookId}).toArray(function(err, reviews){
                    if (err) { console.log(err); }
                    else {
                        //console.log(reviews);
                        res.render("pages/bookDetails1.ejs", {email: req.user[0].Email, reviews: reviews, user: req.user, bookId:bookId});  
                    };
                }); 
            };
        });
    }else{
        //find reviews, and send them to the page
        db.collection('Reviews').find({BookId:bookId}).toArray(function(err, reviews){
            if (err) { console.log(err); }
            else {
                res.render("pages/bookDetails2.ejs", {reviews: reviews, bookId: bookId});  
            };
        });
    }
});

app.post('/submitReview/:id', checkAuthenticated, (req,res) => {
    var comment = req.body.comment;
    var rating = req.body.rating;
    var date = req.body.date;
    var anonymous = false;
    var bookId = req.params.id;

    if (req.body.anonymous == 'on'){
        anonymous = true;
    }

    //insert 
    db.collection('Reviews').insertOne({
        //TODO: get bookid from book details page
        BookId: bookId,
        UserId: req.user[0]._id,
        Nickname: req.user[0].Nickname,
        Date: date,
        Rating: rating,
        Comment: comment,
        Anonymous: anonymous
    });

    //TODO: update book rating field

    res.redirect('/bookDetails/' + bookId);
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

//for home page,(and maybe shopping cart) user doesnt have to be logged in
function checkAuthenticated2(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return next();
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
