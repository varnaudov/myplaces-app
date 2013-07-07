/**
 * The 'card-view' list of items; TODO get rid of magic number for pagination
 */
window.PlaceListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var places = this.model.models;
        var len = places.length;
        //TODO the magic number of 8 is getting around
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new PlaceListItemView({model: places[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, page: this.options.page}).render().el);

        return this;
    }
});