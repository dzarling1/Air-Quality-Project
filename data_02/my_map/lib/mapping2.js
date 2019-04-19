var data2;
function moveByLocation2() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            // successfully received data!
            var data1 = JSON.parse(req.responseText);
            console.log(data1);
            var lat1 = data1[0].lat;
            var lon1 = data1[0].lon;
            console.log(lat1);
            document.getElementById("lat2").value = lat1;
            console.log(lon1);
            document.getElementById("lon2").value = lon1;
            var cords = L.latLng(document.getElementById("lat2").value, document.getElementById("lon2").value);
            map2.panTo(cords);
        }
    };
    req.open("GET", "https://nominatim.openstreetmap.org/search?q=" + document.getElementById("loc2").value + "&format=json&accept-language=en", true);

    req.send();
    console.log("The transfer is complete location.");
}

function moveByLatLon2() {
    var cords = L.latLng(document.getElementById("lat2").value, document.getElementById("lon2").value);
    map2.panTo(cords);
    var cord = map2.getCenter();
    console.log(cord);
}

var map2 = L.map('map2', {
    center: ([44.953705, -93.089958]),
    zoom: 10
});

var cord = map2.getCenter();
console.log(cord);
/*
var countriesLayer = L.geoJson(countries).addTo(map);
map.fitBounds(countriesLayer.getBounds());
*/
var layer = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
    maxZoom: 16,
    minZoom: 9,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYmJyb29rMTU0IiwiYSI6ImNpcXN3dnJrdDAwMGNmd250bjhvZXpnbWsifQ.Nf9Zkfchos577IanoKMoYQ'
}).addTo(map2);


function onMapMove2() {
    var cord = map2.getCenter();
    document.getElementById("lat2").value = cord.lat;
    document.getElementById("lon2").value = cord.lng;
    var bounds = map2.getBounds(); 
    console.log(map2.getBounds());
    var radius = bounds._northEast.distanceTo(bounds._southWest)/2;
    console.log("radius: " + radius);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            data2 = JSON.parse(xhttp.responseText);
            console.log(data2);

            var i;
            var lats;
            var logs;
            for (i = 0; i < 10; i++) {
                console.log("Locations: " +data2.results[i].location);
                lats = data2.results[i].coordinates.latitude;
                logs = data2.results[i].coordinates.longitude;
                console.log("cords: " +lats + " l " + logs);
                var markers = L.marker([lats, logs]).bindPopup("Location: "+data2.results[i].location +"<br>"+ "Parameter: " +data2.results[i].parameter).addTo(map2);
                map2.addLayer(markers);
            }
        }
    };
    xhttp.open("GET", "https://api.openaq.org/v1/measurements?limit=10&coordinates=" + document.getElementById("lat2").value + "," + document.getElementById("lon2").value + "&radius=" + radius, true);
    xhttp.send();
}


map2.on('moveend', onMapMove2);

