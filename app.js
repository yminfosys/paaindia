var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var bodyParser = require('body-parser');
var dotenv=require('dotenv').config();

var indexRouter = require('./routes/index');
var indiaRouter = require('./routes/india');
var bdRouter = require('./routes/bd');
var ukRouter = require('./routes/uk');
var adminRouter = require('./routes/admin');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', [path.join(__dirname, 'views'),path.join(__dirname, 'views/india'),path.join(__dirname, 'views/bd'),path.join(__dirname, 'views/uk'),path.join(__dirname, 'views/admin')]);
app.set('view engine', 'ejs');

app.use(function(req, res, next){
  res.io = io;
  next();
});
/////// for Web Call////////
io.use((socket, next) => {
  if (socket.handshake.query) {
      let userName = socket.handshake.query.name
      socket.user = userName;
      next();
  }
})


io.on('connection', (socket) => {
  console.log(socket.user, "Connected");
  socket.join(socket.user);

  socket.on('call', (data) => {
      let callee = data.name;
      let rtcMessage = data.rtcMessage;

      socket.to(callee).emit("newCall", {
          caller: socket.user,
          rtcMessage: rtcMessage
      })

  })

  socket.on('answerCall', (data) => {
      let caller = data.caller;
      rtcMessage = data.rtcMessage

      socket.to(caller).emit("callAnswered", {
          callee: socket.user,
          rtcMessage: rtcMessage
      })

  })

  socket.on('ICEcandidate', (data) => {
      let otherUser = data.user;
      let rtcMessage = data.rtcMessage;

      socket.to(otherUser).emit("ICEcandidate", {
          sender: socket.user,
          rtcMessage: rtcMessage
      })
  })
})
/////// for Web Call////////

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({  secret: 'keyboard',resave: true,
saveUninitialized: true}))

app.use('/', indexRouter);
app.use('/india', indiaRouter);
app.use('/bd', bdRouter);
app.use('/uk', ukRouter);
app.use('/admin', adminRouter);


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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
