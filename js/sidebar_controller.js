var sidebarController = {};

sidebarController.init = function () {
    $("#sidebar").find("li").click(sidebarController.sidebarClick);
    $("#modal-control-option-list").find("button").click(sidebarController.serverControlClick);

    $("#nav-show-sidebar-btn").click(sidebarController.toggleSidebar);
};


sidebarController.sidebarClick = function () {
    var el = $(this);

    if (el[0].id == "sidebar-hack") {
        $("#modal-control-options").modal("show");
    } else {
        viewController.showView(el.data("view"), el.data("subview"), el.data("option"));
    }

    if (ResponsiveBootstrapToolkit.is("xs")) {
        sidebarController.toggleSidebar();
    }
};

sidebarController.serverControlClick = function (e) {
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