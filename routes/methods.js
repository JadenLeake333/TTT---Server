const express = require('express');
var bodyParser = require('body-parser'); // Reading JSON
var cors = require('cors'); // Stuff like DELETE and PUT requests

const { database } = require('../database.js');

const db = new database();

const app = express();

app.use('/static', express.static('public')) // Serve Static Files

module.exports = function(app){

app.get('/addFood', function(request, response){
  if(request.session.loggedin)
    response.render('../templates/addfood.html')
  else
    response.redirect('/')
});

app.get('/dates',function(request,response){
  if(request.session.loggedin){
    db.search('products','expiration',response,{userid:request.session.ids})
  }else{
    response.send('Please sign in!')
  }
  
})

app.get('/data',function(request,response){
  if(request.session.loggedin){
    db.search('products','*',response,{userid:request.session.ids})
  }else{
    response.send('Please sign in!')
  }
})

app.put('/change',function(request,response){
  if(request.session.loggedin){
    db.updateTable(request.session.ids,request.body.date,request.body.news)
  }else{
    response.send('Please sign in!')
  }
})


  app.delete('/expired',function(request,response){
    console.dir(request.body)
  if(request.session.loggedin){
    db.deleteData('products',{userid:request.session.ids, product: request.body.product})
  }else{
    response.send('Please sign in!')
  }
})

app.post('/enterdata',function(request,response){
  console.log(request.body)
  if(request.session.loggedin){
    db.createProduct({id:request.session.ids,expiration:request.body.date,stored:request.body.where,name:request.body.food})
    response.redirect('/addFood')
  }else{
    response.send('Please sign in!')
  }
})

}