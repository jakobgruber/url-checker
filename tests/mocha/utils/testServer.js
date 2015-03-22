
// create test-server with static route, so test-methods can access files as URI

var express         = require('express');
var path            = require('path');

var config          = require('./../../../src/server/config/config');
var app, server;


module.exports.start = function() {
    app = express();
    app.use(express.static(path.join(__dirname, '../components/files')));
    server = app.listen(config.testPort);
};

module.exports.end = function() {
    server.close();
};

module.exports.getBaseUrl = function() {
    return 'http://127.0.0.1:'+config.testPort;
};
