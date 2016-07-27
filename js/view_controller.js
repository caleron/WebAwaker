/**
 * Created by Patrick on 29.06.2016.
 */
var viewController = {};

$(function () {
    connect.init();
    viewController.init();
    uploader.init();
});

viewController.init = function () {
    viewController.assignHandlers();

    viewController.views = {
        light: lightController,
        music: musicListController
    };

    for (var key in viewController.views) {
        if (!viewController.views.hasOwnProperty(key))
            continue;

        viewController.views[key].init();
    }

    playbarController.init();

    viewController.showView("light", "light");
};

viewController.assignHandlers = function () {
    $("#sidebar").find("li").click(viewController.sidebarClick);

    $(window).resize(ResponsiveBootstrapToolkit.changed(playbarController.adjustLayout));

    playbarController.adjustLayout();

    $("#nav-show-sidebar-btn").click(viewController.toggleSidebar)
};

viewController.showView = function (view, subView) {
    $("#sidebar").find("li").removeClass("active");
    $("#sidebar-" + view + "-" + subView).addClass("active");

    if (viewController.views[view]) {
        $(".main-view").hide();
        $("#view-" + view).show();

        viewController.views[view].show(subView);
    } else {
        util.showAlert("Fehler", "unbekannte view " + view, "danger");
    }
};

viewController.toggleSidebar = function () {
    $("#view-container").toggleClass("col-xs-offset-6");
    $("#sidebar").toggleClass("active");
};

viewController.sidebarClick = function () {
    var el = $(this);

    viewController.showView(el.data("view"), el.data("subview"));

    if (ResponsiveBootstrapToolkit.is("xs")) {
        viewController.toggleSidebar();
    }
};