var points = [
  {
    "id" : 1,
    "text" : "emedia",
    "lon" : 2.463963031768799,
    "lat" : 48.82104999024419,
  }
];

var onMarkerClick = function(e) {
  var latlng = e.layer.getLatLng(),
      text = e.layer.options.title;

  L.popup({offset: new L.Point(1,-35)})
    .setLatLng(latlng)
    .setContent(text)
    .openOn(map);

  map.panTo(latlng);
};

var markers = points.map(function(marker) {
  var lmarker = L.marker([marker.lat, marker.lon], {
    title: marker.text
  });
  return lmarker
});

var featuresLayer = L.featureGroup(markers);
featuresLayer.on('click', onMarkerClick);

var cityTilesLayer = L.tileLayer('cache3/{z}/{x}/{y}.jpg', {
  maxZoom: 16,
  minZoom: 14
});

var southWest = new L.LatLng(48.748946,2.416992),
    northEast = new L.LatLng(48.835797,2.592773),
    cityBounds = new L.LatLngBounds(southWest, northEast);


// Disable webkit 3d CSS transformations for tile positioning
// Causes lots of flicker in PhoneGap for some reason...
L.Browser.webkit3d = false;
options = {maxBounds: cityBounds};
if (navigator.userAgent.match(/Android 2/)) {
  options.doubleClickZoom = false;
  options.touchZoom = false;
  // Android 2.x
  // @todo enable the pinch-zoom plugin
} else {
  options.touchZoom = true;
  options.zoomControl = true;
}
var map = L.map('map', options);

cityTilesLayer.addTo(map);
featuresLayer.addTo(map);

function onLocationFound(e) {
  var radius = e.accuracy / 2;
  L.marker(e.latlng).addTo(map)
    .bindPopup("You are within " + radius + " meters from this point").openPopup();
  L.circle(e.latlng, radius).addTo(map);
}
function onLocationError(e) {
  alert(e.message);
}
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
map.locate({setView: true, maxZoom: 16});

