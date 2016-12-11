var express = require('express');
var expressJwt = require('express-jwt');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var configuration = require('./configurations/configuration');
var accounts = require('./routers/accounts');
var index = require('./routers/index');

var heimdallr = express();

heimdallr.use(logger('dev'));
//Authorization Bearer 
// heimdallr.use(expressJwt({
//   secret: configuration.jwt.tokenSecret,
//   credentialsRequired: configuration.jwt.credentialsRequired
// }).unless({
//   path: ['/authenticate']
// }));

heimdallr.use(bodyParser.json());
heimdallr.use(bodyParser.urlencoded({ extended: false }));
heimdallr.use(cookieParser());
// heimdallr.use(express.static(path.join(__dirname, 'public')));

heimdallr.use('/', accounts);

heimdallr.use('/index', index);

// catch 404 and forward to error handler
heimdallr.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
heimdallr.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = heimdallr;
