var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fs = require('fs');


var indexRouter = require('./routes/index');

var allowedOrigins = JSON.parse(fs.readFileSync('./cors.json')).allowed;
var app = express();

var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if ((allowedOrigins.indexOf(origin) !== -1) || !origin){
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

app.use(cookieParser(process.env.session_secret));
app.use(session({secret: process.env.session_secret,  resave: false, saveUninitialized: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err);
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
