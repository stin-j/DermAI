if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        if (permission.state === 'granted') {
            // permission granted, call getCurrentPosition()

        } else if (permission.state === 'prompt') {
            // permission not granted, prompt the user to allow location access


        } else {
            // permission denied

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
    // display error message to user
    
}
