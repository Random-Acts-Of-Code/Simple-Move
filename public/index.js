require(["dojo/parser",
         "dojo/_base/array",
         "dojo/on",
         "esri/map",
         "esri/dijit/Legend",
         "esri/layers/FeatureLayer",
         "esri/symbols/SimpleLineSymbol",
         "esri/symbols/SimpleFillSymbol",
         "esri/renderers/SimpleRenderer",
         "esri/renderers/ClassBreaksRenderer",
         "esri/Color",
		 "esri/request",
         "dijit/DropDownMenu",
         "dijit/MenuItem",
         "dijit/layout/BorderContainer",
         "dijit/layout/ContentPane",
         "dijit/layout/AccordionContainer",
		 "dojo/domReady!"], 
        function(Parser, arr, on, Map, Legend, FeatureLayer, SLS, SFS, SimpleRenderer, ClassBreaksRenderer, Color, EsriRequest, DropDownMenu){
    Parser.parse();
	var map = new Map("map", {
		basemap: "topo",
		center: [-73.950, 40.702],
		zoom: 11
	});
    
    var zips = new FeatureLayer("https://services1.arcgis.com/1L9nSO7QmA3AYgYY/arcgis/rest/services/zip_codes/FeatureServer/0",
                                {outFields: ["GEOid2"]});
    map.addLayer(zips);
    
    var legend = new Legend({
        map: map,
        layerInfos: [{"layer": zips, "title": "Rent Rating"}]
    }, "legendDiv");
    legend.startup();
    
    var datastore;
    var prices = EsriRequest({
        url: "http://localhost:3000/csv",
        handleAs: "json"
    });
    prices.then(loadData);
    
    function loadData(data)
    {
        datastore = data;
        drawFeatureLayer("one", 0);
    }
    
    function drawFeatureLayer(field, index)
    {
        zips.redraw();
        data = datastore[field];
        var min = minValue(data, index);
        var max = maxValue(data, index);
        var breaks = calcBreaks(min, max, 4);
        var outline = new SLS("solid", new Color("#444"), 1);
        var br = new ClassBreaksRenderer(null, function(g){
            return data[g.attributes.GEOid2][index];
        });
        br.addBreak(breaks[0].toFixed(2), breaks[1].toFixed(2), new SFS("solid", outline, new Color("#d8e8f3")));
        br.addBreak(breaks[1].toFixed(2), breaks[2].toFixed(2), new SFS("solid", outline, new Color("#9fc5e0")));
        br.addBreak(breaks[2].toFixed(2), breaks[3].toFixed(2), new SFS("solid", outline, new Color("#5296c7")));
        br.addBreak(breaks[3].toFixed(2), max.toFixed(2), new SFS("solid", outline, new Color("#2c6187")));
        
        zips.setRenderer(br);
        zips.redraw();
        legend.refresh();
    }
    
    window.drawFeatureLayer = drawFeatureLayer;
    
    function minValue(obj, index)
    {
        var min = Infinity;
        for(var key in obj){
            if(obj[key][index] < min){
                min = obj[key][index];
            }
        }
        return min;
    }
    
    function maxValue(obj, index)
    {
        var max = -Infinity;
        for(var key in obj){
            if(obj[key][index] > max){
                max = obj[key][index];
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
