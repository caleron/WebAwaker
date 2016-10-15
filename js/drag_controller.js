/**
 * Momentan nur für Tracks, Albums, Artists
 */
var dragController = {};

dragController.init = function () {
    dragController.setupDropOnPlayLists();
};

/**
 * Setzt alle Drag-Handler für die aktuelle Subview von der Music View.
 */
dragController.setupDraggingListItems = function () {
    var elements = $("#view-music").find(".subview").find(".track-item");
    elements.each(function (i, el) {
        el.draggable = true;
        el.ondragstart = dragController.onItemDragStart;
    });
};

dragController.setupDropOnPlayLists = function () {
    $("#sidebar-playlist-list").find("li").each(function (i, el) {
        el.ondrop = dragController.onItemDrop;
        el.ondragover = dragController.dragPreventDefault;
    });
};

dragController.onItemDragStart = function (e) {
    var el = $(this);
    e.dataTransfer.setData("data", JSON.stringify(el.data()));
};

dragController.dragPreventDefault = function (e) {
    e.preventDefault();
};

dragController.onItemDrop = function (e) {
    var rawData = e.dataTransfer.getData("data"),
        data,
        addTracks = [];

    if (dragController.eventContainsFiles(e) || rawData == null || rawData.length == 0)
        return;

    data = JSON.parse(rawData);
    console.log(data);
    console.log(e);

    var target = e.target;
    if (target.tagName.toLowerCase() == "a") {
        target = target.parentNode;
    }
    target = $(target);

    switch (data.type) {
        case "track":
            addTracks.push(data.id);
            break;
        case "artist":
            connect.status.artists.get(data.artist).trackList.forEach(function (track) {
                addTracks.push(track.id);
            });
            break;
        case "album":
            connect.status.albums.get(data.album).trackList.forEach(function (track) {
                addTracks.push(track.id);
            });
            break;
        case "playlist":
            addTracks = connect.status.playLists.get(data.option).trackIdList;
            break;
        default:
            return;
    }

    if (target.data("subview") == "queue") {
        new Command().addTracksToQueue(addTracks).send();
    } else {
        new Command().addTracksToPlaylist(target.data("option"), addTracks).send();
    }
};

dragController.eventContainsFiles = function (event) {
    if (event.dataTransfer.types) {
        for (var i = 0; i < event.dataTransfer.types.length; i++) {
            if (event.dataTransfer.types[i] == "Files") {
                return true;
            }
        }
    }
    return false;
};