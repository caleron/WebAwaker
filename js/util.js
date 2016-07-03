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

/**
 * Konvertiert RGB-Komponenten in eine RGB-Integer.
 * @return {number}
 * @param  {Number} r Rot
 * @param  {Number} g Grün
 * @param  {Number} b Blau
 */
util.RGBtoColorInt = function (r, g, b) {
    return r << 16 | g << 8 | b;
};

/**
 * Konvertiert eine RGB-Integer in RGB-Komponenten.
 * @param {Number} color
 * @returns {{r: number, g: number, b: number}}
 */
util.colorIntToRGB = function (color) {
    var r = color >> 16 & 0xFF;
    var g = color >> 8 & 0xFF;
    var b = color & 0xFF;
    return {r: r, g: g, b: b};
};

/**
 * Gibt die Sekunden aufgeteilt in Stunden, Minuten und Sekunden als String zurück.
 * @param {number} seconds Die Anzahl an Sekunden.
 * @returns {string}
 */
util.timeString = function (seconds) {
    var hours = Math.floor(seconds / 3600);
    seconds = seconds - hours * 3600;
    var mins = Math.floor(seconds / 60);
    seconds = seconds - mins * 60;
    if (hours > 0) {
        return hours + ":" + util.leadingZero(mins) + ":" + util.leadingZero(seconds);
    } else {
        return mins + ":" + util.leadingZero(seconds);
    }
};

/**
 * Fügt eine führende Null zur Zahl hinzu.
 * @param {number} num
 * @returns {string}
 */
util.leadingZero = function (num) {
    if (num < 10) {
        return "0" + num;
    }
    return num + "";
};

/**
 * Klasse, die einen Timer darstellt.
 * @param fn    Im Intervall aufzurufende Funktion
 * @param time  Intervall in ms
 * @constructor
 */
function Timer(fn, time) {
    var timer = false;

    /**
     * Startet den Timer, falls er nicht läuft.
     */
    this.start = function () {
        if (!this.isRunning())
            timer = window.setInterval(fn, time);
    };

    /**
     * Stoppt den Timer.
     */
    this.stop = function () {
        window.clearInterval(timer);
        timer = false;
    };

    /**
     * Gibt true zurück, falls der Timer aktiv ist.
     * @returns {boolean}
     */
    this.isRunning = function () {
        return timer !== false;
    };
}

jQuery.fn.selectText = function (start, length) {
    var selection = window.getSelection();
    var range = document.createRange();
    var el = this[0];
    if (el.constructor.name != "text") {
        el = el.childNodes[0];
    }
    range.setStart(el, start);
    range.setEnd(el, start + length);
    selection.addRange(range);
};

util.clearSelections = function () {
    window.getSelection().removeAllRanges();
};


//Skript um kaspersky xhr zu blocken
window.setTimeoutOrig = window.setTimeout;
window.setTimeout = function (f, del) {
    var l_stack = Error().stack.toString();
    if (l_stack.indexOf('kis.scr.kaspersky-labs.com') > 0) {
        return 0;
    }
    window.setTimeoutOrig(f, del);
};