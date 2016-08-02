/**
 * Created by Patrick on 29.06.2016.
 */

var musicListController = {};
musicListController.currentSorting = "title";
musicListController.sortDirection = 0;

musicListController.init = function () {
    musicListController.clearSearchBox();
    $("#search-clear-btn").click(musicListController.clearSearchBox);

    var searchBox = $("#search-box");
    searchBox.focusin(musicListController.focusSearchBox);
    searchBox.focusout(musicListController.unfocusSearchBox);
    searchBox.keyup(musicListController.searchBoxChange);

    $("#view-music-sort-menu").find("a").click(musicListController.sortChange);
};

musicListController.show = function (subview) {

};

musicListController.newLibrary = function () {
    musicListController.refreshTrackList();

    $("#music-list-track-" + connect.status.currentTrackId).addClass("active");

    musicListController.filterList($("#search-box").val());
};

/**
 *
 * @param {String} [sortBy]
 * @param {number} [sortDirection]
 */
musicListController.refreshTrackList = function (sortBy, sortDirection) {
    if (!sortBy) {
        sortBy = musicListController.currentSorting;
    }
    if (sortDirection === undefined) {
        sortDirection = musicListController.sortDirection;
    }

    var trackMap = connect.status.tracks;
    var source = $("#music-list-item-template").html();
    var template = Handlebars.compile(source);

    var list = $("#view-music-list");
    list.find(".track-item").remove();

    var tracks = [];
    trackMap.forEach(function (value) {
        tracks.push(value);
    });

    tracks.sort(util.getSortFunc(sortBy, sortDirection));

    tracks.forEach(function (value) {
        list.append(template(value));
    });

    list.find(".list-group-item").click(function () {
        var el = $(this);
        var id = el.data("id");
        connect.send(new Command().playId(id));
    });
};

/**
 *
 * @param {Event} e
 */
musicListController.sortChange = function (e) {
    e.preventDefault();
    var el = $(e.target);
    $("#view-music-sort-btn").find(".value").text(el.text());
    musicListController.refreshTrackList(el.data("attr"), el.data("reverse"));
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