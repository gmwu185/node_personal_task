var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerFilePath = `./swagger-output_${process.env.NODE_ENV}.json`;
const swaggerFile = require(swaggerFilePath);

const { handlerError } = require('./handStates/handles');

var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');

var app = express();

require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter);
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// 404 錯誤
app.use((req, res, next) => handlerError(res, 400, '無此路由資訊'));

// JSON 格式錯誤
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (err instanceof SyntaxError && 'body' in err)
    return handlerError(res, err.statusCode, err.message);
  next(err);
});

// 自己設定的 err 錯誤
const resErrorProd = (err, res) =>
  err.isOperational
    ? handlerError(res, err.statusCode, err.message)
    : /**
       * log 紀錄
       * 公版罐頭回應
       */
      (console.error('出現重大錯誤', err),
      handlerError(res, 500, '系統錯誤，請恰系統管理員'));

// 開發環境錯誤
const resErrorDev = (err, res) => {
  /** 錯誤發生時的順序
   * 套件錯誤印出
   * DB 錯誤印出
   */
  handlerError(res, err.statusCode, {
    error: err,
    errorMessage: err.message,
    errorStack: err.stack,
  });
};

// 錯誤處理
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  // 開發環境
  if (process.env.NODE_ENV === 'dev') return resErrorDev(err, res);
  // 正式環境
  if (err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確，請重新輸入！';
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  resErrorProd(err, res);
});

// 未捕捉到的 catch
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
