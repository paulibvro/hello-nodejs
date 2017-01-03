var server = require('../server');
var db = require('./db');
var fn = require('./functions');
var crypto = require('crypto');


exports.login = function(username, password, ip, callback){
  username = fn.sanitize(username);
  password = fn.sanitize(password);

  var sha1u = crypto.createHash('sha1');
  sha1u.update(username);
  username = sha1u.digest('hex');

  var sha1p = crypto.createHash('sha1');
  sha1p.update(password);
  password = sha1p.digest('hex');


  db.query(`SELECT id FROM users WHERE username = '${username}' AND password = '${password}'`,function(data,status){
    if(data.length==1){
      createToken(data[0].id, ip, function(tk){
        console.log('logged in '+ip);
        callback(tk,200);
      });
    }else{
      callback("",401);
    }
  });
}

function createToken(userid, ip, callback){
  crypto.randomBytes(48, function(err, buffer) {
    var expire = new Date()
    var token = buffer.toString('hex');
      db.query(`UPDATE studli.users SET token = '${token}', token_ip = '${ip}', token_expire = DATE_ADD(CURRENT_TIME , INTERVAL 5 HOUR)  WHERE users.id = '${userid}'`,function(){
        callback(token);
      });
  });
}


exports.checkToken = function(token, ip, callback){
  db.query(`SELECT * FROM users WHERE token='${token}' AND token_ip='${ip}' AND token_expire > CURRENT_TIME()`,function(data){
    if(data.length==1){
      var id = String(data[0].id);
      callback(id);
    }else{
      callback(false);
    }
  });
}
