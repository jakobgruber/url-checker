var express             = require('express');

var config              = require('./config');
var parserManager      = require('./parserManager');
var logger              = require('./logger');

var app = express();

parserManager.startParsing();


app.listen(config.port);
logger.info('Magic happens on port ' + config.port);
