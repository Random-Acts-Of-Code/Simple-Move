require(["esri/map", 
		"esri/request",
		"dojo/domReady!"], function(Map, Request){
	var map = new Map("map", {
		basemap: "topo",
		center: [-122.45, 37.75],
		zoom: 13
	});
    var prices = Request({
        url: "http://localhost:3000",
        handleAs: "json"
    });
    prices.then(function (data){
        console.log(data);
    });
});
