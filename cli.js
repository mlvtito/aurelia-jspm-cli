//var pjson = require(process.cwd() + '/package.json');
//var jspm = require('jspm');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
 console.dir(require.resolve('./resources/tsconfig.json'));
//console.log(process.env);

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
        require('jspm').install("aurelia-bootstrapper");
        return require("./npm/npm-api").npm.install(AURELIA_MODULE_NAMES);
        // CREATE INDEX.HTML / APP.HTML / APP.TS
        // CREATE KARMA CONF
        // GENERATE GITIGNORE FILE
    }).then(function () {
        console.log("Installing Karma...");
        return require("./npm/npm-api").npm.install(KARMA_MODULE_NAMES);
    }).then(function () {
        console.log("Setting up site structure...");
        copyResources("tsconfig.json");
        copyResources("index.html");
    });
}

function copyResources(resourceName) {
    fs.createReadStream(require.resolve('./resources/' + resourceName))
                .pipe(fs.createWriteStream(process.cwd() + "/" + resourceName));
}