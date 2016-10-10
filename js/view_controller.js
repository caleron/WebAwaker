/**
 * Created by Patrick on 29.06.2016.
 */
var viewController = {};
viewController.currentView = "";

$(function () {
    connect.init();
    viewController.init();
    uploader.init();
});

viewController.init = function () {
    viewController.assignHandlers();

    viewController.views = {
        light: lightController,
        music: musicListController,
        config: config_controller
    };

    for (var key in viewController.views) {
        if (!viewController.views.hasOwnProperty(key))
            continue;

        viewController.views[key].init();
    }

    playbarController.init();
    sidebarController.init();

    viewController.showView("light", "light");
};

viewController.assignHandlers = function () {
    $(window).resize(ResponsiveBootstrapToolkit.changed(playbarController.adjustLayout));
    playbarController.adjustLayout();
};

viewController.showView = function (view, subView, data, element) {
    viewController.currentView = view;
    $("#sidebar").find("li").removeClass("active");
    if (element) {
        element.addClass("active");
    } else {
        $("#sidebar-" + view + "-" + subView).addClass("active");
    }

    if (viewController.views[view]) {
        $(".main-view").hide();
        $("#view-" + view).show();

        viewController.views[view].show(subView, data);
    } else {
        util.showAlert("Fehler", "unbekannte view " + view, "danger");
    }
};

