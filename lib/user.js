var db = require('./db');
var fn = require('./functions');

exports.intro = function(body,logged_id,callback){

  var user_info = {
    birthday:fn.sanitize(body.birthday),
    gender:fn.sanitize(body.gender),
    phone:fn.sanitize(body.phone),
    prefix:fn.sanitize('+40'), //TODO prefix
    country:fn.sanitize('Romania'), //TODO country
    city:fn.sanitize('Brasov'),
    address:fn.sanitize(body.address),
    zipcode:fn.sanitize(body.zip)
  }

  var query='';
  for(var i=0; i<body.programs.length; i++){
    query+='(NULL,'+body.programs[i].program.value+','+body.programs[i].specialisation.value+','+logged_id+',CURRENT_TIMESTAMP)';
    if(i<body.programs.length-1){
      query+=','
    }
  }

  var countryquery='';
  for(var i=0; i<body.countries.length; i++){
    countryquery+='(NULL,'+body.countries[i].country.value+','+logged_id+',CURRENT_TIMESTAMP)';
    if(i<body.programs.length-1){
      countryquery+=','
    }
  }

  var fullcountryquery = 'INSERT INTO studli.users_countries (id, country_id, user_id, date_added) VALUES '+countryquery;
  db.query(`DELETE FROM studli.users_countries WHERE user_id = '${logged_id}'`,function(){
    db.query(fullcountryquery,function(){
    });
  });

  var fullquery = 'INSERT INTO studli.users_programs (id, program_id, specialisation_id, user_id, date_added) VALUES '+query;
  db.query(`DELETE FROM studli.users_programs WHERE user_id = '${logged_id}'`,function(){
    db.query(fullquery,function(){
    });
  });
  db.query(`UPDATE studli.users SET birth_date = '${user_info.birthday}', gender = '${user_info.gender}', country = '${user_info.country}', city = '${user_info.city}', address = '${user_info.address}', phone = '${user_info.phone}', prefix = '${user_info.prefix}', zipcode = '${user_info.zipcode}' WHERE users.id = '${logged_id}'`,function(){
    callback("User data updated");
  });
}
