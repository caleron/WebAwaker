/**
 * Created by Patrick on 28.06.2016.
 */
var connect = {
    status: new Status()
};

connect.hostName = undefined;
//timestamp in ms
connect.connectTime = 0;

connect.init = function () {
    if (document.location.hostname == "localhost") {
        connect.hostName = "192.168.1.102";
    } else {
        connect.hostName = document.location.hostname;
    }
    connect.connect();
};

connect.connect = function () {
    if (connect.socket != undefined && connect.socket.readyState == WebSocket.OPEN)
        return;

    $("#connect-status").text("Verbinde...");
    connect.connectTime = Date.now();
    var socket = new WebSocket("ws://" + connect.hostName + ":4733");

    socket.onopen = connect.onOpen;
    socket.onclose = connect.onClose;
    socket.onmessage = connect.onMessage;
    socket.onerror = connect.onError;
    connect.socket = socket;
};

connect.onOpen = function () {
    console.log("open");
    $("#connect-status").text("Verbunden");
    util.showAlert("Verbunden", "Verbindung hergestellt.", "success");
    connect.send(new Command().getLibrary());
};

connect.onMessage = function (e) {
    var answer = JSON.parse(e.data);
    console.log(answer);
    var newTrack = connect.status.updateStatus(answer);
    if (answer.type == "library") {
        musicListController.newLibrary();
    }
    if (answer.type == "library" || answer.type == "status") {
        playbarController.applyNewStatus(connect.status);
        lightController.newStatus(connect.status);

        if (newTrack) {
            musicListController.newTrack();
        }
    }
    if (answer.type == "config") {
        config_controller.configAnswerReceived(answer);
    }
};

connect.onClose = function (e) {
    util.showAlert("Fehler", "Verbindung getrennt. Verbinde neu...", "danger");
    $("#connect-status").text("Verbindung getrennt");

    if (Date.now() - connect.connectTime > 5000) {
        connect.connect();
        console.log("direct reconnect");
    } else {
        var del = 5000 - (Date.now() - connect.connectTime);
        console.log(del);
        window.setTimeout(connect.connect, del);
    }
};

connect.onError = function (e) {
    console.log(e);
};

connect.send = function (command) {
    var msg = JSON.stringify(command);
    console.log(msg);
    connect.socket.send(msg);
};