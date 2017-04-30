var compression = require('compression');
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
var moment = require('moment');

var User = require('./models/user');
var bid = require('./models/bid');
var course = require('./models/course');
var message = require('./models/message');

mongoose.connect('mongodb://mathlab.kz:27017/MathLab');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        var filename;
        if (req.route.path == '/api/sendMessage') {
          filename = Date.now() + "-" + (file.originalname);
        }
        else if (req.route.path == '/api/uploadImg'){
          filename = req.user._id + ".jpg";
        }
        cb(null, filename);
    }
});
var upload = multer({ storage: storage });
app.use(compression());
app.use(subdomain('admin', router));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
	secret: "Zs&2ls)).@df",
	store: new MongoStore ({
		mongooseConnection: mongoose.connection
	}),
	cookie: {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7}
}));
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
app.get('/public/uploads/:filename', function (req, res){
  res.sendFile(__dirname + '/public/uploads/' + req.params.filename);
});
app.get('/sign-in', function (req, res){
	res.sendFile(__dirname + '/public/view/sign-in.html');
});
app.get('/sign-up', function (req, res){
	res.sendFile(__dirname + '/public/view/sign-up.html');
});
app.get('/course/:id', function (req, res){
  if (req.user.priority == "0") {
    course.findOne({ $and: [ {_id: mongoose.Types.ObjectId(req.params.id)}, {studentId: req.user._id} ] },
      function(err, data){
        if (err) throw err;
        if (!data) res.redirect('/access-denied');
        else res.sendFile(__dirname + '/public/view/course.html');
      });
  }
  else  {
    course.findOne({ $and: [ {_id: mongoose.Types.ObjectId(req.params.id)}, {teacherId: req.user._id} ] },
      function(err, data){
        if (err) throw err;
        if (!data) res.redirect('/access-denied');
        else res.sendFile(__dirname + '/public/view/course.html');
      });
  }
});
app.get('/request', function (req, res){
  res.sendFile(__dirname + '/public/view/request.html');
});
app.get('/settings', function (req, res){
  res.sendFile(__dirname + '/public/view/settings.html');
});
app.get('/teachers', function (req, res) {
  res.sendFile(__dirname + '/public/view/teachers.html');
});
app.get('/cabinet/:id', function (req, res){
  if (req.params.id == req.user._id) {
    if (req.user.priority >= 1) res.sendFile(__dirname + '/public/view/teacher.html');
    else res.sendFile(__dirname + '/public/view/cabinet.html');
  }
  else res.redirect('/access-denied');
});
app.get('/access-denied', function (req, res){
  res.sendFile(__dirname + '/public/view/access-denied.html');
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
          confirmed: false,
          priority: 0
        });
        newUser.save(function(err){
          if(err) throw err;
          req.logIn(newUser, function(err){
            if (err) { return next(err); }
            fs.readFile('public/images/profile.jpg', function (err, data) {
              if (err) throw err;
              fs.writeFile('public/uploads/' + newUser._id + '.jpg', data, function (err) {
                if (err) throw err;
                else res.send({id: req.user._id, email: req.user.email});
              });
            });
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

app.put('/api/reg-teacher', function (req, res, next){
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
          confirmed: false,
          priority: 1,
          subject: req.body.subject
        });
        newUser.save(function(err){
          if(err) throw err;
          fs.readFile('public/images/teacher.jpg', function (err, data) {
            if (err) throw err;
            fs.writeFile('public/uploads/' + newUser._id + '.jpg', data, function (err) {
              if (err) throw err;
              else res.send('Success');
            });
          });
        }); 
      });
    }
  });
});

app.put('/api/putBid', function (req, res){
  var newBid = bid({
    student: req.user.fullname,
    studentId: req.user._id,
    subject: req.body.subject,
    phone: req.user.phone,
    prefDays: req.body.prefDays,
    prefTime: req.body.prefTime,
    date: Date.now(),
    status: "Pending"
  });
  newBid.save(function(err){
    if (err) throw err;
    res.send('Success');
  });
});

