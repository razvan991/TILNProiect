function loadMapScenario() {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        /* No need to set credentials if already passed in URL */
        center: new Microsoft.Maps.Location(47.1598, 27.5872),  // Iasi
        zoom: 12
    });

    // get click lat. and long.
    Microsoft.Maps.Events.addHandler(map, 'click', function (e) {
        if (e.targetType == "map") {
        var point = new Microsoft.Maps.Point(e.getX(), e.getY());
        var loc = e.target.tryPixelToLocation(point);
        var location = new Microsoft.Maps.Location(loc.latitude, loc.longitude);
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
        route();
    }

    // show pushpin and infobox of a location
    var leter = 65;
    function pinInfo(adresa, latidutine, longitudine) {
        var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(latidutine, longitudine), 
                        {text: String.fromCharCode(leter), color: "blue", enableHoverStyle: true, draggable: true, enableClickedStyle: true});
        map.entities.push(pushpin);

        Microsoft.Maps.Events.addHandler(pushpin, 'click', function () {
            var pin_fixed = pushpin.getDraggable();
            if (pin_fixed == true)
                pushpin.setOptions({ draggable: false});
            else
                pushpin.setOptions({ draggable: true});
        });

        Microsoft.Maps.Events.addHandler(pushpin, 'dblclick', function () {
            map.entities.remove(pushpin);
            document.getElementById('p'+pushpin.getText()).style.display = "none";
            map.layers.clear();
            route();
        });

        Microsoft.Maps.Events.addHandler(pushpin, 'dragend', function () {
            searchAddress(pushpin.getLocation().latitude, pushpin.getLocation().longitude, pushpin.getText());
            map.layers.clear();
            route();
        });

        document.getElementById('printoutPanel').innerHTML += "<p id='p" + String.fromCharCode(leter) + "'>" + String.fromCharCode(leter).bold() + ": " + adresa + "</p>";

        // todo refolosire litere scoase pe aceleasi pozitii

        leter += 1;
    }
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', route);
    
    function route() {
        var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        // Set Route Mode to driving
        directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });
        
        for (var i = 0; i < map.entities.getLength(); i++) {
            var pushpin = map.entities.get(i);
            if (pushpin instanceof Microsoft.Maps.Pushpin) {
                var waypoint = new Microsoft.Maps.Directions.Waypoint({ /*address: 'Redmond',*/ location: pushpin.getLocation() });
                directionsManager.addWaypoint(waypoint);
            }
        }

        // Set the element in which the itinerary will be rendered
        // directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('printoutPanel') });
        directionsManager.calculateDirections();
    }
}