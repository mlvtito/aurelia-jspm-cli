"use strict";

var project = require("../commons/project").project;
var Builder = require('jspm').Builder;

module.exports = function (options) {
    var builder = new Builder();
    var message = "Bundling ";
    if (options.vendor) {
        message = message + "Vendor Dependencies";
        if( options.app ) {
            message = message + " and ";
        }
        var modules = project.vendorDependencies().map(d => d.moduleName).reduce((a, b) => a + " + " + b);
        builder.bundle(modules, "bundles/bundle-vendor.js", {minify: true, inject: false, sourceMaps: true});
    }
    
    if (options.app) {
        message = message + "App...";
        var modules = "src/**/*.ts + src/**/*.html!text - " + project.vendorDependencies().map(d => d.moduleName).reduce((a, b) => a + " - " + b);
        builder.bundle(modules, "bundles/bundle-app.js", {minify: true, inject: false, sourceMaps: true});
    }
    
    console.log(message);
};