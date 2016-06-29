$(function () {
    //connect.init();

    var source   = $("#music-list-item-template").html();
    var template = Handlebars.compile(source);

    var context = {title: "My New Post", body: "This is my first post!"};
    var html    = template(context);

    var list =  $("#music-list");
    list.append(html);
    list.append(html);
    list.append(html);
    list.append(html);
});