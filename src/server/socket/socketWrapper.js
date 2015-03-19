var logger              = require('./../utils/logger');
var config              = require('./../config/config');
var parserManager       = require('./../parser/parserManager');

var io;
var clients = {};

module.exports.setup = function(_io) {
    io = _io;
    setupClientEventListeners();
};

module.exports.broadCastNewStatus = function(msg) {
    logger.info('broadcast new status - ' + msg);
    io.emit('new-status', msg);
};
module.exports.broadCastErrorMsg = function(msg) {
    logger.error('broadcast error - ' + msg);
    io.emit('new-error', msg);
};
module.exports.broadCastResult = function(result) {
    logger.info('broadcast result - ' + JSON.stringify(result));
    io.emit('new-result', result);
};


var setupClientEventListeners = function() {
    io.on('connection',function(socket) {
        logger.info('new client - ' + socket.id);
        clients[socket.id] = socket;

        onDisconnect(socket);
        onStartNewCheck(socket);
    });
};

var onDisconnect = function(socket) {
    socket.on('disconnect', function() {
        delete clients[socket.id];
        logger.info('client disconnect - ' + socket.id);
    });
};

var onStartNewCheck = function(socket) {
    socket.on('start-new-url-check', function() {
        logger.info('client requests new url-check ' + socket.id);

        if (parserManager.isParsing()) {
            logger.info('request canceled, already parsing');
            return socket.emit('new-error', 'request canceled, already parsing');
        }

        parserManager.startParsing(config.rssFeedUrls);
    });
};

