const bcrypt = require('bcryptjs'); // 密碼加密
const validator = require('validator'); // 格式驗證
const { isAuth, generateSendJWT } = require('../handStates/auth');

const { handleSuccess } = require('../handStates/handles');
const handleErrorAsync = require('../handStates/handleErrorAsync');
const appError = require('../customErr/appError');

const User = require('../model/users');

module.exports = {
  async createdUser(req, res) {
    /** #swagger.tags = ['users (使用者)']
     ** #swagger.description = '新增使用者'
     */
    try {
      /**
        ** #swagger.parameters['body'] = {
          in: "body",
          type: "object",
          required: true,
          description: "資料格式查看必填欄位，點按下方 Model 切換後，屬性欄位名稱的後方紅色的*",
          schema: {
            "$userName": "jimmyWu",
            "$email": "gg@mail.com",
            "$password": "123456",
            "avatarUrl": "https://avatars.githubusercontent.com/u/42748910?v=4"
          }
        }
      */
      const data = req.body;
      const user = {
        userName: data.userName,
        email: data.email,
        password: data.password,
        avatarUrl: data.avatarUrl, // 頭像
      };
      await User.create(user).then(async () => {
        const allUser = await User.find();
        handleSuccess(res, allUser);
      });
    } catch (err) {
      console.log('req error', err);
      handleErrorAsync(res, err);
    }
  },
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

    userData.password = await bcrypt.hash(userData.password, 12);
    const newUser = await User.create(userData);
    generateSendJWT(newUser, 201, res);
  }),
};
