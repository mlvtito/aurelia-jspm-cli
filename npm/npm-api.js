"use strict";

var NpmApi = function () {};

NpmApi.prototype.install = function (moduleNames) {
    return new Promise(function (resolve, reject) {
        var npm = require("npm");
        npm.load({loaded: false, "save-dev":true, "progress":true,"loglevel":"silent", "depth":0}, function (err) {
            npm.commands.install(moduleNames, function (er, data) {
                resolve("Success");
            });
        });
    });
};

module.exports = {
    npm: new NpmApi()
};