var chai            = require('chai');
var expect          = chai.expect;
var chaiAsPromised  = require('chai-as-promised');
chai.use(chaiAsPromised);

var parserManager   = require('./../../../src/server/parser/parserManager');
var testServer      = require('./../utils/testServer');

var dummySocketWrapper = {
    broadCastNewStatus: function() {},
    broadCastErrorMsg: function() {},
    broadCastResult: function() {}
};

describe("test parser manager", function() {
    var app, express, server;

    // create static route, so test-methods can access test-feed as URI
    before(function() {
        testServer.start();
        parserManager.setSocketWrapper(dummySocketWrapper);
    });

    after(function() {
        testServer.end();
    });


    var validFeedUrl = testServer.getBaseUrl() + '/valid-feed.rss';

    it("should not parse empty url", function() {
        return expect(parserManager.startParsing([''])).to.be.rejected;
    });

    it("should only parse valid urls", function() {
        var obj = [{feedUrl: validFeedUrl, successCount: 4, failedCount: 2}];
        return expect(parserManager.startParsing([validFeedUrl])).to.eventually.deep.equals(obj);
    });
});