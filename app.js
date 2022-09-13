const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerFilePath = `./swagger-output_${process.env.NODE_ENV}.json`;
const swaggerFile = require(swaggerFilePath);

const { handlerError } = require('./handStates/handles');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const usersThirdOauthRouter = require('./routes/users/thirdOauth');
const uploadRouter = require('./routes/upload');
const payRouter = require('./routes/pay');

const app = express();

// 補捉程式錯誤
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception (補捉程式錯誤)！');
  // 印出錯誤程式行數、內容、模組檔，在主機 console 中
  console.error(err);
  // 停掉該 process => [nodemon] app crashed - waiting for file changes before starting...
  process.exit(1);
});

require('./connections');
require('./connections/passport');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(usersRouter);
app.use(usersThirdOauthRouter);
app.use(postsRouter);
app.use(uploadRouter);
app.use(payRouter);
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
