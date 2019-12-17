var mailer = require('./config/mailer.js');
var User = require('./model/user');
var Contact = require('./model/contact')
const Web3 = require('web3');
const web3utils = require('web3-utils');
const web3eth = require('web3-eth');
var transporter = mailer.transporter;
var host, signup_id = 0, reset_id = 0;
var email, password;
var email_reset;
var web3provider = "https://kovan.infura.io/v3/07b6050680014541860ede962a2489c8";
var web3 = new Web3(new Web3.providers.HttpProvider(web3provider));
// web3.setProvider(new web3.providers.HttpProvider(web3provider));

module.exports = function(app, passport){

	app.get('/', function(req, res){
		res.render('login.ejs', { message_type:"danger" ,message: req.flash("loginMessage") }); 
	});

	app.get('/login', function(req, res){
		res.render('login.ejs', { message_type:"danger" ,message: req.flash("loginMessage") }); 
	});	

	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message_type:"danger" ,message:req.flash("signupMessage") }); 
	});	

	app.post('/login', passport.authenticate('login', {//use the method created in passport.js
		successRedirect : '/index', 
		failureRedirect : '/login', 
		failureFlash : true
	}));

	// process the signup form
	app.post('/signup', function(req, res){
		email = req.body.email;
		password = req.body.password;

		User.findOne({ 'local.email' : email }, function(err, user) {

            if (user) {
            	// console.log("taken");
                res.render('signup.ejs', {  message_type:"error", message: "The email address has already been taken." });

            } else {

            	res.render('login.ejs', {  message_type:"info", message: "Please check your email for verification" });

			    signup_id=Math.floor((Math.random() * 100) + 54);
			    host=req.get('host');
			    signup_link="http://"+req.get('host')+"/verify?id="+signup_id;
			    
				var mailOptions = {
				    from: '"Bramble" <albert.yuebai@pilotfish.eu>', // sender address
				    to: email, // list of receivers
				    subject: 'Please Confirm your Signup', // Subject line
				    text: 'If you are sure to signup, please click this link', // plaintext body
				    html: 'Hello,<br> Please Click on the link to verify your email.<br><a href='+signup_link+'>Click here to verify</a>' // html body
				};

				// console.log(email);
				// // send mail with defined transport object
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				    	console.log("error");
				        return console.log(error);
				    }
				    console.log('Message sent: ' + info.response);
				});	
				console.log("end");

            }
        });
	});

	app.get('/verify', function(req, res){
	//save the data to database

		if(signup_id == req.query.id){

	        var newUser = new User();

	        var account = web3.eth.accounts.create();
	        newUser.local.email    = email;
	        newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
	        newUser.wallet.private_key = account.privateKey;
	        newUser.wallet.address = account.address;
	        

	        newUser.save(function(err) {
	            if (err)
	                throw err;
	        });
	        res.render('login.ejs', { message_type:"success", message: "Sign up succeed!" });

		}else{
			res.render('login.ejs', { message_type:"danger", message: "Sorry, please try again." });

		}

	});

	app.get('/forget', function(req, res) {
		res.render('forget.ejs', {message:"",message_type:""});
	});

	app.post('/forget', function(req, res){
		var email = req.body.email;
		email_reset = email;

		User.findOne({ 'local.email' : email }, function(err, user) {
            if (user) {
            	res.render('login.ejs', {  message_type:"info", message: "Please check your email for verification" });

			    reset_id=Math.floor((Math.random() * 100) + 54);
			    host=req.get('host');
			    link="http://"+req.get('host')+"/reset?id="+reset_id;
			    
				var mailOptions = {
				    from: '"Bramble" <albert.yuebai@pilotfish.eu>', // sender address
				    to: email_reset, // list of receivers
				    subject: 'Please Confirm your Email to Reset Password for Moog Online Guideline Account', // Subject line
				    text: 'If you are sure to signup, please click this link', // plaintext body
				    html: 'Hello,<br> Please Click on the link to verify your email.<br><a href='+link+'>Click here to verify</a>' // html body
				};

				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        return console.log(error);
				    }
				    console.log('Message sent: ' + info.response);
				});	
                

            } else { //if the email is not in the list
            	res.render('forget.ejs', {  message_type:"error", message: "Sorry, we can't find this email address." });
            }
        });
	});

	app.get('/reset', function(req, res) {
		if(reset_id == req.query.id){
			res.render('reset.ejs', {message:"",message_type:""});
		}else{
			res.render('login.ejs', {message_type:"danger", message: "Sorry, please try again.." });
		}	
	});



	app.post('/reset', function(req, res){

		var password = req.body.password;
		var password_1 = req.body.password_1;
		var newUser = new User();
		
		if(password != password_1){
			res.render('reset.ejs', {message_type:"error", message: "The passwords are not the same." });
		}else{
	        var conditions = { "local.email": email_reset }
			  , update = {local: {email: email_reset,password:newUser.generateHash(password)} }
			  , options = { multi: true };

			User.update(conditions, update, options, callback);

			function callback (err, numAffected) {
			  console.log(numAffected + " line have been affected");
			};
	        res.render('login.ejs', {message_type:"success", message: "The new password has been set." });
		}
	});	




	app.get('/index', isLoggedIn, function(req, res){
		// console.log(req.user.local.email);
		// var privateKey = web3.eth.accounts.create().privateKey.substr(2);
	        // var publicAddr = "";
	        // set the user's local credentials
	    
	    // console.log(account.privateKey);

	    // console.log()
		res.render('index.ejs', {
			user : req.user
		});
		


	});	

	app.post('/contact',function(req, res){
		var newContact = new Contact();
		newContact.name = req.body.name;
		newContact.email = req.body.email;
		newContact.message = req.body.message;

		 newContact.save(function(err) {
	            if (err)
	                throw err;
	        });
	     res.json('done');
	});

	function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		res.redirect('/');
	}



}