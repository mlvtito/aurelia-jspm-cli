"use strict";

//var Builder = require('jspm').Builder;

module.exports = function (argv) {
    var bundle = require("../../node_modules/jspm/lib/bundle");
    bundle.bundle("src/**/*.ts + src/**/*.html!text", "bundles/bundle-app.js",
            {minify: true, inject: false, sourceMaps: true, dev: true, watch: true}).then(function () {
        var liveServer = require("../../node_modules/live-server/index");
        liveServer.start({watch: [process.cwd() + "/bundles"], file: process.cwd()});
    }).catch(function (err) {
        console.log("ERR: " + err);
    });
};