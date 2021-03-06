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

playbarController.adjustLayout = function () {
    //console.log("adjust now to : " + ResponsiveBootstrapToolkit.current());

    if (ResponsiveBootstrapToolkit.current() == "unrecognized") {
        window.setTimeout(playbarController.adjustLayout, 200);
        return;
    }

    var playbar = $("#playbar-container");
    var playbackBox = $("#playbar-playback-box");
    var modesBox = $("#playbar-modes-box");

    var xsRow = $("#playbar-xs-btn-row");
    if (ResponsiveBootstrapToolkit.is("<sm")) {
        playbar.css("flex-direction", "column");

        playbackBox.hide();
        modesBox.hide();
        xsRow.append(modesBox.children()[0]);
        xsRow.append(playbackBox.children());
        xsRow.append(modesBox.children()[0]);
    } else {
        playbar.css("flex-direction", "row");

        playbackBox.show();
        modesBox.show();
        playbackBox.prepend(xsRow.find(".playbar-playback"));
        modesBox.append(xsRow.find(".playbar-modes"));
    }
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

    if (status.repeatMode == "none") {
        $("#playbar-repeat-btn").find("span").addClass("inactive");
    } else if (status.repeatMode == "track") {
        $("#playbar-repeat-btn").find("span").removeClass("inactive");
    } else if (status.repeatMode == "all") {
        $("#playbar-repeat-btn").find("span").removeClass("inactive");
    }
};

playbarController.incrementPlayPosition = function () {
    var box = $("#playbar-box");
    playbarController.currentPosition++;
    box.slider("setValue", playbarController.currentPosition);
    $("#playbar-progress-label").text(util.timeString(playbarController.currentPosition));
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
    var newMode;
    switch (connect.status.repeatMode) {
        case "none":
            newMode = "track";
            break;
        case "track":
            newMode = "all";
            break;
        case "all":
            newMode = "none";
            break;
    }
    new Command().setRepeatMode(newMode).send();
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
