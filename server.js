'use strict';

require('dotenv').load();

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride  = require('method-override');
var flash = require('connect-flash');
var passport = require('passport');
var favicon = require('serve-favicon');

var config = require('./server/config/default');


/* --- configuration ----------------------------------------------- */
var port = config.port;

// set up express
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/build/app')); 
app.use(favicon(__dirname + '/build/app/images/favicon/cmscubed-favicon.ico'));

// set up passport
require('./server/config/passport')(passport); // pass passport for configuration

app.use(session({
	secret: 'cmscubedsecretkeyplease',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());


/* --- routes ------------------------------------------------------ */
app.use('/', require('./server/routes'));


/* --- start scoket.io --------------------------------------------- */
io.on('connection', function(socket){
  console.log('user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
require('./router/socket')(io);

/* --- start app --------------------------------------------------- */
server.listen(port);
console.log('Listening on port: ', port);
