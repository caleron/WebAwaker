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
 * Updated den Status
 * @param {Status} newStatus Der neue Status
 * @param {[Track]} newStatus.tracks Trackliste
 * @param {[Playlist]} newStatus.playLists Trackliste
 */
Status.prototype.updateStatus = function (newStatus) {
    switch (newStatus.type) {
        case "file_status":
            if (newStatus.fileNotFound) {
                util.showAlert("Fehler:", "file not found", "warning");
                //upload initiieren
            }
            break;
        case "status":
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
            break;
        case "library":
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
            break;
    }
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