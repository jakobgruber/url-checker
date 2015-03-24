
var util = require('util');

function SiteNotOnlineError(url, statusCode) {
    this.message = url + ' is not online';

    if (statusCode) {
        this.message += ' - statuscode: ' + statusCode;
    }
}

util.inherits(SiteNotOnlineError, Error);

module.exports = SiteNotOnlineError;