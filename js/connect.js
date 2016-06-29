/**
 * Created by Patrick on 28.06.2016.
 */
var connect = {};

connect.init = function () {
    var socket = new WebSocket("ws://localhost:4733");
    socket.onClose = connect.onClose;
    socket.onmessage = connect.onmessage;
    socket.onopen = connect.onopen;
    socket.onerror = connect.onerror;
    connect.socket = socket;
};

connect.onOpen = function (e) {
    connect.socket.send("hello");
};

connect.onMessage = function (e) {
    var answer = JSON.parse(e.data);
    //e.data
};

connect.onClose = function (e) {

};

connect.onError = function (e) {

};