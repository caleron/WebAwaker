/**
 * Created by Patrick on 29.06.2016.
 */

function Status() {
    this.type = "";
    this.fileNotFound = false;
    this.colorMode = "music"; //custom; colorCircle; music
    this.currentColor = 0;
    this.whiteBrightness = 0;
    this.animationBrightness = 100;
    this.currentTitle = "";
    this.currentAlbum = "";
    this.currentArtist = "";
    this.repeatMode = 0;
    this.shuffle = true;
    this.volume = 70;
    this.trackLength = 100;
    this.playPosition = 0;
    this.playing = false;
    this.tracks = new Map();
    this.playLists = new Map();
}

/**
 * Updated den Status und gibt true zurück, wenn ein neuer Track läuft.
 *
 * @param {Status} newStatus Der neue Status
 * @param {[Track]} newStatus.tracks Trackliste
 * @param {[Playlist]} newStatus.playLists Trackliste
 * @return {boolean}
 */
Status.prototype.updateStatus = function (newStatus) {
    var newTrack = false;

    //upload initiieren
    if (newStatus.type === "file_status") {
        if (newStatus.fileNotFound) {
            util.showAlert("Fehler:", "file not found", "warning");
        }
    } else if (newStatus.type === "status" || newStatus.type === "library") {
        if (this.trackLength != newStatus.trackLength || this.currentTitle != newStatus.currentTitle
            || this.currentArtist != newStatus.currentArtist) {
            newTrack = true;
        }

        this.colorMode = newStatus.colorMode;
        this.currentColor = newStatus.currentColor;
        this.whiteBrightness = newStatus.whiteBrightness;
        this.animationBrightness = newStatus.animationBrightness;
        this.currentTitle = newStatus.currentTitle;
        this.currentAlbum = newStatus.currentAlbum;
        this.currentArtist = newStatus.currentArtist;
        this.repeatMode = newStatus.repeatMode;
        this.shuffle = newStatus.shuffle;
        this.volume = newStatus.volume;
        this.trackLength = newStatus.trackLength;
        this.playPosition = newStatus.playPosition;
        this.playing = newStatus.playing;
    }

    if (newStatus.type === "library") {
        var length = newStatus.tracks.length;
        this.tracks.clear();
        for (var i = 0; i < length; i++) {
            this.tracks.set(newStatus.tracks[i].id, newStatus.tracks[i]);
        }
        length = newStatus.playLists.length;
        this.playLists.clear();
        for (i = 0; i < length; i++) {
            this.playLists.set(newStatus.playLists[i].id, newStatus.playLists[i]);
        }
    }

    return newTrack;
};

/**
 * Erstellt eine neue Farbe aus der aktuellen Farbe und den angegebenen Komponenten. Wenn eine Komponente <0 ist, wird
 * der aktuelle Wert des Status verwendet.
 * @param {number} r Rot
 * @param {number} g Grün
 * @param {number} b Blau
 * @returns {number}
 */
Status.prototype.getNewColor = function (r, g, b) {
    var currentColor = util.colorIntToRGB(this.currentColor);
    if (r < 0) {
        r = currentColor.r;
    }
    if (g < 0) {
        g = currentColor.g;
    }
    if (b < 0) {
        b = currentColor.b;
    }
    return util.RGBtoColorInt(r, g, b);
};


function Track() {
    this.id = 0;
    this.title = "";
    this.artist = "";
    this.album = "";
    this.trackLength = "";
}

function Playlist(type) {
    this.id = 0;
    this.name = "";
    /**
     * @type {Array.Number}
     */
    this.trackList = [];
}