/**
 * Show our header and also handle search events
 */
window.HeaderView = Backbone.View.extend({

    initialize: function () {
    	this.result = new MyPlaceCollection();
    	this.resultView = new PlaceSearchListView({model: this.result, name: "searchdropdown", className: 'dropdown-menu'});
        this.render();
        // remove search box on clicking away
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
    },

    render: function () {
        $(this.el).html(this.template());
        $('.navbar-search', this.el).append(this.resultView.render().el);
        return this;
    },

    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    },

    events: {
        "keyup .search-query": "search",
        "keypress .search-query": "onkeypress"
    },

    search: function () {
        var key = $('#searchText').val();
        console.log('search ' + key);
        this.result.searchName(key);
        setTimeout(function () {
            $('.navbar-search').addClass('open');
        });
    },

    onkeypress: function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    },

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});