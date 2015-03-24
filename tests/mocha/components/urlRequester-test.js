var chai            = require('chai');
var expect          = chai.expect;
var chaiAsPromised  = require('chai-as-promised');
chai.use(chaiAsPromised);

var urlRequester      = require('./../../../src/server/utils/urlRequester');
var testServer      = require('./../utils/testServer');

var validUrl = testServer.getBaseUrl() + '/complete.html';
var nonExistingUrl = testServer.getBaseUrl() + '/does-not-exist.html';
var invalidUrl = 'invalid-url';


describe('test url-requester methods', function() {
    before(function() {
        testServer.start();
    });

    after(function() {
        testServer.end();
    });

    it('should reject on empty url', function() {
        return expect(urlRequester.getContentFrom('')).to.be.rejected;
    });

    it('should reject on undefined url', function() {
        return expect(urlRequester.getContentFrom()).to.be.rejected;
    });

    it('should reject on invalid url - 1', function() {
        return expect(urlRequester.getContentFrom(invalidUrl)).to.be.rejected;
    });

    it('should reject on valid but not reachable url', function() {
        return expect(urlRequester.getContentFrom(nonExistingUrl)).to.be.rejected;
    });

    it('should resolve', function() {
        return expect(urlRequester.getContentFrom(validUrl)).to.be.fulfilled;
    });

    it('should resolve with valid object', function() {
        return expect(urlRequester.getContentFrom(validUrl)).to.eventually.have.all.keys('reachable', 'url', 'body');
    });

    it('should resolve with reachable=true', function() {
        return expect(urlRequester.getContentFrom(validUrl)).to.eventually.have.deep.property('reachable', true);
    });

    it('should resolve with validUrl=http://www.google.com', function() {
        return expect(urlRequester.getContentFrom(validUrl)).to.eventually.have.deep.property('url', validUrl);
    });
});