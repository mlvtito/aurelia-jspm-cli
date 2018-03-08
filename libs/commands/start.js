"use strict";

//var Builder = require('jspm').Builder;
const path = require('path');
const chokidar = require('chokidar');

var opts = {
    host: process.env.IP,
    port: process.env.PORT,
    open: '/index-dev.html',
    file: process.cwd(),
    mount: [],
    proxy: [],
    middleware: [],
    logLevel: 2,
    watch: [process.cwd() + "/index-dev.html", process.cwd() + "/bundles"]
};

module.exports = function (argv) {
    handleProxyParameters(argv);
    handleMockApiParameters(argv);
    handleSSLParameter(argv);

    var bundle = require(path.dirname(require.resolve('jspm')) + "/lib/bundle");

    writeIndexFileForDev().then(function() {
        chokidar.watch( "index.html", {}).on("all", (event, path) => {
            writeIndexFileForDev();
        });
    }).then(function () {
        return bundle.bundle("src/**/*.ts + src/**/*.html!text", "bundles/bundle-app.js", {
            minify: true,
            inject: false,
            sourceMaps: true,
            dev: true,
            watch: true
        });
    }).then(function () {
        var liveServer = require(path.dirname(require.resolve("live-server")) + "/index");
        liveServer.start(opts);
    }).catch(function (err) {
        console.log("ERR: " + err);
    });
};

var mockApiPath = "/test/mockapi";

function handleMockApiParameters(argv) {
    if (argv.mockapi) {
        opts.middleware.push(mockApiMiddleware);
    }
}

function mockApiMiddleware(req, res, next) {
    var previousReq = req.method + " " + req.url;
    var mockedReq = "";
    if (req.url.substring(0, 9) === "/mock/api") {
        req.url = req.url.replace("/mock/api", mockApiPath + "/" + req.method);
        req.method = 'GET';
        mockedReq = " ==> " +  req.method + " " + req.url;
    }
    
    console.log(previousReq + mockedReq);
    next();
}

function handleProxyParameters(argv) {
    if (argv.proxy) {
        if (typeof argv.proxy === 'object') {
            argv.proxy.forEach(arg => {
                var match = arg.match(/([^:]+):(.+)$/);
                opts.proxy.push([match[1], match[2]]);
            });
        } else if (typeof argv.proxy === 'string') {
            var match = argv.proxy.match(/([^:]+):(.+)$/);
            opts.proxy.push([match[1], match[2]]);
        }
    }
}

function handleSSLParameter(argv) {
    if(argv.ssl) {
        console.log("Generating SSL");
        opts.https = require.resolve("live-server-https");
    }
}

function writeIndexFileForDev() {
    return new Promise(function (resolve, reject) {
        var fs = require('fs');
        fs.readFile(process.cwd() + "/index.html", 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            var result = data.replace(/jspm\.browser\.js/g, 'jspm.browser.dev.js');

            fs.writeFile(process.cwd() + "/index-dev.html", result, 'utf8', function (err) {
                if (err)
                    reject(err);
            });
            resolve("Success");
        });
    });
}