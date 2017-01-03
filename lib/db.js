var mysql = require("mysql");

exports.query = function(query, callback){

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "studli"
  });

  con.connect(function(err){
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    con.query(query ,function(err,rows){
      if(err) throw err;
        callback(rows);
    });
      con.end();
  });
}
