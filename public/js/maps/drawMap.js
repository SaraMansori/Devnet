function initMap() {
    let map = new google.maps.Map(document.getElementById("map-canvas"), {
        zoom: 16,
        center: { lat: 40.712784, lng: -74.005941 },
    });

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(40.712784, -74.005941),
        map: map,
    });
    let geocoder = new google.maps.Geocoder();

    geocodeAddress(geocoder, map);
}

function geocodeAddress(geocoder, resultsMap) {
    let address = document.getElementById("address").innerHTML;

    geocoder.geocode({ address: address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            let marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
            });
        } else {
            let error = document.getElementById("error-msg");
            let errorText =
                "Address lookup was not successful for the following reason: " +
                status;
            error.insertAdjacentHTML("afterBegin", errorText);
        }
    });
}
