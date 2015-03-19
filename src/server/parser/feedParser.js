var Promise     = require('bluebird');
var request     = require('request-promise');

var logger              = require('./../utils/logger');

var parseString = Promise.promisify(require('xml2js').parseString);

module.exports.getItemUrlsFromFeed = function(feedUrl) {
    var deferred = Promise.pending();

    requestFeedUrl(feedUrl, deferred);

    return deferred.promise;
};

var requestFeedUrl = function(feedUrl, deferred) {
    if (!feedUrl) {
        return deferred.reject(new Error("feedUrl is blank"));
    }

    request(feedUrl)
        .then(function (data) {
            return parseString(data);
        }).then(function (feedObj) {
            var links = getLinksFrom(feedObj);
            deferred.resolve(links);
        }).catch(function (err) {
            logger.error(err);
            deferred.reject(err);
        });
};

var getLinksFrom = function(feedObj) {
    var links = [];

    var channel = getChannelFrom(feedObj);
    var items = getItemsFrom(channel);
    channel.item.forEach(function(item) {
        pushLinkFromItemsTo(item, links);
    });

    return links;
};

var getChannelFrom = function(feedObj) {
    if (!(feedObj && feedObj.rss && feedObj.rss.channel && feedObj.rss.channel.length >= 1)) {
        throw new Error("not a valid channel");
    }

    return feedObj.rss.channel[0];
};

var getItemsFrom = function(channel) {
    if (!(channel.item && Array.isArray(channel.item))) {
        throw new Error("items must be an array");
    }

    return channel.item;
};

var pushLinkFromItemsTo = function(item, links) {
    if (!(item.link && Array.isArray(item.link) && Array.length >= 1 && item.link[0])) {
        logger.info("can not get link from item");
        return;
    }

    links.push(item.link[0]);
};
