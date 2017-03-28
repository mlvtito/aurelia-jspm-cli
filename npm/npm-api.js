"use strict";

var NpmApi = function () {};

NpmApi.prototype.install = function (moduleNames) {
    return new Promise(function (resolve, reject) {
        var npm = require("npm");
        npm.load({loaded: false, "save-dev": true, "progress": false, "loglevel": "silent", "depth": 0}, function (err) {

            if (err) {
                reject(err);
            } else {
                npm.commands.install(moduleNames, function (er, data) {
                    if (er) {
                        reject(er);
                    } else {
                        resolve("Success");
                    }
                });
            }
        });
    });
};

module.exports = {
    npm: new NpmApi()
};
