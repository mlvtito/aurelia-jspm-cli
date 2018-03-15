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
    handlePortParameter(argv);
    handleProxyParameters(argv);
    handleMockApiParameters(argv);
    handleSSLParameter(argv).then(() => {
        var bundle = require(path.dirname(require.resolve('jspm')) + "/lib/bundle");

        writeIndexFileForDev().then(function () {
            chokidar.watch("index.html", {}).on("all", (event, path) => {
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
        mockedReq = " ==> " + req.method + " " + req.url;
    }

    console.log(previousReq + mockedReq);
    next();
}

function handlePortParameter(argv) {
    if(argv.port) {
        var portNumber = parseInt(argv.port, 10);
        if (portNumber === +argv.port) {
            opts.port = portNumber;
        }
    }
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
    if (argv.ssl) {
        const myca = require('myca');
        return myca.isCenterInited("default").then(inited => {
            if (!inited) {
                return myca.initDefaultCenter().then(() => {
                    return myca.initCaCert({
                        days: 10950, // 30years
                        pass: 'mycapass',
                        CN: 'Development Root CA', // Common Name
                        O: 'Aurelia JSPM CLI', // Organization Name (eg, company)
                        C: 'FR' // Country Name (2 letter code)
                    }).then((ret) => {
                        console.log("");
                        console.log("A root certificate that will entrust your development cerificates has been "
                                + "generated (add it to your browser to avoid security exception and get a green padlock)"
                                + " : " + ret.crtFile);
                        console.log("");
                        return new Promise(function (resolve, reject) {
                            resolve();
                        });
                    });
                });
            } else {
                return myca.getCenterPath("default").then((centerPath) => {
                    const file = path.join(centerPath, "ca.crt");
                    console.log("");
                    console.log("Root CA certificate already exist, don't forget to add it to your browser : " + file);
                    console.log("");
                });
            }
        }).then(() => {
            return myca.genCert({
                caKeyPass: 'mycapass',
                kind: 'server', // server cert
                days: 730,
                pass: 'fooo', // at least 4 letters
                CN: '127.0.0.1', // Common Name
                OU: 'Development Server Certificate', // Organizational Unit Name
                O: 'Aurelia JSPM CLI', // Organization Name
                L: '', // Locality Name (eg, city)
                ST: '', // State or Province Name
                C: 'FR', // Country Name (2 letter code)
                emailAddress: '',
                ips: ["127.0.0.1"]
            });
        }).then((ret) => {
            const fs = require('fs');
            opts.https = {
                cert: fs.readFileSync(ret.crtFile),
                key: fs.readFileSync(ret.privateUnsecureKeyFile),
                password: 'fooo'
            }
        }).catch(data => {
            console.error("ERROR");
            console.error(data);
        });
    } else {
        return new Promise(function (resolve, reject) {
            resolve();
        });
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