
function UrlNotValidError(url, statusCode) {
    this.name = "UrlNotValidError";
    this.message = (url + " - " + statusCode);
}
UrlNotValidError.prototype = Error.prototype;

module.exports.UrlNotValidError = UrlNotValidError;