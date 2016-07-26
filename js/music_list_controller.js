/**
 * Created by Patrick on 29.06.2016.
 */

var musicListController = {};

musicListController.init = function () {
    musicListController.clearSearchBox();
    $("#search-clear-btn").click(musicListController.clearSearchBox);

    var searchbox = $("#search-box");
    searchbox.focusin(musicListController.focusSearchBox);
    searchbox.focusout(musicListController.unfocusSearchBox);
    searchbox.keyup(musicListController.searchBoxChange);
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

    $("#music-list-track-" + connect.status.currentTrackId).addClass("active");

    list.find(".list-group-item").click(function () {
        var el = $(this);
        var id = el.data("id");
        connect.send(new Command().playId(id));
    });

    musicListController.filterList($("#search-box").val());
};

musicListController.searchBoxChange = function () {
    musicListController.filterList($("#search-box").val());
};

musicListController.filterList = function (filter) {
    util.clearSelections();

    if (filter == undefined || filter.length == 0) {
        var elements = $("#view-music-list").find("a");
        elements.show();
        if (elements.length > 0) {
            $("#music-list-dummy").hide();
        }
        return;
    }
    filter = filter.toLowerCase();

    var items = $("#view-music-list").find("a");
    var allHidden = true;
    items.each(function (index, el) {
        if (el.id == "music-list-dummy") {
            return;
        }

        var $el = $(el);
        var title = $el.data("title") + "" || "";
        var artist = $el.data("artist") + "" || "";
        title = title.toLowerCase();
        artist = artist.toLowerCase();

        var titleIndex = title.indexOf(filter);
        var artistIndex = artist.indexOf(filter);

        if (titleIndex !== -1 || artistIndex !== -1) {
            $el.show();
            if (titleIndex !== -1) {
                $el.find("h4").selectText(titleIndex, filter.length);
            }
            if (artistIndex !== -1) {
                $el.find("span").selectText(artistIndex, filter.length);
            }
            allHidden = false;
        } else {
            $el.hide();
        }
    });

    if (allHidden) {
        $("#music-list-dummy").show()
    } else {
        $("#music-list-dummy").hide()
    }
};

musicListController.newTrack = function () {
    var el = $("#music-list-track-" + connect.status.currentTrackId);

    $("#view-music-list").find(".active").removeClass("active");

    el.addClass("active");
};

musicListController.unfocusSearchBox = function () {

};

musicListController.clearSearchBox = function () {
    $("#search-box").val("");
    musicListController.filterList();
};

musicListController.focusSearchBox = function () {
    viewController.showView("music", "tracks");
};