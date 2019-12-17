var mongoose = require('mongoose');
// define the schema for our user model
var contactSchema = mongoose.Schema({
        name    : String,
        email : String,
        message: String
});

// create the model and expose it to our app
module.exports = mongoose.model('Contact', contactSchema);