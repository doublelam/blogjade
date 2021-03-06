var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var marked = require('jstransformer')(require('jstransformer-marked'));
var ts = require('jstransformer')(require('jstransformer-typescript'));

//routes 
var routes = require('./routes');
// var users = require('./routes/users');
// var start = require('./routes/start');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('env','production');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Lam secret'));
app.use(express.static(path.join(__dirname, 'public'),{maxAge:120000}));

// 使用统一index文件路由
// app.use('/', start);
// app.use('/article', article);
// app.use('/users', users);
// app.use('/start', start);
routes(app);
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
    message: 'production'+err.message,
    error: {}
  });
  next();
});




module.exports = app;
