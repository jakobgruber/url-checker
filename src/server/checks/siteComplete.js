// checks body of website if it contains </html>
// e.g. a site could be incomplete cause a php-error stops code-execution

var SiteNotCompleteError = require('./../utils/SiteNotCompleteError');

module.exports.check = function(result) {
    if (!result || !result.body || !result.url) {
        throw new SiteNotCompleteError("no-url");
    }

    if (result.body.indexOf("</html>") == -1) {
        throw new SiteNotCompleteError(result.url);
    }

    return result;
};