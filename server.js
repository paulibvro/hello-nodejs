var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var auth = require("./lib/auth");
var fs = require("fs");
var user = require("./lib/user");
var data = require("./lib/data");


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}'-${JSON.stringify(req.body)}`);
	next();
});

app.use(express.static("./public"));

app.use(cors());

//ROUTES

// USER ROUTES -- START
app.post("/user/login", function(req, res) {
  auth.login(req.body.username,req.body.password,req.connection.remoteAddress,function(data,status){
    if(status==200){
      res.status(200).send(data);
    }else{
        res.status(201).send("Invalid username or password");
    }
 });
});

app.get("/user/token", function(req, res) {
  auth.checkToken(req.headers.auth_token, req.connection.remoteAddress,function(data){
    if(!data)res.status(401).send();
    else res.status(200).send("Token ok");
  });
});

app.post("/user/intro", function(req, res){
  auth.checkToken(req.headers.auth_token, req.connection.remoteAddress , function(d){
    if(d){
      user.intro(req.body, d, function(data){
        res.status(200).send(data);
      });
    } else {
      res.status(401).send("Please log in!");
    }
  });
});
// USER ROUTES -- END ---------------------------------


//DATA ROUTES -- START -------------------------------
app.get("/data/register" ,function(req, res){
  auth.checkToken(req.headers.auth_token, req.connection.remoteAddress , function(d){
    if(d){
        data.register(d,function(data){
          res.status(200).send(data);
        });
    } else {
      res.status(401).send("Please log in!");
    }
  });
});

//DATA ROUTES -- END ----------------------------------

app.post('/addClient', function (req, res) {
  var newClient = req.body;
   fs.readFile( __dirname + "/" + "clients.json", 'utf8', function (err, data) {
     var clients = JSON.parse(data).clients;
     clients.push(newClient);
    fs.writeFileSync(__dirname + "/" + "clients.json", JSON.stringify({"clients":clients}));
     res.end(data);
   });
})

app.get("/firms", function(req, res) {
  fs.readFile( __dirname + "/" + "firms.json", 'utf8', function (err, data) {
       res.end( data );
   });
});
app.get("/clients", function(req, res) {
  fs.readFile( __dirname + "/" + "clients.json", 'utf8', function (err, data) {
       res.end( data );
   });
});
app.post("/menu", function(req, res) {
  auth.request(req.body.token, req.headers.request, req.connection.remoteAddress,function(data){
      res.json(data);
  });
});
app.get("/", function(req, res) {

    res.json('SUP');

});


app.delete("/dictionary-api/:term", function(req, res) {
  skierTerms = skierTerms.filter(function(definition){
    return definition.term.toLowerCase()!== req.params.term.toLowerCase();
  });
	res.json(skierTerms);
});

app.listen(3001);

console.log("Express app running on port 3001");

module.exports = app;
