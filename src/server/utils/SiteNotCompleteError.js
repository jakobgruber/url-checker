
var util = require('util');

function SiteNotCompleteError(url) {
    this.message = url + ' is not complete';
}

util.inherits(SiteNotCompleteError, Error);

module.exports = SiteNotCompleteError;