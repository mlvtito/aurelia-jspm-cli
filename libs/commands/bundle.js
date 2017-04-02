"use strict";

var project = require("../commons/project").project;
var Builder = require('jspm').Builder;

module.exports = function (argv) {
    console.log("Bundling...");
    var modules = project.vendorDependencies().map(d => d.moduleName).reduce((a,b) => a + " + " + b);
    console.log(modules);
    var builder = new Builder();
    builder.bundle(modules, "bundles/bundle-vendor.js", {minify:true, inject:true});
};