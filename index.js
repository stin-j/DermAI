window.addEventListener('load', initMap);


var latitude = 0, longitude = 0;
var locationError = false;
const errorMessage = "Unable to retrieve your location. Please try again later.";

//requesting permission to access location
if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        if (permission.state === 'granted') {
            // permission granted, call getCurrentPosition()
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else if (permission.state === 'prompt') {
            //permission not granted, prompt the user to allow location access
            alert("Please allow location access.");
        } else {
            // permission denied
            console.log("User denied the request for location access.");
        }
    });
} else {
    // navigator.permissions not supported, call getCurrentPosition()
}

//using user location data
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

function successCallback(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    // use the latitude and longitude data
    console.log("Latitude: " + latitude + ", Longitude: " + longitude);
    var x = document.getElementById("demo");
    x.innerHTML = "Latitude: " + latitude + " Longitude: " + longitude;
    initMap();
}

//handle errors
function errorCallback(error) {
    locationError = true;
    console.error("Error getting location data: ${error.message}");
    //code to display error message to user on web page
    alert(errorMessage);
}

//init map function
function initMap() {
    // Create a new map instance
    var center = new google.maps.LatLng(latitude, longitude);

    var map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 10
    });
    
    //marker for current location
    var marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Current Location'
    });

    // Create a new Places Service instance
    var service = new google.maps.places.PlacesService(map);

    // Define the search query parameters
    var request = {
        location: center,
        radius: '5000', // Search within 5 km radius
        query: 'skin dermatologists'
    };

    // Send the search request
    service.textSearch(request, callback);

    // Define the callback function
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            // Loop through the results and create a marker for each one
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }

    // Create a marker for a place
    function createMarker(place) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name
        });
    }

}