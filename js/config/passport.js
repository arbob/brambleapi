//passport.js configration file
var LocalStrategy   = require('passport-local').Strategy;//load local strategy to creat local strategy for authentication
var User = require('../model/user');//use moogoose

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {//for creating sessions for users
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {//for deleting sessions for users
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //local signup function
	passport.use('signup', new LocalStrategy({
	        usernameField : 'email',
	        passwordField : 'password',
	        passReqToCallback : true
	    },
	    function(req, email, password, done) {

		        // User.findOne wont fire unless data is sent back
		        process.nextTick(function() {

		        User.findOne({ 'local.email' :  email }, function(err, user) {//find whether the email is in the database
		            if (err)
		                return done(err);

		            if (user) {//if there is
		                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
		            } else {
		                var newUser = new User();//create new user in database
		                newUser.local.email = email;
		                newUser.local.password = newUser.generateHash(password);

		                newUser.save(function(err) {
		                    if (err)
		                        throw err;
		                    return done(null, newUser);
		                });
		            }

		        });    
	        });

	}));

	//local login function
    passport.use('login', new LocalStrategy({
	        usernameField : 'email',
	        passwordField : 'password',
	        passReqToCallback : true
	    },
	    function(req, email, password, done) {
	        User.findOne({ 'local.email' :  email }, function(err, user) {
	            if (err)
	                return done(err);
	            if (!user)
	                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
	           	var newUser = new User();
	            if (!user.validPassword(password))
	                return done(null, false, req.flash('loginMessage', 'Sorry, Wrong password.')); // create the loginMessage and save it to session as flashdata
	            return done(null, user);
	        });	    	
	    }));
}