/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fp = require('french-press');
var gitTrigger = require('./lib/git-trigger');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use('/blog/', fp.blog(
    {
        postsDir: __dirname + '/posts',
        listTemplate: 'blogListTemplate',
        postTemplate: 'blogPostTemplate'
    }));
app.use('/git-wh', gitTrigger.hook(
    {
        repoDir: __dirname,
        key: process.env.GIT_KEY || 'test_key'
    }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var request = require('request');
app.get('/favicon.ico', function (req, res) {
    request('http://gravatar.com/avatar/8f04ed154a6a276594899964a567a885.png?s=16').pipe(res);
})

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
