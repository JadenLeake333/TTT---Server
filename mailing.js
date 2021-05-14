var dotenv = require('dotenv'); // Environment Variables
var nodemailer = require('nodemailer'); // SMTP Mailing
class mailing{
  constructor(){
  this.email = 'thankfoodfreshness@gmail.com'
  this.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: this.email,
      pass: process.env.EMAILPASS
    }
  });
  }

  recoverAccount(recipient,hash){
    var mailOptions = {
      from: this.email,
      to: recipient,
      subject: 'Password Recovery',
      html: "Click here to change your password: https://TTT-Server.jadenleake.repl.co/reset?q="+hash+"<br>If you did not request this email, you may ignore it."
    };
    this.transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  expirationReminder(recipient,products){
    var text = '<br>';
    for(var i = 0; i < products.length; i++){
      text += products[i].PRODUCT+":"+products[i].EXPIRATION+"<br><br>"
    }
    var mailOptions = {
      from: this.email,
      to: recipient,
      subject: 'Food Freshness Reminder!',
      html: "These products are going to expire!:"+text
    };
    this.transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}

module.exports = {
  mailing
};