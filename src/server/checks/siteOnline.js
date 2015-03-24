
var SiteNotOnlineError      = require('./../errors/SiteNotCompleteError');
var urlRequester            = require('./../utils/urlRequester');
var errors                  = require('request-promise/errors');

module.exports.check = function(itemUrl) {
    return urlRequester.getContentFrom(itemUrl)
        .then(function(result) {
            return result;
        }).catch(errors.RequestError, function (reason) {
            throw new SiteNotOnlineError(itemUrl, reason.statusCode);
        }).catch(errors.StatusCodeError, function (reason) {
            throw new SiteNotOnlineError(itemUrl, reason.statusCode);
        }).catch(function(err) {
            throw new SiteNotOnlineError(itemUrl);
        });
};