"use strict";

var fs = require("fs");
var jspm = require('jspm');
var npm = require("../npm/npm-api").npm;

require(process.cwd() + '/jspm.config.js');

module.exports = function (argv) {
    console.log("Installing dependency " + argv._[1] + "...");

    var dependenciesMap = extractDependenciesMap(argv._[1]);
    jspm.install(dependenciesMap).then(function () {
        var toolsDependencies = [];
        require("../commons/project").project.vendorDependencies().forEach(dependency => {
            if (dependency.registry === "npm") {
                toolsDependencies.push(dependency.dependency);
            }
        });
        if (toolsDependencies.length > 0) {
            return npm.install(toolsDependencies);
        }
    }).then(function () {
        var promises = [];
        require("../commons/project").project.vendorDependencies().forEach(dependency => {
            if (dependency.registry === "npm") {
                var depJson = JSON.parse(fs.readFileSync(process.cwd() + '/node_modules/' + dependency.moduleName + '/package.json', 'utf8'));
                if (!depJson.typings) {
                    promises.push(npm.exists("@types/" + dependency.moduleName));
                }
            } else {
                promises.push(npm.exists("@types/" + dependency.moduleName));
            }
        });
        return Promise.all(promises.map(reflect));
    }).then(function (results) {
        var success = results.filter(x => x.status === "resolved").map(x => x.v.module);
        if (success.length > 0) {
            return npm.install(success);
        }
    }).catch(function (error) {
        console.log("Failed!", error);
    });
};

function extractDependenciesMap(arg) {
    var depMap = {};
    var name = arg.split('=')[0];
    var target = arg.split('=')[1];
    if (!target) {
        target = name;
        if (name.indexOf(':') !== -1)
            name = name.substr(name.indexOf(':') + 1);
        if (name.lastIndexOf('@') > 0)
            name = name.substr(0, name.lastIndexOf('@'));
    }

    if (target.indexOf(':') === -1)
        target = 'jspm:' + target;

    depMap[name] = target || '';
    return depMap;
}

function reflect(promise) {
    return promise.then(function (v) {
        return {v: v, status: "resolved"};
    },
            function (e) {
                return {e: e, status: "rejected"};
            });
}