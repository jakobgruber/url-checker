// checks body of website if it contains </html>
// e.g. a site could be incomplete cause a php-error stops code-execution

var SiteNotCompleteError = require('./../utils/SiteNotCompleteError');

module.exports.check = function(body) {
    if (!body || body.indexOf("</html>") == -1) {
        throw new SiteNotCompleteError();
    }
};