var logger              = require('./logger');
var config              = require('./config');
var feedParser          = require('./feedParser');
var urlChecker          = require('./urlChecker');
var Promise             = require('bluebird');
var errors              = require('request-promise/errors');

var successCount = 0;
var failedCount = 0;

module.exports.startParsing = function() {
    init();
    return Promise.map(config.rssFeedUrls, parseRssFeed);
};

var init = function() {
    successCount = 0;
    failedCount = 0;
};

var parseRssFeed = function(feedUrl) {
    logger.info('start parsing ' + feedUrl);
    return feedParser.getItemUrlsFromFeed(feedUrl)
        .then(function(itemUrls) {
            logger.info(itemUrls.length + ' item-urls found');
            return checkItemUrls(itemUrls);
        });
};

var checkItemUrls = function(itemUrls) {
    return Promise.map(itemUrls, function(itemUrl) {
        return urlChecker.check(itemUrl)
            .then(function(data) {
                successCount++;
            }).catch(errors.RequestError, function (reason) {
                logger.error('RequestError - ' + reason.options.uri + ' - ' + reason.statusCode);
                failedCount++;
            }).catch(errors.StatusCodeError, function (reason) {
                logger.error('StatusCodeError - ' + reason.options.uri + ' - ' + reason.statusCode);
                failedCount++;
            }).catch(function(err) {
                logger.error(err);
                failedCount++;
            });
    }).then(function() {
        logger.info('finished - success: ' + successCount + ', failed: ' + failedCount);

        return {successCount: successCount, failedCount: failedCount};
    });
};