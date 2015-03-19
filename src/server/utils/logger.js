var winston = require('winston');
var fs      = require('fs');
var path    = require('path');
var mkdirp  = require('mkdirp');

var logDir = './logs';

//create the logs directory if it doesn't exists
mkdirp.sync( path.join(__dirname, '../../../logs') );

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ level: 'debug', filename: './logs/debug.log'}),
        new (winston.transports.Console)({ level: 'info'})
    ]
});

module.exports = logger;