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

    sidebar.find("li").filter("[data-view='light']").addClass("active");
    viewController.showView("light");
};

viewController.showView = function (view, subView) {
    if (viewController.views[view]) {
        $(".main-view").hide();
        $("#view-" + view).show();

        viewController.views[view].show(subView);
    } else {
        util.showAlert("Fehler", "unbekannte view " + view, "danger");
    }
};

viewController.sidebarClick = function () {
    $("#sidebar").find("li").removeClass("active");
    var el = $(this);
    el.addClass("active");

    viewController.showView(el.data("view"), el.data("subview"));
};