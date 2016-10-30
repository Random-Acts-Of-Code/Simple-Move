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
		zoom: 11
	});
    
    var zips = new FeatureLayer("https://services1.arcgis.com/1L9nSO7QmA3AYgYY/arcgis/rest/services/zip_codes/FeatureServer/0",
                                {outFields: ["GEOid2"]});
    
    map.addLayer(zips);
    
    var prices = EsriRequest({
        url: "http://localhost:3000/csv",
        handleAs: "json"
    });
    prices.then(loadData);
    
    function loadData(data)
    {
        window.data = data;
        drawFeatureLayer("one");
    }
    
    function drawFeatureLayer(field)
    {
        data = window.data[field];
        var min = minValue(data, "RENT_INDEX");
        var max = maxValue(data, "RENT_INDEX");
        var breaks = calcBreaks(min, max, 4);
        var outline = new SLS("solid", new Color("#444"), 1);
        var br = new ClassBreaksRenderer(null, function(g){
            return data[g.attributes.GEOid2];
        });
        br.addBreak(breaks[0], breaks[1], new SFS("solid", outline, new Color("#d8e8f3")));
        br.addBreak(breaks[1], breaks[2], new SFS("solid", outline, new Color("#9fc5e0")));
        br.addBreak(breaks[2], breaks[3], new SFS("solid", outline, new Color("#5296c7")));
        br.addBreak(breaks[3], max, new SFS("solid", outline, new Color("#2c6187")));
        
        zips.setRenderer(br);
        zips.redraw();
    }
    
    function minValue(obj)
    {
        var min = Infinity;
        for(var key in obj){
            if(obj[key] < min){
                min = obj[key];
            }
        }
        return min;
    }
    
    function maxValue(obj)
    {
        var max = -Infinity;
        for(var key in obj){
            if(obj[key] > max){
                max = obj[key];
            }
        }
        return max;
    }
    
    function calcBreaks(min, max, n)
    {
        var range = (max - min) / n;
        var breakValues = [];
        for (var i = 0; i < n; i++)
            {
                breakValues[i] = min + (range * i);
            }
        return breakValues;
    }
});
