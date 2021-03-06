/**
 * Wrapper-Klasse zur Serialisierung mit JSON.
 * @constructor
 */
function Command() {
}
/**
 * Startet die Wiedergabe.
 * @returns {Command}
 */
Command.prototype.play = function () {
    this.action = commands.PLAY;
    return this;
};
/**
 * Spielt einen Track im Kontext der AllTracks-PlayList ab.
 * @param {Number} trackId Die ID des Tracks
 * @returns {Command}
 */
Command.prototype.playId = function (trackId) {
    this.action = commands.PLAY_ID;
    this.trackId = trackId;
    return this;
};

/**
 * Springt zu einer Position bei der Wiedergabe
 * @param {Number} position Die Zielposition
 * @returns {Command}
 */
Command.prototype.playFromPosition = function (position) {
    this.action = commands.PLAY_FROM_POSITION;
    this.position = position;
    return this;
};

/**
 * Pausiert die Wiedergabe
 * @returns {Command}
 */
Command.prototype.pause = function () {
    this.action = commands.PAUSE;
    return this;
};

/**
 * Stoppt die Wiedergabe.
 * @returns {Command}
 */
Command.prototype.stop = function () {
    this.action = commands.STOP;
    return this;
};

/**
 * Wechselt zwischen Play und Pause.
 * @returns {Command}
 */
Command.prototype.togglePlayPause = function () {
    this.action = commands.TOGGLE_PLAY_PAUSE;
    return this;
};

/**
 * Spielt den nächsten Titel ab.
 * @returns {Command}
 */
Command.prototype.playNext = function () {
    this.action = commands.PLAY_NEXT;
    return this;
};

/**
 * Spielt den vorigen Titel ab.
 * @returns {Command}
 */
Command.prototype.playPrevious = function () {
    this.action = commands.PLAY_PREVIOUS;
    return this;
};

/**
 * Setzt den Shuffle-Modus.
 * @param {Boolean} shuffle True oder False
 * @returns {Command}
 */
Command.prototype.setShuffle = function (shuffle) {
    this.action = commands.SET_SHUFFLE;
    this.shuffle = shuffle;
    return this;
};

/**
 * Setzt den Wiederholungsmodus. "none" für keine Wiederholung, "track" für Datei wiederholen und "all" für alles
 * Wiederholen.
 * @param {String} mode Der Wiederholungsmodus.
 * @returns {Command}
 */
Command.prototype.setRepeatMode = function (mode) {
    this.action = commands.SET_REPEAT_MODE;
    this.repeatMode = mode;
    return this;
};
/**
 * Setzt die Lautstärke
 * @param {Number} volume Lautstärke als Zahl von 0 bis 100
 * @returns {Command}
 */
Command.prototype.setVolume = function (volume) {
    this.action = commands.SET_VOLUME;
    this.volume = volume;
    return this;
};
/**
 * Erstellt eine neue Playlist.
 * @param {String} name Der Name der neuen Playlist.
 * @returns {Command}
 */
Command.prototype.createPlaylist = function (name) {
    this.action = commands.CREATE_PLAYLIST;
    this.name = name;
    return this;
};
/**
 * Löscht eine Playlist.
 * @param {Number} playlistId Die ID der zu löschenden Playlist.
 * @returns {Command}
 */
Command.prototype.removePlaylist = function (playlistId) {
    this.action = commands.REMOVE_PLAYLIST;
    this.playlistId = playlistId;
    return this;
};
/**
 * Fügt eine Trackmenge zu einer Playlist hinzu.
 * @param {Number} playlistId Die ID der Playlist
 * @param {Array} trackIds Die ID-Liste der Tracks.
 * @returns {Command}
 */
Command.prototype.addTracksToPlaylist = function (playlistId, trackIds) {
    this.action = commands.ADD_TRACKS_TO_PLAYLIST;
    this.playlistId = playlistId;
    this.idList = trackIds;
    return this;
};
/**
 * Entfernt eine Trackmenge von einer Playlist.
 * @param {Number} playlistId Die ID der Playlist
 * @param {Array} trackIds Die ID-Liste der Tracks
 * @returns {Command}
 */
Command.prototype.removeTracksFromPlaylist = function (playlistId, trackIds) {
    this.action = commands.REMOVE_TRACKS_FROM_PLAYLIST;
    this.playlistId = playlistId;
    this.idList = trackIds;
    return this;
};

/**
 * Ruft den aktuellen Status ab.
 * @returns {Command}
 */
Command.prototype.getStatus = function () {
    this.action = commands.GET_STATUS;
    return this;
};

/**
 * Spielt eine Playlist ab.
 * @param {Number} playlistId Die ID der Playlist.
 * @returns {Command}
 */
Command.prototype.playPlaylist = function (playlistId) {
    this.action = commands.PLAY_PLAYLIST;
    this.playlistId = playlistId;
    return this;
};

/**
 * Spielt einen Track aus einer Playlist ab und setzt die Playlist als aktiv.
 * @param {Number} playlistId Die ID der Playlist
 * @param {Number} trackId Die ID des Tracks
 * @returns {Command}
 */
