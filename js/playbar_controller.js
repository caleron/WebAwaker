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

    //auf Hotkeys reagieren
    $("body").keydown(playbarController.windowKeyDown);
};

/**
 *
 * @param {Event} e
 */
playbarController.slideStop = function (e) {
    var val = e.value;

    new Command().playFromPosition(val).send();
};

/**
 *
 * @param {Status} status
 */
playbarController.applyNewStatus = function (status) {
    var icon = $("#playbar-play-btn").find("span");
    if (status.playing) {
        playbarController.timer.start();
        if (!icon.hasClass("glyphicon-pause")) {
            icon.removeClass("glyphicon-play");
            icon.addClass("glyphicon-pause");
        }
    } else {
        playbarController.timer.stop();
        if (!icon.hasClass("glyphicon-play")) {
            icon.removeClass("glyphicon-pause");
            icon.addClass("glyphicon-play");
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

    if (status.shuffle) {
        $("#playbar-shuffle-btn").find("span").removeClass("inactive");
    } else {
        $("#playbar-shuffle-btn").find("span").addClass("inactive");
    }

    if (status.repeatMode == 0) {
        $("#playbar-repeat-btn").find("span").addClass("inactive");
    } else if (status.repeatMode == 1) {
        $("#playbar-repeat-btn").find("span").removeClass("inactive");
    } else if (status.repeatMode == 2) {
        $("#playbar-repeat-btn").find("span").removeClass("inactive");
    }
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
    new Command().setShuffle(!connect.status.shuffle).send();
};

playbarController.repeatClick = function (e) {
    e.preventDefault();
    new Command().setRepeatMode((connect.status.repeatMode + 1) % 3).send();
};

playbarController.windowKeyDown = function (e) {
    switch (e.key) {
        case "MediaPlayPause":
            new Command().togglePlayPause().send();
            break;
        case "MediaTrackPrevious":
            new Command().playPrevious().send();
            break;
        case "MediaTrackNext":
            new Command().playNext().send();
            break;
        case "VolumeUp":
            break;
        case "VolumeDown":
            break;
        case "VolumeMute":
            break;
    }
};
