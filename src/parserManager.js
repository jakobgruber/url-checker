var logger              = require('./logger');
var config              = require('./config');
var feedParser          = require('./feedParser');
var urlChecker          = require('./urlChecker');
var UrlNotValidError    = require('./customError').UrlNotValidError;

var successCount = 0;
var failedCount = 0;

module.exports.startParsing = function() {
    init();
    config.rssFeedUrls.forEach(parseRssFeed);
};

var init = function() {
    successCount = 0;
    failedCount = 0;
};

var parseRssFeed = function(feedUrl) {
    feedParser.getItemUrlsFromFeed(feedUrl)
        .then(function(itemUrls) {
            checkItemUrls(itemUrls);
        });
};

var checkItemUrls = function(itemUrls) {
    itemUrls.forEach(function(itemUrl) {
        urlChecker.check(itemUrl)
            .then(function(data) {
                logger.info('successfully - ' + data.url);
            }).catch(UrlNotValidError, function(err) {
                logger.error('failed - ' + err.message);
            }).catch(function(err) {
                logger.error(err);
            });
    });
};