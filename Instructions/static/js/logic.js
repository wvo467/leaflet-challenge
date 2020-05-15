// Map
let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 3  
});

// Map Layer
let light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Add Layer to Map
light.addTo(myMap);

// Create a colors for each level of magnitude
function magColor(magnitude) {
  switch (true) {
  case magnitude > 5:
    return "#b42c07";
  case magnitude > 4:
    return "#feb24c";
  case magnitude > 3:
    return "#baae15";
  case magnitude > 2:
    return "#43c919";
  case magnitude > 1:
    return "#2d76d8";
  default:
    return "#98ee00";
  }
};

// Read The Earthquake Data

let jsonData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(jsonData, function(data){
    console.log(data)
    // Function to set the size marker of each earthquake
    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * 4;
    }
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: magColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        weight: 0.5
      };
    }
    // Use point to layer to to create a circle marker for each earthquake
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // Styles each marker depending on its features.
      style: styleInfo,
      // Generate a pop up explaining details for each earthquake
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
  }).addTo(myMap);
});