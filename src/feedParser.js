var Promise     = require('bluebird');
var request     = require('request-promise');

var logger      = require('./logger');

var parseString = Promise.promisify(require('xml2js').parseString);

module.exports.getItemUrlsFromFeed = function(feedUrl) {
    var deferred = Promise.pending();

    request(feedUrl)
        .then(function(data) {
            return parseString(data);
        }).then(function(result) {
            logger.debug(result);
            return JSON.stringify(result);
        }).then(function(feedObj) {
            var links = getLinksFrom(feedObj);
            deferred.resolve(links);
        })
        .catch(function(err) {
            winston.error(err);
            deferred.reject(err);
        });

    return deferred.promise;
};


var getLinksFrom = function(feedObj) {

    logger.info('test');

    return [];
};