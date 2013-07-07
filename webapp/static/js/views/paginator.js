/**
 * Handles pagination
 * TODO hide pagination when DB is empty, as it can be visually non-pleasing
 */
window.Paginator = Backbone.View.extend({

    className: "pagination pagination-centered",

    initialize:function () {
        this.model.bind("reset", this.render, this);
        this.render();
    },

    render:function () {
        var items = this.model.models;
        var len = items.length;
        console.debug("Page found "+len+" items.")
        var pageCount = Math.ceil(len / 8); //4 addresses per page seems sane

        $(this.el).html('<ul />');

        for (var i=0; i < pageCount; i++) {
            $('ul', this.el).append("<li" + ((i + 1) === this.options.page ? " class='active'" : "") + "><a href='#myplaces/page/"+(i+1)+"'>" + (i+1) + "</a></li>");
        }

        return this;
    }
});