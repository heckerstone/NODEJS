var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var db=require('./db');
var settings=require('./settings');
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:settings.COOKIE_SECRET,
  cookie:{maxAge:360000*24*30},
  store:new MongoStore({
    db:settings.DB,
    host: settings.HOST,
    port: settings.PORT
  }),
  resave:true,
  saveUninitialized:true
}));



app.use('/', routes);

//登陆拦截器
app.use(function(req,res,next){
  var originalPath = req.originalUrl;
  var needLogin = require('./routes/login');
  var err = null;
  if(needLogin(originalPath))
  {
    var login = req.session.user;
    if(!login){
      res.redirect('index');
    }else{
      res.redirect('login');
    }
  }
  next(err);
});
app.use('/users', users);

//注册所有路由
//var file = fs.readdirSync('./routes');
//for(var i in file){
//  var name=file[i].replace('.js','');
//  app.use('/'+name,require('./routes'+name));
//}

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});


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

app.listen(3006);
