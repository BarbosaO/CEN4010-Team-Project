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
var em;

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

app.get("/bestsellers", checkAuthenticated2, (req, res) =>{
	db.collection('Books').find().filter(	
			{AvgReview : {$gte : 4}}
		).toArray(function(err, docs){
	
			res.render("pages/bestsellers.ejs", {docs: docs, user: req.user});
		});
})
app.post("/book_filter", checkAuthenticated2,(req, res) =>{
	var genre = req.body.genre;
	var author = req.body.author;
	var title = req.body.title;
	var rating = req.body.avgReview;
	if(rating == "")
		rating = 0;
	else
		rating = parseInt(req.body.avgReview,10);
	//console.log("Genre " + genre);
	//console.log("Author " + author);
	//console.log("Title " + title);
	//console.log("Rating " + rating);

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

	// second cc info
	var credit_owner2 = req.body.credit_owner2;
	var credit_cvv2 = req.body.credit_cvv2;
	var credit_num2 = req.body.credit_num2;
	var credit_exp_date2 = req.body.credit_exp_date2;

	// third cc info
	var credit_owner3 = req.body.credit_owner3;
	var credit_cvv3 = req.body.credit_cvv3;
	var credit_num3 = req.body.credit_num3;
	var credit_exp_date3 = req.body.credit_exp_date3;

	// shipping info
	var shipaddr = req.body.shipaddr;
	var shipcity = req.body.shipcity;
	var shipstate = req.body.shipstate;
	var shipzip = req.body.shipzip;
	var shipcountry = req.body.shipcountry;

	// second shipping address
	var shipping_addr2 = req.body.shipping_addr2;
	var shipping_city2 = req.body.shipping_city2;
	var shipping_state2 = req.body.shipping_state2;
	var shipping_zip2 = req.body.shipping_zip2;
	var shipping_country2 = req.body.shipping_country2;

	// third shipping address
	var shipping_addr3 = req.body.shipping_addr3;
	var shipping_city3 = req.body.shipping_city3;
	var shipping_state3 = req.body.shipping_state3;
	var shipping_zip3 = req.body.shipping_zip3;
	var shipping_country3 = req.body.shipping_country3;

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
					Exp_Date: expDate,

					Credit_Owner2: credit_owner2,
					CVV2: credit_cvv2,
					Credit_Card2: credit_num2,
					Exp_Date2: credit_exp_date2,

					Credit_Owner3: credit_owner3,
					CVV3: credit_cvv3,
					Credit_Card3: credit_num3,
					Exp_Date3: credit_exp_date3,

					Ship_Address: shipaddr,
					Ship_City: shipcity,
					Ship_State: shipstate,
					Ship_Zip: shipzip,
					Ship_Country: shipcountry,

					Ship_Address2: shipping_addr2,
					Ship_City2: shipping_city2,
					Ship_State2: shipping_state2,
					Ship_Zip2: shipping_zip2,
					Ship_Country2: shipping_country2,

					Ship_Address3: shipping_addr3,
					Ship_City3: shipping_city3,
					Ship_State3: shipping_state3,
					Ship_Zip3: shipping_zip3,
					Ship_Country3: shipping_country3
                });
                res.redirect('/login');
            }
        };
    });
});

// profile page
app.get('/profile', checkAuthenticated, (req, res) => {  
    res.render('pages/profile.ejs', {user: req.user});
});

// edit profile
// TODO
app.get('/editProfile', checkAuthenticated, (req, res) => {  
    res.render('pages/editProfile.ejs', {user: req.user});
});

