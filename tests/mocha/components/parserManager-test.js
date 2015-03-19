var chai            = require('chai');
var expect          = chai.expect;
var chaiAsPromised  = require('chai-as-promised');
chai.use(chaiAsPromised);

var parserManager   = require('./../../../src/server/parser/parserManager');
var config          = require('./../../../src/server/config/config');

var dummySocketWrapper = {
    broadCastNewStatus: function() {},
    broadCastErrorMsg: function() {},
    broadCastResult: function() {}
};

describe("test parser manager", function() {
    var app, express, server;

    // create static route, so test-methods can access test-feed as URI
    before(function() {
        express = require('express');
        app = express();

        app.use(express.static(__dirname + '/files'));
        server = app.listen(config.testPort);

        parserManager.setSocketWrapper(dummySocketWrapper);
    });

    after(function() {
        server.close();
    });


    var validFeedUrl = 'http://127.0.0.1:'+config.testPort+'/valid-feed.rss';

    it("should not parse empty url", function() {
        return expect(parserManager.startParsing([''])).to.be.rejected;
    });

    it("should only parse valid urls", function() {
        var obj = [{feedUrl: validFeedUrl, successCount: 3, failedCount: 1}];
        return expect(parserManager.startParsing([validFeedUrl])).to.eventually.deep.equals(obj);
    });
});