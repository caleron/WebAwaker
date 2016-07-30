/**
 * Created by Patrick on 26.07.2016.
 */

var uploader = {};

//shift entfernt das erste Element und gibt es zurück
uploader.queue = [];

uploader.currentUploadFilesCount = 0;
uploader.uploadRunning = false;

uploader.init = function () {
    $(document).on("drag dragstart dragend dragover dragenter dragleave drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
    }).on("drop", function (e) {
        var droppedFiles = e.originalEvent.dataTransfer.files;
        console.log(droppedFiles);

        $.each(droppedFiles, function (i, file) {
            uploader.queue.push(file);
            uploader.currentUploadFilesCount++;
        });
        uploader.refreshStatus();

        if (!uploader.uploadRunning) {
            uploader.uploadNext();
        }
    });
};

uploader.uploadNext = function () {
    if (uploader.queue.length == 0) {
        $("#upload-progress").hide();
        uploader.uploadRunning = false;
        util.showAlert("Upload erfolgreich.", "Alle " + uploader.currentUploadFilesCount + " Dateien wurden erfolgreich hochgeladen", "success");
        uploader.currentUploadFilesCount = 0;
        musicListController.newLibrary();
        return;
    }
    uploader.uploadRunning = true;

    var file = uploader.queue.shift();

//file als data angeben ist auch möglich, dann wird das mit multipart nicht benötigt
    $.ajax({
               url: "http://" + connect.hostName + ":4734",
               type: "POST",
               data: file,
               dataType: 'json',
               cache: false,
               contentType: false,
               processData: false,
               beforeSend: function (req) {
                   req.setRequestHeader("Access-Control-Request-Headers", "content-type, filename");
                   req.setRequestHeader("filename", file.name);
               },
               xhr: function () {
                   var xhr = jQuery.ajaxSettings.xhr();
                   xhr.upload.onprogress = uploader.uploadProgress;
                   return xhr;
               }
           }).done(uploader.uploadSuccess).fail(uploader.uploadFail);

};

/**
 *
 * @param {Event} e
 */
uploader.uploadProgress = function (e) {
    if (e.lengthComputable) {
        var percentComplete = e.loaded / e.total;
        console.log(percentComplete);
        //Do something with upload progress
    } else {
        console.log("length not computable");
    }
};

uploader.uploadSuccess = function (data, textStatus, jqXHR) {
    console.log(data);
    if (data.status == "success") {
        connect.status.tracks.set(data.track.id, data.track);
    } else {
        util.showAlert("Fehler", "Upload von " + data.filename + " fehlgeschlagen.", "warning");
    }
    uploader.uploadNext();
};

uploader.refreshStatus = function () {
    var progressBox = $("#upload-progress");
    var progressBar = progressBox.find(".progress-bar");

    progressBox.show();
    var uploadedFilesCount = uploader.currentUploadFilesCount - uploader.queue.length - 1;
    var progress = ((uploadedFilesCount / uploader.currentUploadFilesCount) * 100).toFixed(0);

    progressBar.css("width", progress + "%");
    progressBar.text(progress + "% hochgeladen (" + uploadedFilesCount + "/" + uploader.currentUploadFilesCount + ")");
};

uploader.uploadFail = function (jqXHR, textStatus, errorThrown) {
    uploader.queue = [];
    $("#upload-progress").hide();
    util.showAlert("Fehler", errorThrown, "danger");
};


/*uploader.ajax = function (data) {
 return new Promise(function (resolve, reject) {
 var xhr = new XMLHttpRequest();
 //xhr.upload.onprogress = uploader.uploadProgress;
 console.log(xhr.upload);
 /*xhr.upload.addEventListener("progress", function () {
 alert("hi");
 }, false);
 xhr.onload = function () {
 if (this.status >= 200 && this.status < 300) {
 resolve(xhr.response);
 } else {
 reject({
 status: this.status,
 statusText: xhr.statusText
 });
 }
 };
 xhr.onerror = function () {
 reject({
 status: this.status,
 statusText: xhr.statusText
 });
 };
 xhr.onabort = xhr.onerror;
 xhr.open("POST", "http://" + connect.hostName + ":4734");
 xhr.send(data);
 });
 };*/