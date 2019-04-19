var data2;
function moveByLocation() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            // successfully received data!
            var data1 = JSON.parse(req.responseText);
            console.log(data1);
            var lat1 = data1[0].lat;
            var lon1 = data1[0].lon;
            console.log(lat1);
            document.getElementById("lat").value = lat1;
            console.log(lon1);
            document.getElementById("lon").value = lon1;
            var cords = L.latLng(document.getElementById("lat").value, document.getElementById("lon").value);
            map.panTo(cords);
        }
    };
    req.open("GET", "https://nominatim.openstreetmap.org/search?q=" + document.getElementById("loc").value + "&format=json&accept-language=en", true);
    req.send();
    
    console.log("The transfer is complete (location).");
}

function moveByLatLon() {
    var cords = L.latLng(document.getElementById("lat").value, document.getElementById("lon").value);
    map.panTo(cords);
    var cord = map.getCenter();
    console.log(cord);
}

var map = L.map('map', {
    center: ([44.953705, -93.089958]),
    zoom: 10
});

var cord = map.getCenter();
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
}).addTo(map);

function onMapMove() {
    var cord = map.getCenter();
    document.getElementById("lat").value = cord.lat;
    document.getElementById("lon").value = cord.lng;
    
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            // successfully received data!
            var data1 = JSON.parse(req.responseText);
            console.log(data1);
            if(typeof data1.address.city !== 'undefined')
                document.getElementById("loc").value = data1.address.city;
            else
                document.getElementById("loc").value = data1.address.county;
        }
    };
    req.open("GET", "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + document.getElementById("lat").value + "&lon=" + document.getElementById("lon").value, true);
    req.send();
    
    var bounds = map.getBounds(); 
    console.log(map.getBounds());
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
                //console.log("Locations: " +data2.results[i].location);
                lats = data2.results[i].coordinates.latitude;
                logs = data2.results[i].coordinates.longitude;
                //console.log("cords: " +lats + " l " + logs);
                var markers = L.marker([lats, logs]).bindPopup("Location: "+data2.results[i].location +"<br>"+ "Parameter: " +data2.results[i].parameter).addTo(map);
                map.addLayer(markers);
                var firstTable = new Vue({
                    el: '#firstTable',
                    data: {
                        rows: [
                            { Location: data2.results[i].location, City: data2.results[i].city, Coordinates: data2.results[i].coordinates, Date: data2.results[i].date }
                        ]
                    }
                });
            }
            markers.on('mouseover', function(event){
                markers.openPopup();
                });
                markers.on('mouseout', function(event){
                markers.closePopup();
                });
        }
    };
    xhttp.open("GET", "https://api.openaq.org/v1/measurements?limit=100&coordinates=" + document.getElementById("lat").value + "," + document.getElementById("lon").value + "&radius=" + radius, true);
    xhttp.send();
}
map.on('moveend', onMapMove);
