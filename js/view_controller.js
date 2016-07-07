/**
 * Created by Patrick on 29.06.2016.
 */
var viewController = {};

$(function () {
    connect.init();
    viewController.init();
});

viewController.init = function () {
    var sidebar = $("#sidebar");
    sidebar.find("li").click(viewController.sidebarClick);

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

viewController.sidebarClick = function () {
    var el = $(this);

    viewController.showView(el.data("view"), el.data("subview"));
};