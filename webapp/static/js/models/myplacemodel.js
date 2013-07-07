/**
 * Our MyPlace model and validation
 * Ideally, we could try to use something like Tornado-Backbone, so that we don't have to do modelling
 * twice, in SQLAlchemy and in Backbone. TODO if time permits (although emitting models is usually tricky)
 * Here we provide some client-side validation of the model fields too
 */
window.MyPlace = Backbone.Model.extend({

    urlRoot: "/api/myplace",

    /**
     * Provide validators for the model; currently, only name & address are being checked
     */
    initialize: function () {

        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "Enter a nickname for your location"};
        };

        this.validators.address = function (value) {
        	console.debug("validating address");
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "Enter a valid address"};
        };
    },

    /**
     * Call our validators for the specified key
     * @param key
     * @returns
     */
    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    /**
     * TODO if time permits, move to an extensible validation framework for the model
     * with a model emitting; for now, validate all fields
     */
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }
        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    /**
     * Set some defaults
     */
    defaults: {
        id: null,
        address: "",
        name: "",
        latitude: 0,
        longitude: 0
    }
});

/**
 * Define a collection for our place model
 */
window.MyPlaceCollection = Backbone.Collection.extend({

    model: MyPlace,

    url: "/api/myplace",

    //flask_restless objects are contained as an sub-array of JSON structure
	parse: function(data) {
		return (data.objects);
	  },

	/**
	 * Do a search by name in the collection
	 * @param name
	 */
	searchName: function(name) {
		var filters = [{"name": "name", "op": "like", "val": '%'+name+'%'}];
		//do the self hack, or we might get incorrect reference
		var self = this;
		$.ajax({
		  url: '/api/myplace',
		  data: {"q": JSON.stringify({"filters": filters})},
		  dataType: "json",
		  contentType: "application/json",
		  success: function(data) {
			  console.debug("search by name retrieved: "+data.objects);
			  self.reset(data.objects);
			  }
		});
	}

});