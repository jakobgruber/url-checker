
// create test-server with static route, so test-methods can access files as URI

var express         = require('express');
var path            = require('path');

var config          = require('./../../../src/server/config/config');
var app, server;

function TestServer() {
    this.start = function() {
        app = express();
        app.use(express.static(path.join(__dirname, '../components/files')));
        server = app.listen(config.testPort);
    };

    this.end = function() {
        server.close();
    };
};

module.exports.getInstance = function() {
    return new TestServer();
};
