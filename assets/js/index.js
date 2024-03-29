'use strict';

$.get('/authenticate', function( data ) {});

function loadSongs() {
    if (!$('#location_id').val()) {
        alert("Enter a city fam.");
        return false;
    }

    $("h1").fadeOut(1000);
    $("form").fadeOut(1000, function () {
        var geocoder =  new google.maps.Geocoder();
        var location = $('#location_id').val();
        geocoder.geocode( { 'address': location }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = "lat=" + results[0].geometry.location.lat();
                var longitude = "&long=" + results[0].geometry.location.lng();
                $.get('/weather?' + latitude + longitude, function( weatherData ) {
                    displayWeatherAndPlaylist(weatherData);
                });
            } else {
                alert("Something went wrong. Try again.");
            }
        });
    });
    return false;
}

function skycons() {
	var skycons = new Skycons({"color": "#ebebeb"}),
      list  = [
        "clear-day", "clear-night", "partly-cloudy-day",
        "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
        "fog"
      ],
      i;
 
    for(i = list.length; i--; ) {
        var weatherType = list[i],
            elements = document.getElementsByClassName( weatherType );
        for (var e = elements.length; e--;){
            skycons.set( elements[e], weatherType );
        }
    }
 
  skycons.play();
}

function displayWeatherAndPlaylist(weatherData) {
	// Append divs
	$("#forecast").append(
		"<center><h1>Weather</h1><div class='graphic'><canvas class=" + weatherData.skicons + "></canvas></div>" + "<h1>" +
		weatherData.temp + "&deg; " + weatherData.summary + "</h1></center>"
	).hide().fadeIn(2000);

    var src = "https://open.spotify.com/embed/playlist/" + weatherData.playlistURI;
	$("#playlist").append("<center><h1>Playlist</h1><iframe style='border-radius:12px' src='" + src + "' width='400' height='480' frameBorder='0' allowfullscreen='' allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' loading='lazy'></iframe></center>").hide().fadeIn(2000);

	skycons(); // inject skycons for each forecast

}