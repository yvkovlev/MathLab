var express = require('express');
var app = express();
var subdomain = require('express-subdomain');
var router = express.Router();
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
var flash = require('connect-flash');
var fs = require('fs');

var User = require('./models/user');
mongoose.connect('mongodb://mathlab.kz:27017/MathLab');
/*var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id + '.jpg');
    }
});*/
//var upload = multer({ storage: storage });
app.use(subdomain('admin', router));
app.use(express.static('public'));
router.use(express.static('admin'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
	secret: "Zs&2ls)).@df",
	store: new MongoStore ({
		mongooseConnection: mongoose.connection
	}),
	cookie: {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7}
}));
app.use(flash());
app.use(passport.initialize());
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
    User.findOne({email: login}, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password).then(function(resp) {
        if (!resp) return done(null, false);
        else
        {
        	return done(null, user);
        }
      });
    });
  }
));
app.use(function (req, res, next){
  if (req.url.split('/')[1] == 'api') next();
  else {
    if (!req.user) {
      if (req.url == '/' || req.url == '/sign-in' || req.url == '/sign-up') next();
      else res.redirect('/sign-in');
    }
    else {
      if (req.url == '/sign-in' || req.url == '/sign-up' || req.url == '/') res.redirect('/cabinet/' + req.user._id);
      else next();
    }
  }
});

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/view/welcome.html');
});
app.get('/sign-in', function (req, res){
	res.sendFile(__dirname + '/public/view/sign-in.html');
});
app.get('/sign-up', function (req, res){
	res.sendFile(__dirname + '/public/view/sign-up.html');
});
app.get('/course', function (req, res){
  res.sendFile(__dirname + '/public/view/course.html');
});
app.get('/request', function (req, res){
  res.sendFile(__dirname + '/public/view/request.html');
});
app.get('/settings', function (req, res){
  res.sendFile(__dirname + '/public/view/settings.html');
});
app.get('/teachers', function (req, res){
  res.sendFile(__dirname + '/public/view/teachers.html');
});
app.get('/cabinet/:id', function (req, res){
  if (req.user._id == req.params.id) res.sendFile(__dirname + '/public/view/cabinet.html');
  else res.send('Fuck off');
});

app.put('/api/registration', function (req, res, next){
  User.findOne({email: req.body.email}, function(err, user){
    if (user) res.send('Fail');
    else {
      bcrypt.hash(req.body.password, 10).then(function(hash) {
        var newUser = User({
          _id: new mongoose.Types.ObjectId,
          fullname: req.body.fullname,
          email: req.body.email,
          password: hash,
          phone: req.body.phone,
          sex: req.body.sex,
          grade: req.body.grade,
          confirmed: false
        });
        newUser.save(function(err){
          if(err) throw err;
          req.logIn(newUser, function(err){
            if (err) { return next(err); }
            res.send({id: req.user._id, email: req.user.email});
          });
        }); 
      });
    }
  });
});

app.post('/api/login', function (req, res){
  User.findOne({email: req.body.login}, function(err, user) {
    if (err) throw err;
    if (!user) res.send('Fail');
    else {
      bcrypt.compare(req.body.password, user.password).then(function (resp){
        if (!resp) res.send('Fail');
        else {
            req.logIn(user, function(err){
              if (err) { return next(err); }
              res.send(req.user._id);
            });
        }
      });
    }
  });
});

app.post('/api/log-out', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/sign-in');
  });
});

User.find({}, function(err, data){ console.log(data); });

app.post('/api/userInfo', function (req, res){
  res.send({fullname: req.user.fullname, email: req.user.email, phone: req.user.phone, sex: req.user.sex, grade: req.user.grade, confirmed: req.user.confirmed});
});

router.get('/', function (req, res) {
  res.sendFile(__dirname + '/admin/view/index.html');
});
router.get('/teacher-form', function (req, res) {
  res.sendFile(__dirname + '/admin/view/teacher-form.html');
});

http.listen(80, function(){
  console.log('MathLab is listening on port 3000');
});
