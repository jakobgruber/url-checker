var chai            = require('chai');
var expect          = chai.expect;
var chaiAsPromised  = require('chai-as-promised');
chai.use(chaiAsPromised);

var urlChecker      = require('./../../../src/server/checks/urlOnline');

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
        return expect(urlChecker.check(validUrl)).to.eventually.have.all.keys('reachable', 'url', 'response');
    });

    it('should resolve with reachable=true', function() {
        return expect(urlChecker.check(validUrl)).to.eventually.have.deep.property('reachable', true);
    });

    it('should resolve with validUrl=http://www.google.com', function() {
        return expect(urlChecker.check(validUrl)).to.eventually.have.deep.property('url', 'http://www.google.com');
    });
});