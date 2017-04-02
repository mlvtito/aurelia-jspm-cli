#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
require("../libs/commands/" + argv._[0])(argv);

