/**
 * Created by Patrick on 26.07.2016.
 */

var uploader = {};

uploader.queue = [];

uploader.init = function () {
    $(document).on("drag dragstart dragend dragover dragenter dragleave drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
    }).on("drop", function (e) {
        var droppedFiles = e.originalEvent.dataTransfer.files;
        console.log(droppedFiles);

        var ajaxData = new FormData();

        $.each(droppedFiles, function (i, file) {
            ajaxData.append('file', file);
        });

        $.ajax({
                   url: "http://" + connect.hostName + ":4734",
                   type: "POST",
                   data: ajaxData,
                   dataType: 'json',
                   cache: false,
                   contentType: false,
                   processData: false,
                   complete: function (e) {
                       console.log(e);
                   },
                   success: function (data) {
                       console.log(data);
                   },
                   error: function (e, a, b) {
                       console.log(e, a, b);
                       // Log the error, show an alert, whatever works for you
                   }
               }).progress(function (e) {
            console.log(e);
        });
    });
};