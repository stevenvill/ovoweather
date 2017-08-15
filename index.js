/*
$(document).on("click", "#btn", function(){
	$("h1").fadeOut(1000);
	$("form").fadeOut(1000, function (){
    	var geocoder =  new google.maps.Geocoder();
    	var location = $('#location_id').val();
    	geocoder.geocode( { 'address': location }, function(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
    	    	weatherReport(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    	    } else {
    	        alert("Something went wrong " + status);
    	    }
    	});
    });
});
*/

$(document).ready(function() {
    // enter keyd
    $('#location_id').bind('keypress', function(e) {
        if(e.keyCode==13){
        	alert("Enter in input field clicked!"); // Check if it recognizes Enter in input field (it does)
            $('#btn').trigger('click');
        }
    });

    $('#btn').click(function(){
    	$("h1").fadeOut(1000);
		$("form").fadeOut(1000, function (){
    		var geocoder =  new google.maps.Geocoder();
    		var location = $('#location_id').val();
    		geocoder.geocode( { 'address': location }, function(results, status) {
    			if (status == google.maps.GeocoderStatus.OK) {
    				weatherReport(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    	    		} else {
    	    			alert("Something went wrong " + status);
    	    	}
    		});
   		});
    });
});

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
        for (e = elements.length; e--;){
            skycons.set( elements[e], weatherType );
        }
    }
 
  skycons.play();
}

function weatherReport(latitude, longitude) {
	var apiKey       = '803124776bdc3b6d21073e97812ba316',
			url          = 'https://api.darksky.net/forecast/', // URL IS DIFFERENT FOR UT SERVER, ADDED (https://crossorigin.me/) TO BEGINNING
			lati         = latitude,
			longi        = longitude,
			api_call     = url + apiKey + "/" + lati + "," + longi;

	var days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	// Call to the DarkSky API to retrieve JSON
	$.getJSON(api_call, function(forecast) {
		var date     = new Date(forecast.daily.data[0].time * 1000),
				day      = days[date.getDay()],
				skicons  = forecast.currently.icon,
				time     = forecast.currently.time,
				humidity = forecast.currently.humidity,
				summary  = forecast.currently.summary,
				temp    = Math.round(forecast.currently.temperature);

		// Append divs
		$("#forecast").append(
			"<center><h1>Current Weather</h1><div class='graphic'><canvas class=" + skicons + "></canvas></div>" + "<h1>" +
			temp + "&deg; " + summary + "</h1></center>"
		).hide().fadeIn(2000);

		$("#playlist").append("<center><h1>Current Weather Playlist</h1><iframe src='https://open.spotify.com/embed?uri=spotify:album:63WdJvk8G9hxJn8u5rswNh' width='400' height='480' frameborder='0' allowtransparency='true'></iframe></center>").hide().fadeIn(2000);

		skycons(); // inject skycons for each forecast

	});
}