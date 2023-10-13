var map = L.map('map').setView([-0.835055, 35.229350], 12); // Initial view at lat 0, lon 0 with zoom level 2
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load GeoJSON data
var geoJsonUrl = 'data/Koimeret_Registration_Parcels.geojson';

fetch(geoJsonUrl)
  .then(response => response.json())
  .then(geoJsonData => {
    L.geoJSON(geoJsonData, {
      style: function (feature) {
        var area = feature.properties.area;  // Get the area from the properties
        // Assign colors based on a gradient
        var fillColor = area > 10? 'green' : 'yellow';
      
        // Modify fillColor based on the area value for a gradient effect
        if (area > 10) {
          fillColor = 'green';
        } else if (area > 5) {
          fillColor = 'yellow';
        } else {
          fillColor = 'red';
        }
      
        return {
          fillColor: fillColor,
          fillOpacity: 0.5,
          color: 'blue',
          weight: 2
        };
      },
      
      onEachFeature: function (feature, layer) {
        // Create a popup with all properties
        var popupContent = '<strong>Properties:</strong><br>' +
          JSON.stringify(feature.properties, null, 2);
        layer.bindPopup(popupContent);
      }
    }).addTo(map);
  })
  .catch(error => console.error('Error fetching GeoJSON:', error));