var Promise             = require('bluebird');
var errors              = require('request-promise/errors');

var logger              = require('./logger');
var feedParser          = require('./feedParser');
var urlChecker          = require('./urlChecker');

var successCount = 0;
var failedCount = 0;

module.exports.startParsing = function(rssFeedUrls) {
    init();
    return Promise.map(rssFeedUrls, parseRssFeed);
};

module.exports.setSocketWrapper = function(_socketWrapper) {
    socketWrapper = _socketWrapper;
};

var init = function() {
    successCount = 0;
    failedCount = 0;
};

var parseRssFeed = function(feedUrl) {
    socketWrapper.broadCastNewStatus('start parsing ' + feedUrl);

    return feedParser.getItemUrlsFromFeed(feedUrl)
        .then(function(itemUrls) {
            socketWrapper.broadCastNewStatus(itemUrls.length + ' item-urls found for ' + feedUrl);
            return checkItemUrls(itemUrls, feedUrl);
        });
};

var checkItemUrls = function(itemUrls, feedUrl) {
    return Promise.map(itemUrls, function(itemUrl) {
        return urlChecker.check(itemUrl)
            .then(function(data) {
                socketWrapper.broadCastNewStatus('success - ' + itemUrl);
                successCount++;
            }).catch(errors.RequestError, function (reason) {
                socketWrapper.broadCastErrorMsg('RequestError - ' + reason.options.uri + ' - ' + reason.statusCode);
                failedCount++;
            }).catch(errors.StatusCodeError, function (reason) {
                socketWrapper.broadCastErrorMsg('StatusCodeError - ' + reason.options.uri + ' - ' + reason.statusCode);
                failedCount++;
            }).catch(function(err) {
                socketWrapper.broadCastErrorMsg('Error - ' + itemUrl);
                failedCount++;
            });
    }).then(function() {
        var result = {feedUrl: feedUrl, successCount: successCount, failedCount: failedCount};

        socketWrapper.broadCastResult(result);

        return result;
    });
};