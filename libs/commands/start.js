"use strict";

//var Builder = require('jspm').Builder;

module.exports = function (argv) {
    var bundle = require("../../node_modules/jspm/lib/bundle");
    var bundlePromise = bundle.bundle("src/**/*.ts + src/**/*.html!text", "bundles/bundle-app.js",
            {minify: true, inject: false, sourceMaps: true, dev: true, watch: true});


    writeIndexFileForDev();
    bundlePromise.then(function () {
        var liveServer = require("../../node_modules/live-server/index");
        liveServer.start({
            watch: [process.cwd() + "/index-dev.html", process.cwd() + "/bundles"],
            file: process.cwd(),
            open: '/index-dev.html'
        });
    }).catch(function (err) {
        console.log("ERR: " + err);
    });
};

function writeIndexFileForDev() {
    var fs = require('fs')
    fs.readFile(process.cwd() + "/index.html", 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/jspm\.browser\.js/g, 'jspm.browser.dev.js');

        fs.writeFile(process.cwd() + "/index-dev.html", result, 'utf8', function (err) {
            if (err)
                return console.log(err);
        });
    });
}