app.put('/updateProfile', checkAuthenticated, (req, res) => {
	
	user = req.user[0];

	var id = user._id;

	db.collection('User').updateOne({"_id": ObjectId(id)}, {$set: {
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
		Exp_Date: expDate,

		Credit_Owner2: credit_owner2,
		CVV2: credit_cvv2,
		Credit_Card2: credit_num2,
		Exp_Date2: credit_exp_date2,

		Credit_Owner3: credit_owner3,
		CVV3: credit_cvv3,
		Credit_Card3: credit_num3,
		Exp_Date3: credit_exp_date3,

		Ship_Address: shipaddr,
		Ship_City: shipcity,
		Ship_State: shipstate,
		Ship_Zip: shipzip,
		Ship_Country: shipcountry,

		Ship_Address2: shipping_addr2,
		Ship_City2: shipping_city2,
		Ship_State2: shipping_state2,
		Ship_Zip2: shipping_zip2,
		Ship_Country2: shipping_country2,

		Ship_Address3: shipping_addr3,
		Ship_City3: shipping_city3,
		Ship_State3: shipping_state3,
		Ship_Zip3: shipping_zip3,
		Ship_Country3: shipping_country3
	 }
	 }, function (err, result) {
		  if (err) {
		  console.log(err);
		} else {
			console.log("User updated!");
		 }
	});

	//update the logged in user
	db.collection('User').find({"_id": ObjectId(id)}).toArray(function(err, newUser){
        if (err) { console.log(err); }
        else{   
			req.login(newUser[0], function(err) {
				if (err) {
					console.log(err);
					res.render('/pages/editProfile.ejs', {user: req.user, message: "user not updated"});
				}else{
					res.render('pages/editProfile.ejs', {user: req.user, message: "user updated"});
				}
			});
    	}  
	});
});

// SHOPPING CART 
app.get('/cart', checkAuthenticated, (req, res) =>{
	
    db.collection('carts').find({"Email": req.user[0].Email}).toArray(function(err, books)
    {
        if (err) { console.log(err); }
        else{  
           		db.collection('carts').aggregate([
                {$match: {Email: req.user[0].Email}},
                {$group: {_id:0, Subtotal:{$sum: {$multiply: ["$Price", "$qty"]}}}}
                ]).toArray(function(err, price){
					if (err) { console.log(err); }
            		else
            		{
						db.collection('saved').find({"Email": req.user[0].Email}).toArray(function(err, saved)
						{			
							if (err) { console.log(err); }
							else{
								res.render("pages/cart.ejs", {cart: books, user: req.user, total: price, saved: saved});
							}
						});
					}
        		});   
        	}
	});  
});

//increases book qty by one in cart
app.post('/add1', checkAuthenticated, (req,res) => {
    var id = req.body.id;
    var new_qty = parseInt(req.body.qty) + 1;
    
    try{
    db.collection('carts').updateOne({"_id": ObjectId(id)}, {$set: {qty: new_qty}});
    }catch(e)
    {console.log(e);}

    res.redirect('/cart');
});

//decreases book qty by one in cart
app.post('/minus1', checkAuthenticated, (req,res) => {
    var id = req.body.id;
    var new_qty = parseInt(req.body.qty);
    if(new_qty == 1)
    {
        try{
            db.collection('carts').deleteOne({"_id": ObjectId(id)});
        }catch(e){
            console.log(e);
        }
        
        res.redirect('/cart');
    }

    else{
        new_qty -= 1;
        try{
            db.collection('carts').updateOne({"_id": ObjectId(id)}, {$set: {qty: new_qty}});
            }catch(e)
            {console.log(e);}
        
            res.redirect('/cart');
    }
});

//deletes book from cart
app.delete('/deleteCart', checkAuthenticated, (req,res) => {
    var id = req.body.id;
    
    try{
        db.collection('carts').deleteOne({"_id": ObjectId(id)});
    }catch(e){
        console.log(e);
    }
    
    res.redirect('/cart');
});

//add book to cart from booklist
app.post('/AddToCart', checkAuthenticated, (req,res) =>
{
	var bookTitle = req.body.title;
	var bookAuth = req.body.author;
	var bookDescr = req.body.descr;
	var bookPrice = parseFloat(req.body.price);
	var bookCover = req.body.cover;
	var qty = 1;
	try{
		db.collection('carts').insertOne({
			Email: req.user[0].Email,
			Title: bookTitle,
			Author: bookAuth,
			Description: bookDescr,
			Price: bookPrice,
			Cover: bookCover,
			qty: qty
		});

		}catch(e){
			console.log(e);
		}

		res.redirect('/booklist');
          
});

