var express = require('express');
var stylus = require("stylus");
var autoprefixer = require('autoprefixer-stylus');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var reactify    = require('reactify');

var routes = require('./routes/index');
var api = require('./routes/api');

browserify.settings({
  transform: ['reactify']
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Stylus middleware
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: function (str, path) {
    return stylus(str)
    .use(autoprefixer())
    .set('filename', path)
  }
}
));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);

app.get('/javascripts/main.js', browserify('./src/javascripts/bundle.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
