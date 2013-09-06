var process = require('process');
var url = require('url');

exports.hook = function (options) {
    var repoDir = options.repoDir;
    var key = options.key;

    console.log('Git trigger key: ' + key);

    return function (req, res, next) {
        var query = url.parse(req.url, true).query;

        if (query.key != key) {
            res.send(401);
        } else {
            process.exec('git pull', { cwd: repoDir }, function(err, stdout, stderr) {
                if(err) {
                    console.log("Error execing git pull: " + err + ". stderr => " + stderr);
                } else {
                    console.log("Executed git pull");
                }
            });
            res.send(200);
        }
    }
}