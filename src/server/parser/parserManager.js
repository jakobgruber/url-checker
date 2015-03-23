/*
 manages parsing
 - takes rss-feeds from config
 - fetches item-urls
 - checks if every item-url is online
*/

var Promise                 = require('bluebird');
var errors                  = require('request-promise/errors');

var feedParser              = require('./feedParser');
var urlRequester            = require('./../utils/urlRequester');
var siteComplete            = require('./../checks/siteComplete');
var SiteNotCompleteError    = require('./../utils/SiteNotCompleteError');

var successCount = 0;
var failedCount = 0;
var _isParsing = false;


module.exports.setSocketWrapper = function(_socketWrapper) {
    socketWrapper = _socketWrapper;
};

module.exports.isParsing = function() {
    return _isParsing;
};

module.exports.startParsing = function(rssFeedUrls) {
    init();
    return Promise.map(rssFeedUrls, parseRssFeed);
};

var init = function() {
    successCount = 0;
    failedCount = 0;
    _isParsing = true;
};

var parseRssFeed = function(feedUrl) {
    socketWrapper.broadCastNewStatus('start parsing ' + feedUrl);

    return feedParser.getItemUrlsFromFeed(feedUrl)
        .then(function(itemUrls) {
            socketWrapper.broadCastNewStatus(itemUrls.length + ' item-urls found for ' + feedUrl);
            return checkItemUrls(itemUrls);
        }).then(function() {
            return sendParseResult(feedUrl);
        });
};

var checkItemUrls = function(itemUrls) {
    return Promise.map(itemUrls, function(itemUrl) {

        return urlRequester.getContentFrom(itemUrl)
            .then(function(result) {
                return siteComplete.check(result);
            }).then(function() {
                socketWrapper.broadCastNewStatus('success - ' + itemUrl);
                successCount++;
            }).catch(SiteNotCompleteError, function() {
                socketWrapper.broadCastErrorMsg('SiteNotCompleteError - ' + itemUrl);
                failedCount++;
            }).catch(errors.RequestError, function (reason) {
                socketWrapper.broadCastErrorMsg('RequestError - ' + reason.options.uri + ' - ' + reason.statusCode);
                failedCount++;
            }).catch(errors.StatusCodeError, function (reason) {
                socketWrapper.broadCastErrorMsg('StatusCodeError - ' + reason.options.uri + ' - ' + reason.statusCode);
                failedCount++;
            }).catch(function(err) {
                socketWrapper.broadCastErrorMsg('Error - ' + itemUrl + err.message);
                failedCount++;
            });
    });
};

var sendParseResult = function(feedUrl) {
    _isParsing = false;
    var result = {feedUrl: feedUrl, successCount: successCount, failedCount: failedCount};

    socketWrapper.broadCastResult(result);
    return result;
};