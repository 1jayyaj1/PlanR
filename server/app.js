var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
require('dotenv').config();
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var feedbackRouter = require('./routes/feedback');
var announceRouter = require('./routes/notification');
var loginRouter = require('./routes/login');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var helmet = require('helmet')

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = { mongooseConnection: mongoose.connection };

// Use the session middleware
app.use(session({
    secret: "magical ankur",
    name: "umba_cookie",
    store: new MongoStore(options),
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 60 * 1000 * 30 // short, only for testing 
    }
}));

app.use('/users', usersRouter);

app.use(helmet())
app.use('/login', loginRouter);
app.use('/events', eventsRouter);
app.use('/feedback', feedbackRouter);
app.use('/notification', announceRouter);

app.get('/info', function(req, res) {
    if (!req.session.logged) {
        return res.sendStatus(401);
    } else {
        var info = {
            username: req.session.username,
            admin: req.session.admin
        };
    
        return res.send(info);
    }
});

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
