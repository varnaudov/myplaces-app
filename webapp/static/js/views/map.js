/**
 * Display results on a map, instead of the list
 * Puts marker for each location
 * Calculates the bounds and pans the map to the full marker view
 */
window.MapView = Backbone.View.extend({

    initialize: function () {
        //render all
        this.render();
        this.activate();
        this.showMarkers();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    showMarkers: function() {
    	var self = this;
    	bounds = new google.maps.LatLngBounds();
    	this.model.each(this.addMarker, self);
    },

    addMarker: function(myplace) {
    	var self = this;
    	console.debug("displaying "+myplace.attributes.name);
    	var myPos = new google.maps.LatLng(myplace.attributes.latitude, myplace.attributes.longitude);
        //show a marker on-screen
        var marker = new google.maps.Marker({
	          map: map,
	          animation: google.maps.Animation.DROP,
	          position: myPos,
	          title: "mymarkername",
	          draggable: false
	      });
        console.debug("mypos: "+myPos)
        bounds.extend(myPos);
    	map.fitBounds(bounds);
	    //take care of issue 1448 when repositioning existing map
    	idleChangeBoundsListener =
    	    google.maps.event.addListenerOnce(map, 'idle', function(event) {
    	    	map.setCenter(map.getBounds().getCenter());
    	        map.setZoom(2);
    	        map.panToBounds(map.getBounds());
		        google.maps.event.trigger(map, 'resize');
    	});
    	//setTimeout(function(){google.maps.event.removeListener(idleChangeBoundsListener)}, 2000);
    },

    activate: function() {
    	//set current location
    	var myLoc = new google.maps.LatLng();

        var mapOptions = {
                  zoom: 13,
                  center: myLoc,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };

        var domElement = this.$('#mapholder');

        // Enable the visual refresh
        google.maps.visualRefresh = true;

        //initialize the map element
        map = new google.maps.Map(domElement[0],mapOptions);

        map.setCenter(myLoc);
    }
});