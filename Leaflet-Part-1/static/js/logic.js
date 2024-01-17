// link to the USGS dataset
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//create map object
let myMap = L.map('map', {
    center: [45, -120],
    zoom: 3.5
});

//create base tile layer
let baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)

// function to determine color to reflect depth of quake. 
// modified from leaflet tutorial https://leafletjs.com/examples/choropleth/ 
function getColor(d) {
    return d > 90 ? '#BD0026' :
           d > 50  ? '#BD0026' :
           d > 30  ? '#E31A1C' :
           d > 10  ? '#FC4E2A' :
           d > -10 ? '#FEB24C' :
                    '#FFEDA0' ;      
}

// retrieve data with d3
d3.json(url).then(function(data) {
    // console log to view in the browser
    console.log(data)
    // use leaflet geoJSON to create earthquake layer and add markers
    let quakes = L.geoJSON(data.features, {
        pointToLayer: function (feature, latlng) {
            // // check with console log
            // console.log(latlng)
            let depth = feature.geometry.coordinates[2]
            // define & create circles
            let circle = L.circleMarker(latlng, {
                radius: feature.properties.mag * 2,
                fillColor: getColor(depth),
                fillOpacity: 0.7,
                color: getColor,
                weight: 0.5,
                opacity: 0.7
            })
        // create popups for each circle marker
        circle.bindPopup(`Coordinates: ${latlng}<br> Magnitude: ${feature.properties.mag}<br> Depth: ${depth}`)
        return circle
    }
}).addTo(myMap)

// Add legend to the map
// tutorial also on leaflet site https://leafletjs.com/examples/choropleth/
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let labels = []
    let depths = [-10, 10, 30, 50, 70, 90];

    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }
    return div;
  };
legend.addTo(myMap);
})