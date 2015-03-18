var express             = require('express');
var app                 = express();
var http                = require('http').Server(app);
var io                  = require('socket.io')(http);

var config              = require('./server/config');
var parserManager       = require('./server/parserManager');
var logger              = require('./server/logger');
var socketWrapper       = require('./server/socketWrapper');

// ------------- setup
socketWrapper.setup(io);
parserManager.setSocketWrapper(socketWrapper);

// ------------- routes
app.get('/check', function(req, res) {
    parserManager.startParsing(config.rssFeedUrls)
        .then(function(data) {
            res.json(data);
        });
});

app.use(express.static(__dirname + '/public'));

// ------------- start
http.listen(app.listen(config.port));
logger.info('Magic happens on port ' + config.port);
