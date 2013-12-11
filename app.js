/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var less = require('less-middleware');
var fp = require('french-press');
var gitTrigger = require('./lib/git-trigger');
var routes = require('./routes');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger());
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// french press blog
app.use('/blog/', fp.blog(
    {
        postsDir: __dirname + '/posts',
        listTemplate: 'layouts/blogList',
        postTemplate: 'layouts/blogPost'
    }));
// github trigger
app.use('/git-wh', gitTrigger.hook(
    {
        repoDir: __dirname,
        key: process.env.GIT_KEY || 'test_key'
    }));

// less-css support
app.use(less({
    src: path.join(__dirname, 'public'),
    compress: true
}));

// static files
var oneDay = 86400000;
app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneDay }));
app.use('/bower', express.static(path.join(__dirname, 'bower_components'), { maxAge: oneDay * 7 }));

// routes
app.get('/', routes.about);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    app.locals.pretty = true;
}

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
