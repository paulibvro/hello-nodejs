var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require("fs");



var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static("./public"));

app.use(cors());

app.get("/", function(req, res) {

    res.json('SUP');

});


app.listen(3001);

console.log("Express app running on port 3001");

module.exports = app;
