const bcrypt = require('bcryptjs'); // 密碼加密
const validator = require('validator'); // 格式驗證
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const { isAuth, generateSendJWT } = require('../handStates/auth');
const { handleSuccess } = require('../handStates/handles');
const handleErrorAsync = require('../handStates/handleErrorAsync');
const appError = require('../customErr/appError');

const User = require('../model/users');
const Posts = require('../model/posts');

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
    if (userData.userName.length < 2)
      return appError('400', '暱稱至少 2 個字元以上', next);
    if (userData.password !== confirmPassword)
      return appError('400', '密碼不一致！', next);
    if (!validator.isLength(userData.password, { min: 8 }))
      return appError('400', '密碼字數低於 8 碼', next);
    if (!validator.isEmail(userData.email))
      return next(appError('400', 'Email 格式不正確', next));
    if (validator.isNumeric(password) || validator.isAlpha(password))
      return appError('400', '密碼需英數混合', next);

    const checkRegisterAgain = await User.find({ email: userData.email });
    if (checkRegisterAgain.length > 0)
      return appError('400', 'Email 已重覆註冊', next);

    userData.password = await bcrypt.hash(userData.password, 12);
    const newUser = await User.create(userData);
    generateSendJWT(newUser, 201, res);
  }),
  signIn: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return appError(400, '帳號及密碼必填', next);

    const user = await User.findOne({ email }).select('+password');
    if (!user) return appError(400, '未註冊使用者帳號無法登入', next);

    /** auth
     * 需是已註冊 user 的 email 才能進行
     * 解密 password
     */
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return appError(400, '您的密碼不正確', next);
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
    if (validator.isNumeric(newPassword) || validator.isAlpha(newPassword)) {
      errorMessageArr.push('密碼需英數混合');
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
        returnDocument: 'after',
        new: true, // 回傳更新後的資料, default: false
      }
    );
    generateSendJWT(updateUser, 200, res);
  }),
  getProfile: handleErrorAsync(async (req, res, next) => {
    const { gender, _id, userName, email } = req.user;
    const userObj = { gender, _id, userName, email };
    if (!userObj) return appError(400, 'user 資訊未帶入', next);
    handleSuccess(res, userObj);
  }),
  patchProfile: handleErrorAsync(async (req, res, next) => {
    const { userName, avatarUrl, gender } = req.body;
    const patchData = { userName, avatarUrl, gender };
    if (!userName) return appError(400, 'userName 名稱必填', next);
    if (userName.length < 2)
      return appError('400', '暱稱至少 2 個字元以上', next);
    const profileUser = await User.findByIdAndUpdate(
      req.user.id,
      patchData,
      {
        new: true,
        select: 'userName avatarUrl gender email',
        returnDocument: 'after'
      },
    )
      .catch((err) => appError(400, '輸入欄位資料有錯誤', next));
    handleSuccess(res, profileUser);
  }),
  addFollow: handleErrorAsync(async (req, res, next) => {
    if (req.params.id === req.user.id)
      return next(appError(401, '您無法追蹤自己', next));

    const checkFollowUser = await User.find({
      _id: req.params.id,
    });
    if (checkFollowUser.length === 0) {
      return appError(401, `${req.params.id} 無此 user ID`, next);
    } else {
      const following = await User.updateOne(
        {
          _id: req.user.id,
          'following.userData': { $ne: req.params.id },
        },
        {
          $addToSet: { following: { userData: req.params.id } },
        }
      );
      // 有更新 modifiedCount: 1 / 沒更新 modifiedCount: 0
      if (following.modifiedCount == 0)
        return next(appError(401, `正在追蹤 ${req.params.id} 已加入過`, next));

      const followers = await User.updateOne(
        {
          _id: req.params.id,
          'followers.userData': { $ne: req.user.id },
        },
        {
          $addToSet: { followers: { userData: req.user.id } },
        }
      );
      // 有更新 modifiedCount: 1 / 沒更新 modifiedCount: 0
      if (followers.modifiedCount == 0)
        return next(appError(401, `追蹤對象 ${req.params.id} 已加入過`, next));

      handleSuccess(res, { message: `您已成功將 ${req.params.id} 加入追蹤！` });
    }
  }),
  unFollow: handleErrorAsync(async (req, res, next) => {
    if (req.params.id === req.user.id)
      return next(appError(401, '您無法取消追蹤自己', next));

    const checkFollowUser = await User.find({
      _id: req.params.id,
    });
    if (checkFollowUser.length === 0) {
      return appError(401, `${req.params.id} 無此 user ID`, next);
    } else {
      const following = await User.updateOne(
        {
          _id: req.user.id,
        },
        {
          $pull: { following: { userData: req.params.id } },
        }
      );
      // 有更新 modifiedCount: 1, / 沒更新 modifiedCount: 0,
      if (following.modifiedCount == 0)
        return next(
          appError(401, `追蹤對象 ${req.params.id} 不在列表中`, next)
        );

      const followers = await User.updateOne(
        {
          _id: req.params.id,
        },
        {
          $pull: { followers: { userData: req.user.id } },
        }
      );
      // 有更新 modifiedCount: 1, / 沒更新 modifiedCount: 0,
      if (followers.modifiedCount == 0)
        return next(
          appError(401, `追蹤對象 ${req.params.id} 不在列表中`, next)
        );

      handleSuccess(res, { message: `您已成功將 ${req.params.id} 取消追蹤！` });
    }
  }),
  getUserFollow: handleErrorAsync(async (req, res, next) => {
    const userId = req.user.id;
    const findUserData = await User.findById(userId);
    const followings = findUserData.following;
    handleSuccess(res, followings);
  }),
  getMyLikeList: handleErrorAsync(async (req, res, next) => {
    const userId = req.user.id;
    if (!userId || userId === '')
      return next(appError(400, '未帶入 user id 或其他錯誤', next));
    const myClickLikePosts = await Posts.find({ likes: { $in: [userId] } })
      .populate({
        path: 'userData',
        select: 'userName avatarUrl email',
      })
      .populate({
        path: 'likes',
        select: 'userName avatarUrl',
      });
    handleSuccess(res, myClickLikePosts);
  }),
};
