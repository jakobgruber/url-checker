var express             = require('express');

var config              = require('./config');
var parserManager      = require('./parserManager');
var logger              = require('./logger');

var app = express();

app.get('/check', function(req, res) {
    parserManager.startParsing(config.rssFeedUrls)
        .then(function(data) {
            res.json(data);
        });
});

app.listen(config.port);
logger.info('Magic happens on port ' + config.port);
