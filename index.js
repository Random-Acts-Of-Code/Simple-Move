var express = require('express');
var app = express();

app.get('/testdata', function (req, res) {
	res.send({state: "NC"});
});

app.use(express.static('public'));

app.listen(3000, function() {
	console.log("Simple move server started");
});
