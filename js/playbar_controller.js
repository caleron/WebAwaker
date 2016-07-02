/**
 * Created by Patrick on 30.06.2016.
 */
var playbarController = {};


playbarController.init = function () {
    var args = {
        min: 0,
        max: 100,
        value: 0,
        tooltip: "hide"
    };
    $("#playbar-box").slider(args).on("slideStop", playbarController.slideStop);
    $("#playbar-back-btn").click(playbarController.previousClick);
    $("#playbar-next-btn").click(playbarController.nextClick);
    $("#playbar-play-btn").click(playbarController.playPauseClick);
    $("#playbar-repeat-btn").click(playbarController.repeatClick);
    $("#playbar-shuffle-btn").click(playbarController.shuffleClick);

    playbarController.timer = new Timer(playbarController.incrementPlayPosition, 1000);
};

/**
 *
 * @param {Event} e
 */
playbarController.slideStop = function (e) {
    var val = e.value;

    new Command().playFromPosition(val).send();
};

playbarController.applyNewStatus = function (status) {
    var icon = $("#playbar-play-btn").find("span");
    if (status.playing) {
        playbarController.timer.start();
        if (!icon.hasClass("glyphicon-play")) {
            icon.removeClass("glyphicon-pause");
            icon.addClass("glyphicon-play");
        }
    } else {
        playbarController.timer.stop();
        if (!icon.hasClass("glyphicon-pause")) {
            icon.removeClass("glyphicon-play");
            icon.addClass("glyphicon-pause");
        }
    }

    playbarController.currentPosition = status.playPosition;

    var box = $("#playbar-box");
    box.slider("setAttribute", "max", status.trackLength);
    box.slider("setValue", status.playPosition);

    $("#playbar-track-length-label").text(util.timeString(status.trackLength));
    $("#playbar-progress-label").text(util.timeString(status.playPosition));

    $("#playbar-title").text(status.currentTitle);
    $("#playbar-artist").text(status.currentArtist);
};

playbarController.incrementPlayPosition = function () {
    var box = $("#playbar-box");
    playbarController.currentPosition++;
    box.slider("setValue", playbarController.currentPosition);
    $("#playbar-progress-label").text(util.timeString(playbarController.currentPosition));

    if (playbarController.currentPosition >= connect.status.trackLength) {
        new Command().getStatus().send();
    }
};

playbarController.previousClick = function (e) {
    e.preventDefault();
    new Command().playPrevious().send();
};

playbarController.nextClick = function (e) {
    e.preventDefault();
    new Command().playNext().send();
};

playbarController.playPauseClick = function (e) {
    e.preventDefault();
    new Command().togglePlayPause().send();
};

playbarController.shuffleClick = function (e) {
    e.preventDefault();
};

playbarController.repeatClick = function (e) {
    e.preventDefault();
};

