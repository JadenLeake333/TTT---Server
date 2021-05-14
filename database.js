class database{
   constructor(){
      const sqlite3 = require('sqlite3').verbose();
      this.type = "mv";
      this.db = new sqlite3.Database('mydb', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the database');
    });  
}

dropTable(tablename){
    var drop = `DROP TABLE `+tablename+`;`
     this.db.run(drop, (err) =>{
      if(err){
        return console.log(err.message);
      }
      console.log("Table DROPPED")
    });
  }

//Login DB
createLoginTable(){
  var makeLoginTable = `CREATE TABLE IF NOT EXISTS login(
                    USERID INTEGER PRIMARY KEY AUTOINCREMENT,
                    EMAIL TEXT NOT NULL UNIQUE,
                    PASSWORD TEXT NOT NULL,
                    NOTIFICATIONT INTEGER DEFAULT 0);`;
  this.db.run(makeLoginTable, (err) =>{
    if(err){
      return console.log(err.message);
    }
    console.log("Table created")
  });
}

createLogin(login){
    var insert = `INSERT INTO login(email, password, notificationt)
                  VALUES(?,?,?);`;
      var values = [login.email, login.password,login.notificationt];
      this.db.run(insert,values,(err) =>{
        if(err){
          return err;
        }
        console.log("Record added")
      })
  }
  
  verify(email,pass){
  var search = `SELECT * FROM login
                WHERE email=\"`+email+`\"
                AND password=\"`+pass+`\";`

  console.log(search)
  this.db.all(search,(err,rows) =>{
      if(err){
        return console.log(err.message);
      }

      rows.forEach((row) => {
        return true;
      })
    })
  }
// End Login DB

//Products DB (Refer to ER diagram https://docs.google.com/document/d/1xbKrFEdd6wx_nzRwJKYZUKxPs6BrQdy6OC4728hzz6w/edit)
createProductsTable(){
  var makeProductsTable = `CREATE TABLE IF NOT EXISTS products(
                    USERID INTEGER,
                    EXPIRATION DATE NOT NULL,
                    STORED TEXT NOT NULL,
                    PRODUCT TEXT NOT NULL);`;
  this.db.run(makeProductsTable, (err) =>{
    if(err){
      return console.log(err.message);
    }
    console.log("Products Table created")
  });
}

createProduct(product){
    var insert = `INSERT INTO products(USERID, EXPIRATION, STORED,PRODUCT)
                  VALUES(?,?,?,?);`;
      var values = [product.id, product.expiration,product.stored,product.name];
      this.db.run(insert,values,(err) =>{
        if(err){
          return err;
        }
        console.log("Products Record added")
      })
  }

//End Products DB

//Print Table
  
  printTable(table){
    var print = "SELECT * FROM "+table+";"
     this.db.all(print,(err,rows) =>{
      if(err){
        return console.log(err.message);
      }
      rows.forEach((row) => {
        console.log(row)
      })
    })
  }

// Retrieve Data
  search(table,col,response,args = null){
    //args is an object to specify the search. here is an example of using args:
    //db.search('login',['email'],{notificationt:0,email:"jaden@gmail.com"})
    //The above statement will return 'email' from the login table, where email = 'jayman425@gmail.com' and notificationt = 0
    if (typeof(col) == 'object'){
      col = col.join(",")
    }
      
    var print = "SELECT "+col+" FROM "+table
    if (args != null){
      var key = Object.keys(args)
      var value = Object.values(args)
      print += ' WHERE '
        for(var i = 0; i < key.length; i++){
          if(i == key.length-1){
            if(typeof(value[i]) == 'number')
              print += key[i]+' = '+value[i]
            else
            print += key[i]+' = "'+value[i]+'"'
          }else if(typeof(value[i]) == 'number')
           print += key[i]+' = '+value[i]+' AND '
           else
           print += key[i]+' = "'+value[i]+'" AND '
      }
    }
     var table = []
     this.db.all(print,(err,rows) =>{
      if(err){
        return console.log(err.message);
      }
      rows.forEach((row) => {
        table.push(row)
      })
      response.send(table)
    })
  
  }

  //Delete
  
  deleteData(table,args=null){
    var query = '';
    var key = Object.keys(args)
    var value = Object.values(args)
    query += ' WHERE '
    for(var i = 0; i < key.length; i++){
      if(i == key.length-1){
        if(typeof(value[i]) == 'number')
          query += key[i]+' = '+value[i]
        else
        query += key[i]+' = "'+value[i]+'"'
      }else if(typeof(value[i]) == 'number')
        query += key[i]+' = '+value[i]+' AND '
        else
        query += key[i]+' = "'+value[i]+'" AND '
    }
    var print = "DELETE FROM "+table+query+";"
     this.db.all(print,(err,rows) =>{
      if(err){
        return console.log(err.message);
      }
      rows.forEach((row) => {
        console.log(row)
      })
    })
  }

  deletePast(table,args=null){
    var date = new Date()
    var table = []
    var getInfo = "SELECT expiration,id FROM "+table+";"
     this.db.all(getInfo,(err,rows) =>{
      if(err){
        return console.log(err.message);
      }
      rows.forEach((row) => {
        if(new Date(row.EXPIRATION).getDate()+1 <= date.getDate()+1 && new Date(row.EXPIRATION).getMonth() <= date.getMonth() && new Date(row.EXPIRATION).getYear() <= date.getYear()){
          table.push(row)
        }
      })
      for(var i = 0; i < table.length; i++){
        this.db.all
      }
    })
  }

updateTable(id,date,newName){
    var update = `UPDATE products 
                  SET PRODUCT = \"`+newName+`\"
                  WHERE USERID = `+id+` AND EXPIRATION= \"`+date+`\";`

    this.db.all(update,(err) =>{
      //console.log(update)
      if(err){
        console.log(err.message)
      }
      console.log("Table updated")
    })
  }
}
module.exports={
  database
};
