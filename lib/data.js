var db = require('./db');
var fn = require('./functions');

exports.register = function(logged_id,callback){
  var data = {
    program_types:"",
    programs:"",
    countries:"",
    specialisations:"",
  };
  db.query(`SELECT * FROM studli.program_types`,function(rows){
    data.program_types = rows;
    db.query(`SELECT * FROM studli.programs`,function(rows){
      data.programs = rows;
      db.query(`SELECT * FROM studli.specialisations`,function(rows){
        data.specialisations = rows;
        db.query(`SELECT * FROM studli.countries`,function(rows){
          data.countries = rows;
          callback(data);
        });
      });
    });
  });
}
