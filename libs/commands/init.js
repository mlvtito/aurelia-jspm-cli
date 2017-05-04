"use strict";

var jauJson = require('../../package.json');
var fs = require('fs');
var path = require('path');
var npm = require("../npm/npm-api").npm;
var jspmCli = require('../jspm/jspm-cli').jspmCli;
var jspm = require('jspm');

const TOOLS_MODULE_NAMES = [
    "karma",
    "karma-cli",
    "karma-chai",
    "karma-jspm",
    "karma-mocha",
    "karma-mocha-reporter",
    "mocha",
    "chai",
    "karma-firefox-launcher",
    "@types/chai",
    "@types/mocha",
    "aurelia-jspm-cli"
];

module.exports = function () {
    var jspmModuleName = "jspm@" + jauJson.dependencies.jspm;
    console.log("Initializing project...");
    jspmCli.init().then(function () {
        console.log("Installing Dependencies...");
        return jspm.install("aurelia-bootstrapper");
    }).then(function () {
        return jspm.install("text", "0.0.7");
    }).then(function () {
        var toolsDependencies = [jspmModuleName];
        TOOLS_MODULE_NAMES.forEach(function (element) {
            toolsDependencies.push(element);
        });
        require("../commons/project").project.vendorDependencies().forEach( v => {
           if( v.registry === "npm" ) {
               toolsDependencies.push(v.dependency);
           }
        });
        return npm.install(toolsDependencies);
    }).then(function () {
        console.log("Setting up site structure...");
        var resourcePath = path.dirname(require.resolve('../../resources/index.html'));
        var destPath = process.cwd();
        copyResources(resourcePath, destPath);
        for (var iResource = 0; iResource < copiedResource.length - 1; iResource++) {
            console.log("├── " + path.relative(resourcePath, copiedResource[iResource]));
        }
        console.log("└── " + path.relative(resourcePath, copiedResource[copiedResource.length - 1]));
    }).then(function () {
        console.log("Adding scripts...");
        var projectJson = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf8'));
        if (!projectJson.scripts) {
            projectJson.scripts = {};
        }
        projectJson.scripts["bundle:vendor"] = "./node_modules/aurelia-jspm-cli/bin/auj.js bundle --vendor";
        projectJson.scripts["bundle:app"] = "./node_modules/aurelia-jspm-cli/bin/auj.js bundle --app";
        projectJson.scripts["bundle"] = "./node_modules/aurelia-jspm-cli/bin/auj.js bundle --app --vendor";
        projectJson.scripts["test"] = "./node_modules/karma-cli/bin/karma start";
        projectJson.scripts["start"] = "./node_modules/aurelia-jspm-cli/bin/auj.js start";
        fs.writeFileSync(process.cwd() + '/package.json', JSON.stringify(projectJson, null, '  '));
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