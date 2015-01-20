var map = "";
var makers = [];
var myLatlng = "";

// Mercadolibre API
MELI.init({client_id: 7018697268436377});
MELI.get('/sites/MLA/search?q=oportunidad&offset=300&limit=600', null, function(data) {
    // save a results of the search in a variable
    window.result = data;
    // how match items i have
    var total = result[2].results.length;
    // and show the result in the console
    console.log(total);

    // print items in a list and generate a array with latitudes and longitudes.
    for (i=0; i < result[2].results.length; i++){
            $("#title").append("<h3><a href='" + result[2].results[i].permalink + "'>" + result[2].results[i].title + "</a></h3>" + "<span> $" + result[2].results[i].price + "</span>");
          makers.push(result[2].results[i].seller_address.latitude + "," + result[2].results[i].seller_address.longitude);
    }
});

// Generate Map
function initialize() {
    var myLatlng = new google.maps.LatLng(-34.6158533,-58.4332985);
    var mapOptions = {
    zoom: 10,
    center: myLatlng
    }
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $( "#loading" ).show( "slow" );
    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude,
                                           position.coords.longitude);

          map.setCenter(pos);
          $( "#loading" ).hide( "fast" );
        }, function() {
          handleNoGeolocation(true);
        });
      } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
      }

    // create marker in the map
    for (i = 0; i < makers.length; i++){

        console.log("indice = " +i + " valor = " +makers[i])

        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+ result[2].results[i].title +'</h1>'+
            '<div id="bodyContent">'+
            '<p><a href="' + result[2].results[i].permalink + '"> Ver en MercadoLibre </a></p>'+
            '<p> Precio: $' + result[2].results[i].price + '</p>'+
            '</div>'+
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(result[2].results[i].seller_address.latitude, result[2].results[i].seller_address.longitude),
          map: map,
          title: result[2].results[i].title
        });

        bindInfoWindow(marker, map, infowindow, contentString);
    }

}

function bindInfoWindow(marker, map, infowindow, contentString) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);