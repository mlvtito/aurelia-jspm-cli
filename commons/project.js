"use strict";

var fs = require("fs");

var Project = function () {};

Project.prototype.vendorDependencies = function () {
    var vendorDependencies = []
    var projectJson = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf8'));
    addVendorDependencies(vendorDependencies, projectJson.jspm.dependencies, projectJson);
    addVendorDependencies(vendorDependencies, projectJson.jspm.peerDependencies, projectJson);
    return vendorDependencies;
};

function addVendorDependencies(vendorDependencies, jspmDependencies, projectJson) {
    for (var key in jspmDependencies) {
        if (!jspmDependencies[key].startsWith("npm:jspm-nodelibs")) {
            var idx = jspmDependencies[key].indexOf(":");
            vendorDependencies.push({
                registry: jspmDependencies[key].substring(0, idx), 
                moduleName: key, 
                dependency: jspmDependencies[key].substring(idx+1)
            });
        }
    }
}

module.exports = {
    project: new Project()
};
