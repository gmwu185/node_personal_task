var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

/* router ------------------------------------------------------------------- */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
/* /router ------------------------------------------------------------------- */

/* express 設定 --------------------------------------------------------------- */
var app = express();

require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
/* express 設定 --------------------------------------------------------------- */

module.exports = app;
