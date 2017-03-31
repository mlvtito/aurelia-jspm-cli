"use strict";

//var Builder = require('jspm').Builder;

module.exports = function (argv) {
    var bundle = require("../node_modules/jspm/lib/bundle");
    bundle.bundle("src/**/*.ts", "bundles/bundle-dev.js", {minify: true, inject: true, dev: true, watch: true})
            .then(function () {
                var liveServer = require("../node_modules/live-server/index");
                liveServer.start({watch:[process.cwd() + "/bundles"], file:process.cwd()});
            }).catch(function () {
                process.exit(1);
            });
};