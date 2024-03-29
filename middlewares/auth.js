const jwt = require('jsonwebtoken');

const handleErrorAsync = require('../handStates/handleErrorAsync');
const appError = require('../customErr/appError');
const User = require('../model/users');

module.exports = {
  // 確認 token 是否存在，user 物件 (含 id) 指向 express req
  isAuth: handleErrorAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
      token = req.headers.authorization.split(' ')[1]; // 分割字串去除 'Bearer ' 取向資料庫內 Token 比對
    if (!token) return next(appError(401, '你尚未登入！', next));

    // 驗證 token 正確性
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          reject(next(appError(401, '驗證 token 發生問題或不一致', next)));
        } else {
          resolve(payload); // 正確流程將結果 payload 賦予到 decoded
        }
      });
    });
    const currentUser = await User.findById(decoded.id);
    req.userID = currentUser.id;
    next();
  }),
  // 產生 JWT token
  generateSendJWT: (user, statusCode, res) => {
    const token = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        premiumMember: user.premiumMember.paid === 1,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_DAY,
      }
    );
    user.password = undefined;
    res.status(statusCode).json({
      status: 'success',
      data: {
        token: token,
        wholeToken: `Bearer ${token}`,
        userName: user.userName,
        premiumMember: user.premiumMember.paid === 1,
      },
    });
  },
  // 第三方登入傳送 JWT token
  generateRedirectJWT: (user, res) => {
    // console.log('generateRedirectJWT -> user', user);
    const token = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        avatarUrl: user.avatarUrl,
        gender: user.gender,
        premiumMember: user.premiumMember.paid === 1,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_DAY,
      }
    );
    user.password = undefined;

    /** 傳送方式一：
     * 如果導向特定主機網址寫法
     * 重新導向到前端，以 github 為目標
     */
    res.redirect(`${process.env.FRONTEND_URL}/thirdLogin.html?token=${token}`);

    /** 傳送方式二：
     * 針對使用 express 的 view 網頁使用 .send() 方法
     * 回傳出 JSON 格式
     */
    // res.send({
    //   status: true,
    //   token,
    //   name: user.name
    // })
  },
};
