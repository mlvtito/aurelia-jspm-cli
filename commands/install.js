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
//                toolsDependencies.push("@types/" + key);
                if (projectJson.jspm.dependencies[key].startsWith("npm:")) {
                    toolsDependencies.push(projectJson.jspm.dependencies[key].substring(4));
                }
            }
        }
        for (var key in projectJson.jspm.peerDependencies) {
            if (!projectJson.jspm.peerDependencies[key].startsWith("npm:jspm-nodelibs")) {
//                toolsDependencies.push("@types/" + key);
                if (projectJson.jspm.peerDependencies[key].startsWith("npm:")) {
                    toolsDependencies.push(projectJson.jspm.peerDependencies[key].substring(4));
                }
            }
        }
        console.log(toolsDependencies)
        return npm.install(toolsDependencies);
    }).catch(function (error) {
        console.log("Failed!", error);
    });
};