var express = require('express');
var router = express.Router();
const User = require("../model/user.js");

const handleSuccess = require('../handStates/handleSuccess');
const handleError = require('../handStates/handleError');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post("/", async (req, res) => {
  /** #swagger.tags = ['users (使用者)']
    *? #swagger.description = '取得所有使用者資料'
  */
  try {
    const data = req.body;
    const user = {
      userName: data.userName,
      email: data.email,
      password: data.password,
      avatarUrl: data.avatarUrl, // 頭像
    };
    // console.log('user', user);
    await User.create(user).then(async () => {
      const allUser = await User.find();
      handleSuccess(res, allUser);
    });
  } catch (error) {
    console.log("req error", error);
    handleError(res, `POST User 格式錯誤，${error}`);
  }
});

module.exports = router;
