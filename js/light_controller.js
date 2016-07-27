/**
 * Created by Patrick on 29.06.2016.
 */

var lightController = {};

lightController.init = function () {
    var args = {
        min: 0,
        max: 100,
        value: 0,
        tooltip: "hide"
    };
    lightController.setupSlider($("#light-white-brightness-box"), args);
    lightController.setupSlider($("#light-animation-brightness-box"), args);
    args.max = 255;
    lightController.setupSlider($("#light-red-brightness-box"), args);
    lightController.setupSlider($("#light-green-brightness-box"), args);
    lightController.setupSlider($("#light-blue-brightness-box"), args);

    $("#light-color-mode-box").on("change", lightController.colorModeBoxChange);
};

/**
 *
 * @param {Status} status
 */
lightController.newStatus = function (status) {
    var color = util.colorIntToRGB(status.currentColor);
    $("#light-white-brightness-box").slider("setValue", status.whiteBrightness);
    $("#light-animation-brightness-box").slider("setValue", status.animationBrightness);
    
    $("#light-red-brightness-box").slider("setValue", color.r);
    $("#light-green-brightness-box").slider("setValue", color.g);
    $("#light-blue-brightness-box").slider("setValue", color.b);

    var index = 1;
    switch (status.colorMode) {
        case "music":
            index = 1;
            break;
        case "colorCircle":
            index = 4;
            break;
        case "custom":
            index = 2;
            break;

    }

    $("#light-color-mode-box").find(":nth-child(" + index + ")").prop("selected", true);
};

lightController.setupSlider = function (el, args) {
    el.slider(args)
        .on("change", lightController.sliderChanged);
};

lightController.show = function () {
    var status = connect.status;
    $("#light-white-brightness-box").slider("setValue", status.whiteBrightness);
};

lightController.colorModeBoxChange = function () {
    var value = $("#light-color-mode-box").val();
    $(".light-color-mode-panel").hide();
    var mode;
    switch (value) {
        case "music":
            mode = "music";
            break;
        case "rgb":
            mode = "custom";
            $("#light-color-mode-rgb-box").show();
            break;

        case "circle":
            mode = "custom";
            break;
        case "anim":
            mode = "colorCircle";
            break;
    }
    new Command().setColorMode(mode).send();
};

lightController.sliderChanged = function (e) {
    console.log("changed");
    var channel = $(e.target).data("color");
    var newValue = e.value.newValue;

    switch (channel) {
        case "white":
            connect.send(new Command().setWhiteBrightness(newValue));
            break;
        case "anim":
            connect.send(new Command().setAnimationBrightness(newValue));
            break;
        case "red":
            var color = connect.status.getNewColor(newValue, -1, -1);
            break;
        case "green":
            color = connect.status.getNewColor(-1, newValue, -1);
            break;
        case "blue":
            color = connect.status.getNewColor(-1, -1, newValue);
            break;
    }

    if (channel == "red" || channel == "green" || channel == "blue") {
        new Command().setColor(color).send();
    }
};