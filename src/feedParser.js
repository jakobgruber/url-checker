var Promise     = require('bluebird');
var request     = require('request-promise');

var parseString = Promise.promisify(require('xml2js').parseString);

module.exports.getItemUrlsFromFeed = function(feedUrl) {
    var deferred = Promise.pending();

    request(feedUrl)
        .then(function(data) {
            return parseString(data);
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
    var links = [];

    if (feedObj && feedObj.rss && feedObj.rss.channel && feedObj.rss.channel.length >= 1) {
        var channel = feedObj.rss.channel[0];

        if(channel.item && Array.isArray(channel.item)) {
            channel.item.forEach(function(item) {
                if (item.link && Array.isArray(item.link) && Array.length >= 1) {
                    links.push(item.link[0]);
                }
            });
        }
    }

    return links;
};