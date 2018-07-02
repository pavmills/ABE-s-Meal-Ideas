// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    // center: { lat: -34.397, lng: 150.644 },
    center: { lat: 38.8991099, lng: -94.7258638 },

    zoom: 11,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER
    }
  });
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent("Location found.");
        infoWindow.open(map);
        map.setCenter(pos);
        var myLatLng = { lat: pos.lat, lng: pos.lng };
        var myLatLngT = { lat: pos.lat + 0.2, lng: pos.lng + 0.2 };
        $(document).ready(function() {
          jQuery.ajaxPrefilter(function(options) {
            if (options.crossDomain && jQuery.support.cors) {
              options.url =
                "https://cors-anywhere.herokuapp.com/" + options.url;
            }
          });
          $.ajax({
            url: `https://maps.googleapis.com/maps/api/place/search/json?location=${
              pos.lat
            },${
              pos.lng
            }&radius=10000&type=supermarket&sensor=true&key=AIzaSyAkUxsueErz026aKa4OgcZg_1X8xDxCbCs`,
            //url: `https://maps.googleapis.com/maps/api/place/search/json?location=-33.8670522,151.1957362&radius=500&types=grocery_or_supermarket&sensor=true&key=AIzaSyAkUxsueErz026aKa4OgcZg_1X8xDxCbCs`,
            type: "GET",
            success: function(response) {
              for (i = 0; i < response.results.length; i++) {
                myLat = response.results[i].geometry.location.lat;
                myLong = response.results[i].geometry.location.lng;
                let responseObject = { resp: response.results[i] };
                let myLatLng = { lat: myLat, lng: myLong };
                var marker = new google.maps.Marker({
                  position: myLatLng,
                  icon: "assets/images/Phyllis1.png",
                  animation: google.maps.Animation.DROP,
                  map: map
                });

                google.maps.event.addListener(marker, "click", function() {
                  hoursOpen = responseObject.resp.opening_hours.open_now;
                  function chngeHours(hours) {
                    if (hours == true) {
                      return "We are currently open.";
                    } else {
                      return "Sorry we're closed.";
                    }
                  }
                  infoWindow.setContent(
                    "<div><strong>" +
                      responseObject.resp.name +
                      "</strong><br>" +
                      '<img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' +
                      responseObject.resp.photos[0].photo_reference +
                      "&sensor=false&key=AIzaSyAkUxsueErz026aKa4OgcZg_1X8xDxCbCs" +
                      '" alt="Smiley face" width="70" height="70">  <br>' +
                      responseObject.resp.vicinity +
                      "<br>" +
                      chngeHours(hoursOpen) +
                      "</div>"
                  );
                  infoWindow.open(map, this);
                });
              }
            },
            error: function() {
              alert("error");
            },
            cache: false
          });
        });
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    console.log("bummer");
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
