/* At the moment I am having problems keeping the server side and client side decoupled
    I am doing everything on this REPL until i figure out exactly how I want to do things*/

/*********************ATTENTION*********************** 
IF THE EMAILS ANNOY YOU, GO TO: routes/signin.js - COMMENT OUT LINES 93 AND 94
**************************************************** */

//Initialize all the packages we plan to use
const express = require('express'); // Routing
var session = require('express-session'); // Session Variables
const sqlite3 = require('sqlite3').verbose(); // Database
var bodyParser = require('body-parser'); // Reading JSON
var cors = require('cors'); // Stuff like DELETE and PUT requests
var path = require('path'); // Directory Paths
const bcrypt = require('bcrypt'); // Encryption
const url = require('url'); // Get URL
const querystring = require('querystring'); // Get Query
////////////////////////////////////////////

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(bodyParser.json()); // Needed to properly send JSON
app.use('/static', express.static('public')) // Serve Static Files

app.use(session({
	secret: 'secret', // Make this random
	resave: true,
	saveUninitialized: true
}));

var saltRounds = 10
app.engine('html', require('ejs').renderFile); // EJS Template Engine
app.set('view engine', 'html');

const { database } = require('./database.js');
const { mailing } = require('./mailing.js');
require('./routes/signin')(app);
require('./routes/methods')(app);

const db = new database();
const emailer = new mailing();

datab = new sqlite3.Database('mydb', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the database');
}); 

db.printTable('products')
app.get('/welcome', function(request, response){
    response.render(path.join(__dirname+'/templates/welcome.html'))
});

app.get('/recipe/:food',function(request,response){
  if(request.session.loggedin){
    response.render(path.join(__dirname+'/templates/recipeView.html'))
  }else{
    response.send('Please sign in!')
  }
  
})

app.get('/view',function(request,response){
  if(request.session.loggedin){
    response.render(path.join(__dirname+'/templates/view.html'))
  }else{
    response.send('Please sign in!')
  }
})

app.get('/dylan',function(request,response){
    response.render(path.join(__dirname+'/templates/tips.html'))
  
})
  
app.listen(3000, () => {
  console.log('server started');
});