app.post('/api/changeSettings', function (req, res){
  User.update({_id: mongoose.Types.ObjectId(req.user._id)}, 
    { $set: {fullname: req.body.newLogin, phone: req.body.newPhone, grade: req.body.newGrade} }, 
    function(err){
      if (err) throw err;
      res.send(req.user._id);
    });
});

app.post('/api/changePassword', function (req, res){
  bcrypt.compare(req.body.oldPassword, req.user.password).then(function (resp){
    if (!resp) res.send('Fail');
    else {
      bcrypt.hash(req.body.newPassword, 10).then(function(hash) {
        User.update({_id: mongoose.Types.ObjectId(req.user._id)},
          {$set: {password: hash} }, 
          function(err){
            if(err) throw err;
            req.user.password = hash;
            res.send("Success");
          });
      });
    }
  });
});

app.get('/api/loadStudentCourses', function (req, res){
  course.find({studentId: req.user._id}, '_id subject teacher days time date endingTime teacherId', function(err, data){
    if (err) throw err;
    res.send({time: Date.now(), answer: data});
  });
});

app.get('/api/loadTeacherCourses', function (req, res){
  course.find({teacherId: req.user._id}, '_id subject student days time date endingTime studentId', function(err, data){
    if (err) throw err;
    res.send({time: Date.now(), answer: data});
  });
});

app.post('/api/courseInfo', function (req, res){
  course.findOne({_id: mongoose.Types.ObjectId(req.body.dialogId)}, function(err, data){
    if (err) throw err;
    res.send(data);
  });
});

app.post('/api/loadMessages', function (req, res){
  message.
    find({ $and: [ {dialogId: req.body.dialogId}, { _id: {$lt: mongoose.Types.ObjectId(req.body.lastId) } } ] }).
    select('_id sender senderId message fileUrl fileSize date').
    sort({date: -1}).
    limit(10).
    exec(function(err, data){
      if (err) throw err;
      data.reverse();
      res.send(data);
    });
});

app.post('/api/sendMessage', upload.single('file'), function (req, res){
  var newMessage = message({
    dialogId: req.body.dialogId,
    senderId: req.user._id,
    sender: req.user.fullname,
    message: req.body.message,
    fileUrl: (req.file) ? ("/" + req.file.path) : (""),
    fileSize: (req.file) ? (req.file.size) : (0),
    date: Date.now()
  });
  newMessage.save(function(err){
    if (err) throw err;
    res.send(newMessage);
  });
});

app.post('/api/uploadImg', upload.single('file'), function (req, res){
  res.send("Success");
});

app.post('/api/log-out', function (req, res){
  req.session.destroy(function (err) {
    //res.redirect('/sign-in');
  });
});

app.post('/api/userInfo', function (req, res){
  res.send({id: req.user._id, fullname: req.user.fullname, email: req.user.email, phone: req.user.phone, sex: req.user.sex, grade: req.user.grade, confirmed: req.user.confirmed});
});

io.on('connection', function(socket){
  socket.on('setRooms', function(userId){
    User.
      findOne( {_id: mongoose.Types.ObjectId(userId)} ).
      select('priority').
      exec(function(err, data1){
        if (err) throw err;
        if (data1.priority == "0") {
          course.
            find({studentId: userId}).
            select('_id').
            exec(function(err, data){
              if (err) throw err;
              data.forEach(function(item, data){
                socket.join(item._id);
              });
            });
        }
        else {
          course.
            find({teacherId: userId}).
            select('_id').
            exec(function(err, data){
              if (err) throw err;
              data.forEach(function(item, data){
                socket.join(item._id);
              });
            });
        }
      });
  });
  socket.on('sendMessage', function(data){
    socket.broadcast.to(data.dialogId).emit('newMessage', data);
  });
})

