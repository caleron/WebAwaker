/**
 * Created by Patrick on 29.06.2016.
 */
var util = {};

util.showAlert = function (title, message, type) {
    var box = $("#absolute-alert");

    box.queue(function () {
        box.removeClass("alert-success");
        box.removeClass("alert-info");
        box.removeClass("alert-warning");
        box.removeClass("alert-danger");

        box.addClass("alert-" + type);

        box.find("strong").text(title);
        box.find("span").text(message);

        box.dequeue();
    });

    box.fadeIn().delay(4000).fadeOut().delay(100);
};