//add book to save for later list from cart
app.post('/AddToSaved', checkAuthenticated, (req,res) =>
{   
	var id = req.body.id;
	var bookTitle = req.body.title;
	var bookPrice = parseFloat(req.body.price);
	var bookCover = req.body.cover;

	try{
		db.collection('carts').deleteOne({"_id": ObjectId(id)});
	}catch(e){
		console.log(e);
	}

	try{
		
			db.collection('saved').insertOne({
				Email: req.user[0].Email,
				Title: bookTitle,
				Price: bookPrice,
				Cover: bookCover,
			});

		}catch(e){
			console.log(e);
		}

		res.redirect('/cart');
          
});

//BOOK DETAILS
app.get("/bookDetails/:id", checkAuthenticated2, function(req,res){
	var bookId = req.params.id;

	//find reviews, and send them to the page
	db.collection('Reviews').find({BookId:bookId}).toArray(function(err, reviews){
		if (err) {console.log(err); }
		else {
			// find the book details
			db.collection('Books').find({_id: ObjectId(bookId)}).toArray(function(err, book){
				if(req.user){ //if user logged in
					var userId = req.user[0]._id
					db.collection('Purchased').find({book:bookId, user: userId}).toArray(function(err, purchased){
						if (err) { console.log(err); }
						else {
							if(purchased.length == 0){
								//user did not buy book
								//render page with no review form
								res.render("pages/bookDetails.ejs", {reviews: reviews, book: book[0], user: req.user, bookId:bookId, purchased:false});
							}else{
								//user did buy book
								//render page with review form(if user has not already left a review)
								db.collection('Reviews').find({BookId:bookId, UserId: userId}).toArray(function(err, reviewsByUser){
								    if (err) { console.log(err); }
									else {
										if(reviewsByUser.length > 0){
											res.render("pages/bookDetails.ejs", {reviews: reviews, book: book[0], user: req.user, bookId:bookId, purchased:false});
										}else{
											res.render("pages/bookDetails.ejs", {reviews: reviews, book: book[0], user: req.user, nickname:req.user[0].Nickname, bookId:bookId, purchased:true});
										}
									}
								});
							}	
						}  
					});
				}else{
					res.render("pages/bookDetails.ejs", {reviews: reviews, book: book[0], bookId:bookId, purchased:false});
				}
			});
		}
	});
});

//review post
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

	var averageReview = 0;
	//find reviews
	db.collection('Reviews').find({"BookId":bookId}).toArray(function(err, reviews){
		if (err) { console.log(err); }
		else {
			var i = 0;
			var sum = 0;
			for(i = 0; i < reviews.length; i++){
			if(reviews[i].Rating == "")
				sum = sum + 0;
			else
				sum = sum + parseInt(reviews[i].Rating, 10);
			}
			if(reviews.length != 0)
			averageReview = sum / reviews.length;

			//update book rating field
			db.collection('Books').updateOne({"_id": ObjectId(bookId)}, {$set: {AvgReview: averageReview}
				}, function (err, result) {
						if (err) { console.log(err)}
				}
			);
		};
	}); 

    res.redirect('/bookDetails/' + bookId);
});

// AUTHOR
app.get('/author/:id', checkAuthenticated, function(req, res){

	if(req.user){

		AuthorId = req.params.id
		//console.log("id: " + AuthorId);
		db.collection('Authors').find({_id: ObjectId(AuthorId)}).toArray(function(err, author)
		{
			if (err) { console.log(err); }
			else{   
				res.render("pages/author.ejs", {author: author, user: req.user});
			}
		});  
	}
	else{
		AuthorId = req.params.id
		//console.log("id: " + AuthorId);
		db.collection('Authors').find({_id: ObjectId(AuthorId)}).toArray(function(err, author)
		{
			if (err) { console.log(err); }
			else{   
				res.render("pages/author.ejs", {author: author, user: req.user});
			}
		});  
	}
});

//log out
app.delete('/logout', function(req, res){
    req.logOut();
	res.redirect('/login');
	//em = "";
});


//PASSPORT FUNCTIONS
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login');
    }
}

//for home page,shopping cart user doesnt have to be logged in
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
				//em = email;// when user is logged in saves the email, used is cart.

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
    app.listen(3000, "localhost", function(){
        console.log("Listening on port 3000...")
    });

});
