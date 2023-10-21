document.addEventListener('DOMContentLoaded', function () {
  var map = L.map('map').setView([-0.835055, 35.229350], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  var geoJsonLayer;
  var parcelDataDisplay = document.getElementById('parcelData');

  // Load GeoJSON data from the specified URL
  fetch('data/Koimeret_Registration_Parcels.geojson')
    .then(response => response.json())
    .then(data => {
      geoJsonLayer = L.geoJSON(data, {
        style: function (feature) {
          return {
            fillColor: 'transparent',
            fillOpacity: 0,
            color: 'black',
            weight: 2
          };
        },
        onEachFeature: function (feature, layer) {
          var popupContent = '<strong>Parcel ID:</strong> ' + feature.properties.parcel_id;
          layer.bindPopup(popupContent);
        }
      }).addTo(map);
    })
    .catch(error => console.error('Error fetching GeoJSON:', error));

  // Add a click event handler to the query button
  document.getElementById('queryButton').addEventListener('click', function () {
    var parcelId = document.getElementById('parcelQuery').value.trim();
    resetParcelStyle(geoJsonLayer);
    parcelDataDisplay.innerHTML = '';

    var foundParcels = findParcelsByQuery(geoJsonLayer, parcelId);

    if (foundParcels.length > 0) {
      map.fitBounds(L.featureGroup(foundParcels).getBounds(), { padding: [50, 50] });
      highlightParcels(foundParcels);
      displayParcelData(foundParcels);
    } else {
      parcelDataDisplay.innerHTML = 'Parcels not found';
    }
  });

  function findParcelsByQuery(geoJsonLayer, parcelId) {
    var foundParcels = [];

    geoJsonLayer.eachLayer(function (layer) {
      const parcelIDFromGeoJSON = layer.feature.properties.parcel_id;

      if (parcelIDFromGeoJSON.toString() === parcelId.toString()) {
        foundParcels.push(layer);
      }
    });

    return foundParcels;
  }

  function highlightParcels(layers) {
    layers.forEach(function (layer) {
      layer.setStyle({
        fillColor: 'red',
        fillOpacity: 0.6,
        color: 'black',
        weight: 7
      });
    });
  }

  function resetParcelStyle(geoJsonLayer) {
    geoJsonLayer.eachLayer(function (layer) {
      layer.setStyle({
        fillColor: 'transparent',
        fillOpacity: 0,
        color: 'black',
        weight: 2
      });
    });
  }

  function displayParcelData(parcels) {
    var data = parcels.map(function (parcel) {
      var featureProperties = parcel.feature.properties;
      var propertyStrings = Object.keys(featureProperties).map(function (key) {
        return '<strong>' + key + ':</strong> ' + featureProperties[key];
      });
      return propertyStrings.join('<br>');
    });
  
    parcelDataDisplay.innerHTML = data.join('<br>');
  }
  
});
