/**
 * Created by Patrick on 29.06.2016.
 */

var musicListController = {};
musicListController.currentSorting = "title";
musicListController.sortDirection = 0;
musicListController.currentSubView = "";
musicListController.invalidateSubview = {"track": true, "artist": true, "album": true, "playlist": true};

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
    musicListController.currentSubView = subview;
    $("#view-music").find(".subview").hide();
    $("#view-music-" + subview + "-list").show();

    musicListController.refreshFilterOptions();

    if (musicListController.invalidateSubview[subview] === true) {
        musicListController.invalidateSubview[subview] = false;
        musicListController.refreshCurrentList(subview);
    }
    musicListController.filterList();
};

musicListController.refreshCurrentList = function (sortBy, sortDirection) {
    switch (musicListController.currentSubView) {
        case "track":
            var map = connect.status.tracks;
            var id = "#music-list-track-item-template";
            break;

        case "artist":
            map = connect.status.artists;
            id = "#music-list-artist-item-template";
            break;

        case "album":
            map = connect.status.albums;
            id = "#music-list-album-item-template";
            break;

        case "playlist":
            map = connect.status.playLists;
            id = "#music-list-playlist-item-template";
            break;
        default:
            return;
    }
    var list = $("#view-music-" + musicListController.currentSubView + "-list");
    var template = Handlebars.compile($(id).html());
    musicListController.refreshList(list, map, sortBy, sortDirection, template);
};

/**
 * Wird ausgelöst, wenn eine neue Library vorhanden ist.
 */
musicListController.newLibrary = function () {
    for (var key in musicListController.invalidateSubview) {
        if (musicListController.invalidateSubview.hasOwnProperty(key)) {
            musicListController.invalidateSubview[key] = true;
        }
    }
    if (viewController.currentView == "music") {
        musicListController.show(musicListController.currentSubView);
        musicListController.filterList($("#search-box").val());
    }
};


/**
 * Erzeugt eine Liste.
 * @param list
 * @param map
 * @param {String} [sortBy]
 * @param {number} [sortDirection]
 * @param template
 */
musicListController.refreshList = function (list, map, sortBy, sortDirection, template) {
    if (!sortBy) {
        sortBy = musicListController.currentSorting;
    }
    if (sortDirection === undefined) {
        sortDirection = musicListController.sortDirection;
    }

    list.find(".track-item").remove();

    var items = [];
    map.forEach(function (value) {
        items.push(value);
    });

    items.sort(util.getSortFunc(sortBy, sortDirection));

    items.forEach(function (value) {
        list.append(template(value));
    });

    if (connect.status.currentTrackId >= 0) {
        $("#music-list-track-" + connect.status.currentTrackId).addClass("active");
    }
    list.find(".list-group-item").click(musicListController.itemClick);
};

musicListController.itemClick = function () {
    var el = $(this);
    var type = el.data("type");
    if (type == "track") {
        var id = el.data("id");
        new Command().playId(id).send();
    } else {
        var modal = $("#modal-music-detail");
        modal.modal("show");
        var list = $("#modal-music-list");
        list.find(".track-item").remove();

        if (type == "artist") {
            var artist = el.data("artist");
            modal.find(".modal-title").text(artist);

            var template = Handlebars.compile($("#modal-music-details-item-template").html());
            var items = connect.status.artists.get(artist + "").trackList;

            items.forEach(function (value) {
                value.type = "track";
                list.append(template(value));
            });
        } else if (type == "album") {
            var album = el.data("album");
            modal.find(".modal-title").text(album);

            template = Handlebars.compile($("#music-list-track-item-template").html());
            items = connect.status.albums.get(album + "").trackList;

            items.forEach(function (value) {
                list.append(template(value));
            });
        } else if (type == "playlist") {
            var playlist = el.data("title");
            modal.find(".modal-title").text(playlist);

            template = Handlebars.compile($("#music-list-track-item-template").html());
            items = connect.status.playLists.get(playlist + "").trackList;

            items.forEach(function (value) {
                list.append(template(value));
            });
        }
        list.find(".list-group-item").click(musicListController.itemClick);
    }
};

/**
 *
 * @param {Event} e
 */
musicListController.sortChange = function (e) {
    e.preventDefault();
    var el = $(e.target);
    musicListController.applySortingToBtn(el);
    musicListController.refreshCurrentList(el.data("attr"), el.data("reverse"));
};

musicListController.searchBoxChange = function () {
    musicListController.filterList($("#search-box").val());
};

musicListController.refreshFilterOptions = function () {
    var options = $("#view-music-sort-menu").children();
    var attr = [];
    switch (musicListController.currentSubView) {
        case "track":
            attr = ["title", "artist"];
            break;
        case "artist":
            attr = ["artist"];
            break;
        case "album":
            attr = ["album", "artist"];
            break;
        case "playlist":
            attr = ["title"];
            break;
    }

    var firstVisibleOption;
    options.each(function (index, el) {
        var link = $(el).find("a");
        if (attr.indexOf(link.data("attr")) >= 0) {
            link.parent().show();

            if (firstVisibleOption == undefined) {
                firstVisibleOption = link;
            }
        } else {
            link.parent().hide();
        }
    });

    if (firstVisibleOption != undefined) {
        musicListController.applySortingToBtn(firstVisibleOption);
    }
};

musicListController.applySortingToBtn = function (el) {
    var btn = $("#view-music-sort-btn").find(".value");
    btn.text(el.text());
    btn.data("attr", el.data("attr"));
    musicListController.currentSorting = el.data("attr");
    musicListController.sortDirection = el.data("reverse");
};

/**
 * Wendet Filter auf die Track-Liste an, indem Sie nicht zum Filter passende Einträge ausblendet.
 * @param filter
 */
musicListController.filterList = function (filter) {
    util.clearSelections();
    var list = $("#view-music-" + musicListController.currentSubView + "-list");
    var dummy = list.find(".dummy");
    var items = list.find("a");

    if (filter == undefined || filter.length == 0) {
        items.show();
        if (items.length > 0) {
            dummy.hide();
        }
        return;
    }

    filter = filter.toLowerCase();
    var allHidden = true;

    //durch alle Items der Liste iterieren
    items.each(function (index, el) {
        if (el.classList.contains("dummy")) {
            return;
        }

        var $el = $(el);
        var title = $el.data("title") + "" || "";
        var artist = $el.data("artist") + "" || "";
        title = title.toLowerCase();
        artist = artist.toLowerCase();

        var titleIndex = title.indexOf(filter);
        var artistIndex = artist.indexOf(filter);

        //gefundenen text markieren oder Item verstecken, falls Text nicht vorhanden
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
        dummy.show()
    } else {
        dummy.hide()
    }
};

musicListController.newTrack = function () {
    var el = $("#music-list-track-" + connect.status.currentTrackId);

    $("#view-music-track-list").find(".active").removeClass("active");

    el.addClass("active");
};

musicListController.unfocusSearchBox = function () {

};

musicListController.clearSearchBox = function () {
    $("#search-box").val("");
    musicListController.filterList();
};

musicListController.focusSearchBox = function () {
    if (viewController.currentView != "music") {
        viewController.showView("music", "track");
    }
};