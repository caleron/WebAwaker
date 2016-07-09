/**
 * Created by Patrick on 28.06.2016.
 */
var connect = {
    status: new Status()
};

connect.init = function () {
    var socket = new WebSocket("ws://" + document.location.hostname + ":4733");
    socket.onopen = connect.onOpen;
    socket.onclose = connect.onClose;
    socket.onmessage = connect.onMessage;
    socket.onerror = connect.onError;
    connect.socket = socket;
};

connect.onOpen = function () {
    console.log("open");
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
        playbarController.applyNewStatus(connect.status, newTrack);
    }
};

connect.onClose = function (e) {
    console.log(e);
    util.showAlert("Fehler", "Verbindung getrennt", "danger");
};

connect.onError = function (e) {
    util.showAlert("Fehler", e.toString(), "danger");
};

connect.send = function (command) {
    var msg = JSON.stringify(command);
    console.log(msg);
    connect.socket.send(msg);
};