var winston = require('winston');
var fs      = require('fs');

var logDir = './logs';

//check if log dir exist
stats = fs.lstatSync(logDir);
if (!stats.isDirectory()) {
    fs.mkdirSync(logDir, function(err) {
        if (err) throw err;
    });
}

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ level: 'debug', filename: './logs/debug.log'}),
        new (winston.transports.Console)({ level: 'info'})
    ]
});

module.exports = logger;