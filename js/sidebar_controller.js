var sidebarController = {};

sidebarController.init = function () {
    $("#sidebar").find("li").click(sidebarController.sidebarClick);
    $("#modal-control-option-list").find("button").click(sidebarController.serverControlClick);

    $("#nav-show-sidebar-btn").click(sidebarController.toggleSidebar);
    $("#sidebar-add-playlist").click(sidebarController.addPlaylist)
};

sidebarController.newLibrary = function () {
    //playlists in sidebar aktualisieren
    var sidebar = $("#sidebar-playlist-list");
    sidebar.find(".sidebar-playlist-item").remove();

    var template = Handlebars.compile($("#sidebar-playlist-list-item-template").html());
    connect.status.playLists.forEach(function (playlist) {
        sidebar.append(template(playlist));
    });
    sidebar.find(".sidebar-playlist-item").click(sidebarController.sidebarClick);
};

sidebarController.sidebarClick = function () {
    var el = $(this);

    if (el[0].id == "sidebar-hack") {
        $("#modal-control-options").modal("show");
    } else {
        viewController.showView(el.data("view"), el.data("subview"), el.data("option"), el);
    }

    if (ResponsiveBootstrapToolkit.is("xs")) {
        sidebarController.toggleSidebar();
    }
};

sidebarController.addPlaylist = function () {
    var template = Handlebars.compile($("#sidebar-playlist-list-item-template").html());
    var el = $(template({name: "Neue Playlist"}));
    $("#sidebar-playlist-list").append(el);
    var field = el.find("a");
    sidebarController.editPlaylist = field;
    util.clearSelections();

    field.prop("contenteditable", true)
        .css("min-height", "40px")
        .selectText(0, 13)
        .focusout(sidebarController.savePlaylist)
        .keydown(sidebarController.savePlaylistOnEnter)
        [0].focus();
};

sidebarController.savePlaylistOnEnter = function (e) {
    if (e.which == 13) {
        e.preventDefault();
        sidebarController.savePlaylist(e);
    }
};

sidebarController.savePlaylist = function (e) {
    var el = $(e.target);
    var text = el.text();
    if (text.length == 0) {
        //bei leerem text einfach entfernen
        el.parent().remove();
        return;
    }
    if (el.prop("contenteditable") == false) {
        //bereits gesendet
        return;
    }

    el.prop("contenteditable", false);
    var exists = false;
    connect.status.playLists.forEach(function (playlist) {
        if (playlist.name.toLowerCase() == text.toLowerCase()) {
            exists = true;
        }
    });

    if (exists) {
        util.showAlert("Fehler", "Playlist mit diesem Namen existiert bereits", "warning");
    } else {
        new Command().createPlaylist(text).send();
    }
};

sidebarController.serverControlClick = function () {
    var id = $(this)[0].id;

    switch (id) {
        case "modal-control-shutdown-server":
            connect.send(new Command().shutdownServer().send());
            break;
        case "modal-control-reboot-server":
            connect.send(new Command().rebootServer().send());
            break;
        case "modal-control-shutdown-raspi":
            connect.send(new Command().shutdownRaspi().send());
            break;
        case "modal-control-reboot-raspi":
            connect.send(new Command().rebootRaspi().send());
            break;
        default:
            return;
    }
    $("#modal-control-options").modal("hide");
};


sidebarController.toggleSidebar = function () {
    $("#view-container").toggleClass("col-xs-offset-6");
    $("#sidebar").toggleClass("active");
};