Command.prototype.playTrackOfPlaylist = function (playlistId, trackId) {
    this.action = commands.PLAY_TRACK_OF_PLAYLIST;
    this.playlistId = playlistId;
    this.trackId = trackId;
    return this;
};

/**
 * Ruft die gesamte Mediathek ab.
 * @returns {Command}
 */
Command.prototype.getLibrary = function () {
    this.action = commands.GET_LIBRARY;
    return this;
};
/**
 * Setzt die Farbe
 * @param {Number} color Farbe als RGB-Integer
 * @returns {Command}
 */
Command.prototype.setColor = function (color) {
    this.action = commands.SET_COLOR;
    this.color = color;
    this.smooth = false;
    return this;
};
/**
 * Setzt die Farbe.
 * @param {Number} red Rot von 0 bis 255
 * @param {Number} green Grün von 0 bis 255
 * @param {Number} blue Blau von 0 bis 255
 * @returns {Command}
 */
Command.prototype.setRGBColor = function (red, green, blue) {
    this.action = commands.SET_RGBCOLOR;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.smooth = false;
    return this;
};
/**
 * Setzt die Helligkeit der weißen LED's
 * @param {Number} brightness Die Helligkeit als Zahl zwischen 0 und 100
 * @returns {Command}
 */
Command.prototype.setWhiteBrightness = function (brightness) {
    this.action = commands.SET_WHITE_BRIGHTNESS;
    this.brightness = brightness;
    this.smooth = false;
    return this;
};
/**
 * Setzt die Helligkeit von Animationen.
 * @param {Number} brightness Die Helligkeit als Zahl zwischen 0 und 100
 * @returns {Command}
 */
Command.prototype.setAnimationBrightness = function (brightness) {
    this.action = commands.SET_ANIMATION_BRIGHTNESS;
    this.brightness = brightness;
    this.smooth = false;
    return this;
};
/**
 * Setzt den Farbmodus
 * @param {String} mode Einer der folgenden Strings: custom, colorCircle, music
 * @returns {Command}
 */
Command.prototype.setColorMode = function (mode) {
    this.action = commands.SET_COLOR_MODE;
    this.colorMode = mode;
    return this;
};

/**
 * Fährt den Raspberry herunter.
 * @returns {Command}
 */
Command.prototype.shutdownRaspi = function () {
    this.action = commands.SHUTDOWN_RASPI;
    return this;
};

/**
 * Startet den Raspberry neu.
 * @returns {Command}
 */
Command.prototype.rebootRaspi = function () {
    this.action = commands.REBOOT_RASPI;
    return this;
};

/**
 * Startet die Serveranwendung neu.
 * @returns {Command}
 */
Command.prototype.rebootServer = function () {
    this.action = commands.REBOOT_SERVER;
    return this;
};

/**
 * Beendet die Serveranwendung.
 * @returns {Command}
 */
Command.prototype.shutdownServer = function () {
    this.action = commands.SHUTDOWN_SERVER;
    return this;
};
/**
 * Ruft den Wert einer Konfigurationsoption ab.
 * @param {String} name Der Name der Option
 * @returns {Command}
 */
Command.prototype.getConfig = function (name) {
    this.action = commands.GET_CONFIG;
    this.name = name;
    return this;
};
/**
 * Setzt eine Konfigurationsoption
 * @param {String} name Der Name
 * @param {String} value Der Wert
 * @returns {Command}
 */
Command.prototype.setConfig = function (name, value) {
    this.action = commands.SET_CONFIG;
    this.name = name;
    this.value = value;
    return this;
};
/**
 * Ruft die Liste der derzeitigen Einstellungen ab.
 * @returns {Command}
 */
Command.prototype.getConfigList = function () {
    this.action = commands.GET_CONFIG_LIST;
    return this;
};
/**
 * Ruft eine Liste aller möglichen Optionen ab.
 * @returns {Command}
 */
Command.prototype.getConfigOptions = function () {
    this.action = commands.GET_CONFIG_OPTIONS;
    return this;
};
/**
 * Erstellt eine Playlist aus IDs und spielt diese ab.
 *
 * @param {int[]} list
 * @param {String} name
 * @param {int} [startId]
 * @returns {Command}
 */
Command.prototype.playIdList = function (list, name, startId) {
    this.action = commands.PLAY_ID_LIST;
    this.idList = list;
    this.name = name;
    if (startId != undefined) {
        this.trackId = startId;
    } else {
        this.trackId = -1;
    }
    return this;
};

/**
 * Fügt einen Track der Warteschlange hinzu.
 * @param {Array} trackIds
 * @returns {Command}
 */
Command.prototype.addTracksToQueue = function (trackIds) {
    this.action = commands.ADD_TRACKS_TO_QUEUE;
    this.idList = trackIds;
    return this;
};

/**
 * Entfernt Tracks von der Warteschlange.
 * @param {Array} trackIds
 * @returns {Command}
 */
