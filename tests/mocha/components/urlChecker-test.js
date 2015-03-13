var chai            = require('chai');
var expect          = chai.expect;
var chaiAsPromised  = require('chai-as-promised');
chai.use(chaiAsPromised);

var urlChecker      = require('./../../../src/urlChecker');

var validUrl = 'http://www.google.com';

describe('test url check methods', function() {

    it('should reject on empty url', function() {
        return expect(urlChecker.check('')).to.be.rejected;
    });

    it('should reject on undefined url', function() {
        return expect(urlChecker.check()).to.be.rejected;
    });

    it('should reject on invalid url - 1', function() {
        return expect(urlChecker.check('jakob')).to.be.rejected;
    });

    it('should reject on invalid url - 2', function() {
        return expect(urlChecker.check('http:google.at')).to.be.rejected;
    });

    it('should reject on valid but not reachable url', function() {
        return expect(urlChecker.check('http://www.thisurldoesnotexist.com')).to.be.rejected;
    });

    it('should resolve', function() {
        return expect(urlChecker.check(validUrl)).to.be.fulfilled;
    });

    it('should resolve with valid object', function() {
        return expect(urlChecker.check(validUrl)).to.eventually.include.keys('reachable', 'url');
    });

    it('should resolve with valid keys', function() {
        var obj = {reachable: true, url: validUrl};
        return expect(urlChecker.check(validUrl)).to.eventually.deep.equals(obj);
    });

});