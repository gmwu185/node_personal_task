const bcrypt = require('bcryptjs'); // 密碼加密
const validator = require('validator'); // 格式驗證
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const { isAuth, generateSendJWT } = require('../handStates/auth');
const { handleSuccess } = require('../handStates/handles');
const handleErrorAsync = require('../handStates/handleErrorAsync');
const appError = require('../customErr/appError');

const User = require('../model/users');

module.exports = {
  createdUser: handleErrorAsync(async (req, res, next) => {
    const { userName, email, password, avatarUrl } = req.body;

    if (!userName) return appError(400, 'userName 必填', next);
    if (!email) return appError(400, 'email 必填', next);
    if (!password) return appError(400, 'password 必填', next);

    const createdUserData = {
      userName,
      email,
      password,
      avatarUrl, // 頭像
    };
    await User.create(createdUserData).then(async () => {
      const allUser = await User.find();
      handleSuccess(res, allUser);
    });
  }),
  signUp: handleErrorAsync(async (req, res, next) => {
    const { userName, email, password, confirmPassword } = req.body;
    const userData = {
      userName,
      email,
      password,
    };

    if (
      !userData.userName ||
      !userData.email ||
      !userData.password ||
      !confirmPassword
    )
      return appError('400', '欄位未填寫正確！', next);
    if (userData.password !== confirmPassword)
      return appError('400', '密碼不一致！', next);
    if (!validator.isLength(userData.password, { min: 8 }))
      return appError('400', '密碼字數低於 8 碼', next);
    if (!validator.isEmail(userData.email))
      return next(appError('400', 'Email 格式不正確', next));

    const checkRegisterAgain = await User.find({ email: userData.email });
    if (checkRegisterAgain.length > 1)
      return appError('400', 'Email 已重覆註冊', next);

    userData.password = await bcrypt.hash(userData.password, 12);
    const newUser = await User.create(userData);
    generateSendJWT(newUser, 201, res);
  }),
  signIn: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return appError(400, '帳號及密碼必填', next);

    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(appError(400, '未註冊使用者帳號無法登入', next));

    /** auth
     * 需是已註冊 user 的 email 才能進行
     * 解密 password
     */
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return next(appError(400, '您的密碼不正確', next));
    generateSendJWT(user, 200, res);
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { newPassword, confirmNewPassword } = req.body;
    const errorMessageArr = [];
    if (!validator.isLength(newPassword, { min: 8 })) {
      errorMessageArr.push('密碼長度必須超過 8 碼');
    }
    if (newPassword !== confirmNewPassword) {
      errorMessageArr.push('密碼不一致');
    }
    if (errorMessageArr.length > 0)
      return appError('400', errorMessageArr.join(', '), next);

    bcryptNewPassword = await bcrypt.hash(newPassword, 12);
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        password: bcryptNewPassword,
      },
      {
        new: true, // 回傳更新後的資料, default: false
      }
    );
    generateSendJWT(updateUser, 200, res);
  }),
};
