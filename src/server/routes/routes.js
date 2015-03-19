var path        = require('path');

module.exports.setup = function(app, express) {
    app.get('/check', function(req, res) {
        parserManager.startParsing(config.rssFeedUrls)
            .then(function(data) {
                res.json(data);
            });
    });

    app.use(express.static(path.join(__dirname, '../../public')));
};