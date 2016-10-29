var express = require('express');
var app = express();

var Converter = require("csvtojson").Converter;
var one_converter = new Converter({});
var two_converter = new Converter({});
var three_converter = new Converter({});
var four_converter = new Converter({});
var five_converter = new Converter({});
var studio_converter = new Converter({});


var response = {};

one_converter.fromFile("csv/one.csv",function(err,result){
	response.one = result;
});

two_converter.fromFile("csv/two.csv",function(err,result){
	response.two = result;
});

three_converter.fromFile("csv/three.csv",function(err,result){
	response.three = result;
});

four_converter.fromFile("csv/four.csv",function(err,result){
	response.four = result;
});

five_converter.fromFile("csv/five.csv",function(err,result){
	response.five = result;
});

studio_converter.fromFile("csv/studio.csv",function(err,result){
	response.studio = result;
});

app.get('/csv', function (req, res) {
	res.send(response);
});

app.use(express.static('public'));

app.listen(3000, function() {
	console.log("Simple move server started");
});
