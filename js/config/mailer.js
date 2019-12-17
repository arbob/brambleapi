var nodemailer = require('nodemailer');

//smtp setting for email
var smtpConfig = {
//in the office 365 mail settings, the host is smtp.office365.com, but it is not working	
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'rahul.soshte47@gmail.com',
        pass: 'Rahul123#'//write your password here
    }
};

module.exports = {
	transporter :nodemailer.createTransport(smtpConfig)
}