/**
 * Created by Patrick on 29.06.2016.
 */

var musicListController = {};
musicListController.currentSorting = "title";
musicListController.sortDirection = 0;
musicListController.currentSubView = "";
musicListController.currentPlaylistId = 0;
musicListController.invalidateSubview = {"track": true, "artist": true, "album": true, "playlist": true, "queue": true};

musicListController.modalDisplayType = "";
musicListController.modalDisplayTypeData = "";

/**
 * Initialisiert den Controller, indem Handler zugewiesen werden.
 */
musicListController.init = function () {
    musicListController.clearSearchBox();
    $("#search-clear-btn").click(musicListController.clearSearchBox);

    var searchBox = $("#search-box");
    searchBox.focusin(musicListController.focusSearchBox);
    searchBox.focusout(musicListController.unfocusSearchBox);
    searchBox.keyup(musicListController.searchBoxChange);

    $("#view-music-sort-menu").find("a").click(musicListController.sortChange);
    $("#modal-music-detail-play-btn").click(musicListController.modalPlayClick);
};

/**
 * Zeigt die music-View mit der angegebenen Subview an.
 * @param {String} subview Die zu zeigende Subview.
 * @param {String} [data] zusätzliche Daten, etwa die ID der Playlist
 */
musicListController.show = function (subview, data) {
    musicListController.currentSubView = subview;
    $("#view-music").find(".subview").hide();
    $("#view-music-" + subview + "-list").show();

    musicListController.refreshSortOptions();

    if (subview == "playlist") {
        musicListController.currentPlaylistId = data;
    }

    if (musicListController.invalidateSubview[subview] === true) {
        musicListController.invalidateSubview[subview] = false;
        musicListController.refreshCurrentList();
    } else if (subview == "playlist" || subview == "queue") {
        //Playlist und Queue immer updaten
        musicListController.refreshCurrentList();
    }
    musicListController.filterList();
};

/**
 * Baut die aktuelle Subview neu auf. Berücksichtigt dabei Sortierung, wenn angegeben.
 * @param {String} [sortBy] Attribut, nach dem sortiert werden soll.
 * @param {int} [sortDirection] 0 für Normal, 1 für umgekehrt.
 */
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
            map = connect.status.playLists.get(musicListController.currentPlaylistId).trackList;
            id = "#music-list-track-item-template";
            sortBy = "nix";
            break;

        case "queue":
            var arr = connect.status.trackQueue;
            map = new Map();
            for (var i = 0; i < arr.length; i++) {
                map.set(i, connect.status.tracks.get(arr[i]));
            }
            id = "#music-list-track-item-template";
            sortBy = "nix";
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

    //playlists in sidebar aktualisieren
    var sidebar = $("#sidebar-playlist-list");
    sidebar.find(".sidebar-playlist-item").remove();

    var template = Handlebars.compile($("#sidebar-playlist-list-item-template").html());
    connect.status.playLists.forEach(function (playlist) {
        sidebar.append(template(playlist));
    });
};

