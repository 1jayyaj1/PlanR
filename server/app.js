var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var feedbackRouter = require('./routes/feedback');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/umba', { useNewUrlParser: true });
let db = mongoose.connection;
db.once('open', function(){
    console.log('connected to mongodb');
})
db.on('error', function(err){
    console.log(err)
})

// Models
let Event = require('./models/event');
let User =  require('./models/user');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// Miscellaneous
app.use(logger('dev'));
// we will remove this for now since most of the object are 1:1 mapping with what the client sends
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = { mongooseConnection: mongoose.connection };

// Use the session middleware
app.use(session({
    secret: "magical ankur",
    name: "umba_cookie",
    store: new MongoStore(options), // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

// Access the session as req.session
app.get('/', function(req, res, next) {
    if (req.session.views) {
      req.session.views++
      res.setHeader('Content-Type', 'text/html')
      res.write('<p>views: ' + req.session.views + '</p>')
      res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      res.end()
    } else {
      req.session.views = 1
      res.end('welcome to the session demo. refresh!')
    }
  })

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/feedback', feedbackRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler middleware
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
});

module.exports = app;
