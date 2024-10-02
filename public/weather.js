const pointURL = "https://api.weather.gov/points/"
const forecastURL = "https://api.weather.gov/gridpoints/{office}/{gridX},{gridY}/forecast"


let pointData = null

var map = L.map('map').setView([42.2626, -71.8023], 13); // Worcester, MA
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

map.on('click', function (e) {
  const { lat, lng } = e.latlng
  fetch('coord', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng })
  }).then(()=>window.location.href='/')
});




