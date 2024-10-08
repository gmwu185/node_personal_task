const bcrypt = require('bcryptjs'); // 密碼加密
const validator = require('validator'); // 格式驗證
const dotenv = require('dotenv');
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const { isAuth, generateSendJWT } = require('../../middlewares/auth');
const { handleSuccess } = require('../../handStates/handles');
const handleErrorAsync = require('../../handStates/handleErrorAsync');
const appError = require('../../customErr/appError');

const mongoose = require('mongoose');
const User = require('../../model/users');
const Posts = require('../../model/posts');

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
    let { newPassword, confirmNewPassword } = req.body;
    const errorMessageArr = [];

    if (!newPassword) {
      newPassword = '';
    }
    if (newPassword == '') {
      errorMessageArr.push('密碼為空字串或未帶入');
    }
    if (newPassword !== confirmNewPassword) {
      errorMessageArr.push('密碼不一致');
    }
    if (!validator.isLength(newPassword, { min: 8 })) {
      errorMessageArr.push('密碼長度必須超過 8 碼');
    }
    if (validator.isNumeric(newPassword) || validator.isAlpha(newPassword)) {
      errorMessageArr.push('密碼需英數混合');
    }
    if (errorMessageArr.length > 0)
      return appError('400', errorMessageArr.join(', '), next);

    bcryptNewPassword = await bcrypt.hash(newPassword, 12);
    const updateUser = await User.findByIdAndUpdate(
      req.userID,
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
    const { queryUser } = req.query;
    
    const findOneObj = {};
    // 如果沒由網址傳入 queryUser (userID) 那就使用登入者的 userID
    queryUser
      ? (findOneObj._id = queryUser)
      : (findOneObj._id = req.userID);
    
    if (!req.userID) return appError(400, 'user 資訊未帶入', next);
    if (!mongoose.isObjectIdOrHexString(findOneObj._id))
      return appError(400, `${findOneObj._id} 無效 id`, next);

    const findUser = await User.findOne(findOneObj);
    const { gender, _id, userName, email, avatarUrl } = findUser;
    const userObj = { gender, _id, userName, email, avatarUrl };
    handleSuccess(res, userObj);
  }),
  patchProfile: handleErrorAsync(async (req, res, next) => {
    const { userName, avatarUrl, gender } = req.body;
    const patchData = { userName, avatarUrl, gender };
    if (!userName) return appError(400, 'userName 名稱必填', next);
    if (userName.length < 2)
      return appError('400', '暱稱至少 2 個字元以上', next);
    const profileUser = await User.findByIdAndUpdate(req.userID, patchData, {
      new: true,
      select: 'userName avatarUrl gender email',
      returnDocument: 'after',
    }).catch((err) => appError(400, '輸入欄位資料有錯誤', next));
    handleSuccess(res, profileUser);
  }),
  addFollow: handleErrorAsync(async (req, res, next) => {
    if (req.params.id === req.userID)
      return next(appError(401, '您無法追蹤自己', next));

    const checkFollowUser = await User.findOne({
      _id: req.params.id,
    });
    console.log('checkFollowUser.userName', checkFollowUser.userName);
    
    if (!checkFollowUser) {
      return appError(401, `${req.params.id} 無此 user ID`, next);
    } else {
      const following = await User.updateOne(
        {
          _id: req.userID,
          'following.userData': { $ne: req.params.id },
        },
        {
          $addToSet: { following: { userData: req.params.id } },
        }
      );
      // 有更新 modifiedCount: 1 / 沒更新 modifiedCount: 0
      if (following.modifiedCount == 0)
        return next(appError(401, `正在追蹤 ${checkFollowUser.userName} 已加入過`, next));

      const followers = await User.updateOne(
        {
          _id: req.params.id,
          'followers.userData': { $ne: req.userID },
        },
        {
          $addToSet: { followers: { userData: req.userID } },
        }
      );
      // 有更新 modifiedCount: 1 / 沒更新 modifiedCount: 0
      if (followers.modifiedCount == 0)
        return next(appError(401, `追蹤對象 ${checkFollowUser.userName} 已加入過`, next));

      handleSuccess(res, { message: `您已成功將 ${checkFollowUser.userName} 加入追蹤！` });
    }
  }),
  unFollow: handleErrorAsync(async (req, res, next) => {
    if (req.params.id === req.userID)
      return next(appError(401, '您無法取消追蹤自己', next));

    const checkFollowUser = await User.findOne({
      _id: req.params.id,
    });
    if (!checkFollowUser) {
      return appError(401, `${req.params.id} 無此 user ID`, next);
    } else {
      const following = await User.updateOne(
        {
          _id: req.userID,
        },
        {
          $pull: { following: { userData: req.params.id } },
        }
      );
      // 有更新 modifiedCount: 1, / 沒更新 modifiedCount: 0,
      if (following.modifiedCount == 0)
        return next(
          appError(401, `追蹤對象不在列表中`, next)
        );

      const followers = await User.updateOne(
        {
          _id: req.params.id,
        },
        {
          $pull: { followers: { userData: req.userID } },
        }
      );
      // 有更新 modifiedCount: 1, / 沒更新 modifiedCount: 0,
      if (followers.modifiedCount == 0)
        return next(
          appError(401, `追蹤對象不在列表中`, next)
        );

      handleSuccess(res, { message: `您已成功將 ${checkFollowUser.userName} 取消追蹤！` });
    }
  }),
  getUserFollow: handleErrorAsync(async (req, res, next) => {
    const userId = req.userID;
    const findUserData = await User.findById(userId);
    const followings = findUserData.following;
    handleSuccess(res, followings);
  }),
  getMyLikeList: handleErrorAsync(async (req, res, next) => {
    const userId = req.userID;
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
