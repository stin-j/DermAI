//script to convert the address to lat and long
var geocoder = require('geocoder');
//take address from index.html input "address"
var address = document.getElementById("address").value;
var lat, long;
geocoder.geocode(address, function ( err, data ) {
    console.log(data.results[0].geometry.location.lat);
    //save the lat and long as variables
    lat = data.results[0].geometry.location.lat;
    long = data.results[0].geometry.location.lng;
    
    }
);
//script to convert the lat and long to address
var geocoder = require('geocoder');
var latlng = "40.714224,-73.961452";
geocoder.reverseGeocode( latlng, function ( err, data ) {
    // do something with data
    }
);
