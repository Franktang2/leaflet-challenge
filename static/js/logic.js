var plates;
var myMap;
var path = "data/Plates.geojson";
//var path = "Plates.geojson";
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(path,function(response){
    //console.log(response);
    plates = L.geoJSON(response,{  
        style: function(feature){
            return {
                color:"orange",
                fillColor: "white",
                fillOpacity:0.2
            }
        },      
        onEachFeature: function(feature,layer){
            
            layer.bindPopup("Plate Name: "+feature.properties.PlateName);
        }
        
    })

    d3.json(link,function(data){
    
   
    function createCircleMarker(feature,latlng){
        let property = {
            radius:feature.properties.mag*5,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        }
        return L.circleMarker( latlng, property );

    }


    var earthQuakes = L.geoJSON(data,{
        onEachFeature: function(feature,layer){
            layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker

    });

    createMap(plates,earthQuakes);

    });

    
});


  


  function createMap(plates,earthQuakes) {
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: config.API_KEY
    });
  
    var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: config.API_KEY
    });
    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: config.API_KEY
    });
    // Define a baseMaps object for base layers
    var baseMaps = {
      "Satellite": satellite,
      "Grayscale": grayscale,
      "Outdoors": outdoors,
    };
    // Create overlay object to contain overlay layer
    var overlayMaps = {
      "Fault Lines": plates,
      Earthquakes: earthQuakes
    };
    // Create our map
    var myMap = L.map("map", {
      center: [
          45, -95
        //43.6532,-79.3832
      ],
      zoom: 4,
      layers: [satellite, plates, earthQuakes]
    });
    // Add the layer map controls
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(myMap);
    document.querySelector(".legend").innerHTML=displayLegend();
  }
  function chooseColor(mag){
    switch(true){
        case (mag<1):
            return "lightgreen";
        case (mag<2):
            return "greenyellow";
        case (mag<3):
            return "yellow";
        case (mag<4):
            return "darkorange";
        case (mag<5):
            return "orangered";
        default:
            return "darkred";
    };
}

function displayLegend(){
    var legendInfo = [{
        limit: "Mag: 0-1",
        color: "lightgreen"
    },{
        limit: "Mag: 1-2",
        color: "greenyellow"
    },{
        limit:"Mag: 2-3",
        color:"yellow"
    },{
        limit:"Mag: 3-4",
        color:"DarkOrange"
    },{
        limit:"Mag: 4-5",
        color:"orangered"
    },{
        limit:"Mag: 5+",
        color:"darkred"
    }];
    var header = "<h3>Magnitude</h3><hr>";

    var string = "";
   
    for (i = 0; i < legendInfo.length; i++){
        string += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }
    return header+string;

}