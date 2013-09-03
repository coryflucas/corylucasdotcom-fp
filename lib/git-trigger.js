var git = require('git').Git;
var url = require('url');

exports.hook = function (options) {
    var repoDir = options.repoDir;
    var key = options.key;

    return function (req, res, next) {
        var query = url.parse(req.url, true).query;

        if (query.key != key) {
            res.send(401);
        } else {
            new git(repoDir).git('pull', function (err, result) {
                if (err)
                    console.log('Failed git pull: ' + err);
                else
                    console.log('Completed git pull: ' + result);
            });
            res.send(200);
        }
    }
}