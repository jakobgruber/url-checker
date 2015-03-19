var express             = require('express');
var app                 = express();
var http                = require('http').Server(app);
var io                  = require('socket.io')(http);

var config              = require('./server/config/config');
var parserManager       = require('./server/parser/parserManager');
var logger              = require('./server/utils/logger');
var socketWrapper       = require('./server/socket/socketWrapper');
var routes              = require('./server/routes/routes');

// ------------- setup
socketWrapper.setup(io);
routes.setup(app, express);
parserManager.setSocketWrapper(socketWrapper);

// ------------- start
http.listen(app.listen(config.port));
logger.info('Magic happens on port ' + config.port);