
var logger              = require('./logger');

var config              = require('./config');
var parserManager       = require('./parserManager');

var io;

module.exports.setup = function(_io) {

    io = _io;

    io.on('connection',function(socket) {
        logger.info('new client - ' + socket.id);

        setupClientEventListeners(socket);
    });
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



var setupClientEventListeners = function(socket) {
    socket.on('disconnect', onDisconnect);

    socket.on('start-new-url-check', startNewCheck);
};

var onDisconnect = function(socket) {
    logger.info('client disconnect - ' + socket.id)
};

var startNewCheck = function() {
    logger.info('client requests new url-check ');

    parserManager.startParsing(config.rssFeedUrls);
};

