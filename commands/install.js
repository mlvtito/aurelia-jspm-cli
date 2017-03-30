"use strict";

var fs = require("fs");
var jspm = require('jspm');
var npm = require("../npm/npm-api").npm;

require(process.cwd() + '/jspm.config.js');

module.exports = function (argv) {
    console.log("Installing dependency " + argv._[1] + "...");

    jspm.install(argv._[1]).then(function () {
        var toolsDependencies = [];
        var projectJson = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf8'));
        for (var key in projectJson.jspm.dependencies) {
            if (!projectJson.jspm.dependencies[key].startsWith("npm:jspm-nodelibs")) {
                if (projectJson.jspm.dependencies[key].startsWith("npm:")) {
                    toolsDependencies.push(projectJson.jspm.dependencies[key].substring(4));
                }
            }
        }
        for (var key in projectJson.jspm.peerDependencies) {
            if (!projectJson.jspm.peerDependencies[key].startsWith("npm:jspm-nodelibs")) {
                if (projectJson.jspm.peerDependencies[key].startsWith("npm:")) {
                    toolsDependencies.push(projectJson.jspm.peerDependencies[key].substring(4));
                }
            }
        }
        return npm.install(toolsDependencies);
    }).then(function () {
        var promises = [];
        var projectJson = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf8'));
        for (var key in projectJson.jspm.dependencies) {
            if (!projectJson.jspm.dependencies[key].startsWith("npm:jspm-nodelibs")) {
                if (projectJson.jspm.dependencies[key].startsWith("npm:")) {
                    var depJson = JSON.parse(fs.readFileSync(process.cwd() + '/node_modules/' + key + '/package.json', 'utf8'));
                    if (!depJson.typings) {
                        promises.push(npm.exists("@types/" + key));
                    }
                } else {
                    promises.push(npm.exists("@types/" + key));
                }
            }
        }
        for (var key in projectJson.jspm.peerDependencies) {
            if (!projectJson.jspm.peerDependencies[key].startsWith("npm:jspm-nodelibs")) {
                if (projectJson.jspm.peerDependencies[key].startsWith("npm:")) {
                    var depJson = JSON.parse(fs.readFileSync(process.cwd() + '/node_modules/' + key + '/package.json', 'utf8'));
                    if (!depJson.typings) {
                        promises.push(npm.exists("@types/" + key));
                    }
                } else {
                    promises.push(npm.exists("@types/" + key));
                }
            }
        }
        return Promise.all(promises.map(reflect));
    }).then(function (results) {
        var success = results.filter(x => x.status === "resolved").map(x => x.v.module);
        if (success.length > 0) {
            return npm.install(success);
        }
    }).catch(function (error) {
        console.log("Failed!", error);
    });
};


function reflect(promise) {
    return promise.then(function (v) {
        return {v: v, status: "resolved"};
    },
            function (e) {
                return {e: e, status: "rejected"};
            });
}