//---------------------------------------------------------------------------------------------------------------------------------------------------------------
router.use(express.static('admin'));
router.use(morgan('dev'));
router.use(cookieParser());
router.use(session({
  secret: "Zs&2ls)).@df",
  store: new MongoStore ({
    mongooseConnection: mongoose.connection
  }),
  cookie: {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7}
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.use(function (req, res, next){
  if (req.url.split('/')[1] == 'api') next();
  else {
    if (!req.user) {
      if (req.url == '/sign-in') next();
      else res.redirect('/sign-in');
    }
    else {
      if (req.url == '/sign-in') res.redirect('/');
      else next();
    }
  }
});

router.get('/', function (req, res) {
  res.sendFile(__dirname + '/admin/view/index.html');
});
router.get('/teacher-form', function (req, res) {
  res.sendFile(__dirname + '/admin/view/teacher-form.html');
});
router.get('/sign-in', function (req, res) {
  res.sendFile(__dirname + '/admin/view/authorization.html');
});
router.get('/students', function (req, res) {
  res.sendFile(__dirname + '/admin/view/students.html');
});
router.get('/teachers', function (req, res) {
  res.sendFile(__dirname + '/admin/view/teachers.html');
});
router.get('/bids', function (req, res) {
  res.sendFile(__dirname + '/admin/view/bids.html');
});
router.get('/courses', function (req, res) {
  res.sendFile(__dirname + '/admin/view/courses.html');
});

router.post('/api/login', function (req, res){
  User.findOne({email: req.body.login}, function(err, user) {
    if (err) throw err;
    if (!user) res.send('Fail');
    else {
      bcrypt.compare(req.body.password, user.password).then(function (resp){
        if (!resp /* || user.priority != 2*/) res.send('Fail');
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

router.post('/api/loadBids', function (req, res){
  bid.
    find({
      _id: {$lt: mongoose.Types.ObjectId(req.body.lastID)}
    }).
    select('_id student studentId subject prefDays prefTime date phone status').
    sort({date: -1}).
    limit(10).
    exec(function(err, data){
      if (err) throw err;
      res.send(data);
    });
});

router.post('/api/loadTeachers', function (req, res){
  User.
    find({
      $and: [ { _id: {$gt: mongoose.Types.ObjectId(req.body.lastID)} }, { priority: 1 } ]
    }).
    select('_id email fullname phone sex subject').
    limit(10).
    exec(function(err, data){
      if (err) throw err;
      res.send(data);
    });
});

router.get('/api/teachers', function (req, res){
  User.find({priority: 1}, '_id fullname', function(err, data){
    if (err) throw err;
    res.send(data);
  });
});

router.post('/api/loadStudents', function (req, res){
  User.
    find({
      $and: [ { _id: {$gt: mongoose.Types.ObjectId(req.body.lastID)} }, { priority: 0 } ]
    }).
    select('_id email fullname phone sex grade confirmed').
    limit(10).
    exec(function(err, data){
      if (err) throw err;
      res.send(data);
    });
});

router.put('/api/createCourse', function (req, res){
  var curDate = Date.now();
  var newCourse = course({
    subject: req.body.subject,
    student: req.body.student,
    studentId: req.body.studentId,
    teacher: req.body.teacher,
    teacherId: req.body.teacherId,
    days: req.body.days,
    time: req.body.time,
    date: curDate,
    endingTime: moment(curDate).add(1, 'months').toDate()
  });
  newCourse.save(function(err){
    if (err) throw err;
    res.send('Success');
  });
});

router.post('/api/extendCourse', function (req, res){
  course.findOne({_id: mongoose.Types.ObjectId(req.body.courseId)}, function(err, data){
    if (err) throw err;
    data.endingTime = moment(data.endingTime).add(1, 'months').toDate();
    data.save(function(err){
      if (err) throw err;
      res.send('Success');
    });
  });
});

router.post('/api/updateBid', function (req, res){
  bid.update({_id: mongoose.Types.ObjectId(req.body.bidId)}, 
    { $set: {status: req.body.bidStatus } }, 
    function(err){
      if (err) throw err;
      res.send('Success');
    });
});

router.post('/api/log-out', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/sign-in');
  });
});

http.listen(80, function(){
  console.log('MathLab is listening on port 80');
});
