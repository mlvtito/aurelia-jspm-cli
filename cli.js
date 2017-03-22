//var pjson = require(process.cwd() + '/package.json');
var fs = require('fs');
var path = require('path');

var argv = require('minimist')(process.argv.slice(2));

// TODO : should be extracted from package.json after jspm init
const AURELIA_MODULE_NAMES = [
    "aurelia-binding",
    "aurelia-dependency-injection",
    "aurelia-event-aggregator",
    "aurelia-framework",
    "aurelia-history",
    "aurelia-history-browser",
    "aurelia-loader",
    "aurelia-loader-default",
    "aurelia-logging",
    "aurelia-logging-console",
    "aurelia-metadata",
    "aurelia-pal",
    "aurelia-pal-browser",
    "aurelia-path",
    "aurelia-polyfills",
    "aurelia-route-recognizer",
    "aurelia-router",
    "aurelia-task-queue",
    "aurelia-templating",
    "aurelia-templating-binding",
    "aurelia-templating-resources",
    "aurelia-templating-router"
];

const KARMA_MODULE_NAMES = [
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

if (argv._[0] === 'init') {
    console.log("Initializing project...");
    require('./jspm/jspm-cli').jspmCli.init().then(function () {
        console.log("Installing local JSPM...");
        return require("./npm/npm-api").npm.install(["jspm@beta"]);
    }).then(function () {
        console.log("Installing Aurelia...");
        return require('jspm').install("aurelia-bootstrapper");
    }).then(function () {
        return require("./npm/npm-api").npm.install(AURELIA_MODULE_NAMES);
    }).then(function () {
        console.log("Installing Karma...");
        return require("./npm/npm-api").npm.install(KARMA_MODULE_NAMES);
    }).then(function () {
        console.log("Setting up site structure...");
        var resourcePath = path.dirname(require.resolve('./resources/index.html'));
        var destPath = process.cwd();
        copyResources(resourcePath, destPath);
    }).catch(function (error) {
        console.log("Failed!", error);
    });
}

function copyResources(resourcePath, destPath) {
    fs.readdir(resourcePath, function (error, files) {
        for (var file in files) {
            var childPath = path.join(resourcePath, files[file]);
            var childDestPath = path.join(destPath, files[file]);
            if (fs.statSync(childPath).isDirectory()) {
                fs.mkdirSync(childDestPath);
                copyResources(childPath, childDestPath);
            } else {
                console.log("├── " + childPath);
                fs.createReadStream(childPath).pipe(fs.createWriteStream(childDestPath));
            }
        }
    });
}