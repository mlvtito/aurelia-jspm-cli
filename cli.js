//var pjson = require(process.cwd() + '/package.json');
var argv = require('minimist')(process.argv.slice(2));

require("./commands/" + argv._[0])(argv);

