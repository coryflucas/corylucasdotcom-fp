---
title: Automatically pull latest on change with GitHub
date: 2013-09-05 10:00 PM
---
One of the things I wanted to set up when I created [French Press](https://github.com/coryflucas/french-press) was the
ability for the blog to automatically pull new posts from GitHub when I committed them to the repo.  To do this I have
set up an endpoint in my Express application to listen for an HTTP request, and trigger a 'git pull' command.  The code
checks for a query string parameter set to a secret key so that I don't have to worry about someone trigger pull
requests without me knowing.

## The code
This code checks the request and kicks of the git command:

    var exec = require('child_process').exec;
    var url = require('url');

    exports.hook = function (options) {
        var repoDir = options.repoDir;
        var key = options.key;

        return function (req, res, next) {
            var query = url.parse(req.url, true).query;

            if (query.key != key) {
                res.send(401);
            } else {
                exec('git pull', { cwd: repoDir }, function(err, stdout, stderr) {
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

And since it follows the Express middleware pattern, hooking it up is dead simple:

    var express = require('express');
    var gitTrigger = require('./lib/git-trigger');

    var app = express();

    app.use('/git-wh', gitTrigger.hook(
        {
            repoDir: PATH_TO_THE_REPO,
            key: 'SecretKey!'
        }));

I've set the key to be read from and environment variable so that it won't be checked into source control (that would
kind of the defeat the whole 'secret' part).

## Kicking it off on commit
Now we need something to call the endpoint when we push a change to the repo.  GitHub's
[webhooks](https://help.github.com/articles/post-receive-hooks#adding-a-webhook) work great for this.  Just set one up
pointed to the endpoint you choose with the key as a query string parameter.  If you wanted to get a little fancier,
the payload of the webhook request has a ton of data you could use to do something else.

All together this makes posting to my blog super simple.  Since GitHub lets you create files from the web interface, I
can even create a post from the web.  Now if only their editor has a spell checker...