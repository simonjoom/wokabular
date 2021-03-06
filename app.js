var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cors = require('cors');
var config = require('./app/config');
var Verify = require('./app/verify');

//MongoDB
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', function(){
    if(err) throw err;
});
db.once('open', function(){
    console.log("Successfully connected to the database....");
});

//All API routes
var routes = require('./app/routes/index');
var users = require('./app/routes/users');
var lists = require('./app/routes/lists');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Passport Middleware
var User = require('./app/models/users');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, '/public')));
app.use('/bower_components',express.static(path.join(__dirname, '/bower_components')));
// app.use('/*',function(req, res,next) {
//     res.sendFile(__dirname + '/public/index.html');
// });
//Use API'S
app.use('/', routes);
app.use('/users', users);
app.use('/lists', lists);

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
