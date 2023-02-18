function getLocation() {
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
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // use the latitude and longitude data
        console.log("Latitude: ${latitude} °, Longitude: ${longitude} °");
        var x = document.getElementById("demo");
        x.innerHTML = "Latitude: " + latitude + " Longitude: " + longitude;

    }

    //handle errors
    function errorCallback(error) {
        locationError = true;
        console.error("Error getting location data: ${error.message}");
        //code to display error message to user on web page


    }
}
