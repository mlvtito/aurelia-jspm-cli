// Karma configuration
// Generated on Mon Mar 20 2017 15:39:28 GMT+0100 (CET)

module.exports = function (config) {
    config.set({

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jspm', 'mocha', 'chai'],

        jspm: {
            config: 'jspm.config.js',
            browser: 'jspm.browser.js',
            loadFiles: ['test/unit/*.spec.ts'],
            serveFiles: ['src/*.ts', 'bundles/*.js'],
	    useBundles: true
        },
        
        proxies: {
            '/src/': '/base/src/',
            '/test/': '/base/test/',
            '/bundles/': '/base/bundles/',
            '/jspm_packages/': '/base/jspm_packages/'
        },
        
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Firefox'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
