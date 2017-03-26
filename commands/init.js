"use strict";

var jauJson = require('../package.json');
var fs = require('fs');
var path = require('path');

const TOOLS_MODULE_NAMES = [
    "karma",
    "karma-chai",
    "karma-jspm",
    "karma-mocha",
    "karma-mocha-reporter",
    "mocha",
    "chai",
    "karma-firefox-launcher",
    "@types/chai",
    "@types/mocha"
];

module.exports = function () {
    var jspmModuleName = "jspm@" + jauJson.dependencies.jspm;
    console.log("Installing local JSPM...");
    require("../npm/npm-api").npm.install([jspmModuleName]).then(function () {
        console.log("Initializing project...");
        return require('../jspm/jspm-cli').jspmCli.init()
    }).then(function () {
        console.log("Installing Aurelia...");
        return require('jspm').install("aurelia-bootstrapper");
    }).then(function () {
        var aureliaDependencies = [];
        var projectJson = require(process.cwd() + '/package.json');
        for (var key in projectJson.jspm.dependencies) {
            aureliaDependencies.push(projectJson.jspm.dependencies[key].substring(4));
        }
        for (var key in projectJson.jspm.peerDependencies) {
            aureliaDependencies.push(projectJson.jspm.peerDependencies[key].substring(4));
        }
        return require("../npm/npm-api").npm.install(aureliaDependencies);
    }).then(function () {
        console.log("Installing Tools Dependencies...");
        var toolsDependencies = [];
        TOOLS_MODULE_NAMES.forEach(function (element) {
            toolsDependencies.push(element);
        });
        return require("../npm/npm-api").npm.install(toolsDependencies);
    }).then(function () {
        console.log("Setting up site structure...");
        var resourcePath = path.dirname(require.resolve('../resources/index.html'));
        var destPath = process.cwd();
        copyResources(resourcePath, destPath);
        for (var iResource = 0; iResource < copiedResource.length - 1; iResource++) {
            console.log("├── " + path.relative(resourcePath, copiedResource[iResource]));
        }
        console.log("└── " + path.relative(resourcePath, copiedResource[copiedResource.length - 1]));
    }).catch(function (error) {
        console.log("Failed!", error);
    });
};

var copiedResource = [];
function copyResources(resourcePath, destPath) {
    var files = fs.readdirSync(resourcePath);
    for (var file in files) {
        var childPath = path.join(resourcePath, files[file]);
        var childDestPath = path.join(destPath, files[file]);
        if (fs.statSync(childPath).isDirectory()) {
            fs.mkdirSync(childDestPath);
            copyResources(childPath, childDestPath);
        } else {
            copiedResource.push(childPath);
            fs.createReadStream(childPath).pipe(fs.createWriteStream(childDestPath));
        }
    }
}