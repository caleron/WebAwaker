/**
 * Created by Patrick on 29.06.2016.
 */

var musicListController = {};

musicListController.init = function () {

};

musicListController.show = function (subview) {

};

musicListController.newLibrary = function () {
    var tracks = connect.status.tracks;

    var source = $("#music-list-item-template").html();
    var template = Handlebars.compile(source);

    var list = $("#view-music-list");

    tracks.forEach(function (value, key) {
        list.append(template(value));
    });

    list.find(".list-group-item").click(function () {
        var el = $(this);
        var id = el.data("id");
        $("#view-music-list").find(".active").removeClass("active");

        el.addClass("active");
        connect.send(new Command().playId(id));
    });
};