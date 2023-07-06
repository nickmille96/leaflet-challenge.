//Set Up and Title Layer

let newMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  href:
    '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

var layit = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  href:
    '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

// Map dimensions
let myMap = L.map("map", {
  center: [50.0, -99.5],
  zoom: 2,
});

layit.addTo(myMap);

let baseMaps = {
  "Light Global": newMap,
  "Global Earthquakes": layit,
};
let earthquakes = new L.LayerGroup();
let tplates = new L.LayerGroup();


let overlays = {
  "Tectonic Plates": tplates,
  Earthquakes: earthquakes,
};

L.control.layers(baseMaps, overlays, { collapsed: true }).addTo(myMap);

//get data

d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {


 
function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  console.log('logic.js');

  function getColor(magnitude) {
    if (magnitude > 90) {
      return "#ea2c35";
    }
    if (magnitude > 70) {
      return "#ea2c94";
    }
    if (magnitude > 50) {
      return "#ee9c00";
    }
    if (magnitude > 30) {
      return "#eae12c";
    }
    if (magnitude > 10) {
      return "#ea2c94";
    }
    return "#d891ef";
  }

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 5;
  }

  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: styleInfo,

  }).addTo(earthquakes);

//Add Legend
let Legend= L.control({position: "bottomleft"});
Legend.onAdd = function () {
  let steps= [5, 10, 30, 50, 70, 90]
  let colors = ["#d891ef", "#ea2c94","#eae12c", "#ee9c00",  "#ea2c94", "#ea2c35"]
  let div = L.DomUtil.create("div", "infolegend")
  let labels = [];

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};
  earthquakes.addTo(myMap);
  Legend.addTo(myMap)

});