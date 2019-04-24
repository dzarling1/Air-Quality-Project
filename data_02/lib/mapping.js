var app = new Vue({
    el: "#app",
    data: {
        row1: [],
        row2: []
    }
});

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
    zoom: 10,

});

var cord = map.getCenter();
console.log(cord);



var elem = document.getElementById("map1");

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}


var layer = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
    maxZoom: 16,
    minZoom: 9,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYmJyb29rMTU0IiwiYSI6ImNpcXN3dnJrdDAwMGNmd250bjhvZXpnbWsifQ.Nf9Zkfchos577IanoKMoYQ'
}).addTo(map);

function onMapMove() {
    var currDate = new Date();
    var priorDate = new Date();
    priorDate.setDate(currDate.getDate() - 30);
    console.log(priorDate);
    var dateFrom = priorDate.getFullYear() + "-" + (priorDate.getMonth()+1) + "-" + priorDate.getDate();
    console.log(dateFrom);
    var cord = map.getCenter();
    document.getElementById("lat").value = cord.lat;
    document.getElementById("lon").value = cord.lng;

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            // successfully received data!
            var data1 = JSON.parse(req.responseText);
            console.log(data1);
            if (typeof data1.address.city !== 'undefined')
                document.getElementById("loc").value = data1.address.city;
            else
                document.getElementById("loc").value = data1.address.county;
        }
    };
    req.open("GET", "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + document.getElementById("lat").value + "&lon=" + document.getElementById("lon").value, true);
    req.send();

    var bounds = map.getBounds();
    console.log(map.getBounds());
    var radius = bounds._northEast.distanceTo(bounds._southWest) / 2;
    console.log("radius: " + radius);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data2 = JSON.parse(xhttp.responseText);
            console.log(data2);
            
            var i;
            var j;
            var k;
            var lats = new Array();
            var lons = new Array();
            var locations = new Array();
            var dates = new Array();
            var values = new Array();
            var amount = new Array();
            var units = new Array();
            var counts = new Array();
            var flag = 0;

            for (i = 0; i < data2.results.length; i++) {
                for (j = 0; j < lats.length; j++) {
                    if (data2.results[i].coordinates.latitude === lats[j] && data2.results[i].coordinates.longitude === lons[j]) {
                        flag = 1;
                    }
                }
                if (flag === 0) {
                    values[j] = [0, 0, 0, 0, 0, 0];
                    counts[j] = [0, 0, 0, 0, 0, 0];
                    lats[j] = data2.results[i].coordinates.latitude;
                    lons[j] = data2.results[i].coordinates.longitude;
                    locations[j] = data2.results[i].location;
                    dates[j] = [];
                }
                flag = 0;
            }
            
            flag = 0;
            console.log(lats);
            console.log(lons);
            
            for (i = 0; i < lats.length; i++) {
                for (j = 0; j < data2.results.length; j++) {
                    if (lats[i] === data2.results[j].coordinates.latitude && lons[i] === data2.results[j].coordinates.longitude) {
                        for (k = 0; k < dates[i].length; k++) {
                            if(dates[i][k] === data2.results[j].date.local) {
                                flag = 1;
                            }
                        }
                        if(flag === 0) {
                            dates[i][k] = data2.results[j].date.local;
                        }
                        flag = 0;
                    }
                }
            }
            
            console.log(dates);
            
            for (i = 0; i < lats.length; i++) {
                for (j = 0; j < data2.results.length; j++) {
                    if (lats[i] === data2.results[j].coordinates.latitude && lons[i] === data2.results[j].coordinates.longitude) {
                        if (data2.results[j].parameter === 'o3') {
                            if (units[0] === undefined) {
                                units[0] = data2.results[j].unit;
                            }
                            else if (units[0] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][0] += data2.results[j].value;
                            counts[i][0]++;
                        }
                        else if (data2.results[j].parameter === 'pm25') {
                            if (units[1] === undefined) {
                                units[1] = data2.results[j].unit;
                            }
                            else if (units[1] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][1] += data2.results[j].value;
                            counts[i][1]++;
                        } 
                        else if (data2.results[j].parameter === 'pm10') {
                            if (units[2] === undefined) {
                                units[2] = data2.results[j].unit;
                            } else if (units[2] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][2] += data2.results[j].value;
                            counts[i][2]++;
                        } 
                        else if (data2.results[j].parameter === 'co') {
                            if (units[3] === undefined) {
                                units[3] = data2.results[j].unit;
                            } else if (units[3] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][3] += data2.results[j].value;
                            counts[i][3]++;
                        } 
                        else if (data2.results[j].parameter === 'no2') {
                            if (units[4] === undefined) {
                                units[4] = data2.results[j].unit;
                            } else if (units[4] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][4] += data2.results[j].value;
                            counts[i][4]++;
                        } 
                        else if (data2.results[j].parameter === 'so2') {
                            if (units[5] === undefined) {
                                units[5] = data2.results[j].unit;
                            } 
                            else if (units[5] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][5] += data2.results[j].value;
                            counts[i][5]++;
                        }
                        //add to sum
                    }
                }
                for (k = 0; k < 6; k++) {
                    if (values[i][k] !== 0)
                        values[i][k] = values[i][k] / counts[i][k];
                }
                //calculate averages for this location for each thing found
                //Add marker for this location
                if (units[i] == 'undefined') {
                    units[i] = "";
                }
                var markers = L.marker([lats[i], lons[i]]).addTo(map);

                // map.addLayer(markers);
                markers.bindPopup("Ozone: " + values[i][0] + " " + units[0] + "<br>" +
                    "PM2.5: " + values[i][1] + " " + units[1] + "<br>" +
                    "PM10: " + values[i][2] + "  " + units[2] + "<br>" +
                    "CO: " + values[i][3] + " " + units[3] + "<br>" +
                    "NO2: " + values[i][4] + " " + units[4] + "<br>" +
                    "SO2: " + values[i][5] + "  " + units[5] + "<br>" +
                    "Coordinates: " + lats[i] + " , " + lons[i])

                markers.on("mouseover", function() {
                    this.openPopup();
                }).on("mouseout", function(e) {
                     this.closePopup();
                });



            }
            console.log(values);
            console.log(counts);
            console.log(units);

            for(i=0;i<locations.length;i++){
                amount[i]=new Array();
            }
            for(i=0;i<locations.length;i++){
                for(j=0;j<dates[i].length;j++){
                    amount[i][j] = [locations[i], dates[i][j], '---', '---', '---', '---', '---', '---'];
                }
            }
            
            for(i = 0; i < locations.length; i++) {
                for(k = 0; k < dates[i].length; k++) {
                    for(j = 0; j < data2.results.length; j++) {
                        if (locations[i] === data2.results[j].location && dates[i][k] === data2.results[j].date.local){
                            if(data2.results[j].parameter === 'o3'){
                                amount[i][k][2] = data2.results[j].value.toString();
                            }
                            if(data2.results[j].parameter === 'pm25'){
                                amount[i][k][3] = data2.results[j].value.toString();
                            }
                            if(data2.results[j].parameter === 'pm10'){
                                amount[i][k][4] = data2.results[j].value.toString();
                            }
                            if(data2.results[j].parameter === 'co'){
                                amount[i][k][5] = data2.results[j].value.toString();
                            }
                            if(data2.results[j].parameter === 'no2'){
                                amount[i][k][6] = data2.results[j].value.toString();
                            }
                            if(data2.results[j].parameter === 'so2'){
                                amount[i][k][7] = data2.results[j].value.toString();
                            }
                        }
                    }
                }
            }
            var rows = new Array();
            var x = 0;
            for(i = 0; i < locations.length; i++) {
                for(k = 0; k < dates[i].length; k++) {
                    rows[x] = new Array();
                    x++;
                }
            }
            x = 0;
            for(i = 0; i < locations.length; i++) {
                for(k = 0; k < dates[i].length; k++) {
                    for(j = 0; j < 8; j++) {
                        rows[x][j] = amount[i][k][j];
                    }
                    x++;
                }
            }
            console.log(amount);
            console.log(rows);
            app.row1 = rows;
        }
    };
    xhttp.open("GET", "https://api.openaq.org/v1/measurements?limit=1000&coordinates=" + document.getElementById("lat").value + "," + document.getElementById("lon").value + "&radius=" + radius + "&date_from=" + dateFrom, true);
    xhttp.send();
}
map.on('moveend', onMapMove);

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

