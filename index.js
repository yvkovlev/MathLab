var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var multer = require('multer');
var morgan = require('morgan');
//var flash = require('connect-flash');
var fs = require('fs');

var user = require('./models/user');
mongoose.connect('mongodb://localhost:27017/MathLab');
/*var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id + '.jpg');
    }
});*/
//var upload = multer({ storage: storage });
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
/*app.use(session({
	secret: "Zs&2ls)).@df",
	store: new MongoStore ({
		mongooseConnection: mongoose.connection
	}),
	cookie: {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7}
}));*/
//app.use(flash());
/*app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(login, password, done) {
    User.findOne({login: login}, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      bcrypt.compare(password, user.password).then(function(resp) {
        if (!resp) return done(null, false, { message: 'Incorrect password.' });
        else
        {
        	return done(null, user);
        }
      });
    });
  }
));*/

app.get('/sign-in', function (req, res){
	res.sendFile(__dirname + '/public/sign-in.html');
});

app.get('/sign-up', function (req, res){
	res.sendFile(__dirname + '/public/sign-up.html');
});
app.get('/', function (req, res){
	res.sendFile(__dirname + '/public/cabinet.html');
});

http.listen(3000, function(){
  console.log('MathLab is listening on port 3000');
});
