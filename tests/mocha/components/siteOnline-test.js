var chai            = require('chai');
var expect          = chai.expect;
var chaiAsPromised  = require('chai-as-promised');
chai.use(chaiAsPromised);

var siteOnline          = require('./../../../src/server/checks/siteOnline');
var SiteNotOnlineError  = require('./../../../src/server/errors/SiteNotCompleteError');
var testServer          = require('./../utils/testServer');

var validUrl = testServer.getBaseUrl() + '/complete.html';
var nonExistingUrl = testServer.getBaseUrl() + '/does-not-exist.html';
var invalidUrl = 'invalid-url';

describe('test site-online-check method', function() {
    before(function() {
        testServer.start();
    });

    after(function() {
        testServer.end();
    });
    
    it('should reject on empty url', function() {
        return expect(siteOnline.check('')).to.be.rejectedWith(SiteNotOnlineError);
    });

    it('should reject on undefined url', function() {
        return expect(siteOnline.check()).to.be.rejectedWith(SiteNotOnlineError);
    });

    it('should reject on invalid url - 1', function() {
        return expect(siteOnline.check(invalidUrl)).to.be.rejectedWith(SiteNotOnlineError);
    });

    it('should reject on valid but not reachable url', function() {
        return expect(siteOnline.check(nonExistingUrl)).to.be.rejectedWith(SiteNotOnlineError);
    });

    it('should resolve', function() {
        return expect(siteOnline.check(validUrl)).to.be.fulfilled;
    });
});