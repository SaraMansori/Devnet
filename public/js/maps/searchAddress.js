function initMap() {
    let lat;
    let lng;

    //only on edit view
    if (
        document.querySelector("#located-latitude") &&
        document.querySelector("#located-longitude")
    ) {
        lat = parseFloat(document.querySelector("#located-latitude").value);
        lng = parseFloat(document.querySelector("#located-longitude").value);
    } else {
        lat = 40.4333665;
        lng = -3.704265999999999;
    }

    let map = new google.maps.Map(document.getElementById("map-canvas"), {
        zoom: 16,
        center: { lat: lat, lng: lng },
    });

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
    });
    let geocoder = new google.maps.Geocoder();

    document.getElementById("submit").addEventListener("click", function () {
        geocodeAddress(geocoder, map);
    });
}

function geocodeAddress(geocoder, resultsMap) {
    let address = document.getElementById("address").value;

    geocoder.geocode({ address: address }, function (results, status) {

        console.log(results)

        document.querySelector("#located-address").value =
            results[0].formatted_address;

        document.querySelector("#located-address-show")
            ? (document.querySelector("#located-address-show").innerHTML =
                  results[0].formatted_address)
            : null;

        document.querySelector("#located-latitude").value =
            results[0].geometry.location.lat();

        document.querySelector("#located-longitude").value =
            results[0].geometry.location.lng();

        document.querySelector("#located-city").value =
            results[0].address_components[1].long_name;  

        document.querySelector("#located-country").value =
             results[0].address_components[4].long_name ? results[0].address_components[4].long_name : results[0].address_components[3].long_name ; 

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
