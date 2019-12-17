var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
	local:{
        email    : String,
        password : String,
    },
    wallet:{
    	address: String,
    	private_key: String,
    	bramble_real: {type: Number, default: 1},
    	bramble_crypto: {type: Number, default: 0},
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model and expose it to our app
module.exports = mongoose.model('User', userSchema);