var layer = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
    maxZoom: 16,
    minZoom: 9,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYmJyb29rMTU0IiwiYSI6ImNpcXN3dnJrdDAwMGNmd250bjhvZXpnbWsifQ.Nf9Zkfchos577IanoKMoYQ'
}).addTo(map2);


function onMapMove2() {
    var currDate = new Date();
    var priorDate = new Date();
    priorDate.setDate(currDate.getDate() - 30);
    console.log(priorDate);
    var dateFrom = priorDate.getFullYear() + "-" + (priorDate.getMonth()+1) + "-" + priorDate.getDate();
    console.log(dateFrom);
    var cord = map2.getCenter();
    document.getElementById("lat2").value = cord.lat;
    document.getElementById("lon2").value = cord.lng;
    
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            // successfully received data!
            var data1 = JSON.parse(req.responseText);
            console.log(data1);
            if (typeof data1.address.city !== 'undefined')
                document.getElementById("loc2").value = data1.address.city;
            else
                document.getElementById("loc2").value = data1.address.county;
        }
    };
    req.open("GET", "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + document.getElementById("lat2").value + "&lon=" + document.getElementById("lon2").value, true);
    req.send();
    
    var bounds = map2.getBounds(); 
    console.log(map2.getBounds());
    var radius = bounds._northEast.distanceTo(bounds._southWest)/2;
    console.log("radius: " + radius);
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data2 = JSON.parse(xhttp.responseText);
            console.log(data2);
            
            var i;
            var j;
            var k;
            var lats = new Array();
            var lons = new Array();
            var locations = new Array();
            var dates = new Array();
            var values = new Array();
            var amount = new Array();
            var units = new Array();
            var counts = new Array();
            var flag = 0;
                 
            for (i = 0; i < data2.results.length; i++) {
                for (j = 0; j < lats.length; j++) {
                    if (data2.results[i].coordinates.latitude === lats[j] && data2.results[i].coordinates.longitude === lons[j]) {
                        flag = 1;
                    }
                }
                if (flag === 0) {
                    values[j] = [0, 0, 0, 0, 0, 0];
                    counts[j] = [0, 0, 0, 0, 0, 0];
                    lats[j] = data2.results[i].coordinates.latitude;
                    lons[j] = data2.results[i].coordinates.longitude;
                    locations[j] = data2.results[i].location;
                    dates[j] = [];
                }
                flag = 0;
            }
            
            flag = 0;
            console.log(lats);
            console.log(lons);
            
            for (i = 0; i < lats.length; i++) {
                for (j = 0; j < data2.results.length; j++) {
                    if (lats[i] === data2.results[j].coordinates.latitude && lons[i] === data2.results[j].coordinates.longitude) {
                        for (k = 0; k < dates[i].length; k++) {
                            if(dates[i][k] === data2.results[j].date.local) {
                                flag = 1;
                            }
                        }
                        if(flag === 0) {
                            dates[i][k] = data2.results[j].date.local;
                        }
                        flag = 0;
                    }
                }
            }
            
            console.log(dates);
            
            for (i = 0; i < lats.length; i++) {
                for (j = 0; j < data2.results.length; j++){
                    if (lats[i] === data2.results[j].coordinates.latitude && lons[i] === data2.results[j].coordinates.longitude){
                        if (data2.results[j].parameter === 'o3'){
                            if (units[0] === undefined) {
                                units[0] = data2.results[j].unit;
                            }
                            else if (units[0] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][0] += data2.results[j].value;
                            counts[i][0]++;
                        }
                        else if (data2.results[j].parameter === 'pm25') {
                            if (units[1] === undefined) {
                                units[1] = data2.results[j].unit;
                            }
                            else if (units[1] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][1] += data2.results[j].value;
                            counts[i][1]++;
                        }
                        else if (data2.results[j].parameter === 'pm10') {
                            if (units[2] === undefined) {
                                units[2] = data2.results[j].unit;
                            }
                            else if (units[2] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][2]+= data2.results[j].value;
                            counts[i][2]++;
                        }
                        else if (data2.results[j].parameter === 'co') {
                            if (units[3] === undefined) {
                                units[3] = data2.results[j].unit;
                            }
                            else if (units[3] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][3]+= data2.results[j].value;
                            counts[i][3]++;
                        }
                        else if (data2.results[j].parameter === 'no2') {
                            if (units[4] === undefined) {
                                units[4] = data2.results[j].unit;
                            }
                            else if (units[4] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][4]+= data2.results[j].value;
                            counts[i][4]++;
                        }
                        else if (data2.results[j].parameter === 'so2') {
                            if (units[5] === undefined) {
                                units[5] = data2.results[j].unit;
                            }
                            else if (units[5] !== data2.results[j].unit) {
                                console.log("Uh oh units don't match");
                            }
                            values[i][5]+= data2.results[j].value;
                            counts[i][5]++;
                        }
                        //add to sum
                    }
                }
                for (k = 0; k < 6; k++) {
                    if(values[i][k] !== 0)
                        values[i][k] = values[i][k]/counts[i][k];
                }
                //calculate averages for this location for each thing found
                //Add marker for this location
                if (units[i] == 'undefined'){
                    units[i] ="";
                }
                var markers = L.marker([lats[i], lons[i]]).addTo(map2);
                
                // map.addLayer(markers);
                markers.bindPopup("Ozone: " + values[i][0] + " " + units[0] + "<br>" +
                    "PM2.5: " + values[i][1] + " " + units[1] + "<br>" +
                    "PM10: " + values[i][2] + "  " + units[2] + "<br>" +
                    "CO: " + values[i][3] + " " + units[3] + "<br>" +
                    "NO2: " + values[i][4] + " " + units[4] + "<br>" +
                    "SO2: " + values[i][5] + "  " + units[5] + "<br>" +
                    "Coordinates: " + lats[i] + " , " + lons[i])
               
                markers.on("mouseover", function() {
                    this.openPopup();
                }).on("mouseout", function(e) {
                     this.closePopup();
                });
        }
            console.log(values);
            console.log(counts);
            console.log(units);
            
            for(i=0;i<locations.length;i++){
                amount[i]=new Array();
            }
            for(i=0;i<locations.length;i++){
                for(j=0;j<dates[i].length;j++){
                    amount[i][j] = [locations[i], dates[i][j], '---', '---', '---', '---', '---', '---'];
                }
            }
            
            for(i = 0; i < locations.length; i++) {
                for(k = 0; k < dates[i].length; k++) {
                    for(j = 0; j < data2.results.length; j++) {
                        if (locations[i] === data2.results[j].location && dates[i][k] === data2.results[j].date.local){
                            if(data2.results[j].parameter === 'o3'){
                                amount[i][k][2] = data2.results[j].value.toString();
                            }
                            if(data2.results[j].parameter === 'pm25'){
                                amount[i][k][3] = data2.results[j].value.toString();
                            }
                            if(data2.results[j].parameter === 'pm10'){
                                amount[i][k][4] = data2.results[j].value.toString();
                            }
                            if(data2.results[j].parameter === 'co'){
                                amount[i][k][5] = data2.results[j].value.toString();
                            }
                            if(data2.results[j].parameter === 'no2'){
                                amount[i][k][6] = data2.results[j].value.toString();
                            }
                            if(data2.results[j].parameter === 'so2'){
                                amount[i][k][7] = data2.results[j].value.toString();
                            }
                        }
                    }
                }
            }
            var rows = new Array();
            var x = 0;
            for(i = 0; i < locations.length; i++) {
                for(k = 0; k < dates[i].length; k++) {
                    rows[x] = new Array();
                    x++;
                }
            }
            x = 0;
            for(i = 0; i < locations.length; i++) {
                for(k = 0; k < dates[i].length; k++) {
                    for(j = 0; j < 8; j++) {
                        rows[x][j] = amount[i][k][j];
                    }
                    x++;
                }
            }
            console.log(amount);
            console.log(rows);
            app.row2 = rows;
        }
    };
    xhttp.open("GET", "https://api.openaq.org/v1/measurements?limit=1000&coordinates=" + document.getElementById("lat2").value + "," + document.getElementById("lon2").value + "&radius=" + radius + "&date_from=" + dateFrom, true);
    xhttp.send();
}
map2.on('moveend', onMapMove2);
