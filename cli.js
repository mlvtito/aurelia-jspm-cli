//var pjson = require(process.cwd() + '/package.json');
var jspm = require('jspm');
var argv = require('minimist')(process.argv.slice(2));
// console.dir(argv);
//console.log(process.env);

if (argv._[0] === 'init') {
    // INITIALIZE JSPM PROJECT (WITH TYPESCRIPT AND NO BROWSER URL)
    console.log("Initializing project...");
    var initProcess = require('child_process').spawn("jspm", ["init"]);
    initProcess.on('exit', function (code) {
        console.log("PROCESS EXITED WITH CODE " + code);
        
        // INSTALLING Aurelia with JSPM
        console.log("Installing Aurelia...");
        require('jspm').install("aurelia-bootstrapper");
        
        // INSTALLING Aurelia with NPM for typings
        // CREATE TSCONFIG
        // CREATE INDEX.HTML / APP.HTML / APP.TS
        // INSTALLING KARMA & DEPENDENCIES (JPSM, MOCHA, CHAI)
        // CREATE KARMA CONF
        // GENERATE GITIGNORE FILE
    });
    
//    initProcess.stdout.pipe(process.stdout);
    initProcess.stdin.setEncoding('utf-8');
    var totalOutput = "";
    initProcess.stdout.on('data', function (data) {
        totalOutput = totalOutput + data.toString();
        promptIfnecessary(totalOutput);
    });
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

var JSPM_INIT_PROMPTS = {
    "\x08\n": [/SystemJS\.config browser baseURL \(optional\):.*\//, false],
    "typescript\n": [/SystemJS\.config transpiler \(Babel, Traceur, TypeScript, None\) \[[a-z]*\]:/, false],
    "app.ts\n": [/SystemJS\.config local package main \[app.js\]:/, false],
    "\n": [/Package\.json file does not exist, create it\? \[Yes\]\:/, false,
        /Init mode \(Quick, Standard, Custom\) \[Quick\]:/, false,
        /Local package name \(recommended, optional\):.*app/, false,
        /package\.json directories\.baseURL:.*\./, false,
        /package\.json configFiles folder \[\.\/\]:/, false,
        /Use package.json configFiles.jspm:dev\? \[No\]:/, false,
        /SystemJS.config Node local project path \[src\/\]:/, false,
        /SystemJS.config browser local project URL to src\/ \[\/src\/\]:/, false,
        /package\.json directories\.packages \[jspm_packages\/\]:/, false,
        /SystemJS\.config browser URL to jspm_packages \[\/jspm_packages\/\]:/, false]
}

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
                        if( hasPromptedEverythign()) {
                            initProcess.stdin.end();
                        }
                        return;
                    }
                }
            }
        }
    }
}

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