"use strict";

var npm = require("npm");
var childProcess = require('child_process');

var NpmApi = function () {};

NpmApi.prototype.install = function (moduleNames) {
    return new Promise(function (resolve, reject) {
        npm.load({loaded: false, "save-dev": true, "progress": true, "loglevel": "silent", "depth": 0}, function (err) {
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

NpmApi.prototype.exists = function (moduleName) {
    return new Promise(function (resolve, reject) {
        childProcess.exec("npm info " + moduleName, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            } else {
                resolve({module: moduleName, info: stdout});
            }
        });
    });
};

module.exports = {
    npm: new NpmApi()
};
