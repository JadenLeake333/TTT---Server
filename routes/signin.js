const express = require('express');

const multer = require('multer');
const sqlite3 = require('sqlite3').verbose(); // Database
var bodyParser = require('body-parser'); // Reading JSON
var cors = require('cors'); // Stuff like DELETE and PUT requests
const bcrypt = require('bcrypt'); // Encryption
const url = require('url'); // Get URL
const querystring = require('querystring'); // Get Query

const app = express();
var saltRounds = 10
app.engine('html', require('ejs').renderFile); // EJS Template Engine
app.set('view engine', 'html');

//const dbs = require('./info.js');
const { database } = require('../database.js');
const { mailing } = require('../mailing.js');

const db = new database();
const emailer = new mailing();

datab = new sqlite3.Database('mydb', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the database');
}); 

app.use('/static', express.static('public')) // Serve Static Files

module.exports = function(app){
//Login Screen
app.get('/',function(request, response) {
	response.render('../index.html',{message:''});
});

app.post('/auth', function(request, response) {
	var username = request.body.email;
	var password = request.body.pass;
  datab.all('SELECT password,userid FROM login WHERE email = ?;',[username],(err,rows) =>{ // I have absolutly no idea if this is how this is done safely
    if(rows.length > 0){
      bcrypt.compare(password, rows[0].PASSWORD, function(err, result) { // Compare an ordinary password to hashed version
      if (username && password && result == true) {
            request.session.loggedin = true;
            request.session.username = username;
            request.session.ids = rows[0].USERID;
            response.redirect('/welcome')
            //response.render('../templates/calendar.html',{name:request.session.username})
          } else {
              response.render('../index.html',{message:'Incorrect Username or Passsword!'});
              response.end();
          }
       });
    } else {
          response.render('../index.html',{message:'Incorrect Username or Passsword!'});
          response.end();
	      }
      }); 
    });
//End Login 

//Main Webpage
app.get('/home', function(request, response) {
  if(request.session.loggedin){
    var date = new Date();
    var products = [];
    var q = "SELECT product,expiration FROM products WHERE EXPIRATION < '"+date.toISOString()+"' AND USERID = "+request.session.ids

    console.log(q)
    datab.all(q,(err,rows) =>{
      if(err){
        console.log(err)
      }
      rows.forEach((row)=>{
        products.push(row)
      })
    if(products.length > 0)
      emailer.expirationReminder(request.session.username,products)
    })
    
    datab.all(`DELETE FROM products WHERE EXPIRATION < ?
                                    AND USERID = ?`,[date.toISOString(),request.session.ids],(err,rows) =>{
                                    })
    
    response.render('../templates/calendar.html');
  }
  else
    response.redirect('/')
});
//End Main Webpage

//Sign up
app.get('/signup',function(request, response) {
	response.render('../templates/createLogin.html',{message:''});
});

app.post('/makeAccount', function(request,response){
  var username = request.body.email
  var pass = request.body.pass
  var verifypass = request.body.pass2
  if (pass === verifypass){
    datab.all('SELECT * FROM login WHERE email = ?',username,(err,rows) =>{
      if(rows.length == 0){
        bcrypt.hash(pass, saltRounds, function(err, hash) { // Encrypt the password into the db
          db.createLogin({email:username,password:hash,notificationt:0})
        })
        //db.createLogin({email:username,password:pass,notificationt:0})
        response.redirect('/');
        response.end();
      }else{
      response.render('../templates/createLogin.html',{message:'Username already taken'})
      response.end();
    }
    });
  }else{
    response.render('../templates/createLogin.html',{message:'Passwords do not match!'})
  }
});
//End Signup

//Forgot Password
app.get('/recover',function(request,response){
  response.render('../templates/recoverPassword.html',{message:''})
});

app.get('/reset',function(request,response){
  var q = request.query.q
  if(typeof(q) == 'undefined'){
    response.redirect('/')
    response.end()
  }
  else{
  bcrypt.compare(request.session.username,q,function(err, result) {
    if(result == false || typeof(result) == 'undefined'){
      response.render('../index.html',{message:'Unable to verify'})
      response.end()
      }
  });
  
  response.render('../templates/resetPassword.html',{message:''})
  }
});

app.post('/email',function(request,response){
  request.session.username = request.body.email;
  bcrypt.hash(request.session.username, saltRounds, function(err, hash) {
    emailer.recoverAccount(request.session.username,hash);
  });
  response.redirect('/')
  response.end();
});

app.get('/logout',function(request,response){
  if (request.session) {
    request.session.destroy(err => {
  if (err) {
    response.status(400).send('Unable to log out')
  } else {
     response.redirect('/');
  }
  });
  }
});

app.post('/resetEmail',function(request,response){
  var username = request.session.username
  var pass = request.body.pass
  var verifypass = request.body.pass2

  if (pass == verifypass){
    bcrypt.hash(pass, saltRounds, function(err, hash) {
      datab.all('UPDATE login SET password = ? WHERE email = ?',[hash,username],(err,rows) =>{
        console.log(rows)
        if(err){
          console.log(err)
        }
      });
    });
  }else{
    response.render('../templates/resetPassword.html',{message:'Passwords did not match!'})
  }
  response.render('../index.html',{message:''})
});
//End Forgot Password

}