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

one_converter.fromFile("simple-move-data/out/one.csv",function(err,result){
    response.one = {};
    result.forEach(function (obj) {
       response.one[obj.ZIP_CODE] = obj.RENT_INDEX;
    });
});

two_converter.fromFile("simple-move-data/out/two.csv",function(err,result){
    response.two = {};
    result.forEach(function (obj) {
        response.two[obj.ZIP_CODE] = obj.RENT_INDEX;
    });
});

three_converter.fromFile("simple-move-data/out/three.csv",function(err,result){
    response.three = {};
    result.forEach(function (obj) {
        response.three[obj.ZIP_CODE] = obj.RENT_INDEX;
    });
});

four_converter.fromFile("simple-move-data/out/four.csv",function(err,result){
    response.four = {};
    result.forEach(function (obj) {
        response.four[obj.ZIP_CODE] = obj.RENT_INDEX;
    });
});

five_converter.fromFile("simple-move-data/out/five.csv",function(err,result){
    response.five = {};
    result.forEach(function (obj) {
        response.five[obj.ZIP_CODE] = obj.RENT_INDEX;
    });
});

studio_converter.fromFile("simple-move-data/out/studio.csv",function(err,result){
    response.studio = {};
    result.forEach(function (obj) {
        response.studio[obj.ZIP_CODE] = obj.RENT_INDEX;
    });
});

app.get('/csv', function (req, res) {
	res.send(response);
});

app.use(express.static('public'));

app.listen(3000, function() {
	console.log("Simple move server started");
});
