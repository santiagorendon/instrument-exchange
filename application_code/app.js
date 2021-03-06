// app.js
const express = require('express');
const app = express();
require('./db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const flash = require('flash');
const session = require('express-session');
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
const passport = require('passport');

// static files setup
app.use(express.static(publicPath));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport config
require('./auth')(passport);

// setting session options (code used from online slides)
const sessionOptions = {
    secret: 'secret',
    saveUninitialized: true,
    resave: true
};
app.use(session(sessionOptions));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// for dynamic navbar creation
app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Getting routes
const register = require('./routes/register');
const welcome = require('./routes/welcome');
const login = require('./routes/login');
const logout = require('./routes/logout');
const failure = require('./routes/failure');
const buySell = require('./routes/buy_sell');
const sellerPortal = require('./routes/seller_portal');
const studioListing = require('./routes/list_studio');
const instrumentListing = require('./routes/list_instrument');

// route middleware goes here.
app.use('/', register);
app.use('/', welcome);
app.use('/', login);
app.use('/', logout);
app.use('/', failure);
app.use('/', buySell);
app.use('/', sellerPortal);
app.use('/', studioListing);
app.use('/', instrumentListing);


// firing up the node server
const appConnection = function () {
    app.listen(process.env.PORT || 3000, () => {
      return "Server Listening";
    });
};

appConnection();


// sample functions for mocha test
const greet = function() {
    return "hello";
};

// exporting the necessary modules for testing
module.exports = {
    greet: greet,
    appConnection: appConnection,
};
