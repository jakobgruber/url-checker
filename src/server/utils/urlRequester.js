
var request             = require('request-promise');
var Promise             = require('bluebird');
var validator           = require('validator');

var gunzip              = Promise.promisify(require('zlib').gunzip);

// some websites blocks requests from non-browser-agents and response with 404
var requestOptions = {
    resolveWithFullResponse: true,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4',
        'Accept-Encoding': 'gzip',
        'Cache-Control': 'max-age=0'
    },
    encoding: null
};

module.exports.getContentFrom = function(url) {
    var deferred = Promise.pending();

    if(checkValidUrl(deferred, url)) {
        requestUrl(deferred, url);
    }

    return deferred.promise;
};

var checkValidUrl = function(deferred, url) {
    if(!validator.isURL(url)) {
        deferred.reject(new Error('invalid: ' + url));
        return false;
    }

    return true;
};

var requestUrl = function(deferred, url) {
    request(url, requestOptions)
        .then(function (response) {
            return unzipBody(response);
        }).then(function(unzipped) {
            deferred.resolve({reachable: true, url: url, body: unzipped.toString()});
        }).catch(function (err) {
            deferred.reject(err);
        });
};

var unzipBody = function(response) {
    if (response.headers['content-encoding'] == 'gzip') {
        return gunzip(response.body)
    }

    return response.body
};