Command.prototype.removeTracksFromQueue = function (trackIds) {
    this.action = commands.REMOVE_TRACKS_FROM_QUEUE;
    this.idList = trackIds;
    return this;
};

/**
 * Spielt den angegebenen Song aus der Queue.
 * @param trackId ID des Tracks
 * @returns {Command}
 */
Command.prototype.playTrackOfQueue = function (trackId) {
    this.action = commands.PLAY_TRACK_OF_QUEUE;
    this.trackId = trackId;
    return this;
};


/**
 * Spielt als nächstes den angegebenen Track ab.
 * @param {int} id
 * @returns {Command}
 */
Command.prototype.playTrackNext = function (id) {
    this.action = commands.PLAY_TRACK_NEXT;
    this.trackId = id;
    return this;
};

/**
 * Sendet den Befehl ab.
 * Das selbe wie <code>connect.send(command)</code>
 */
Command.prototype.send = function () {
    if (this.action.length == 0) {
        throw new Error("Befehl nicht gesetzt!");
    }
    connect.send(this);
};

/**
 * Objekt mit allen verfügbaren Befehlen.
 *
 * @type {{PLAY: string, PLAY_ID: string, PLAY_FROM_POSITION: string, PAUSE: string, STOP: string, TOGGLE_PLAY_PAUSE:
 *     string, CHECK_FILE: string, PLAY_NEXT: string, PLAY_PREVIOUS: string, SET_SHUFFLE: string, SET_REPEAT_MODE:
 *     string, SET_VOLUME: string, SET_WHITE_BRIGHTNESS: string, SET_ANIMATION_BRIGHTNESS: string, SET_COLOR_MODE:
 *     string, SET_COLOR: string, SET_RGBCOLOR: string, CHANGE_VISUALIZATION: string, CREATE_PLAYLIST: string,
 *     REMOVE_PLAYLIST: string, ADD_TRACKS_TO_PLAYLIST: string, REMOVE_TRACKS_FROM_PLAYLIST: string, PLAY_PLAYLIST:
 *     string, PLAY_TRACK_OF_PLAYLIST: string, GET_STATUS: string, GET_LIBRARY: string, SEND_STRING: string,
 *     SHUTDOWN_SERVER: string, SHUTDOWN_RASPI: string, REBOOT_RASPI: string, REBOOT_SERVER: string, GET_CONFIG:
 *     string, SET_CONFIG: string, GET_CONFIG_LIST: string, GET_CONFIG_OPTIONS: string, PLAY_ID_LIST: string,
 *     ADD_TRACKS_TO_QUEUE: string, REMOVE_TRACKS_FROM_QUEUE: string, PLAY_TRACK_NEXT: string, PLAY_TRACK_OF_QUEUE:
 *     string}}
 */
var commands = {
    PLAY: "play",
    PLAY_ID: "playId",
    PLAY_FROM_POSITION: "playFromPosition",
    PAUSE: "pause",
    STOP: "stop",
    TOGGLE_PLAY_PAUSE: "togglePlayPause",
    CHECK_FILE: "checkFile",
    PLAY_NEXT: "playNext",
    PLAY_PREVIOUS: "playPrevious",
    SET_SHUFFLE: "setShuffle",
    SET_REPEAT_MODE: "setRepeatMode",
    SET_VOLUME: "setVolume",
    SET_WHITE_BRIGHTNESS: "setWhiteBrightness",
    SET_ANIMATION_BRIGHTNESS: "setAnimationBrightness",
    SET_COLOR_MODE: "setColorMode",
    SET_COLOR: "setColor",
    SET_RGBCOLOR: "setRGBColor",
    CHANGE_VISUALIZATION: "changeVisualization",
    CREATE_PLAYLIST: "createPlaylist",
    REMOVE_PLAYLIST: "removePlaylist",
    ADD_TRACKS_TO_PLAYLIST: "addTracksToPlaylist",
    REMOVE_TRACKS_FROM_PLAYLIST: "removeTracksFromPlaylist",
    PLAY_PLAYLIST: "playPlaylist",
    PLAY_TRACK_OF_PLAYLIST: "playTrackOfPlaylist",
    GET_STATUS: "getStatus",
    GET_LIBRARY: "getLibrary",
    SEND_STRING: "sendString",
    SHUTDOWN_SERVER: "shutdownServer",
    SHUTDOWN_RASPI: "shutdownRaspi",
    REBOOT_RASPI: "rebootRaspi",
    REBOOT_SERVER: "rebootServer",
    GET_CONFIG: "getConfig",
    SET_CONFIG: "setConfig",
    GET_CONFIG_LIST: "getConfigList",
    GET_CONFIG_OPTIONS: "getConfigOptions",
    PLAY_ID_LIST: "playIdList",
    ADD_TRACKS_TO_QUEUE: "addTracksToQueue",
    REMOVE_TRACKS_FROM_QUEUE: "removeTracksFromQueue",
    PLAY_TRACK_NEXT: "playTrackNext",
    PLAY_TRACK_OF_QUEUE: "playTrackOfQueue"
};