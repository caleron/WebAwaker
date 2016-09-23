/**
 * Created by Patrick on 23.09.2016.
 */

var config_controller = {};
config_controller.config = {};
config_controller.options = [];

config_controller.init = function () {
    $("#config-new-config-form").on("submit", config_controller.onsubmit);
    $("#config-new-config-select").change(config_controller.select_change);
};

config_controller.onsubmit = function (e) {
    e.preventDefault();
    var name = $("#config-new-config-select").val();
    var value = $("#config-new-config-value").val();

    new Command().setConfig(name, value).send();

    return false;
};

config_controller.select_change = function () {
    var key = $(this).val();
    var value = "";
    if (config_controller.config.hasOwnProperty(key)) {
        value = config_controller.config[key];
    }
    $("#config-new-config-value").val(value.toString());
};

config_controller.show = function () {
    new Command().getConfigList().send();
    new Command().getConfigOptions().send();
};

config_controller.updateTable = function () {
    var table = $("#config-table");
    var template = Handlebars.compile($("#config-row-template").html());
    table.find("tr").remove();

    for (var key in config_controller.config) {
        if (!config_controller.config.hasOwnProperty(key))
            continue;

        var val = config_controller.config[key];

        var type,
            checked = "";
        if (!isNaN(val)) {
            type = "number";
        } else if (val == "true" || val == "false") {
            type = "checkbox";
            checked = val == "true" ? "checked" : "";
        } else {
            type = "text";
        }

        table.append(template({
                                  name: key,
                                  value: val.toString(),
                                  type: type,
                                  checked: checked
                              }));
    }
};

config_controller.updateOptions = function () {
    var select = $("#config-new-config-select");
    select.find("option").remove();
    config_controller.options.forEach(function (el) {
        select.append("<option>" + el + "</option>");
    });
};

/**
 *
 * @param {Config} data
 */
config_controller.configAnswerReceived = function (data) {
    if (data.name != undefined) {
        config_controller.config[data.name] = data.value;
        config_controller.updateTable();

    } else if (data.config != undefined) {
        config_controller.config = data.config;
        config_controller.updateTable();

    } else if (data.configOptions != undefined) {
        config_controller.options = data.configOptions;
        config_controller.updateOptions()
    }
};
