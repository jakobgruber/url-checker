var chai            = require('chai');
var expect          = chai.expect;
var chaiAsPromised  = require('chai-as-promised');
chai.use(chaiAsPromised);

var feedParser      = require('./../../../src/server/parser/feedParser');
var testServer      = require('./../utils/testServer');

describe("test feed parsing", function() {
    before(function() {
        testServer.start();
    });

    after(function() {
        testServer.end();
    });

    var validFeedUrl = testServer.getBaseUrl() + '/valid-feed.rss';

    it ("should not parse empty url", function() {
        return expect(feedParser.getItemUrlsFromFeed('')).to.be.rejected;
    });

    it ("should not parse undefined url", function() {
        return expect(feedParser.getItemUrlsFromFeed()).to.be.rejected;
    });

    it ("should not parse NULL", function() {
        return expect(feedParser.getItemUrlsFromFeed(null)).to.be.rejected;
    });

    it ("should parse valid feed", function() {
        return expect(feedParser.getItemUrlsFromFeed(validFeedUrl)).to.be.fulfilled;
    });

    it ("should contains four links after parsing", function() {
        return expect(feedParser.getItemUrlsFromFeed(validFeedUrl)).to.eventually.have.length(6);
    });
});