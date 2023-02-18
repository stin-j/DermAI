
//requesting permission to access location
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

//using user location data
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // use the latitude and longitude data
    console.log(`Latitude: ${latitude} °, Longitude: ${longitude} °`);
}

//handle errors
function errorCallback(error) {
    const errorMessage = "Unable to retrieve your location. Please try again later.";
    console.error(`Error getting location data: ${error.message}`);
    //code to display error message to user on web page
    alert(errorMessage);

}
