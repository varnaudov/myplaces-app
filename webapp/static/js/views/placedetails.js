/**
 * Showing the details of a place
 * Has options to change the name and address
 * Does client side validation for name/address when saving model
 * Whenever the address field button is changed or marker is moved, it is sent for geolocation
 * If we are adding a new location, try to use the browser's geolocation ability for the initial location
 * Shows the results on a map as well
 */
window.PlaceView = Backbone.View.extend({

    initialize: function () {
        //render all
        this.render();
        //bind our model to the user input
        this.model.bind('change:name',this.render,this);
    },

    /**
     * Renders the view and initializes the map
     * @returns a render
     */
    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        //render the minimap
        this.initializeMap();

        return this;
    },


    /**
     * Events we care about: save,delete,find button (& enter key), and model change
     */
    events: {
        "change"        : "change",
        "click .locate" : "codeAddress",
        "keypress input[type=text]" : "locateOnEnter",
        "click .save"   : "preSave",
        "click .delete" : "deletePlace",
    },

    /**
     * Handle return key when searching an address
     * @param event
     */
    locateOnEnter: function(event) {
    	if (event.keyCode != 13) {
    		return;
    	}
    	this.codeAddress();
    },

    /**
     * Handle any model changes (i.e. validate)
     * @param event
     */
    change: function (event) {
        // Apply the change to the model
        var target = event.target;
        // Hide all alerts
        validation.hideAlert();

        var change = {};
        change[target.name] = target.value;
        //set from the user input
        this.model.set(change);

        // validate changes
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            validation.addValidationError(target.id, check.message);
        } else {
            validation.removeValidationError(target.id);
        }
    },

    /**
     * Ensure we are valid before continuing with save; do not change the view
     * @returns {Boolean}
     */
    preSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            validation.displayValidationErrors(check.messages);
            return false;
        }
        this.savePlace();
        return false;
    },

    /**
     * Perform the save to the model
     */
    savePlace: function () {
        //and also from our geolocation
        var latLng = marker.getPosition();
		var lat = latLng.lat();
		var lng = latLng.lng();
        this.model.set({latitude: lat, longitude: lng});
        console.debug('LATLNG ' +lat + ' to: ' + lng);

    	console.debug("trying to save "+this.model.attributes.latitude)
        var self = this;
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('places/' + model.id, false);
                validation.showAlert('Success!', 'POI saved successfully', 'alert-success');
            },
            error: function () {
                validation.showAlert('Error', 'Could not save POI', 'alert-error');
            }
        });
    },

    /**
     * Delete a place and go back
     * @returns {Boolean}
     */
    deletePlace: function () {
        this.model.destroy({
            success: function () {
            	//TODO may need to unblur; sporadic bug I see with deletions
                window.history.back();
            }
        });
        return false;
    },

    /**
     * Display our current location
     */
    getCurrentLocation: function() {
    	var self = this;
        // Try HTML5 geolocation; TODO only execute when adding a new one
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(self.showAddressMarker, self.failLocation);
        } else {
          // Browser doesn't support Geolocation
          self.failLocation();
        }
        return false;
    },

    /**
     * Handle where we cannot do geolocation
     */
    failLocation: function(){
    	console.log("The browser does not handle geolocation");
    },


    /**
     * Initialize the google map object,
     */
    initializeMap: function() {
    	console.debug("initializing details map...");
    	//TODO use async loading of googlemaps js if time permits

    	//set current location
    	var myLoc = new google.maps.LatLng(
      		  this.model.attributes.latitude,
      		  this.model.attributes.longitude);
    	console.debug("loc: "+myLoc);
        var mapOptions = {
                  zoom: 15,
                  center: myLoc,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };

        var domElement = this.$('#googleMapBox');

        // Enable the visual refresh
        google.maps.visualRefresh = true;

        //save the model
        model = this.model;

        //initialize the map element
        map = new google.maps.Map(domElement[0],mapOptions);//domElement[0]

        //initialize the geocoder
        geocoder = new google.maps.Geocoder();

        //show a marker on-screen
        marker = new google.maps.Marker({
	          map: map,
	          animation: google.maps.Animation.DROP,
	          position: myLoc,
	          title: "markername",
	          draggable: true
	      });
        map.setCenter(myLoc);

        //geolocate if we don't have a location
        if (this.model.id == null) {
        	console.debug("Adding new location...");
        	this.getCurrentLocation();
        	var myLoc2 = new google.maps.LatLng(
            		  this.model.attributes.latitude,
            		  this.model.attributes.longitude);
          	console.debug("loc2: "+myLoc2);
        }


	    //add listener for current dragged on position and also when the title changes
	    google.maps.event.addListener(marker,'dragend',this.updateMarkerPosition);
	    google.maps.event.addListener(marker,'title_changed',this.updateMarkerPosition);

	    //take care of issue 1448 when repositioning existing map
	    google.maps.event.addListenerOnce(map, "idle", function(){
	        map.setCenter(marker.getPosition());
	        google.maps.event.trigger(map, 'resize');
	        map.panTo(marker.getPosition());
	    });
    },

    /**
     * Geocode an address using the geocoder service, show marker on map
     * TODO if time permits, create a facade for geocoding results in the backend
     * @returns {Boolean}
     */
    codeAddress: function(position) {
    	var self = this;
    	  var address = this.$('#address')[0].value;

    	  geocoder.geocode( { 'address': address}, function(results, status) {
    		  console.debug("Attempting geocode; entered address is: "+address);
    	    if (status == google.maps.GeocoderStatus.OK) {
    	    	self.showAddressMarker(results[0]);
    	    } else {
    	      console.debug('Geocode was not successful for the following reason: ' + status);
    	    }
    	  });
    	  this.model.set({address: address});
	      this.model.trigger('change');
    	  //do not exit the form
    	  return false;
    },


    /**
     * Set the marker address to the proper position
     * @param position
     * @returns {Boolean}
     */
    showAddressMarker: function(position) {
    	var self = this;
    	var mypos = position;
    	//handle if we get the coordinates from the browser (add case)
    	if (position.coords != null) {
            mypos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);
            map.setCenter(mypos);
            marker.setPosition(mypos);
            console.debug("Browser location got us: "+mypos);
            marker.setTitle("You are currently here");
    	} else {
    		map.setCenter(mypos.geometry.location);
    	}
		var latLng = map.getCenter();
		var lat = latLng.lat();
		var lng = latLng.lng();
		console.debug("geocoded lat: "+lat+" long: "+lng);
	    //allow the user to see the location chosen better
	    map.setZoom(15);
	    marker.setPosition(latLng);
	    return false;
    },

    /**
     * Handle marker drags; geocode the new location, so that the user can see where they dragged
     * @param latLng
     */
    updateMarkerPosition: function(latLng) {
    	pos=marker.getPosition();
    	console.debug("dragged on address is: "+pos);
    	geocoder.geocode({
		    latLng: pos
		  }, function(responses) {
		    if (responses && responses.length > 0) {
		    	var newAddr = responses[0].formatted_address;
		    	console.debug("New drag marker address: "+newAddr);
		      	//set the text field
		    	this.$('#address')[0].value=newAddr;
		    	//re-center the map for ease of use in limited viewport
		    	map.setCenter(pos);
		    	model.set({address: newAddr});
		    	//model.trigger('change');
		    } else {
		    	//Display this as a validation error instead (TODO)
		      console.log('Cannot determine address at this location.');
		    }
		  });
    }
});