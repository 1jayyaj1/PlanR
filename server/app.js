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

app.use('/', indexRouter);
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
