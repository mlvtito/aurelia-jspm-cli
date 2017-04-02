"use strict";

var JspmCli = function () {};
var path = require("path");

var jspmApiPath = require.resolve("jspm");
var jspmCli = path.join( path.dirname(jspmApiPath), "jspm.js");

JspmCli.prototype.init = function () {
    return new Promise(function (resolve, reject) {
        var initProcess = require('child_process').spawn(jspmCli, ["init"]);
        initProcess.stdin.setEncoding('utf-8');
        var totalOutput = "";
        initProcess.stdout.on('data', function (data) {
            totalOutput = totalOutput + data.toString();
            promptIfnecessary(totalOutput);
        });
        initProcess.stdout.pipe(process.stdout);
        initProcess.on('exit', function (code) {
            console.log("");
            if (code !== 0) {
                reject("Failure");
            } else {
                // remove 
                resolve("Success");
            }
        });

        function promptIfnecessary(totalOutput) {
            var lastLineIndex = totalOutput.lastIndexOf("\n");
            var lastLine = totalOutput.substring(lastLineIndex + 1);
            if (!isBlank(lastLine)) {
                for (var property in JSPM_INIT_PROMPTS) {
                    if (JSPM_INIT_PROMPTS.hasOwnProperty(property)) {
                        for (var i = 0; i < JSPM_INIT_PROMPTS[property].length; i = i + 2) {
                            if (!JSPM_INIT_PROMPTS[property][i + 1] && JSPM_INIT_PROMPTS[property][i].test(lastLine)) {
                                initProcess.stdin.write(property);
                                JSPM_INIT_PROMPTS[property][i + 1] = true;
                                if (hasPromptedEverythign()) {
                                    initProcess.stdin.end();
                                }
                                return;
                            }
                        }
                    }
                }
            }
        }
    });


};

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

var JSPM_INIT_PROMPTS = {
    "\x08\x08\x08\n": [/SystemJS\.config local package format \(esm, cjs, amd\):.*esm/, false],
    "\x08.\n": [/SystemJS\.config browser baseURL \(optional\):.*\//, false],
    "Standard\n": [/Init mode \(Quick, Standard, Custom\) \[Quick\]:/, false],
    "Yes\n": [/Use package\.json configFiles\.jspm:browser\? \[[A-Za-z]*\]:/, false,],
    "typescript\n": [/SystemJS\.config transpiler \(Babel, Traceur, TypeScript, None\) \[[a-z]*\]:/, false],
    "app.ts\n": [/SystemJS\.config local package main \[app.js\]:/, false],
    "\n": [/Package\.json file does not exist, create it\? \[Yes\]\:/, false,
        /Local package name \(recommended, optional\):.*app/, false,
        /package\.json directories\.baseURL:.*\./, false,
        /package\.json configFiles folder \[\.\/\]:/, false,
        /Use package.json configFiles.jspm:dev\? \[No\]:/, false,
        /SystemJS.config Node local project path \[src\/\]:/, false,
        /SystemJS.config browser local project URL to src\/ \[\/?src\/\]:/, false,
        /package\.json directories\.packages \[jspm_packages\/\]:/, false,
        /SystemJS\.config browser URL to jspm_packages \[\/?jspm_packages\/\]:/, false]
};



function hasPromptedEverythign() {
    var everythingPrompted = true;
    for (var property in JSPM_INIT_PROMPTS) {
        if (JSPM_INIT_PROMPTS.hasOwnProperty(property)) {
            for (var i = 0; i < JSPM_INIT_PROMPTS[property].length; i = i + 2) {
                everythingPrompted = everythingPrompted & JSPM_INIT_PROMPTS[property][i + 1];
            }
        }
    }
    return everythingPrompted;
}

module.exports = {
    jspmCli: new JspmCli()
};