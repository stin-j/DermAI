if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        if (permission.state === 'granted') {
            // permission granted, call getCurrentPosition()
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
            console.log("permission granted");
        } else if (permission.state === 'prompt') {
            //permission not granted, prompt the user to allow location access
            alert("User denied the request for location access.");

        } else {
            // permission denied
            alert("User denied the request for location access.");
        }
    });
} else {
    // navigator.permissions not supported, call getCurrentPosition()
}

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // use the latitude and longitude data
}

function errorCallback(error) {
    console.error(`Error getting location data: ${error.message}`);
}

function errorCallback(error) {
    const errorMessage = "Unable to retrieve your location. Please try again later.";
    console.error(`Error getting location data: ${error.message}`);
    //code to display error message to user on web page
    alert(errorMessage);

}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for location access.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}