var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerFilePath = `./swagger-output_${process.env.NODE_ENV}.json`;
const swaggerFile = require(swaggerFilePath);

/* router ------------------------------------------------------------------- */
var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
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
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));
/* express 設定 --------------------------------------------------------------- */

// 錯誤處理
app.use(function(err, req, res, next) {
  // console.log('app.js use err', err);
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack
  });
})

module.exports = app;