musicListController.newStatus = function (status) {
    if (viewController.currentView == "music" && musicListController.currentSubView == "queue") {
        musicListController.refreshCurrentList();
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

    if (sortBy != "nix") {
        items.sort(util.getSortFunc(sortBy, sortDirection));
    }

    items.forEach(function (value) {
        list.append(template(value));
    });

    if (connect.status.currentTrackId >= 0) {
        $(".track-" + connect.status.currentTrackId).addClass("active");
    }
    list.find(".list-group-item").click(musicListController.itemClick);
};

/**
 * Wird bei einem Klick auf ein Listeneintrag ausgelöst.
 */
musicListController.itemClick = function () {
    var el = $(this);
    var type = el.data("type");
    if (type == "track") {
        var id = el.data("id");
        var context = el.data("context");

        if (context == "album" || context == "artist" || context == "playlist") {
            var items, name;
            if (context == "album") {
                name = el.data("album") + "";
                items = connect.status.albums.get(name).trackList;
            } else if (context == "artist") {
                name = el.data("artist") + "";
                items = connect.status.artists.get(name).trackList;
            } else {
                name = el.data("contextData") + "";
                items = connect.status.playLists.get(name).trackList;
            }
            var idList = [];
            items.forEach(function (el) {
                idList.push(el.id);
            });
            new Command().playIdList(idList, name, id).send();
        } else {
            new Command().playId(id).send();
        }
    } else {
        var modal = $("#modal-music-detail"),
            baseObject,
            list = $("#modal-music-list");

        modal.modal("show");
        list.find(".track-item").remove();
        musicListController.modalDisplayType = type;

        if (type == "artist") {
            name = el.data("artist").toString();
            modal.find(".modal-title").text(name);

            var template = Handlebars.compile($("#modal-music-details-item-template").html());
            items = connect.status.artists.get(name).trackList;

            baseObject = {type: "track", context: "artist"};
        } else if (type == "album") {
            name = el.data("album").toString();
            modal.find(".modal-title").text(name);

            template = Handlebars.compile($("#modal-music-details-item-template").html());
            items = connect.status.albums.get(name).trackList;

            baseObject = {type: "track", context: "album"};
        } else if (type == "playlist") {
            name = el.data("title").toString();
            modal.find(".modal-title").text(name);

            template = Handlebars.compile($("#music-list-track-item-template").html());
            items = connect.status.playLists.get(name).trackList;

            baseObject = {context: "playlist", contextData: name};
        }
        musicListController.modalDisplayTypeData = name;

        items.forEach(function (value) {
            list.append(template($.extend({}, baseObject, value)));
        });
        list.find(".list-group-item").click(musicListController.itemClick);
    }
};

musicListController.modalPlayClick = function () {
    if (musicListController.modalDisplayType == "artist" || musicListController.modalDisplayType == "album") {
        var items = connect.status[musicListController.modalDisplayType + "s"]
            .get(musicListController.modalDisplayTypeData).trackList;

        var idList = [];
        items.forEach(function (el) {
            idList.push(el.id);
        });
        new Command().playIdList(idList, name).send();
    } else {
        new Command().playPlaylist(connect.status.playLists.get(musicListController.modalDisplayTypeData).id).send();
    }
};

/**
 * Wird bei einem Klick auf eine andere Sortieroption ausgelöst.
 * @param {Event} e
 */
musicListController.sortChange = function (e) {
    e.preventDefault();
    var el = $(e.target);
    musicListController.applySortingToBtn(el);
    musicListController.refreshCurrentList(el.data("attr"), el.data("reverse"));
};

/**
 * Wird ausgelöst, wenn der Suchtext geändert wird.
 */
musicListController.searchBoxChange = function () {
    musicListController.filterList($("#search-box").val());
};

/**
 * Passt die angebotenen Sortieroptionen der aktuellen Subview an.
 */
musicListController.refreshSortOptions = function () {
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
        case "queue":
            //so lassen
            break;
    }

    if (attr.length == 0) {
        $("#view-music-sort-box").hide();
        return;
    } else {
        $("#view-music-sort-box").show();
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

/**
 * Setzt die Option el als aktive Sortierung.
 * @param {jQuery} el Die angeklickte Sortieroption.
 */
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
        if (items.length > 1) {
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
        var album = $el.data("album") + "" || "";

        var titleIndex = title.toLowerCase().indexOf(filter);
        var artistIndex = artist.toLowerCase().indexOf(filter);
        var albumIndex = album.toLowerCase().indexOf(filter);

        //gefundenen text markieren oder Item verstecken, falls Text nicht vorhanden
        switch ($el.data("type")) {
            case "track":
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
                break;
            case "album":
                if (albumIndex !== -1 || artistIndex !== -1) {
                    $el.show();
                    if (albumIndex !== -1) {
                        $el.find("h4").selectText(albumIndex, filter.length);
                    }
                    if (artistIndex !== -1) {
                        $el.find("span").selectText(artistIndex, filter.length);
                    }
                    allHidden = false;
                } else {
                    $el.hide();
                }
                break;
            case "artist":
                if (artistIndex !== -1) {
                    $el.show();
                    if (artistIndex !== -1) {
                        $el.selectText(artistIndex, filter.length);
                    }
                    allHidden = false;
                } else {
                    $el.hide();
                }
                break;
        }
    });

    if (allHidden) {
        dummy.show()
    } else {
        dummy.hide()
    }
};

/**
 * Wird ausgelöst, wenn ein neuer Track abgespielt wird. Markiert den aktuellen Track als aktiv.
 */
musicListController.newTrack = function () {
    var el = $(".track-" + connect.status.currentTrackId);

    $("#view-music").find(".active").filter(".track-item").removeClass("active");

    el.addClass("active");
};

musicListController.unfocusSearchBox = function () {

};

/**
 * Wird bei einem Klick auf das X in der Suchbox ausgelöst. Entfernt den aktuellen Filter und leert die Suchbox.
 */
musicListController.clearSearchBox = function () {
    $("#search-box").val("");
    musicListController.filterList();
};

/**
 * Wird ausgelöst, wenn die Suchbox fokussiert wird. Zeigt die music-View an, falls sie noch nicht angezeigt wird.
 */
musicListController.focusSearchBox = function () {
    if (viewController.currentView != "music") {
        viewController.showView("music", "track");
    }
    musicListController.filterList($("#search-box").val());
};