var chai            = require('chai');
var expect          = chai.expect;
var chaiAsPromised  = require('chai-as-promised');
chai.use(chaiAsPromised);

var feedParser      = require('./../../../src/server/feedParser');
var config          = require('./../../../src/server/config');

describe("test feed parsing", function() {
    var app, express, server;

    // create static route, so test-methods can access test-feed as URI
    before(function() {
        express = require('express');
        app = express();

        app.use(express.static(__dirname + '/files'));
        server = app.listen(config.testPort);
    });

    after(function() {
        server.close();
    });


    var validFeedUrl = 'http://127.0.0.1:'+config.testPort+'/valid-feed.rss';

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
        return expect(feedParser.getItemUrlsFromFeed(validFeedUrl)).to.eventually.have.length(4);
    });
});