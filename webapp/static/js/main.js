/**
 * Our web-app for displaying myPlaces info
 */
var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  	: "list",
        "places/:id"       		: "placeDetails",
        "add"     		    	: "addPlace",
        "myplaces/page/:page"	: "list",
        "map"               	: "map"
    },

    /**
     * Nothing special in our constructor, load up the header
     */
    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },


    /**
     * Display a paged list of items, and also unset header button selection
     */
	list: function(page) {

		//TODO remove the magic number of eight per page
        var p = page ? parseInt(page, 10) : 1;
        console.debug("parseint "+p)
        var placeList = new MyPlaceCollection();
        var handlers = {
                "success": function() {
                	$("#content").html(new PlaceListView({model: placeList, page: p}).el);
                }
             };

        placeList.fetch(handlers);
        this.headerView.selectMenuItem('home-menu');
    },

    /**
     * Routes us to details for a place
     */
    placeDetails: function (id) {
        var placePoi = new MyPlace({id: id});
        placePoi.fetch({success: function(){
            $("#content").html(new PlaceView({model: placePoi}).el);
        }});
        this.headerView.selectMenuItem();
    },

    /**
     * Add a new place
     */
	addPlace: function() {
        var newpoi = new MyPlace();
        $('#content').html(new PlaceView({model: newpoi}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    /**
     * Display all places on a map, setting its model
     */
    map: function () {
        var placesList = new MyPlaceCollection();
        var handlers = {
                "success": function() {
                	$("#content").html(new MapView({model: placesList}).el);
                }
             };
        this.headerView.selectMenuItem('map-menu');
        placesList.fetch(handlers);
    }
});

/**
 * @author varnaudov
 * Clean up on close up shop
 */
Backbone.View.prototype.close = function () {
    console.debug('Closing view ' + this);

    this.remove();
    this.unbind();
};

/**
 * Include the HTML-part of our views, and call us when done
 * @param views
 * @param callback
 */
function loadViews(views, callback) {

    var viewLoad = [];

    $.each(views, function(index, view) {
        if (window[view]) {
        	viewLoad.push($.get('static/tmpl_include/' + view + '.html', function(data) {
            	//add a template method to each js, so that we can refer to our html includes
                window[view].prototype.template = _.template(data);
            }));
        } else {
            alert(view + " not found");
        }
    });

    $.when.apply(null, viewLoad).done(callback);
}


/**
 * Main app entry-point. Include the templates and start the app
 */
loadViews(['HeaderView', 'PlaceView', 'PlaceListItemView', 'MapView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});