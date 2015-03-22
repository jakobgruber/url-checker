var chai            = require('chai');
var expect          = chai.expect;
var fs              = require('fs');
var chaiAsPromised  = require('chai-as-promised');
chai.use(chaiAsPromised);

var siteComplete            = require('./../../../src/server/checks/siteComplete');
var SiteNotCompleteError    = require('./../../../src/server/utils/SiteNotCompleteError');

    describe('test site-complete-check methods', function() {
    var app, express, server;

    it ('should reject if body is empty', function() {
        expect(function() { siteComplete.check('') }).to.throw(SiteNotCompleteError);
    });

    it ('should reject if body is null', function() {
        expect(function() { siteComplete.check(null) }).to.throw(SiteNotCompleteError);
    });

    it ('should reject if body is undefined', function() {
        expect(function() { siteComplete.check() }).to.throw(SiteNotCompleteError);
    });

    it ('should reject if body is incomplete', function() {
        var incompleteHtml = fs.readFileSync(__dirname + '/files/incomplete.html', "utf8");
        expect(function() { siteComplete.check(incompleteHtml) }).to.throw(SiteNotCompleteError);
    });

    it ('should fulfill if body is complete', function() {
        var completeHtml = fs.readFileSync(__dirname + '/files/complete.html', "utf8");
        expect(function() { siteComplete.check(completeHtml) }).to.not.throw();
    });
});