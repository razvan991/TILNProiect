window.addEventListener('load', function () {
    if (document.getElementById("show_route").checked == true) {
        bifat = true;
    }
    else {
        bifat = false;
    }
});
var bifat = false;

function loadMapScenario() {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        center: new Microsoft.Maps.Location(47.1598, 27.5872),  // Iasi
        zoom: 14
    });

    // get click lat. and long.
    Microsoft.Maps.Events.addHandler(map, 'click', function (e) {
        if (e.targetType == "map") {
        var point = new Microsoft.Maps.Point(e.getX(), e.getY());
        var loc = e.target.tryPixelToLocation(point);
        }

        searchAddress(loc.latitude, loc.longitude, 0);
    });

    Microsoft.Maps.loadModule('Microsoft.Maps.Search');
    // search address by a point on the map
    function searchAddress(lat, lon, drag) {
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);
        var reverseGeocodeRequestOptions = {
            location: new Microsoft.Maps.Location(lat, lon),
            callback: function (answer, userData) {
                var adresa = answer.address.formattedAddress;
                if (drag == 0) {
                    pinInfo(adresa, lat, lon);
                    map.layers.clear();
                    if (bifat)
                        route();
                }
                else {
                    document.getElementById('p' + drag).innerHTML = drag.bold() + ": " + adresa;
                }
            }
        };
        searchManager.reverseGeocode(reverseGeocodeRequestOptions);
    }

    // search city in the searchbox
    Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
        var options = {
            maxResults: 4,
            map: map
        };
        var manager = new Microsoft.Maps.AutosuggestManager(options);
        manager.attachAutosuggest('#searchBox', '#searchBoxContainer', selectedSuggestion);
    });
    function selectedSuggestion(suggestionResult) {
        var adresa = suggestionResult.formattedSuggestion;
        var latidutine = suggestionResult.location.latitude;
        var longitudine = suggestionResult.location.longitude;

        pinInfo(adresa, latidutine, longitudine);
        map.layers.clear();
        if (bifat)
            route();
    }

    // show pushpin and infobox of a location
    var letters = ['A'], pins = 0;

    function pinInfo(adresa, latidutine, longitudine) {
        if (pins >= 25) {
            alert("Too many pins")
        }      
        else {
            // generare nume pin-uri...dupa Z urmeaza AA, AB etc.
            if (letters[0].charCodeAt(0) > 90) {
                for ( var i = 0; i < letters.length; i++) {
                    if (letters[i].charCodeAt(0) > 90) {
                        letters[i] = 'A';
                        
                        if (i == letters.length - 1)
            	            letters.push('A')
          	            else
                            letters[i + 1] = String.fromCharCode(letters[i + 1].charCodeAt(0) + 1);
                    }
                    else {
                        break;
                    }
                }
            }
            var letter = letters.join('').split('').reverse().join('');

            var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(latidutine, longitudine), 
                            {text: letter, color: "blue", enableHoverStyle: true, draggable: true, enableClickedStyle: true});
            map.entities.push(pushpin);

            Microsoft.Maps.Events.addHandler(pushpin, 'click', function () {
                var pin_fixed = pushpin.getDraggable();
                if (pin_fixed == true)
                    pushpin.setOptions({ draggable: false});
                else
                    pushpin.setOptions({ draggable: true});
            });

            Microsoft.Maps.Events.addHandler(pushpin, 'dblclick', function () {
                pins --;
                map.entities.remove(pushpin);
                document.getElementById('p'+pushpin.getText()).style.display = "none";
                map.layers.clear();
                if (bifat)
                    route();
            });

            Microsoft.Maps.Events.addHandler(pushpin, 'dragend', function () {
                searchAddress(pushpin.getLocation().latitude, pushpin.getLocation().longitude, pushpin.getText());
                map.layers.clear();
                if (bifat)
                    route();
            });

            document.getElementById('printoutPanel').innerHTML += "<p id='p" + letter + "'>" + letter.bold() + ": " + adresa + "</p>";
            document.getElementById('printoutPanel').scrollTop = document.getElementById('printoutPanel').scrollHeight; // scroll to the bottom of printoutPanel when a pin is added

            letters[0] = String.fromCharCode(letters[0].charCodeAt(0) + 1);
            pins ++;
        }
    }
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', route);
    
    function route() {
        var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        // Set Route Mode to driving
        directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });

        for (var i = 0; i < map.entities.getLength(); i++) {
            var pushpin = map.entities.get(i);
            if (pushpin instanceof Microsoft.Maps.Pushpin) {
                var waypoint = new Microsoft.Maps.Directions.Waypoint({ location: pushpin.getLocation() });
                directionsManager.addWaypoint(waypoint);
            }
        }

        directionsManager.setRenderOptions({
            // afisare itinerariu
            // itineraryContainer: document.getElementById('container4'),
            waypointPushpinOptions:{visible:false},
            viapointPushpinOptions:{visible:false},
        });
        directionsManager.calculateDirections();
    }

    var show_route = document.getElementById("show_route");
    show_route.addEventListener('click', function () {
        if (show_route.checked == true) {
            bifat = true;
            route();
        }
        else {
            bifat = false;
            map.layers.clear();
        }
    });
}