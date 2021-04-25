function loadMapScenario() {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        /* No need to set credentials if already passed in URL */
        center: new Microsoft.Maps.Location(47.1598, 27.5872),  // Iasi
        zoom: 12
    });

    Microsoft.Maps.Events.addHandler(map, 'click', function (e) {
        if (e.targetType == "map") {
        var point = new Microsoft.Maps.Point(e.getX(), e.getY());
        var loc = e.target.tryPixelToLocation(point);
        var location = new Microsoft.Maps.Location(loc.latitude, loc.longitude);
        }

        searchAddress(loc.latitude, loc.longitude);
    });

    Microsoft.Maps.loadModule('Microsoft.Maps.Search');
    // search address by a point on the map
    function searchAddress(lat, lon) {
        var adresa;
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);
        var reverseGeocodeRequestOptions = {
            location: new Microsoft.Maps.Location(lat, lon),
            callback: function (answer, userData) {
                map.setView({ bounds: answer.bestView });
                document.getElementById('printoutPanel').innerHTML =
                    answer.address.formattedAddress;

                adresa = answer.address.formattedAddress.split(" ");
                adresa = adresa[adresa.length - 2] + ' ' + adresa[adresa.length - 1];
                pinInfo(adresa, lat, lon);

                // document.getElementById('printoutPanel').innerHTML = adresa;
            }
        };
        searchManager.reverseGeocode(reverseGeocodeRequestOptions);
    }

    var nume_oras, latidutine, longitudine;
    
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
        map.entities.clear();
        map.setView({ bounds: suggestionResult.bestView });
        var pushpin = new Microsoft.Maps.Pushpin(suggestionResult.location);
        map.entities.push(pushpin);
        
        nume_oras = suggestionResult.formattedSuggestion;
        latidutine = suggestionResult.location.latitude;
        longitudine = suggestionResult.location.longitude;
        pinInfo(nume_oras, latidutine, longitudine);
        
        document.getElementById('printoutPanel').innerHTML = suggestionResult.formattedSuggestion;
    }

    // show pushpin and infobox of a location
    function pinInfo(nume_oras, latidutine, longitudine) {
        var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(latidutine, longitudine), null);
        map.entities.push(pushpin);
        
        var infobox = new Microsoft.Maps.Infobox(
        new Microsoft.Maps.Location(latidutine, longitudine), { 
        title: nume_oras});
        infobox.setMap(map);
       
        // Microsoft.Maps.Events.invoke(pushpin, 'click');
    }
    
}