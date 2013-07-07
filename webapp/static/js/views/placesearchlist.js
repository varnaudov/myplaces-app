/**
 * Display a list of search-results
 */
window.PlaceSearchListView = Backbone.View.extend({

    tagName:'ul',

    className:'nav nav-list',

    initialize:function () {
        var self = this;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", function (myplace) {
            $(self.el).append(new PlaceListItemView({model:myplace}).render().el);
        });
    },

    render:function () {
        $(this.el).empty();
        _.each(this.model.models, function (myplace) {
            $(this.el).append(new PlaceListItemView({model:myplace}).render().el);
        }, this);
        return this;
    }
});