require(["dojo/_base/array",
         "esri/map", 
         "esri/layers/FeatureLayer",
         "esri/symbols/SimpleLineSymbol",
         "esri/symbols/SimpleFillSymbol",
         "esri/renderers/ClassBreaksRenderer",
         "esri/Color",
		 "esri/request",
		 "dojo/domReady!"], 
        function(arr, Map, FeatureLayer, SLS, SFS, ClassBreaksRenderer, Color, EsriRequest){
	var map = new Map("map", {
		basemap: "topo",
		center: [-73.950, 40.702],
		zoom: 10
	});
    
    var zips = new FeatureLayer("https://services1.arcgis.com/1L9nSO7QmA3AYgYY/arcgis/rest/services/zip_codes/FeatureServer/0",
                                {outFields: ["GEOid2"]});
    
    map.addLayer(zips);
    
    function drawFeatureLayer(data)
    {
        var outline = new SLS("solid", new Color("#444"), 1);
        var br = new ClassBreaksRenderer(null, function(g){
            return (g.attributes.GEOid2 == 10307) ? 20 : 5;
        });
        br.addBreak(0, 6, new SFS("solid", outline, new Color([255, 255, 178, 0.75])));
        br.addBreak(6, 1000000, new SFS("solid", outline, new Color([254, 204, 92, 0.75])));
        zips.setRenderer(br);
        zips.redraw();
    }
    var prices = EsriRequest({
        url: "http://localhost:3000/test/data.json",
        handleAs: "json"
    });
    prices.then(drawFeatureLayer);
});
