/*
 manages parsing
 - takes rss-feeds from config
 - fetches item-urls
 - checks if every item-url is online
*/

var Promise                 = require('bluebird');

var feedParser              = require('./feedParser');
var siteOnline              = require('./../checks/siteOnline');
var siteComplete            = require('./../checks/siteComplete');
var SiteNotCompleteError    = require('./../errors/SiteNotCompleteError');
var SiteNotOnlineError      = require('./../errors/SiteNotOnlineError');

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
    return Promise.map(itemUrls, checkItemUrl);
};

var checkItemUrl = function(itemUrl) {
    return siteOnline.check(itemUrl)
        .then(function(result) {
            return siteComplete.check(result);
        }).then(function() {
            socketWrapper.broadCastNewStatus('success - ' + itemUrl);
            successCount++;
        }).catch(SiteNotCompleteError, function() {
            socketWrapper.broadCastErrorMsg('SiteNotCompleteError - ' + itemUrl);
            failedCount++;
        }).catch(SiteNotOnlineError, function() {
            socketWrapper.broadCastErrorMsg('SiteNotOnlineError - ' + itemUrl);
            failedCount++;
        });
};

var sendParseResult = function(feedUrl) {
    _isParsing = false;
    var result = {feedUrl: feedUrl, successCount: successCount, failedCount: failedCount};

    socketWrapper.broadCastResult(result);
    return result;
};